var express = require('express');
var router = express.Router();
var events_controller = require("../controller/events_controller");

var TLCallBackClass = require("../Generic/TLCallResponseClass");


/* GET users listing. */

router.get("/getEventTypeAndSubTypes", function (req, res) {
    var callBackClass = new TLCallBackClass();
    events_controller.getEventTypesAndSubTypes(res, callBackClass.TLCallback);
});

router.get("/getAllUserEvents/:userId", function (req, res) {
    var callBackClass = new TLCallBackClass();
    var userId = req.params.userId;
    events_controller.getAllUserEvents(userId, res, callBackClass.TLCallback);
});

router.delete('/deleteUserEvent/:eventId', function (req, res) {
    var callBackClass = new TLCallBackClass();
    var eventId = req.params.eventId;
    events_controller.deleteUserEvent(eventId, res, callBackClass.TLCallback);

});

router.put('/updateUserEvent/:eventId', function (req, res) {
    var callBackClass = new TLCallBackClass();
    var eventId = req.params.eventId;
    events_controller.updateUserEvent(eventId, res, callBackClass.TLCallback);
});

router.post('/createNewEvent/:userId/:roleId', function (req, res) {
    var userId = req.params.userId;
    var roleId = req.params.roleId;
    var objEvent = req.body.event;
    var objUserPermissions = req.body.user_permissions;
    var objOptions = req.body.options;
    var callBackClass = new TLCallBackClass();
    events_controller.createNewEvent(userId, roleId, objEvent, objUserPermissions, objOptions, res, callBackClass.TLCallback);
});


router.get('/getEventDetails/:eventId/:userId', function (req, res) {
    var userId = req.params.userId;
    var eventId = req.params.eventId;

    var callBackClass = new TLCallBackClass();
    events_controller.getEventDetails(eventId, userId, res, callBackClass.TLCallback);
});

router.post('/saveEventUserAndVotingInformation/:eventId/:userId/:roleName', function (req, res) {
    var userId = req.params.userId;
    var eventId = req.params.eventId;
    var roleName = req.params.roleName;
    var eventUsers = null;
    var eventDetail = null;
    var userOptionVotes = req.body.userOptionVotes;
    if (roleName === 'Organizer') {
        eventUsers = req.body.eventUsers;
        eventDetail = req.body.eventDetail;
    }

    var callBackClass = new TLCallBackClass();
    events_controller.saveEventUserAndVotingInformation(roleName, userId, eventId, eventUsers, eventDetail, userOptionVotes, res, callBackClass.TLCallback);

});


router.get('/getEventVoteGraph/:eventId', function (req, res) {
    var eventId = req.params.eventId;
    var callBackClass = new TLCallBackClass();
    events_controller.getEventVoteGraph(eventId, res, callBackClass.TLCallback);
});


router.get('/getEventOnlyDetails/:eventId', function (req, res) {
    var eventId = req.params.eventId;
    var callBackClass = new TLCallBackClass();
    events_controller.getEventOnlyDetails(eventId, res, callBackClass.TLCallback);
});

module.exports = router;