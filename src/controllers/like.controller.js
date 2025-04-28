import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(401, "Not valid videoId")
    }

    let liked = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })

    if (!liked) {
        liked = await Like.create({
            video: videoId,
            likedBy: req.user._id
        })
    } else {
        await Like.findOneAndDelete({
            video: videoId,
            likedBy: req.user._id
        })
        liked = {}
    }

    return res
        .status(200)
        .json(new ApiResponse(200, liked, "Successfully ToggledVideoLike"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    if (!isValidObjectId(commentId)) {
        throw new ApiError(401, "Not valid videoId")
    }

    let liked = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })

    if (!liked) {
        liked = await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })
    } else {
        await Like.findOneAndDelete({
            comment: commentId,
            likedBy: req.user._id
        })
        liked = {}
    }

    return res
        .status(200)
        .json(new ApiResponse(200, liked, "Successfully ToggledCommentLike"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(401, "Not valid videoId")
    }

    let liked = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })

    if (!liked) {
        liked = await Like.create({
            tweet: tweetId,
            likedBy: req.user._id
        })
    } else {
        await Like.findOneAndDelete({
            tweet: tweetId,
            likedBy: req.user._id
        })
        liked = {}
    }

    return res
        .status(200)
        .json(new ApiResponse(200, liked, "Successfully ToggledTweetLike"))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const listOfLiked = await Like.find({
        video: { $exists: true },
        likedBy: req.user._id
    }).populate("video", "_id title thumbnail owner")

    return res
        .status(200)
        .json(new ApiResponse(200, listOfLiked, "Successfully fetched liked videos"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}