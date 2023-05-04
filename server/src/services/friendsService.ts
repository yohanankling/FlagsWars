import { FieldValue } from 'firebase-admin/firestore';
import { DbService } from './dbService';

export const addFriend = async (friendId: string, currentUserEmail: string) => {
  const dbService = new DbService();

  const currentUserRef = dbService.getUserDoc(currentUserEmail);

  currentUserRef.update({ friends: FieldValue.arrayUnion(friendId) });

  return getFriends(currentUserEmail);
};

export const getFriends = async (userId: string) => {
  const dbService = new DbService();

  const currentUserRef = dbService.getUserDoc(userId);
  const currentUser = await currentUserRef.get();

  const fullFriendList = await dbService.getUsers((currentUser as any).data().friends);
  return fullFriendList;
};
