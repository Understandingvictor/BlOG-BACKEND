import express from "express";
import { createUser, getAllUsers } from "../controllers/users.controller.js";
import isAdmin from "../middlewares/isAdmin.middleware.js"
import verifyUser from "../middlewares/userAuth.middleware.js";

const route = express.Router();
route.post('/createUser', createUser);
route.get("/getAllUsers/:userId", verifyUser, isAdmin, getAllUsers);

export default route;