import express, { Application } from 'express';
const cors = require('cors');
import cluster from 'cluster';
import os from 'os';

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import admin from 'firebase-admin';
import { registerControllers } from './controllers/registerControllers';
import { getDatabase } from 'firebase-admin/database';

const serviceAccount = require('../flagswar.json');

const firebaseApp = initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://flagswar-2576b-default-rtdb.firebaseio.com',
});

export const auth = admin.auth();
export const firestoreDb = getFirestore(firebaseApp);
export const firebaseDb = getDatabase(firebaseApp);

const numCPUs = os.cpus().length;

let app: Application;
process.on('warning', e => console.warn(e.stack));

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs-1; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  app = express();

  app.use(
    cors({
      origin: '*',
    }),
  );

  app.use(
    express.urlencoded({
      extended: true,
    }),
  );

  app.use(express.json());

  registerControllers();

  app.get('/', (req, res) => {
    res.send('Hello World');
  });

  app.listen(3001, () => {
    console.log(`Worker ${process.pid} listening on port 3001`);
  });
}

export { app };
