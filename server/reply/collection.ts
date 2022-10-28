import type {HydratedDocument, Types} from 'mongoose';
import type {Reply} from './model';
import ReplyModel from './model';

/**
 * This files contains a class that has the functionality to explore replies
 * stored in MongoDB, including adding, finding, updating, and deleting replies.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Reply> is the output of the ReplyModel() constructor,
 * and contains all the information in Reply. https://mongoosejs.com/docs/typescript.html
 */
class ReplyCollection {
  /**
   * Add a reply to the collection
   *
   * @param {string} authorId - The id of the author of the reply
   * @param {string} content - The id of the content of the reply
   * @return {Promise<HydratedDocument<Reply>>} - The newly created reply
   */
  static async addOne(
    authorId: Types.ObjectId | string,
    content: string,
    parent: Types.ObjectId | string,
    parentType: string
  ): Promise<HydratedDocument<Reply>> {
    const date = new Date();
    const reply = new ReplyModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date,
      parent,
      parentType
    });
    await reply.save(); // Saves reply to MongoDB
    return reply.populate('authorId');
  }

  /**
   * Get all the replies to a freet
   *
   * @param {string}  freetId - freetId of parent freet
   * @return {Promise<HydratedDocument<Reply>[]>} - An array of all of the replies to the freet
   */
  static async findAllRepliesToFreet(
    freetId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Reply>>> {
    // Retrieves replies and sorts them from most to least recent
    return ReplyModel.find({parent: freetId})
      .sort({dateModified: -1})
      .populate('authorId');
  }

  /**
   * Get all the replies to a Reply
   *
   * @param {string}  replyId - replyId of parent reply
   * @return {Promise<HydratedDocument<Reply>[]>} - An array of all of the replies to the reply
   */
  static async findAllRepliesToReply(
    replyId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Reply>>> {
    // Retrieves replies and sorts them from most to least recent
    return ReplyModel.find({parent: replyId})
      .sort({dateModified: -1})
      .populate('authorId');
  }

  /**
   * Get one reply
   *  @param {string} replyId - The id of the reply
   *  @return {Promise<HydratedDocument<Reply>>} - A reply
   */
  static async findOne(
    replyId: Types.ObjectId | string
  ): Promise<HydratedDocument<Reply>> {
    return ReplyModel.findOne({_id: replyId}).populate('authorId');
  }

  /**
   * Update a reply with the new content
   *
   * @param {string} replyId - The id of the reply to be updated
   * @param {string} content - The new content of the reply
   * @return {Promise<HydratedDocument<Reply>>} - The newly updated reply
   */
  static async updateOne(
    replyId: Types.ObjectId | string,
    content: string
  ): Promise<HydratedDocument<Reply>> {
    const reply = await ReplyModel.findOne({_id: replyId});
    reply.content = content;
    reply.dateModified = new Date();
    await reply.save();
    return reply.populate('authorId');
  }

  /**
   * Delete a reply with given replyId.
   *
   * @param {string} replyId - The replyId of reply to delete
   * @return {Promise<Boolean>} - true if the reply has been deleted, false otherwise
   */
  static async deleteOne(replyId: Types.ObjectId | string): Promise<boolean> {
    const reply = await ReplyModel.deleteOne({_id: replyId});
    return reply !== null;
  }

  /**
   * Delete all the replies by the given author
   *
   * @param {string} authorId - The id of author of replies
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await ReplyModel.deleteMany({authorId});
  }
}

export default ReplyCollection;
