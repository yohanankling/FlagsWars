import React, { useState } from 'react';
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
  King,
  Knight,
  MarkerBoard,
  Mommy,
  Ninja,
  Ninja2,
  Odin,
  Team,
  team,
  Thor,
  Troll,
  Vampire,
  Viking,
  Wizard,
} from 'common';

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
const king_blue = require('../../assets/king_blue.png');
const king_red = require('../../assets/king_red.png');
const knight_blue = require('../../assets/knight_blue.png');
const knight_red = require('../../assets/knight_red.png');
const mommy_blue = require('../../assets/mommy_blue.png');
const mommy_red = require('../../assets/mommy_red.png');
const ninja_blue = require('../../assets/ninja_blue.png');
const ninja_red = require('../../assets/ninja_red.png');
const ninja_blue_2 = require('../../assets/ninja_blue_2.png');
const ninja_red_2 = require('../../assets/ninja_red_2.png');
const odin_blue = require('../../assets/odin_blue.png');
const odin_red = require('../../assets/odin_red.png');
const thor_blue = require('../../assets/thor_blue.png');
const thor_red = require('../../assets/thor_red.png');
const troll_blue = require('../../assets/troll_blue.png');
const troll_red = require('../../assets/troll_red.png');
const vampire_blue = require('../../assets/vampire_blue.png');
const vampire_red = require('../../assets/vampire_red.png');
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

King.getImage = function (entity) {
  return entity.team === team.blue ? king_blue : king_red;
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

Ninja2.getImage = function (entity) {
  return entity.team === team.blue ? ninja_blue_2 : ninja_red_2;
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

Vampire.getImage = function (entity) {
  return entity.team === team.blue ? vampire_blue : vampire_red;
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
  const [gameManager, setGameManager] = useState(GameManagerFactory.initGameManager());
  const [currentTeam, setCurrentTeam] = useState(gameManager.redTeam);
  const [selectedEntity, setSelectedEntity] = useState<selectedEntity | null>(null);
  const [highlightBoard, setHighlightBoard] = useState<MarkerBoard>(new MarkerBoard());

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
      if (cell.entity?.team === currentTeam.team) {
        setSelectedEntity({ entity: cell.entity, x: cell.x, y: cell.y });
        const highlightBoard = cell.entity.getPossibleMoves?.(cell.x, cell.y, gameManager.board) as MarkerBoard;
        highlightBoard.setHighlight(cell.x, cell.y);

        setHighlightBoard(highlightBoard);
      } else if (selectedEntity) {
        try {
          gameManager.move({ x: cell.x, y: cell.y }, { x: selectedEntity.x, y: selectedEntity.y });

          setSelectedEntity(null);

          const gmClone = GameManagerFactory.getClone(gameManager);
          setGameManager(gmClone);
          setHighlightBoard(new MarkerBoard());

          setTimeout(() => {
            const randomMoveDetails = execRandomMove(gameManager.teamTurn);
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

    let num1, num2;
    do {
      num1 = Math.floor(Math.random() * 8);
      num2 = Math.floor(Math.random() * 8);
    } while (num1 === num2);

    gameManager.setup_setPiece(new King(oppositeTeam.team), { x: num1, y: oppositeTeam.FIRST_COLUMN });
    gameManager.setup_setPiece(new King(oppositeTeam.team), { x: num2, y: oppositeTeam.FIRST_COLUMN });
    gameManager.setReady(oppositeTeam);

    const gmClone = GameManagerFactory.getClone(gameManager);
    setGameManager(gmClone); //hack to update the ui..
    setSelectedEntity(null);
  };

  /**
   * MEGA CODE
   * returns the random move
   * @param t
   */
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

    gameManager.move(randomMove, randomEntity.pos);

    return { move: randomMove, entityPos: randomEntity.pos };
  };

  return (
    <div className={"background"}>
      <img className={"background"} src={board} alt={"background"}/>
      <div className={"cover"}>
        <h1 className="title">YOU vs A M-A-C-H-I-N-E !</h1>
      <div className="board">
        {gameManager.board.board?.map((row: Cell[], y: number) => (
          <div key={y} className="row">
            {row.map((cell, x) => {
              return (
                <button
                  key={x}
                  className={classNames('cell', {
                    [`${color[highlightBoard.returnHighlightType(x, y)]}-highlight`]: true,
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
      <div className='icons'>{renderGameSetup()}</div>
          </div>
    </div>
    </div>
    </div>
  );
};

export default OfflineGamePage;
