import React from 'react';
import { auth } from '../../firebase/firebase';
import '../../css/ContactPage.css';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
const contactImg = require('../../icons/contact.png');
const logoutImg = require('../../icons/logout.png');
const profileImg = require('../../icons/profile.png');
const homeImg = require('../../icons/home.png');
const board = require('../../icons/board.png');
const whatsapp = require('../../icons/whatsapp.png');
const linkedin = require('../../icons/linkedin.png');
const github = require('../../icons/github.png');
const email = require('../../icons/email.png');
const cv = require('../../icons/cv.png');


export const ContactPage = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  let name = user.displayName;

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
          <h4 className='title'> Contact us </h4>
          <div className='contact'>
            <div className="business-card">
            <p>**Do you have any ideas for new features or improvements?**
            <br/>
            <br/>
              We'd love to hear from you! Please feel free to contact us using the links below. </p>
              <div className='links'>
              <a
                className='link'
                target="_blank"
              href="mailto:yohanankli@gmail.com">
                      <img src={email} alt="Email Logo" />
                    </a>
                    <a
                      className='link'
                      target="_blank"
                    href="https://wa.me/972586669988">
                      <img src={whatsapp} alt="WhatsApp Logo" />
                    </a>
                    <a
                      className='link'
                      target="_blank"
                    href="https://www.linkedin.com/in/yohanan-kling/">
                      <img src={linkedin} alt="LinkedIn Logo" />
                    </a>
                    <a
                      className='link'
                      target="_blank"
                    href="https://github.com/yohanankling">
                      <img src={github} alt="GitHub Logo" />
                    </a>
                    <a
                      className='link'
                      target="_blank"
                    href="https://drive.google.com/file/d/1el9dCExmLQ_axgGPGSJBs0PbledH1HWi/view">
                      <img src={cv} alt="CV Logo" />
                    </a>
              </div>
              <p>We appreciate your feedback!</p>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};
