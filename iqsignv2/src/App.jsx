/***
 * App.jsx
 *
 * Purpose: Redirects to different pages in the iqsign app.
 *
 *
 * Copyright 2024 Brown University -- Shufan He, Jason Silva, Ibiyemisi Gbenebor
 *
 * All Rights Reserved
 *
 * Permission to use, copy, modify, and distribute this software and its
 * documentation for any purpose other than its incorporation into a
 * commercial product is hereby granted without fee, provided that the
 * above copyright notice appear in all copies and that both that
 * copyright notice and this permission notice appear in supporting
 * documentation, and that the name of Brown University not be used in
 * advertising or publicity pertaining to distribution of the software
 * without specific, written prior permission.
 *
 * BROWN UNIVERSITY DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS
 * SOFTWARE, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR ANY PARTICULAR PURPOSE. IN NO EVENT SHALL BROWN UNIVERSITY
 * BE LIABLE FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES OR ANY
 * DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
 * WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS
 * ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE
 * OF THIS SOFTWARE.
 ***/
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationPage from './Auth/RegistrationPage';
import LoginPage from './Auth/LoginPage';
import ProfilePage from './ProfilePage';
import HomePage from './Sign/SignHome';
import {SignEditorPage} from './Sign/Sign.jsx';
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
        <Route path="/home" element={<HomePage />} />
        <Route path={"/gallery"} element={<Gallery/>}/>
      </Routes>
    </Router>
  );
};

export default App;
