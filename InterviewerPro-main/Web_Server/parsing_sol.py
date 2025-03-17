import os
import fitz  # also known as PyMuPDF
import re
from dotenv import load_dotenv
from llama_parse import LlamaParse
from llama_index.core import SimpleDirectoryReader
from groq import Groq
import json
import nest_asyncio

# give file path at the end 
# creates a text file and formats extracted daat to save it into the text file.

# Load environment variables
load_dotenv()

nest_asyncio.apply()
# Initialize LlamaParse and Groq
parser = LlamaParse(result_type="markdown")
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

questions_list = list()

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text += page.get_text()
    return text

def extract_info(text):
    info = {}
    # Extract email
    email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
    if email_match:
        info['email'] = email_match.group(0)
    # Extract LinkedIn
    linkedin_match = re.search(r'linkedin\.com/in/[\w-]+', text)
    if linkedin_match:
        info['linkedin'] = linkedin_match.group(0)
    # Extract CGPA
    gpa_match = re.search(r'\bCGPA[:\s]+([0-4]\.\d{1,2})\b', text, re.IGNORECASE)
    if gpa_match:
        info['cgpa'] = gpa_match.group(1)
    # Extract expected graduation
    grad_match = re.search(r'Expected Graduation[:\s]+([A-Za-z]+\s\d{4})\b', text, re.IGNORECASE)
    if grad_match:
        info['expected_graduation'] = grad_match.group(1)
    # Extract phone number
    phone_match = re.search(r'\b(?:\+?(\d{1,3}))?[\s.-]?\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})\b', text)
    if phone_match:
        info['phone'] = f"+{phone_match.group(1) or ''} ({phone_match.group(2)}) {phone_match.group(3)}-{phone_match.group(4)}"
    return info

def extract_experience_section(text):
    experience_section_match = re.search(r'EXPERIENCE[\s\S]+?(?=\n[A-Z]|$)', text, re.IGNORECASE)
    if experience_section_match:
        return experience_section_match.group(0).strip()
    return ""

def extract_skills_section(text):
    skills_section_match = re.search(r'SKILLS[\s\S]+?(?=\n[A-Z]|$)', text, re.IGNORECASE)
    if skills_section_match:
        return skills_section_match.group(0).strip()
    return ""

def format_experience(experience_text):
    formatted_experience = "Experience\n"
    lines = experience_text.split('\n')
    for line in lines:
        line = line.strip()
        if line:  # Only add non-empty lines
            formatted_experience += f"* {line}\n"
    return formatted_experience.strip() if formatted_experience != "Experience\n" else "Experience: NULL"

def format_skills(skills_text):
    formatted_skills = "Skills\n"
    lines = skills_text.split('\n')
    for line in lines:
        line = line.strip()
        if line:  # Only add non-empty lines
            formatted_skills += f"* {line}\n"
    return formatted_skills.strip() if formatted_skills != "Skills\n" else "Skills: NULL"

def process_resume_with_llama_and_groq(pdf_path):
    # Initialize LlamaParse
    file_extractor = {".pdf": parser}
    documents = SimpleDirectoryReader(input_files=[pdf_path], file_extractor=file_extractor).load_data()

    if not documents:
        print("No documents were parsed. Please check the file path and format.")
        return

    # Extract and print the parsed content
    parsed_content = documents[0].text  # Access the text directly
    print(f"Parsed Content: {parsed_content}")

    # Initialize the dictionary
    resume_data = {
        "personal_info": extract_info(parsed_content),
        "education": {},  # Extract education info here if needed
        "experience": extract_experience_section(parsed_content),
        "skills": extract_skills_section(parsed_content),
        "projects": "",  # Extract projects info here if needed
        "certifications": "",  # Extract certifications info here if needed
        "extra_curricular_activities": ""  # Extract extra-curricular activities info here if needed
    }

    # Print the dictionary for debugging
    print("Resume Data:", resume_data)

    # Save each section to a file if needed
    with open('resume_data.json', 'w') as file:
        json.dump(resume_data, file, indent=4)

    # Optionally use Groq for additional formatting
    prompt = f"""
    Extract and format the following information from the resume text:

    {parsed_content}

    Format the output in the following manner:

    **Personal Information**
    * Name: 
    * Email: 
    * Phone: 
    * LinkedIn: 
    * GitHub: 

    **Education**
    * Degree: 
    * University: 
    * Graduation Date: 
    * GPA: 
    * Courses: 

    **Experience**
    * Job Title: 
    * Company: 
    * Location: 
    * Dates: 
    * Responsibilities: 

    **Skills**
    * Programming Languages: 
    * Frameworks: 
    * Tools: 

    **Projects**
    * Project Name: 
    * Description: 

    **Certifications**
    * Certification: 

    **Extra-Curricular Activities**
    * Activity: 

    Please ensure all sections are included, even if some might be empty. Format each section clearly and include relevant details.
    """

    # Create a completion request with Groq
    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "user", "content": prompt}
        ],
        model="llama3-8b-8192",
    )

    # Print the formatted resume information from Groq
    formatted_resume_from_groq = chat_completion.choices[0].message.content
    print(formatted_resume_from_groq)
    
    
    prompt2 = f"""
        Extract and format the following information from the resume text:
        
        {formatted_resume_from_groq}
        
        and generate me 10 questions for the candidate.
        
        
    """
    
    chat_completion = client.chat.completions.create(
        messages=[
            {"role":"user","content":prompt2}
        ],
        model="llama3-8b-8192"
    )
    
    
    formatted_questions = chat_completion.choices[0].message.content
    
    questions = re.findall(r'(\d+)\. (.*)', formatted_questions)
    questions_list = [question[1] for question in questions]

    print(questions_list)

    return questions_list
    # Save the formatted resume content to a file
    # with open('formatted_resume_from_groq.txt', 'w') as file:
    #     file.write(formatted_resume_from_groq)
        



def parsing_main(pdf_path):
    new_questions = process_resume_with_llama_and_groq(pdf_path)
    
    return new_questions