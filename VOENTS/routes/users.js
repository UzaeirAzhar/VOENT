var express = require('express');
var router = express.Router();
var user_controller = require("../controller/user_controller");

var TLCallBackClass = require("../Generic/TLCallResponseClass");

var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = 'd6F3Efeq';

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(text, 'utf-8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

router.post("/authenticate", function (req, res) {

    console.log(req.body);
    var email = req.body.email;
    var password = req.body.password;
    console.log("oasswro", password);

    password = encrypt(password);
    console.log("DecryptedPassword", password);
    //var dbMan = new DBManager();
    
    var callBackClass = new TLCallBackClass();
    
    user_controller.authenticateUser(res, email, password, callBackClass.TLCallback);

});

router.get("/getAllOtherUsers/:userId", function (req, res) {
    var userId = req.params.userId;
    var callBackClass = new TLCallBackClass();
    user_controller.getAllOtherUsers(userId, res, callBackClass.TLCallback);
});

router.get("/getAllOtherRoles", function (req, res) {
    var callBackClass = new TLCallBackClass();
    user_controller.getAllOtherRoles(res, callBackClass.TLCallback);
});


router.get("/getOrganizerRoleId", function (req, res) {
    var callBackClass = new TLCallBackClass();
    user_controller.getOrganizerRoleId(res, callBackClass.TLCallback);
});



router.post("/addNewUser", function (req, res) {
    var user = req.body;
    var d = new Date(user.DOB).yyyymmdd();
    user.DOB = d;
    console.log("Password", user.password);
    var encPassword = encrypt(user.password);
    user.password = encPassword;
    console.log("Enc Password", user.password);
    var callBackClass = new TLCallBackClass();
    user_controller.addNewUser(res, user, callBackClass.TLCallback);
});


module.exports = router;
