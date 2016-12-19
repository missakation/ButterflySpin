
angular.module('football.controllers')

    .controller('BookingController', function ($scope, $timeout,BookingStore, $ionicPopup, $ionicLoading) {

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $timeout(function () {
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
        }, 2000);

        $scope.deletebooking = function()
        {
            
        }


    })
