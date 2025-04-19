import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllVideos, getVideoById, uploadVideo, toggleVisibilityByID } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const videoRouter = Router()

videoRouter.route("/upload-video").post(verifyJWT, upload.fields([
    {
        name: "videoFile",
        maxCount: 1
    },
    {
        name : "thumbnail",
        maxCount : 1
    }]), uploadVideo);


videoRouter.route("/getVideos").get(verifyJWT, getAllVideos)
videoRouter.route("/getVideoByID/:videoId").get(verifyJWT, getVideoById)
videoRouter.route("/toggleVisibilityByID/:_id").patch(verifyJWT, toggleVisibilityByID)

export default videoRouter