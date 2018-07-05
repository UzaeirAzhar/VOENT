var dbManager = require("../DBManager");
var async = require("async");

module.exports = {

    getAllOtherUsers: function (userId, res, callback) {
        var dbMan = new dbManager();
        var query = "select * from user where id != ?";
        dbMan.executeSelectQuery(query, [userId], function (err, result) {
            if (err) {
                callback(new Error(err), null, res);
            } else {
                console.log(result);
                callback(null, result, res);
            }
        });
    },

    getOrganizerRoleId: function (res, callback) {
        var dbMan = new dbManager();
        var query = "select id from roles where name = ?";
        dbMan.executeFindOneSelectQuery(query, ['Organizer'], function (err, result) {
            if (err) {
                callback(new Error(err), null, res);
            } else {
                console.log(result);
                callback(null, result, res);
            }
        });
    },

    getAllOtherRoles: function (res, callback) {
        var dbMan = new dbManager();
        var query = "select * from Roles where name != ?";
        dbMan.executeSelectQuery(query, ['Organizer'], function (err, result) {
            if (err) {
                callback(new Error(err), null, res);
            } else {
                console.log(result);
                callback(null, result, res);
            }
        });
    },
    
    authenticateUser: function (res, email, user_password, callback) {
        var response = "";
        //console.log("Going for auth of user " + user_id);
        var dbMan = new dbManager();
        var query = "SELECT user.id, name, password, email, address, gender, phone, is_active"
        query += " from user WHERE email = ? and password = ?";

        console.log("Query", query);
        dbMan.authenticateUser(query, [email, user_password], function (err, result) {
            if (err) {
                callback(new Error(err), null, res);
            } else {
                callback(null, result, res);
            }
        });
    },
	
	isUserValid: function(userID, callback){
        var dbMan = new dbManager();
        var query = "SELECT email from user where email = " + email;
		console.log("Restriction Query " + query);
		dbMan.executeFindOneSelectQuery(query, function(err, result){
			if(err){
				callback(new Error(err), null);
			}else{
				callback(null, result);
			}
		});
    },

    addNewUser: function (res, user, callback) {

        var response = {};
        var dbMan = new dbManager();
        var isEmailExistsQuery = "SELECT id FROM user WHERE LOWER(TRIM(Email)) = '" + user.email.trim().toLowerCase() + "'";

        dbMan.executeSelectQuery(isEmailExistsQuery, function (err, result) {
            if (err) {
                callback(new Error(err), null, res);
            } else {
                if (result && result.result && result.result.length > 0) {
                    callback(new Error("User with this email already exist."), null, res);
                }
                else {
                    var query = 'INSERT INTO user SET ?';
                    var obj = {
                        name: user.name,
                        password: user.password,
                        email: user.email,
                        address: user.address,
                        gender: user.gender,
                        phone: user.phone
                    }
                    dbMan.executeInsertQuery(query, obj, function (err, result) {
                        if (err) {
                            callback(new Error(err), null, res);
                        } else {
                            callback(null, result, res);
                        }
                    });
                }
            }
        });
    }
    
}