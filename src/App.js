import './App.css';
import {Login} from "./user/Login";
import {Register} from './user/Register';
import ChatApp from './chatApp';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<ChatApp />} />
        <Route path="/" element={<Navigate to="/login" />} />      
      </Routes>
    </Router>
  );
}

export default App;
