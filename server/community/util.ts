import type { HydratedDocument } from "mongoose";
import type { PopulatedCommunity } from "./model";

type CommunityResponse = {
  _id: string;
  name: string;
  owner: string;
  members: number;
  feed: string;
};

/**
 * Transform a raw Community object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<Community>} community - A community object
 * @returns {CommunityResponse} - The community object without the password
 */
const constructCommunityResponse = (
  community: HydratedDocument<PopulatedCommunity>
): CommunityResponse => {
  const communityCopy: PopulatedCommunity = {
    ...community.toObject({
      versionKey: false,
    }),
  };
  const members = communityCopy.members.length;
  const { username } = communityCopy.owner;
  return {
    ...communityCopy,
    _id: communityCopy._id.toString(),
    owner: username,
    members,
    feed: communityCopy.feed.toString(),
  };
};

export { constructCommunityResponse };
