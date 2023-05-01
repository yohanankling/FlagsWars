import react, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { realTimeDb, auth } from '../../firebase/firebase';
import classNames from 'classnames';
import '../../css/game.css';
import {
  Cell,
  Entity,
  King,
  MarkerBoard,
  Position,
  color,
  entityType,
  team,
  GameManagerFactory,
} from 'common';
import {Child} from 'common/src/Entitys'
import { move, setReady } from '../../services/onlineGameSerivce';

const child_blue = require('../../assets/child_blue.png');
const child_red = require('../../assets/child_red.png');
const death_blue = require('../../assets/death_blue.png');
const death_red = require('../../assets/death_red.png.png');
const devil_blue = require('../../assets/devil_blue.png');
const devil_red = require('../../assets/devil_red.png');
const dworf_blue = require('../../assets/dworf_blue.png');
const dworf_red = require('../../assets/dworf_red.png');
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
const eyeImage = require('../../assets/eye.jpg');

Child.getImage = function (entity) {
  return entity.team === team.blue ? child_blue : child_red;
};

Death.getImage = function (entity) {
  return entity.team === team.blue ? death_blue : death_red;
};

Devil.getImage = function (entity) {
  return entity.team === team.blue ? devil_blue : devil_red;
};

Dworf.getImage = function (entity) {
  return entity.team === team.blue ? dworf_blue : dworf_red;
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

Vikink.getImage = function (entity) {
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
    const childImage = currentTeam === team.blue ? child_blue : child_red;
    const deathImage = currentTeam === team.blue ? death_blue : death_red;
    const devilImage = currentTeam === team.blue ? devil_blue : devil_red;
    const dworfImage = currentTeam === team.blue ? dworf_blue : dworf_red;
    const flagImage = currentTeam === team.blue ? flag_blue : flag_red;
    const kingImage = currentTeam === team.blue ? king_blue : king_blue;
    const knightImage = currentTeam === team.blue ? knight_blue : knight_red;
    const mommyImage = currentTeam === team.blue ? mommy_blue : mommy_red;
    const ninjaImage = currentTeam === team.blue ? ninja_blue : ninja_red;
    const ninja2Image = currentTeam === team.blue ? ninja_blue_2 : ninja_red_2;
    const odinImage = currentTeam === team.blue ? odin_blue : odin_red;
    const thorImage = currentTeam === team.blue ? thor_blue : thor_red;
    const trollImage = currentTeam === team.blue ? troll_blue : troll_red;
    const vampireImage = currentTeam === team.blue ? vampire_blue : vampire_red;
    const vikingImage = currentTeam === team.blue ? viking_blue : viking_red;
    const wizardImage = currentTeam === team.blue ? wizard_blue : wizard_red;

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
        <div>
          <img
            src={kingImage}
            width={100}
            height={100}
            onClick={() => {
              if (currentTeamPiecesSetup.king === 0) {
                return;
                //show error
              }

              const t = getTeam(currentTeam);
              setSelectedEntity({ entity: new King(t.team), x: -1, y: -1 });
              const highlightBoard = new MarkerBoard();
              for (let i = 0; i < 8; i++) {
                if (!gameManager.board.getCell(i, t.FIRST_COLUMN).entity) {
                  highlightBoard.setHighlight(i, t.FIRST_COLUMN);
                }
              }

              setHighlightBoard(highlightBoard);
            }}
          />
          <p>Count: {getTeam(currentTeam).piecesSetup.king}</p>
        </div>
        {isFinished ? (
          <div>
            <button onClick={handleReadyClick}>Ready</button>
          </div>
        ) : null}
      </div>
    );
  };

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
  };

  const renderPieceImage = (entity: Entity) => {
    if (entity == null) return null;
    // const image = entity.team === team.black ? entity.image.black : entity.image.white;

    if (entity.team !== getTeam(currentTeam).team && !entity.isVisible) {
      return <p>?</p>;
    }

    return (
      <div className="image-container">
        <img width={45} height={40} src={(entity as any).constructor?.getImage(entity)} />
        {entity.isVisible && entity.team === getTeam(currentTeam).team ? (
          <img width={15} height={15} src={eyeImage} className="small-image" />
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
    <>
      {initialLoad ? (
        <div>
          <h1>Game Id: {id}</h1>
          <div>
            <h3>Player1: {gameDetails.player1.id}</h3>
            <p>Team: {team[gameDetails.player1.team]}</p>
          </div>
          <div>
            <h3>Player2: {gameDetails.player2.id}</h3>
            <p>Team: {team[gameDetails.player2.team]}</p>
          </div>

          <h4>Turn Count: {gameManager.turnCount}</h4>

          <div>
            {!gameManager.setupFinished ? <p>Place your pieces</p> : <p>Game started</p>}

            <div className="board">
              {gameManager.board.board?.map((row: Cell[], y: number) => (
                <div key={y} className="row">
                  {row.map((cell, x) => {
                    return (
                      <button
                        key={x}
                        className={classNames('cell', `${color[highlightBoard.returnHighlightType(x, y)]}-highlight`)}
                        onClick={() => handleCellClick(cell)}
                      >
                        {renderPieceImage(cell?.entity as Entity)}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {renderGameSetup()}
          </div>
        </div>
      ) : (
        <h2>Loading Game...</h2>
      )}
    </>
  );
};

export default GamePage;
