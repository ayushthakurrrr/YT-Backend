import { Router } from 'express'
import { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels } from '../controllers/subscription.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';

const subsRouter = Router()

subsRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

subsRouter.route("/toggle-subscription/:channelId").post(toggleSubscription);
subsRouter.route("/get-your-subscriptions").get(getSubscribedChannels)
subsRouter.route("/get-your-subscribers").get(getUserChannelSubscribers);

export default subsRouter;