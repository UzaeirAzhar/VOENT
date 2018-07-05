var LoginModule = angular.module('LoginControllerModule', []);


LoginModule.controller("LoginController", function ($rootScope, $scope, $http, $location, _, $interval) {
    $scope.arrIntervals = [];
    //console.log("Login Controller initialised");
    console.log("Hello there in login controller");
    $scope.userGender = "Male";

    //$rootScope.isLoggedIn = false;
    $scope.authenticate = function (isvalid) {
        $scope.isFormSubmit = true;
        if (isvalid) {
            var credentials = { email: $scope.loginForm.email, password: $scope.loginForm.password };
            console.log("hello there is base url " + base_url)
            $http.post(base_url + "/users/authenticate", credentials)
                .success(function (data) {
                    if (data) {
                        if (data.status) {
                            $scope.isValidCredentials = true;
                            localStorage.setItem("user_authenticated", "true");
                            localStorage.setItem("user", JSON.stringify(data.result));

                            $location.path("/Events");
                            $scope.objUser = JSON.parse(localStorage.getItem("user"));


                            //localStorage.setItem("notifications", data.result.notifications.length);
                            //Move user to Events page. And add the Event Crud there. 
                        }

                    }
                }).error(function (error) {
                    if (error && error.message === "ACCOUNT_INACTIVE") {
                        $scope.isAccountInactive = true;
                        $scope.message = "Your account has been deactivated. Please contact admin for this.";
                    } else {
                        //alert("error " + error);
                        $scope.isValidCredentials = false;
                        $scope.message = "Invalid Credentials";
                    }
                });
        }
    };



    $scope.cancelSignUp = function(){
        $location.path("/Login");
    }
    $scope.addNewUser = function (isValid) {
        $scope.isFormSubmit = true;
        $scope.showErrorMessage = false;
        if (isValid) {
            var param = {
                name: $scope.userForm.name,
                password: $scope.userForm.password,
                email: $scope.userForm.email,
                address: $scope.userForm.address,
                gender: $scope.userForm.gender,
                phone: $scope.userForm.phone
            }

            console.log("Hi");
            console.log(param);
            $http.post(base_url + '/users/addNewUser', param)
                .success(function (data, status, headers, config) {
                    ////console.log(data);
                    $scope.newUser = false;
                    $scope.isFormSubmit = false;
                    $scope.showErrorMessage = false;
                    alert("User created successfully. You will be redirected to Login page to continue.");
                    $location.path("/Login");
                })
                .error(function (error, status, headers, config) {
                    $scope.showErrorMessage = true;
                    if (error.message == "User with this username already exist.") {
                        $scope.messageUsername = error.message;
                        $scope.messageEmail = "";
                    } else if (error.message == "User with this email already exist.") {
                        $scope.messageEmail = error.message;
                        $scope.messageUsername = "";
                    }

                });

        }
        //else
        ////console.log("InValid");
    };

    $scope.getUserInformation = function () {
        $scope.objUser = JSON.parse(localStorage.getItem("user"));
        console.log($scope.objUser);
    };

    $scope.logOut = function () {
        //$scope.arrIntervals = [];
        ////console.log("LogOut")
        $location.path("/");
        //$rootScope.isLoggedIn = false;
        localStorage.removeItem("user_authenticated");// .setItem("user_authenticated","true");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user");
    };
});