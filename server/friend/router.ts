import type {Request, Response} from 'express';
import express from 'express';
import UserCollection from '../user/collection';
import FriendCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();

router.get(
  '/:username',
  [userValidator.isUserExists],
  async (req: Request, res: Response) => {
    const friends = await FriendCollection.findAllByUsername(
      req.params.username
    );
    const user = await UserCollection.findOneByUsername(req.params.username);
    const response = friends.map(f =>
      util.constructFriendResponse(f, user._id)
    );
    res.status(200).json(response);
  }
);

router.get('/', (req: Request, res: Response) => {
  res.status(400).json({
    error: 'Provided username must be nonempty.'
  });
});

export {router as friendRouter};
