import { app, firebaseDb } from '..';
import { RequestWithUser, authMiddleware } from '../middlewares/auth';
import { FieldValue } from 'firebase-admin/firestore';
import { Entity, GameManagerFactory, IGameDetails, Position, Team, team } from 'common';
import { rejectGameInvite } from '../services/gameInviteService';
import { Response } from 'express';
import { updateGameData } from '../services/gameService';
import { ref, get } from 'firebase/database';
import { realTimeDb } from '../firebase';
import admin from 'firebase-admin';

type moveType = 'set_ready' | 'exec_move' | 'update';

export const gameController = () => {

  app.post('/invites', async (req: any, res) => {
    const uid = req.body.uid;
    const starCountRef = ref(realTimeDb, 'game_invites/' + uid);
    const snapshot = await get(starCountRef);
    const data = snapshot.val();
    const sentInvites = data?.sent;
    const receivedInvites = data?.received;
    res.json({
      received: receivedInvites,
      sent: sentInvites,
    });
  });

  app.get('/games_listener', async (req, res) => {
    try {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');
      const id = req.query.id;
      const gameRef = admin.database().ref('games/' + id);
      gameRef.on('value', (snapshot) => {
        const data = snapshot.val();
      res.write('event: message\n');
      res.write('data: ' + JSON.stringify(data) + '\n\n');
      req.on('close', () => {
        gameRef.off();
      });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });

  app.delete('/game', async (req: any, res) => {
    const gameId = req.body.gameId;
    const game = (await firebaseDb.ref(`games/${gameId}`).get()).val();
    let challenged: string;
    let challenger: string;
    if (game.player1.challenger) {
      challenger = game.player1.id;
      challenged = game.player2.id;
    } else {
      challenger = game.player2.id;
      challenged = game.player1.id;
    }

    firebaseDb.ref(`games`).update({
      [gameId]: FieldValue.delete(),
    });

    await rejectGameInvite(challenger, challenged);

    res.send(200);
  });

  app.post(
    '/game/move',
    authMiddleware,
    async (
      req: RequestWithUser<
        never,
        never,
        {
          gameId: string;
          type: moveType;
          payload: {
            setupEntities?: {
              entity: Entity;
              pos: Position;
            }[];
            move?: {
              from: Position;
              to: Position;
            };
            setupEntity?: {
              entity: Entity;
              pos: Position;
            };
          };
        }
      >,
      res: Response,
    ) => {
      const gameId = req.body.gameId;
      const currId = req.user?.uid;
      const moveType = req.body.type;

      const game = (await firebaseDb.ref(`games/${gameId}`).get()).val() as IGameDetails;
      const gm = GameManagerFactory.restoreGame(game.game_data);
      let t: team;

      if (game.player1.id === currId) {
        t = game.player1.team;
      } else if (game.player2.id === currId) {
        t = game.player2.team;
      } else {
        //handle user is not part of the game error
        throw new Error('user is not part of the game error');
      }

      let currTeam: Team = t === team.blue ? gm.blueTeam : gm.redTeam;

      switch (moveType) {
        case 'set_ready':
          req.body.payload.setupEntities?.map(({ entity, pos }) => {
            gm.setPiece(entity, pos, false);
          });
          gm.setReady(currTeam);
          const data_game = GameManagerFactory.getData(gm);
          if (!data_game.board[0][0].entity){
            updateGameData(gameId, data_game);
          }
          else{
            updateGameData(gameId, data_game);
          }
          // filter
          break;
        case 'exec_move':
          let message = "error";
          // handle current team turn
          if (!req.body.payload.move) {
            throw new Error('Payload is missing to exec the moves');
          }

          try {
            message = gm.move(req.body.payload.move.to, req.body.payload.move.from);
          } catch (error) {
            return res.send(error);
          }

          const game_data = GameManagerFactory.getData(gm);
          updateGameData(gameId, game_data);
          return res.send(message);
        case 'update':
          try {
            const a = req.body.payload.setupEntity?.entity;
            const position = req.body.payload.setupEntity?.pos;
            if (typeof a !== 'undefined' && typeof position !== 'undefined') {
              gm.setPiece(a, position, true);
              const data = GameManagerFactory.getData(gm);
              updateGameData(gameId, data);
            }
          } catch (error) {
            return res.send(error);
          }
          break;
      }
      res.sendStatus(200);
    },
  );
};
