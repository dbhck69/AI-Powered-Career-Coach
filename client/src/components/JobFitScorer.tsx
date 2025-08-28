import { useState } from 'react';
import axios from 'axios';

const JobFitScorer = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!jobDescription) {
      console.error('Please paste a job description to analyze.');
      return;
    }
    
    // Placeholder resume text for now, assuming a user has a resume uploaded
    const placeholderResumeText = `
      Experienced developer with strong skills in Python, JavaScript, and SQL. 
      Proficient with React and has experience in cloud services, specifically AWS.
    `;
    
    setLoading(true);

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/jobfit/score',
        {
          jobDescription,
          resumeText: placeholderResumeText,
        }
      );
      
      setScore(data.score);
      setMatchedSkills(data.matchedSkills);
      setMissingSkills(data.missingSkills);
      console.log('Job fit score received:', data);
    } catch (error) {
      console.error('Error getting job fit score:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Job Fit Scoring</h1>
      <p className="text-gray-600 text-lg mb-8">Paste a job description to see how well your resume matches.</p>

      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md space-y-4">
        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition-colors"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Get Job Fit Score'}
        </button>
      </div>

      {score !== null && (
        <div className="mt-8 w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-4">Your Job Fit Score: {score}%</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-green-600">Matched Skills</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {matchedSkills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-red-600">Missing Skills</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {missingSkills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFitScorer;