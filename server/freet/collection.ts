import type { HydratedDocument, Types } from "mongoose";
import type { Freet } from "./model";
import { Types as T } from "mongoose";
import FreetModel from "./model";
import UserCollection from "../user/collection";
import FeedCollection from "../feed/collection";
import FollowerCollection from "../follower/collection";
import FriendCollection from "../friend/collection";
import CommunityCollection from "../community/collection";

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FreetCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(
    authorId: Types.ObjectId | string,
    content: string,
    friendsOnly: boolean,
    communityId: Types.ObjectId | string
  ): Promise<HydratedDocument<Freet>> {
    const date = new Date();
    const freet = new FreetModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date,
      friendsOnly,
    });
    await freet.save(); // Saves freet to MongoDB
    if (communityId != undefined) {
      const community = await CommunityCollection.findOneByCommunityId(
        communityId
      );
      await FeedCollection.addContent(community.feed, freet._id);
    }
    if (communityId === undefined && friendsOnly) {
      const friends = await FriendCollection.findAllById(authorId);
      friends.forEach(async (f) => {
        await FeedCollection.addContent(f.feed, freet._id);
      });
    } else {
      const followers = await FollowerCollection.findAllById(authorId);
      followers.forEach(async (f) => {
        await FeedCollection.addContent(f._id.follower.feed, freet._id);
      });
    }

    return freet.populate("authorId");
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(
    freetId: Types.ObjectId | string
  ): Promise<HydratedDocument<Freet>> {
    return FreetModel.findOne({ _id: freetId }).populate("authorId");
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Freet>>> {
    // Retrieves freets and sorts them from most to least recent
    return FreetModel.find({ friendsOnly: false })
      .sort({ dateModified: -1 })
      .populate("authorId");
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(
    username: string,
    userId: Types.ObjectId | string = null
  ): Promise<Array<HydratedDocument<Freet>>> {
    const author = await UserCollection.findOneByUsername(username);
    let filter: any = { authorId: author._id };
    if (userId !== null) {
      const friends = await FriendCollection.findOne(userId, author._id);
      if (friends === null && author._id.toString() !== userId.toString()) {
        filter.friendsOnly = false;
      }
    }
    return FreetModel.find(filter)
      .sort({ dateModified: -1 })
      .populate("authorId");
  }

  /**
   * Update a freet with the new content
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateOne(
    freetId: Types.ObjectId | string,
    content: string
  ): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({ _id: freetId });
    freet.content = content;
    freet.dateModified = new Date();
    await freet.save();
    return freet.populate("authorId");
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    await FeedCollection.removeContent([new T.ObjectId(freetId)]);
    const freet = await FreetModel.deleteOne({ _id: freetId });
    return freet !== null;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    const freets = await FreetModel.find({ authorId });
    await FeedCollection.removeContent(freets.map((f) => f._id));
    freets.forEach(async (f) => {
      await f.delete();
    });
  }
}

export default FreetCollection;
