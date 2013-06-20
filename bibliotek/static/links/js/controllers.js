function LinkListCtrl($scope, $http, Link) {
    $scope.refresh = function() {
        Link.query(function(data) {
            $scope.links = data.results;
            delete data.results;
            $scope.info = data;

            $scope.currentPage = 1;
            $scope.pageSize = $scope.links.length;
        });
    }

    $scope.refresh();

    $scope.numberOfPages=function(){
        return Math.ceil($scope.info.count/$scope.pageSize);
    }

    $scope.remove = function(linkId) {
        Link.delete({linkId: linkId});
        $scope.refresh();
    }

    $scope.$on('add', function(event, data) {
        $scope.links.push(data);
    });
}

function LinkAddCtrl($scope, $http, $location, Link) {
    $scope.addLink = function(redirect) {
        var link = new Link();
        link.url = $scope.linkUrl;
        link.title = $scope.LinkTitle;
        link.tags = $scope.linkTags;
        link.$save();
    }
}

function LinkEditCtrl($scope, $http, $routeParams, $location, Link) {
    $scope.link = Link.get({id: $routeParams.linkId});

    $scope.edit = function() {
        $scope.link.url = $scope.link.url;
        $scope.link.title = $scope.link.title;
        $scope.link.tags = $scope.link.tags;
        console.log($scope.linkUrl);
        $scope.link.$update(function(data) {
            $location.path('/');
        });
    }
    $scope.cancel = function() {
        $location.path('/');
    }
}
