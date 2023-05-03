import React, { SyntheticEvent, useState } from 'react';
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
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setrePassword] = useState("");
  const handleRegister = (provider :AuthProvider) => {
    authService.registerWithProvider(provider)
      .then(() => {
        navigate('/');
      });
  }

  const  handleManualRegister = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (password !== repassword) {
      alert('Passwords do not match');
      return;
    }
    authService.registerManualy(email, name, password)
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
          <h1 className="title">Register</h1>
          <div className='register'>
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
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}>
              </input>
              <input
                className={"inputs"}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}>
              </input>
              <input
                className={"inputs"}
                type="password"
                placeholder="Re-password"
                value={repassword}
                onChange={(e) => setrePassword(e.target.value)}>
              </input>
              <button type="submit" className="RegisterBtn">Register</button>
            </form>
          </div>
          <p className='registerMessage'> Or register with: </p>
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
        </div>
    )
}
