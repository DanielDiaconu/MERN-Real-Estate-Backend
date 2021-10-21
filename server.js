require("dotenv/config");
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const app = express();
const PORT = 8080;
const cors = require("cors");
app.use(cors());
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const categoriesRoute = require("./routes/categories");
const citiesRoute = require("./routes/cities");
const propertiesRoute = require("./routes/properties");
const amenetiesRoute = require("./routes/amenenties");
const catalogRoute = require("./routes/catalog");
const propertyRoute = require("./routes/property");
const creditCardsRoute = require("./routes/creditCards");
const questionsRoute = require("./routes/questions");
const repliesRoute = require("./routes/replies");
const reviewsRoute = require("./routes/reviews");
const notificationsRoute = require("./routes/notifications");
const Notification = require("./models/Notification");
const User = require("./models/User");

app.use(express.urlencoded());
app.use(express.json());
app.use(express.static("public"));

app.use("/", authRoute);
app.use("/users", usersRoute);
app.use("/", categoriesRoute);
app.use("/", citiesRoute);
app.use("/", propertiesRoute);
app.use("/", amenetiesRoute);
app.use("/catalog", catalogRoute);
app.use("/property", propertyRoute);
app.use("/", creditCardsRoute);
app.use("/", questionsRoute);
app.use("/", repliesRoute);
app.use("/reviews", reviewsRoute);
app.use("/notifications", notificationsRoute);
const users = new Map();

io.on("connection", (socket) => {
  socket.join(socket.id);
  socket.join("live-chat");
  socket.on("join-server", async (userId) => {
    const user = await User.findById(userId).select("fullName");
    users.set(userId, socket.id);
    io.in("live-chat").emit("live-chat-count", users.size);
    io.in("live-chat").emit("receive-chat-message", {
      isInformationalBanner: true,
      body: `${user.fullName} has joined the chat!`,
    });
  });

  socket.on("message-send", (data) => {
    io.in("live-chat").emit("receive-chat-message", data);
  });

  socket.on("chat-message-reaction", (data) => {
    io.in("live-chat").emit("receive-chat-reaction", data);
  });

  socket.on("question-post", async (data) => {
    let foundSocketId = users.get(data.ownerId);

    if (foundSocketId) {
      const newNotification = new Notification({
        body: `${data.username} has posted a question on your property!`,
        userId: data.ownerId,
        notificationType: "question",
        target: {
          parentEntity: data.propertyId,
          entity: data.questionId,
        },
      });
      await newNotification.save();
      socket
        .to(foundSocketId)
        // .in(foundSocketId)
        .emit(
          "receive-question",
          `${data.username} has posted a question on your property!`
        );
    }
  });

  socket.on("question-like", async (data) => {
    let foundSocketId = users.get(data.ownerId);
    if (foundSocketId) {
      const newNotification = new Notification({
        body: `${data.username} has liked one of your questions!`,
        userId: data.ownerId,
        notificationType: "thumbs-up",
        target: {
          parentEntity: data.propertyId,
          entity: data.questionId,
        },
      });
      await newNotification.save();
      {
        socket
          .to(foundSocketId)
          .emit(
            "receive-question-like",
            `${data.username} has liked one of your questions!`
          );
      }
    }
  });

  socket.on("question-dislike", async (data) => {
    let foundSocketId = users.get(data.ownerId);
    if (foundSocketId) {
      const newNotification = new Notification({
        body: `${data.username} has disliked one of your questions!`,
        userId: data.ownerId,
        notificationType: "thumbs-down",
        target: {
          parentEntity: data.propertyId,
          entity: data.questionId,
        },
      });
      await newNotification.save();
      {
        socket
          .to(foundSocketId)
          .emit(
            "receive-question-dislike",
            `${data.username} has disliked of your questions!`
          );
      }
    }
  });

  socket.on("reply-like", async (data) => {
    let foundSocketId = users.get(data.ownerId);
    if (foundSocketId) {
      const newNotification = new Notification({
        body: `${data.username} has liked your reply to the question!`,
        userId: data.ownerId,
        notificationType: "thumbs-up",
        target: {
          parentEntity: data.propertyId,
          entity: data.questionId,
        },
      });
      await newNotification.save();
      {
        socket
          .to(foundSocketId)
          .emit(
            "receive-reply-like",
            `${data.username} has liked your reply to the question!`
          );
      }
    }
  });

  socket.on("reply-dislike", async (data) => {
    let foundSocketId = users.get(data.ownerId);
    if (foundSocketId) {
      const newNotification = new Notification({
        body: `${data.username} has disliked your reply to the question!`,
        userId: data.ownerId,
        notificationType: "thumbs-down",
        target: {
          parentEntity: data.propertyId,
          entity: data.questionId,
        },
      });
      await newNotification.save();
      {
        socket
          .to(foundSocketId)
          .emit(
            "receive-reply-dislike",
            `${data.username} has disliked your reply to the question!`
          );
      }
    }
  });

  socket.on("review-post", async (data) => {
    let foundSocketId = users.get(data.ownerId);
    if (foundSocketId) {
      const newNotification = new Notification({
        body: `${data.username} has left a review on your profile!`,
        userId: data.ownerId,
        notificationType: "star",
        target: {
          parentEntity: data.ownerId,
          entity: data.reviewId,
        },
      });
      await newNotification.save();
      {
        socket
          .to(foundSocketId)
          .emit(
            "receive-review",
            `${data.username} has left a review on your profile!`
          );
      }
    }
  });

  socket.on("question-answered", async (data) => {
    let foundSocketId = users.get(data.ownerId);
    if (foundSocketId) {
      const newNotification = new Notification({
        body: `A question you have replied to has been marked as answered by ${data.username}`,
        userId: data.ownerId,
        notificationType: "check",
        targetId: data.targetId,
      });
      await newNotification.save();
      {
        socket
          .to(foundSocketId)
          .emit(
            "receive-question-answered",
            `A question you have replied to has been marked as answered by ${data.username}`
          );
      }
    }
  });

  socket.on("disconnect", async (reason) => {
    for (const [key, value] of users.entries()) {
      if (value === socket.id) {
        const user = await User.findById(key).select("fullName");
        users.delete(key);
        socket.leave("join-room");
        socket.leave(socket.id);
        io.in("live-chat").emit("receive-chat-message", {
          body: `${user.fullName} has left the chat!`,
          isInformationalBanner: true,
        });
        io.in("live-chat").emit("live-chat-count", users.size);
      }
    }
  });
});

server.listen(PORT, console.log(`We are live and listening on port ${PORT}`));
mongoose.connect(
  process.env.DB_CONNECTION,
  console.log("Connected to Database !")
);
