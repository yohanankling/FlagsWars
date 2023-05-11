import React, { useState } from 'react';
import { auth } from '../../firebase/firebase';
import '../../css/TutorialPage.css';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import {
  Child,
  Death,
  Devil,
  Dwarf,
  Flag,
  Knight,
  Mommy,
  Ninja,
  Odin,
  team,
  Thor,
  Troll,
  Viking,
  Wizard,
} from 'common';

const board = require('../../icons/board.png');

const images = [
  { src: require('../../icons/setup.gif'), alt: 'Image 1', description: 'The goal is to capture opponent flag as it win the game! \nSetting up your assets carefully as it has great effect on your game and strategy!' },
  { src: require('../../icons/reveal.gif'), alt: 'Image 2', description: 'In the beginning all of your pieces are in invisible mode, after a battle, if you will survive of course, your opponent can see the survivor!' },
  { src: require('../../icons/wizard.gif'), alt: 'Image 3', description: 'The wizard can use his special abilities to train your regular assets up to 3 times, or reveal your opponent piece 1 time, use it with wisdom ha?' },
  { src: require('../../icons/ninja.gif'), alt: 'Image 4', description: 'Well, a ninja like a ninja use his skill to move two squares at once and even jump over pieces!' },
  { src: require('../../icons/death.gif'), alt: 'Image 5', description: 'Death, who is not afraid from him... execute his enemy back to hell and finish his job in the battle'},
  { src: require('../../icons/devil.gif'), alt: 'Image 6', description: 'The devil is champ in disguise, whatever he touch he became! careful what you touch as you have no revers!' },
  { src: require('../../icons/dwarf and troll.gif'), alt: 'Image 7', description: 'Troll is win everyone in battle..just dont hit the dwarf!' },
  { src: require('../../icons/mommy.gif'), alt: 'Image 8', description: 'No one want to fall into the mommy trap that is for sure!' },
];

const child_blue = require('../../assets/child_blue.png');
const death_blue = require('../../assets/death_blue.png');
const devil_blue = require('../../assets/devil_blue.png');
const dwarf_blue = require('../../assets/dwarf_blue.png');
const flag_blue = require('../../assets/flag_blue.png');
const knight_blue = require('../../assets/knight_blue.png');
const mommy_blue = require('../../assets/mommy_blue.png');
const ninja_blue = require('../../assets/ninja_blue.png');
const odin_blue = require('../../assets/odin_blue.png');
const thor_blue = require('../../assets/thor_blue.png');
const troll_blue = require('../../assets/troll_blue.png');
const viking_blue = require('../../assets/viking_blue.png');
const wizard_blue = require('../../assets/wizard_blue.png');
const eyeImage = require('../../assets/eye.png');

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
          <div className='details'>
            <div className="icons">
              <br />
                <img className="image"
                     src={dwarf_blue}
                     onClick={() => {
                       const entity = new Dwarf(team.blue);
                       alert("type: " + entity.type + "\n" +
                         "level: "
                         + entity.level+ "\n" +
                       "special ability: win the troll")
                     }}
                     alt={"dwarf"}/>
              <img className="image"
                   src={death_blue}
                   onClick={() => {
                     const entity = new Death(team.blue);
                     alert("type: " + entity.type + "\n" +
                       "level: "
                       + entity.level+ "\n" +
                       "special ability: suicide with the opponent")
                   }}
                   alt={"death"}/>
              <img className="image"
                   src={devil_blue}
                   onClick={() => {
                     const entity = new Devil(team.blue);
                     alert("type: " + entity.type + "\n" +
                       "level: "
                       + entity.level+ "\n" +
                       "special ability: clone the attacker")
                   }}
                   alt={"devil"}/>
              <img className="image"
                   src={flag_blue}
                   onClick={() => {
                     const entity = new Flag(team.blue);
                     alert("type: " + entity.type + "\n" +
                       "level: "
                       + entity.level+ "\n" +
                       "special ability: cannot move, end the game when captured")
                   }}
                   alt={"flag"}/>
              <img className="image"
                   src={mommy_blue}
                   onClick={() => {
                     const entity = new Mommy(team.blue);
                     alert("type: " + entity.type + "\n" +
                       "level: "
                       + entity.level+ "\n" +
                       "special ability: cannot move, capture whoever touch him")
                   }}
                   alt={"mommy"}/>
              <img className="image"
                   src={ninja_blue}
                   onClick={() => {
                     const entity = new Ninja(team.blue);
                     alert("type: " + entity.type + "\n" +
                       "level: "
                       + entity.level+ "\n" +
                       "special ability: jump 2 squares at once, have nice strength")
                   }}
                   alt={"ninja"}/>
              <img className="image"
                   src={wizard_blue}
                   onClick={() => {
                     const entity = new Wizard(team.blue);
                     alert("type: " + entity.type + "\n" +
                       "level: "
                       + entity.level+ "\n" +
                       "train: " + entity.train + "\n" +
                       "reveal: " + entity.reveal + "\n"+
                       "special ability: can reveal hidden opponent, can train your pieces")
                   }}
                   alt={"wizard"}/>
              <img className="image"
                   src={troll_blue}
                   onClick={() => {
                     const entity = new Troll(team.blue);
                     alert("type: " + entity.type + "\n" +
                       "level: "
                       + entity.level+ "\n" +
                       "special ability: have extraordinary strength, watch not to attack the dwarf, death, devil or mommy!")
                   }}
                   alt={"troll"}/>
              <img className="image"
                   src={child_blue}
                   onClick={() => {
                     const entity = new Child(team.blue);
                     alert("type: " + entity.type + "\n" +
                       "level: "
                       + entity.level+ "\n" +
                       "special ability: well..nothing for now.. try to evolve it!")
                   }}
                   alt={"child"}/>
              <img className="image"
                   src={knight_blue}
                   onClick={() => {
                     const entity = new Knight(team.blue);
                     alert("type: " + entity.type + "\n" +
                       "level: "
                       + entity.level+ "\n" +
                       "special ability: the evolving of child")
                   }}
                   alt={"knight"}/>
              <img className="image"
                   src={viking_blue}
                   onClick={() => {
                     const entity = new Viking(team.blue);
                     alert("type: " + entity.type + "\n" +
                       "level: "
                       + entity.level+ "\n" +
                       "special ability: the evolving of knight")
                   }}
                   alt={"viking"}/>
              <img className="image"
                   src={thor_blue}
                   onClick={() => {
                     const entity = new Thor(team.blue);
                     alert("type: " + entity.type + "\n" +
                       "level: "
                       + entity.level+ "\n" +
                       "special ability: the evolving of viking")
                   }}
                   alt={"thor"}/>
              <img className="image"
                   src={odin_blue}
                   onClick={() => {
                const entity = new Odin(team.blue);
                alert("type: " + entity.type + "\n" +
                  "level: "
                  + entity.level+ "\n" +
                  "special ability: the evolving of thor! look at his level!")
              }}
                   alt={"odin"}/>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};
