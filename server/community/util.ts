import type {HydratedDocument} from 'mongoose';
import type {Community} from './model';

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
  community: HydratedDocument<Community>
): CommunityResponse => {
  const communityCopy: Community = {
    ...community.toObject({
      versionKey: false
    })
  };
  const members = communityCopy.members.length;
  return {
    ...communityCopy,
    _id: communityCopy._id.toString(),
    owner: communityCopy.owner.toString(),
    members,
    feed: communityCopy.feed.toString()
  };
};

export {constructCommunityResponse};
