const express = require("express");

const PostRouter = require("./posts/post-router.js");

const server = express();

server.use(express.json());

server.use("/api/posts", PostRouter);

server.get("/", (req, res) => {
  res.send("DB Helpers with knex");
});

module.exports = server;
