import type {HydratedDocument, Types} from 'mongoose';
import type {Friend} from './model';
import FriendModel from './model';
import UserCollection from '../user/collection';
import type {User} from '../user/model';

class FriendCollection {
  static async addOneByUserIds(
    id1: Types.ObjectId | string,
    id2: Types.ObjectId | string
  ): Promise<HydratedDocument<Friend>> {
    const friend = new FriendModel({
      _id: {
        user1: id1,
        user2: id2
      }
    });
    await friend.save();
    const populated = await friend.populate({
      path: '_id',
      populate: {path: 'user1'}
    });
    return populated.populate({path: '_id', populate: {path: 'user2'}});
  }

  static async findAllByUsername(
    username: string
  ): Promise<Array<HydratedDocument<Friend>>> {
    const user = await UserCollection.findOneByUsername(username);
    return FriendModel.find({
      $or: [{'_id.user1': user._id}, {'_id.user2': user._id}]
    })
      .populate({path: '_id', populate: {path: 'user1'}})
      .populate({path: '_id', populate: {path: 'user2'}});
  }

  static async findAllById(
    id: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<User>>> {
    const friends: any = await FriendModel.find({
      $or: [{'_id.user1': id}, {'_id.user2': id}]
    })
      .populate({path: '_id', populate: {path: 'user1'}})
      .populate({path: '_id', populate: {path: 'user2'}});
    return await friends.map((f: any) =>
      f._id.user1._id == id ? f._id.user2 : f._id.user1
    );
  }

  static async deleteOne(
    id1: Types.ObjectId | string,
    id2: Types.ObjectId | string
  ): Promise<boolean> {
    const friend = await FriendModel.deleteOne({
      $or: [
        {
          '_id.user1': id1,
          '_id.user2': id2
        },
        {
          '_id.user1': id2,
          '_id.user2': id1
        }
      ]
    });
    return friend !== null;
  }

  static async findOne(
    id1: Types.ObjectId | string,
    id2: Types.ObjectId | string
  ): Promise<Friend> {
    const friend = await FriendModel.findOne({
      $or: [
        {
          '_id.user1': id1,
          '_id.user2': id2
        },
        {
          '_id.user1': id2,
          '_id.user2': id1
        }
      ]
    });
    return friend;
  }

  static async deleteAllByUserId(
    userId: Types.ObjectId | string
  ): Promise<boolean> {
    const friend = await FriendModel.deleteMany({
      $or: [
        {
          '_id.user1': userId
        },
        {
          '_id.user2': userId
        }
      ]
    });
    return friend !== null;
  }
}

export default FriendCollection;
