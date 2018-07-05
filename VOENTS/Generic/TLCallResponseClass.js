var talCallResponse = TLCallResponse.prototype;

//var _req = null;
//var _res = null;
//
function TLCallResponse() {
//    _req = req;
//    _res = res;
}

talCallResponse.TLCallback = function (err, data, res) {
    
    if (err) {
        if (err.message && err.message.indexOf("failed to connect") !== -1) {
            res.status(500).send("Something bad happened");
        } else {
            var err = {
                status: false,
                message: err.message
            }
            res.status(400).send(JSON.stringify(err));
        }
    } else {
        res.end(JSON.stringify(data));
    }
};

Date.prototype.yyyymmdd = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    var hours = this.getHours().toString();
    var minutes = this.getMinutes().toString();
    var seconds = this.getSeconds().toString();
    if (mm < 10) {
        mm = "0" + mm;
    }
    if (dd < 10) {
        dd = "0" + dd;
    }
    
    
    if (hours < 10) {
        hours = "0" + hours;
    }
    
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    
    
    return yyyy + "-" + mm + "-" + dd + " " + hours + ":" + minutes + ":" + seconds; // padding
};

Date.prototype.yyyymmddWithoutTime = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    
    if (mm < 10) {
        mm = "0" + mm;
    }
    if (dd < 10) {
        dd = "0" + dd;
    }
    
    return yyyy + "-" + mm + "-" + dd;
};

Date.prototype.Time = function () {
    var hours = this.getHours().toString();
    var minutes = this.getMinutes().toString();
    var seconds = this.getSeconds().toString();
    
    if (hours < 10) {
        hours = "0" + hours;
    }
    
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    
    return hours + ":" + minutes + ":" + seconds;
};

module.exports = TLCallResponse;