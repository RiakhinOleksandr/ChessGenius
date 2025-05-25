import './common.css';
import './puzzles.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { logOutUser } from './main-page';
import { Chess } from "chess.js";
import { generateChessBoard, generateChessPosition, rotateBoard, clearBoard, staticBoard } from '../board-generation';
import { getPuzzle } from '../puzzleThunk';
import {resetState, moveIsMade} from '../puzzleSlice.js';

function Puzzles() {
    const user = useSelector((state) => (state.user))
    const puzzle = useSelector((state) => (state.puzzle))
    const [chess, setChess] = useState(null)
    const [halfMoveNum, setHalfMoveNum] = useState(0);
    const [isWhite, setIsWhite] = useState(true);
    const [mistake, setMistake] = useState(false);
    const [success, setSuccess] = useState(false);
    const [puzzleLoaded, setPuzzleLoaded] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => generateChessBoard(true), []);
    useEffect(() => {
        if(puzzle.moveMade){
            if(puzzle.userMove === puzzle.moves[halfMoveNum]){
                chess.move({from: puzzle.moves[halfMoveNum].slice(0, 2), to: puzzle.moves[halfMoveNum].slice(2, 4)});
                if(halfMoveNum + 1 >= puzzle.moves.length){
                    setSuccess(true);
                }
                else{
                    chess.move({from: puzzle.moves[halfMoveNum + 1].slice(0, 2), to: puzzle.moves[halfMoveNum + 1].slice(2, 4)});
                    setHalfMoveNum(halfMoveNum + 2);
                }
                const FEN = chess.fen();
                staticBoard();
                clearBoard();
                setChess(generateChessPosition(FEN, dispatch));
            }
            else{
                setMistake(true);
            }
            dispatch(moveIsMade());
        }
        else if(!puzzleLoaded && puzzle.status === "done"){
            clearBoard();
            setChess(null);
            if(puzzle.isWhiteMove === isWhite){
                rotateBoard();
                setIsWhite(!puzzle.isWhiteMove);
            }
            const tempChess = new Chess(puzzle.fen);
            tempChess.move({from: puzzle.moves[halfMoveNum].slice(0, 2), to: puzzle.moves[halfMoveNum].slice(2, 4)});
            const FEN = tempChess.fen();
            setHalfMoveNum(1);
            setChess(generateChessPosition(FEN, dispatch));
            setPuzzleLoaded(true);
        }
    }, [puzzle, puzzleLoaded, chess, dispatch, halfMoveNum, isWhite]);
    useEffect(() => {
        if(mistake){
            staticBoard();
            console.log("Помилився!");
        }
    }, [mistake])
    useEffect(() => {
        if(success){
            staticBoard();
            console.log("Вітаю!");
        }
    }, [success])
    useEffect(() => {
        return () => {
            dispatch(resetState());
            setMistake(false);
            setSuccess(false);
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
            <div id="some-space"></div>
            <div id="center-page">
                <div id="chess-board"></div>
            </div>
            <button type="button" onClick={() => {
                dispatch(resetState());
                setChess(null);
                setPuzzleLoaded(false);
                setHalfMoveNum(0);
                setMistake(false);
                setSuccess(false);
                dispatch(getPuzzle({userId: user.id, userRating: user.rating}));
        }}>Click!</button>
        </div>
    );
}

export default Puzzles;