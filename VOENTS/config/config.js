module.exports = function(app){

    var userRoutes = require("../routes/users");
    var eventRoutes = require("../routes/events");
    
    app.use("/users", userRoutes);
    app.use("/events", eventRoutes);
    

}