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
//
//   // Check if all pieces are flags or mommies
//   const allFlagOrMommy = currentTeamOnBoardEntities.every(
//     entity => entity.entity.type === "flag" || entity.entity.type === "mommy"
//   );
//   if (allFlagOrMommy) {
//     gameManager.move({ x: -1, y: -1 }, { x: -1, y: -1 });
//     return { move: { x: -1, y: -1 }, entityPos: { x: -1, y: -1 } };
//   }
//
//   // Sort pieces by rank
//   const sortedPieces = currentTeamOnBoardEntities.sort(
//     (a, b) => b.entity.level - a.entity.level
//   );
//
//   let randomMove;
//   let randomEntity;
//
//   // // Check if flag is in access
//   // const flagInAccess = sortedPieces.some(entity => {
//   //   const possibleMovesBoard = entity.entity.getPossibleMoves?.(
//   //     entity.pos.x,
//   //     entity.pos.y,
//   //     gameManager.board
//   //   );
//   //   return (
//   //     possibleMovesBoard?.isHighlighted(gameManager.board.flagPos.x, gameManager.board.flagPos.y) ??
//   //     false
//   //   );
//   // });
//   //
//   // if (flagInAccess) {
//   //   // Move towards flag
//   //   const flagPos = gameManager.board.flagPos;
//   //   randomEntity = sortedPieces.find(entity => {
//   //     const possibleMovesBoard = entity.entity.getPossibleMoves?.(
//   //       entity.pos.x,
//   //       entity.pos.y,
//   //       gameManager.board
//   //     );
//   //     return (
//   //       possibleMovesBoard?.isHighlighted(flagPos.x, flagPos.y) ?? false
//   //     );
//   //   });
//   //   const possibleMovesBoard = randomEntity.entity.getPossibleMoves?.(
//   //     randomEntity.pos.x,
//   //     randomEntity.pos.y,
//   //     gameManager.board
//   //   );
//   //   randomMove = possibleMovesBoard.getHighlightPositions().find(pos => {
//   //     return pos.x === flagPos.x && pos.y === flagPos.y;
//   //   });
//   // } else {
//   // Capture higher-ranked pieces and avoid lower-ranked pieces
//   let foundMove = false;
//   for (const piece of sortedPieces) {
//     const possibleMovesBoard = piece.entity.getPossibleMoves?.(
//       piece.pos.x,
//       piece.pos.y,
//       gameManager.board
//     );
//     for (const move of possibleMovesBoard.getHighlightPositions()) {
//       const targetPiece = gameManager.board.getEntity(move.x, move.y);
//       if (!targetPiece || targetPiece.team !== t.team) {
//         if (!foundMove && targetPiece && targetPiece.level > piece.entity.level) {
//           // Capture higher-ranked piece
//           foundMove = true;
//           randomMove = move;
//           randomEntity = piece;
//         } else if (!foundMove && !targetPiece) {
//           // Move towards empty space
//           foundMove = true;
//           randomMove = move;
//           randomEntity = piece;
//         } else if (!foundMove && targetPiece && targetPiece.level < piece.entity.level) {
//           // Avoid lower-ranked piece
//           foundMove = true;
//           break;
//         }
//       }
//     }
//     if (foundMove) break;
//   }
//
//
//   const message = gameManager.move(randomMove, randomEntity.pos);
//   if (message === "blue won the game!") {
//     setEndGameMessage("NOOOO!\n You lose the game!");
//     setGameEnd(true);
//   }
//
//   return { move: randomMove, entityPos: randomEntity.pos };
// };