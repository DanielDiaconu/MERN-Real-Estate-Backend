require("dotenv/config");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 8080;
const cors = require("cors");
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

app.use(cors());
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

app.listen(PORT, console.log(`We are live and listening on port ${PORT}`));
mongoose.connect(
  process.env.DB_CONNECTION,
  console.log("Connect to Database !")
);
