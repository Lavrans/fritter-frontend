import type {Request, Response} from 'express';
import express from 'express';
import FeedCollection from './collection';
import * as util from './util';
import * as feedValidator from './middleware';

const router = express.Router();

/**
 * Get a feed
 *
 * @name GET /api/feeds/:id
 *
 * @return {FeedResponse} - the feed
 * @throws {404} - If the feedId is not valid
 * @throws {400} - If the feedId is empty or a stream of empty spaces
 */
router.get(
  '/:feedId',
  [feedValidator.isFeedExists],
  async (req: Request, res: Response) => {
    const feed = await FeedCollection.findOne(req.params.feedId);
    res.status(200).json({
      message: 'Success',
      feed: util.constructFeedResponse(feed)
    });
  }
);

router.get('/', (req: Request, res: Response) => {
  res.status(400).json({
    error: 'Provided feedId must be nonempty.'
  });
});

export {router as feedRouter};
