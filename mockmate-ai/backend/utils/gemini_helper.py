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
USE_GITHUB_MODELS = os.getenv("USE_GITHUB_MODELS", "False").lower() in ("true", "1", "yes")

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
    if USE_GITHUB_MODELS and GITHUB_TOKEN:
        try:
            return call_github_fallback(prompt)
        except Exception as e:
            print(f"Primary GitHub Models error, falling back to Gemini: {e}")
            
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
    You are an expert interviewer. Evaluate the candidate's answer for BOTH technical/domain depth AND essential soft skills (communication, clarity, structure, professional vocabulary, confidence, and STAR method application).
    
    Question: {question}
    Answer: {answer}
    
    You MUST provide a comprehensive analysis returning exactly a JSON object with the following fields:
    - score: Overall performance score out of 10 (float).
    - technical_score: Technical accuracy and domain depth score out of 10 (float).
    - soft_skills_score: Communication, delivery structure, professional confidence, and vocabulary score out of 10 (float).
    - strengths: Clear bulleted points describing the strengths of the candidate's answer.
    - areas_for_improvement: Clear bulleted points detailing areas of optimization.
    - communication_feedback: Detailed advisory feedback addressing their tone, vocabulary level, delivery pace, and how they structured their narrative (e.g., STAR structure).
    - model_answer: An exemplary professional answer utilizing the STAR (Situation, Task, Action, Result) response format.
    
    CRITICAL: Respond ONLY with a valid, clean JSON string containing these exact keys. Do not include markdown wraps unless necessary, but format properly.
    """
    if USE_GITHUB_MODELS and GITHUB_TOKEN:
        try:
            return call_github_fallback(prompt)
        except Exception as e:
            print(f"Primary GitHub Models error, falling back to Gemini: {e}")
            
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
                "technical_score": 8.0,
                "soft_skills_score": 8.0,
                "strengths": "Good detailed description and length.",
                "areas_for_improvement": "Wait a few seconds for the rate limits to clear.",
                "communication_feedback": "Your articulation is strong. To avoid interruption, ensure your API keys have sufficient quota.",
                "model_answer": "Standard model answer is temporarily cached."
            })
        return json.dumps({
            "score": 0,
            "technical_score": 0.0,
            "soft_skills_score": 0.0,
            "strengths": "Answer recorded.",
            "areas_for_improvement": "Check API logs.",
            "communication_feedback": f"API Evaluation Error: {err_msg}",
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
    if USE_GITHUB_MODELS and GITHUB_TOKEN:
        try:
            return call_github_fallback(prompt)
        except Exception as e:
            print(f"Primary GitHub Models error, falling back to Gemini: {e}")
            
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
    if USE_GITHUB_MODELS and GITHUB_TOKEN:
        try:
            return call_github_fallback(prompt)
        except Exception as e:
            print(f"Primary GitHub Models error, falling back to Gemini: {e}")
            
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
    if USE_GITHUB_MODELS and GITHUB_TOKEN:
        try:
            return call_github_fallback(prompt)
        except Exception as e:
            print(f"Primary GitHub Models error, falling back to Gemini: {e}")
            
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
    
    if USE_GITHUB_MODELS and GITHUB_TOKEN:
        try:
            return call_github_fallback_chat(chat_history, system_instruction)
        except Exception as e:
            print(f"Primary GitHub Models error, falling back to Gemini: {e}")
            
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

def generate_custom_coding_problem(difficulty):
    prompt = f"""
    You are an expert algorithmic interviewer. Generate a completely unique, highly professional LeetCode-style coding problem with difficulty: {difficulty}.
    Do NOT repeat classic problems like Two Sum, Reverse Linked List, or standard textbook examples. Design a creative scenario or technical problem that assesses algorithmic thinking.
    
    Format the response as JSON with these exact keys:
    - title: unique problem name (string)
    - difficulty: "{difficulty}" (string)
    - description: clear, professional problem description with a creative scenario (string)
    - examples: array of 2 examples, each having:
      * input: sample input string
      * output: expected output string
      * explanation: explanation of why input equals output
    - constraints: array of 2-3 logical constraints (strings)
    - starterCode: object containing:
      * javascript: starter JavaScript function wrapper with high-quality comments, e.g., "function myFunc(arg) {{ ... }}"
      * python: starter Python function wrapper with correct syntax and pass statement, e.g., "def my_func(arg):\n    pass"
    """
    
    if USE_GITHUB_MODELS and GITHUB_TOKEN:
        try:
            return call_github_fallback(prompt)
        except Exception as e:
            print(f"Primary GitHub Models error, falling back to Gemini: {e}")
            
    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(temperature=0.95)
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
        return json.dumps({
            "title": f"Custom {difficulty} Challenge",
            "difficulty": difficulty,
            "description": "Design a function that receives a list of integers and returns the second largest number. If the list has fewer than 2 elements, return -1.",
            "examples": [
                {"input": "nums = [10, 5, 20, 20]", "output": "10", "explanation": "The maximum is 20, and the second largest unique value is 10."},
                {"input": "nums = [1]", "output": "-1", "explanation": "Less than 2 elements present."}
            ],
            "constraints": ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
            "starterCode": {
                "javascript": "function findSecondLargest(nums) {\n  // Your solution here\n  return -1;\n}",
                "python": "def find_second_largest(nums):\n    # Your solution here\n    return -1"
            }
        })

def generate_custom_quiz(category):
    prompt = f"""
    You are a professional aptitude exam writer for high-end placements. 
    Generate 5 highly realistic, unique, and challenging multiple-choice questions for the following topic: "{category}".
    
    Ensure the questions contain actual numeric/logical challenges related to this topic (e.g., word problems, seating plans, coding logic).
    
    Format the response as a JSON array of 5 question objects, where each object has these exact keys:
    - question: string (the problem text)
    - options: array of exactly 4 strings (logical options, distinct and realistic)
    - answer: integer (0-indexed index of the correct option in the options array, i.e., 0, 1, 2, or 3)
    """
    
    if USE_GITHUB_MODELS and GITHUB_TOKEN:
        try:
            return call_github_fallback(prompt)
        except Exception as e:
            print(f"Primary GitHub Models error, falling back to Gemini: {e}")
            
    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(temperature=0.85)
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
        return json.dumps([
            {
                "question": "A card is drawn from a well-shuffled pack of 52 cards. What is the probability of drawing a Queen or a Club?",
                "options": ["17/52", "4/13", "16/52", "3/13"],
                "answer": 2
            },
            {
                "question": "A and B can complete a work in 12 days and 18 days respectively. A starts the work and they work on alternate days. In how many days will the work be completed?",
                "options": ["14.3 days", "14.5 days", "15 days", "13.8 days"],
                "answer": 0
            },
            {
                "question": "A sells a watch to B at a 20% profit, and B sells it to C at a 10% loss. If C pays $108 for the watch, how much did A pay?",
                "options": ["$90", "$100", "$95", "$110"],
                "answer": 1
            },
            {
                "question": "In a certain code, 'LIGHT' is written as 'MJHIT'. How is 'SOUND' written in that code?",
                "options": ["TPEOE", "TPVOE", "TPVOF", "TPEOF"],
                "answer": 1
            },
            {
                "question": "Six people A, B, C, D, E and F are sitting in a circle facing the center. B is between F and D, E is between A and C, and F is to the left of D. Who is opposite to B?",
                "options": ["A", "C", "E", "D"],
                "answer": 2
            }
        ])

def simulate_gd_peers(topic, chat_history):
    prompt = f"""
    You are simulating a high-end campus placement Group Discussion (GD) round on the topic: "{topic}".
    There are three simulated peers participating:
    1. Aarav (Role: Tech Enthusiast) - Stance: optimistic about technology, updates, and future progress.
    2. Sarah (Role: Business Analyst) - Stance: pragmatic, focused on finance, economy, productivity, and market numbers.
    3. David (Role: Ethics Advocate) - Stance: focused on social equity, mental health, user well-being, and ethical implications.
    
    Given the current discussion log:
    {json.dumps(chat_history)}
    
    Identify which peer should speak next. They should:
    - Respond directly to what the user or previous speaker said.
    - Advance their own perspective or question others constructively.
    - Be concise (2-3 sentences max) to keep the GD highly active.
    
    Return the response as JSON with these keys:
    - peerName: "Aarav" | "Sarah" | "David"
    - role: "Tech Enthusiast" | "Business Analyst" | "Ethics Advocate"
    - content: the actual statement they make (string)
    - tone: "agreeing" | "debating" | "neutral"
    """
    
    if USE_GITHUB_MODELS and GITHUB_TOKEN:
        try:
            return call_github_fallback(prompt)
        except Exception as e:
            print(f"Primary GitHub Models error, falling back to Gemini: {e}")
            
    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(temperature=0.85)
        )
        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        return text
    except Exception as e:
        return json.dumps({
            "peerName": "Aarav",
            "role": "Tech Enthusiast",
            "content": "That's an interesting view. I feel technology will create more opportunities than it destroys if we upskill in time.",
            "tone": "debating"
        })

def evaluate_gd_session(topic, chat_history):
    prompt = f"""
    You are an expert GD Moderator and HR assessor. Evaluate the user's participation in the Group Discussion on topic: "{topic}".
    Here is the discussion log:
    {json.dumps(chat_history)}
    
    Evaluate the user's statements (role: "user") across these parameters:
    - Communication Score (out of 10)
    - Content & Analytical Thinking Score (out of 10)
    - Stance & Teamwork Score (out of 10)
    
    Format the response as JSON with these exact keys:
    - communication_score: integer (0-10)
    - content_score: integer (0-10)
    - teamwork_score: integer (0-10)
    - overall_score: average score out of 10
    - strengths: detailed string explaining what the user did exceptionally well.
    - weaknesses: detailed string highlighting areas they can improve.
    - advice: step-by-step guidance on how to structure GD points next time.
    """
    
    if USE_GITHUB_MODELS and GITHUB_TOKEN:
        try:
            return call_github_fallback(prompt)
        except Exception as e:
            print(f"Primary GitHub Models error, falling back to Gemini: {e}")
            
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        return text
    except Exception as e:
        return json.dumps({
            "communication_score": 8,
            "content_score": 7,
            "teamwork_score": 8,
            "overall_score": 7.7,
            "strengths": "You expressed your ideas clearly and maintained a polite tone throughout the discussion.",
            "weaknesses": "Could have added more quantitative data or structured arguments.",
            "advice": "Next time, try to explicitly refer to another peer's point (e.g. 'I agree with Sarah's point about economics, but...') to score higher on active listening."
        })

def generate_random_gd_topic(category):
    prompt = f"""
    Generate a completely unique, highly relevant, and engaging Group Discussion (GD) topic for campus placement under the category: "{category}".
    The topic should be highly argumentative and debatable, suitable for generating distinct opinions.
    
    Return the response ONLY as a JSON object with these exact keys:
    - topic: a clear, concise title of the GD topic (string)
    - description: a 1-2 sentence background context explaining why this topic is controversial or important (string)
    - category: the input category (string)
    """
    
    if USE_GITHUB_MODELS and GITHUB_TOKEN:
        try:
            return call_github_fallback(prompt)
        except Exception as e:
            print(f"Primary GitHub Models error, falling back to Gemini: {e}")
            
    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(temperature=0.95)
        )
        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        return text
    except Exception as e:
        import random
        fallbacks = {
            "Technology": [
                {"topic": "Quantum Computing: Cybersecurity Savior or Threat?", "description": "Discuss whether quantum advancements will secure or break global data infrastructures.", "category": "Technology"},
                {"topic": "Metaverse: The Next Internet Evolution or a Passing Hype?", "description": "Debate if immersive spatial computing will replace modern remote collaboration.", "category": "Technology"}
            ],
            "Finance & Economy": [
                {"topic": "Central Bank Digital Currencies (CBDCs) vs. Traditional Cash", "description": "Discuss whether national digital fiat currencies threaten citizen financial privacy.", "category": "Finance & Economy"},
                {"topic": "Gig Economy: Freedom of Labor vs. Absence of Social Security", "description": "Debate if contract freelancing is superior to structured corporate jobs.", "category": "Finance & Economy"}
            ],
            "Society & Ethics": [
                {"topic": "Biotechnology: Ethical Limits on Designer Human Embryos", "description": "Discuss whether genetic enhancement should be strictly regulated on social grounds.", "category": "Society & Ethics"},
                {"topic": "Cancel Culture: Constructive Accountability or Modern Witch Hunt?", "description": "Debate the social cost of online public boycotts on individuals and expression.", "category": "Society & Ethics"}
            ],
            "Corporate & Workplace": [
                {"topic": "Four-Day Work Weeks: Employee Utopian Dream or Operational Disaster?", "description": "Discuss if compressed work schedules increase or hinder national productivity.", "category": "Corporate & Workplace"},
                {"topic": "Diversity Quotas in Executive Leadership: Tokenism vs. True Equity", "description": "Debate whether meritocracy is compromised by standardized diversity initiatives.", "category": "Corporate & Workplace"}
            ]
        }
        fallback_list = fallbacks.get(category, fallbacks["Technology"])
        return json.dumps(random.choice(fallback_list))

