require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
//const pool = require("./db");

const server = require('http').Server(app)
const io = require("socket.io")(server, {
    cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
//const socket = require("socket.io");
//const io = socket(server);

const userRoute = require("./routes/User");
app.use('/user', userRoute)
const cameraRoute = require("./routes/Camera");
app.use('/camera', cameraRoute)
const roomRoute = require("./routes/Rooms");
app.use('/room', roomRoute)
const bookingRoute = require("./routes/Booking");
app.use('/booking', bookingRoute)
const animalsRoute = require("./routes/Animals");
app.use('/animals', animalsRoute)

app.use(cors());



const admin={};
const users = {};
const socketToRoom = {};

io.on('connection', socket => {
    console.log("conn")

    socket.emit("yourID", socket.id);

    socket.on("create room", roomID =>{
        socket.join(roomID)
        console.log("create room")
        if(admin[roomID]) {
            admin[roomID].push(socket.id);
        } else {
            admin[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
    })

    socket.on("join room", roomID => {
        socket.join(roomID)
        console.log("join room")
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 3) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        
        const usersInThisRoom = users[roomID]/*.filter(id => id!== socket.id);*/
        const newUsersInThisRoom = users[roomID].filter(id => id === socket.id);

        socket.to(roomID).emit("all users", newUsersInThisRoom);

    });

    socket.on("returning signal", payload => {//acceptacja
        console.log(payload.callerID)
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on('disconnect', () => {
        console.log("disconnect")
        const idd = socketToRoom[socket.id]
        if(users[idd]){
            if(users[idd].includes(socket.id)) {
                users[idd]=users[idd].filter(id => id!== socket.id)
                console.log("deleted user: "+socket.id)
            } 
        }
        if(admin[idd]){
            if(admin[idd].includes(socket.id)) {
                admin[idd]=admin[idd].filter(id => id!== socket.id);
                console.log("deleted admin: "+socket.id)
            }
        }


    });

});


const port = process.env.PORT;
server.listen(port, ()=>{
    console.log(`server working on port ${port}`);
})