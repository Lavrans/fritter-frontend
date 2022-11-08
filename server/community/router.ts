import type { Request, Response } from "express";
import express from "express";
import CommunityCollection from "./collection";
import * as communityValidator from "../community/middleware";
import * as userValidator from "../user/middleware";
import * as util from "./util";
import UserCollection from "../user/collection";

const router = express.Router();

router.post(
  "/",
  [userValidator.isUserLoggedIn, communityValidator.isValidCommunityname],
  async (req: Request, res: Response) => {
    const community = await CommunityCollection.addOne(
      req.body.name,
      req.session.userId
    );
    res.status(201).json({
      message: "Successfully established community",
      community: community,
    });
  }
);

router.delete(
  "/:communityId",
  [
    userValidator.isUserLoggedIn,
    communityValidator.isCommunityExistsById,
    communityValidator.isOwner,
  ],
  async (req: Request, res: Response) => {
    await CommunityCollection.deleteOne(req.params.communityId);
    res.status(200).json({
      message: "Successfully deleted community.",
    });
  }
);

router.delete("/", async (req: Request, res: Response) => {
  res.status(400).json({ error: "You need to provide a communityId" });
});

router.put(
  "/:communityId/:username",
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserExists,
    communityValidator.isCommunityExistsById,
    communityValidator.isOwner,
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsername(req.params.username);
    const community = await CommunityCollection.updateOwner(
      req.params.communityId,
      user._id
    );
    res.status(200).json({
      message: "Your profile was updated successfully.",
      community: community,
    });
  }
);

router.put(
  "/:communityId",
  [
    userValidator.isUserLoggedIn,
    communityValidator.isCommunityExistsById,
    communityValidator.isNotOwner,
    communityValidator.isValidAction,
    communityValidator.isCanLeaveJoin,
  ],
  async (req: Request, res: Response) => {
    const { action } = req.query;
    const { userId } = req.session;
    const { communityId } = req.params;
    if (action == "leave") {
      await CommunityCollection.removeMember(communityId, userId);
    } else if (action == "join") {
      await CommunityCollection.addMember(communityId, userId);
    }

    res.status(200).json({
      message: "Success",
    });
  }
);

router.get(
  "/:communityName",
  [communityValidator.isCommunityExists],
  async (req: Request, res: Response) => {
    const community = await CommunityCollection.findOneByCommunityname(
      req.params.communityName
    );
    res.status(200).json({
      message: "Success",
      community: util.constructCommunityResponse(community),
    });
  }
);

router.get("/", async (req: Request, res: Response) => {
  const communityDocs = await CommunityCollection.findAll();
  const communities = communityDocs.map(util.constructCommunityResponse);
  res.status(200).json({
    message: "Success",
    communities,
  });
});

export { router as communityRouter };
