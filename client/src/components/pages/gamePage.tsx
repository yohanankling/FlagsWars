import react, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { realTimeDb, auth } from '../../firebase/firebase';
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
  Team,
  Thor,
  Troll,
  Viking,
  Wizard,
} from 'common';
import { move, setReady } from '../../services/onlineGameSerivce';
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
  const [gameManager, setGameManager] = useState(GameManagerFactory.initGameManager());
  const [currentTeam, setCurrentTeam] = useState<team | null>();
  const [initialLoad, setInitialLoad] = useState(false);

  const [selectedEntity, setSelectedEntity] = useState<selectedEntity | null>(null);
  const [highlightBoard, setHighlightBoard] = useState<MarkerBoard>(new MarkerBoard());
  const [setupEntities, setSetupEntities] = useState<
    {
      entity: Entity;
      pos: Position;
    }[]
  >([]);

  const fetchDoc = async () => {
    let fetchUid = user.uid;
    if (gameDetails.player1.id === user.uid){
      fetchUid = gameDetails.player2.id;
    }
    try {
      const res = await send({ method: 'POST', route: '/getDoc', data: { uid: fetchUid } });
      let doc = res.data;
      setVsName(doc.name);
    } catch (error: any) {
      console.error(error);}
  };

  useEffect(() => {
    fetchDoc();
  }, []);

  const listenForGame = () => {
    const starCountRef = ref(realTimeDb, 'games/' + id);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      const gameDetails = { player1: data.player1, player2: data.player2, redPlayer: data.red_player };
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
              />
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
              />
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
              />
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
              />
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
              />
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
              />
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
              />
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
              />
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
    setReady(id as string, setupEntities);
    await gameManager.setReady(getTeam(currentTeam));
    setSelectedEntity(null);
    isFinished = true;
    setIsReady(true);
  };


  const renderPieceImage = (entity: Entity) => {
    if (entity == null) return null;
    if (entity.team !== getTeam(currentTeam).team && !entity.isVisible) {
      return <p>?</p>;
    }

    return (
      <div className="image-container">
        <img className="image" src={(entity as any).constructor?.getImage(entity)} />
        {/*{entity.isVisible && entity.team === currentTeam.team ? (*/}
        {/*  <img className="eye" src={eyeImage} />*/}
        {/*) : null}*/}
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
      if (cell.entity?.team === currentTeam) {
        setSelectedEntity({ entity: cell.entity, x: cell.x, y: cell.y });
        const highlightBoard = cell.entity.getPossibleMoves?.(cell.x, cell.y, gameManager.board) as MarkerBoard;
        highlightBoard.setHighlight(cell.x, cell.y);

        setHighlightBoard(highlightBoard);
      } else if (selectedEntity) {
        try {
          // gameManager.move({ x: cell.x, y: cell.y }, { x: selectedEntity.x, y: selectedEntity.y });
          await move(id, { x: selectedEntity.x, y: selectedEntity.y }, { x: cell.x, y: cell.y });

          setSelectedEntity(null);
          setHighlightBoard(new MarkerBoard());
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
            <h4 className='name'>{name} vs {vsName}</h4>
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
            </div>
            <div className='messagesBox'>
              <div>
                {!gameManager.setupFinished ? <p className='message'>Place your pieces</p> : <p className='message'>Game started</p>}
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
    </div>
    </div>
  );
};

export default GamePage;
