import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationPage from './Auth/RegistrationPage';
import LoginPage from './Auth/LoginPage';
import ProfilePage from './ProfilePage';
import HomePage from './Sign/SignHome';
import {SignEditorPage, SignImageLink} from './Sign/Sign.jsx';
import Gallery from "./Gallery/Gallery.jsx";
import ForgotPassword from './Auth/ForgotPassword.jsx'
import ResetPassword from './Auth/ResetPassword.jsx'
import SignEditorLegacyPage from './Sign/SignLegacy.jsx';

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
        <Route path="/edit" element={<SignEditorPage />} />
        <Route path="/edit-legacy" element={<SignEditorLegacyPage />} />
        <Route path={"/preview"} element={<SignImageLink/>}/>
        <Route path="/home" element={<HomePage />} />
        <Route path={"/gallery"} element={<Gallery/>}/>
      </Routes>
    </Router>
  );
};

export default App;
