const express = require("express");
const router = express.Router();

// GET tareas
router.get("/", (req, res) => {
    res.send("Aqui se listaran las tareas");
});

// POST tareas
router.post("/", (req, res) => {
    res.send("Aqui se creara una nueva tarea");
});

module.exports = router;