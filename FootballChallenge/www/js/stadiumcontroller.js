
angular.module('football.controllers')
    .controller('stadiumcontroller', function ($scope, $ionicPopover, ReservationFact, $ionicPopup, $ionicLoading, $timeout, $state, $cordovaDatePicker, pickerView) {
        

        $scope.openPickerView = function openPickerView() {

            var picker = pickerView.show({
                titleText: '', // default empty string
                doneButtonText: 'Search', // dafault 'Done'
                cancelButtonText: 'Close', // default 'Cancel'
                items: [{
                    values: dateArrayThingy,
                    defaultIndex: 1
                }, {
                    values: [' 7:00 AM ', ' 7:30 AM ', ' 8:00 AM ', ' 8:30 AM ', ' 9:00 AM ', '9:30 AM ', ' 10:00 AM ', ' 10:30 AM', ' 11:00 AM ', ' 11:30 AM ', ' Noon ', ' 1:00 PM ', ' 1:30 PM ', ' 2:00 PM ', ' 2:30 PM ', ' 3:00 PM ', ' 3:30 PM ', ' 4:00 PM ', ' 4:30 PM ', ' 5:00 PM ', ' 5:30 PM ', ' 6:00 PM ', ' 6:30 PM ', ' 7:00 PM ', ' 7:30 PM ', ' 8:00 PM', ' 8:30 PM ', ' 9:00 PM ', ' 9:30 PM ', ' 10:00 PM ', ' 10:30 PM ', ' 11:00 PM', '11:30 PM ', ' Midnight ', ],
                    defaultIndex: 25
                }, {
                    values: [" 5 Vs 5", " 6 Vs 6", " 7 Vs 7", " 8 Vs 8", " 9 Vs 9", " 10 Vs 10", " 11 Vs 11"],
                    defaultIndex: 0
                }]
            });

            
            if (picker) {
                picker.then(function pickerViewFinish(output)
                {
                    if (output)
                    {
                        // output is Array type

                        $scope.search.date = new Date(output[0] + " " + output[1] + ", " +  (new Date()).getFullYear() );
                        console.log($scope.search.date);
                        $scope.search.text = output.join(" -");
                        $scope.checkfree();
                        //$scope.$digest();
                    }
                });
            }
        };

        $scope.notverified = false;

        $scope.nointernet = false;

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
            grass: true,
            money: 0

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


        $scope.slider6 = {
            minValue: 1,
            maxValue: 23,
            options: {
                floor: 0,
                showSelectionBar: true,
                readOnly: false,
                disabled: false,
                getSelectionBarColor: function (value) {
                    return 'darkgreen';
                },
                getPointerColor: function (value) {
                    return 'lightgrey';

                },
                ceil: 23,
                draggableRange: true

            }
        };

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
            text: "Tomorrow, 9:00PM - 5 Vs 5 "
        };
        $scope.search.date.setDate($scope.search.date.getDate() + 1);
        $scope.search.date.setHours(21);
        $scope.search.date.setMinutes(0);
        $scope.search.date.setMilliseconds(0);
        $scope.search.date.setSeconds(0);
        //alert($scope.search.date);
        $scope.allfreestadiums = [];


        $scope.checkfree = function () {

            console.log("ourish discks");
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
                $scope.globalstadiums = leagues;
                $scope.allfreestadiums = leagues;

                if (leagues.length == 0) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'No Available Stadiums'
                    });
                }


                /*get current location 



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

                        /*
                        var R = 6371e3; // metres
                        var φ1 = lat1.toRadians();
                        var φ2 = lat2.toRadians();
                        var Δφ = (lat2 - lat1).toRadians();
                        var Δλ = (lon2 - lon1).toRadians();

                        var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                            Math.cos(φ1) * Math.cos(φ2) *
                            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                        var d = R * c
                        */



            })






        }

        //$scope.checkfree();


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

                if (!$scope.nointernet) {


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

            }
            catch (error) {
                alert(error.message);
            }

        }


        $scope.updatefilter = function () {
            $scope.closePopover();
            $ionicLoading.show({
                content: 'Applying Filter',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            $scope.allfreestadiums = $scope.globalstadiums.filter(function (el) {

                return ((el.type.toLowerCase() == "indoor" && $scope.filter.indoor) &&
                    ((el.typefloor.toLowerCase() == "grass" && $scope.filter.grass) || (el.typefloor.toLowerCase() == "clay" && $scope.filter.clay))
                    ||
                    (el.type.toLowerCase() == "outdoor" && $scope.filter.outdoor) &&
                    ((el.typefloor.toLowerCase() == "grass" && $scope.filter.grass) || (el.typefloor.toLowerCase() == "clay" && $scope.filter.clay)))



            });

            if (!$scope.filter.indoor && !$scope.filter.outdoor && !$scope.filter.grass && !$scope.filter.clay) {
                $scope.allfreestadiums = $scope.globalstadiums;
            }



            $ionicLoading.hide();



            //    $scope.allfreestadiums = $scope.allfreestadiums.filter(function (el) {
            //                return el.key !== team.key;
            //            });

        }

        $scope.cancelfilter = function () {
            $scope.closePopover();
        }

        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {
                $scope.nointernet = false;
            }
            else {
                $ionicLoading.hide();
                $scope.nointernet = true;
            }
        });


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


    })
