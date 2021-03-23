var express = require("express");
var router = express.Router();

// About page
router.get("/", (req, res) => {
    res.render('about',{Theme:"light-mode"});
});

module.exports = router;