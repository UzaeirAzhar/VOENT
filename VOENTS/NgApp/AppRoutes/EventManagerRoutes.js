var routes = angular.module('EventManagerModule', [
    'ngRoute'
    , 'LoginControllerModule'
    , 'mgo-angular-wizard'
    , 'angular-carousel'
    , "chart.js"
    , "angular-loading-bar"
    , 'ui.bootstrap'
    , 'ui.bootstrap.accordion'
    , 'mgcrea.ngStrap'
    , 'EventControllerModule'
]);

routes
    .config(["$routeProvider", function ($routeProvider) {
        return $routeProvider
            .when("/", {
                templateUrl: "NgApp/Login/Views/Login.html",
                controller: "LoginController"
            }).when("/Events", {
                templateUrl: "NgApp/Event/Views/ManageEvents.html",
                controller: "EventsController",
                label: "Events"
            }).when("/EventViewer/:userId/:eventId", {
                templateUrl: "NgApp/Event/Views/EventViewer.html",
                controller: "EventDetailController",
            }).when("/EventVoteGraph/:votingEventId", {
                templateUrl: "NgApp/Event/Views/EventVoteGraph.html",
                controller: "EventGraphController",
            }).when("/Login", {
                templateUrl: "NgApp/Login/Views/Login.html",
                controller: "LoginController"
            }).when("/Signup", {
                templateUrl: "NgApp/Login/Views/Signup.html",
                controller: "LoginController"
            });
    }])
    .run(function ($rootScope, $location, _) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            var isUserAuthenticated = localStorage.getItem("user_authenticated"); //so far getting null value to check the login navigation.
            var userObj = JSON.parse(localStorage.getItem("user"));

            if (!isUserAuthenticated && next.originalPath !== "/Signup") {
                $rootScope.isAuthenticated = false;
                $location.path("/Login");
            } else if (!isUserAuthenticated && next.originalPath === "/Signup") {
                $location.path(next.originalPath);
            } else {
                if (!next || !next.originalPath || next.originalPath === "/Login" || next.originalPath === "/") {
                    //console.log("userRole.toLowerCase() " + userRole.toLowerCase());
                    $location.path("/Events");
                } else {
                    if (next && next.params && next.params.userId && next.params.eventId) {
                        $location.path("/EventViewer/" + next.params.userId + "/" + next.params.eventId);
                    } else if (next && next.params && next.params.votingEventId) {
                        $location.path("/EventVoteGraph/" + next.params.votingEventId);
                    } else {
                        $location.path(next.originalPath);
                    }
                    
                    
                }

                $rootScope.isAuthenticated = true;
                $rootScope.userFullName = null;
                //If user is admin then take

            }
        });
    })
    .config(function ($datepickerProvider) {
        ////console.log("In datepicker config " + $rootScope.testVar);
        angular.extend($datepickerProvider.defaults, {
            //dateFormat: 'yyyy-MM-dd',
            startWeek: 1,
            maxDate: new Date()
        });
    })

    .factory('focus', function ($timeout, $window) {
        return function (id) {
            // timeout makes sure that it is invoked after any other event has been triggered.
            // e.g. click events that need to run before the focus or
            // inputs elements that are in a disabled state but are enabled when those events
            // are triggered.
            $timeout(function () {
                var element = $window.document.getElementById(id);
                if (element)
                    element.focus();
            });
        };
    })
    .directive('focus', function ($timeout) {

        return {

            scope: {

                trigger: '@focus'

            },

            link: function (scope, element) {

                scope.$watch('trigger', function (value) {

                    if (value === "true") {

                        $timeout(function () {

                            element[0].focus();

                        });
                    }
                });
            }

        };

    });

routes.factory('VOENTInterceptorService',
    ['$rootScope', '$location',
        function ($rootScope, $location) {

            var cafeInterceptorServiceFactory = {};

            var _request = function (config) {

                config.headers = config.headers || {};



                var userID = localStorage.user_id;

                if (userID) {
                    config.headers['Authorization'] = String(userID);
                }
                return config;
            };

            var _response = function (response) {
                if (response && response.data.license_valid !== null && response.data.license_valid !== undefined && response.data.license_valid === false) {
                    localStorage.clear();
                    $location.path("/Login");
                };

                return response;
            };

            cafeInterceptorServiceFactory.response = _response;
            cafeInterceptorServiceFactory.request = _request;


            return cafeInterceptorServiceFactory;
        }]).directive('numbersOnly', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attr, ngModelCtrl) {
                    function fromUser(text) {
                        if (text) {
                            var transformedInput = text.replace(/[^0-9.]/g, '');

                            if (transformedInput !== text) {
                                ngModelCtrl.$setViewValue(transformedInput);
                                ngModelCtrl.$render();
                            }
                            return Number(transformedInput);
                        }
                        return undefined;
                    }
                    ngModelCtrl.$parsers.push(fromUser);
                }
            };
        });

routes.config(function ($httpProvider) {
    $httpProvider.interceptors.push('VOENTInterceptorService');
});

routes.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        console.log("called");
                        scope.fileread = loadEvent.target.result;
                        // alert(scope.fileread);


                        console.log("scope.fileread " + scope.fileread);
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]).directive("", [function () {
    return {
        restrict: 'EA',
        template:
        '<ul class="star-rating" ng-class="{readonly: readonly}">' +
        '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
        '    <i class="fa fa-star"></i>' + // or &#9733
        '  </li>' +
        '</ul>',
        scope: {
            ratingValue: '=ngModel',
            max: '=?', // optional (default is 5)
            onRatingSelect: '&?',
            readonly: '=?'
        },
        link: function (scope, element, attributes) {
            if (scope.max == undefined) {
                scope.max = 5;
            }
            function updateStars() {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };
            scope.toggle = function (index) {
                if (scope.readonly == undefined || scope.readonly === false) {
                    scope.ratingValue = index + 1;
                    scope.onRatingSelect({
                        rating: index + 1
                    });
                }
            };
            scope.$watch('ratingValue', function (oldValue, newValue) {
                if (newValue) {
                    updateStars();
                }
            });
        }
    }
}]);

