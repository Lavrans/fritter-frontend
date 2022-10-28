import type {HydratedDocument, Types} from 'mongoose';
import type {Feed} from './model';
import FeedModel from './model';

/**
 * This files contains a class that has the functionality to explore feeds
 * stored in MongoDB, including adding, finding, updating, and deleting feeds.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Feed> is the output of the FeedModel() constructor,
 * and contains all the information in Feed. https://mongoosejs.com/docs/typescript.html
 */
class FeedCollection {
  /**
   * Add a feed to the collection
   *
   * @return {Promise<HydratedDocument<Feed>>} - The newly created feed
   */
  static async addOne(): Promise<HydratedDocument<Feed>> {
    const feed = new FeedModel({
      content: []
    });
    await feed.save(); // Saves feed to MongoDB
    return feed;
  }

  /**
   * Find a feed by feedId
   *
   * @param {string} feedId - The id of the feed to find
   * @return {Promise<HydratedDocument<Feed>> | Promise<null> } - The feed with the given feedId, if any
   */
  static async findOne(
    feedId: Types.ObjectId | string
  ): Promise<HydratedDocument<Feed>> {
    return FeedModel.findOne({_id: feedId}).populate('content');
  }

  /**
   * Add a freet to a feed
   *
   * @param {string} feedId - The id of the feed to be updated
   * @param {string} content - The new content to be added
   * @return {Promise<HydratedDocument<Feed>>} - The newly updated feed
   */
  static async addContent(
    feedId: Types.ObjectId | string,
    content: Types.ObjectId
  ): Promise<HydratedDocument<Feed>> {
    const feed = await FeedModel.findOne({_id: feedId});
    feed.content.push(content);
    await feed.save();
    return feed.populate('content');
  }

  /**
   * Remove a freet from a feed
   *
   * @param {string} feedId - The id of feed to remove content from
   * @param {string} freetId - The id of freet to remove
   * @return {Promise<Boolean>} -
   */
  static async removeContentFromFeed(
    feedId: Types.ObjectId | string,
    freetId: Types.ObjectId
  ): Promise<boolean> {
    const feed = await FeedModel.findOne({_id: feedId});
    const index = feed.content.indexOf(freetId);
    index >= 0 && feed.content.splice(index, 1);
    await feed.save();
    return feed != null;
  }

  /**
   * Remove a freet from all feeds
   *
   * @param {string} freetId - The id of freet to remove from all feeds
   * @return {Promise<Boolean>} - false if the freet is in no documents, otherwise true
   */
  static async removeContent(freetId: Types.ObjectId): Promise<boolean> {
    const feed = await FeedModel.find({content: freetId});
    feed.forEach(async f => {
      const index = f.content.indexOf(freetId);
      f.content.splice(index, 1);
      await f.save();
    });
    return feed != null;
  }

  /**
   * Delete a feed
   *
   * @param {string} feedId - The id of the feed to delete
   */
  static async deleteFeed(feedId: Types.ObjectId | string): Promise<void> {
    await FeedModel.deleteOne({_id: feedId});
  }
}

export default FeedCollection;
