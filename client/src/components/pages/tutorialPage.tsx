import React, { useState } from 'react';
import { auth } from '../../firebase/firebase';
import '../../css/TutorialPage.css';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
const board = require('../../icons/board.png');

const images = [
  { src: require('../../icons/board.png'), alt: 'Image 1', description: 'Description of Image 1' },
  { src: require('../../icons/facebook.png'), alt: 'Image 2', description: 'Description of Image 2' },
  { src: require('../../icons/addfriend.png'), alt: 'Image 3', description: 'Description of Image 3' },
];

export const TutorialPage = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const email = user.email;
  let name = user.displayName;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextClick = () => {
    setCurrentImageIndex(currentImageIndex + 1);
  };

  const handlePreviousClick = () => {
    setCurrentImageIndex(currentImageIndex - 1);
  };

  const currentImage = images[currentImageIndex];

  return (
    <div className={"background"}>
      <img className={"background"} src={board} alt={"background"}/>
      <div className='cover'>
        <>
          <div className='navbar'>
            <h4 className='name'>{name}</h4>
            <div className='navbarBtns'>
              <button className='homeBtn' onClick={() => navigate('/')}>
                <img src={require('../../icons/home.png')} alt='Home' />
              </button>
              <button className='contactBtn' onClick={() => navigate('/contact')}>
                <img src={require('../../icons/contact.png')} alt='Contact' />
              </button>
              <button className='profileBtn' onClick={() => navigate('/profile')}>
                <img className='profileImg' src={require('../../icons/profile.png')} alt='Profile' />
              </button>
              <button className='logoutBtn' onClick={() => {
                authService.signOut();
                navigate('/');
              }}>
                <img src={require('../../icons/logout.png')} alt='Logout' />
              </button>
            </div>
          </div>
          <div className="images-div">
            <img className='tutorial-images' src={currentImage.src} alt={currentImage.alt} />
          </div>
          <div className='buttons'>
            <button
              className="previous"
              onClick={handlePreviousClick}
              disabled={currentImageIndex === 0}>
              Previous
            </button>
            <button
              className="next"
              onClick={handleNextClick}
              disabled={currentImageIndex === images.length - 1}>
              Next
            </button>
          </div>
          <div className='message-box'>
            <div className='text'> {currentImage.description}</div>
          </div>
        </>
      </div>
    </div>
  );
};
