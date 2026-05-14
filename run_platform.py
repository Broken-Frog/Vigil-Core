import os
import subprocess
import sys

def run():
    print("Starting VigilCore Forensics Platform...")
    
    # Check if frontend/dist exists
    frontend_dist = os.path.join(os.getcwd(), 'frontend', 'dist')
    if not os.path.exists(frontend_dist):
        print("Building frontend...")
        subprocess.run(['npm', 'run', 'build'], cwd='frontend', shell=True)
    
    # Run Flask backend
    print("Launching backend...")
    
    # Important: Change dir to cyart_ui so app.py can find templates/static relatively
    os.chdir('cyart_ui')
    
    # Use the same python executable to run the backend
    try:
        subprocess.run([sys.executable, 'app.py'])
    except KeyboardInterrupt:
        print("\nPlatform stopped.")

if __name__ == '__main__':
    run()
