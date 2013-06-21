var myApp = angular.module('linksApp', ['ngCookies', 'linksServices']).
    config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/', {templateUrl: '/static/links/partials/links-list.html', controller: LinkListCtrl}).
        when('/add', {templateUrl: '/static/links/partials/add.html', controller: LinkAddCtrl}).
        when('/edit/:linkId', {templateUrl: '/static/links/partials/edit.html', controller: LinkEditCtrl}).
        otherwise({redirectTo: '/'});
}]);

myApp.directive('fadey', function() {
    return {
        restrict: 'A',
        link: function(scope, elm, attrs) {
            jQuery(elm)
                .css({ opacity: 0 })
                .animate({ opacity: 1 }, parseInt(attrs.fadey));
        }
    };
});
