import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true,unique : true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    setAvatarImage :{
        type: Boolean,
        default:false
    },
    imageId : {
        type : mongoose.Schema.Types.ObjectId,
        ref:'Image',
        default : null
    }
});

export const User = mongoose.model('user',userSchema);