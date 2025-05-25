import './common.css';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { logOutUser } from './main-page';

function Profile() {
    const user = useSelector((state) => (state.user))

    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div>
            <div id="top">
                <Link to="/" className="link-box">
                    <div className="main-link">
                        <p>На головну</p>
                    </div>
                </Link>
                <Link to="/login" className="link-box" onClick={() => logOutUser(dispatch, navigate)}>
                    <div className="logout-link">
                        <p>Вийти</p>
                    </div>
                </Link>
            </div>
            <h1>Тут буде профіль користувача</h1>
            <p>{user.login}</p>
            <p>{user.admin ? "admin" : "user"}</p>
            <p>{user.rating}</p>
            <p>{user.puzzles_solved}</p>
            <p>{user.two_min_record}</p>
            <p>{user.two_min_attempts}</p>
            <p>{user.five_min_record}</p>
            <p>{user.five_min_attempts}</p>
        </div>
    );
}

export default Profile;