import type { HydratedDocument, Types } from "mongoose";
import { Types as T } from "mongoose";
import type { PopulatedCommunity } from "./model";
import type { User } from "../user/model";

type CommunityResponse = {
  _id: string;
  name: string;
  owner: string;
  members: number;
  feed: string;
  isMember: boolean;
};
export type PopulatedCommunityWithIsMember = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string;
  owner: User;
  members: Types.ObjectId[];
  feed: Types.ObjectId;
  isMember: boolean;
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
  community: PopulatedCommunityWithIsMember
): CommunityResponse => {
  const communityCopy: PopulatedCommunityWithIsMember = { ...community };
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

const addIsMember = (
  community: HydratedDocument<PopulatedCommunity>,
  userId: Types.ObjectId | string
): PopulatedCommunityWithIsMember => {
  const communityCopy: PopulatedCommunity = {
    ...community.toObject({
      versionKey: false,
    }),
  };
  const isMember =
    communityCopy.members.map((m) => m.toString()).indexOf(userId?.toString()) >
    -1;
  const communityWithIsMember: PopulatedCommunityWithIsMember = {
    ...communityCopy,
    isMember,
  };
  return communityWithIsMember;
};
export { constructCommunityResponse, addIsMember };
