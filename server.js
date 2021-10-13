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
  socket.on("join-server", (userId) => {
    users.set(userId, socket.id);
  });

  socket.on("question-post", async (data) => {
    let foundSocketId = users.get(data.ownerId);

    if (foundSocketId) {
      socket
        .to(foundSocketId)
        // .in(foundSocketId)
        .emit(
          "receive-question",
          `${data.username} has posted a question on your property!`
        );
      const newNotification = new Notification({
        body: `${data.username} has posted a question on your property!`,
        userId: data.ownerId,
        notificationType: "fa-question",
      });
      await newNotification.save();
    }
  });

  socket.on("question-like", async (data) => {
    let foundSocketId = users.get(data.ownerId);
    console.log(data);
    if (foundSocketId) {
      {
        socket
          .to(foundSocketId)
          .emit(
            "receive-question-like",
            `${data.username} has liked one of your questions!`
          );
      }
      const newNotification = new Notification({
        body: `${data.username} has liked one of your questions!`,
        userId: data.ownerId,
        notificationType: "fa-thumbs-up",
      });
      await newNotification.save();
    }
  });

  socket.on("question-dislike", async (data) => {
    let foundSocketId = users.get(data.ownerId);
    if (foundSocketId) {
      {
        socket
          .to(foundSocketId)
          .emit(
            "receive-question-dislike",
            `${data.username} has disliked of your questions!`
          );
      }
      const newNotification = new Notification({
        body: `${data.username} has disliked one of your questions!`,
        userId: data.ownerId,
        notificationType: "fa-thumbs-down",
      });
      await newNotification.save();
    }
  });

  socket.on("review-post", async (data) => {
    let foundSocketId = users.get(data.ownerId);
    if (foundSocketId) {
      {
        socket
          .to(foundSocketId)
          .emit(
            "receive-review",
            `${data.username} has left a review on your profile!`
          );
      }
      const newNotification = new Notification({
        body: `${data.username} has left a review on your profile!`,
        userId: data.ownerId,
        notificationType: "fa-star",
      });
      await newNotification.save();
    }
  });

  socket.on("question-answered", async (data) => {
    let foundSocketId = users.get(data.ownerId);
    if (foundSocketId) {
      {
        socket
          .to(foundSocketId)
          .emit(
            "receive-question-answered",
            `A question you have replied to has been marked as answered by ${data.username}`
          );
      }
      const newNotification = new Notification({
        body: `A question you have replied to has been marked as answered by ${data.username}`,
        userId: data.ownerId,
        notificationType: "fa-check",
      });
      await newNotification.save();
    }
  });

  socket.on("disconnect", () => [
    // console.log(`User discoonected ${socket.id}`),
  ]);
});

server.listen(PORT, console.log(`We are live and listening on port ${PORT}`));
mongoose.connect(
  process.env.DB_CONNECTION,
  console.log("Connected to Database !")
);
