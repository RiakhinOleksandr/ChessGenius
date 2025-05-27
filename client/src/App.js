import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainPage from './pages/main-page';
import Puzzles from './pages/puzzles';
import BlitzPuzzles from './pages/two-min-puzzles';
import SeriesPuzzles from './pages/five-min-puzlles';
import Profile from "./pages/profile";
import Login from './pages/login';
import SignUp from './pages/sign-up';


function App() {
    const ProtectedRoute = ({ isLoggedIn }) => {
        return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
    };

    const isLoggedIn = useSelector((state) => (state.user.isLoggedIn));

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/puzzles" element={<Puzzles />} />
                    <Route path="/blitz-puzzles" element={<BlitzPuzzles />} />
                    <Route path="/series-puzzles" element={<SeriesPuzzles />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/sign-up" element={<SignUp />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;