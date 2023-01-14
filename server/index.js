const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ['Access-Control-Allow-Origin']
  },
  maxHttpBufferSize: 1e8
});


io.on("connection", (socket) => {
  /* console.log(`User Connected: ${socket.id}`);
  socket.onAny((event) => {
    console.log(`ANY ${event}`);
  });
  */


  socket.on("join_room", async (dataObj) => {
    socket.join(dataObj.room);
    socket.data.nickname = dataObj.username;
    socket.data.points = 0;
    socket.data.room = dataObj.room;
    //console.log(`User with ID: ${socket.id} and name ${dataObj.username} joined room: ${dataObj.room}`);
    const allUsersInRoom = await io.in(dataObj.room).fetchSockets();
    const allUsersInRoom2 = allUsersInRoom.map((socket) => {
      const userObj = {
        username: socket.data.nickname,
        points: socket.data.points
      }
      return userObj
    });

    socket.to(dataObj.room).emit("get_lobby_info", allUsersInRoom2);
  });


  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });


  socket.on("start_game_request", async (room) => {
    const allUsersInRoom = await io.in(room).fetchSockets();
    allUsersInRoom.map((socket) => {
      socket.data.points = 0
    });
    io.in(room).emit("start_game");
  });


  // used for uploading and downloading file images
  // everyone in room downloads same image to their client
  socket.on("upload", (imageObject) => {
    io.in(imageObject.room).emit("download", imageObject);
  });


  socket.on("request_lobby_info", async (room) => {
    const allUsersInRoom = await io.in(room).fetchSockets();
    const allUsersInRoom2 = allUsersInRoom.map((socket) => {
      const userObj = {
        username: socket.data.nickname,
        points: socket.data.points
      }
      return userObj;
    });
    io.to(socket.id).emit("send_lobby_info", allUsersInRoom2);
  });


  socket.on("send_message_game", async (data) => {
    // updates points server-side for the player
    socket.data.points += data.pointsGain;
    socket.to(data.room).emit("receive_message_game", data);
    // if that message was a correct guess
    if (data.pointsGain !== 0) {
      const allUsersInRoom = await io.in(data.room).fetchSockets();
      const allUsersInRoom2 = allUsersInRoom.map((sockett) => {
        // updates points for the player client-side through array
        const userObj = {
          username: sockett.data.nickname,
          points: sockett.data.points
        };
        if (sockett.id === data.artistId) {
          // updates points server-side for the artist
          sockett.data.points += data.artistPoints;
          // updates points for artist client-side through array
          return { username: data.artistNickname, points: sockett.data.points};
        } else {
          return userObj;
        }
      });
      // for tracking points change between rounds
      // correct guess means you are added to points change list as playerObj
      const playerObj = {
        pointsGain: data.pointsGain,
        player: socket.data.nickname
      };
      // if artist is in lobby, need to track artist point change
      if (data.artistNickname) {
        // currently set so each time someone guesses your picture, you get 25 points
        const artistObj = {
          pointsGain: data.guessOrder * 25,
          player: data.artistNickname
        };
        // used for tracking point changes between rounds
        io.in(data.room).emit("track_points_change", [playerObj, artistObj]);
      }
      // if artist not in lobby, just need to focus on point change of player who guessed correctly
      else {
        // used for tracking point changes between rounds
        io.in(data.room).emit("track_points_change", [playerObj]);
      }
      // used for telling others that i guessed correctly
      io.in(data.room).emit("tell_others_im_smart", allUsersInRoom2.length);
      // used for updating points of players in lobby
      io.in(data.room).emit("get_lobby_info", allUsersInRoom2);
    }
  });


  // lets clients know artist is in room and adjust playercount accordingly
  // solves bug where if someone leaves mid-game, not everyone will get to guess
  socket.on("artist_in_room", (room) => {
    const artistInfo = {
      artistNickname: socket.data.nickname,
      artistId: socket.id
    };
    io.in(room).emit("tell_others_im_here", artistInfo);
  });


  // updates other users in room when that person disconnects
  socket.on("disconnect", async () => {
    //console.log("User Disconnected", socket.id);
    // if the user disconnecting got past main menu and put in username + room number
    if (socket.data.nickname) {
      const allUsersInRoom = await io.in(socket.data.room).fetchSockets();
      const allUsersInRoom2 = allUsersInRoom.map((socket) => {
        const userObj = {
          username: socket.data.nickname,
          points: socket.data.points
        }
        return userObj;
      });
      // updates client-side lobby for people in same room
      socket.to(socket.data.room).emit("get_lobby_info", allUsersInRoom2);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log("SERVER RUNNING");
});