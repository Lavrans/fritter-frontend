import type { Request, Response, NextFunction } from "express";
import FreetCollection from "../freet/collection";
import { Types } from "mongoose";
import ReplyCollection from "../reply/collection";

/**
 * Checks if a reply with replyId is req.params exists
 */
const isReplyExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validFormat = Types.ObjectId.isValid(req.params.replyId);
  const reply = validFormat
    ? await ReplyCollection.findOne(req.params.replyId)
    : "";
  if (!reply) {
    res.status(404).json({
      error: {
        replyNotFound: `Reply with reply ID ${req.params.replyId} does not exist.`,
      },
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the reply in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidReplyContent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { content } = req.body as { content: string };
  if (!content.trim()) {
    res.status(400).json({
      error: "Reply content must be at least one character long.",
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: "Reply content must be no more than 140 characters.",
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the reply whose replyId is in req.params
 */
const isValidReplyModifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reply = await ReplyCollection.findOne(req.params.replyId);
  const userId = reply.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: "Cannot modify other users' replys.",
    });
    return;
  }

  next();
};

export { isValidReplyContent, isReplyExists, isValidReplyModifier };
