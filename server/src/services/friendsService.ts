import { FieldValue } from 'firebase-admin/firestore';
import { DbService } from './dbService';

export const addFriend = async (friendId: string, currentUserId: string) => {
  const dbService = new DbService();

  const currentUserRef = dbService.getUserDoc(currentUserId);

  currentUserRef.update({ friends: FieldValue.arrayUnion(friendId) });

  return getFriends(currentUserId);
};

export const getFriends = async (userId: string) => {
  const dbService = new DbService();

  const currentUserRef = dbService.getUserDoc(userId);
  const currentUser = await currentUserRef.get();

  const fullFriendList = await dbService.getUsers((currentUser as any).data().friends);
  return fullFriendList;
};


export const getUid = async (email: string) => {
  const dbService = new DbService();
  const currentUserRef = dbService.getUsersCollection();
  const query = currentUserRef.where("email", "==", email);
  const results = await query.get();
  if (results.empty) {
    return "Email not exist!";
  }
  return results.docs[0].id;
};

export const getDoc = async (uid: string) => {
  const dbService = new DbService();
  const currentUserRef = dbService.getUsersCollection();
  const doc = await currentUserRef.doc(uid).get();
  if (!doc.exists) {
    throw new Error("Document does not exist.");
  }
  return doc.data();
  return uid;
};
