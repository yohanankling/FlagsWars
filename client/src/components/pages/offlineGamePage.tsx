import React, { useState } from 'react';
import { auth } from '../../firebase/firebase';
import classNames from 'classnames';
import '../../css/game.css';
import {
  Cell,
  Child,
  color,
  Death,
  Devil,
  Dwarf,
  Entity,
  entityType,
  Flag,
  GameManagerFactory,
  Knight,
  MarkerBoard,
  Mommy,
  Ninja,
  Odin, Position,
  Team,
  team,
  Thor,
  Troll,
  Viking,
  Wizard,
} from 'common';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
const user = auth.currentUser;
let name = "YOU";
if (user){name = user.displayName;}
const contactImg = require('../../icons/contact.png');
const logoutImg = require('../../icons/logout.png');
const profileImg = require('../../icons/profile.png');
const homeImg = require('../../icons/home.png');
const board = require('../../icons/board.png');

const child_blue = require('../../assets/child_blue.png');
const child_red = require('../../assets/child_red.png');
const death_blue = require('../../assets/death_blue.png');
const death_red = require('../../assets/death_red.png');
const devil_blue = require('../../assets/devil_blue.png');
const devil_red = require('../../assets/devil_red.png');
const dwarf_blue = require('../../assets/dwarf_blue.png');
const dwarf_red = require('../../assets/dwarf_red.png');
const flag_blue = require('../../assets/flag_blue.png');
const flag_red = require('../../assets/flag_red.png');
const knight_blue = require('../../assets/knight_blue.png');
const knight_red = require('../../assets/knight_red.png');
const mommy_blue = require('../../assets/mommy_blue.png');
const mommy_red = require('../../assets/mommy_red.png');
const ninja_blue = require('../../assets/ninja_blue.png');
const ninja_red = require('../../assets/ninja_red.png');
const odin_blue = require('../../assets/odin_blue.png');
const odin_red = require('../../assets/odin_red.png');
const thor_blue = require('../../assets/thor_blue.png');
const thor_red = require('../../assets/thor_red.png');
const troll_blue = require('../../assets/troll_blue.png');
const troll_red = require('../../assets/troll_red.png');
const viking_blue = require('../../assets/viking_blue.png');
const viking_red = require('../../assets/viking_red.png');
const wizard_blue = require('../../assets/wizard_blue.png');
const wizard_red = require('../../assets/wizard_red.png');
const eyeImage = require('../../assets/eye.png');

Child.getImage = function (entity) {
  return entity.team === team.blue ? child_blue : child_red;
};

Death.getImage = function (entity) {
  return entity.team === team.blue ? death_blue : death_red;
};

Devil.getImage = function (entity) {
  return entity.team === team.blue ? devil_blue : devil_red;
};

Dwarf.getImage = function (entity) {
  return entity.team === team.blue ? dwarf_blue : dwarf_red;
};

Flag.getImage = function (entity) {
  return entity.team === team.blue ? flag_blue : flag_red;
};

Knight.getImage = function (entity) {
  return entity.team === team.blue ? knight_blue : knight_red;
};

Mommy.getImage = function (entity) {
  return entity.team === team.blue ? mommy_blue : mommy_red;
};

Ninja.getImage = function (entity) {
  return entity.team === team.blue ? ninja_blue : ninja_red;
};


Odin.getImage = function (entity) {
  return entity.team === team.blue ? odin_blue : odin_red;
};

Thor.getImage = function (entity) {
  return entity.team === team.blue ? thor_blue : thor_red;
};

Troll.getImage = function (entity) {
  return entity.team === team.blue ? troll_blue : troll_red;
};

Viking.getImage = function (entity) {
  return entity.team === team.blue ? viking_blue : viking_red;
};

Wizard.getImage = function (entity) {
  return entity.team === team.blue ? wizard_blue : wizard_red;
};

interface selectedEntity {
  x: number;
  y: number;
  entity: Entity;
}

const OfflineGamePage = () => {
  const navigate = useNavigate();
  const [gameEnd, setGameEnd] = useState(false);
  const [endGameMessage, setEndGameMessage] = useState("");
  const [gameManager, setGameManager] = useState(GameManagerFactory.initGameManager());
  const [currentTeam, setCurrentTeam] = useState(gameManager.redTeam);
  const [selectedEntity, setSelectedEntity] = useState<selectedEntity | null>(null);
  const [highlightBoard, setHighlightBoard] = useState<MarkerBoard>(new MarkerBoard());
  const [gameMessage, setGameMessage] = useState("LET THE BATTLE BEGIN!!");

  const renderPieceImage = (entity: Entity) => {
    if (entity == null) return null;
    if (entity.team !== currentTeam.team && !entity.isVisible) {
      if (entity.team === team.blue){
        return <img className="image" src={child_blue}></img>;
      }
      else {return <img className="image" src={child_red}></img>;}
    }

    return (
      <div className="image-container">
        <img className="image" src={(entity as any).constructor?.getImage(entity)} />
        {entity.isVisible && entity.team === currentTeam.team ? (
          <img className="eye" src={eyeImage} />
        ) : null}
      </div>
    );
  };

  const handleCellClick = (cell: Cell) => {
    // handle setup clicks
    if (!gameManager.setupFinished && selectedEntity && !cell.entity) {
      try {
        gameManager.setup_setPiece(selectedEntity.entity, { x: cell.x, y: cell.y });
        cell.entity = selectedEntity.entity;
        setSelectedEntity(null);
        setHighlightBoard(new MarkerBoard());
      } catch (error) {
        console.error(error);
      }
    }
    // handle game clicks
    else if (gameManager.setupFinished) {
      if (team.red){
        setGameMessage("well..whats your next move??")}
      if (cell.entity?.team === currentTeam.team) {
        if (selectedEntity?.entity.type === 'wizard'){
          let wizard = selectedEntity.entity as Wizard;
          if (wizard.train > 0){
            if (cell.entity.type === "child" || cell.entity.type === "knight" || cell.entity.type === "viking" || cell.entity.type === "thor"){
              let p = new Position();
              p.x = cell.x;
              p.y = cell.y;
              cell.entity.upgrade(gameManager.board, cell.entity, p);
              wizard.train--;
              setSelectedEntity(null);
              const gmClone = GameManagerFactory.getClone(gameManager);
              setGameManager(gmClone);
              setHighlightBoard(new MarkerBoard());
            }
          }
          else if (team.red){
            setGameMessage("wizard can't train anymore");
          }
          setSelectedEntity(null);
        }
        if (!selectedEntity || selectedEntity.entity.type !== 'wizard') {
          setSelectedEntity({ entity: cell.entity, x: cell.x, y: cell.y });
          const highlightBoard = cell.entity.getPossibleMoves?.(cell.x, cell.y, gameManager.board) as MarkerBoard;
          highlightBoard.setHighlight(cell.x, cell.y);
          setHighlightBoard(highlightBoard);
        }
      }
      else if (selectedEntity) {
        if(selectedEntity.entity.type === "wizard"){
          let wizard = selectedEntity.entity as Wizard;
          if(cell?.entity && !cell?.entity.isVisible && wizard.reveal>0){
            cell.entity.isVisible = true;
            wizard.reveal--;
            const gmClone = GameManagerFactory.getClone(gameManager);
            setGameManager(gmClone);
            setHighlightBoard(new MarkerBoard());
          }
          else if (wizard.reveal===0 && team.red){
            setGameMessage("wizard cant reveal anymore");
            setSelectedEntity(null);
          }
        }
        try {
          const tempMessage: string = gameManager.move({ x: cell.x, y: cell.y }, { x: selectedEntity.x, y: selectedEntity.y });
          setGameMessage(tempMessage);
          setSelectedEntity(null);
          const gmClone = GameManagerFactory.getClone(gameManager);
          setGameManager(gmClone);
          setHighlightBoard(new MarkerBoard());
          if (tempMessage === "red won the game!") {
            setEndGameMessage("Congratulations!\n You won the game!");
            setGameEnd(true);
          }
          setTimeout(() => {
            const randomMoveDetails = execRandomMove(gameManager.teamTurn);
           // tie
            if (randomMoveDetails.entityPos.x === -1){
              setEndGameMessage("Well...\n that's a tie!");
              setGameEnd(true);
              gameManager.endGame("tie");
              return;
            }
            const highlightBoardWithEnemyMove = new MarkerBoard();
            highlightBoardWithEnemyMove.setHighlight(randomMoveDetails.move.x, randomMoveDetails.move.y, color.red);
            highlightBoardWithEnemyMove.setHighlight(
              randomMoveDetails.entityPos.x,
              randomMoveDetails.entityPos.y,
              color.blue,
            );
            const gmClone = GameManagerFactory.getClone(gameManager);
            setGameManager(gmClone);
            setHighlightBoard(highlightBoardWithEnemyMove);
          }, 1000);
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const renderGameSetup = () => {
    if (gameManager.setupFinished) {
      return null;
    }

    const currentTeamPiecesSetup = currentTeam.piecesSetup;
    const dwarfImage = currentTeam.team === team.blue ? dwarf_blue : dwarf_red;
    const flagImage = currentTeam.team === team.blue ? flag_blue : flag_red;
    const devilImage = currentTeam.team === team.blue ? devil_blue : devil_red;
    const deathImage = currentTeam.team === team.blue ? death_blue : death_red;
    const wizardImage = currentTeam.team === team.blue ? wizard_blue : wizard_red;
    const trollImage = currentTeam.team === team.blue ? troll_blue : troll_red;
    const mommyImage = currentTeam.team === team.blue ? mommy_blue : mommy_red;
    const ninjaImage = currentTeam.team === team.blue ? ninja_blue : ninja_red;

    let isFinished: boolean = true;
    for (const k in currentTeamPiecesSetup) {
      let key = k as entityType;
      if (currentTeamPiecesSetup[key] !== 0) {
        isFinished = false;
        break;
      }
    }

    return (
      <div>
        <div className="icons">
          <br/>
          {currentTeamPiecesSetup.dwarf === 0 ? null :
            <img className="image"
                 src={dwarfImage}
                 onClick={() => {
                   setSelectedEntity({ entity: new Dwarf(currentTeam.team), x: -1, y: -1 });
                   const highlightBoard = new MarkerBoard();
                   for (let i = 0; i < 8; i++) {
                     if (!gameManager.board.getCell(i, 7).entity) {
                       highlightBoard.setHighlight(i, 7);
                     }
                   }
                   setHighlightBoard(highlightBoard);
                 }}
            />
          }
          {currentTeamPiecesSetup.death === 0 ? null :
            <img className="image"
                 src={deathImage}
                 onClick={() => {
                   setSelectedEntity({ entity: new Death(currentTeam.team), x: -1, y: -1 });
                   const highlightBoard = new MarkerBoard();
                   for (let i = 0; i < 8; i++) {
                     if (!gameManager.board.getCell(i, 7).entity) {
                       highlightBoard.setHighlight(i, 7);
                     }
                   }
                   setHighlightBoard(highlightBoard);
                 }}
            />
          }
          {currentTeamPiecesSetup.devil === 0 ? null :
            <img className="image"
                 src={devilImage}
                 onClick={() => {
                   setSelectedEntity({ entity: new Devil(currentTeam.team), x: -1, y: -1 });
                   const highlightBoard = new MarkerBoard();
                   for (let i = 0; i < 8; i++) {
                     if (!gameManager.board.getCell(i, 7).entity) {
                       highlightBoard.setHighlight(i, 7);
                     }
                   }
                   setHighlightBoard(highlightBoard);
                 }}
            />
          }
          {currentTeamPiecesSetup.flag === 0 ? null :
            <img className="image"
                 src={flagImage}
                 onClick={() => {
                   setSelectedEntity({ entity: new Flag(currentTeam.team), x: -1, y: -1 });
                   const highlightBoard = new MarkerBoard();
                   for (let i = 0; i < 8; i++) {
                     if (!gameManager.board.getCell(i, 7).entity) {
                       highlightBoard.setHighlight(i, 7);
                     }
                   }
                   setHighlightBoard(highlightBoard);
                 }}
            />
          }
          <br/>
          {currentTeamPiecesSetup.mommy === 0 ? null :
            <img className="image"
                 src={mommyImage}
                 onClick={() => {
                   setSelectedEntity({ entity: new Mommy(currentTeam.team), x: -1, y: -1 });
                   const highlightBoard = new MarkerBoard();
                   for (let i = 0; i < 8; i++) {
                     if (!gameManager.board.getCell(i, 7).entity) {
                       highlightBoard.setHighlight(i, 7);
                     }
                   }
                   setHighlightBoard(highlightBoard);
                 }}
            />
          }
          {currentTeamPiecesSetup.ninja === 0 ? null :
            <img className="image"
                 src={ninjaImage}
                 onClick={() => {
                   setSelectedEntity({ entity: new Ninja(currentTeam.team), x: -1, y: -1 });
                   const highlightBoard = new MarkerBoard();
                   for (let i = 0; i < 8; i++) {
                     if (!gameManager.board.getCell(i, 7).entity) {
                       highlightBoard.setHighlight(i, 7);
                     }
                   }
                   setHighlightBoard(highlightBoard);
                 }}
            />
          }
          {currentTeamPiecesSetup.wizard === 0 ? null :
            <img className="image"
                 src={wizardImage}
                 onClick={() => {
                   setSelectedEntity({ entity: new Wizard(currentTeam.team), x: -1, y: -1 });
                   const highlightBoard = new MarkerBoard();
                   for (let i = 0; i < 8; i++) {
                     if (!gameManager.board.getCell(i, 7).entity) {
                       highlightBoard.setHighlight(i, 7);
                     }
                   }
                   setHighlightBoard(highlightBoard);
                 }}
            />
          }
          {currentTeamPiecesSetup.troll === 0 ? null :
            <img className="image"
                 src={trollImage}
                 onClick={() => {
                   setSelectedEntity({ entity: new Troll(currentTeam.team), x: -1, y: -1 });
                   const highlightBoard = new MarkerBoard();
                   for (let i = 0; i < 8; i++) {
                     if (!gameManager.board.getCell(i, 7).entity) {
                       highlightBoard.setHighlight(i, 7);
                     }
                   }
                   setHighlightBoard(highlightBoard);
                 }}
            />
          }
        </div>
        {isFinished ? (
          <div className='readyBtn'>
            <button onClick={handleReadyClick}>Ready</button>
          </div>
        ) : null}
      </div>
    );
  };

  const handleReadyClick = () => {
    gameManager.setReady(currentTeam);
    const oppositeTeam = gameManager.getOppositeTeam(currentTeam);
    const numbers = new Set();
    while (numbers.size < 8) {
      const number = Math.floor(Math.random() * 8);
      numbers.add(number);
    }
    const array = Array.from(numbers);
    gameManager.setup_setPiece(new Dwarf(oppositeTeam.team), { x: array.at(0) as number, y: oppositeTeam.FIRST_COLUMN });
    gameManager.setup_setPiece(new Death(oppositeTeam.team), { x: array.at(1) as number, y: oppositeTeam.FIRST_COLUMN });
    gameManager.setup_setPiece(new Devil(oppositeTeam.team), { x: array.at(2) as number, y: oppositeTeam.FIRST_COLUMN });
    gameManager.setup_setPiece(new Flag(oppositeTeam.team), { x: array.at(3) as number, y: oppositeTeam.FIRST_COLUMN });
    gameManager.setup_setPiece(new Mommy(oppositeTeam.team), { x: array.at(4) as number, y: oppositeTeam.FIRST_COLUMN });
    gameManager.setup_setPiece(new Ninja(oppositeTeam.team), { x: array.at(5) as number, y: oppositeTeam.FIRST_COLUMN });
    gameManager.setup_setPiece(new Wizard(oppositeTeam.team), { x: array.at(6) as number, y: oppositeTeam.FIRST_COLUMN });
    gameManager.setup_setPiece(new Troll(oppositeTeam.team), { x: array.at(7) as number, y: oppositeTeam.FIRST_COLUMN });
    gameManager.setReady(oppositeTeam);

    const gmClone = GameManagerFactory.getClone(gameManager);
    setGameManager(gmClone);
    setSelectedEntity(null);
  };

  const execRandomMove = (t: Team) => {
    const currentTeamOnBoardEntities: { entity: Entity; pos: { x: number; y: number } }[] = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const currEntity = gameManager.board.getEntity(j, i);
        if (
          currEntity &&
          currEntity.team === t.team &&
          currEntity.getPossibleMoves?.(j, i, gameManager.board).hasAnyHighlight()
        ) {
          currentTeamOnBoardEntities.push({ entity: currEntity, pos: { x: j, y: i } });
        }
      }
    }
// tie
    const allFlagOrMommy = currentTeamOnBoardEntities.every(entity => entity.entity.type === "flag" || entity.entity.type === "mommy");
    if (allFlagOrMommy) {
      gameManager.move({ x:-1,y:-1 }, { x:-1,y:-1 });
      return { move: { x:-1,y:-1 }, entityPos: { x:-1,y:-1 } };
    }
    const randomEntity = currentTeamOnBoardEntities[Math.floor(Math.random() * currentTeamOnBoardEntities.length)];
    const possibleMovesBoard = randomEntity.entity.getPossibleMoves?.(
      randomEntity.pos.x,
      randomEntity.pos.y,
      gameManager.board,
    );

    const possibleMovesArr: { x: number; y: number }[] = [];

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (possibleMovesBoard?.isHighlighted(j, i)) {
          possibleMovesArr.push({ x: j, y: i });
        }
      }
    }

    const randomMove = possibleMovesArr[Math.floor(Math.random() * possibleMovesArr.length)];

    const message = gameManager.move(randomMove, randomEntity.pos);
      if (message === "blue won the game!") {
      setEndGameMessage("NOOOO!\n You lose the game!");
      setGameEnd(true);
    }
    return { move: randomMove, entityPos: randomEntity.pos };
  };

  return (
    <div className={"background"}>
      <img className={"background"} src={board} alt={"background"}/>
      <div className={"cover"}>
        <div className='navbar'>
          <h4 className='name'>{name} vs A M-A-C-H-I-N-E !</h4>
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
        <div className="board">
          {gameManager.board.board?.map((row: Cell[], y: number) => (
            <div key={y} className="row">
              {row.map((cell, x) => {
                return (
                  <button
                    key={x}
                    className={classNames('cell', {
                      [`${color[highlightBoard.returnHighlightType(x, y)]}-highlight`]: true,
                      'light': (y + x) % 2 === 0,
                      'dark': (y + x) % 2 === 1,
                    })}
                    onClick={() => handleCellClick(cell)}
                  >
                    {renderPieceImage(cell?.entity as Entity)}
                  </button>
                );
              })}
            </div>
          ))}
          {gameEnd ? (
            <div className="overlay">
              <div className='endgame'>
                <h4>{endGameMessage}</h4>
                <p className="messageGame">Would you like to:</p>
                <button
                  className='endgameBtn'
                  onClick={() => window.location.reload()}>
                  Play again
                </button>
                <button
                  className='endgameBtn'
                  onClick={() => navigate('/')}>
                  Back home</button>
              </div>
            </div>
          ) : null}
        </div>
        <div className='messagesBox'>
          <div>
            {!gameManager.setupFinished ? <p className='message'>Place your pieces</p> : <p className='message'>{gameMessage}</p>}
            <div className='icons'>{renderGameSetup()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineGamePage;