import mongoose, { Mongoose } from "mongoose";

const postSchema = new mongoose.Schema({
    title:{
       type:String
    },
    body:{
        type:String,
        required:false
    },
    pictures:{
        type:[String],
        default:[],
        required: false
    },
    category:{
        type:String,
        default:"others"
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Users'
    }
})

const postModel = mongoose.model('Posts', postSchema);
export default postModel;