import mongoose, { Mongoose } from "mongoose";

const commentSchema = new mongoose.Schema({
    body:{
        type:String,
        required:false
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Posts'
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Users'
    }
})

const commentModel = mongoose.model('Comments',commentSchema);
export default commentModel;