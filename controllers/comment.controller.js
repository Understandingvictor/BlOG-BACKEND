import commentModel from "../models/comment.model.js";
//endpoint to create post
const createComment = async (req, res, next) => {
  try {
    const {userId} = req.user; //checks for the user from jwt (must be logged in);
    const {postId, ...others}= req.body; //checks for the body

    if (!userId || !postId) {
      throw new Error("user id or  post not found try loggin in");
    }

    const newComment = await new commentModel({ ...others, post:postId, creator: userId }).save(); //we will see what happens here
    return res.json({createdComment: newComment, message: "Comment created"});
  } catch (error) {
    next(error);
  }
};

const editComment = async(req, res, next) => {
  try {
    const { userId } = req.user; //checks for the user from jwt (must be logged in);
    const {commentId} = req.params
    const { text } = req.body; //checks for the body

    const foundComment = await commentModel.findById(commentId);
    if (!foundComment){
      throw new Error('comment not found');
    }
    const editedComment = await commentModel.findByIdAndUpdate(commentId, {body:text}, {new:true});
    return res.json({editedComment:editComment, message:"edited successfully"});
  } catch (error) {
    next(error);
  }
}


//get comments for a particular post
const getPostsComments = async (req, res, next) => {
const {postId}=req.params;
  try {
    if (!postId) {
      throw new Error("no post id foind");
    }
    const foundComments = await commentModel.find({ post:postId});
    return res.json({
      comments: foundComments,
      message: `${foundComments.length} comments fetched successfully`,
    });
  } catch (error) {
    console.log("error happened in the get comment controller");
    next(error);
  }
};


//delete a particular comment
const deletePostComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    if (!commentId) {
      throw new Error("comment id not found");
    }

    const foundComment = await commentModel.findById(commentId);
    if (!foundComment) {
      throw new Error("comment not found");
    }
    const deletedComment= await commentModel.findByIdAndDelete(commentId);
    return res.json({deletedComment:deletedComment, message: "comment deleted"});
  } catch (error) {
    console.log("something happened in the deletecomment endpoint");
    next(error);
  }
};

export {createComment, getPostsComments, deletePostComment, editComment}
