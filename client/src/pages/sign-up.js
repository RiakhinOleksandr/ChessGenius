import './login-register.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { signUpUser } from '../authThunk';

function SignUp() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [loginError, setLoginError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [repeatPasswordError, setRepeatPasswordError] = useState(false);
    const [error_msg, setErrorMessage] = useState("")

    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => (state.user.isLoggedIn));
    const userLogin = useSelector((state) => (state.user.login));

    async function handleSubmit(e){
        e.preventDefault();

        let errors = getSignupFormErrors(login, password, repeatPassword);

        if(errors.length > 0){
            setErrorMessage(errors.join(". "));
            return
        }
        else{
            const res = await dispatch(signUpUser({login, password}));
            if(res.payload.message){
                setErrorMessage(res.payload.message);
                setLoginError(true);
                return;
            }
        };
    };

    function getSignupFormErrors(login, password, repeatPassword){
        let errors = []

        if(password !== repeatPassword){
            errors.push("Паролі не збігаються");
            setRepeatPasswordError(true);
        }
        if(password.length <= 6){
            errors.push("Занадто короткий пароль. Він має містити більше 6 символів");
            setPasswordError(true);
        }
        else if(password.length > 25){
            errors.push("Занадто довгий пароль. Він має містити 25 або менше символів");
            setPasswordError(true);
        }
        if(login.length <= 2){
            errors.push("Занадто короткий логін. Він має містити більше 2 символів");
            setLoginError(true);
        }
        else if(login.length > 16){
            errors.push("Занадто довгий логін. Він має містити 16 або менше символів");
            setPasswordError(true);
        }
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
        setRepeatPasswordError(false);
        setErrorMessage("");
        return
    }

    const navigate = useNavigate();

    useEffect(() => {
        if(isLoggedIn && userLogin){
            console.log("User " + userLogin + " successfully registrated");
            navigate("/");
        }
    }, [isLoggedIn, userLogin, navigate])

    return (
        <div id="background-picture">
            <div className="wrapper">
                <h1>Створіть аккаунт</h1>
                <p id="error-message">{error_msg}</p>
                <form method="post" onSubmit={handleSubmit}>
                    <div id="login" className={loginError ? "incorrect" : "correct"}>
                        <input required type="text" id="login-input" placeholder="Введіть логін" onInput={deleteRedBorders} onChange={(e) => {setLogin(e.target.value)}} />
                    </div>
                    <div id="password" className={passwordError ? "incorrect" : "correct"}>
                        <input required type="password" id="password-input" placeholder="Введіть пароль" onInput={deleteRedBorders} onChange={(e) => {setPassword(e.target.value)}} />
                    </div>
                    <div id="repeat-password" className={repeatPasswordError ? "incorrect" : "correct"}>
                        <input required type="password" id="repeat-password-input" placeholder="Введіть пароль ще раз" onInput={deleteRedBorders} onChange={(e) => {setRepeatPassword(e.target.value)}} />
                    </div>
                    <button type="submit">Створити</button>
                    <div id="registration">
                        <p>Вже є аккаунт? <Link to="/login" className="link">Увійти</Link></p>
                    </div>
                </form>
            </div>
        </div>
  );
}

export default SignUp;