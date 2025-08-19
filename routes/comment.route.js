import express from "express";
import { createComment, getPostsComments, deletePostComment, editComment } from "../controllers/comment.controller.js";
import { login } from "../controllers/login.controller.js";
import isOwner from "../middlewares/deletePermission.middleware.js";
import verifyUser from "../middlewares/userAuth.middleware.js";

const route = express.Router();

route.post("/createComment", verifyUser, createComment);
route.put("/editComment/:commentId", verifyUser, isOwner, editComment); //comment id here is masked as post id so isowner middleware can use it
route.delete("/deletePostComment/:commentId", verifyUser, isOwner, deletePostComment);
route.get("/getPostsComments", getPostsComments);


export default route;
