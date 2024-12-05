import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationPage from './Auth/RegistrationPage';
//import LoginPage from './LoginPage';
import LoginPage from './Auth/LoginPage';
import ProfilePage from './ProfilePage';
import Home from './HomePage';
import SignEditor  from './Sign';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit" element={<SignEditor />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
