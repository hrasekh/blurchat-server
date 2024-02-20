require('dotenv').config();
const express = require('express');
const { createServer } = require('node:http');
const app = express();
const server = createServer(app);

app.get("/", (req, res) => {
    res.send("Server is running ... ")
});

const PORT = process.env.PORT || 5678;
server.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT || 5678}`);
    console.log(`http://localhost:${process.env.PORT || 5678}`);
});

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        method: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log("A user connected", socket.id);

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
    });

    socket.on("call-user", (data) => {
        console.log("received a call-user:", socket.id, "to :", data.to);
        io.to(data.to).emit("call-mode", {
            from: socket.id,
            signalData: data.signalData,
        });
    });

    socket.on("call-answer", (data) => {
        console.log("received a answer-user:", socket.id, "to :", data.to);
        io.to(data.to).emit("answer-mode", {
            // from: socket.id,
            signalData: data.signalData,
        });
    });
});