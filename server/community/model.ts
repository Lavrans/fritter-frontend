import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a Community
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Community on the backend
export type Community = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string;
  owner: Types.ObjectId;
  members: Types.ObjectId[];
  feed: Types.ObjectId;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Communitys stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const CommunitySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  ],
  feed: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Feed'
  }
});

const CommunityModel = model<Community>('Community', CommunitySchema);
export default CommunityModel;
