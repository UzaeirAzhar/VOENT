var EventModule = angular.module('EventControllerModule', []);
EventModule.controller("EventsController", function ($rootScope, $scope, $http, $location, $routeParams, _) {
    //console.log("Admin Controller initialised")

    $scope.app_settings = {};
    $scope.events = [];
    $scope.allEventTypesAndSubTypes = [];
    $scope.newEvent = false;
    $scope.isFormSubmit = false;
    $scope.eventForm = {};

    var user = null;
    var userId = 0;
    var init = function () {
        user = localStorage.getItem("user");
        userId = JSON.parse(user).id;
        $scope.getAllUsers();
        $scope.getAllRoles();
        $scope.getAllEventTypesAndSubTypes();
        $scope.getAllEvents();
        $scope.permissions = [{ user_id: "", role_id: "" }];
        $scope.options = [{ name: "", place: "", date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), time: "" }];
        var optionsMessage = "";
        $scope.getOrganizerRoleId();
        $scope.userId = userId;
    };

   
    // ------------------- USER ----------------------//
    $scope.toggleEventForm = function () {
        $scope.eventForm = {};
        if ($scope.newEvent) {
            $scope.newEvent = false;
            $scope.isFormSubmit = false;
            $scope.showErrorMessage = false;
        }
        else
            $scope.newEvent = true;
    };

    $scope.getAllEvents = function () {
        
        $http.get(base_url + '/events/getAllUserEvents/' + userId)
            .success(function (data, status, headers, config) {
                ////console.log(data);
                $scope.events = data.result;
            })
            .error(function (data, status, headers, config) {

            });
    };

    $scope.addNewEvent = function (isValid) {
        $scope.isFormSubmit = true;
        $scope.showErrorMessage = false;
        //alert(moment.utc($scope.eventForm.start_date).local().format());
        if (isValid) {
            if ($scope.eventForm.id) {
                var param = {
                    name: $scope.eventForm.name,
                    event_type: $scope.eventForm.event_type,
                    sub_type: $scope.eventForm.sub_type,
                    start_date: $scope.eventForm.start_date,
                    end_date: $scope.eventForm.end_date,
                    is_multi: $scope.eventForm.is_multi,
                    is_discussion_page: $scope.eventForm.is_discussion_page,
                    id: $scope.eventForm.id
                }
                console.log(JSON.stringify(param, null, 4));
                $http.put(base_url + "/events/updateUserEvent/" + $scope.eventForm.id, param).success(function (result) {
                    $scope.getAllEvents();
                    $scope.clearEventForm();
                    $scope.isFormSubmit = false;
                    $scope.newEvent= false;
                    $scope.eventForm.id = null;
                    $scope.permissions = [{ user_id: "", role_id: "" }];
                    $scope.options = [{ name: "", place: "", date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), time: "" }];
                    var optionsMessage = "";
                }).error(function (error, status, headers, config) {
                    ;
                });
            } else {
                var param = {};
                var event = {
                    name: $scope.eventForm.name,
                    event_type: $scope.eventForm.event_type,
                    sub_type: $scope.eventForm.sub_type,
                    start_date: $scope.start_date.value,
                    end_date: $scope.eventForm.end_date,
                    is_multi: $scope.eventForm.is_multi,
                    is_discussion_page: $scope.eventForm.is_discussion_page
                }
                param.event = event;

                //console.log($scope.users);
                //console.log($scope.roles);
                filterPermissions();

                filterOptions();
                
                param.user_permissions = $scope.permissions;

                param.options = $scope.options;
                
                console.log(param);
                $http.post(base_url + '/events/createNewEvent/' + userId + "/" + $scope.organizerRoleId, param)
                    .success(function (data, status, headers, config) {
                        ////console.log(data);
                        $scope.getAllEvents();
                        $scope.clearEventForm();
                        $scope.newEvent = false;
                        $scope.isFormSubmit = false;
                        $scope.showErrorMessage = false;
                        $scope.permissions = [{ user_id: "", role_id: "" }];
                        $scope.options = [{ name: "", place: "", date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), time: "" }];
                        var optionsMessage = "";
                    })
                    .error(function (error, status, headers, config) {
                    });
            }
        }
        //else
        ////console.log("InValid");
    };

    function filterPermissions() {
        if ($scope.permissions.length > 0) {
            angular.forEach($scope.permissions, function (permission, index) {
                if (!permission.user_id || !permission.role_id) {
                    $scope.permissions.splice(index, 1);
                }
            });
        }
    }


    $scope.getDateAndTime = function (utcDate) {
        return moment(new Date(utcDate)).format('YYYY-MM-DD h:mm:ss');
    }

    function filterOptions() {
        if ($scope.options.length < 2) {
            $scope.optionsMessage = "At least 2 options should be added.";
        } else if ($scope.permissions.length > 2) {
            angular.forEach($scope.options, function (option, index) {
                if (!option.name) {
                    $scope.options.splice(index, 1);
                }
            });
            if ($scope.options.length < 2) {
                filterOptions();
            }
        }
    }

    var arrUserRoles = [];
    function populateUserRoles() {
        arrUserRoles = [];
        angular.forEach($scope.users, function (user) {
            $('input[userId="' + user.id + '"]').each(function (i, elem) {
                var userRoles = {};
                if (Boolean($(elem).attr('rolechecked'))) {
                    userRoles.user_id = $(elem).attr('userId');
                    userRoles.role_id = $(elem).attr('roleId');
                    arrUserRoles.push(userRoles);
                }
            });
        });
    };

    
    $scope.addNewPermission = function () {
        if ($scope.permissions.length > 0) {
            var issueFound = true;
            _.each($scope.permissions, function (permission) {
                if (permission.user_id && permission.role_id) {
                    issueFound = false;
                } else {
                    issueFound = true;
                }
            });
            if (!issueFound) {
                $scope.permissions.push({ user_id: "", role_id: "" });
            } else {
                alert("Please fill above records to continue.");
            }
        } else {
            $scope.permissions.push({ user_id: "", role_id: "" });
        }
    };

    $scope.deletePermission = function () {
        $scope.permissions.splice(index, 1);
    };


    $scope.addNewOption = function (index) {
        if ($scope.options[index].name) {
            $scope.options.push({ name: "", place: "", date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), time: "" });
        } else {
            alert("Please fill above records to continue.");
        }
    };

    $scope.deleteOption = function (index) {
        if ($scope.options.length > 2) {
            $scope.options.splice(index, 1);
        } else {
            alert("At least there should be two records in Voting Options table.");
        }
    }

    $scope.getAllEventTypesAndSubTypes = function () {
        $http.get(base_url + '/events/getEventTypeAndSubTypes')
            .success(function (data, status, headers, config) {
                console.log("Hello"+data);
                $scope.allEventTypesAndSubTypes = data;

                $scope.types = data.result.types;
                $scope.subTypes = data.result.subTypes;

                console.log($scope.types);
                console.log($scope.subTypes);

                $scope.isFormSubmit = false;
            })
            .error(function (data, status, headers, config) {

            });
    };

    $scope.changeSubTypes = function () {
        $scope.selectedSubTypes = [];
        _.each($scope.subTypes, function (subType) {
            if (subType.event_type_id === $scope.eventForm.event_type) {
                $scope.selectedSubTypes.push(subType);
            }
        });
    };

    

    $scope.clearEventForm = function () {
        $scope.eventForm.name = "";
        $scope.eventForm.event_type = "";
        $scope.eventForm.sub_type = "";
        $scope.eventForm.start_date = "";
        $scope.eventForm.end_date = "";
        $scope.eventForm.is_multi = "";
        $scope.eventForm.is_discussion_page = "";
    };

    $scope.getAllUsers = function () {
        
            /// getAllOtherUsers /:userId
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


    $scope.getOrganizerRoleId = function () {
        $http.get(base_url + '/users/getOrganizerRoleId')
            .success(function (data, status, headers, config) {
                ////console.log(data);
                //$scope.roles = data.result;
                $scope.organizerRoleId = data.result.id;
            })
            .error(function (error, status, headers, config) {
            });
    }

    init();

    $scope.start_date = {
        value: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes())
    };


    //Event Detail Controller methods goes here... 




});