import './common.css';
import './puzzles.css';
import './two-min-puzzles.css';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { logOutUser } from './main-page';
import { Chess } from "chess.js";
import { generateChessBoard, generateChessPositionForSeries, rotateBoard, clearBoard,
    staticBoard} from '../board-generation';
import { getPuzzlesForSeries, solvedSeries } from '../puzzleThunk';
import { resetSeriesState, makeMoveForSeries, moveIsMadeForSeries } from '../seriesPuzzlesSlice.js';

function SeriesPuzzles() {
    const user = useSelector((state) => (state.user));
    const puzzles = useSelector((state) => (state.seriesPuzzles));
    const [chess, setChess] = useState(null);
    const [halfMoveNum, setHalfMoveNum] = useState(0);
    const [isWhite, setIsWhite] = useState(true);
    const [mistake, setMistake] = useState(false);
    const [success, setSuccess] = useState(false);
    const [seriesIsPlayed, setSeriesIsPlayed] = useState(false);
    const [puzzle, setPuzzle] = useState(null);
    const [puzzlesSolved, setPuzzlesSolved] = useState(0);
    const [mistakesMade, setMistakesMade] = useState(0);
    const [gameIsOver, setGameIsOver] = useState(false);
    const [puzzleLoaded, setPuzzleLoaded] = useState(null);
    const [suggestingPromotion, setSuggestingPromotion] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const intervalRef = useRef(null);

    async function getPuzzlesToSolve(startRating, incrementRating, n){
        if(seriesIsPlayed) {
            return
        }
        setSeriesIsPlayed(true);
        dispatch(resetSeriesState());
        setChess(null);
        setPuzzleLoaded(false);
        setHalfMoveNum(0);
        setMistake(false);
        setSuccess(false);
        await dispatch(getPuzzlesForSeries({startRating, incrementRating, n}));
    }

    function suggestPromotion(){
        const picturesHrefForFEN = {
            Q: "/pieces/queen-w.svg", q: "/pieces/queen-b.svg",
            R: "/pieces/rook-w.svg", r: "/pieces/rook-b.svg",
            B: "/pieces/bishop-w.svg", b: "/pieces/bishop-b.svg",
            N: "/pieces/knight-w.svg", n: "/pieces/knight-b.svg"
        }
        const emptySpace = document.getElementById("promotion-info");
        const text = document.createElement("p");
        text.innerText = "Виберіть фігуру для перетворення: ";
        const imagesBlock1 = document.createElement("div");
        const imagesBlock2 = document.createElement("div");
        imagesBlock1.id = "promotion-images-container";
        imagesBlock2.id = "promotion-images-container";
        emptySpace.appendChild(text);
        emptySpace.appendChild(imagesBlock1);
        emptySpace.appendChild(imagesBlock2);
        let n = puzzlesSolved + mistakesMade;
        if(puzzles.puzzles[n][0].isWhiteMove){
            const figures1 = ["q", "b"];
            const figures2 = ["r", "n"];
            for(let i = 0; i < figures1.length; i++){
                const figure1 = document.createElement("img");
                const figure2 = document.createElement("img");
                figure1.src = picturesHrefForFEN[figures1[i]];
                figure2.src = picturesHrefForFEN[figures2[i]];
                figure1.className = "promotion-image";
                figure2.className = "promotion-image";
                figure1.width = 100;
                figure2.width = 100;
                figure1.height = 100;
                figure2.height = 100;
                figure1.onclick = () => setSuggestingPromotion(figures1[i]);
                figure2.onclick = () => setSuggestingPromotion(figures2[i]);
                imagesBlock1.appendChild(figure1);
                imagesBlock2.appendChild(figure2);
            }
        }
        else{
            const figures1 = ["Q", "B"];
            const figures2 = ["R", "N"];
            for(let i = 0; i < figures1.length; i++){
                const figure1 = document.createElement("img");
                const figure2 = document.createElement("img");
                figure1.src = picturesHrefForFEN[figures1[i]];
                figure2.src = picturesHrefForFEN[figures2[i]];
                figure1.className = "promotion-image";
                figure2.className = "promotion-image";
                figure1.width = 70;
                figure2.width = 70;
                figure1.height = 70;
                figure2.height = 70;
                figure1.onclick = () => setSuggestingPromotion(figures1[i]);
                figure2.onclick = () => setSuggestingPromotion(figures2[i]);
                imagesBlock1.appendChild(figure1);
                imagesBlock2.appendChild(figure2);
            }
        }
        const cancelBtn = document.createElement("button");
        cancelBtn.id = "cancel-promotion"
        cancelBtn.innerText = "Відмінити перетворення";
        cancelBtn.onclick = () => {
            dispatch(moveIsMadeForSeries({n: n}));
            clearBoard();
            setChess(generateChessPositionForSeries(chess.fen(), dispatch, n));
            emptySpace.innerHTML = "";
        }
        emptySpace.appendChild(cancelBtn);
    }

    function formatTime(seconds) {
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s}`;
    }

    useEffect(() => generateChessBoard(true), []);
    useEffect(() => {
        let n = puzzlesSolved + mistakesMade;
        if(puzzles.puzzles.length > 1){
            if(puzzles.puzzles[n][0].moveMade){
                if(puzzles.puzzles[n][0].userMove === puzzles.puzzles[n][0].moves[halfMoveNum]){
                    if(puzzles.puzzles[n][0].moves[halfMoveNum].includes("O")){
                        chess.move(puzzles.puzzles[n][0].moves[halfMoveNum]);
                    }
                    else if(puzzles.puzzles[n][0].moves[halfMoveNum].length > 4){
                        chess.move({from: puzzles.puzzles[n][0].moves[halfMoveNum].slice(0, 2), to: puzzles.puzzles[n][0].moves[halfMoveNum].slice(2, 4), 
                            promotion: puzzles.puzzles[n][0].moves[halfMoveNum][4]});
                    }
                    else{
                        chess.move({from: puzzles.puzzles[n][0].moves[halfMoveNum].slice(0, 2), to: puzzles.puzzles[n][0].moves[halfMoveNum].slice(2, 4)});
                    }
                    staticBoard();
                    clearBoard();
                    setChess(generateChessPositionForSeries(chess.fen(), dispatch, n));
                    if(halfMoveNum + 1 >= puzzles.puzzles[n][0].moves.length){
                        setSuccess(true);
                    }
                    else{
                        if(puzzles.puzzles[n][0].moves[halfMoveNum + 1].includes("O")){
                            chess.move(puzzles.puzzles[n][0].moves[halfMoveNum + 1]);
                        }
                        else if(puzzles.puzzles[n][0].moves[halfMoveNum + 1].length > 4){
                            chess.move({from: puzzles.puzzles[n][0].moves[halfMoveNum + 1].slice(0, 2), to: puzzles.puzzles[n][0].moves[halfMoveNum + 1].slice(2, 4), 
                                promotion: puzzles.puzzles[n][0].moves[halfMoveNum + 1][4]});
                        }
                        else{
                            chess.move({from: puzzles.puzzles[n][0].moves[halfMoveNum + 1].slice(0, 2), to: puzzles.puzzles[n][0].moves[halfMoveNum + 1].slice(2, 4)});
                        }
                        setHalfMoveNum(halfMoveNum + 2);
                        staticBoard();
                        clearBoard();
                        const FEN = chess.fen();
                        setChess(generateChessPositionForSeries(FEN, dispatch, n));
                    }
                }
                else{
                    setMistake(true);
                }
                dispatch(moveIsMadeForSeries({n: n}));
            }
            else if(suggestingPromotion){
                dispatch(makeMoveForSeries({n: n, userMove: puzzles.puzzles[n][0].userMove + suggestingPromotion.toLowerCase()}));
                setSuggestingPromotion(null);
                const emptySpace = document.getElementById("promotion-info");
                emptySpace.innerHTML = "";
            }
            else if(puzzles.puzzles[n][0].promotionMade){
                suggestPromotion(puzzles.puzzles[n][0]);
                staticBoard();
            }
            else if(!puzzleLoaded){
                clearBoard();
                const moveTurnInfo = document.getElementById("move-turn-info");
                const final_msg = document.getElementById("final-message");
                moveTurnInfo.innerText = "Ви граєте за " + (puzzles.puzzles[n][0].isWhiteMove ? "чорних" : "білих") + ". Найдіть найкращий хід"
                final_msg.innerText = "";
                if(puzzles.puzzles[n][0].isWhiteMove === isWhite){
                    rotateBoard();
                    setIsWhite(!puzzles.puzzles[n][0].isWhiteMove);
                }
                const tempChess = new Chess(puzzles.puzzles[n][0].fen);
                setChess(generateChessPositionForSeries(puzzles.puzzles[n][0].fen, dispatch, n))
                if(puzzles.puzzles[n][0].moves[halfMoveNum].includes("O")){
                    tempChess.move(puzzles.puzzles[n][0].moves[halfMoveNum]);
                }
                else if(puzzles.puzzles[n][0].moves[halfMoveNum].length > 4){
                    chess.move({from: puzzles.puzzles[n][0].moves[halfMoveNum].slice(0, 2), to: puzzles.puzzles[n][0].moves[halfMoveNum].slice(2, 4), 
                        promotion: puzzles.puzzles[n][0].moves[halfMoveNum][4]});
                    }
                else{
                    tempChess.move({from: puzzles.puzzles[n][0].moves[halfMoveNum].slice(0, 2), to: puzzles.puzzles[n][0].moves[halfMoveNum].slice(2, 4)});
                }
                const FEN = tempChess.fen();
                setHalfMoveNum(1);
                clearBoard();
                staticBoard();
                setChess(generateChessPositionForSeries(FEN, dispatch, n));
                setPuzzleLoaded(true);
            }
        }
    }, [puzzle, puzzles, puzzleLoaded, chess, dispatch, halfMoveNum, isWhite, suggestingPromotion]);
    useEffect(() => {
        if(puzzles.status === "done"){
            setPuzzle(puzzles.puzzles[puzzlesSolved + mistakesMade][0]);
            setPuzzleLoaded(false);
            setHalfMoveNum(0);
        }
    }, [puzzles.status, puzzlesSolved, mistakesMade])
    useEffect(() => {
        if(mistake){
            staticBoard();
            const moveTurnInfo = document.getElementById("move-turn-info");
            const final_msg = document.getElementById("final-message");
            moveTurnInfo.innerText = "";
            final_msg.innerText = "На жаль, це неправильний хід!";
            setMistakesMade(mistakesMade + 1);
            setMistake(false);
        }
        if(mistakesMade >= 3){
            setGameIsOver(true);
        }
    }, [mistake, mistakesMade, dispatch])
    useEffect(() => {
        if(success){
            staticBoard();
            const moveTurnInfo = document.getElementById("move-turn-info");
            const final_msg = document.getElementById("final-message");
            moveTurnInfo.innerText = "";
            final_msg.innerText = "Вітаю! Ви вирішили цю задачу";
            setPuzzlesSolved(puzzlesSolved + 1);
            setSuccess(false);
        }
    }, [success, puzzlesSolved, dispatch]);
    useEffect(() => {
        if(gameIsOver){
            setSeriesIsPlayed(false);
            clearBoard();
            const moveTurnInf = document.getElementById("move-turn-info");
            moveTurnInf.innerText = "";
            if(puzzlesSolved > user.five_min_record){
                const congratsRecord = document.getElementById("new-record");
                congratsRecord.innerText = "Це новий рекорд! Вітаємо"
            }
            dispatch(solvedSeries({userId: user.id, result: puzzlesSolved}));
            clearInterval(intervalRef.current);
            const textDisplay = document.getElementById("timer");
            textDisplay.innerText = "";
        }
    }, [gameIsOver])
    useEffect(() => {
        return () => {
            dispatch(resetSeriesState());
            setChess(null)
            setMistake(false);
            setSuccess(false);
            setPuzzlesSolved(0);
            setGameIsOver(false);
            setMistakesMade(0);
            setSuggestingPromotion(null);
            clearInterval(intervalRef.current);
        }
    }, [dispatch]);

    return (
        <div>
            <div id="top">
                <Link to="/" className="link-box">
                    <div className="main-link">
                        <p>На головну</p>
                    </div>
                </Link>
                <Link to="/profile" className="link-box">
                    <div className="profile-link">
                        <p>Профіль</p>
                    </div>
                </Link>
                <Link to="/login" className="link-box" onClick={() => logOutUser(dispatch, navigate)}>
                    <div className="logout-link">
                        <p>Вийти</p>
                    </div>
                </Link>
            </div>
            <div className="some-space"></div>
            <div id="center-page">
                <div id="info">
                    <p>Ваш рекорд: {user.five_min_record}</p>
                    <p id="current-result">{seriesIsPlayed ? 
                    "Ви вирішили " + puzzlesSolved + " задач.\nВи помилилися " + mistakesMade + " разів." : ""}</p>
                    <p id="timer"></p>
                    <p id="new-record"></p>
                    <p id="final-result">{gameIsOver ? 
                    "Ваш результат: " + puzzlesSolved : ""}</p>
                    <p id="move-turn-info"></p>
                    <p id="final-message"></p>
                    <p id="about-button">Натисніть на кнопку знизу, щоб розпочати</p>
                </div>
                <div id="chess-board"></div>
                <div id="promotion-info"></div>
            </div>
            <div className="some-space"></div>
            <button type="button" id="get-puzzle" onClick={async () => {
                const textDisplay = document.getElementById("timer");
                const recordMsg = document.getElementById("new-record");
                recordMsg.innerText = "";
                textDisplay.innerText = "";
                await getPuzzlesToSolve(750, 16, 75);
                setGameIsOver(false);
                setPuzzlesSolved(0);
                setMistakesMade(0)
                let timeLeft = 300
                intervalRef.current = setInterval(() => {
                    textDisplay.innerText = "У вас залишилось " + formatTime(timeLeft) + " часу."
                    if (timeLeft <= 0){
                        textDisplay.innerText = "Час вийшов!"
                        setGameIsOver(true);
                        clearInterval(intervalRef.current);
                    }
                    timeLeft = timeLeft - 1;
                }, 1000)}
            } disabled={seriesIsPlayed}>Отримати серію задач</button>
        </div>
    );
}

export default SeriesPuzzles;