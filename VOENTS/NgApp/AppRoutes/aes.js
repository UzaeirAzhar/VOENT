var utils = angular.module('VOENTS');

//utils.constant("OidcTokenManager", OidcTokenManager);

//utils.constant('_', window._);

utils.factory('CryptoJS', function () {
    return window.CryptoJS; // assumes underscore has already been loaded on the page
});