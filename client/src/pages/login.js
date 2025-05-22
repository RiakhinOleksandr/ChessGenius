import './login-register.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../authThunk';

function Login() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [error_msg, setErrorMessage] = useState("")

    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => (state.auth.isLoggedIn));
    const userLogin = useSelector((state) => (state.auth.login));

    async function handleSubmit(e){
        e.preventDefault();

        let errors = getLoginFormErrors(login, password);

        if(errors.length > 0){
            setErrorMessage(errors.join(". "));
            return
        }
        else{
            const res = await dispatch(loginUser({login, password})).unwrap();
                if(res.error){
                    setErrorMessage(res.error);
                    setLoginError(true);
                    return;
                }         
        };
    };

    function getLoginFormErrors(login, password){
        let errors = []

        if(login.includes("AND") || password.includes("AND") || login.includes("OR") || password.includes("OR") ||
        login.includes("=") || password.includes("=") || login.includes("true") || password.includes("true")){
            errors.push("Логін чи пароль містять недопустимі символи");
            setLoginError(true);
            setPasswordError(true);
        }

        return errors;
    }

    function deleteRedBorders(){
        setLoginError(false);
        setPasswordError(false);
        setErrorMessage("");
        return
    }

    const navigate = useNavigate();

    useEffect(() => {
        if(isLoggedIn && userLogin){
            console.log("User " + userLogin + " successfully logged in");
            navigate("/");
        }
    }, [isLoggedIn, userLogin, navigate])

    return (
        <div id="background-picture">
            <div id="wrapper">
                <h1>Увійдіть у аккаунт</h1>
                <p id="error-message">{error_msg}</p>
                <form id="form" onSubmit={handleSubmit}>
                    <div id="login" className={loginError ? "incorrect" : "correct"}>
                        <input required type="text" id="login-input" placeholder="Введіть логін" onInput={deleteRedBorders} onChange={(e) => {setLogin(e.target.value)}} />
                    </div>
                    <div id="password" className={passwordError ? "incorrect" : "correct"}>
                        <input required type="password" id="password-input" placeholder="Введіть пароль" onInput={deleteRedBorders} onChange={(e) => {setPassword(e.target.value)}} />
                    </div>
                    <button type="submit">Увійти</button>
                    <div id="registration">
                        <p>Ще немає аккаунту? <Link to="/sign-up" className="link">Створити аккаунт</Link></p>
                    </div>
                </form>
            </div>
        </div>
  );
}

export default Login;