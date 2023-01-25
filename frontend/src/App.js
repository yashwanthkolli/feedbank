import { Routes, Route } from 'react-router-dom';
import './App.scss';
import Homepage from './pages/Homepage/Homepage';
import Login from './pages/Login/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProtectedRoute } from './components/ProtectedRoutes/ProtectedRoutes';

function App() {
  return (
    <div className="App">
      <ToastContainer position='bottom-right' />
      <Routes>
        <Route path='/*' element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
