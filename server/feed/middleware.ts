import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FeedCollection from '../feed/collection';

/**
 * Checks if a feed with feedId is req.params exists
 */
const isFeedExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validFormat = Types.ObjectId.isValid(req.params.feedId);
  const feed = validFormat
    ? await FeedCollection.findOne(req.params.feedId)
    : '';
  if (!feed) {
    res.status(404).json({
      error: {
        feedNotFound: `Feed with feed ID ${req.params.feedId} does not exist.`
      }
    });
    return;
  }

  next();
};

export {isFeedExists};
