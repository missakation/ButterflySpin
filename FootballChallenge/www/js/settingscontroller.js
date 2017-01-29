
angular.module('football.controllers')

    .controller('SettingsController', function ($scope,$state,$timeout,BookingStore, $ionicPopup, $ionicLoading) {


      /*  $timeout(function () {
            BookingStore.GetMyUpcomingBookings(function (leagues) {

                $ionicLoading.hide();
                $scope.test = leagues;
                $scope.$digest();

                if (leagues.length == 0) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'You still have no bookings'
                    });
                }


            });
        }, 2000);*/

        

        $scope.gosmsverifypage = function()
        {
            $state.go('app.settingssms');
        }


    })

    .controller('SettingsSmsController', function ($scope,$state,$timeout,BookingStore, $ionicPopup, $ionicLoading) {


        


    })