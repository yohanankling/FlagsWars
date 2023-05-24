import React, { useEffect, useState } from 'react';
import '../../css/RandomPage.css';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { auth } from '../../firebase/firebase';
import { send } from '../../services/httpContext';
const contactImg = require('../../icons/contact.png');
const logoutImg = require('../../icons/logout.png');
const profileImg = require('../../icons/profile.png');
const homeImg = require('../../icons/home.png');
const board = require('../../icons/board.png');

export const RandomPage = () => {
  const navigate = useNavigate();
  const thisUser = auth.currentUser;
  let thisName = thisUser.displayName;
  const [isWaiting, setIsWaiting] = useState(true);
  const [gameId, setGameId] = useState("");

  const handleRandomOpponent = async () => {
    try {
      const res = await send({ method: 'POST', route: '/waiting_games'});
      const data = res.data;
      console.log(data)
      if (data) {
        const gameIds = Object.keys(data);
        const opponentUid = gameIds[0];
        try {
         const res = await send({ method: 'POST', route: '/randomgame/match', data: { friendUid: opponentUid } });
         setGameId(res.data);
         send({ method: 'POST', route: '/delrandomgame', data: { inviter: opponentUid } });
          setIsWaiting(false);
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          await send({ method: 'POST', route: '/randomgame', data: { inviter: auth.currentUser?.uid } });
          const eventSource = new EventSource(`http://localhost:3001/waiting_games_listener?id=${auth.currentUser?.uid}`);
          eventSource.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            console.log(data)
            if (data === "empty") {
              setGameId(auth.currentUser?.uid);
              setIsWaiting(false);
            }
          });
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleRandomOpponent();
  }, []);

    return (
    <div className={'background'}>
      <img className={'background'} src={board} alt={'background'} />
      <div className='cover'>
        <>
          <div className='navbar'>
            <h4 className='name'>{thisName}</h4>
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
                        navigate('/');
                      }}>
                <img src={logoutImg} alt='Logout' />
              </button>
            </div>
          </div>
          </>
          <h4 className='title'> Random opponents </h4>
        <div className='random'> </div>
        {isWaiting ? (
          <div className='waiting-div'>
            <h4 className='waiting-message'>waiting for an opponent...</h4>
            <div id="spinner" className="Rspinner"></div>
            <button className='CancelBtn'
                    onClick={async () => {
                      send({ method: 'POST', route: '/delrandomgame', data: { inviter: auth.currentUser.uid } });
                      navigate('/');
                    }}>
              Cancel
            </button>
          </div>
        ) : (
          <>
            <div className='join'>
              <h4 className='tip'>Opponent found!</h4>
            <Link className='link' to={'/game/' + gameId}>Join the game</Link>
            </div>
          </>)
        }
    </div>
    </div>
  );
};
