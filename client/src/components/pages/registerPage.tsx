import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../../css/RegisterPage.css';
import {
  AuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
} from 'firebase/auth';
import authService from '../../services/authService'
const board = require('../../icons/board.png');

export const RegisterPage = () => {
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
          <h1 className="title">Register</h1>
          <div className={'alt-register'}>
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
        </div>
        </div>
    )
}
