import { app } from '..';
import { authMiddleware } from '../middlewares/auth';
import { DbService } from '../services/dbService';
import {
  acceptGameInvite, deleteInv,
  delGame, getWaitingGames,
  inviteToGame,
  makeAgame,
  rejectGameInvite,
  setNewGame,
} from '../services/gameInviteService';
import { addFriend, getDoc, getFriends, getUid, lose, win } from '../services/friendsService';
import admin from 'firebase-admin';

export const friendsController = () => {
  app.post('/getuid', authMiddleware, async (req: any, res) => {
    const email = req.body?.email;
    const uid = await getUid(email);
    res.send(uid);
  });

  app.post('/getdoc', authMiddleware, async (req: any, res) => {
      const uid = req.body?.uid;
      const doc = await getDoc(uid);
      res.send(doc);
    });

  app.post('/win', authMiddleware, async (req: any, res) => {
    const uid = req.body?.uid;
    const doc = await win(uid);
    res.send(doc);
  });

  app.post('/lose', authMiddleware, async (req: any, res) => {
    const uid = req.body?.uid;
    const doc = await lose(uid);
    res.send(doc);
  });

  app.get('/friends', authMiddleware, async (req: any, res) => {
    const uid = req.user.uid;
    const friends = await getFriends(uid);
    res.send(friends);
  });

  app.post('/friends', authMiddleware, async (req: any, res) => {
    const uid = req.user.uid;
    const friendId = req.body?.newFriendId;

    if (uid === friendId) {
      return res.status(400).send({ message: 'Cannot add yourself as a friend' });
    }

    if (!friendId) {
      return res.status(400).send({ message: 'No friend id was sent' });
    }

    const dbService = new DbService();

    const currentUserRef = dbService.getUserDoc(uid);
    const currentUser = await currentUserRef.get();

    if ((currentUser as any).data().friends.includes(friendId)) {
      return res.status(409).send({ message: 'User is already on your friends list' });
    }

    const friend = await dbService.getUser(friendId);
    if (!friend?.exists) {
      return res.status(400).send({ message: 'User with the given Id was not found' });
    }

    try {
      const friendList = await addFriend(friendId, uid);
      res.status(200).send(friendList);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });

  app.post('/friends/gameinvite', authMiddleware, async (req: any, res) => {
    const friendUid = req.body.friendId;
    const currentUid = req.user.uid;

    if (friendUid == null) {
      return res.status(400).send({ message: 'uId is missing' });
    }

    const dbService = new DbService();

    const current = await dbService.getUser(req.user.uid);

    if (!(current?.data() as any).friends.includes(friendUid)) {
      return res.status(400).send({ message: 'User is not your friend' });
    }

    const invitedFriend = await dbService.getUser(friendUid);

    if (!(invitedFriend?.data() as any).friends.includes(currentUid)) {
      return res.status(400).send({ message: 'The invited user did not accept your friend request' });
    }

    try {
      inviteToGame(currentUid, friendUid);
      res.send(200);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });

  app.post('/friends/gameinvite/answer', authMiddleware, async (req: any, res) => {
    const answerVal = req.body?.answer as boolean;
    const friendUid = req.body?.friendUid as string;
    const currentUid = req.user.uid as string;
    if (answerVal) {
      await acceptGameInvite(currentUid, friendUid);
    } else {
      try {
        await rejectGameInvite(friendUid, currentUid);
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
    }
  });

  app.post('/delinvitation', authMiddleware, async (req: any, res) => {
    const uid = req.body?.uid as string;
    await deleteInv(uid);
    res.send();
  });

  app.post('/waiting_games', authMiddleware, async (req: any, res) => {
    res.send(await getWaitingGames());
  });

  app.get('/waiting_games_listener', async (req, res) => {
    try {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');
      const id = req.query.id;
      const gameRef = admin.database().ref('waiting_games/' + id);
      gameRef.on('value', (snapshot) => {
        let data = snapshot.val();
        if (data === null){
          data = "empty";
        }
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

  app.post('/randomgame', authMiddleware, async (req: any, res) => {
    const uid = req.body?.inviter;
    setNewGame(uid);
    res.send();
  });

  app.post('/randomgame/match', authMiddleware, async (req: any, res) => {
    const friendUid = req.body?.friendUid as string;
    const currentUid = req.user.uid as string;
      const gameKey = await makeAgame(currentUid, friendUid);
      res.send(gameKey);
  });


  app.post('/delrandomgame', authMiddleware, async (req: any, res) => {
    const uid = req.body?.inviter;
    delGame(uid);
    res.send();
  });
};

