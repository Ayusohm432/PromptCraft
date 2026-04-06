import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini with API key from environment variable
api_key = os.environ.get("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

def generate_gemini_response(prompt: str, task_type: str) -> str:
    """
    Connects to the Gemini API to generate a response based on the task type.
    """
    if not api_key:
        return "[ERROR] GEMINI_API_KEY not found in environment variables. Please add it to your .env file."
        
    try:
        model = genai.GenerativeModel('gemini-flash-latest')
        
        # Inject context based on task type
        system_instructions = ""
        if task_type == "Summarization":
            system_instructions = "You are an expert summarizer. Summarize the following text concisely. "
        elif task_type == "Sentiment Analysis":
            system_instructions = "Analyze the sentiment of the following text and state whether it is POSITIVE, NEGATIVE, or NEUTRAL, along with a brief explanation. "
        elif task_type == "Q&A":
            system_instructions = "You are a helpful assistant. Provide a direct and accurate answer to the following question. "
            
        full_prompt = system_instructions + "Prompt: " + prompt
        
        response = model.generate_content(full_prompt)
        return response.text
        
    except Exception as e:
        return f"[ERROR] Failed to generate response from Gemini: {str(e)}"
