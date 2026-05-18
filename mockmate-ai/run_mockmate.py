import subprocess
import os
import sys

def run_project():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, 'backend')

    print("Launching Unified MockMate AI Platform...")
    print("SaaS Aesthetic: Linear / Vercel / Stripe inspired")
    print("Access at: http://localhost:5000")
    print("\nStarting Flask Server...")

    try:
        subprocess.run(
            [sys.executable, 'app.py'],
            cwd=backend_dir,
            shell=True
        )
    except KeyboardInterrupt:
        print("\nStopping MockMate AI...")
        print("Goodbye!")

if __name__ == "__main__":
    run_project()
