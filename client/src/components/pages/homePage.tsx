import React from 'react';
import '../../css/HomePage.css';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
const contactImg = require('../../icons/contact.png');
const logoutImg = require('../../icons/logout.png');
const profileImg = require('../../icons/profile.png');
const homeImg = require('../../icons/home.png');
const board = require('../../icons/board.png');


export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={"background"}>
      <img className={"background"} src={board} alt={"background"}/>
    <div className='cover'>
      <>
        <div className='navbar'>
          <h4 className='name'> bla bla </h4>
          <div className='navbarBtns'>
            <button className='homeBtn'
                    onClick={() => {
                      navigate('/');
                    }}>
              <img src={homeImg} alt='Home' />
            </button>
            <button className='contactBtn'
                    onClick={() => {
                      navigate('/contact');
                    }}>
              <img src={contactImg} alt='Contact' />
            </button>
            <button className='profileBtn'
                    onClick={() => {
                      navigate('/profile');
                    }}>
              <img className='profileImg' src={profileImg} alt='Profile' />
            </button>
            <button className='logoutBtn'
                    onClick={() => {
                      authService.signOut();
                    }}>
              <img src={logoutImg} alt='Logout' />
            </button>
          </div>
        </div>
        <h4 className='title'> menu </h4>
        <div className='buttons'>
        <button
          className="FriendsBtn"
          onClick={() => {navigate('/friends');}}>
          Friends
        </button>
        <button
          className="gameBtn"
          onClick={() => {navigate('/offline');}}>
          Flags Bot
        </button>
        <button
          className="scoreBtn"
          onClick={() => {navigate('/scores');}}>
          Tables
        </button>
        </div>
      </>
    </div>
    </div>
  );
};