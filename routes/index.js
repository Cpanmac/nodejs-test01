var express = require("express");
var router = express.Router();
var when = require("when");
var login = require("./login");
router.use(login.islogin);
router.get("/", function(req, res) {
    res.render("index");
});
module.exports = router;