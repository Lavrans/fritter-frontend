import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Friend = {
  _id: {user1: Types.ObjectId; user2: Types.ObjectId};
};
export type PopulatedFriend = {
  _id: {user1: User; user2: User};
};

const FriendSchema = new Schema<Friend>({
  _id: {
    user1: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    user2: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }
});

const FriendModel = model<Friend>('Friend', FriendSchema);
export default FriendModel;
