import React, { useEffect, useState } from 'react';
import '../../css/RandomPage.css';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { ref, onValue, get, push, getDatabase } from 'firebase/database';
import { realTimeDb, auth } from '../../firebase/firebase';
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
      // Check if there is a waiting game in the database
      const waitingGamesRef = ref(getDatabase(), 'waiting_games');
      const snapshot = await get(waitingGamesRef);
      const waitingGames = snapshot.val();
      if (waitingGames) {
        const gameIds = Object.keys(waitingGames);
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
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const listenToGameMatch = () => {
    const starCountRef = ref(realTimeDb, 'games/' + auth.currentUser?.uid);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGameId(auth.currentUser?.uid);
        setIsWaiting(false);
      }
    });

  };

  useEffect(() => {
    handleRandomOpponent();
    listenToGameMatch();
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
