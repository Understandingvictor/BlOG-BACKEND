import postModel from "../models/post.model.js";
import commentModel from "../models/comment.model.js";
import userModel from "../models/user.model.js";

const isOwner = async (req, res, next) => {
  try {
    const userObject = req.user;
    const postIdObject = req.params;

    // if (!userObject.userId || !postIdObject.postId) {
    //   throw new Error("user ID or post ID not found");
    // }

    const userId = userObject?.userId;

    if (postIdObject?.commentId){
        const commentId = postIdObject.commentId;

        const user = await userModel.findById(userId);
        const foundComment = await commentModel.findById(commentId);


        if (!user || !foundComment) {
          throw new Error("post not found or no user id");
        }

        if (foundComment.creator.toString() === userId.toString() || user.isAdmin === true) {
          return next();
        } else {
          throw new Error("you are not the owner "); //we return error here
        }

      }


      
    //executes if its owner of post validation

    const postId = postIdObject?.postId;
    
    const user = await userModel.findById(userId);
    const foundPost = await postModel.findById(postId);

    if(!user || !foundPost){
      throw new Error("post not found or no user id here");
    }

      if (foundPost.creator.toString() === userId.toString() || user.isAdmin === true) {
        return next();
      } else {
        throw new Error("you are not the owner "); //we return error here
      }

  } catch (error) {
    console.log("error happened in isowner endpoint")
    console.log(error.message);
    next(error);
  }
};
export default isOwner;
