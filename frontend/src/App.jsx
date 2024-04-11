import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './LoginPage.jsx';
import RegisterPage from './RegisterPage.jsx';
import HomePage from './HomePage.jsx';
// Temporarily use a simplified RegisterPage for testing
//const RegisterPage = () => <div>Register Page Placeholder</div>;

function App() {
  return (
    <>
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<LoginPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/home" element={<HomePage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
    </>
  );
}

export default App;
