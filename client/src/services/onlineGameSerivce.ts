import { Entity } from 'common';
import { send } from './httpContext';

interface IPos {
  x: number;
  y: number;
}

export const setReady = async (gameId: string, setupEntities: { entity: Entity; pos: IPos }[]) => {
  const data = {
    type: 'set_ready',
    gameId,
    payload: {
      setupEntities,
    },
  };
  await send({ method: 'POST', route: '/game/move', data });
};

export const move = async (gameId: string, from: IPos, to: IPos) => {
  const res = await send({
    method: 'POST',
    route: '/game/move',
    data: { type: 'exec_move', gameId, payload: { move: { from, to } } },
  });
  return res.data;
};



export const updateBoard = async (gameId: string, setupEntity: { entity: Entity; pos: IPos }) => {
  const data = {
    type: 'update',
    gameId,
    payload: {
      setupEntity,
    },
  };

  await send({ method: 'POST', route: '/game/move', data });
}

