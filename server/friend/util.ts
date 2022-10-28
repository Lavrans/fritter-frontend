import type {HydratedDocument, Types} from 'mongoose';
import type {Friend, PopulatedFriend} from './model';

// Update this if you add a property to the Friend type!
type FriendResponse = {
  user: string;
};

/**
 * Transform a raw Friend object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Friend>} friend - A populated friend document
 * @returns {FriendResponse} - The friend object formatted for the frontend
 */
const constructFriendResponse = (
  friend: HydratedDocument<Friend>,
  userId: Types.ObjectId | string
): FriendResponse => {
  const friendCopy: PopulatedFriend = {
    ...friend.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  console.log(userId, friendCopy._id.user1._id.toString());
  const user
    = userId == friendCopy._id.user1._id.toString()
      ? friendCopy._id.user2.username
      : friendCopy._id.user1.username;
  return {
    user
  };
};

export {constructFriendResponse};
