
var dbManagerClass = DBManager.prototype;

//var app_config = require('./config/app_config.js');

var _connection = null;

function DBManager(mysql) {
    if (!_connection) {
        var connection = mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'root',
            database: 'events',
            multipleStatements: true
        });
        
        connection.connect(function (err) {
            if (!err) {
                console.log("Database is connected");
            } else {
                console.log("Error connecting database " + JSON.stringify(err, null, 4));
            }
        });
        
        _connection = connection;
    }
}

function DBManagerClass() {
    console.log("Initialising");
}

dbManagerClass.getConnection = function () {
    return _connection;
}

dbManagerClass.authenticateUser = function (query, params, callback) {
    var res = null;
    _connection.query(query, params, function (err, result) {
        console.log(params);
        if (err) {
            var error = "Some error occurred.";
            callback(err);
        } else {
            if (result && result.length > 0) {
                
                if (result[0].is_active && result[0].is_active == 1) {
                    res = {
                        "status": true,
                        "message": "success",
                        result: result[0]
                    }
                    callback(null, res);
                } else {
                    var error = "ACCOUNT_INACTIVE";
                    
                    callback(error);
                }
                
            } else {
                res = {
                    "status": false,
                    "message": "Invalid credentials."
                }
                var error = "Invalid credentials.";
                
                callback(error);
            }
        }

    });
}

dbManagerClass.executeFindOneSelectQuery = function (query, params, callback) {
    
    var res = null;
    _connection.query(query, params, function (err, result) {
        if (err) {
            var error = "Some error occurred.";
            callback(err);
        } else {
            if (result && result.length > 0) {
                res = {
                    "status": true,
                    "message": "success",
                    result: result[0]
                }
                callback(null, res);
            } else {
                res = {
                    "status": true,
                    "message": "success",
                    result: {}
                }
                callback(null, res);
            }
        }

    });
};
dbManagerClass.executeSelectQuery = function (query, params, callback) {
    var res = null;
    _connection.query(query, params, function (err, result) {
        if (err) {
            console.log("Err " + err);
            res = {
                "status": false,
                "message": "Some error occurred."
            }
            var error = "Some error occurred.";
            callback(err);
            //callback(new Error(JSON.stringify(res)));
        } else {
            if (result) {
                res = {
                    "status": true,
                    "message": "success",
                    result: result
                }
                callback(null, res);
            }
        }

    });
}
dbManagerClass.executeUpdateQuery = function (query, params, Obj, callback) {
    _connection.query(query, params, Obj, function (err, result) {
        if (!err) {
            resp = {
                "status": true,
                "message": "success",
                changedRows: result.changedRows
            }
            callback(null, resp);
        } else {
            var error = "Some error occurred.";
            callback(err);
        }
    });
};
dbManagerClass.executeDeleteQuery = function (query, params, callback) {
    var res = null;
    _connection.query(query, params, function (err, result) {
        if (err) {
            var error = "Some error occurred.";
            callback(err);
        } else {
            res = {
                "status": true,
                "message": "success",
                "result": result.affectedRows
            }
            callback(null, res);
        }
    });
};
dbManagerClass.executeInsertQuery = function (query, object, callback) {
    
    var resp = null;
    _connection.query(query, object, function (err, result) {
        if (!err) {
            resp = {
                "status": true,
                "message": "success",
                insertId: result.insertId
            }
            callback(null, resp);
        } else {
            console.log("Error " + err);
            var error = "Some error occurred.";
            callback(err);
        }
    });
};


dbManagerClass.executeArrayInsertQuery = function (query, array, callback) {
    
    var res = null;
    var arr = [];
    arr.push(arr);
    _connection.query(query, [array], function (err, result) {
        if (!err) {
            res = {
                "status": true,
                "message": "success",
                insertId: result.insertId
            }
            callback(null, res);
        } else {
            var error = "Some error occurred.";
            callback(err);
        }
    });
};


dbManagerClass.executeMultipleItemSelectQuery = function (itemQuery, servingQuery, excludablesQuery, extrasQuery, callback) {
    _connection.query(itemQuery + ';' + servingQuery + ';' + excludablesQuery + ';' + extrasQuery, function (err, results) {
        
        if (err) {
            callback(new Error(err));
        } else {
            var itemObject = {};
            
            if (results[0]) {
                itemObject = results[0][0];
            } else {
                itemObject.item = {};
            }
            
            console.log("results[0] " + JSON.stringify(results[0]));
            console.log("results[0] item " + JSON.stringify(itemObject.item));
            
            if (results[1]) {
                itemObject.item_serving = results[1]
            } else {
                itemObject.item_serving = [];
            }
            
            if (results[2]) {
                itemObject.item_excludable = results[2]
            } else {
                itemObject.item_excludable = [];
            }
            
            if (results[3]) {
                itemObject.item_extra = results[3]
            } else {
                itemObject.item_extra = [];
            }
        }
        
        callback(null, itemObject);

    });
}

dbManagerClass.executeDeleteExtraExcludablesItemQuery = function (extrasQuery, excludablesQuery, itemQuery, callback) {
    _connection.query(extrasQuery + ';' + excludablesQuery + ';' + itemQuery, function (err, results) {
        
        if (err) {
            callback(new Error(err));
        } else {
            callback(null, results);
        }
    });
}

dbManagerClass.executeMultipleGroupQuery = function (servingQuery, excludablesQuery, extrasQuery, dealItemsQuery, callback) {
    _connection.query(servingQuery + ';' + excludablesQuery + ';' + extrasQuery + ';' + dealItemsQuery, function (err, results) {
        
        //console.log("Calling");
        
        if (err) {
            console.log(err);
            callback(new Error(err));
        } else {
            var itemObject = {};
            
            if (results[0]) {
                itemObject.item_serving = results[0];
            } else {
                itemObject.item_serving = [];
            }
            
            if (results[1]) {
                itemObject.item_excludable = results[1];
            } else {
                itemObject.item_excludable = [];
            }
            
            if (results[2]) {
                itemObject.item_extra = results[2];
            } else {
                itemObject.item_extra = [];
            }
            
            if (results[3]) {
                itemObject.item_dealitems = results[3];
            } else {
                itemObject.item_dealitems = [];
            }





            //if(results[1]){
            //    groupObject.item_serving = results[1]
            //}else{
            //    itemObject.item_serving = [];
            //}
            //
            //if(results[2]){
            //    itemObject.item_excludable = results[2]
            //}else{
            //    itemObject.item_excludable = [];
            //}
            //
            //if(results[3]){
            //    itemObject.item_extra = results[3]
            //}else{
            //    itemObject.item_extra = [];
            //}
        }
        
        //console.log("Group Object " + JSON.stringify(itemObject));
        callback(null, itemObject);

    });
}

dbManagerClass.executeMultipleOrderItemGroupQuery = function (excludablesQuery, extrasQuery, callback) {
    _connection.query(excludablesQuery + ';' + extrasQuery, function (err, results) {
        
        //console.log("Calling");
        
        if (err) {
            console.log(err);
            callback(new Error(err));
        } else {
            var itemObject = {};
            
            if (results[0]) {
                itemObject.order_item_excludable = results[0];
            } else {
                itemObject.order_item_excludable = [];
            }
            
            if (results[1]) {
                itemObject.order_item_extra = results[1];
            } else {
                itemObject.order_item_extra = [];
            }
        }
        callback(null, itemObject);
    });
};

dbManagerClass.executeDeleteAllOrdersQuery = function (extrasQuery, excludablesQuery, itemQuery, ordersQuery, callback) {
    _connection.query(extrasQuery + ';' + excludablesQuery + ';' + itemQuery + ';' + ordersQuery, function (err, results) {
        
        if (err) {
            callback(new Error(err));
        } else {
            callback(null, results);
        }
    });
};

dbManagerClass.getOrdersAgainstDateTimeUpdatedAndCreated = function (createdQuery, updatedQuery, callback) {
    _connection.query(createdQuery + ';' + updatedQuery, function (err, results) {
        
        //console.log("Calling");
        
        if (err) {
            console.log(err);
            callback(err.message);
        } else {
            var newOrders = {};
            
            if (results[0]) {
                newOrders.createdOrders = results[0];
            } else {
                newOrders.createdOrders = [];
            }
            
            if (results[1]) {
                newOrders.updatedOrders = results[1];
            } else {
                newOrders.updatedOrders = [];
            }
        }
        
        //console.log("Group Object " + JSON.stringify(itemObject));
        callback(null, newOrders);

    });
}


module.exports = DBManager;
