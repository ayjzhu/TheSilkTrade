const express = require('express');
const router = express.Router();
const userRoutes = require("./user.js");
const clothingRoutes = require("./clothing.js");

router.get("/", (req, res) => {
    res.send("Queried api page!");
});

router.use("/clothes", clothingRoutes);
router.use("/user", userRoutes);

module.exports = router