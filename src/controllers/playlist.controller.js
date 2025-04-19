import { Playlist } from '../models/playlist.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { ApiError } from '../utils/apiError.js'
import { isValidObjectId } from 'mongoose'

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        throw new ApiError(401, "All fields are required for playlist")
    }
    if (!req.user._id) {
        throw new ApiError(401, "userId is required for playlist")
    }

    const playlist = await Playlist.create({
        name,
        description,
        videos: [],
        owner: req.user._id
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Playlist created Successfully")
        )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    const { playlistId } = req.params;
    if (!name || !description) {
        throw new ApiError(401, "All fields are required for playlist updation")
    }
    if (!req.user._id) {
        throw new ApiError(401, "userId is required for playlist updation")
    }

    const playlist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: req.user._id
        },
        {
            $set: {
                name,
                description
            }
        },
        {
            new: true
        }
    )

    if (!playlist) {
        throw new ApiError(401, "Playlist not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Playlist updated Successfully")
        )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params;
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video ID");
    }
    if (!req.user._id) {
        throw new ApiError(401, "userId is required")
    }

    const updatedPlaylist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: req.user._id   // only update if user is owner
        },
        {
            $addToSet:
            {
                videos: videoId
            }
        },
        {
            new: true
        }
    );

    if (!updatedPlaylist) {
        throw new ApiError(403, "Playlist not found or you're not the owner");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedPlaylist, "Video added to playlist Successfully")
        )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video ID");
    }

    if (!req.user._id) {
        throw new ApiError(401, "User not authenticated");
    }

    const updatedPlaylist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: req.user._id // Ownership check
        },
        {
            $pull: {
                videos: videoId
            }
        },
        {
            new: true
        }
    );

    if (!updatedPlaylist) {
        throw new ApiError(403, "Playlist not found or you're not the owner");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully")
        );
});

const getplaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId");
    }

    const playlist = await Playlist.findById(playlistId).populate("videos", "title thumbnail duration owner")

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Playlist fetched successfully")
        );
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { limit = 5, page = 1 } = req.query;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const parsedLimit = Math.max(1, parseInt(limit)); // make sure it's at least 1
    const parsedPage = Math.max(1, parseInt(page));   // make sure it's at least 1
    const skip = (parsedPage - 1) * parsedLimit;

    const playlists = await Playlist.find({ owner: userId })
        .skip(skip)
        .limit(parsedLimit);

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlists, "User playlists fetched successfully")
        );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    // Ensure user is logged in
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized: User ID not found");
    }

    // Try to delete the playlist only if the user is the owner
    const deletedPlaylist = await Playlist.findOneAndDelete({
        _id: playlistId,
        owner: userId
    });

    if (!deletedPlaylist) {
        throw new ApiError(403, "Playlist not found or you're not the owner");
    }

    return res.status(200).json(
        new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully")
    );
});


export {
    createPlaylist,
    updatePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getplaylistById,
    getUserPlaylists,
    deletePlaylist
}
