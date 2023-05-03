import React, { SyntheticEvent, useState } from 'react';
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (provider :AuthProvider) => {
    authService.registerWithProvider(provider)
      .then(() => {
        navigate('/');
      });
  }

  const  handleManualRegister = async (e: SyntheticEvent) => {
    e.preventDefault();
    authService.signInManualy(email, password)
      .then(() => {
        navigate('/');
      })
      .catch((error: any) => {
        alert(error.message);
      });
  };
  return (
      <div className={"background"}>
        <img className={"background"} src={board} alt={"background"}/>
        <div className={"cover"}>
          <h1 className="title">Login</h1>
          <div className='manual-register'>
            <form className='form' onSubmit={handleManualRegister}>
              <input
                className={"inputs"}
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}>
              </input>
              <input
                className={"inputs"}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}>
              </input>
              <button type="submit" className="LoginBtn">Register</button>
            </form>
          </div>
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
