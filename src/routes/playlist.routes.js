import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { createPlaylist, updatePlaylist, addVideoToPlaylist, removeVideoFromPlaylist, getplaylistById, getUserPlaylists, deletePlaylist } from "../controllers/playlist.controller.js"

const playlistRouter = Router()
playlistRouter.use(verifyJWT)

playlistRouter.route("/create-playlist").post(createPlaylist)
playlistRouter.route("/update-playlist/:playlistId").patch(updatePlaylist)
playlistRouter.route("/delete-playlist/:playlistId").delete(deletePlaylist)
playlistRouter.route("/get-playlistById/:playlistId").get(getplaylistById)
playlistRouter.route("/get-userPlaylists/:userId").get(getUserPlaylists)
playlistRouter.route("/addVideoTo-playlist/:playlistId/:videoId").patch(addVideoToPlaylist)
playlistRouter.route("/removeVideoFrom-playlist/:playlistId/:videoId").delete(removeVideoFromPlaylist)


export default playlistRouter