const express = require("express");

// database access using knex
const db = require("../data/db-config.js");

const router = express.Router();

router.get("/", (req, res) => {
  // list of posts
  // select from posts
  // all database operations return a promise
  db.select("*")
    .from("posts")
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error);

      res.status(500).json({ error: "failed to get the list of posts" });
    });
});
// posts by id
router.get("/:id", (req, res) => {
  db("posts")
    // a post by it's id
    // select * from posts where id = :id
    .where({ id: req.params.id })
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Could not retrieve the post" });
    });
});

router.post("/", (req, res) => {
  if (req.body) {
    db("posts")
      .insert(req.body, "id")
      .then(([id]) => id)
      .then(id => {
        db("posts")
          .where({ id })
          .then(post => {
            res.status(201).json(post);
          });
      })
      .catch(() => {
        res.status(500).json({ message: "Could not add the post" });
      });
  } else {
    res.status(400).json({
      message: "Please provide accurate data for the post"
    });
  }
});

router.put("/:id", (req, res) => {
  db("posts")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count) {
        res.status(200).json({ message: `${count} record(s) updated` });
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "Could not update the Post with that id" });
    });
});

router.delete("/:id", (req, res) => {
  db("posts")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      res.status(200).json({ message: `${count} record(s) deleted` });
    })
    .catch(() => {
      res.status(500).json({ message: "Could not remove the post" });
    });
});

module.exports = router;
