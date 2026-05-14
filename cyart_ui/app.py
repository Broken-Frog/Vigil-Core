import os
import json
import glob
import threading
import subprocess
import shutil
from flask import Flask, render_template, redirect, url_for, request, flash, jsonify, send_from_directory
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from models import db, User, History
from datetime import datetime
import mimetypes
import time

mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(os.path.dirname(BASE_DIR), 'frontend', 'dist')

app = Flask(__name__, 
            static_folder=FRONTEND_DIR, 
            static_url_path='/static')
# template_folder is also FRONTEND_DIR to find index.html
app.template_folder = FRONTEND_DIR
app.config['SECRET_KEY'] = 'cyart-super-secret-key-2026'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024 * 1024

db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))

# --- Global Logging Setup ---
LOG_DIR = os.path.join(BASE_DIR, 'platform_logs')
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

def log_activity(msg):
    log_fp = os.path.join(LOG_DIR, 'audit_activity.log')
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    # Safely handle current_user outside of request context
    user_str = "System"
    try:
        from flask import has_request_context
        if has_request_context() and current_user.is_authenticated:
            user_str = f"User: {current_user.username}"
    except:
        pass
        
    try:
        with open(log_fp, 'a') as f:
            f.write(f"[{timestamp}] [{user_str}] {msg}\n")
    except:
        pass

def log_crash(error_type, error_msg):
    log_fp = os.path.join(LOG_DIR, 'critical_errors.log')
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    try:
        with open(log_fp, 'a') as f:
            f.write(f"[{timestamp}] [CRASH] [{error_type}] {error_msg}\n")
    except:
        pass

@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({'error': 'Unauthorized. Please login first.'}), 401

# --- Routes ---

@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        password=generate_password_hash(data['password'], method='scrypt')
    )
    db.session.add(user)
    db.session.commit()
    log_activity(f"New user registered: {data['email']}")
    return jsonify({'message': 'User created successfully'})

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.password, data['password']):
        login_user(user)
        log_activity(f"User logged in: {data['email']}")
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email
        })
    
    log_activity(f"Failed login attempt for: {data.get('email')}")
    return jsonify({'error': 'Invalid email or password'}), 401

@app.route('/api/logout')
@login_required
def api_logout():
    log_activity(f"User logged out: {current_user.email}")
    logout_user()
    return jsonify({'message': 'Logged out successfully'})
# --- Background Task Runners ---

def run_netforensicx(history_id, file_path):
    with app.app_context():
        history = History.query.get(history_id)
        if not history: return
        history.status = 'running'
        db.session.commit()
        
        log_activity(f"Started Network Analysis: Task ID {history_id} for {os.path.basename(file_path)}")
        log_file_path = os.path.join(LOG_DIR, f'network_{history_id}.log')
        
        try:
            # Backend path
            backend_dir = os.path.join(os.path.dirname(BASE_DIR), 'NetForensicX')
            main_script = os.path.join(backend_dir, 'main.py')
            
            with open(log_file_path, 'w') as log_file:
                # Execute subprocess
                process = subprocess.Popen(
                    [os.sys.executable, main_script, file_path],
                    cwd=backend_dir,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    bufsize=1
                )
                
                output_log = ""
                last_db_update = time.time()
                for line in process.stdout:
                    output_log += line
                    log_file.write(line)
                    log_file.flush()
                    
                    # Update DB every 2 seconds instead of every 5 lines
                    if time.time() - last_db_update > 2.0:
                        history.log_output = output_log
                        db.session.commit()
                        last_db_update = time.time()
                
                process.wait()
                
                history.log_output = output_log
                if process.returncode == 0:
                    history.status = 'completed'
                    log_activity(f"Network Analysis Completed: Task ID {history_id}")
                else:
                    history.status = 'failed'
                    log_activity(f"Network Analysis Failed: Task ID {history_id} (Exit Code {process.returncode})")
                    log_crash("NetworkPipeline", f"Task ID {history_id} failed with exit code {process.returncode}")
                
        except Exception as e:
            history.log_output = str(e)
            history.status = 'failed'
        finally:
            db.session.commit()

def run_cyart_malware(history_id, file_path, original_filename):
    with app.app_context():
        history = History.query.get(history_id)
        if not history: return
        history.status = 'running'
        db.session.commit()
        
        log_activity(f"Started Malware Analysis: Task ID {history_id} for {os.path.basename(file_path)}")
        log_file_path = os.path.join(LOG_DIR, f'malware_{history_id}.log')
        
        try:
            # Backend path
            backend_dir = os.path.join(os.path.dirname(BASE_DIR), 'cyart_malware')
            samples_dir = os.path.join(backend_dir, 'samples')
            reports_dir = os.path.join(backend_dir, 'reports')
            
            # Clear samples directory first
            if os.path.exists(samples_dir):
                for f in os.listdir(samples_dir):
                    f_path = os.path.join(samples_dir, f)
                    if os.path.isfile(f_path):
                        os.unlink(f_path)
            else:
                os.makedirs(samples_dir)
                
            # Copy uploaded file to samples directory
            target_path = os.path.join(samples_dir, original_filename)
            shutil.copy2(file_path, target_path)
            
            output_log = "--- Starting Cyart Malware Analysis Pipeline ---\n"
            scripts = [
                [os.sys.executable, 'dump_validator.py'],
                [os.sys.executable, 'region_scanner.py'],
                [os.sys.executable, 'payload_extractor.py', f"samples/{original_filename}", "reports/raw_entropy_report.json"],
                [os.sys.executable, 'ioc_extractor.py'],
                [os.sys.executable, 'report_generator.py']
            ]
            
            with open(log_file_path, 'w') as log_file:
                log_file.write(output_log)
                log_file.flush()
                
                success = True
                for cmd in scripts:
                    msg = f"\n>>> Running: {' '.join(cmd)}\n"
                    output_log += msg
                    log_file.write(msg)
                    log_file.flush()
                    
                    history.log_output = output_log
                    db.session.commit()

                    process = subprocess.Popen(
                        cmd,
                        cwd=backend_dir,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.STDOUT,
                        text=True,
                        bufsize=1
                    )
                    
                    line_count = 0
                    last_db_update = time.time()
                    for line in process.stdout:
                        output_log += line
                        log_file.write(line)
                        log_file.flush()
                        
                        # Update DB every 2 seconds
                        if time.time() - last_db_update > 2.0:
                            history.log_output = output_log
                            db.session.commit()
                            last_db_update = time.time()
                    
                    process.wait()
                    
                    if process.returncode != 0:
                        err_msg = f"\n>>> ERROR: Command failed with exit code {process.returncode}\n"
                        output_log += err_msg
                        log_file.write(err_msg)
                        log_file.flush()
                        success = False
                        history.log_output = output_log
                        db.session.commit()
                        break
            
            history.log_output = output_log
            if success:
                history.status = 'completed'
                log_activity(f"Malware Analysis Completed: Task ID {history_id}")
            else:
                history.status = 'failed'
                log_activity(f"Malware Analysis Failed: Task ID {history_id}")
                log_crash("MalwarePipeline", f"Task ID {history_id} failed during script execution.")
            if success:
                history.status = 'completed'
            else:
                history.status = 'failed'
                
        except Exception as e:
            history.log_output = str(e)
            history.status = 'failed'
        finally:
            db.session.commit()

# --- Routes ---

@app.route('/assets/<path:path>')
def redirect_assets(path):
    return redirect(url_for('static', filename='assets/' + path))

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # This serves the React SPA index.html for any non-static route
    return render_template('index.html')

# (Removing old index, login, register, etc. routes as they are now handled by React)

@app.route('/api/upload', methods=['POST'])
@login_required
def api_upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    filename = secure_filename(file.filename)
    # Append timestamp to filename to avoid collisions
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    unique_filename = f"{timestamp}_{filename}"
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(file_path)
    
    log_activity(f"File uploaded: {filename} (Stored as: {unique_filename})")
    
    return jsonify({
        'filename': unique_filename,
        'original_name': filename,
        'path': file_path
    })
@app.route('/api/scan/malware', methods=['POST'])
@login_required
def api_scan_malware():
    data = request.json
    file_path = data.get('file_path')
    original_name = data.get('original_name')
    
    if not file_path or not os.path.exists(file_path):
        return jsonify({'error': 'Invalid file path'}), 400
        
    history = History(
        user_id=current_user.id,
        analysis_type='malware',
        file_name=original_name,
        status='pending'
    )
    db.session.add(history)
    db.session.commit()
    
    # Run in background
    thread = threading.Thread(target=run_cyart_malware, args=(history.id, file_path, original_name))
    thread.start()
    
    log_activity(f"Initiated Malware Scan for: {original_name}")
    return jsonify({'task_id': history.id, 'status': 'pending'})

@app.route('/api/scan/network', methods=['POST'])
@login_required
def api_scan_network():
    data = request.json
    file_path = data.get('file_path')
    original_name = data.get('original_name')
    
    if not file_path or not os.path.exists(file_path):
        return jsonify({'error': 'Invalid file path'}), 400
        
    history = History(
        user_id=current_user.id,
        analysis_type='network',
        file_name=original_name,
        status='pending'
    )
    db.session.add(history)
    db.session.commit()
    
    log_activity(f"Initiated Network Scan for: {original_name}")
    # Run in background
    thread = threading.Thread(target=run_netforensicx, args=(history.id, file_path))
    thread.start()
    
    return jsonify({'task_id': history.id, 'status': 'pending'})

@app.route('/api/status/<int:history_id>')
@login_required
def api_status(history_id):
    history = History.query.get_or_404(history_id)
    if history.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    return jsonify({
        'id': history.id,
        'status': history.status,
        'type': history.analysis_type,
        'file_name': history.file_name,
        'created_at': history.created_at.isoformat(),
        'log_output': history.log_output
    })

# ==========================================================
# READ-ONLY API: Serve report data to frontend (no backend changes)
# ==========================================================

NETFORENSICX_OUTPUT = os.path.join(os.path.dirname(BASE_DIR), 'NetForensicX', 'phase2_output')
MALWARE_REPORTS = os.path.join(os.path.dirname(BASE_DIR), 'cyart_malware', 'reports')

def _load_json(fp):
    try:
        with open(fp) as f: return json.load(f)
    except: return None

def _load_text(fp):
    try:
        with open(fp) as f: return f.read()
    except: return None

@app.route('/api/netforensicx/runs')
@login_required
def api_net_runs():
    runs = []
    if os.path.exists(NETFORENSICX_OUTPUT):
        for d in sorted(os.listdir(NETFORENSICX_OUTPUT), reverse=True):
            if os.path.isdir(os.path.join(NETFORENSICX_OUTPUT, d)):
                runs.append({'name': d, 'files': os.listdir(os.path.join(NETFORENSICX_OUTPUT, d))})
    return jsonify(runs)

@app.route('/api/netforensicx/run/<path:run_name>/<artifact>')
@login_required
def api_net_artifact(run_name, artifact):
    fp = os.path.join(NETFORENSICX_OUTPUT, run_name, artifact)
    if not os.path.exists(fp): return jsonify({'error': 'Not found'}), 404
    if artifact.endswith('.json'):
        d = _load_json(fp)
        return jsonify(d) if d is not None else (jsonify({'error': 'Parse error'}), 500)
    return jsonify({'content': _load_text(fp) or ''})

@app.route('/api/malware/reports')
@login_required
def api_mal_reports():
    files = []
    if os.path.exists(MALWARE_REPORTS):
        for f in os.listdir(MALWARE_REPORTS):
            fp = os.path.join(MALWARE_REPORTS, f)
            if os.path.isfile(fp):
                files.append({'name': f, 'size': os.path.getsize(fp)})
    return jsonify(files)

@app.route('/api/malware/report/<filename>')
@login_required
def api_mal_report(filename):
    fp = os.path.join(MALWARE_REPORTS, filename)
    if not os.path.exists(fp): return jsonify({'error': 'Not found'}), 404
    if filename.endswith('.json'):
        d = _load_json(fp)
        return jsonify(d) if d is not None else (jsonify({'error': 'Parse error'}), 500)
    return jsonify({'content': _load_text(fp) or ''})

# --- Consolidated Endpoints for Frontend "WOW" Experience ---

@app.route('/api/netforensicx/latest_result')
@login_required
def api_net_latest():
    if not os.path.exists(NETFORENSICX_OUTPUT):
        return jsonify({'error': 'No output directory'}), 404
    
    dirs = [os.path.join(NETFORENSICX_OUTPUT, d) for d in os.listdir(NETFORENSICX_OUTPUT) if os.path.isdir(os.path.join(NETFORENSICX_OUTPUT, d))]
    if not dirs:
        return jsonify({'error': 'No runs found'}), 404
    
    # Sort by directory modification time (latest first)
    dirs.sort(key=lambda x: os.path.getmtime(x), reverse=True)
    base_path = dirs[0]
    run_name = os.path.basename(base_path)
    
    result = {
        'run_name': run_name,
        'attack_story': _load_text(os.path.join(base_path, 'attack_story.txt')),
        'host_profiles': _load_json(os.path.join(base_path, 'host_profiles.json')),
        'incidents': _load_json(os.path.join(base_path, 'incidents_correlated.json')),
        'stats': _load_json(os.path.join(base_path, 'run_stats.json')),
        'timeline': _load_json(os.path.join(base_path, 'attack_timeline.json'))
    }
    return jsonify(result)

@app.route('/api/malware/latest_result')
@login_required
def api_mal_latest():
    if not os.path.exists(MALWARE_REPORTS):
        return jsonify({'error': 'No output directory'}), 404
    
    # Load all forensic components
    stats = _load_json(os.path.join(MALWARE_REPORTS, 'ioc_master_report.json')) or {}
    entropy = _load_json(os.path.join(MALWARE_REPORTS, 'raw_entropy_report.json')) or {}
    validation = _load_json(os.path.join(MALWARE_REPORTS, 'validation_report.json')) or {}
    payloads = _load_json(os.path.join(MALWARE_REPORTS, 'payload_extraction_report.json')) or {}
    
    # Combine YARA hits
    all_yara_findings = []
    sev_counts = {'critical': 0, 'high': 0, 'medium': 0, 'low': 0, 'unknown': 0}
    cat_counts = {}

    # 1. Validation Report YARA Hits
    for hit in validation.get('yara_hits', []):
        meta = hit.get('meta', {})
        sev = meta.get('severity', 'unknown').lower()
        cat = meta.get('category', 'generic').lower()
        
        all_yara_findings.append({
            'rule': hit.get('rule', 'Unknown Rule'),
            'severity': sev,
            'category': cat,
            'payload': 'Primary File'
        })
        
        sev_counts[sev] = sev_counts.get(sev, 0) + 1
        cat_counts[cat] = cat_counts.get(cat, 0) + 1

    # 2. Payload Report YARA Hits
    payload_yara = payloads.get('full_yara_results', {}).get('findings', [])
    for hit in payload_yara:
        sev = hit.get('severity', 'unknown').lower()
        cat = hit.get('category', 'generic').lower()
        
        all_yara_findings.append({
            'rule': hit.get('rule', 'Unknown Rule'),
            'severity': sev,
            'category': cat,
            'payload': hit.get('payload', 'Extracted Payload')
        })
        
        sev_counts[sev] = sev_counts.get(sev, 0) + 1
        cat_counts[cat] = cat_counts.get(cat, 0) + 1

    # Advanced Risk Scoring
    risk_score = 0
    risk_score += sev_counts.get('critical', 0) * 40
    risk_score += sev_counts.get('high', 0) * 20
    risk_score += sev_counts.get('medium', 0) * 10
    risk_score = min(risk_score, 100)
    
    # Format Pie Data
    severity_pie = [
        {'name': k.upper(), 'value': v, 'color': '#ef4444' if k=='critical' else '#f97316' if k=='high' else '#eab308' if k=='medium' else '#22c55e'}
        for k, v in sev_counts.items() if v > 0
    ]
    category_pie = [
        {'name': k.upper(), 'value': v}
        for k, v in cat_counts.items() if v > 0
    ]

    # IOC Totals for Bar Chart
    ioc_totals = stats.get('total_iocs', {})
    ioc_bar = [
        {'name': 'Domains', 'count': ioc_totals.get('domains_extracted', 0)},
        {'name': 'IPs', 'count': ioc_totals.get('ips', 0)},
        {'name': 'URLs', 'count': ioc_totals.get('urls', 0)},
        {'name': 'Emails', 'count': ioc_totals.get('emails', 0)}
    ]

    avg_entropy = entropy.get('entropy_statistics', {}).get('average', 0)
    
    result = {
        'score': risk_score,
        'threatLevel': 'CRITICAL' if risk_score > 85 else 'HIGH' if risk_score > 60 else 'MEDIUM' if risk_score > 30 else 'LOW',
        'fileInfo': {
            'name': validation.get('file_name', 'Unknown Sample'),
            'size': validation.get('size_bytes', 0),
            'entropy': round(avg_entropy, 2),
            'hashes': {
                'md5': validation.get('hashes', {}).get('md5', 'N/A'),
                'sha1': validation.get('hashes', {}).get('sha1', 'N/A'),
                'sha256': validation.get('hashes', {}).get('sha256', 'N/A')
            },
            'type': validation.get('file_info', {}).get('detected_type', 'Binary Data'),
            'timestamp': validation.get('timestamp', datetime.now().isoformat())
        },
        'analytics': {
            'severity_pie': severity_pie,
            'category_pie': category_pie,
            'ioc_bar': ioc_bar,
            'yara_findings': all_yara_findings
        },
        'iocs': {
            'domains': stats.get('unique_iocs', {}).get('domains', []),
            'ips': stats.get('unique_iocs', {}).get('ips', [])
        },
        'entropy_map': [
            {'offset': r['offset_hex'], 'entropy': r['entropy']} 
            for r in entropy.get('regions', [])[:20]
        ]
    }
    return jsonify(result)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True, port=5000, host='0.0.0.0')
