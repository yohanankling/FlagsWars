import React, { useState, useEffect } from 'react';
import '../../css/WelcomePage.css';
import { Link } from 'react-router-dom'

export const WelcomePage = () => {
  const [popupStyle, showPopup] = useState("");

  useEffect(() => {
    showPopup("game-popup");
  }, []);

  return (
    <div className="background">
      <img className={"background"} src={require('../../icons/board.png')} alt={"background"}/>
      <div className="cover">
      <>
          <p className="welcome">welcome to flags war!</p>
          <div className={popupStyle}>
            <img className="image" src={require('../../icons/game.png')} width={30} height={30} alt={"board"}/>
          </div>
          <div className="buttons">
            <Link className="links" to="/login">
              <button className="loginBtn">
                Login
              </button>
            </Link>
            <Link className="links" to="/register">
              <button className="registerBtn">
                Register
              </button>
            </Link>
          </div>
        </>
    </div>
    </div>
  );
};
