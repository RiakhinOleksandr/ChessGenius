import './common.css';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import {logOut} from '../userSlice.js';
import { resetState } from '../puzzleSlice.js';
import { resetBlitzState } from '../blitzPuzzlesSlice.js';

export function logOutUser(dispatch, navigate){
    dispatch(logOut());
    dispatch(resetState());
    dispatch(resetBlitzState());
    navigate("/login");
}

function MainPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div>
            <div id="top">
                <Link to="/puzzles" className="link-box">
                    <div className="puzzle-link">
                        <p>Задачі</p>
                    </div>
                </Link>
                <Link to="/blitz-puzzles" className="link-box">
                    <div className="two-min-puzzle-link">
                        <p>Бліц із задач</p>
                    </div>
                </Link>
                <Link to="/five-min-puzzles" className="link-box">
                    <div className="five-min-puzzle-link">
                        <p>Серія задач</p>
                    </div>
                </Link>
                <Link to="/profile" className="link-box">
                    <div className="profile-link">
                        <p>Профіль</p>
                    </div>
                </Link>
            </div>
            <div id="logout-button">
                <button type="button" onClick={() => logOutUser(dispatch, navigate)}>Вийти</button>
            </div>
        </div>
    );
}

export default MainPage;