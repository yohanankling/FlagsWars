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
  Child,
} from 'common';
import { move, setReady } from '../../services/onlineGameSerivce';

const redPawnImage = require('../../assets/devil_blue.png');
const bluePawnImage = require('../../assets/devil_red.png');
const redKingImage = require('../../assets/death_red.png');
const blueKingImage = require('../../assets/death_blue.png');
const eyeImage = require('../../assets/eye.jpg');

// this is an ugly hack to inject the images to the imported common project
Child.getImage = function (entity) {
  return entity.team === team.blue ? bluePawnImage : redPawnImage;
};

King.getImage = function (entity) {
  return entity.team === team.blue ? blueKingImage : redKingImage;
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
    const kingImage = currentTeam === team.red ? redKingImage : blueKingImage;

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
          {/*<p>Count: {getTeam(currentTeam).piecesSetup.king + getTeam(currentTeam).piecesSetup.dwarf}</p>*/}
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
    // const image = entity.team === team.blue ? entity.image.blue : entity.image.red;

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
