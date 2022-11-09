import FeedCollection from "../feed/collection";
import type { HydratedDocument, Types } from "mongoose";
import type { PopulatedCommunity, Community } from "./model";
import { Types as T } from "mongoose";
import CommunityModel from "./model";

class CommunityCollection {
  static async addOne(
    name: string,
    owner: Types.ObjectId | string
  ): Promise<HydratedDocument<Community>> {
    const feed = await FeedCollection.addOne();

    const community = new CommunityModel({
      name,
      owner,
      members: [owner],
      feed: feed._id,
    });
    await community.save(); // Saves community to MongoDB
    return community;
  }

  static async findAll(): Promise<Array<HydratedDocument<PopulatedCommunity>>> {
    return CommunityModel.find({}).populate("owner");
  }

  static async findOneByCommunityId(
    communityId: Types.ObjectId | string
  ): Promise<HydratedDocument<PopulatedCommunity>> {
    return CommunityModel.findOne({ _id: communityId }).populate("owner");
  }

  static async findOneByCommunityname(
    communityname: string
  ): Promise<HydratedDocument<PopulatedCommunity>> {
    return CommunityModel.findOne({
      name: new RegExp(`^${communityname.trim()}$`, "i"),
    }).populate("owner");
  }

  static async updateOwner(
    communityId: Types.ObjectId | string,
    owner: Types.ObjectId | string
  ): Promise<HydratedDocument<Community>> {
    const community = await CommunityModel.findOne({ _id: communityId });
    if (
      community.members.map((m) => m.toString()).indexOf(owner.toString()) ===
      -1
    ) {
      community.members.push(new T.ObjectId(owner));
    }
    community.owner = new T.ObjectId(owner);

    await community.save();
    return community;
  }

  static async addMember(
    communityId: Types.ObjectId | string,
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<Community>> {
    const community = await CommunityModel.findOne({ _id: communityId });
    community.members.push(new T.ObjectId(userId));
    await community.save();
    return community;
  }

  static async removeMember(
    communityId: Types.ObjectId | string,
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<Community>> {
    const community = await CommunityModel.findOne({ _id: communityId });
    const index = community.members.indexOf(new T.ObjectId(userId));
    index >= 0 && community.members.splice(index, 1);
    await community.save();
    return community;
  }

  static async deleteOne(
    communityId: Types.ObjectId | string
  ): Promise<boolean> {
    const community = await CommunityModel.findOne({ _id: communityId });
    await FeedCollection.deleteFeed(community.feed);
    await community.delete();
    return community !== null;
  }

  static async deleteAllByOwner(owner: Types.ObjectId | string): Promise<void> {
    const communities = await CommunityModel.find({ owner });
    communities.forEach(async (c) => {
      await FeedCollection.deleteFeed(c.feed);
      await c.delete();
    });
  }
}

export default CommunityCollection;
