angular.module('myApp.services', ['ngResource'])
    .factory('Link', function($resource){
        return $resource('/api/links/:id', {id:'@id'}, {
            update: {method:'PUT', params: {}},
            query: {method:'GET', params:{id:''}, isArray:false},
        })
    })
    .factory('showAlert', ['$rootScope', '$timeout', '$compile', function($rootScope, $timeout, $compile) {
        return function(message, level, timeout){
            var alert = $compile('<alert message="' + message + '" level="' + level + '" timeout="' + timeout + '"></alert>')($rootScope);
            angular.element(document.getElementById('notifications')).append(alert);
        }
    }])
