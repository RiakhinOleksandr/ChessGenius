import './common.css';
import './main-page.css';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from '../userSlice.js';
import { resetState } from '../puzzleSlice.js';
import { resetBlitzState } from '../blitzPuzzlesSlice.js';
import { resetSeriesState } from '../seriesPuzzlesSlice.js';
import { bestInBlitz, bestInPuzzle, bestInSeries } from '../bestUsersThunk.js';

export async function logOutUser(dispatch, navigate){
    await dispatch(logOut());
    dispatch(resetState());
    dispatch(resetBlitzState());
    dispatch(resetSeriesState());
    navigate("/login");
}

function MainPage() {
    const bestPuzzle = useSelector((state) => (state.bestUsers.bestPuzzleUsers));
    const bestBlitz = useSelector((state) => (state.bestUsers.bestBlitzUsers));
    const bestSeries = useSelector((state) => (state.bestUsers.bestSeriesUsers));
    const userName = useSelector((state) => (state.user.login));

    const tablePuzzle = useRef(null);
    const tableBlitz = useRef(null);
    const tableSeries = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(bestInPuzzle({n: 5}));
        dispatch(bestInBlitz({n: 5}));
        dispatch(bestInSeries({n: 5}));
    }, [])
    useEffect(() => {
        if(bestPuzzle.length > 0){
            const tbody = document.getElementById("players-body-puzzles");
            tbody.innerHTML = "";
            for(let i = 0; i < bestPuzzle.length; i++){
                const player = bestPuzzle[i];
                const row = document.createElement("tr");
                if(player.login === userName){
                    row.innerHTML = `<td>${i + 1}</td><td><b>${player.login}</b></td><td><b>${Math.floor(player.puzzle_rating)}</b></td>`;
                }
                else{
                    row.innerHTML = `<td>${i + 1}</td><td>${player.login}</td><td>${Math.floor(player.puzzle_rating)}</td>`;
                }
                tbody.appendChild(row);
            }
        }
    }, [bestPuzzle])
    useEffect(() => {
        if(bestBlitz.length > 0){
            const tbody = document.getElementById("players-body-blitz");
            tbody.innerHTML = "";
            for(let i = 0; i < bestBlitz.length; i++){
                const player = bestBlitz[i];
                const row = document.createElement("tr");
                if(player.login === userName){
                    row.innerHTML = `<td>${i + 1}</td><td><b>${player.login}</b></td><td><b>${player.two_min_record}</b></td>`;
                }
                else{
                    row.innerHTML = `<td>${i + 1}</td><td>${player.login}</td><td>${Math.floor(player.two_min_record)}</td>`;
                }
                tbody.appendChild(row);
            }
        }
    }, [bestBlitz])
    useEffect(() => {
        if(bestSeries.length > 0){
            const tbody = document.getElementById("players-body-series");
            tbody.innerHTML = "";
            for(let i = 0; i < bestSeries.length; i++){
                const player = bestSeries[i];
                const row = document.createElement("tr");
                if(player.login === userName){
                    row.innerHTML = `<td>${i + 1}</td><td><b>${player.login}</b></td><td><b>${player.five_min_record}</b></td>`;
                }
                else{
                    row.innerHTML = `<td>${i + 1}</td><td>${player.login}</td><td>${Math.floor(player.five_min_record)}</td>`;
                }
                tbody.appendChild(row);
            }
        }
    }, [bestSeries])
    useEffect(() => {
        return () => {
            if (tablePuzzle.current) tablePuzzle.current.innerHTML = "";
            if (tableBlitz.current) tableBlitz.current.innerHTML = "";
            if (tableSeries.current) tableSeries.current.innerHTML = "";
        }
    }, [])

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
                <Link to="/series-puzzles" className="link-box">
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
            <div id="some-space"></div>
            <div id="instructions">
                <h2>Раді вас вітати на сайті <b>ChessGenius</b>!</h2>
                <h3>Тут ви можете покращити свої навички гри в шахи, розв'язуючи задачі!</h3>
                <h3>Режим <b>"Задачі"</b> - класичне розв'язування задач.</h3>
                <h3>Режим <b>"Бліц із задач"</b> - підготовка до бліц партій. У вас дві хвилини, розв'яжіть стільки задач, скільки встигнете. Три помилки і ви програли.</h3>
                <h3>Режим <b>"Серія із задач"</b> - підготовка до бліц або рапід партій. У вас п'ять хвилин, розв'яжіть стільки задач, скільки встигнете. Три помилки і ви програли.</h3>
            </div>
            <div id="some-space"></div>
            <div id="table-best">
                <div id="table-best-puzzles">
                    <h3>Найкращі результати у розв'язувані задач</h3>
                    <table className="leaderboard">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Нікнейм</th>
                                <th>Рейтинг</th>
                            </tr>
                        </thead>
                        <tbody id="players-body-puzzles" ref={tablePuzzle}></tbody>
                    </table>
                </div>
                <div id="table-best-blitz">
                    <h3>Найкращі результати у бліці із задач</h3>
                    <table className="leaderboard">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Нікнейм</th>
                                <th>Рекорд</th>
                            </tr>
                        </thead>
                        <tbody id="players-body-blitz" ref={tableBlitz}></tbody>
                    </table>
                </div>
                <div id="table-best-series">
                    <h3>Найкращі результати у серії із задач</h3>
                    <table className="leaderboard">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Нікнейм</th>
                                <th>Рекорд</th>
                            </tr>
                        </thead>
                        <tbody id="players-body-series" ref={tableSeries}></tbody>
                    </table>
                </div>
            </div>
            <div id="some-space"></div>
            <div id="logout-button">
                <button type="button" onClick={() => logOutUser(dispatch, navigate)}>Вийти</button>
            </div>
        </div>
    );
}

export default MainPage;