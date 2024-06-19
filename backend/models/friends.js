import mongoose from "mongoose";

const friends = new mongoose.Schema({
    friendsId :{
        type : [{
            userId : mongoose.Schema.Types.ObjectId // friend id
        }],
    }
})
export const Friends = mongoose.model('Friends',friends);
