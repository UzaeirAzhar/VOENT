var utils = angular.module('EventManagerModule');

//utils.constant("OidcTokenManager", OidcTokenManager);

//utils.constant('_', window._);

utils.factory('_', function () {
    return window._; // assumes underscore has already been loaded on the page
});