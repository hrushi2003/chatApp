import mongoose from "mongoose";
import { buffer } from "stream/consumers";

const ImageSchema = new mongoose.Schema({
    id : {
        type :mongoose.Schema.Types.ObjectId,
        unique : true,
        ref:'user'
    },
    data: {
        type : buffer
    },
    contentType : {
        type : String
    }
});

export const Image = mongoose.model('Image',ImageSchema);