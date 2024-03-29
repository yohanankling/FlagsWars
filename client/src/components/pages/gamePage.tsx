import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { auth } from '../../firebase/firebase';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import '../../css/game.css';
import {
  Cell,
  Entity,
  MarkerBoard,
  Position,
  color,
  entityType,
  team,
  GameManagerFactory,
  Child,
  Death,
  Devil,
  Dwarf,
  Flag,
  Knight,
  Mommy,
  Ninja,
  Odin,
  Thor,
  Troll,
  Viking,
  Wizard,
} from 'common';
import { move, setReady, updateBoard } from '../../services/onlineGameSerivce';
import React from 'react';
import authService from '../../services/authService';
import { send } from '../../services/httpContext';
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

const GamePage = () => {
  let isFinished: boolean = true;
  const user = auth.currentUser;
  let name = "YOU";
  // against name required
  if (user){name = user.displayName;}
  const navigate = useNavigate();
  const [vsName, setVsName] = useState("");
  const [isReady, setIsReady] = useState(false);
  const { id } = useParams();
  const [gameDetails, setGameDetails] = useState<{
    player1: { id: string; team: team };
    player2: { id: string; team: team };
  }>({
    player1: { id: '', team: team.blue },
    player2: { id: '', team: team.red },
  });
  const [gameEnd, setGameEnd] = useState(false);
  const [endGameMessage, setEndGameMessage] = useState("");
  const [gameManager, setGameManager] = useState(GameManagerFactory.initGameManager());
  const [currentTeam, setCurrentTeam] = useState<team | null>();
  const [initialLoad, setInitialLoad] = useState(false);
  const [gameMessage, setGameMessage] = useState("LET THE BATTLE BEGIN!!");
  const [selectedEntity, setSelectedEntity] = useState<selectedEntity | null>(null);
  const [highlightBoard, setHighlightBoard] = useState<MarkerBoard>(new MarkerBoard());
  const [setupEntities, setSetupEntities] = useState<
    {
      entity: Entity;
      pos: Position;
    }[]
  >([]);
  useEffect(() => {
    if (gameManager.endgame === "blue" || gameManager.endgame === "red" || gameManager.endgame === "tie") {
      setGameEnd(true);
    }
  }, [gameManager.endgame]);

  const fetchDoc = async () => {
    let fetchUid = user.uid;
    if (gameDetails.player1.id === user.uid){
      fetchUid = gameDetails.player2.id;
    }
    try {
      const res = await send({ method: 'POST', route: '/getDoc', data: {uid: fetchUid} });
      let doc = res.data;
      setVsName(doc.name);
    } catch (error: any) {
      console.error(error);}
  };

  useEffect(() => {
    fetchDoc();
  }, []);

  const listenForGame = () => {
    const eventSource = new EventSource(`http://localhost:3001/games_listener?id=${id}`);
    eventSource.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      const gameDetails = { player1: data.player1, player2: data.player2, redPlayer: data.red_player, bluePlayer: data.blue_player };
      setGameDetails(gameDetails);
      setGameManager(GameManagerFactory.restoreGame(data.game_data));
      if (!initialLoad) setInitialLoad(true);
    });
  };

  const renderGameSetup = () => {
    if (gameManager.setupFinished) {
      return null;
    }

    const currentTeamPiecesSetup = getTeam(currentTeam).piecesSetup;
    const dwarfImage = currentTeam === team.blue ? dwarf_blue : dwarf_red;
    const flagImage = currentTeam === team.blue ? flag_blue : flag_red;
    const devilImage = currentTeam === team.blue ? devil_blue : devil_red;
    const deathImage = currentTeam === team.blue ? death_blue : death_red;
    const wizardImage = currentTeam === team.blue ? wizard_blue : wizard_red;
    const trollImage = currentTeam === team.blue ? troll_blue : troll_red;
    const mommyImage = currentTeam === team.blue ? mommy_blue : mommy_red;
    const ninjaImage = currentTeam === team.blue ? ninja_blue : ninja_red;
    isFinished = true;
    for (const k in currentTeamPiecesSetup) {
      let key = k as entityType;
      if (currentTeamPiecesSetup[key] !== 0) {
        isFinished = false;
        break;
      }
    }


    return (
      <div>
        {!isFinished && !isReady ? (
          <div className="icons">
            <br />
            {currentTeamPiecesSetup.dwarf === 0 ? null :
              <img className="image"
                   src={dwarfImage}
                   onClick={() => {
                     const t = getTeam(currentTeam);
                     setSelectedEntity({ entity: new Dwarf(t.team), x: -1, y: -1 });
                     const highlightBoard = new MarkerBoard();
                     for (let i = 0; i < 8; i++) {
                       if (!gameManager.board.getCell(i, 7).entity) {
                         highlightBoard.setHighlight(i, 7);
                       }
                     }
                     setHighlightBoard(highlightBoard);
                   }}
               alt={"dwarf"}/>
            }
            {currentTeamPiecesSetup.death === 0 ? null :
              <img className="image"
                   src={deathImage}
                   onClick={() => {
                     const t = getTeam(currentTeam);
                     setSelectedEntity({ entity: new Death(t.team), x: -1, y: -1 });
                     const highlightBoard = new MarkerBoard();
                     for (let i = 0; i < 8; i++) {
                       if (!gameManager.board.getCell(i, 7).entity) {
                         highlightBoard.setHighlight(i, 7);
                       }
                     }
                     setHighlightBoard(highlightBoard);
                   }}
               alt={"death"}/>
            }
            {currentTeamPiecesSetup.devil === 0 ? null :
              <img className="image"
                   src={devilImage}
                   onClick={() => {
                     const t = getTeam(currentTeam);
                     setSelectedEntity({ entity: new Devil(t.team), x: -1, y: -1 });
                     const highlightBoard = new MarkerBoard();
                     for (let i = 0; i < 8; i++) {
                       if (!gameManager.board.getCell(i, 7).entity) {
                         highlightBoard.setHighlight(i, 7);
                       }
                     }
                     setHighlightBoard(highlightBoard);
                   }}
               alt={"devil"}/>
            }
            {currentTeamPiecesSetup.flag === 0 ? null :
              <img className="image"
                   src={flagImage}
                   onClick={() => {
                     const t = getTeam(currentTeam);
                     setSelectedEntity({ entity: new Flag(t.team), x: -1, y: -1 });
                     const highlightBoard = new MarkerBoard();
                     for (let i = 0; i < 8; i++) {
                       if (!gameManager.board.getCell(i, 7).entity) {
                         highlightBoard.setHighlight(i, 7);
                       }
                     }
                     setHighlightBoard(highlightBoard);
                   }}
               alt={"flag"}/>
            }
            <br />
            {currentTeamPiecesSetup.mommy === 0 ? null :
              <img className="image"
                   src={mommyImage}
                   onClick={() => {
                     const t = getTeam(currentTeam);
                     setSelectedEntity({ entity: new Mommy(t.team), x: -1, y: -1 });
                     const highlightBoard = new MarkerBoard();
                     for (let i = 0; i < 8; i++) {
                       if (!gameManager.board.getCell(i, 7).entity) {
                         highlightBoard.setHighlight(i, 7);
                       }
                     }
                     setHighlightBoard(highlightBoard);
                   }}
               alt={"mommy"}/>
            }
            {currentTeamPiecesSetup.ninja === 0 ? null :
              <img className="image"
                   src={ninjaImage}
                   onClick={() => {
                     const t = getTeam(currentTeam);
                     setSelectedEntity({ entity: new Ninja(t.team), x: -1, y: -1 });
                     const highlightBoard = new MarkerBoard();
                     for (let i = 0; i < 8; i++) {
                       if (!gameManager.board.getCell(i, 7).entity) {
                         highlightBoard.setHighlight(i, 7);
                       }
                     }
                     setHighlightBoard(highlightBoard);
                   }}
               alt={"ninja"}/>
            }
            {currentTeamPiecesSetup.wizard === 0 ? null :
              <img className="image"
                   src={wizardImage}
                   onClick={() => {
                     const t = getTeam(currentTeam);
                     setSelectedEntity({ entity: new Wizard(t.team), x: -1, y: -1 });
                     const highlightBoard = new MarkerBoard();
                     for (let i = 0; i < 8; i++) {
                       if (!gameManager.board.getCell(i, 7).entity) {
                         highlightBoard.setHighlight(i, 7);
                       }
                     }
                     setHighlightBoard(highlightBoard);
                   }}
               alt={"wizard"}/>
            }
            {currentTeamPiecesSetup.troll === 0 ? null :
              <img className="image"
                   src={trollImage}
                   onClick={() => {
                     const t = getTeam(currentTeam);
                     setSelectedEntity({ entity: new Troll(t.team), x: -1, y: -1 });
                     const highlightBoard = new MarkerBoard();
                     for (let i = 0; i < 8; i++) {
                       if (!gameManager.board.getCell(i, 7).entity) {
                         highlightBoard.setHighlight(i, 7);
                       }
                     }
                     setHighlightBoard(highlightBoard);
                   }}
               alt={"troll"}/>
            }
          </div>
        ) : null}
        {isFinished ? (
          <div>
            <button onClick={handleReadyClick}>Ready</button>
          </div>
        ) : null}
        {isReady ? (
          <div className='spinner-div'  style={{display: isReady ? 'block' : 'none'}}>
            waiting your opponent to choose...
            <div id="spinner" className="spinner"></div>
          </div>
        ) : null}
      </div>
    );
  }

  const getTeam = (t: team) => {
    if (t === team.blue) {
      return gameManager.blueTeam;
    } else {
      return gameManager.redTeam;
    }
  };

  const handleReadyClick = async () => {
    await setReady(id as string, setupEntities);
    await gameManager.setReady(getTeam(currentTeam));
    setSelectedEntity(null);
    isFinished = true;
    setIsReady(true);
  };


  const renderPieceImage = (entity: Entity) => {
    if (entity == null) return null;
    if (entity.team !== getTeam(currentTeam).team && !entity.isVisible) {
      if (entity.team === team.blue){
        return <img className="image" src={child_blue} alt={"blue child"}></img>;
      }
      else {return <img className="image" src={child_red} alt={"red child"}></img>;}
    }

    return (
      <div className="image-container">
        <img className="image" src={(entity as any).constructor?.getImage(entity)}  alt={"entities"}/>
        {entity.isVisible && entity.team === currentTeam ? (
          <img className="eye" src={eyeImage}  alt={"eye"}/>
        ) : null}
      </div>
    );
  };

  const handleCellClick = async (cell: Cell) => {
    // handle setup clicks
    if (!gameManager.setupFinished) {
      if (selectedEntity && cell.isEmpty()) {
        try {
          gameManager.setup_setPiece(selectedEntity.entity, { x: cell.x, y: cell.y });
          cell.entity = selectedEntity.entity;
          setSetupEntities([...setupEntities, { entity: selectedEntity.entity, pos: { x: cell.x, y: cell.y } }]);

          setSelectedEntity(null);
          setHighlightBoard(new MarkerBoard());
          setGameManager(GameManagerFactory.getClone(gameManager));
        } catch (error) {
          console.error(error);
        }
      }
    }
    // handle game clicks
    else if (gameManager.setupFinished) {
      setGameMessage("well..whats your next move??");
      if (cell.entity?.team === currentTeam) {
        if (selectedEntity?.entity.type === 'wizard'){
          let wizard = selectedEntity.entity as Wizard;
          if (wizard.train > 0){
            if (cell.entity.type === "child" || cell.entity.type === "knight" || cell.entity.type === "viking" || cell.entity.type === "thor"){
              let p = new Position();
              p.x = cell.x;
              p.y = cell.y;
             const entity: Entity = cell.entity.upgrade(gameManager.board, cell.entity, p);
              wizard.train--;
              if (entity) {
                const setupEntity = { entity: entity, pos: p };
              await updateBoard(id as string, setupEntity);}
              setSelectedEntity(null);
              const gmClone = GameManagerFactory.getClone(gameManager);
              setGameManager(gmClone);
              setHighlightBoard(new MarkerBoard());
            }
          }
          else {
            setGameMessage("wizard can't train anymore");
            setSelectedEntity(null);
          }
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
          else if (wizard.reveal===0){
            setGameMessage("wizard cant reveal anymore");
          }
        }
        try {
          let message = await move(id, { x: selectedEntity.x, y: selectedEntity.y }, { x: cell.x, y: cell.y });
          if (!message){
            setGameMessage(message);}
          setSelectedEntity(null);
          setHighlightBoard(new MarkerBoard());
          if (message === "blue won the game!") {
            endgame(gameDetails.player1.id,gameDetails.player2.id, gameDetails.player1.id,gameDetails.player2.id)
            setEndGameMessage("Blue team won the game!");
          } else if (message === "red won the game!") {
            setEndGameMessage("Red team won the game!");
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  useEffect(() => {
    listenForGame();
  }, []);

  useEffect(() => {
    if (!initialLoad) return;
    const currentId = auth.currentUser?.uid;
    let team: team;

    if (currentId === gameDetails.player1.id) {
      team = gameDetails.player1.team;
    } else if (currentId === gameDetails.player2.id) {
      team = gameDetails.player2.team;
    } else {
      throw new Error('You are not part of this game');
      //handle user is not related to game.
    }

    setCurrentTeam(team);
  }, [initialLoad]);

  return (
    <div className={"background"}>
      <img className={"background"} src={board} alt={"background"}/>
      <div className={"cover"}>
        <>
          <div className='navbar'>
            {/*<h4 className='name'>{name} vs {vsName}</h4>*/}
            <h4 className='name'>     </h4>
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
    <>
      {initialLoad ? (
        <div className='details'>
          <div>
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
                    <p className="messageGame">press continue to go back the Home page:</p>
                    <button
                      className='endgameBtn'
                      onClick={() => navigate('/')}>
                      Continue</button>
                  </div>
                </div>
              ) : null}
            </div>
            <div className='messagesBox'>
              <div>
                {!gameManager.setupFinished ? <p className='message'>Place your pieces</p> : <p className='message'>{gameMessage}</p>}
                <div className='icons'>
                  {renderGameSetup()}
                </div>
              </div>
              </div>
          </div>
        </div>
      ) : (
        <h2>Loading Game...</h2>
      )}
    </>
        <h6 className='tip'> Tip: you can save the game url for later to continue the battle</h6>
      </div>
    </div>
  );
};

const endgame = async (winner:string, loser:string, inviter: string, invited: string) => {
  const wonRes = await send({ method: 'POST', route: '/win', data: { uid: winner } });
  const loseRes = await send({ method: 'POST', route: '/lose', data: { uid: loser } });
  try {
    send({ method: 'POST', route: '/delinvitation', data: { uid: inviter } });
  }catch (e){
  }
  try {
    send({ method: 'POST', route: '/delinvitation', data: { uid: invited } });
  }catch (e){
  }

};

export default GamePage;
