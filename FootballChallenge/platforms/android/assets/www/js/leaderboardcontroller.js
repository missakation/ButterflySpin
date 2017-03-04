
angular.module('football.controllers')



    .controller('LeaderboardController', function ($scope, $timeout, LeaderBoardStore, $state, $ionicPopup, $ionicLoading, $ionicPopover) {

        $scope.notloaded = true;

            LeaderBoardStore.GetLeaderboard(function (leagues) {

                $scope.notloaded = false;
                $scope.rankedteams = leagues;
                $scope.$apply();
            })
        


        $scope.goteamprofile = function (id) {
            if (id !== null || id == '' || id === undefined) {
                $state.go("app.teamprofile",
                    {
                        teamid: id
                    })
            }

        }

    })

