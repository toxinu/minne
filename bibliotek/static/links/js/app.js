var app = angular.module('linksApp', ['ngCookies', 'linksServices']).
    config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/', {templateUrl: '/static/links/partials/links-list.html', controller: LinkListCtrl}).
        when('/add', {templateUrl: '/static/links/partials/add.html', controller: LinkAddCtrl}).
        when('/edit/:linkId', {templateUrl: '/static/links/partials/edit.html', controller: LinkEditCtrl}).
        otherwise({redirectTo: '/'});
}]);

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start;
        return input.slice(start);
    }
});
