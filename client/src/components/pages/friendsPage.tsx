import React, { useEffect, useState } from 'react';
import '../../css/FriendsPage.css';
import { auth, realTimeDb } from '../../firebase/firebase';
import { send } from '../../services/httpContext';
import { ref, onValue } from 'firebase/database';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const contactImg = require('../../icons/contact.png');
const logoutImg = require('../../icons/logout.png');
const profileImg = require('../../icons/profile.png');
const homeImg = require('../../icons/home.png');
const board = require('../../icons/board.png');

export const FriendsPage = () => {
  const navigate = useNavigate();
  const [users, setUsersList] = useState<{ email: string; uid: string }[]>([]);
  const [friendListLoaded, setFriendListLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [gameInvites, setGameInvites] = useState<{
    received: any;
    sent: any;
  }>({
    received: {},
    sent: {},
  });
  const user = auth.currentUser;
  let name = user.displayName;
  const listenToGameInvites = () => {
    const starCountRef = ref(realTimeDb, 'game_invites/' + auth.currentUser?.uid);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      const sentInvites = data?.sent;
      const receivedInvites = data?.received;
      setGameInvites({
        received: receivedInvites,
        sent: sentInvites,
      });
    });
  };

  const generateTotalGameInvites = () => {
    const totalGameInvites = [];

    for (const key in gameInvites.received) {
      console.log(`${key}: ${gameInvites.received[key]}`);
      totalGameInvites.push({
        status: gameInvites.received[key].status,
        // email: gameInvites.received[i].fromEmail,
        id: key,
        sentByYou: false,
        gameId: gameInvites.received[key].gameId,
      });
    }

    for (const key in gameInvites.sent) {
      console.log(`${key}: ${gameInvites.sent[key]}`);
      totalGameInvites.push({
        status: gameInvites.sent[key].status,
        // email: gameInvites.received[i].fromEmail,
        id: key,
        sentByYou: true,
        gameId: gameInvites.sent[key].gameId,
      });
    }

    return totalGameInvites;
  };

  const renderGameInvites = () => {
    const renderedTotalGameInvites = generateTotalGameInvites().map((game) => {
      const gameStatusHandler = () => {
        switch (game.status) {
          case 'pending':
            return (
              <div>
                {game.sentByYou ? (
                  <p>Your friend did not answer your invite yer</p>
                ) : (
                  <>
                    <p>You friend is waiting for you to accept their invite</p>
                    <button
                      onClick={() => {
                        answerGameInviteHandler(true, game.id);
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        answerGameInviteHandler(false, game.id);
                      }}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            );
          case 'ongoing':
            return (
              <div>
                <p>Game is live!</p>
                <Link to={'/game/' + game?.gameId}>Join game</Link>
              </div>
            );
        }
      };

      return (
        <li>
          <p>Uid: {game.id}</p>
          {gameStatusHandler()}
        </li>
      );
    });

    return renderedTotalGameInvites;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await send({ method: 'GET', route: '/friends' });
        setUsersList(res.data);
        console.log(res.data);
      } catch (error: any) {
        console.error(error);
        setError(error.response.data.message);
      }

      setFriendListLoaded(true);
    };

    fetchUsers().catch(console.error);
    listenToGameInvites();
  }, []);

  const addNewUserHandler = async (newFriendId: string) => {
    try {
      const res = await send({ method: 'POST', route: '/friends', data: { newFriendId: newFriendId } });
      setUsersList(res.data);
    } catch (error: any) {
      console.error(error);

      if (error.response.status === 400) {
        console.error(error);
        setError(error.response.data.message);
      }

      if (error.response.status === 409) {
        console.error(error);
        setError(error.response.data.message);
      }
    }
  };

  const inviteToGameHandler = async (invitedFriendId: string) => {
    try {
      const res = await send({ method: 'POST', route: '/friends/gameinvite', data: { friendId: invitedFriendId } });
    } catch (error) {
      console.error(error);
    }
  };

  const answerGameInviteHandler = async (answer: boolean, id: string) => {
    try {
      send({ method: 'POST', route: '/friends/gameinvite/answer', data: { answer: answer, friendUid: id } });
    } catch (error) {
      console.error(error);
    }
  };

  const gameInvitesPostRender = renderGameInvites();

  return (
    <div className={'background'}>
      <img className={'background'} src={board} alt={'background'} />
      <div className='cover'>
        <>
          <div className='navbar'>
            <h4 className='name'>{name}</h4>
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

          <h4 className='title'> Friends List </h4>
      {friendListLoaded ? (
        <ul>
          {users.map((user, i) => {
            return (
              <li key={i}>
                {user.email}{' '}
                <button
                  onClick={() => {
                    inviteToGameHandler(user.uid);
                  }}
                >
                  Invite to game
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Loading..</p>
      )}
      <div className='add-friend'>
      <h2 className='subtitle'>Add new friend</h2>
      <input className='input' id='newFriendIdInput' type='text'/>
      <button
        className="new-friend-button"
        onClick={() => {
          addNewUserHandler((document.querySelector('#newFriendIdInput') as any)?.value);
        }}
      >
        Add
      </button>
      </div>
      <div className='game-invites'>
        <h2 className='subtitle'>Game Invites</h2>
        {!generateTotalGameInvites().length ? (
          <p className='game-message'>You do not have game invites, send your friends a invite or wait to get invited</p>
        ) : (
          <ul>{renderGameInvites()}</ul>
        )}
      </div>
      {error ? <p>Error: {error}</p> : null}
        </>
      </div>
      </div>
);
};
