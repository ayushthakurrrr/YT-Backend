import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { deleteItem, uploadOnCloudinary } from "../utils/cloudinary.js"
import fs from "fs"
import mongoose from "mongoose"

const uploadVideo = asyncHandler(async (req, res) => {
    // incoming details -> title, thumbnail, videoFile, description, duration(currently)
    const { title, description } = req.body
    if (!title || !description) {
        throw new ApiError(400, "All fiels are required")
    }

    console.log(req.files);
    const thumbnail = req.files?.thumbnail?.[0]?.path
    const videoFile = req.files?.videoFile?.[0]?.path
    if (!thumbnail || !videoFile) {
        throw new ApiError(400, "All fiels are required")
    }

    let thumbnailObj;
    let videoFileObj;
    try {
        thumbnailObj = await uploadOnCloudinary(thumbnail);
        videoFileObj = await uploadOnCloudinary(videoFile);
    } catch (error) {
        if (fs.existsSync(thumbnail)) fs.unlinkSync(thumbnail);
        if (fs.existsSync(videoFile)) fs.unlinkSync(videoFile);
        throw new ApiError(400, "Something went wrong while uploading video on cloudinary")
    }

    console.log(videoFileObj);
    let video;
    try {
        video = await Video.create({
            title,
            description,
            thumbnail: thumbnailObj.url,
            videoFile: videoFileObj.url,
            duration: Math.floor(videoFileObj.duration),
            owner: req.user?._id
        })
    } catch (error) {
        await deleteItem(thumbnailObj.url)
        await deleteItem(videoFileObj.url)
        throw new ApiError(400, "Something went wrong while creating video")
    }

    if (!video) {
        throw new ApiError(400, "Something went wrong while creating video")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video uploaded succesfully")
        )
});

const getAllVideos = asyncHandler(async (req, res) => {
    // Extracting query parameters from the request
    const {
        page = 1, // Default page number is 1 if not provided
        limit = 10, // Default limit per page is 10
        query = "", // Default query is an empty string
        sortBy = "createdAt", // Default sorting field is "createdAt"
        sortType = "desc", // Default sorting order is descending
        userId, // User ID (optional, to filter videos by a specific user)
    } = req.query;

    // Constructing the match object to filter videos
    const match = {
        ...(query ? { title: { $regex: query, $options: "i" } } : {}), // If query exists, match titles that contain the search term (case-insensitive)
        ...(userId ? { owner: new mongoose.Types.ObjectId(userId) } : {}), // If userId exists, filter videos by that owner
        isPublished : true
    };

    const videos = await Video.aggregate([
        {
            $match: match, // Filtering videos based on the match criteria
        },

        {
            $lookup: {
                from: "users", // Collection to join with
                localField: "owner", // Matching "owner" field in the videos collection
                foreignField: "_id", // Matching "_id" field in the users collection
                as: "videosByOwner", // The resulting user data will be stored under "videosByOwner"
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1,
                            coverImg: 1
                        }
                    }
                ]
            },
        },

        {
            $project: {
                videoFile: 1, // Video file link
                thumbnail: 1, // Thumbnail image link
                title: 1, // Video title
                description: 1, // Video description
                duration: 1, // Video duration
                views: 1, // Number of views
                isPublished: 1, // Whether the video is published or not
                owner: {
                    $arrayElemAt: ["$videosByOwner", 0], // Extracts the first user object from the array
                },
            },
        },

        {
            $sort: {
                [sortBy]: sortType === "desc" ? -1 : 1,
            },
        },

        {
            /*
              $skip: Skipping records for pagination
              - Formula: (page number - 1) * limit
              - If page = 2 and limit = 10, skips (2-1) * 10 = 10 records
            */
            $skip: (page - 1) * parseInt(limit),
        },

        {
            $limit: parseInt(limit),
        },
    ]);

    // If no videos are found, throw an error
    console.log(videos);
    if (!videos?.length) {
        throw new ApiError(404, "Videos are not found");
    }

    // Sending the response with a success message
    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(401, "VideoID is required")
    }

    const video = await Video.findById(videoId).populate("owner", "fullName username avatar")

    if (!video) {
        throw new ApiError(401, "Cant find video with given videoId")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video fetched successfully")
        )
});

const toggleVisibilityByID = asyncHandler(async (req, res) => {
    const _id = req.params;
    let video = await Video.findById(_id);

    video.isPublished = !video.isPublished
    video.save()

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Successfully Toggled")
        )
});



export {
    uploadVideo,
    getAllVideos,
    getVideoById,
    toggleVisibilityByID
}