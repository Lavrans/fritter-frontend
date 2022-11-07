import type { HydratedDocument } from "mongoose";
import moment from "moment";
import type { FreetResponse } from "../freet/util";
import type { Feed, PopulatedFeed } from "../feed/model";
import type { Freet, PopulatedFreet } from "../freet/model";

type FeedResponse = {
  _id: string;
  content: FreetResponse[];
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
      versionKey: false, // Cosmetics; prevents returning of __v property
    }),
  };
  const content = feedCopy.content
    .sort((a, b) => b.dateModified.getTime() - a.dateModified.getTime())
    .map(constructFreetResponse);
  return {
    _id: feedCopy._id.toString(),
    content,
  };
};
const constructFreetResponse = (freet: PopulatedFreet): FreetResponse => {
  const freetCopy: PopulatedFreet = {
    ...freet,
  };
  const { username } = freetCopy.authorId;
  delete freetCopy.authorId;
  return {
    ...freetCopy,
    _id: freetCopy._id.toString(),
    author: username,
    dateCreated: formatDate(freet.dateCreated),
    dateModified: formatDate(freet.dateModified),
  };
};

const formatDate = (date: Date): string =>
  moment(date).format("MMMM Do YYYY, h:mm:ss a");

export { constructFeedResponse };
