
angular.module('football.controllers')



    .controller('LeaderboardController', function ($scope, $timeout, LeaderBoardStore, $state, $ionicPopup, $ionicLoading, $ionicPopover) {

        $scope.notloaded = true;
        $scope.limit = 10;
        $scope.limitfinished = true;
        $scope.rankedteams = [];

        $scope.goteamprofile = function (id) {
            if (id !== null || id == '' || id === undefined) {
                $state.go("app.teamprofile",
                    {
                        teamid: id
                    })
            }

        }

        $scope.refreshpage = function (limit) {

            LeaderBoardStore.GetLeaderboard(limit, function (leagues) {

                
                $scope.notloaded = false;
                $scope.rankedteams = leagues;
                $scope.$apply();

                $scope.$broadcast('scroll.infiniteScrollComplete');

                if ($scope.rankedteams.length < limit) {
                    $scope.limitfinished = false;
                }

            })
        }

        $scope.loadMore = function () {
            $scope.limit += 10;
            $scope.refreshpage($scope.limit);
            $scope.$apply();
        }

        $scope.refreshpage($scope.limit);

    })

