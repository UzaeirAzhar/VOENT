var EventModule = angular.module('EventControllerModule');
EventModule.controller("EventGraphController", function ($rootScope, $scope, $http, $location, $routeParams, _) {


    var init = function () {
        $scope.labels = [];
        $scope.data = [];
        $scope.eventId = $routeParams.votingEventId;
        $scope.getGraphData($scope.eventId);
        $scope.loadEventDetails($scope.eventId);
        $scope.labels = [];
        $scope.data = [[],[]];
    };

    $scope.loadEventDetails = function (eventId) {
        $http.get(base_url + "/events/getEventOnlyDetails/" + eventId)
            .success(function (data, status, headers, config) {
                $scope.eventName = data.result[0].name;
            });
    };


    $scope.getGraphData = function (eventId) {
        $http.get(base_url + "/events/getEventVoteGraph/" + eventId)
            .success(function (data) {
                $scope._data = data.result;
                $scope.popluateGraph();
                
            });
    };

    $scope.popluateGraph = function () {
        $scope.labels = [];
        $scope.data = [];
        var _arr = [];
        _.each($scope._data, function (vote) {
            $scope.labels.push(vote.label);
            _arr.push(vote.data);
        });
        $scope.data.push(_arr);
    }

    init();
});