// import { Entity, Team } from './common/src';
//
// const execRandomMove = (t: Team) => {
//   const currentTeamOnBoardEntities: { entity: Entity; pos: { x: number; y: number } }[] = [];
//   for (let i = 0; i < 8; i++) {
//     for (let j = 0; j < 8; j++) {
//       const currEntity = gameManager.board.getEntity(j, i);
//       if (
//         currEntity &&
//         currEntity.team === t.team &&
//         currEntity.getPossibleMoves?.(j, i, gameManager.board).hasAnyHighlight()
//       ) {
//         currentTeamOnBoardEntities.push({ entity: currEntity, pos: { x: j, y: i } });
//       }
//     }
//   }
// // tie
//   const allFlagOrMommy = currentTeamOnBoardEntities.every(entity => entity.entity.type === "flag" || entity.entity.type === "mommy");
//   if (allFlagOrMommy) {
//     gameManager.move({ x:-1,y:-1 }, { x:-1,y:-1 });
//     return { move: { x:-1,y:-1 }, entityPos: { x:-1,y:-1 } };
//   }
//   const randomEntity = currentTeamOnBoardEntities[Math.floor(Math.random() * currentTeamOnBoardEntities.length)];
//   const possibleMovesBoard = randomEntity.entity.getPossibleMoves?.(
//     randomEntity.pos.x,
//     randomEntity.pos.y,
//     gameManager.board,
//   );
//
//   const possibleMovesArr: { x: number; y: number }[] = [];
//
//   for (let i = 0; i < 8; i++) {
//     for (let j = 0; j < 8; j++) {
//       if (possibleMovesBoard?.isHighlighted(j, i)) {
//         possibleMovesArr.push({ x: j, y: i });
//       }
//     }
//   }
//
//   const randomMove = possibleMovesArr[Math.floor(Math.random() * possibleMovesArr.length)];
//
//   const message = gameManager.move(randomMove, randomEntity.pos);
//   if (message === "blue won the game!") {
//     setEndGameMessage("NOOOO!\n You lose the game!");
//     setGameEnd(true);
//   }
//   return { move: randomMove, entityPos: randomEntity.pos };
// };