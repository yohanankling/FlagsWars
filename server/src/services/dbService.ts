import { Firestore } from '@google-cloud/firestore';
import { firestoreDb } from '..';
import admin from 'firebase-admin';
import { FieldPath } from 'firebase-admin/firestore';

interface User {
  name?: string;
  uid?: string;
  friends?: string[];
}

interface UserWithId extends User {
  uid?: string;
}

export class DbService {
  private firestoreDb: Firestore;

  constructor() {
    this.firestoreDb = firestoreDb;
  }

  public getUsersCollection() {
    return this.firestoreDb.collection('users');
  }

  public getUserDoc(docKey: string) {
    return this.getUsersCollection().doc(docKey);
  }

  public async getUser(userKey: string) {
    try {
      return await this.getUserDoc(userKey).get();
    } catch (error) {
      console.warn(error);
    }
  }

  public async getAuthUsers() {
    const authUsers = await admin.auth().listUsers();

    return authUsers;
  }

  public async getAuthUser(email: string) {
    const snapshot = await this.getAuthUsers();
    const user = snapshot.users.find((u) => u.email === email);
    return user;
  }

  public async setUser(email: string, user: User) {
    try {
      return await this.getUsersCollection().doc(email).set(user);
    } catch (error) {
      console.warn(error);
    }
  }

  public async ensureUserInDb(email: string) {
    const user = await this.getUser(email);

    if (!user?.exists) {
      const authUser = await this.getAuthUser(email);
      const newFirestoreUser: User = { uid: authUser?.uid, friends: [], name: authUser?.displayName };

      await this.setUser(email, newFirestoreUser);
    }
  }

  public async getUsers(usersIds: string[]) {
    if (!usersIds.length) return [];

    const usersSnapshot = await this.getUsersCollection().where(FieldPath.documentId(), 'in', usersIds).get();
    const users: UserWithId[] = [];
    usersSnapshot.forEach((u: any) => users.push({ uid: u.data().uid }));

    for (let i = 0; i < usersIds.length; i++) {
      users[i].uid = usersIds[i];
    }

    return users;
  }
}