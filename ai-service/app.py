from flask import Flask, request, jsonify
import pypdf
import traceback
from io import BytesIO
import spacy
import re

app = Flask(__name__)

# Load the spaCy language model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading language model for the first time...")
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def extract_skills_from_text(text):
    doc = nlp(text.lower())
    
    # Simple keyword-based skill matching for demonstration
    predefined_skills = [
        "python", "javascript", "react", "sql", "aws", "docker", "kubernetes",
        "machine learning", "data analysis", "agile", "scrum", "git"
    ]
    
    found_skills = set()
    for token in doc:
        if token.text in predefined_skills:
            found_skills.add(token.text)
    
    return list(found_skills)

@app.route('/api/analyze', methods=['POST'])
def analyze_resume():
    if 'resume' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['resume']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Only PDF files are supported'}), 400

    try:
        file_content = file.read()
        
        reader = pypdf.PdfReader(BytesIO(file_content))
        
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""

        extracted_skills = extract_skills_from_text(text)

        return jsonify({
            'message': 'File received and text analyzed successfully',
            'extractedText': text[:500],
            'extractedSkills': extracted_skills
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/score', methods=['POST'])
def get_job_fit_score():
    data = request.json
    job_description = data.get('jobDescription', '')
    resume_text = data.get('resumeText', '')

    if not job_description or not resume_text:
        return jsonify({'error': 'Missing job description or resume text'}), 400

    try:
        # Extract skills from both the resume and job description
        resume_skills = set(extract_skills_from_text(resume_text))
        job_skills = set(extract_skills_from_text(job_description))

        if not job_skills:
            return jsonify({
                'score': 0,
                'message': 'No relevant skills found in job description.',
                'matchedSkills': [],
                'missingSkills': []
            }), 200
        
        # Calculate the score
        matched_skills = resume_skills.intersection(job_skills)
        score = (len(matched_skills) / len(job_skills)) * 100
        
        return jsonify({
            'score': round(score, 2),
            'message': 'Job fit score calculated successfully',
            'matchedSkills': list(matched_skills),
            'missingSkills': list(job_skills.difference(resume_skills))
        }), 200
    
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)