import mongoose from "mongoose";
//Set up default mongoose connection
import dotenv from "dotenv";
dotenv.config({path:"sample.env"});
const url = process.env.MONGO_URL;

export const connect = async () => {
    try{
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB Connected...");
    }
    catch(err){
        console.error(err);
        process.exit(1);
    }
}
