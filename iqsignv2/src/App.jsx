import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationPage from './RegistrationPage';
import LoginPage from './LoginPage';
import ProfilePage from './ProfilePage';
import Home from './HomePage';
import SignEditor  from './Sign/Sign.jsx';
import Gallery from "./Gallery/Gallery.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
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
