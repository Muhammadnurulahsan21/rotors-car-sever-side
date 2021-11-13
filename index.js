const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();

const cors = require("cors");
require("dotenv").config();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Running my CRUD Server");
});

app.listen(port, () => {
  console.log("Running Server on port", port);
});
