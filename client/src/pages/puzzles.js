import './common.css';
import './puzzles.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { logOutUser } from './main-page';
import { Chess } from "chess.js";
import { generateChessBoard, generateChessPosition, rotateBoard, clearBoard,
    staticBoard, showCorrectAnswer} from '../board-generation';
import { getPuzzle, solvedPuzzle } from '../puzzleThunk';
import { resetState, moveIsMade, makeMove } from '../puzzleSlice.js';
import { blockNavigation, unblockNavigation } from '../navigationBlockSlice.js';

function Puzzles() {
    const user = useSelector((state) => (state.user));
    const puzzle = useSelector((state) => (state.puzzle));
    const navigationBlocked = useSelector((state) => (state.navigation.navigationBlocked));
    
    const [chess, setChess] = useState(null)
    const [halfMoveNum, setHalfMoveNum] = useState(0);
    const [isWhite, setIsWhite] = useState(true);
    const [mistake, setMistake] = useState(false);
    const [success, setSuccess] = useState(false);
    const [puzzleIsLoading, setPuzzleIsLoading] = useState(false);
    const [puzzleLoaded, setPuzzleLoaded] = useState(null);
    const [suggestingPromotion, setSuggestingPromotion] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function getPuzzleToSolve(){
        if(puzzleIsLoading) {
            return
        }
        try{
            setPuzzleIsLoading(true);
            dispatch(resetState());
            setChess(null);
            setPuzzleLoaded(false);
            setHalfMoveNum(0);
            setMistake(false);
            setSuccess(false);
            await dispatch(getPuzzle({userId: user.id, userRating: user.rating}));
        }
        finally{
            setPuzzleIsLoading(false);
        }
    }

    function suggestPromotion(puzzle){
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
        if(puzzle.isWhiteMove){
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
            dispatch(moveIsMade());
            clearBoard();
            setChess(generateChessPosition(chess.fen(), dispatch));
            emptySpace.innerHTML = "";
        }
        emptySpace.appendChild(cancelBtn);
    }

    function handleNavigation(e){
        if(navigationBlocked) {
            e.preventDefault();
        }
    }

    useEffect(() => generateChessBoard(true), []);
    useEffect(() => {
        if(puzzle.moveMade){
            if(puzzle.userMove === puzzle.moves[halfMoveNum]){
                if(puzzle.moves[halfMoveNum].includes("O")){
                    chess.move(puzzle.moves[halfMoveNum]);
                }
                else if(puzzle.moves[halfMoveNum].length > 4){
                    chess.move({from: puzzle.moves[halfMoveNum].slice(0, 2), to: puzzle.moves[halfMoveNum].slice(2, 4), 
                        promotion: puzzle.moves[halfMoveNum][4]});
                }
                else{
                    chess.move({from: puzzle.moves[halfMoveNum].slice(0, 2), to: puzzle.moves[halfMoveNum].slice(2, 4)});
                }
                staticBoard();
                clearBoard();
                setChess(generateChessPosition(chess.fen(), dispatch));
                if(halfMoveNum + 1 >= puzzle.moves.length){
                    setSuccess(true);
                }
                else{
                    if(puzzle.moves[halfMoveNum + 1].includes("O")){
                        chess.move(puzzle.moves[halfMoveNum + 1]);
                    }
                    else if(puzzle.moves[halfMoveNum + 1].length > 4){
                        chess.move({from: puzzle.moves[halfMoveNum + 1].slice(0, 2), to: puzzle.moves[halfMoveNum + 1].slice(2, 4), 
                            promotion: puzzle.moves[halfMoveNum + 1][4]});
                    }
                    else{
                        chess.move({from: puzzle.moves[halfMoveNum + 1].slice(0, 2), to: puzzle.moves[halfMoveNum + 1].slice(2, 4)});
                    }
                    setHalfMoveNum(halfMoveNum + 2);
                    staticBoard();
                    clearBoard();
                    const FEN = chess.fen();
                    setChess(generateChessPosition(FEN, dispatch));
                }
            }
            else{
                setMistake(true);
            }
            dispatch(moveIsMade());
        }
        else if(suggestingPromotion){
            dispatch(makeMove(puzzle.userMove + suggestingPromotion.toLowerCase()));
            setSuggestingPromotion(null);
            const emptySpace = document.getElementById("promotion-info");
            emptySpace.innerHTML = "";
        }
        else if(puzzle.promotionMade){
            suggestPromotion(puzzle);
            staticBoard();
        }
        else if(!puzzleLoaded && puzzle.status === "done"){
            clearBoard();
            const moveTurnInfo = document.getElementById("move-turn-info");
            const final_msg = document.getElementById("final-message");
            const about_btn = document.getElementById("about-button");
            moveTurnInfo.innerText = "Ви граєте за " + (puzzle.isWhiteMove ? "чорних" : "білих") + ". Найдіть найкращий хід"
            final_msg.innerText = "";
            about_btn.innerText = "";
            if(puzzle.isWhiteMove === isWhite){
                rotateBoard();
                setIsWhite(!puzzle.isWhiteMove);
            }
            const tempChess = new Chess(puzzle.fen);
            setChess(generateChessPosition(puzzle.fen, dispatch))
            if(puzzle.moves[halfMoveNum].includes("O")){
                tempChess.move(puzzle.moves[halfMoveNum]);
            }
            else if(puzzle.moves[halfMoveNum].length > 4){
                chess.move({from: puzzle.moves[halfMoveNum].slice(0, 2), to: puzzle.moves[halfMoveNum].slice(2, 4), 
                    promotion: puzzle.moves[halfMoveNum][4]});
                }
            else{
                tempChess.move({from: puzzle.moves[halfMoveNum].slice(0, 2), to: puzzle.moves[halfMoveNum].slice(2, 4)});
            }
            const FEN = tempChess.fen();
            setHalfMoveNum(1);
            clearBoard();
            staticBoard();
            setChess(generateChessPosition(FEN, dispatch));
            setPuzzleLoaded(true);
        }
    }, [puzzle, puzzleLoaded, chess, dispatch, halfMoveNum, isWhite, suggestingPromotion]);
    useEffect(() => {
        if(mistake){
            staticBoard();
            const moveTurnInfo = document.getElementById("move-turn-info");
            const final_msg = document.getElementById("final-message");
            const about_btn = document.getElementById("about-button");
            moveTurnInfo.innerText = "";
            final_msg.innerText = "На жаль, це неправильний хід!";
            about_btn.innerText = "Натисни кнопку знизу, щоб отримати нову задачу";
            dispatch(solvedPuzzle({userId: user.id, puzzleId: puzzle.puzzle_id, userRating: user.rating, 
                puzzleRating: puzzle.rating, solved: false}));
        }
    }, [mistake, dispatch])
    useEffect(() => {
        if(success){
            staticBoard();
            const moveTurnInfo = document.getElementById("move-turn-info");
            const final_msg = document.getElementById("final-message");
            const about_btn = document.getElementById("about-button");
            moveTurnInfo.innerText = "";
            final_msg.innerText = "Вітаю! Ви вирішили цю задачу";
            about_btn.innerText = "Натисни кнопку знизу, щоб отримати нову задачу";
            dispatch(solvedPuzzle({userId: user.id, puzzleId: puzzle.puzzle_id, userRating: user.rating, 
                puzzleRating: puzzle.rating, solved: true}));
        }
    }, [success, dispatch])
    useEffect(() => {
        return () => {
            dispatch(resetState());
            setChess(null)
            setMistake(false);
            setSuccess(false);
            setSuggestingPromotion(null);
        }
    }, [dispatch]);

    return (
        <div>
            <div id="top">
                <Link to="/" className="link-box" onClick={handleNavigation}>
                    <div className="main-link">
                        <p>На головну</p>
                    </div>
                </Link>
                <Link to="/profile" className="link-box" onClick={handleNavigation}>
                    <div className="profile-link">
                        <p>Профіль</p>
                    </div>
                </Link>
                <Link to="/login" className="link-box" onClick={(e) => {
                    if(navigationBlocked){
                        e.preventDefault();
                    } else{
                        logOutUser(dispatch, navigate);
                    }}
                }>
                    <div className="logout-link">
                        <p>Вийти</p>
                    </div>
                </Link>
            </div>
            <div className="some-space"></div>
            <div id="center-page">
                <div id="info">
                    <p>Ваш рейтинг: {Math.round(user.rating)}</p>
                    <p>{mistake || success ? "Рейтинг цієї задачі був: " + puzzle.rating : ""}</p>
                    <p id="move-turn-info"></p>
                    <p id="final-message"></p>
                    {(mistake || success) && (<button type="button" id="show-correct-answer" disabled={puzzleIsLoading} 
                    onClick={async () => {try{
                        setPuzzleIsLoading(true);
                        await showCorrectAnswer(puzzle, 800, dispatch);
                    } finally{
                        setPuzzleIsLoading(false);
                    }}}>
                        {mistake ? "Подивитися на правильне рішення" : "Продивитись рішення ще раз"}
                    </button>)}
                    <p id="about-button">Натисніть на кнопку знизу, щоб розпочати</p>
                </div>
                <div id="chess-board"></div>
                <div id="promotion-info"></div>
            </div>
            <div className="some-space"></div>
            <button type="button" id="get-puzzle" onClick={async () => {
                try{
                    dispatch(blockNavigation());
                    await getPuzzleToSolve();
                } finally{
                    dispatch(unblockNavigation());
                }}
            } disabled={puzzleIsLoading}>Отримати задачу</button>
        </div>
    );
}

export default Puzzles;