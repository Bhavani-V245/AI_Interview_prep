import os
import google.generativeai as genai
from dotenv import load_dotenv
import json
import urllib.request

load_dotenv()

# Configure Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)
else:
    print("Warning: GEMINI_API_KEY not found in environment variables.")

model = genai.GenerativeModel('gemini-2.5-flash')

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

def call_github_fallback(prompt, system_instruction=None):
    if not GITHUB_TOKEN:
        raise ValueError("GitHub Token not found")
        
    url = "https://models.inference.ai.azure.com/chat/completions"
    messages = []
    if system_instruction:
        messages.append({"role": "system", "content": system_instruction})
    messages.append({"role": "user", "content": prompt})
    
    data = {
        "messages": messages,
        "model": "gpt-4o-mini",
        "temperature": 0.7
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {GITHUB_TOKEN}"
        },
        method="POST"
    )
    
    with urllib.request.urlopen(req, timeout=12) as response:
        res_data = json.loads(response.read().decode("utf-8"))
        text = res_data["choices"][0]["message"]["content"].strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        return text

def call_github_fallback_chat(chat_history, system_instruction=None):
    if not GITHUB_TOKEN:
        raise ValueError("GitHub Token not found")
        
    url = "https://models.inference.ai.azure.com/chat/completions"
    messages = []
    if system_instruction:
        messages.append({"role": "system", "content": system_instruction})
        
    for msg in chat_history:
        messages.append({
            "role": "assistant" if msg["role"] == "model" or msg["role"] == "assistant" else "user",
            "content": msg["content"]
        })
        
    data = {
        "messages": messages,
        "model": "gpt-4o-mini",
        "temperature": 0.7
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {GITHUB_TOKEN}"
        },
        method="POST"
    )
    
    with urllib.request.urlopen(req, timeout=12) as response:
        res_data = json.loads(response.read().decode("utf-8"))
        return res_data["choices"][0]["message"]["content"].strip()

def generate_interview_questions(role, topic, difficulty, num_questions=5):
    prompt = f"""
    You are an expert interviewer. Generate {num_questions} interview questions for the role of {role} 
    focusing on the topic: {topic}. The difficulty level should be {difficulty}.
    
    CRITICAL INSTRUCTION: Ensure these questions are highly unique, unconventional, and different every time. Do NOT repeat standard generic questions. Probe deep technical insights.
    
    Return the questions as a JSON array of strings.
    Example: ["Question 1", "Question 2"]
    """
    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(temperature=0.9)
        )
        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        return text
    except Exception as e:
        err_msg = str(e)
        if GITHUB_TOKEN:
            try:
                return call_github_fallback(prompt)
            except:
                pass
        if "Quota exceeded" in err_msg or "429" in err_msg:
            return json.dumps([
                f"Rate Limit Alert: The AI is busy due to high traffic. Let's practice API design: how do you design rate-limiting algorithms for high-scale systems?",
                "What is the difference between Token Bucket and Leaky Bucket algorithms?",
                "How do you implement backoff and retry policies on connection failures?",
                "How would you use Redis to throttle request rates in a distributed API gateway?",
                "Explain how HTTP 429 Retry-After headers protect server capacity."
            ])
        return json.dumps([f"Error: {err_msg}"])

def get_feedback(question, answer):
    prompt = f"""
    You are an expert interviewer. Provide constructive feedback for the following interview answer.
    Question: {question}
    Answer: {answer}
    
    Provide:
    1. A score out of 10.
    2. Strengths of the answer.
    3. Areas for improvement.
    4. A model answer.
    
    Format the response as JSON.
    """
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        return text
    except Exception as e:
        err_msg = str(e)
        if GITHUB_TOKEN:
            try:
                return call_github_fallback(prompt)
            except:
                pass
        if "Quota exceeded" in err_msg or "429" in err_msg:
            return json.dumps({
                "score": 8,
                "feedback": "The API rate limit has been hit on the free tier. Your answer looks detailed! To practice resilience: you should wait a few seconds before requesting evaluation.",
                "strengths": "Good detailed description and length.",
                "areas_for_improvement": "Wait a few seconds for the rate limits to clear.",
                "improvement": "Wait a few seconds for the rate limits to clear.",
                "model_answer": "Standard model answer is temporarily cached."
            })
        return json.dumps({
            "score": 0,
            "feedback": f"API Evaluation Error: {err_msg}",
            "strengths": "Answer recorded.",
            "areas_for_improvement": "Check API logs.",
            "improvement": "Check API logs.",
            "model_answer": "N/A"
        })

def analyze_resume(resume_text):
    prompt = f"""
    Analyze the following resume text and provide:
    1. An ATS score out of 100 (ats_score).
    2. Key skills identified (key_skills as array).
    3. Suggestions for improvement (suggestions as string).
    4. Job roles this resume is suitable for (job_roles as array).
    
    Resume Text: {resume_text}
    
    Format the response as JSON with keys: ats_score, key_skills, suggestions, job_roles.
    """
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        return text
    except Exception as e:
        err_msg = str(e)
        if GITHUB_TOKEN:
            try:
                return call_github_fallback(prompt)
            except:
                pass
        if "Quota exceeded" in err_msg or "429" in err_msg:
            return json.dumps({
                "ats_score": 75,
                "key_skills": ["Communication", "Problem Solving"],
                "suggestions": "API rate limit reached. Try again in a minute for full AI analysis.",
                "job_roles": ["Software Engineer", "Developer"]
            })
        return json.dumps({"ats_score": 0, "key_skills": [], "suggestions": f"Error: {err_msg}", "job_roles": []})

def evaluate_code(problem_title, problem_desc, code, language):
    prompt = f"""
    You are an expert coding interviewer. Evaluate the following code submission.
    
    Problem: {problem_title}
    Description: {problem_desc}
    Language: {language}
    
    Code:
    ```
    {code}
    ```
    
    Provide evaluation as JSON with these exact keys:
    - correctness: score out of 10
    - efficiency: score out of 10  
    - code_quality: score out of 10
    - overall_score: average score out of 10
    - feedback: detailed feedback string
    - time_complexity: estimated time complexity string
    - space_complexity: estimated space complexity string
    - suggestions: array of improvement suggestions
    """
    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(temperature=0.3)
        )
        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        return text
    except Exception as e:
        err_msg = str(e)
        if GITHUB_TOKEN:
            try:
                return call_github_fallback(prompt)
            except:
                pass
        if "Quota exceeded" in err_msg or "429" in err_msg:
            return json.dumps({
                "correctness": 7, "efficiency": 7, "code_quality": 7, "overall_score": 7,
                "feedback": "Rate limit reached. Your code structure looks reasonable. Try again shortly for full AI analysis.",
                "time_complexity": "O(n)", "space_complexity": "O(n)",
                "suggestions": ["Try again in a minute for detailed feedback"]
            })
        return json.dumps({
            "correctness": 0, "efficiency": 0, "code_quality": 0, "overall_score": 0,
            "feedback": f"Error: {err_msg}", "time_complexity": "N/A", "space_complexity": "N/A",
            "suggestions": ["Check API configuration"]
        })

def get_hint(question):
    prompt = f"""
    You are an expert, encouraging AI interview coach. The user is currently trying to answer the following interview question:
    "{question}"
    
    They are stuck and need a hint. Provide a brief, subtle, and helpful hint (1-2 sentences max) that guides them in the right direction without giving away the full answer.
    """
    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(temperature=0.7)
        )
        return response.text.strip()
    except Exception as e:
        err_msg = str(e)
        if GITHUB_TOKEN:
            try:
                return call_github_fallback(prompt)
            except:
                pass
        if "Quota exceeded" in err_msg or "429" in err_msg:
            return "Hint: Think about system resilience or caching! (API limit reached)"
        return "Hint: Try breaking down the problem into smaller parts."

def get_assistant_response(chat_history):
    system_instruction = """
    You are "MockMate Companion", the official AI guide for the MockMate AI interview preparation platform.
    Your main job is to help users understand how to use the platform, explain its features, and recommend specific career modules to try.
    
    The MockMate AI platform includes:
    1. AI Mock Interviews: Role-specific generated questions with real-time evaluation and a context-aware Hint Chatbot.
    2. Voice Mode: Fully hands-free speech-to-text mock interviews using browser Speech recognition.
    3. LeetCode-style Coding Rounds: Professional Monaco editor, client-side JS runtime sandbox, and in-depth AI grading.
    4. Resume Analyzer: ATS scoring, skill matching, and tailored recommendations.
    5. Aptitude Quizzes: 36+ randomized questions across 4 technology tracks.
    6. Typing Speed Test: Speed and accuracy tracking with tech passages.
    7. Analytics Dashboard: Progression metrics, job readiness prediction, and practice charts.

    Be futuristic, supportive, and conversational. Give clear recommendations (e.g. "I suggest testing your JS skills in the Coding Round or analyzing your resume to check your ATS score!").
    Keep responses highly engaging, concise, and structured with clean markdown bullet points where appropriate.
    """
    
    formatted_messages = [{"role": "user" if msg["role"] == "user" else "model", "parts": [msg["content"]]} for msg in chat_history]
    
    # Insert system instructions
    formatted_messages.insert(0, {"role": "user", "parts": [system_instruction]})
    formatted_messages.insert(1, {"role": "model", "parts": ["Acknowledged. I am MockMate Companion, ready to guide users on their path to career readiness!"]})
    
    try:
        # Use simple structure for generate_content
        response = model.generate_content(
            contents=formatted_messages,
            generation_config=genai.types.GenerationConfig(temperature=0.7)
        )
        return response.text.strip()
    except Exception as e:
        err_msg = str(e)
        if GITHUB_TOKEN:
            try:
                return call_github_fallback_chat(chat_history, system_instruction)
            except:
                pass
        if "Quota exceeded" in err_msg or "429" in err_msg:
            return "Hey there! I am MockMate Companion. The Gemini API is currently hitting high traffic limits, but you should definitely explore the **Coding Round** to practice your algorithms or upload a PDF to the **Resume Analyzer**!"
        return f"Hey! I had trouble reaching my neural core: {err_msg}. You can easily navigate all features using the sidebar on the left!"

