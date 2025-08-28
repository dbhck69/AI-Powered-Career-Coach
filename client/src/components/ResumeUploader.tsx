import { useState, useRef } from 'react';
import axios from 'axios';

const ResumeUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    if (uploadedFile) {
      setFile(uploadedFile);
      console.log('File selected:', uploadedFile.name);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0] || null;
    if (droppedFile) {
      setFile(droppedFile);
      console.log('File dropped:', droppedFile.name);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleSubmit = async () => {
    if (!file) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const token = localStorage.getItem('token'); // Get the token

      if (!token) {
        console.error('User not logged in. No token found.');
        return;
      }

      const { data } = await axios.post(
        'http://localhost:5000/api/resume/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`, // Add the Authorization header
          },
        }
      );
      
      console.log('File uploaded successfully:', data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('File upload failed:', error.response?.data?.message || 'Server error');
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Upload Your Resume</h1>
      <p className="text-gray-600 text-lg mb-8">Get instant AI-powered feedback.</p>

      <div
        className={`w-full max-w-lg p-6 border-2 border-dashed rounded-lg text-center transition-colors cursor-pointer ${
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
        />
        {file ? (
          <p className="text-green-600 font-semibold">{file.name} ready to upload.</p>
        ) : (
          <p className="text-gray-500 hover:text-gray-800 transition-colors">
            Drag and drop your file here, or click to browse.
          </p>
        )}
      </div>

      {file && (
        <button
          onClick={handleSubmit}
          className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition-colors"
        >
          Analyze Resume
        </button>
      )}
    </div>
  );
};

export default ResumeUploader;