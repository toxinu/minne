function LinkListCtrl($scope, $http, Link) {
    $scope.refresh = function(page) {
        if (page) {
            $scope.links = [];
            $scope.currentPage = 1;
            for (var i=0;i<=page;i++)
                $scope.loadMore();
        } else {
            Link.query(function(data) {
                $scope.links = data.results;
                delete data.results;
                $scope.info = data;
                $scope.currentPage = 1;
            });
        }
    }

    $scope.loadMore = function(){
        Link.query({page:$scope.currentPage+1}, function(data){
            $scope.currentPage = $scope.currentPage + 1;
            $scope.links = $scope.links.concat(data.results);
            delete data.results;
            $scope.info = data;
        });
    };

    $scope.remove = function(linkIndex) {
        var linkId = $scope.links[linkIndex].id;
        $scope.info.count = $scope.info.count - 1;

        $scope.links.splice(linkIndex, 1);

        Link.delete({id: linkId}, function() {
            Link.query({page:$scope.currentPage}, function(data) {
                $scope.links.push(data.results[data.results.length-1]);
            });
        });
    }

    $scope.search = function(terms) {
        var index = lunr(function () {
            this.field('title')
            this.field('tags')
            this.field('added')
        });
        $http.get('/api/links/search').success(function(data) {
            for (var i=0;i<=data.length;i++)
                console.log(data[i])
                index.add(data[i]);
                console.log(data[i]);
        });
        //console.log((index.search(terms)));
    }

    $scope.$on('add', function(event, data) {
        $scope.links.unshift(data);
        $scope.links.pop();
        $scope.info.count = $scope.info.count + 1;
    });

    $scope.refresh();
}

function LinkAddCtrl($scope, $http, $location, Link) {
    $scope.addLink = function(redirect) {
        var link = new Link();
        link.url = $scope.linkUrl;
        link.title = $scope.LinkTitle;
        link.tags = $scope.linkTags;
        link.$save(function(data) {
            $scope.$emit('add', data);
        });
    }
}

function LinkEditCtrl($scope, $http, $routeParams, $location, Link) {
    $scope.link = Link.get({id: $routeParams.id});

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
