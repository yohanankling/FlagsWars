// import { GameManagerFactory } from './common/src';
// import { send } from './client/src/services/httpContext';
//
// const gameRef = useRef(null);
//
// useEffect(() => {
//   listenForGame();
// }, []);
//
// useEffect(() => {
//   if (gameRef.current) {
//     setGameDetails(gameRef.current.data);
//     setGameManager(GameManagerFactory.restoreGame(gameRef.current.data.game_data));
//   }
// }, [gameRef]);
//
// const listenForGame = async () => {
//   const response = await send({ method: 'POST', route: '/games_listener', data: { id: id } });
//   const data = response.data;
//   const gameDetails = { player1: data.player1, player2: data.player2 };
//   setGameDetails(gameDetails);
//   setGameManager(GameManagerFactory.restoreGame(data.game_data));
//   if (!initialLoad) setInitialLoad(true);
//
//   gameRef.current = {
//     data: {
//       ...gameRef.current?.data,
//       ...data
//     }
//   };
// };