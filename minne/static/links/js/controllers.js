function LinkListCtrl($scope, $http, $location, Link) {
    $scope.refresh = function(page) {
        if (page && $scope.info.next) {
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
            }, function(data) {
                if (data.status === 403 || data.status === 401)
                    window.location = '/login';
            });
        }
    }

    $scope.loadMore = function(){
        if ($scope.info.next) {
            Link.query({page:$scope.currentPage+1}, function(data){
                $scope.currentPage = $scope.currentPage + 1;
                $scope.links = $scope.links.concat(data.results);
                delete data.results;
                $scope.info = data;
            }, function(data) {
                if (data.status === 403 || data.status === 401)
                    window.location = '/login';
            });
        }
    };

    $scope.remove = function(linkIndex) {
        var linkId = $scope.links[linkIndex].id;
        $scope.info.count = $scope.info.count - 1;

        $scope.links.splice(linkIndex, 1);

        if ($scope.info.count <= 30)
            $scope.info.next = false;

        Link.delete({id: linkId}, function() {
            if ($scope.info.next) {
                Link.query({page:$scope.currentPage}, function(data) {
                    $scope.links.push(data.results[data.results.length-1]);
                    $scope.indexModified = true;
                }, function(data) {
                if (data.status === 403 || data.status === 401)
                    window.location = '/login';
                });
            }
        });
    }

    $scope.search = function(terms) {
        var search = function() {
            var termsArray = terms.trim().split(/\s+/);
            // Reset scope.links
            $scope.links = [];
            $scope.info.count = 0;
            for (var i=0;i<termsArray.length;i++) {
               var term = termsArray[i];
               var res = $scope.index.search(term);
               for (var ii=0;ii<res.length;ii++) {
                   if ($scope.links.indexOf($scope.indexLookup[res[ii].ref]) != -1)
                       $scope.links.push($scope.indexLookup[res[ii].ref]);
               }
               $scope.info.count = $scope.info.count + res.length; 
            }
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
        console.log($scope.currentPage)
        if ($scope.links.length > 30 && $scope.currentPage == 1) {
            $scope.info.next = true;
            $scope.links.pop();
        }
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
        }).error(function(data) {
            if (data.status === 403 || data.status === 401)
                window.location = '/login';
        });
    }

    $scope.refresh();
    $scope.indexModified = false;
    $scope.inSearch = false;
    document.getElementById('nav-bar').className = "affix";
}

function ImportCtrl($scope, $rootScope) {
}

function LinkAddCtrl($scope, $http, $location, Link, showAlert) {
    var defaultForm = {
        url: '',
        title: '',
        tags: ''
    }

    $scope.resetForm = function() {
        document.getElementById('add-link').reset();
        $scope.form = defaultForm;
    }

    $scope.addLink = function(url, title, tags, redirect) {
        var link = new Link();
        link.url = url;
        link.title = title;
        link.tags = tags;
        $scope.resetForm();

        link.$save(function(data) {
            if (redirect)
                $location.path('/#/');
            $scope.$emit('add', data);
        }, function(data) {
            if (data.status === 400) {
                var keys = Object.keys(data.data);
                var message = "";
                for (var i=0;i<keys.length;i++) {
                    message = message + " " + keys[i].titleize() + " : " + data.data[keys[i]];
                }
                showAlert(message, 'error', 4000);
            } else {
                if (data.status === 403 || data.status === 401)
                    window.location = '/login';
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
        $scope.link.$update(function(data) {
            $location.path('/');
        }, function(data) {
            if (data.status === 403 || data.status === 401)
                window.location = '/login';
        });
    }
    $scope.cancel = function() {
        $location.path('/');
    }
}
