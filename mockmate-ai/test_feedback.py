import os
import google.generativeai as genai
from dotenv import load_dotenv
import json

backend_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(backend_dir, 'backend', '.env')
load_dotenv(env_path)

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

model = genai.GenerativeModel('gemini-2.5-flash')

from backend.utils.gemini_helper import get_feedback

print("Testing get_feedback with 'What is React?' and 'React is a frontend JS framework'...")
feedback_json = get_feedback("What is React?", "React is a frontend JS framework")

print("\n--- Raw Feedback Response ---")
print(feedback_json)
print("------------------------------")

try:
    data = json.loads(feedback_json)
    print("SUCCESS: Response is valid JSON!")
    print(json.dumps(data, indent=2))
except Exception as e:
    print(f"FAILED to parse JSON: {e}")
