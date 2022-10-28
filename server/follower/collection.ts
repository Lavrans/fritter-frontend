import type {HydratedDocument, Types} from 'mongoose';
import type {Follower, PopulatedFollower} from './model';
import FollowerModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';
import FeedCollection from '../feed/collection';

class FollowerCollection {
  static async addOneByUsername(
    followerId: Types.ObjectId | string,
    username: string
  ): Promise<HydratedDocument<Follower>> {
    const user = await UserCollection.findOneByUsername(username);
    const follower = new FollowerModel({
      _id: {
        follower: followerId,
        followee: user._id
      }
    });
    await follower.save();
    const freets = await FreetCollection.findAllByUsername(username);
    const {feed} = await UserCollection.findOneByUserId(followerId);
    freets.forEach(async f => {
      if (!f.friendsOnly) {
        FeedCollection.addContent(feed, f._id);
      }
    });
    return follower.populate({path: '_id', populate: {path: 'follower'}});
  }

  static async findAllByUsername(
    username: string
  ): Promise<Array<HydratedDocument<Follower>>> {
    const user = await UserCollection.findOneByUsername(username);
    return FollowerModel.find({'_id.followee': user._id})
      .populate({path: '_id', populate: {path: 'follower'}})
      .populate({path: '_id', populate: {path: 'followee'}});
  }

  static async findAllById(
    id: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<PopulatedFollower>>> {
    return FollowerModel.find({'_id.followee': id})
      .populate({path: '_id', populate: {path: 'follower'}})
      .populate({path: '_id', populate: {path: 'followee'}});
  }

  static async deleteOneByUsername(
    followerId: Types.ObjectId | string,
    username: string
  ): Promise<boolean> {
    const user = await UserCollection.findOneByUsername(username);
    const follower = await FollowerModel.deleteOne({
      '_id.follower': followerId,
      '_id.followee': user._id
    });
    const freets = await FreetCollection.findAllByUsername(username);
    const {feed} = await UserCollection.findOneByUserId(followerId);
    freets.forEach(async f => {
      FeedCollection.removeContentFromFeed(feed, f._id);
    });
    return follower !== null;
  }

  static async findOneByUsername(
    followerId: Types.ObjectId,
    username: string
  ): Promise<Follower> {
    const user = await UserCollection.findOneByUsername(username);
    const follower = await FollowerModel.findOne({
      '_id.follower': followerId,
      '_id.followee': user._id
    });
    return follower;
  }

  static async deleteAllByUserId(
    userId: Types.ObjectId | string
  ): Promise<boolean> {
    const follower = await FollowerModel.deleteMany({
      $or: [
        {
          '_id.follower': userId
        },
        {
          '_id.followee': userId
        }
      ]
    });
    return follower !== null;
  }
}

export default FollowerCollection;
