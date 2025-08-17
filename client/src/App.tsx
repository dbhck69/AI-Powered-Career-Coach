import { Outlet } from 'react-router-dom';
import './index.css';

const App = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Outlet />
    </div>
  );
};

export default App;