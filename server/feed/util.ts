import type {HydratedDocument} from 'mongoose';
import type {Feed, PopulatedFeed} from '../feed/model';
import type {Freet} from '../freet/model';

type FeedResponse = {
  _id: string;
  content: Freet[];
};

/**
 * Transform a raw Feed object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Feed>} feed - A feed
 * @returns {FeedResponse} - The feed object formatted for the frontend
 */
const constructFeedResponse = (feed: HydratedDocument<Feed>): FeedResponse => {
  const feedCopy: PopulatedFeed = {
    ...feed.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const content = feedCopy.content.sort(
    (a, b) => b.dateModified.getTime() - a.dateModified.getTime()
  );
  return {
    _id: feedCopy._id.toString(),
    content
  };
};

export {constructFeedResponse};
