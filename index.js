const http = require("http");
const express = require("express");
const {Server}=require("socket.io")//imports socket.io
const app=express();
const server = http.createServer(app);
const io = new Server(server)

app.use(express.static("public"))
//socket io handles -
io.on('connection',(socket)=>{
    console.log("New user connected");
    socket.on("user-message",(data)=>{
       io.emit("message",data) 
    })
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
    
})

server.listen(9000,()=>console.log(`server stared at port 9000`))