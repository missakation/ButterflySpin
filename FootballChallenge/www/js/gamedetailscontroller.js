
angular.module('football.controllers')

    .controller('GameDetailsController', function ($scope, $ionicPopup, $ionicLoading,$state, $stateParams, TeamStores, $timeout) {

        $scope.loadingphase = false;

        $scope.inviteplayer = function(key)
        {

        }

      /*  $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        //works
        $timeout(function () {

            try {

                TeamStores.GetMyTeams(function (leagues) {

                    $ionicLoading.hide();
                    $scope.test = leagues;

                    if (leagues.length == 0) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: 'No Available Stadiums'
                        });
                    }

                })

            }
            catch (error) {
                alert(error.message);
            }
        }, 2000)*/

        $scope.gotoadd = function()
        {
            $state.go("app.teamadd");
        }



    })


