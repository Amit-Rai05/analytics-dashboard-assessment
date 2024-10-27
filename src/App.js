import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import Navbar from './components/Navbar/Navbar';

const App = () => {
  return (
      <div className="app">
        <Navbar />
        <Dashboard />
        </div>
       
  );
};

export default App;


