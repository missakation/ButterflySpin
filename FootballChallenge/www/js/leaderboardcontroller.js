
angular.module('football.controllers')



    .controller('LeaderboardController', function ($scope, $timeout, LeaderBoardStore, $state, $ionicPopup, $ionicLoading, $ionicPopover) {

        $scope.notloaded = true;

        $timeout(function () {
            LeaderBoardStore.GetLeaderboard(function (leagues) {

                $scope.notloaded = false;
                $scope.rankedteams = leagues;
            })
        }, 2000);


        $scope.goteamprofile = function (id) {
            if (id !== null || id == '' || id === undefined) {
                $state.go("app.teamprofile",
                    {
                        teamid: id
                    })
            }

        }

    })

