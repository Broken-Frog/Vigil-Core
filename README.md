# VigilCore Forensics Platform

**VigilCore** is an enterprise-grade, comprehensive cybersecurity analysis platform featuring high-fidelity Network and Malware Forensic pipelines. Designed for Security Operations Centers (SOC) and Incident Response teams, it provides real-time threat detection, advanced telemetry correlation, and professional intelligence-driven dashboards.

## 🚀 Key Features

### 1. Malware Forensics Pipeline (CyArt Malware)
A deeply optimized, multi-stage static and dynamic analysis engine for binaries, scripts, and memory dumps.
* **Smart Domain Reputation Engine**: Extracts network IOCs and scores them using heuristics and entropy analysis in milliseconds.
* **Integrated Threat Intelligence**: Automatically cross-references suspicious artifacts with **AlienVault OTX**, **AbuseIPDB**, and **MalwareBazaar**.
* **Redis Caching Layer**: Ensures O(1) instantaneous lookups for previously analyzed IPs, hashes, and domains, drastically reducing API rate limits and dropping scan times from hours to minutes.
* **YARA Rule Integration**: Performs both full-file validation and deep carved payload scanning against massive sets of enterprise YARA signatures.
* **Payload Extraction**: Dynamically carves hidden executables, shellcode stubs, and encrypted regions from larger dumps.

### 2. Network Forensics Pipeline (NetForensicX)
A massive-scale PCAP analysis engine capable of processing 20GB+ capture files natively.
* **Deep Packet Inspection**: Leverages Zeek and Suricata rulesets to reconstruct encrypted traffic flows, fingerprint JA3 SSL/TLS anomalies, and detect multi-protocol brute-forcing.
* **SQLite-Backed State Management**: Streams large-scale data using chunked generators, preventing RAM overflow and system crashes.
* **Attack Narrative Generation**: Correlates disparate network events into a cohesive, human-readable Cyber Kill Chain "Attack Story".

### 3. Unified SOC Dashboard (React + Flask)
A professionally designed, highly responsive Command Center.
* **Twin-Pie Analytics**: Visually distributes severity layers and threat categorization in real-time.
* **Real-time Progress Observability**: Binds to Python backend streams to display `tqdm` logs directly in the UI.
* **Hash Lookup Panels**: Provides an immediate overview of SHA-256 and MD5 fingerprints.
* **Responsive React Architecture**: Uses Axios for seamless backend synchronization and robust Error Boundaries for zero-crash UI handling.

---

## 🛠️ Technology Stack
* **Frontend**: React.js, Tailwind CSS, Recharts, Vite (Dynamic UI routing and visualization).
* **Backend**: Python 3, Flask (REST API, Subprocess Management).
* **Forensic Engines**: YARA, Volatility (Memory extraction), Zeek/Suricata (Network).
* **State & Caching**: Redis (Threat Intel caching), SQLite (Large-scale data chunking).

---

## ⚙️ Installation & Execution Plan

### Prerequisites
1. **Python 3.10+** (with `pip` and `venv`)
2. **Node.js 18+** (with `npm` or `yarn`)
3. **Redis Server** (Running locally on default port `6379`)
4. **Git**

### Phase 1: Environment Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vigilcore-platform.git
   cd vigilcore-platform
   ```
2. Set up the Python virtual environment:
   ```bash
   python3 -m venv env
   source env/bin/activate
   pip install -r requirements.txt
   ```
3. Set up the Frontend:
   ```bash
   cd frontend
   npm install
   cd ..
   ```
4. Verify Redis is active:
   ```bash
   sudo systemctl status redis-server
   ```

### Phase 2: Configuration & API Keys
To enable the full Threat Intel Chain across both Network and Malware pipelines, export your API keys in your terminal environment:
```bash
export VT_API_KEY="your_virustotal_key_here"
export OTX_API_KEY="your_alienvault_key_here"
export ABUSEIPDB_API_KEY="your_abuseipdb_key_here"
```
*(Note: MalwareBazaar requires no key and functions automatically. The VT_API_KEY is specifically utilized by the Network Forensics pipeline).*

### Phase 3: Launching the Platform
The platform uses a unified launcher that automatically spins up both the React development server and the Flask backend asynchronously.

```bash
python3 run_platform.py
```
* **Frontend**: `http://localhost:5173`
* **Backend**: `http://localhost:5000`

### Phase 4: Operation
1. Navigate to the **Malware** or **Network** Forensic tabs.
2. Upload a `.mddramimage` memory dump or `.pcap` capture file.
3. The platform will spawn backend subprocesses and dynamically stream logs to the UI.
4. Upon completion, high-fidelity metrics, charts, and YARA/IOC tables will populate automatically.

---

## 🛡️ Architecture & Data Flow
1. **Upload**: React frontend sends multipart-form data to Flask `/api/upload`.
2. **Orchestration**: `app.py` triggers `run_cyart_malware()` or `run_network_pipeline()` via asynchronous subprocesses, tracking PID and logging progress to SQLite (`instance/app.db`).
3. **Analysis**: 
   - *Malware*: `dump_validator.py` -> `region_scanner.py` -> `payload_extractor.py` -> `ioc_extractor.py` -> `report_generator.py`
   - *Network*: Ingests PCAP, streams to SQLite, enriches via Suricata/Zeek logs, applies threat models.
4. **Reporting**: JSON artifacts are securely generated in `./reports/` and fetched via API to hydrate React visual components.

---

## 📜 License
This is an open-source project released under the **MIT License**. You are free to use, modify, and distribute this software for educational, research, and commercial purposes. Contributions and pull requests are highly encouraged!
