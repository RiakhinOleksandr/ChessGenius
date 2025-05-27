import {Chess} from "chess.js";
import {makeMove, makePromotion} from './puzzleSlice.js';
import {makeMoveForBlitz, makePromotionForBlitz} from './blitzPuzzlesSlice.js';
import {makeMoveForSeries, makePromotionForSeries} from './seriesPuzzlesSlice.js';

const squareOrderForFEN = ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8",
                           "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
                           "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
                           "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
                           "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
                           "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
                           "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
                           "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"]

const picturesHrefForFEN = {
    K: "/pieces/king-w.svg", k: "/pieces/king-b.svg",
    Q: "/pieces/queen-w.svg", q: "/pieces/queen-b.svg",
    R: "/pieces/rook-w.svg", r: "/pieces/rook-b.svg",
    B: "/pieces/bishop-w.svg", b: "/pieces/bishop-b.svg",
    N: "/pieces/knight-w.svg", n: "/pieces/knight-b.svg",
    P: "/pieces/pawn-w.svg", p: "/pieces/pawn-b.svg"
}
const blueCircleUrl = "/blue-circle.svg";
const blueSquareUrl = "/blue-square.svg";
const greenCircleUrl = "/green-circle.svg";

export function generateChessBoard(white){
    const chessBoard = document.getElementById("chess-board");
    const coords = "abcdefgh";

    for(let row = 0; row < 8; row++){
        let realRow = 0;
        if(white){
            realRow = 8 - row;
        }
        else{
            realRow = row + 1;
        }
        const coord = document.createElement("p");
        coord.className = "row coord";
        coord.innerText = realRow;
        chessBoard.appendChild(coord)
        for(let column = 0; column < 8; column++){
            const square = document.createElement("div");
            let realCol = "";
            if(white){
                realCol = coords[column];
            }
            else{
                realCol = coords.at(-column - 1);
            }
            square.id = realCol + realRow;

            if((row + column) % 2 === 0){
                square.className = "square white";
            }
            else{
                square.className = "square black";
            }
            chessBoard.appendChild(square);
        }
    }
    const empty = document.createElement("p");
    chessBoard.appendChild(empty);
    for(let col = 0; col < 8; col++){
        const coord = document.createElement("p");
        coord.className = "col coord";
        if(white){
            coord.innerText = coords[col];
        }
        else{
            coord.innerText = coords.at(-col - 1);
        }
        chessBoard.appendChild(coord);
    }
}

export function generateChessPosition(FEN, dispatch){
    const [position, moveTurn, castlingPossible, enPassantTarget, halfMoveClock, moveNumber] = FEN.split(" ");

    const chess = new Chess(FEN);

    let i = 0;
    for(let j = 0; j < position.length; j++){
        const char = position[j];
        if(char in picturesHrefForFEN){
            const squareCoord = squareOrderForFEN[i];
            const square = document.getElementById(squareCoord);
            const img = document.createElement("img");
            img.className = "figure";
            const possibleMoves = chess.moves({square : squareCoord});
            if(possibleMoves){
                if(chess.get(squareCoord).color === moveTurn){
                    img.onclick = () => {
                        deleteCircles();
                        const imgSquare = document.createElement("img");
                        imgSquare.src = blueSquareUrl;
                        imgSquare.id = "selected-square";
                        imgSquare.style.position = "absolute";
                        imgSquare.style.opacity = 0.4;
                        imgSquare.width = 70;
                        imgSquare.height = 70;
                        square.appendChild(imgSquare);
                        for(let k = 0; k < possibleMoves.length; k++){
                            const possibleMove = possibleMoves[k];
                            const {newSquare, promotion, castle} = getNewSquare(possibleMove, moveTurn);
                            const imgCircle = document.createElement("img");
                            const squarePossible = document.getElementById(newSquare);
                            if(!promotion){
                                imgCircle.src = blueCircleUrl;
                                imgCircle.className = "possible-move";
                                imgCircle.width = 30;
                                imgCircle.height = 30;
                                squarePossible.appendChild(imgCircle);
                                if(chess.get(newSquare)){
                                    imgCircle.src = greenCircleUrl;
                                    imgCircle.style.position = "absolute";
                                    imgCircle.style.opacity = 0.8;
                                }
                                if(!castle){
                                    squarePossible.onclick = () => dispatch(makeMove(square.id + squarePossible.id));
                                }
                                else{
                                    squarePossible.onclick = () => dispatch(makeMove(possibleMove));
                                }
                            }
                            else{
                                if(squarePossible.querySelector('img.possible-move') === null){
                                    imgCircle.src = blueCircleUrl;
                                    imgCircle.className = "possible-move";
                                    imgCircle.width = 30;
                                    imgCircle.height = 30;
                                    squarePossible.appendChild(imgCircle);
                                    if(chess.get(newSquare)){
                                        imgCircle.src = greenCircleUrl;
                                        imgCircle.style.position = "absolute";
                                        imgCircle.style.opacity = 0.8;
                                    }
                                    squarePossible.onclick = () => dispatch(makePromotion(square.id + squarePossible.id));
                                }
                            }
                        }
                    }
                }
            }
            img.src = picturesHrefForFEN[char];
            img.width = 70;
            img.height = 70;
            square.appendChild(img);
            i += 1;
        }
        else if (char >= '0' && char <= '9') {
            i += parseInt(char);
        }
    }

    return chess;
}

export function clearBoard(){
    deleteCircles();
    for(let j = 0; j < squareOrderForFEN.length; j++){
        const squareCoord = squareOrderForFEN[j];
        const square = document.getElementById(squareCoord);
        square.innerHTML = "";
    }
}

export function staticBoard(){
    deleteCircles();
    const squares = document.getElementsByClassName("square");
    for(let i = 0; i < squares.length; i++){
        const square = squares[i];
        square.onclick = null;
    }
    const figures = document.getElementsByClassName("figure");
    for(let i = 0; i < figures.length; i++){
        const figure = figures[i];
        figure.onclick = null;
    }
}

function deleteCircles(){
    const circles = document.getElementsByClassName("possible-move");
    if(circles){
        for(let i = circles.length - 1; i >= 0; i--){
            const circle = circles[i];
            circle.parentNode.onclick = null;
            circle.remove();
        }
    }
    const square = document.getElementById("selected-square");
    if(square){
        square.remove();
    }

    return
}

function getNewSquare(move, moveTurn){
    if(move.length === 2){
        return {newSquare: move, promotion: false, castle: false};
    }
    if(move === "O-O"){
        if(moveTurn === "w"){
            return {newSquare: "g1", promotion: false, castle: true};
        }
        if(moveTurn === "b"){
            return {newSquare: "g8", promotion: false, castle: true};
        }
    }
    else if(move === "O-O-O"){
        if(moveTurn === "w"){
            return {newSquare: "c1", promotion: false, castle: true};
        }
        if(moveTurn === "b"){
            return {newSquare: "c8", promotion: false, castle: true};
        }
    }
    else if(move.includes("=")){
        if(move[2] === "="){
            return {newSquare: move.slice(0, 2), promotion: true, castle: false};
        }
        else if(move[4] === "="){
            return {newSquare: move.slice(2, 4), promotion: true, castle: true};
        }
    }
    let newSquare = move.replaceAll("+", "");
    newSquare = newSquare.replaceAll("x", "");
    newSquare = newSquare.replaceAll("#", "");
    newSquare = newSquare.replaceAll("B", "");
    newSquare = newSquare.replaceAll("N", "");
    newSquare = newSquare.replaceAll("K", "");
    newSquare = newSquare.replaceAll("Q", "");
    newSquare = newSquare.replaceAll("R", "");

    if(newSquare.length === 2){
        return {newSquare: newSquare, promotion: false};
    }
    else if(newSquare.length === 3){
        return {newSquare: newSquare.slice(1), promotion: false};
    }
}

export function rotateBoard(){
    const squares = document.getElementsByClassName("square");
    for(let i = 0; i < squares.length; i++){
        const square = squares[i];
        square.id = squareOrderForFEN[63 - squareOrderForFEN.indexOf(square.id)];
    }

    const rowCoords = document.getElementsByClassName("row coord");
    for(let i = 0; i < rowCoords.length; i++){
        const rowCoord = rowCoords[i];
        rowCoord.innerText = 9 - parseInt(rowCoord.innerText);
    }

    const coords = "abcdefgh";
    const colCoords = document.getElementsByClassName("col coord");
    for(let i = 0; i < colCoords.length; i++){
        const colCoord = colCoords[i];
        colCoord.innerText = coords[7 - coords.indexOf(colCoord.innerText)];
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function showCorrectAnswer(puzzle, ms, dispatch){
    clearBoard();
    const tempChess = new Chess(puzzle.fen);
    if(puzzle.moves[0].includes("O")){
        tempChess.move(puzzle.moves[0]);
    }
    else if(puzzle.moves[0].length === 4){
        tempChess.move({from: puzzle.moves[0].slice(0, 2), to: puzzle.moves[0].slice(2, 4)});
    }
    else if(puzzle.moves[0].length > 4){
        tempChess.move({from: puzzle.moves[0].slice(0, 2), to: puzzle.moves[0].slice(2, 4), promotion: puzzle.moves[0][4]});
    }
    generateChessPosition(tempChess.fen(), dispatch);
    staticBoard()
    for(let i = 1; i < puzzle.moves.length; i++){
        await sleep(ms);
        if(puzzle.moves[i].includes("O")){
            tempChess.move(puzzle.moves[i]);
        }
        else if(puzzle.moves[i].length === 4){
            tempChess.move({from: puzzle.moves[i].slice(0, 2), to: puzzle.moves[i].slice(2, 4)});
        }
        else if(puzzle.moves[i].length > 4){
            tempChess.move({from: puzzle.moves[i].slice(0, 2), to: puzzle.moves[i].slice(2, 4), promotion: puzzle.moves[i][4]});
        }
        const FEN = tempChess.fen();
        clearBoard();
        generateChessPosition(FEN, dispatch);
        staticBoard();
    }
}

export function generateChessPositionForBlitz(FEN, dispatch, n){
    const [position, moveTurn, castlingPossible, enPassantTarget, halfMoveClock, moveNumber] = FEN.split(" ");

    const chess = new Chess(FEN);

    let i = 0;
    for(let j = 0; j < position.length; j++){
        const char = position[j];
        if(char in picturesHrefForFEN){
            const squareCoord = squareOrderForFEN[i];
            const square = document.getElementById(squareCoord);
            const img = document.createElement("img");
            img.className = "figure";
            const possibleMoves = chess.moves({square : squareCoord});
            if(possibleMoves){
                if(chess.get(squareCoord).color === moveTurn){
                    img.onclick = () => {
                        deleteCircles();
                        const imgSquare = document.createElement("img");
                        imgSquare.src = blueSquareUrl;
                        imgSquare.id = "selected-square";
                        imgSquare.style.position = "absolute";
                        imgSquare.style.opacity = 0.4;
                        imgSquare.width = 70;
                        imgSquare.height = 70;
                        square.appendChild(imgSquare);
                        for(let k = 0; k < possibleMoves.length; k++){
                            const possibleMove = possibleMoves[k];
                            const {newSquare, promotion, castle} = getNewSquare(possibleMove, moveTurn);
                            const imgCircle = document.createElement("img");
                            const squarePossible = document.getElementById(newSquare);
                            if(!promotion){
                                imgCircle.src = blueCircleUrl;
                                imgCircle.className = "possible-move";
                                imgCircle.width = 30;
                                imgCircle.height = 30;
                                squarePossible.appendChild(imgCircle);
                                if(chess.get(newSquare)){
                                    imgCircle.src = greenCircleUrl;
                                    imgCircle.style.position = "absolute";
                                    imgCircle.style.opacity = 0.8;
                                }
                                if(!castle){
                                    squarePossible.onclick = () => dispatch(makeMoveForBlitz({n: n, userMove: square.id + squarePossible.id}));
                                }
                                else{
                                    squarePossible.onclick = () => dispatch(makeMoveForBlitz({n: n, userMove: possibleMove}));
                                }
                            }
                            else{
                                if(squarePossible.querySelector('img.possible-move') === null){
                                    imgCircle.src = blueCircleUrl;
                                    imgCircle.className = "possible-move";
                                    imgCircle.width = 30;
                                    imgCircle.height = 30;
                                    squarePossible.appendChild(imgCircle);
                                    if(chess.get(newSquare)){
                                        imgCircle.src = greenCircleUrl;
                                        imgCircle.style.position = "absolute";
                                        imgCircle.style.opacity = 0.8;
                                    }
                                    squarePossible.onclick = () => dispatch(makePromotionForBlitz({n: n, userMove: square.id + squarePossible.id}));
                                }
                            }
                        }
                    }
                }
            }
            img.src = picturesHrefForFEN[char];
            img.width = 70;
            img.height = 70;
            square.appendChild(img);
            i += 1;
        }
        else if (char >= '0' && char <= '9') {
            i += parseInt(char);
        }
    }

    return chess;
}

export function generateChessPositionForSeries(FEN, dispatch, n){
    const [position, moveTurn, castlingPossible, enPassantTarget, halfMoveClock, moveNumber] = FEN.split(" ");

    const chess = new Chess(FEN);

    let i = 0;
    for(let j = 0; j < position.length; j++){
        const char = position[j];
        if(char in picturesHrefForFEN){
            const squareCoord = squareOrderForFEN[i];
            const square = document.getElementById(squareCoord);
            const img = document.createElement("img");
            img.className = "figure";
            const possibleMoves = chess.moves({square : squareCoord});
            if(possibleMoves){
                if(chess.get(squareCoord).color === moveTurn){
                    img.onclick = () => {
                        deleteCircles();
                        const imgSquare = document.createElement("img");
                        imgSquare.src = blueSquareUrl;
                        imgSquare.id = "selected-square";
                        imgSquare.style.position = "absolute";
                        imgSquare.style.opacity = 0.4;
                        imgSquare.width = 70;
                        imgSquare.height = 70;
                        square.appendChild(imgSquare);
                        for(let k = 0; k < possibleMoves.length; k++){
                            const possibleMove = possibleMoves[k];
                            const {newSquare, promotion, castle} = getNewSquare(possibleMove, moveTurn);
                            const imgCircle = document.createElement("img");
                            const squarePossible = document.getElementById(newSquare);
                            if(!promotion){
                                imgCircle.src = blueCircleUrl;
                                imgCircle.className = "possible-move";
                                imgCircle.width = 30;
                                imgCircle.height = 30;
                                squarePossible.appendChild(imgCircle);
                                if(chess.get(newSquare)){
                                    imgCircle.src = greenCircleUrl;
                                    imgCircle.style.position = "absolute";
                                    imgCircle.style.opacity = 0.8;
                                }
                                if(!castle){
                                    squarePossible.onclick = () => dispatch(makeMoveForSeries({n: n, userMove: square.id + squarePossible.id}));
                                }
                                else{
                                    squarePossible.onclick = () => dispatch(makeMoveForSeries({n: n, userMove: possibleMove}));
                                }
                            }
                            else{
                                if(squarePossible.querySelector('img.possible-move') === null){
                                    imgCircle.src = blueCircleUrl;
                                    imgCircle.className = "possible-move";
                                    imgCircle.width = 30;
                                    imgCircle.height = 30;
                                    squarePossible.appendChild(imgCircle);
                                    if(chess.get(newSquare)){
                                        imgCircle.src = greenCircleUrl;
                                        imgCircle.style.position = "absolute";
                                        imgCircle.style.opacity = 0.8;
                                    }
                                    squarePossible.onclick = () => dispatch(makePromotionForSeries({n: n, userMove: square.id + squarePossible.id}));
                                }
                            }
                        }
                    }
                }
            }
            img.src = picturesHrefForFEN[char];
            img.width = 70;
            img.height = 70;
            square.appendChild(img);
            i += 1;
        }
        else if (char >= '0' && char <= '9') {
            i += parseInt(char);
        }
    }

    return chess;
}