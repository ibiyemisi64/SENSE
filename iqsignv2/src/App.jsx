import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationPage from './Auth/RegistrationPage.jsx';
import LoginPage from './Auth/LoginPage.jsx';
import ProfilePage from './ProfilePage.jsx';
import SignEditor  from './Sign/Sign.jsx';
import Gallery from "./Gallery/Gallery.jsx";
import Home from './HomePage';
import ForgotPassword from './Auth/ForgotPassword.jsx'
import ResetPassword from './Auth/ResetPassword.jsx'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgotpw" element={<ForgotPassword />} />
        <Route path="/resetpw" element={<ResetPassword />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit" element={<SignEditor />} />
        <Route path="/home" element={<Home />} />
        <Route path={"/gallery"} element={<Gallery/>}/>
      </Routes>
    </Router>
  );
};

export default App;
