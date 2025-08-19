import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";
import commentModel from "../models/comment.model.js";
import { cloudinaryUploader } from "../helpers/cloudinary.helper.js";
import fs from 'fs/promises';

//function for fetching comments
const fetchComment = async(postId)=>{
  try {
    const comments = await commentModel.find({post:postId})
    return comments;
  } catch (error) {
    throw new Error('error fetching comment');
  }
}

//gets all posts
const allPosts = async (req, res, next) => {
  try {
    const posts = await postModel.find();
    if (!posts) {
      throw new Error("post not found");
    }
    return res.json({Posts: posts,message: `posts are ${posts.length} in number`,
    });
  } catch (error) {
    next(error);
  }
};
//get a particular post
const getPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      throw new Error("post id not found");
    }
    const foundPost = await postModel.findById(postId);
    
    if(!foundPost){
      throw new Error('post not found');
    }
    const comments = await fetchComment(postId); //fetching comments for the post
    return res.json({ post: foundPost, comments:comments, message: "a Post gotten" });
  } catch (error) {
    //console.log("error happened in the get post controller.");
    next(error);
  }
};

//get user's  post
const getUsersPost = async (req, res, next) => {
  const {userId} = req.params; //checks for the user;
  try {
    if (!userId) {
      throw new Error("user id not found");
    }
    const foundPosts = await postModel.find({ creator: userId });
    if (!foundPosts) {
      throw new Error("posts not found");
    }
    return res.json({ posts: foundPosts, message: `${foundPosts.length} posts fetched successfully` });
  } catch (error) {
    console.log("error happened in the get post controller");
    next(error);
  }
};


//endpoint to create post
const createPost = async (req, res, next) => {
  let pictures;
  try {
    const {userId} = req.user; //checks for the user;
    const payload = req.body; //checks for the body
    pictures = req.files; //checks for files
    const secureUrls = []; //holds the secure urls to the pictures in cloud

    if (!userId || !pictures || !payload) {
      throw new Error("user id not found try loggin in");
    }

    if (pictures.length !== 0){
      for (let picture of pictures) {
        const result = await cloudinaryUploader(picture, "POST-PICTURES");
        if (!result) {
          await fs.unlink(picture.path);
          throw new Error("upload not successful");
        }
        secureUrls.push(result["secure_url"]);
      }

      //modify payload to include pointers to images in the database
      payload["pictures"] = secureUrls;
    }

    const newPost =  await (new postModel({ ...payload, creator: userId })).save(); //we will see what happens here

    return res.json({createdPost: newPost, message: "Post created"});
  } catch (error) {
    if (pictures) {//checking if picture exists
      for (let i of pictures && pictures.length !== 0) {
        await fs.unlink(i.path);
      }
    }
    next(error);
  }
};



//endpoint for updating of post
const updatePost = async(req, res, next)=>{
  let pictures;
  try {
    pictures = req.files; //checks for files
    const secureUrls = []; //holds the secure urls to the pictures in cloud
    const payload = req.body;
    const { postId } = req.params;

    const foundPost = await postModel.findById(postId);
    if (!foundPost) {
      throw new Error("post not found");
    }

    if (pictures.length !== 0) { //checks if picture is available
      for (let picture of pictures) {
        const result = await cloudinaryUploader(picture.path, "POST-PICTURES");
        if (!result) {
          await fs.unlink(picture.path);
          throw new Error("upload not successful");
        }
        secureUrls.push(result["secure_url"]);
      }
      //modify payload to include pointers to images in the database
      payload["pictures"] = secureUrls;
    }

    const updatedPost = await postModel.findByIdAndUpdate(postId, payload, {new: true,});

    return res.json({updatedPost: updatedPost,formerPost: foundPost,
      message: "updated successfully",
    });
  } catch (error) {
    if (pictures) {  //checking if picture exists
      for (let i of pictures && pictures.length !== 0) {
        await fs.unlink(i.path);
      }
    }
    next(error);
  }
}

//delete a particular post
const deletePost = async (req, res, next) => {
  try {
    const {postId} = req.params;

    if (!postId) {
      throw new Error("post id not found");
    }
    const foundPost = await postModel.findById(postId);
    if (!foundPost) {
      throw new Error("post not found");
    }
    const deletedPost = await postModel.findByIdAndDelete(postId);
    return res.json({
      deletedPost: deletedPost,
      message: "Post deleted",
    });
  } catch (error) {
    console.log("something happened in the deletepost endpoint");
    next(error);
  }
};
export { allPosts, createPost, getPost, deletePost, updatePost, getUsersPost };
