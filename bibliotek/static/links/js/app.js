var myapp = angular.module('linksApp', ['myApp.services', 'myApp.directives', 'ngCookies']).
    config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/', {templateUrl: '/static/links/partials/links-list.html', controller: LinkListCtrl}).
        when('/add', {templateUrl: '/static/links/partials/add.html', controller: LinkAddCtrl}).
        when('/edit/:id', {templateUrl: '/static/links/partials/edit.html', controller: LinkEditCtrl}).
        otherwise({redirectTo: '/'});
}]);

angular.module('myApp.directives', [])
    .directive('fadey', function() {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs) {
                $(elm)
                    .css({ opacity: 0 })
                    .animate({ opacity: 1 }, parseInt(attrs.fadey));
            }
        }
    })
    .directive('alert', ['$timeout', function($timeout) {
        return {
            restrict: 'E',
            template: '<div class="alert alert-{{ level || \'warning\' }}"><button type="button" class="close" data-dismiss="alert">&times;</button>{{ message }}</div>',
            replace: true,
            scope: {
                message: '@',
                level: '@',
                timeout: '='
            },
            link: function(scope, element, attrs) {
                if(scope.timeout != false) {
                    var timeout = scope.timeout || 3000;
                    $timeout(function() {
                        element.remove();
                    }, timeout);
                }
            }
        }
    }])
