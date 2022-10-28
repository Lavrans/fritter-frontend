import { Freet } from "../freet/model";
import type { Types, PopulatedDoc, Document } from "mongoose";
import { Schema, model } from "mongoose";
import type { User } from "../user/model";

/**
 * This file defines the properties stored in a Reply
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Reply on the backend
export type Reply = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  parent: Types.ObjectId;
  parentType: string;
};

export type PopulatedReply = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  parent: Types.ObjectId;
  parentType: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Replys stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ReplySchema = new Schema<Reply>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  // The date the reply was created
  dateCreated: {
    type: Date,
    required: true,
  },
  // The content of the reply
  content: {
    type: String,
    required: true,
  },
  // The date the reply was modified
  dateModified: {
    type: Date,
    required: true,
  },
  parent: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "parentType",
  },
  parentType: {
    type: String,
    enum: ["Freet", "Reply"],
    required: true,
  },
});

ReplySchema.pre("deleteOne", async function (this: any, next) {
  const query = this.getQuery();
  await ReplyModel.deleteMany({
    parent: query._id,
    parentType: "Reply",
  }).exec();
  next();
});
ReplySchema.pre("deleteMany", async function (this: any, next) {
  const query = this.getQuery();
  const replies = await ReplyModel.find({
    parent: query.parent,
    parentType: query.parentType,
  });
  replies.forEach(async (r) => {
    await ReplyModel.deleteOne({
      _id: r._id,
    }).exec();
  });
  next();
});

const ReplyModel = model<Reply>("Reply", ReplySchema);
export default ReplyModel;
