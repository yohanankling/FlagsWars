import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../../css/LoginPage.css';
import {
  GoogleAuthProvider,
  FacebookAuthProvider, AuthProvider,
} from 'firebase/auth';
import { Link } from 'react-router-dom'
import authService from '../../services/authService'
const board = require('../../icons/board.png');

export const LoginPage = () => {
  const navigate = useNavigate();
  const handleRegister = (provider :AuthProvider) => {
    authService.registerWithProvider(provider)
      .then(() => {
        navigate('/');
      });
  }
  return (
      <div className={"background"}>
        <img className={"background"} src={board} alt={"background"}/>
        <div className={"cover"}>
          <h1 className="title">Login</h1>
          <div className={'alt-login'}>
                <button
                    className={'google'}
                    onClick={() => handleRegister(new GoogleAuthProvider())}
                >
                </button>
                <button
                    className={'facebook'}
                    onClick={() => handleRegister(new FacebookAuthProvider())}
                >
                </button>
            </div>
            <p className="registerMessage">
            Did you not create account?<span> </span>
                <Link to="/register">Register</Link>
                <span> </span> now!
            </p>
        </div>
        </div>
    )
}
