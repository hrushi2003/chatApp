import mongoose from "mongoose";

const chatSchema = new  mongoose.Schema({
    sender : { type: String, required: true },
    message : { 
        text :{type:String ,required:true},
        date:{type:Date,default: Date.now()}
     },
     uniqueOffSet : {
        type : String,
        default : null,
        unique : true
     },
     conversationId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation"
    }
});

chatSchema.index({conversationId : 1 ,sender:1});

export const Chat = mongoose.model( 'Chat',chatSchema );
//add a message to the conversation
export function addMessageToConv(conversationId,message){
   return Chat.create({sender:message.sender,message:message.text,conversationId:conversationId})
}

//get all messages of a specific user in a specific conversation
export async function getUserMessagesInConv(userId,convId) {
    let filter={conversationId: convId};
    if (userId!=null)
       filter['sender']=userId;
    return await Chat.find(filter).sort('date');
}

//send a read status to the server for marking a message as read by the recipient
export async function sendReadStatus(msgId,read) {
    let msg=await Chat.findById(msgId);
    //if the message is not found or has already been marked as read throw an error
    if (!msg || msg.isRead==read) throw new Error("The operation failed");
    else{
      msg.isRead=read;
      return await msg.save();
    }
}

//get all unread messages of a specific user in a list of conversations
export async function getUnreadMessages(userId,convsIds) {
    let filter={'sender':userId,'isRead':false,'conversationId':{'$in':convsIds}};
    return await Chat.find(filter);
}