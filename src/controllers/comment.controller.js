// handle the null case when user not found and the validate mongoose _id

import { Comment } from '../models/comment.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import mongoose from 'mongoose'

const addComment = asyncHandler(async (req, res) => {
    // console.log(req.params);
    // console.log(req.body);
    const { videoId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!videoId) {
        throw new ApiError(401, "VideoId is required for comments")
    }
    if (!content) {
        throw new ApiError(401, "Content is required for comments")
    }

    let comment;
    try {
        comment = await Comment.create({
            content,
            commentOn: videoId,
            commentBy: userId
        })
    } catch (error) {
        throw new ApiError(401, "Something went wrong while creating comment")
    }

    if (!comment) {
        throw new ApiError(401, "Something went wrong while creating comment")
    }

    res
        .status(200)
        .json(
            new ApiResponse(200, comment, "Comment created succesfully")
        )
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!commentId) {
        throw new ApiError(401, "commentId is required for comments")
    }
    if (!content) {
        throw new ApiError(401, "Content is required for comments")
    }

    const comment = await Comment.findOneAndUpdate(
        {
            _id: commentId,
            commentBy: req.user._id
        },
        {
            $set: {
                content
            }
        },
        {
            new: true
        }
    )

    res
        .status(200)
        .json(
            new ApiResponse(200, comment, "Comment updated succesfully")
        )
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
        throw new ApiError(401, "commentId is required for comments")
    }

    try {
        await Comment.findOneAndDelete({
            _id: commentId,
            commentBy: req.user._id
        })
    } catch (error) {
        throw new ApiError(401, "Something went wrong while deleting comment")
    }

    res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Comment deleted succesfully")
        )

});

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    if (limit <= 0) {
        throw new ApiError(401, "limit should be greater than 0")
    }
    if (page <= 0) {
        throw new ApiError(401, "page should be greater than 0")
    }
    if (!videoId) {
        throw new ApiError(401, "VideoId is required for comments")
    }

    const comments = await Comment.aggregate([
        {
            $match: {
                commentOn: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                foreignField: "_id",
                localField: "commentBy",
                from: "users",
                as: "commentBy",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$commentBy"
        },
        {
            $skip: (page - 1) * parseInt(limit)
        },
        {
            $limit: parseInt(limit)
        },
        {
            $project: {
                commentOn: 0
            }
        }
    ])

    res
        .status(200)
        .json(
            new ApiResponse(200, comments, "Comments fetched succesfully")
        )
});

export { getVideoComments, addComment, updateComment, deleteComment };