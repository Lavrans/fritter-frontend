import type { Request, Response, NextFunction } from "express";
import CommunityCollection from "../community/collection";
import CommunityModel from "./model";

const isMember = async (req: Request, res: Response, next: NextFunction) => {
  const community = await CommunityModel.findOne({
    _id: req.params.communityId,
  });
  const index = community.members.indexOf(req.session.userId);
  if (index < 0) {
    res.status(400).json({
      error: `You are not a member of ${community.name}`,
    });
    return;
  }

  next();
};

const isNotMember = async (req: Request, res: Response, next: NextFunction) => {
  const community = await CommunityModel.findOne({
    _id: req.params.communityId,
  });
  const index = community.members.indexOf(req.session.userId);
  if (index >= 0) {
    res.status(400).json({
      error: `You are already a member of ${community.name}`,
    });
    return;
  }

  next();
};

const isOwner = async (req: Request, res: Response, next: NextFunction) => {
  const community = await CommunityModel.findOne({
    _id: req.params.communityId,
  });
  const { owner } = community;
  if (req.session.userId.toString() != owner.toString()) {
    res.status(401).json({
      error: `You are not the owner of ${community.name}`,
    });
    return;
  }

  next();
};

const isNotOwner = async (req: Request, res: Response, next: NextFunction) => {
  const community = await CommunityModel.findOne({
    _id: req.params.communityId,
  });
  const { owner } = community;
  if (req.session.userId.toString() == owner.toString()) {
    res.status(400).json({
      error: `You are the owner of ${community.name}`,
    });
    return;
  }

  next();
};

const isCommunityExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const community = await CommunityCollection.findOneByCommunityname(
    req.params.communityName
  );
  if (!community) {
    res.status(404).json({
      error: `A community with communityname ${req.params.communityname} does not exist.`,
    });
    return;
  }

  next();
};

const isCommunityExistsById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let community = null;
  try {
    community = await CommunityCollection.findOneByCommunityId(
      req.params.communityId
    );
  } catch {}

  if (!community) {
    res.status(404).json({
      error: `A community with communityname ${req.params.communityname} does not exist.`,
    });
    return;
  }

  next();
};

const isValidCommunityname = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.name) {
    res.status(400).json({
      error: `Community name cannot be blank`,
    });
    return;
  }
  const community = await CommunityCollection.findOneByCommunityname(
    req.body.name as string
  );
  if (community) {
    res.status(409).json({
      error: `A community with name ${req.params.communityname} already exists.`,
    });
    return;
  }

  next();
};

const isValidAction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { action } = req.query;
  if (!action) {
    res.status(400).json({
      error: "Provide action: join | leave",
    });
    return;
  }

  if (action != "join" && action != "leave") {
    res.status(400).json({
      error: `Valid actions: join | leave. You provided: ${action}`,
    });
    return;
  }

  next();
};

const isCanLeaveJoin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { action } = req.query;
  const community = await CommunityCollection.findOneByCommunityId(
    req.params.communityId
  );
  const member = community.members.includes(req.session.userId);
  if (action == "join" && member) {
    res.status(400).json({
      error: `You are already a member of ${community.name}`,
    });
    return;
  }

  if (action == "leave" && !member) {
    res.status(400).json({
      error: `You are not a member of ${community.name}`,
    });
    return;
  }

  next();
};

export {
  isMember,
  isNotMember,
  isOwner,
  isNotOwner,
  isCommunityExists,
  isCommunityExistsById,
  isValidCommunityname,
  isValidAction,
  isCanLeaveJoin,
};
