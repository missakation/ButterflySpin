
angular.module('football.controllers')

    .controller('stadiumcontroller', function ($scope, $ionicPopover, ReservationFact, $ionicPopup, $ionicLoading, $timeout, $state, $cordovaDatePicker) {


        $scope.notverified = false;

    /*        var user = firebase.auth().currentUser;

            if (user != null) {
                user.providerData.forEach(function (profile) 
                {
                    
                    if(user.emailVerified)
                    {
                         $scope.verified = false;
                    }
                    else
                    {
                        $scope.verified = true;
                    }
                });
            }
            else
            {
                $scope.verified = true;
            }
*/


        $scope.filter = {
            indoor: true,
            outdoor: true,
            clay: true,
            grass: true

        }
        $scope.choice = {
            sort: 'price'
        };
        $scope.tempchoice = {
            sort: 'price'
        };

        // .fromTemplate() method
        var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

        $scope.popover = $ionicPopover.fromTemplate(template, {
            scope: $scope
        });

        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('templates/my-popover.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });


        $scope.openPopover = function ($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function () {
            $scope.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.popover.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function () {
            // Execute action
            //scope.$digest();
            //alert($scope.choice)
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function () {
            // Execute action
        });




        //alert(TeamStore.GetAccountInfo().code);
        // set the rate and max variables
        $scope.rating = {};
        $scope.rating.rate = 3;
        $scope.rating.max = 5;

        $scope.readOnly = true;

        var freestadiums = [];

        //$scope.search.date = "2013-01-08";

        $scope.search = {
            date: new Date(),
        };
        $scope.search.date.setDate($scope.search.date.getDate() + 1);
        $scope.search.date.setHours(21);
        $scope.search.date.setMinutes(0);
        $scope.search.date.setMilliseconds(0);
        $scope.search.date.setSeconds(0);
        //alert($scope.search.date);

        $scope.allfreestadiums = [];


        $scope.checkfree = function () {

            //here
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            //here

            //works
            ReservationFact.FindFreeStadiums($scope.search, function (leagues) {

                $ionicLoading.hide();
                $scope.allfreestadiums = leagues;

                if (leagues.length == 0) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'No Available Stadiums'
                    });
                }

            })






        }

        $scope.checkfree();


        try {
            //  $scope.checkfree();
        }
        catch (error) {
            alert(error.message);
        }

        $scope.reserve = function (search, stadiums) {
            try {


                var confirmPopup = $ionicPopup.confirm({
                    title: 'Reserve Stadium',
                    template: 'Are you sure you want to reserve the stadium at ' + '<br>' + search.date.toLocaleString() + '</br>'
                });

                confirmPopup.then(function (res) {
                    if (res) {

                        ReservationFact.RegisterFreeStadiums($scope.search, "", stadiums)
                            .then(function (value) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: 'Successfully Reserved'
                                });
                                $scope.search = {
                                    date: new Date(),
                                };
                                $scope.search.date.setDate($scope.search.date.getDate() + 1);
                                $scope.search.date.setHours(21);
                                $scope.search.date.setMinutes(0);
                                $scope.search.date.setMilliseconds(0);
                                $scope.search.date.setSeconds(0);
                                //alert($scope.search.date);
                                $state.go("app.bookings");
                            }, function (error) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error',
                                    template: 'Stadium Not Available. Please Try Again'
                                });

                                alertPopup.then(function (res) {
                                    // Custom functionality....
                                });
                                //$scope.allfreestadiums.

                            })

                    } else {



                    }

                });

            }
            catch (error) {
                alert(error.message);
            }



            //$scope.allfreestadiums = freestadiums;

            //$ionicLoading.hide();

        }



      //  $scope.filter = {
      //      indoor: true,
      //      outdoor: true,
      //      clay: true,
      //      grass: true
      //
     //   }


        $scope.updatefilter = function()
        {
            $scope.closePopover();
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

           $scope.choice.sort =  $scope.tempchoice.sort  ;
           $ionicLoading.hide();

        //    $scope.allfreestadiums = $scope.allfreestadiums.filter(function (el) {
        //                return el.key !== team.key;
        //            });

        }

        $scope.cancelfilter = function()
        {
            $scope.closePopover();
        }


    })

    .controller('stadiumdetailscontroller', function ($scope, $stateParams, $ionicPopover, ReservationFact, $ionicPopup, $ionicLoading, $timeout, $state, $cordovaDatePicker) {

        //alert(JSON.stringify(firebase.database.ServerValue.TIMESTAMP));

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        //here

        //works
        

        $scope.doRefresh = function () {
            try {
                //works
                ReservationFact.GetStadiumsByID($stateParams.stadiumid, function (leagues) {
                    $ionicLoading.hide();
                    $scope.stadiums = leagues;
                    $scope.$apply();
                    $scope.$broadcast('scroll.refreshComplete');
                })
            }
            catch (error) {
                alert(alert.message);
            }


        }

        $scope.doRefresh();

        // onSuccess Callback
        // This method accepts a Position object, which contains the
        // current GPS coordinates
        //

        /*
        var onSuccess = function(position) {
            alert('Latitude: '          + position.coords.latitude          + '\n' +
                  'Longitude: '         + position.coords.longitude         + '\n' +
                  'Altitude: '          + position.coords.altitude          + '\n' +
                  'Accuracy: '          + position.coords.accuracy          + '\n' +
                  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                  'Heading: '           + position.coords.heading           + '\n' +
                  'Speed: '             + position.coords.speed             + '\n' +
                  'Timestamp: '         + position.timestamp                + '\n');
        };
    
        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        }
    
        navigator.geolocation.getCurrentPosition(onSuccess, onError);*/



    })
