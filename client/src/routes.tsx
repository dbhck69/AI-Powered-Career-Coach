import { Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login'; // Import the new component

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<div>Register Page</div>} />
      <Route path="/" element={<div>Welcome!</div>} />
    </Routes>
  );
};

export default AppRoutes;