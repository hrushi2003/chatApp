import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants : [String], // list of user ids that are in the conversation
})
conversationSchema.index({ participants: 1 });
export const Conversation = mongoose.model("Conversation", conversationSchema);