const express = require("express");
const router = express.Router();

// GET usuarios
router.get("/", (req, res) => {
    res.send("Aqui se listaran los usuarios");
});

// POST usuarios
router.post("/", (req, res) => {
    res.send("Aqui se creara un nuevo usuario");
});

module.exports = router;