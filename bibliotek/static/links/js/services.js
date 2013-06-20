angular.module('linksServices', ['ngResource']).
    factory('Link', function($resource){
        return $resource('/api/links/:id', {id:'@id'}, {
            update: {method:'PUT', params: {}},
            query: {method:'GET', params:{id:''}, isArray:false},
        });
    });
