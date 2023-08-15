import React, { useEffect, useRef, useState } from 'react';
import '../../css/FriendsPage.css';
import { auth } from '../../firebase/firebase';
import { send } from '../../services/httpContext';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
const contactImg = require('../../icons/contact.png');
const logoutImg = require('../../icons/logout.png');
const profileImg = require('../../icons/profile.png');
const homeImg = require('../../icons/home.png');
const board = require('../../icons/board.png');
const x = require('../../icons/x.png');
const v = require('../../icons/v.png');

export const FriendsPage = () => {
  const navigate = useNavigate();
  const [users, setUsersList] = useState<{ email: string; uid: string }[]>([]);
  const [friendListLoaded, setFriendListLoaded] = useState<boolean>(false);
  const [gameInvites, setGameInvites] = useState<{
    received: any;
    sent: any;
  }>({
    received: {},
    sent: {},
  });
  const thisUser = auth.currentUser;
  const thisName = thisUser?.displayName || '';

  const listenToGameInvites = async () => {
    try {
      const response = await send({ method: 'POST', route: '/invites', data: { uid: auth.currentUser?.uid } });
      setGameInvites(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  listenToGameInvites();


  const gameInvitesRef = useRef(null);

  useEffect(() => {
    if (gameInvitesRef.current) {
      gameInvitesRef.current.on('change', () => {
        listenToGameInvites();
      });
    }

    return () => {
      if (gameInvitesRef.current) {
        gameInvitesRef.current.removeListener('change', listenToGameInvites);
      }
    };
  }, []);

  const generateTotalGameInvites = () => {
    const totalGameInvites = [];

    for (const key in gameInvites.received) {
      totalGameInvites.push({
        status: gameInvites.received[key].status,
        id: key,
        sentByYou: false,
        gameId: gameInvites.received[key].gameId,
      });
    }

    for (const key in gameInvites.sent) {
      totalGameInvites.push({
        status: gameInvites.sent[key].status,
        id: key,
        sentByYou: true,
        gameId: gameInvites.sent[key].gameId,
      });
    }

    return totalGameInvites;
  };

  const answerGameInviteHandler = async (answer: boolean, id: string) => {
    try {
      await send({ method: 'POST', route: '/friends/gameinvite/answer', data: { answer: answer, friendUid: id } });
    } catch (error) {
      console.error(error);
    }
  };

  const inviteToGameHandler = async (invitedFriendId: string) => {
    try {
      const res = await send({ method: 'POST', route: '/friends/gameinvite', data: { friendId: invitedFriendId } });
      // You might want to do something with the response here if needed
    } catch (error) {
      console.error(error);
    }
  };

  const renderGameInvites = () => {
    return generateTotalGameInvites().map((game) => {
      const gameStatusHandler = () => {
        switch (game.status) {
          case 'pending':
            return (
              <div>
                {game.sentByYou ? (
                  <p>Your friend did not answer your invite yet</p>
                ) : (
                  <>
                    <p>Your friend is waiting for you to accept their invite</p>
                    <div className="game-buttons">
                      <button
                        className='clear'
                        onClick={() => {
                          answerGameInviteHandler(true, game.id);
                        }}
                      >
                        <img src={v} alt="accept"/>
                      </button>
                      <button
                        className='clear'
                        onClick={() => {
                          answerGameInviteHandler(false, game.id);
                        }}
                      >
                        <img src={x} alt="reject"/>
                      </button>
                    </div>
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
          default:
            return null;
        }
      };

      return (
        <li key={game.id}>
          {gameStatusHandler()}
        </li>
      );
    });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await send({ method: 'GET', route: '/friends' }) as { data: { email: string; uid: string }[] };
        setUsersList(res.data);
      } catch (error: any) {
        console.error(error);
        alert(error.response?.data.message || 'Error fetching friends list');
      }

      setFriendListLoaded(true);
    };

    fetchUsers();
  }, []);

  const addNewUserHandler = async (newFriendId: string) => {
    try {
      const res = await send({ method: 'POST', route: '/getuid', data: { email: newFriendId } }) as { data: string };
      const FriendUid = res.data;

      const friendRes = await send({ method: 'POST', route: '/friends', data: { newFriendId: FriendUid } }) as { data: { email: string; uid: string }[] };
      setUsersList(friendRes.data);
    } catch (error: any) {
      console.error(error);

      if (error.response?.status === 400 || error.response?.status === 409) {
        alert(error.response.data.message || 'Error adding new friend');
      }
    }
  };

  return (
    <div className={'background'}>
      <img className={'background'} src={board} alt={'background'} />
      <div className='cover'>
        <div className='navbar'>
          <h4 className='name'>{thisName}</h4>
          <div className='navbarBtns'>
            <button
              className='homeBtn'
              onClick={() => {
                navigate('/');
              }}
            >
              <img src={homeImg} alt='Home' />
            </button>
            <button
              className='contactBtn'
              onClick={() => {
                navigate('/contact');
              }}
            >
              <img src={contactImg} alt='Contact' />
            </button>
            <button
              className='profileBtn'
              onClick={() => {
                navigate('/profile');
              }}
            >
              <img className='profileImg' src={profileImg} alt='Profile' />
            </button>
            <button
              className='logoutBtn'
              onClick={() => {
                authService.signOut();
                navigate('/');
              }}
            >
              <img src={logoutImg} alt='Logout' />
            </button>
          </div>
        </div>

        <h4 className='title'> Friends List </h4>
        <div className='friends-list'>
          {friendListLoaded ? (
            users.length === 0 ? (
              <p>No friends added yet</p>
            ) : (
              <ul>
                {users.map((user, i) => (
                  <li key={i}>
                    {user.email}{' '}
                    <button
                      className='invite-button'
                      onClick={() => {
                        inviteToGameHandler(user.uid);
                      }}
                    >
                      Invite to game
                    </button>
                  </li>
                ))}
              </ul>
            )
          ) : (
            <p>Loading..</p>
          )}
        </div>
        <div className='add-friend'>
          <h2 className='subtitle'>Add new friend</h2>
          <input className='input' id='newFriendIdInput' type='text' />
          <button
            className="new-friend-button"
            placeholder="enter friend's email"
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
            <p className='game-message'>You do not have game invites, send your friends an invite or wait to get invited</p>
          ) : (
            <ul>{renderGameInvites()}</ul>
          )}
        </div>
      </div>
    </div>
  );
};
