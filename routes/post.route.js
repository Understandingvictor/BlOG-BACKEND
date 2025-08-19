import express from "express";
import {allPosts, createPost, getPost, deletePost, updatePost, getUsersPost} from "../controllers/post.controller.js"
import { createUser } from "../controllers/users.controller.js";
import isOwner from "../middlewares/deletePermission.middleware.js";
import isAdmin from "../middlewares/isAdmin.middleware.js";
import verifyUser from "../middlewares/userAuth.middleware.js";
import multer from "multer";
const upload = multer({dest:'./uploads'});


const route = express.Router();

route.get('/post/allPosts', allPosts);
route.get("/post/getUsersPost/:userId", getUsersPost); //takes user id to fetch all his post
route.post('/post/createPost', upload.array('post-pictures', 5), verifyUser, createPost); //user has to be authenticated to make a post
route.get('/post/getPost/:postId',  getPost); //get a particular post by its id
route.put("/post/updatePost/:postId",  upload.array('post-pictures', 5), verifyUser, isOwner, updatePost);
route.delete('/post/deletePost/:postId', verifyUser, isOwner, deletePost);

export default route;
