import './main-page.css';
import { Link } from 'react-router-dom';

function MainPage() {
    return (
        <div id="top">
            <Link to="/puzzles">Задачі</Link>
            <Link to="/two-min-puzzles">Двохвилинний набір задач</Link>
            <Link to="/five-min-puzzles">П'ятихвилинний набір задач</Link>
            <Link to="/profile">Профіль</Link>
        </div>
    );
}

export default MainPage;