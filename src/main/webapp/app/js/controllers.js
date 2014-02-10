var podcastControllers = angular.module('podcastControllers', []);

podcastControllers.controller('ItemsListCtrl', function ($scope, $http, $routeParams, Restangular) {
    /*Restangular.one("item/pagination").get({size: 12, page :0, direction : 'DESC', properties : 'pubdate'}).then(function(itemsResponse) {
        $scope.items = itemsResponse.content;

        $scope.totalItems = itemsResponse.totalElements;
        $scope.currentPage = itemsResponse.number+1;
        $scope.itemsperpage = 12;
        $scope.maxSize = 10;
    });
    */

    //$scope.selectPage = function (pageNo) {
    $scope.$watch('currentPage', function(newPage){
        Restangular.one("item/pagination").get({size: 12, page :newPage-1, direction : 'DESC', properties : 'pubdate'}).then(function(itemsResponse) {
            $scope.items = itemsResponse.content;

            $scope.totalItems = itemsResponse.totalElements;
            $scope.maxSize = 10;
        });
    });
    $scope.currentPage = 1;

    $scope.download = function(item) {
        $http.get('/api/item/' + item.id + "/addtoqueue");
    }

});

podcastControllers.controller('ItemDetailCtrl', function ($scope, $routeParams, $http, Item) {
    $scope.item = Item.get({itemId: $routeParams.itemId});

    $scope.download = function() {
        $http.get('/api/item/' + $routeParams.itemId + "/addtoqueue");
    }
});

podcastControllers.controller('PodcastsListCtrl', function ($scope, $http, Restangular) {
    Restangular.all("podcast").getList().then(function(podcasts) {
        $scope.podcasts = podcasts;
    });
});

podcastControllers.controller('PodcastDetailCtrl', function ($scope, $http, $routeParams, Restangular) {
    //$scope.podcast = Podcast.get({podcastId: $routeParams.podcastId});
    Restangular.one("podcast", $routeParams.podcastId).get().then(function(data) {
        $scope.podcast = data;
    });


    $scope.download = function(item) {
        $http.get('/api/item/' + item.id + "/addtoqueue");
    }
    $scope.remove = function(item) {
        Restangular.one("item", item.id).remove().then(function() {
            $scope.podcast.items = _.reject($scope.podcast.items, function(elem) {
                return (elem.id == item.id);
            });
        });
    }
    $scope.refresh = function() {
        $http.post("/api/task/updateManager/updatePodcast/force", $scope.podcast.id).success(function() {
            $scope.podcast.get().then(function(podcast) {
                $scope.podcast.items = podcast.items;
            });
        });
    }
    $scope.goToRSS = function() {
        $http.post("/api/task/updateManager/updatePodcast/force", $scope.podcast.id);
    }
    $scope.save = function() {
        var podcastToUpdate = _.cloneDeep($scope.podcast);
        podcastToUpdate.items = null;
        $scope.podcast.patch(podcastToUpdate);
    }
});

podcastControllers.controller('DownloadCtrl', function ($scope, $http, $routeParams, Restangular, $interval) {
    $scope.items = Restangular.all("task/downloadManager/downloading").getList().$object;
    $scope.waitingitems = Restangular.all("task/downloadManager/queue").getList().$object;
    Restangular.one("task/downloadManager/limit").get().then(function(data) {
        $scope.numberOfSimDl = parseInt(data);
    });

    $scope.updateNumberOfSimDl = function() {
        $http.post("/api/task/downloadManager/limit",$scope.numberOfSimDl);
    }

    /** Spécifique aux éléments de la liste : **/
    $scope.stopDownload = function(item) {
        $http.post("/api/task/downloadManager/stopDownload", item.id);
    }
    $scope.toggleDownload = function(item) {
        $http.post("/api/task/downloadManager/toogleDownload", item.id);
    }

    /** Global **/
    $scope.stopAllDownload = function() {
            $http.get("/api/task/downloadManager/stopAllDownload");
    }
    $scope.pauseAllDownload = function() {
            $http.get("/api/task/downloadManager/pauseAllDownload");
    }
    $scope.restartAllCurrentDownload = function() {
            $http.get("/api/task/downloadManager/restartAllCurrentDownload");
    }

    var refreshIntervalId = $interval(function() {

        //$scope.items = Restangular.all("task/downloadManager/downloading").getList().$object;
        Restangular.all("task/downloadManager/downloading").getList().then(function(items) {
            // Mise à jour des provenant de la nouvelle liste :
            items.forEach(function(item, key, collection) {
                var itemToUpdate = _.find($scope.items, {'id' : item.id});
                if (itemToUpdate != null) {
                    itemToUpdate.progression = item.progression;
                    itemToUpdate.isUpdate = true;
                } else {
                    item.isUpdate = true;
                    $scope.items.push(item);
                }
            });

            $scope.items.forEach(function(item, key, collection) {
                if (!item.hasOwnProperty("isUpdate")) {
                    $scope.items.splice(key, 1);
                } else {
                    delete item.isUpdate;
                }
            });
        });


        $scope.waitingitems = Restangular.all("task/downloadManager/queue").getList().$object;

        //TODO : Use Lo-Dash to update the models
    }, 3000);

    $scope.$on('$destroy', function () {
        $interval.cancel(refreshIntervalId);
    });
});