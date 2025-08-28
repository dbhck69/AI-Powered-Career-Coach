import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Auth/Login.tsx';
import Dashboard from './components/Dashboard.tsx';
import ResumeUploader from './components/ResumeUploader.tsx';
import JobFitScorer from './components/JobFitScorer.tsx'; // New import
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Welcome!</div>,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <div>Register Page</div>,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/upload-resume',
    element: <ResumeUploader />,
  },
  {
    path: '/job-score', // New route
    element: <JobFitScorer />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);