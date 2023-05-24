// import { app } from './server/src';
//
// app.get('/test', async (req, res) => {
//   try {
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     const gameRef = admin.database().ref('test');
//     gameRef.on('value', (snapshot) => {
//       const data = snapshot.val();
//       res.write('event: message\n');
//       res.write('data: ' + JSON.stringify(data) + '\n\n');
//       req.on('close', () => {
//         gameRef.off('value');
//       });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('An error occurred');
//   }
// });