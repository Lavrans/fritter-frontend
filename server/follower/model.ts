import FriendCollection from '../friend/collection';
import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Follower = {
  _id: {follower: Types.ObjectId; followee: Types.ObjectId};
};
export type PopulatedFollower = {
  _id: {follower: User; followee: User};
};

const FollowerSchema = new Schema<Follower>({
  _id: {
    follower: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    followee: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }
});

FollowerSchema.pre('save', async function (this: any, next) {
  const follower = await FollowerModel.findOne({
    '_id.follower': this._id.followee.toString(),
    '_id.followee': this._id.follower.toString()
  }).exec();
  if (follower !== null) {
    FriendCollection.addOneByUserIds(this._id.follower, this._id.followee);
  }

  next();
});
FollowerSchema.pre('deleteOne', async function (this: any, next) {
  const query = await this.getQuery();
  FriendCollection.deleteOne(query['_id.follower'], query['_id.followee']);
  next();
});

const FollowerModel = model<Follower>('Follower', FollowerSchema);
export default FollowerModel;
