
angular.module('football.controllers')

    .controller('BookingController', function ($scope, $timeout,BookingStore, $ionicPopup, $ionicLoading) {

        $scope.tabs =
            {
                Current: false,
                Previous: false
            }
        $scope.notloaded = true;



        $timeout(function () {
            BookingStore.GetMyUpcomingBookings(function (leagues) {
                
                $scope.bookings = leagues;
                $scope.tabs.Current = true;
                $scope.notloaded = false;
                $scope.$apply();
            });
        }, 2000);

        $scope.deletebooking = function()
        {
            
        }

        $scope.switchscreens = function(x)
        {
            switch (x) {
                case 1:
                    $scope.tabs.Current = true;
                    $scope.tabs.Previous = false;
                    break;

                case 2:
                     $scope.tabs.Previous = true;
                     $scope.tabs.Current = false;

                    break;
        }
        }


    })
