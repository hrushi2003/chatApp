import express from "express";
import {connect} from "./connection.js";
import cors from "cors";
import { User } from "./models/users.js";
import jwt  from "jsonwebtoken";
const app = express();
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Image } from "./models/images.js";
import bodyParser from "body-parser";
dotenv.config({path:"sample.env"});
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { get } from "http";
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
import { createServer } from 'node:http';
import {Server} from "socket.io";
import { Chat } from "./models/chatHistory.js";
import { Conversation } from "./models/Conversation.js";

const server = createServer(app);
const io = new Server(server,{
    cors : {
        origin : ["http://localhost:3001"],   
    },
    connectionStateRecovery: {}
});

const users = {};

io.on("connection", async socket => {
    socket.on('authenticate',async (username,callback) => {
        console.log("authenticated",username);
        const loggedUser = username;
        const userIsPresent = await Conversation.findOne({participants : loggedUser});
        if(!userIsPresent){
        const newConvo = new Conversation({
            participants :[loggedUser]
        });
        newConvo.save().then((data) => console.log(data)).catch((err) => console.log(err));
        }
      //  const user = await User.findOne({ username: username });
        socket.username = username;
        users[username] = socket.id; 
        callback();
    });
    socket.on("private", async ({recipient,message,sender,Unique},callback) => {
        const id = users[recipient];
        console.log("iam at the starting");
        const findConvo = await Conversation.findOne({
            participants : {
                $all:[sender, recipient],
                $size : 2
            }
        });
        if(!findConvo){
            try{
            const convo = await Conversation.findOneAndUpdate({
                participants : {
                    $all : [sender],
                    $size : 1
                }
            },{$push : {
                participants : recipient
            }}, { new: true, upsert: true });
            if(convo){
                console.log("data updated sucessfully");
            };
            const newChat = new Chat({
               sender :sender,
               message : {
                text : message,
               },
               uniqueOffSet : Unique,
               conversationId : convo._id
            });
            newChat.save().then((data) => {
                if (id) {
                    socket.to(id).emit('privateMessage', message,data._id);
                    callback();
                }
            }).catch((err) => {
                if(err.code === 11000){
                    console.log("already inserted");
                    callback();
                }else{
                    console.log(err);
                }
            });
        } catch (e) {console.error(e)}; 
        }else{
        try{
            console.log("ima inside the elese try block");
            const newChat = new Chat({
                sender :sender,
                message : {
                 text : message,
                },
                uniqueOffSet : Unique,
                conversationId : findConvo._id
             });
             newChat.save().then((data) =>{
                if (id) {
                    console.log(id,"Im at the id stage");
                    console.log(message);
                    socket.to(id).emit('privateMessage', message,data._id);
                    callback();
                }
                console.log(data,"saved succesfully");
             }).catch((err) => {
                if(err.code === 11000){
                    console.log("already inserted");
                    callback();
                }else{
                    console.log(err);
                }
             });
        }catch(err){
            console.log(err);
        }
        }
        if (id) {
           // console.log(message);
            //socket.to(id).emit('privateMessage', message,0);
        }
    });
    if(!socket.recovered){  
        try{
            const user = socket.username;
            for(let username in users){
                const id = users[username];
                const history = await Conversation.findOne({
                    participants : {
                        $all : [user,username],
                        $size : 2
                    }
                });
                if(history){
                    const messages = await Chat.find({conversationId : history._id},{
                        _id : { $gt: socket.handshake.auth.serverOffset || 0 }
                    });
                    messages.forEach((message) => {
                        socket.to(id).emit('privateMessage',message.message.text, message._id);
                    });
                }
            }
        } catch(error){
            console.log(error);
        }   
    }
    socket.on("disconnect", (user)=> {
       delete users[Object.keys(users)[user]];    
    });
});


app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
connect();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const createToken = (id) => {
    const token = jwt.sign({ id }, process.env.SECRET_KEY
        ,{ expiresIn: '1d' }); // 1 d
    return token;  
}
app.get('/',(req,res) => {
    res.send("wait");
});

app.post('/chat/chatHistory',async (req,res) => {
    try{
    const {user1,user2} = req.body;
    console.log(user1,user2);
    const chatHistory = await Conversation.findOne({participants : {
        $all : [user1,user2],
        $size : 2
    }});
    if(chatHistory){
        console.log(chatHistory._id);
        const messages = await Chat.find({conversationId : chatHistory._id}).sort({'message.date': -1});
        console.log("messages",messages);
        res.status(200).json({messages}) ;
    }else{
        res.status(200).json({messages : [""]});
    }
    }catch(err){
       res.status(500).send("Server Error");
    }
})

app.post('/register', async (req,res) => {
    const {username,email,password} = req.body;
    console.log(password);
    const isNewUser = await User.findOne({username : username});
    if(isNewUser){
        return res.status(409).send('Username already in use');
    }
    bcrypt.hash(password,10).then((hash) => {
        const newUser  = new User({
            username : username,
            email : email,
            password : hash
        })
        newUser.save().then((data) => {
            console.log("saved succesfully",data);
            const token = createToken(data._id);
           return res.json({"token" : token,"success":true});
        }).catch((err) => {
           return res.status(400).send("duplication found",err);
        })    
    }).catch((err) => {
        return res.status(500).send(err);
    })
})
app.post('/login', async (req,res) => {
    const {username,password}=req.body;
    User.findOne({username:username}).then((user)=>{
        if(!user){
            return res.status(400).send('Invalid Email')
            }
            bcrypt.compare(password, user.password).then((valid) =>{
                if (!valid) {
                    return res.status(400).send('Invalid Email or Password')
                    }
                    const token = createToken(user._id);
                    return res.json({"token":token,"email" : user.email});
                 }).catch((error) => {
                     console.log(error)
        });
    });
})
app.get('/register/avatar', async (req,res) => {
    try{
    const token = req.headers["authorization"].split(" ")[1];
    const decoded = jwt.decode(token);
    console.log(decoded);
    const user = await User.findById(decoded.id);
    if(!user){
        return res.status(400).send("Unauthorized");
    }else{
        return res.status(200).json({"user" : user});
    }
    }catch(err){
        console.log(err);
        return res.status(400).send("error occured in authorizing");
    }
});
app.post('/avatar/:id',upload.single('image'),(req,res) => {
    if(req.file){
       const id = req.params.id;
        const imageBuffer = req.file.buffer;
        const newImage = new Image({
            id : id,
            data: imageBuffer,
            contentType: req.file.mimetype
        });
        newImage.save().then(async (result) => {
           await User.findByIdAndUpdate(id,{imageId : result._id}).then((response) => {
            return res.status(200).send("Avatar has been updated")
           }).catch((err) => {
            console.log(err);
           });
        }).catch((err) => {
            console.log(err);
            return res.status(400).json({"error":err});
        })
    }else{
        return res.status(400).send('No file was uploaded');
    }
});

app.get('/chat/ai/:userInp',(req,res) => {
const userInp = req.params.userInp;
const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 1000,
};
async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const parts = {
    text : userInp
  }
  const result = await model.generateContent({
    contents:[{ role: "user", parts }],
    generationConfig
  });
  const response = await result.response;
  const text = response.text();
  return res.status(200).json({"bot":text});
}
try{
    run();
}catch(err){
    return res.status(400).send(err);
}
});

app.get('/chat/users',async (req,res) => {
    try{
    const token = req.headers["authorization"].split(" ")[1];
    const decoded = jwt.decode(token);
    const user = await User.findById(decoded.id);
    if(!user){
        return res.status(400).send("Unauthorized");
    }
    const friends = await User.find({_id:{$ne:user._id}}).populate({path:'imageId'}).select([
        'username',
        'email',
        'data',
        '_id',
        'contentType'
    ]).exec();
    const upDatedData = friends.map(friend => {
        const username = friend.username;
        const email = friend.email;
        const id = friend._id;
        const base64Data = friend.imageId.data.toString('base64');
        return {id,username,email,"imageData":base64Data}
    });
    return res.status(200).json({"friends":upDatedData,"user":user});
    }catch(err){
        console.log(err);
        return res.status(500).send(err);
    }
})
app.get('/chat/image/:id', async (req,res) => {
    const id = req.params.id;
    const image = await Image.findOne({id:id});
    if(!image){
        return res.status(400).send('no image found');
    }
    const str = image.data.toString("base64");
    res.status(200).json({"image":str});
})
server.listen(3000,() => {
    console.log('Server is running on port 3000');
})