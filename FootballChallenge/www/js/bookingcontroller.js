
angular.module('football.controllers')

    .controller('BookingController', function ($scope, $timeout,BookingStore, $ionicPopup, $ionicLoading) {

        $scope.tabs =
            {
                Current: false,
                Previous: false
            }

       $scope.status =
             {
                 Current: "solid",
                 Previous: "none"
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

                    $scope.status.Current= "none";
                    $scope.status.Previous= "none";

                    $scope.status.Current= "solid";
                    break;

                case 2:
                     $scope.tabs.Previous = true;
                     $scope.tabs.Current = false;

                     $scope.status.Current= "none";
                     $scope.status.Previous= "none";

                     $scope.status.Previous= "solid";

                    break;
        }
        }


    })
