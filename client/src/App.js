import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import MainPage from './pages/main-page';
import Login from './pages/login';
import SignUp from './pages/sign-up';

function App() {
    const ProtectedRoute = ({ isLoggedIn }) => {
        return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
    };

    const isLoggedIn = useSelector((state) => (state.auth.isLoggedIn));

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
                    <Route path="/" element={<MainPage />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/sign-up" element={<SignUp />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;