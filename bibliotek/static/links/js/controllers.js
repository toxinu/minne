function LinkListCtrl($scope, $http, Link) {
    $scope.refresh = function(page) {
        if (page) {
            $scope.links = [];
            $scope.currentPage = 1;
            for (var i=0;i<=page;i++)
                $scope.loadMore();
            $scope.inSearch = false;
        } else {
            Link.query(function(data) {
                $scope.links = data.results;
                delete data.results;
                $scope.info = data;
                $scope.currentPage = 1;
                $scope.inSearch = false;
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
                $scope.indexModified = true;
            });
        });
    }

    $scope.search = function(terms) {
        var search = function() {
            var res = $scope.index.search(terms);
            // Reset scope.links
            $scope.links = [];
            for (var i=0;i<res.length;i++) {
                console.log(res[i])
                $scope.links.push($scope.indexLookup[res[i].ref]);
            }
            console.log('Results : ' + res);
            $scope.info.count = res.length;
        }

        if (!terms) {
            $scope.refresh();
            return
        }

            $scope.inSearch = true;
        if (!$scope.index || $scope.indexModified)
            $scope.getIndex(search);
        else
            search();

    }

    $scope.$on('add', function(event, data) {
        $scope.links.unshift(data);
        $scope.links.pop();
        $scope.info.count = $scope.info.count + 1;
        $scope.indexModified = true;
    });

    $scope.getIndex = function(callback) {
        $scope.index = lunr(function () {
            this.field('title')
            this.field('url')
            this.field('tags')
            this.field('added')

            this.ref('id')
        });

        $http.get('/api/links/search').success(function(data) {
            for (var i=0;i<data.length;i++) {
                $scope.index.add(data[i]);
            }
            // Create lookup
            $scope.indexLookup = {};
            for (var i=0;i<data.length;i++)
                $scope.indexLookup[data[i].id] = data[i];

            if (callback)
                return callback();
        });

    }

    $scope.refresh();
    $scope.indexModified = false;
    $scope.inSearch = false;
}

function LinkAddCtrl($scope, $http, Link, showAlert) {
    $scope.addLink = function(url, title, tags) {
        var link = new Link();
        link.url = url;
        link.title = title;
        link.tags = tags;
        console.log(link.url, link.title, link.tags)
        link.$save(function(data) {
            $scope.$emit('add', data);
            document.getElementById('add-link').reset();
        }, function(data) {
            if (data.status === 400) {
                var keys = Object.keys(data.data);
                var message = "";
                for (var i=0;i<keys.length;i++) {
                    message = message + " " + keys[i].titleize() + " : " + data.data[keys[i]];
                }
                showAlert(message, 'error', 4000);
            } else if (data.status !== 200) {
                showAlert('Error ' + data.status, 'error', false);
            }
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
