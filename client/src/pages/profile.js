import './common.css';
import './profile.css'
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
            <div className="some-space"></div>
            <div id="profile-container">
                <div id="profile">
                    <h2>Привіт {user.login}! Тут твоя статистика:</h2>
                    <p>Твій рейтинг у вирішуванні задач: {Math.round(user.rating)}</p>
                    <p>Усього вирішено задач: {user.puzzles_solved}</p>
                    <p>Твій рекорд у бліці із задач: {user.two_min_record}</p>
                    <p>Усього зіграно бліців із задач: {user.two_min_attempts}</p>
                    <p>Твій рекорд у серії із задач: {user.five_min_record}</p>
                    <p>Усього зіграно серій із задач: {user.five_min_attempts}</p>
                </div>
            </div>
        </div>
    );
}

export default Profile;