import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import LoginPage from './LoginPage.jsx';
import RegisterPage from './RegisterPage.jsx';
import HomePage from './HomePage.jsx';
import ResultsPage from "./ResultsPage.jsx";
import NavBar from "./NavBar.jsx";
import axios from 'axios';
import {AuthProvider} from "./AuthContext.jsx";
import SearchesPage from "./SearchesPage.jsx";

axios.defaults.withCredentials = true;

function App() {
    return (
        <>
            <div>
                <AuthProvider>
                    <BrowserRouter>
                        <NavBar/>
                        <Routes>
                            <Route index element={<LoginPage/>}/>
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="/register" element={<RegisterPage/>}/>
                            <Route path="/home" element={<HomePage/>}/>
                            <Route path="/results" element={<ResultsPage/>}/>
                            <Route path="/searches" element={<SearchesPage />} />
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </div>
        </>
    );
}

export default App;
