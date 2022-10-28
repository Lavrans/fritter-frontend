import type { NextFunction, Request, Response } from "express";
import express from "express";
import ReplyCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as replyValidator from "../reply/middleware";
import * as freetValidator from "../freet/middleware";
import * as util from "./util";

const router = express.Router();

/**
 * Get all the replies to a freet
 *
 * @name GET /api/replies/freet/:id
 *
 * @return {ReplyResponse[]} - A list of all the replies sorted in descending
 *                      order by date modified
 */
router.get(
  "/freet/:freetId",
  [freetValidator.isFreetExists],
  async (req: Request, res: Response) => {
    const replies = await ReplyCollection.findAllRepliesToFreet(
      req.params.freetId
    );
    const response = replies.map(util.constructReplyResponse);
    res.status(200).json(response);
  }
);

/**
 * Get all the replies to a reply
 *
 * @name GET /api/replies/reply/:id
 *
 * @return {ReplyResponse[]} - A list of all the replies sorted in descending
 *                      order by date modified
 */
router.get(
  "/reply/:replyId",
  [replyValidator.isReplyExists],
  async (req: Request, res: Response) => {
    const replies = await ReplyCollection.findAllRepliesToReply(
      req.params.replyId
    );
    const response = replies.map(util.constructReplyResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new reply.
 *
 * @name POST /api/replys
 *
 * @param {string} content - The content of the reply
 * @param {string} freetId - The parent freet of the reply
 * @return {ReplyResponse} - The created reply
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the reply content is empty or a stream of empty spaces
 * @throws {413} - If the reply content is more than 140 characters long
 */
router.post(
  "/freet/:freetId",
  [
    userValidator.isUserLoggedIn,
    replyValidator.isValidReplyContent,
    freetValidator.isFreetExists,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ""; // Will not be an empty string since its validated in isUserLoggedIn
    const reply = await ReplyCollection.addOne(
      userId,
      req.body.content,
      req.params.freetId,
      "Freet"
    );

    res.status(201).json({
      message: "Your reply was created successfully.",
      reply: util.constructReplyResponse(reply),
    });
  }
);

/**
 * Create a new reply.
 *
 * @name POST /api/replys
 *
 * @param {string} content - The content of the reply
 * @param {string} replyId - The parent reply of the reply
 * @return {ReplyResponse} - The created reply
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the reply content is empty or a stream of empty spaces
 * @throws {413} - If the reply content is more than 140 characters long
 */
router.post(
  "/reply/:replyId",
  [
    userValidator.isUserLoggedIn,
    replyValidator.isValidReplyContent,
    replyValidator.isReplyExists,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ""; // Will not be an empty string since its validated in isUserLoggedIn
    const reply = await ReplyCollection.addOne(
      userId,
      req.body.content,
      req.params.replyId,
      "Reply"
    );

    res.status(201).json({
      message: "Your reply was created successfully.",
      reply: util.constructReplyResponse(reply),
    });
  }
);

/**
 * Delete a reply
 *
 * @name DELETE /api/replys/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the reply
 * @throws {404} - If the replyId is not valid
 */
router.delete(
  "/:replyId?",
  [
    userValidator.isUserLoggedIn,
    replyValidator.isReplyExists,
    replyValidator.isValidReplyModifier,
  ],
  async (req: Request, res: Response) => {
    await ReplyCollection.deleteOne(req.params.replyId);
    res.status(200).json({
      message: "Your reply was deleted successfully.",
    });
  }
);

/**
 * Modify a reply
 *
 * @name PUT /api/replys/:id
 *
 * @param {string} content - the new content for the reply
 * @return {ReplyResponse} - the updated reply
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the reply
 * @throws {404} - If the replyId is not valid
 * @throws {400} - If the reply content is empty or a stream of empty spaces
 * @throws {413} - If the reply content is more than 140 characters long
 */
router.put(
  "/:replyId?",
  [
    userValidator.isUserLoggedIn,
    replyValidator.isReplyExists,
    replyValidator.isValidReplyModifier,
    replyValidator.isValidReplyContent,
  ],
  async (req: Request, res: Response) => {
    const reply = await ReplyCollection.updateOne(
      req.params.replyId,
      req.body.content
    );
    res.status(200).json({
      message: "Your reply was updated successfully.",
      reply: util.constructReplyResponse(reply),
    });
  }
);

export { router as replyRouter };
