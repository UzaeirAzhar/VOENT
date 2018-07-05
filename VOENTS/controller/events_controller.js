var dbManager = require("../DBManager");
var async = require("async");
var fs = require("fs");
var _ = require('underscore');

module.exports = {

    getEventTypesAndSubTypes: function (res, callback) {
        var dbMan = new dbManager();
        var eventTypes = [];
        var subEventTypes = [];
        async.series({
            getEventTypes: function (getEventTypesCallback) {
                var query = "Select * from event_type";
                dbMan.executeSelectQuery(query, function (err, getEventTypeResult) {
                    if (err) {
                        getEventTypesCallback(err);
                    } else {
                        eventTypes = getEventTypeResult.result;
                        getEventTypesCallback(null, getEventTypeResult);
                    }
                });
            },
            getEventSubTypes: function (getSubEventTypesCallback) {
                var query = "Select * from sub_event_type";
                dbMan.executeSelectQuery(query, function (err, getSubEventTypeResult) {
                    if (err) {
                        getSubEventTypesCallback(err);
                    } else {
                        subEventTypes = getSubEventTypeResult.result;
                        getSubEventTypesCallback(null, getSubEventTypeResult);
                    }
                });
            },
        }, function (err, results) {
            if (err) {
                callback(err, null, res);
            } else {
                var finalresults = {};
                //console.log(results);
                var types = results.getEventTypes;
                var subTypes = results.getEventSubTypes;
                var resultObj = {
                    "types": types,
                    "subTypes": subTypes
                };
                finalresults = {
                    "status": true,
                    "message": "success",
                    "result": resultObj
                };
                callback(null, finalresults, res);
            }
        });
        //var dbMan = new dbManager();
        //var query = "select event_type.id, event_type.Name, sub_event_type.id as 'sub_event_id', sub_event_type.Name as 'sub_event_name' from event_type ";
        //query += "inner join sub_event_type on event_type.id = sub_event_type.event_type_id";

        //console.log("Get All Event Types and Sub Types " + query);

        //dbMan.executeSelectQuery(query, function (err, result) {
        //    if (err) {
        //        callback(new Error(err), null, res);
        //    } else {
        //        callback(null, result, res);
        //    }
        //});
    },

    getAllUserEvents: function (userId, res, callback) {
        var dbMan = new dbManager();

        var query = "SELECT events.id, events.name, events.event_type, events.`sub_type`, events.`start_date`, events.end_date, ";
        query += "events.`is_multi`, events.`is_discussion_page`, user_event_role.id AS 'user_event_role_id', ";
        query += "roles.`id` AS `role_id`, roles.`name` AS `role_name`, event_type.`id` AS `event_type_id`, ";
        query += "event_type.`Name` AS `event_type_name`, ";
        query += "sub_event_type.`id` AS `sub_event_id`, sub_event_type.`Name` AS `sub_event_type_name` FROM EVENTS ";
        query += "INNER JOIN user_event_role ON events.`id`= `user_event_role`.`event_id` ";
        query += "INNER JOIN USER ON user.id = user_event_role.`user_id` ";
        query += "INNER JOIN roles ON roles.id = user_event_role.`role_id` ";
        query += "INNER JOIN event_type ON event_type.`id` = events.`event_type` ";
        query += "INNER JOIN `sub_event_type` ON sub_event_type.`id`= events.`sub_type` ";
        query += "WHERE user.id = ? AND events.is_active = 1";
        dbMan.executeSelectQuery(query, [userId], function (err, result) {
            if (err) {
                callback(new Error(err), null, res);
            } else {
                callback(null, result, res);
            }
        });
    },

    deleteUserEvent: function (eventId, res, callback) {
        var dbMan = new dbManager();
        var query = "UPDATE events SET events.is_active = 0 WHERE events.id = ?";

        dbMan.executeUpdateQuery(query, [eventId], null, function (err, result) {
            if (err) {
                callback(new Error(err), null, res);
            } else {
                callback(null, result, res);
            }
        });
    },

    updateUserEvent: function (eventId, res, callback) {
        return {
            "message": "success",
            "status": true
        };
    },

    createNewEvent: function (userId, roleId, objEvent, objUserPermissions, objOptions, res, callback) {
        var dbMan = new dbManager();
        var eventId = 0;
        var connection = dbMan.getConnection();
        connection.beginTransaction(function (err) {
            if (err) {
                console.log("Error in Controller Transaction code");
                callback(Error(err), null, res);
            } else {
                async.series({
                    saveEvent: function (saveEventCallback) {
                        var query = "INSERT INTO events SET ?";
                        dbMan.executeInsertQuery(query, objEvent, function (err, result) {
                            if (err) {
                                saveEventCallback(err);
                            } else {
                                eventId = result.insertId;
                                saveEventCallback(null, result);
                            }
                        });
                    },
                    saveUserPermissions: function (saveUserPermissionsCallback) {
                        var _arr = [];
                        objUserPermissions.push({ user_id: userId, event_id: eventId, role_id: roleId });
                        if (objUserPermissions && objUserPermissions.length > 0) {
                            _.each(objUserPermissions, function (permission) {
                                permission.event_id = eventId;
                                var arr = [Number(permission.user_id), Number(permission.event_id), Number(permission.role_id)];
                                _arr.push(arr);
                            });
                            // console.log(_arr);
                            var query = "INSERT INTO USER_EVENT_ROLE (user_id, event_id, role_id) VALUES ?";
                            dbMan.executeArrayInsertQuery(query, _arr, function (err, result) {
                                if (err) {
                                    saveUserPermissionsCallback(err);
                                } else {
                                    saveUserPermissionsCallback(null, result);
                                }
                            });
                        } else {
                            saveUserPermissionsCallback(null, null);
                        }
                    },
                    saveOptions: function (saveOptionsCallback) {
                        var _arrOptions = [];
                        if (objOptions && objOptions.length > 0) {
                            _.each(objOptions, function (option) {
                                option.event_id = eventId;
                                var arr = [option.name, option.date, option.time, option.place, Number(option.event_id)];
                                _arrOptions.push(arr);
                            });
                            var query = "INSERT INTO OPTIONS (name, date, time, place, event_id) VALUES ?";
                            dbMan.executeArrayInsertQuery(query, _arrOptions, function (err, result) {
                                if (err) {
                                    saveOptionsCallback(err);
                                } else {
                                    saveOptionsCallback(null, result);
                                }
                            });
                        }
                    }
                }, function (err, results) {
                    if (err) {
                        callback(err, null, res);
                    } else {
                        connection.commit(function (err) {
                            if (err) {
                                connection.rollback(function () {
                                    // console.log("Hellooooo.... Transaction commit failed...");
                                    callback(Error(err), null, res);
                                });
                            }
                            finalresults = {
                                "status": true,
                                "message": "Event Created successfully.",
                                "result": {}
                            };
                            callback(null, finalresults, res);
                        });
                    }
                });
            }
        });
    },

    getEventDetails: function (userId, eventId, res, callback) {
        var dbMan = new dbManager();
        var connection = dbMan.getConnection();
        connection.beginTransaction(function (err) {
            if (err) {
                console.log("Error in Controller Transaction code.");
                callback(Error(err), null, res);
            } else {
                async.series({
                    eventDetails: function (getEventDetailsCallback) {
                        var query = "SELECT events.id, events.name, events.event_type, events.`sub_type`, events.`start_date`, events.end_date, ";
                        query += "events.`is_multi`, events.`is_discussion_page`, user_event_role.id AS 'user_event_role_id', ";
                        query += "roles.`id` AS `role_id`, roles.`name` AS `role_name`, event_type.`id` AS `event_type_id`, ";
                        query += "event_type.`Name` AS `event_type_name`, ";
                        query += "sub_event_type.`id` AS `sub_event_id`, sub_event_type.`Name` AS `sub_event_type_name` FROM EVENTS ";
                        query += "INNER JOIN user_event_role ON events.`id`= `user_event_role`.`event_id` ";
                        query += "INNER JOIN USER ON user.id = user_event_role.`user_id` ";
                        query += "INNER JOIN roles ON roles.id = user_event_role.`role_id` ";
                        query += "INNER JOIN event_type ON event_type.`id` = events.`event_type` ";
                        query += "INNER JOIN `sub_event_type` ON sub_event_type.`id`= events.`sub_type` ";
                        query += "WHERE user.id = ? AND events.is_active = 1 AND events.id = ?";
                        dbMan.executeFindOneSelectQuery(query, [userId, eventId], function (err, result) {
                            if (err) {
                                getEventDetailsCallback(err);
                            } else {
                                getEventDetailsCallback(null, result);
                            }
                        });
                    },
                    eventUsers: function (getEventUsersCallback) {
                        var query = "SELECT user.id AS `user_id`, user.name AS `user_name`, user.email, user.gender, roles.`name` AS `role_name`, roles.`id` AS `role_id` FROM `user` ";
                        query += "INNER JOIN `user_event_role` ON `user_event_role`.`user_id` = user.`id` ";
                        query += "INNER JOIN roles ON roles.id = user_event_role.`role_id` ";
                        query += "INNER JOIN EVENTS ON events.id = user_event_role.`event_id` ";
                        query += "WHERE user_event_role.event_id = ? AND user_event_role.user_id <> ?";
                        dbMan.executeSelectQuery(query, [eventId, userId], function (err, result) {
                            if (err) {
                                getEventUsersCallback(err);
                            } else {
                                getEventUsersCallback(null, result);
                            }
                        });
                    },
                    eventOptions: function (getEventOptionsCallback) {
                        var query = "SELECT options.id, options.name, options.date, options.time, options.`place`, count(option_id) as `option_count` FROM `options` ";
                        query += "INNER JOIN `events` ON options.`event_id` = events.`id` ";
                        query += "LEFT OUTER JOIN user_event_option ON options.id = user_event_option.option_id  ";
                        query += "WHERE`events`.`id` = ? ";
                        query += "group by options.id ";
                        query += "ORDER BY options.`id`";

                        dbMan.executeSelectQuery(query, [eventId], function (err, result) {
                            if (err) {
                                getEventOptionsCallback(err);
                            } else {
                                getEventOptionsCallback(null, result);
                            }
                        });
                    }
                }, function (err, results) {
                    if (err) {
                        callback(err, null, res);
                    } else {
                        connection.commit(function (err) {
                            if (err) {
                                connection.rollback(function () {
                                    console.log("Hellooooo.... Transaction commit failed...");
                                    callback(Error(err), null, res);
                                });
                            }
                            var obj = {};
                            obj.eventDetails = results.eventDetails.result;
                            obj.eventUsers = results.eventUsers.result;
                            obj.eventOptions = results.eventOptions.result;

                            finalresults = {
                                "status": true,
                                "message": "Success",
                                "result": obj
                            };
                            callback(null, finalresults, res);
                        });
                    }
                });
            }
        });
    },

    saveEventUserAndVotingInformation: function (roleName, userId, eventId, eventUsers, eventDetail, userOptionVotes, res, callback) {
        var dbMan = new dbManager();
        var connection = dbMan.getConnection();
        connection.beginTransaction(function (err) {
            if (err) {
                console.log("Error in Controller Transaction code.");
                callback(Error(err), null, res);
            } else {
                async.series({
                    eventDetails: function (eventDetailsCallback) {
                        if (eventDetail) {
                            var query = "UPDATE events SET ? WHERE events.id = " + eventId;
                            dbMan.executeUpdateQuery(query, eventDetail, function (err, result) {
                                if (err) {
                                    eventDetailsCallback(err);
                                } else {
                                    eventDetailsCallback(null, result);
                                }
                            });
                        } else {
                            eventDetailsCallback(null, null);
                        }
                    },
                    eventUsers: function (eventUsersCallback) {
                        if (roleName === 'Organizer') {
                            var query = "DELETE FROM user_event_role WHERE event_id = ?";
                            dbMan.executeDeleteQuery(query, [eventId], function (err, result) {
                                if (err) {
                                    eventUsersCallback(err);
                                } else {
                                    if (eventUsers && eventUsers.length > 0) {
                                        var _arr = [];
                                        _.each(eventUsers, function (_eventUser) {
                                            var arr = [Number(_eventUser.user_id), Number(_eventUser.event_id), Number(_eventUser.role_id)];
                                            _arr.push(arr);
                                        });
                                        // console.log(_arr);
                                        var query = "INSERT INTO USER_EVENT_ROLE (user_id, event_id, role_id) VALUES ?";
                                        dbMan.executeArrayInsertQuery(query, _arr, function (err, result) {
                                            if (err) {
                                                eventUsersCallback(err);
                                            } else {
                                                eventUsersCallback(null, result);
                                            }
                                        });
                                    } else {
                                        eventUsersCallback(null, null);
                                    }
                                }
                            });
                        } else {
                            eventUsersCallback(null, null);
                        }
                    },
                    eventUserOptions: function (eventUserOptionsCallback) {
                        if (userOptionVotes && userOptionVotes.length > 0) {

                            var query = "DELETE FROM user_event_option WHERE user_id = ? AND event_id = ?";
                            dbMan.executeDeleteQuery(query, [userId, eventId], function (err, result) {
                                if (err) {
                                    eventUserOptionsCallback(err);
                                } else {
                                    var _arr = [];
                                    _.each(userOptionVotes, function (_userOptionVote) {
                                        var arr = [Number(_userOptionVote.user_id), Number(_userOptionVote.event_id), Number(_userOptionVote.option_id)];
                                        _arr.push(arr);
                                    });
                                    // console.log(_arr);
                                    var query = "INSERT INTO `user_event_option` (user_id, event_id, option_id) VALUES ?";
                                    dbMan.executeArrayInsertQuery(query, _arr, function (err, result) {
                                        if (err) {
                                            eventUserOptionsCallback(err);
                                        } else {
                                            eventUserOptionsCallback(null, result);
                                        }
                                    });
                                }
                            });
                        } else {
                            eventUserOptionsCallback(null, null);
                        }
                        
                    }
                }, function (err, results) {
                    if (err) {
                        callback(err, null, res);
                    } else {
                        connection.commit(function (err) {
                            if (err) {
                                connection.rollback(function () {
                                    console.log("Hellooooo.... Transaction commit failed...");
                                    callback(Error(err), null, res);
                                });
                            }

                            finalresults = {
                                "status": true,
                                "message": "Success",
                                "result": {}
                            };
                            callback(null, finalresults, res);
                        });
                    }
                });
            }
        });
    },

    getEventVoteGraph: function (eventId, res, callback) {
        var dbMan = new dbManager();
        var query = "SELECT COUNT(option_id) AS `data`, options.`name` AS `label` ";
        query += "FROM user_event_option ";
        query += "INNER JOIN `options` ON options.`id` = user_event_option.option_id ";
        query += "WHERE user_event_option.event_id = ? ";
        query += "GROUP BY option_id";

        dbMan.executeSelectQuery(query, [eventId], function (err, result) {
            if (err) {
                callback(new Error(err), null, res);
            } else {
                callback(null, result, res);
            }
        });
        

    },

    getEventOnlyDetails: function (eventId, res, callback) {
        var dbMan = new dbManager();
        var query = "SELECT * from events where id = ?";

        dbMan.executeSelectQuery(query, [eventId], function (err, result) {
            if (err) {
                callback(new Error(err), null, res);
            } else {
                callback(null, result, res);
            }
        });


    }
}