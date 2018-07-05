var EventModule = angular.module('EventControllerModule');
EventModule.controller("EventDetailController", function ($rootScope, $scope, $http, $location, $routeParams, _) {

    function init() {
        $scope.userId = $routeParams.userId;
        $scope.eventId = $routeParams.eventId;
        $scope.loadEventDetails($scope.userId, $scope.eventId);
        $scope.messages=[];
    };

    

    var socket = io.connect();
    $scope.initChat = function () {
        
    };
    

    $scope.loadEventDetails = function (eventId, userId) {
        $http.get(base_url + "/events/getEventDetails/" + eventId + "/" + userId)
            .success(function (data, status, headers, config) {
                $scope.eventDetail = data.result.eventDetails;
                $scope.eventDetail.start_date = new Date($scope.eventDetail.start_date);
                var utcEndDate = $scope.eventDetail.end_date;
                $scope.eventDetail.end_date = new Date($scope.eventDetail.end_date);
                $scope.compareDates(utcEndDate);
                $scope.eventUsers = data.result.eventUsers;
                $scope.eventOptions = data.result.eventOptions;
                if ($scope.eventDetail.role_name === 'Organizer') {
                    $scope.getAllUsers();
                    $scope.getAllRoles();
                }
            });
    };

    $scope.compareDates = function (endDate) {
        var currentDate = moment(new Date().toISOString());
        console.log(currentDate);
        var endDate = moment(endDate);
        console.log(endDate);
        var diff = currentDate.diff(endDate, 'minutes');
        if (diff > 0) {
            $scope.isEventExpired = true;
        }
    };

    $scope.getFormattedDate = function (date) {
        if (date) {
            return moment(new Date(date)).format('YYYY-MM-DD');
        }
    }


    $scope.getAllUsers = function () {

        var user = localStorage.getItem("user");
        var userId = JSON.parse(user).id;
        console.log(userId);
        $http.get(base_url + '/users/getAllOtherUsers/' + userId)
            .success(function (data, status, headers, config) {
                ////console.log(data);
                $scope.users = data.result;
            })
            .error(function (error, status, headers, config) {
            });
    }

    $scope.getAllRoles = function () {
        $http.get(base_url + '/users/getAllOtherRoles')
            .success(function (data, status, headers, config) {
                ////console.log(data);
                $scope.roles = data.result;
            })
            .error(function (error, status, headers, config) {
            });
    };


    $scope.addNewEventUser = function () {
        if ($scope.eventUsers.length > 0) {
            var issueFound = true;
            _.each($scope.eventUsers, function (eventUser) {
                if (eventUser.user_id && eventUser.role_id) {
                    issueFound = false;
                } else {
                    issueFound = true;
                }
            });
            if (!issueFound) {
                $scope.eventUsers.push({ user_id: "", role_id: "" });
            } else {
                alert("Please fill above records to continue.");
            }
        } else {
            $scope.eventUsers.push({ user_id: "", role_id: "" });
        }
    };

    $scope.deleteEventUser = function (index) {
        $scope.eventUsers.splice(index, 1);
    };

    $scope.getRadioOptionValue = function (id) {
        _.each($scope.eventOptions, function (event) {
            if (event.id == id) {
                event.isSelected = true;
            } else {
                event.isSelected = false;
            }
        });
    };

    $scope.saveEventUserAndVotingInformation = function () {
        var obj = {};
        if ($scope.eventDetail.role_name === 'Organizer') {
            var votingData = $scope.getVotingData();
            obj.eventDetail = { end_date: $scope.eventDetail.end_date };
            obj.userOptionVotes = votingData;
            var _arrUsers = [];
            //$scope.eventUsers.push({ user_id: $scope.userId, event_id: $scope.eventId, role_id: $scope.eventDetail.role_id });
            _.each($scope.eventUsers, function (_user) {
                var _obj = {
                    user_id: _user.user_id,
                    event_id: $scope.eventId,
                    role_id: _user.role_id
                }
                _arrUsers.push(_obj);
            });
            _arrUsers.push({ user_id: $scope.userId, event_id: $scope.eventId, role_id: $scope.eventDetail.role_id });
            obj.eventUsers = _arrUsers;
        } else {
            obj.eventUsers = [];
            obj.eventDetail = [];
            var votingData = $scope.getVotingData();
            obj.userOptionVotes = votingData;
        }

        $http.post(base_url + '/events/saveEventUserAndVotingInformation/' + $scope.eventId + "/" + $scope.userId + "/" + $scope.eventDetail.role_name, obj)
            .success(function (data) {
                alert("Event Updated successfully");
                $location.path("/Events");
            })
    };

    $scope.getVotingData = function () {
        var _arr = [];
        _.each($scope.eventOptions, function (option) {
            if (option.isSelected) {
                var _obj = {
                    option_id: option.id,
                    user_id: $scope.userId,
                    event_id: $scope.eventId
                }
                _arr.push(_obj);
            }
        });
        return _arr;
    };

    $scope.goBack = function () {
        $location.path("/Events");
    }

    init();


    $scope.sendMessage = function(event) {

        event.preventDefault();
        console.log($scope.chatMessage);
        socket.emit('send message', $scope.chatMessage);
        
        $scope.chatMessage = "";
    }

    socket.on('new message', function (data) {
        // alert("Running Before");
        $scope.$apply(function() {
            $scope.messages.push(data.msg);
         });
    });

});