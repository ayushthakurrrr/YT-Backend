import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js"

const commentRouter = Router()

commentRouter.route("/add-comment/:videoId").post(verifyJWT, addComment)
commentRouter.route("/update-comment/:videoId/:commentId").patch(verifyJWT, updateComment)
commentRouter.route("/delete-comment/:commentId").delete(verifyJWT, deleteComment)
commentRouter.route("/get-comments/:videoId").get(verifyJWT, getVideoComments)

export default commentRouter