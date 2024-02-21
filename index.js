const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');

const port  = 4000 || process.env.PORT;

const  app = express();
const users = [];
app.use(cors()); // it is use for inter Communication b/w url 

const server = http.createServer(app);

const io = socketIo(server);

io.on("connection" , (soket)=>{ // to recieve data pass a name in connection
    
    soket.on("joined" , ({user})=>{      // to get the use same name which we give on creating the socket in the server
                users[soket.id] = user;
                soket.broadcast.emit("userJoined" , {user : "Admin" , message : `${users[soket.id]} joined the chat`});
                soket.emit("welcome" , {user : "Admin" , message : `${users[soket.id]} , Welcome to the chat`});
    });

   

    soket.on('message' , ({message , id})=>{
        io.emit('sendMessage' ,{user : users[id] ,message , id}); // to send the data to all the user including us . 
    }); 
    
    soket.on("disconnect" , ()=>{
        soket.broadcast.emit('leave' , {user : 'admin' , message : `${users[soket.id]} left the chat`})
        console.log(`${users[soket.id]} left`);
    })
});

app.get("/" , (req , res)=>{
    res.send("C Chat app server ")
})

server.listen(port, ()=>{
    console.log(`server is running on port http://localhost:${port}` )
});