import { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    // Extract channelId from request parameters
    const { channelId } = req.params;

    // Get the subscriber's ID from the authenticated user
    const userId = req.user._id;

    // Validate if channelId is a proper MongoDB ObjectId
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    if (userId.toString() === channelId.toString()) {
        throw new ApiError(400, "You cannot subscribe to your own channel");
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId,
    });

    if (existingSubscription) {
        await Subscription.findByIdAndDelete(existingSubscription._id);
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Unsubscribed successfully"));
    }

    await Subscription.create({
        subscriber: userId,
        channel: channelId
    });
    return res
        .status(201)
        .json(new ApiResponse(201, {}, "Subscribed successfully"));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const channelId = req.user._id;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscribersDocs = await Subscription.find({
        channel: channelId,
    }).populate("subscriber", "_id fullName username");

    return res
        .status(200)
        .json(
            new ApiResponse(200, subscribersDocs, "Subscribers fetched successfully")
        );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    const subscribedChannels = await Subscription.find({
        subscriber: userId,
    }).populate("channel", "_id fullName username");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subscribedChannels,
                "Subscribed channels fetched successfully"
            )
        );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };