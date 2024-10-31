import * as React from 'react';
import Toolbar from './toolbar/Toolbar';
import { Sign, EditSign } from './sign/Sign';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const Home = () => {
  return (
    <div className='rowC'>
      <Toolbar />
      <Sign />
    </div>
    )
}

const Edit = () => {
  return (
    <div className='rowC'>
      <EditSign />
      <Sign />
    </div>
    )
}



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/edit" element={<Edit />} />
      </Routes>
    </Router>
  );
};

export default App;
