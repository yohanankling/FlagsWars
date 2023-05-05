import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase/firebase';
import '../../css/ProfilePage.css';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { send } from '../../services/httpContext';
const contactImg = require('../../icons/contact.png');
const logoutImg = require('../../icons/logout.png');
const profileImg = require('../../icons/profile.png');
const homeImg = require('../../icons/home.png');
const board = require('../../icons/board.png');


export const ProfilePage = () => {
  const navigate = useNavigate();

  const user = auth.currentUser;
  let name = user.displayName;
  const email = user.email;
  const uid = user.uid;
  let doc;
  const [friends, setFriends] = useState(0);
  const [won, setWon] = useState(0);
  const [lose, setLose] = useState(0);

  const fetchDoc = async () => {
    try {
      const res = await send({ method: 'POST', route: '/getDoc', data: { uid: uid } });
      doc = res.data;
      setFriends(doc.friends.length);
      // setFriends(doc.friends.won);
      // setFriends(doc.friends.lose);
    } catch (error: any) {
      console.error(error);}
  };

  useEffect(() => {
    fetchDoc();
  }, []);


  return (
    <div className={"background"}>
      <img className={"background"} src={board} alt={"background"}/>
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
          <h4 className='title'> Profile </h4>
          <div className='profile-info'>
            <table>
              <tr>
                <td>name</td>
                <td>{name}</td>
              </tr>
              <tr>
                <td>email</td>
                <td>{email}</td>
              </tr>
              <tr>
                <td>friends</td>
                <td>{friends}</td>
              </tr>
              <tr>
                <td>win</td>
                <td>{won}</td>
              </tr>
              <tr>
                <td>lose</td>
                <td>{lose}</td>
              </tr>
            </table>
          </div>
        </>
      </div>
    </div>
  );
};
