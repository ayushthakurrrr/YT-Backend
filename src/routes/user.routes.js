import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from '../middlewares/multer.middleware.js'
import { loginUser, logoutUser, refreshAccessToken, getCurrentUser, changeCurrentPassword, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const userRouter = Router()

userRouter.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImg",
            maxCount: 1
        }
    ]),
    registerUser)

userRouter.route("/login").post(loginUser)

//secured routes
userRouter.route("/logout").post(verifyJWT, logoutUser)
userRouter.route("/refresh-token").post(refreshAccessToken)
userRouter.route("/current-user").get(verifyJWT,getCurrentUser)
userRouter.route("/change-password").patch(verifyJWT,changeCurrentPassword)
userRouter.route("/update-acc-details").patch(verifyJWT,updateAccountDetails)
userRouter.route("/update-avatar").post(verifyJWT, upload.single("path"), updateUserAvatar)
userRouter.route("/update-coverImg").post(verifyJWT, upload.single("path"), updateUserCoverImage)

export default userRouter