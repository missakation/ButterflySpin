﻿
angular.module('football.controllers')



    .controller('ChallengeController', function ($scope, ChallengeStore, $state, $ionicPopup, $ionicLoading, $ionicPopover) {


        $scope.selectedteams = [];

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

        //alert(JSON.stringify($state.params.myteam));
        $scope.myteam = $state.params.myteam;

        $scope.search = {
            date: new Date(),


        };
        $scope.search.date.setDate($scope.search.date.getDate() + 1);
        $scope.search.date.setHours(21);
        $scope.search.date.setMinutes(00);
        $scope.search.date.setMilliseconds(0);
        $scope.search.date.setSeconds(0);


        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });




        try {
            //works
            ChallengeStore.GetAllTeamsNotMe(function (leagues) {
                $ionicLoading.hide();
                $scope.test = leagues;

                if (leagues.length == 0) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'No Team Found'
                    });
                }

            })
        }
        catch (error) {
            alert(error.message);
        }

        $scope.updateselectedteams = function (team) {


            try {


                if (team.selected == "unselect") {
                    $scope.selectedteams = $scope.selectedteams.filter(function (el) {
                        return el.key !== team.key;
                    });
                    team.selected = "select";
                    team.color = "#28b041";
                    team.backcolor = "white";

                }
                else {
                    if ($scope.selectedteams.length == 3) {
                        $ionicPopup.alert({
                            title: 'Forbidden',
                            template: 'You cannot select more than 3 teams'
                        });
                    }
                    else {

                        $scope.selectedteams.push(angular.copy(team));
                        team.selected = "unselect";
                        team.color = "white";
                        team.backcolor = "#28b041";

                    }
                }
            }
            catch (error) {
                alert(error.message);
            }

        }

        $scope.choosestadium = function () {
            try {


                if ($scope.selectedteams.length == 0) {
                    $ionicPopup.alert({
                        title: 'Select a Team',
                        template: 'You have to select at least one team'
                    });
                }
                else {

                    $state.go('app.challengeteamstadium',

                        {
                            date: $scope.search.date,
                            teams: $scope.selectedteams,
                            myteam: $scope.myteam
                        });
                }
            }
            catch (error) {
                alert(error.message);
            }
        }






    })

    .controller('challengestadiumcontroller', function ($http, $scope, $ionicHistory, ChallengeStore, HomeStore, ReservationFact, $state, $stateParams, $ionicPopup, $ionicLoading, $ionicPopover) {

        $scope.selectedstadiums = [];
        $scope.challengestatus = false;
        $scope.selecteddate =
            {
                date: $state.params.date
            };

        $scope.myteam = $state.params.myteam;

        ReservationFact.FindFreeStadiums($state.params, function (leagues) {


            $scope.allfreestadiums = leagues;

            if (leagues.length == 0) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'No Available Stadiums'
                });
            }
            alert("test");


            // Simple GET request example:
            $http({
                method: 'GET',
                url: 'https://us-central1-project-6346119287623064588.cloudfunctions.net/date'
            }).then(function successCallback(response) {

                $scope.currentdate = new Date(response.data);
                HomeStore.GetProfileInfo($scope.currentdate, function (myprofile) {

                    $scope.profile = myprofile;
                    alert($scope.profile.photo);
                })

            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alert(JSON.stringify(response));
            });



        })
        $scope.updateselectedteams = function (stadiums) {

            try {

                if (stadiums.selected == "unselect") {
                    $scope.selectedstadiums = $scope.selectedstadiums.filter(function (el) {
                        return ((el.stadiumkey !== stadiums.stadiumkey) || (el.stadiumkey == stadiums.stadiumkey && el.ministadiumkey !== stadiums.ministadiumkey));
                    });
                    stadiums.selected = "select";
                    stadiums.color = "#28b041";
                    stadiums.backcolor = "white";

                }
                else {
                    if ($scope.selectedstadiums.length == 3) {
                        $ionicPopup.alert({
                            title: 'Forbidden',
                            template: 'You cannot select more than 3 teams'
                        });
                    }
                    else {
                        $scope.selectedstadiums.push(angular.copy(stadiums));
                        stadiums.selected = "unselect";
                        stadiums.color = "white";
                        stadiums.backcolor = "#28b041";
                    }
                }
            }
            catch (error) {
                alert(error.message);
            }


        }
        $scope.sendchallenge = function () {

            try {

                $scope.challengestatus = true;
                if ($scope.selectedstadiums == 0) {
                    $ionicPopup.alert({
                        title: 'Select a Stadium',
                        template: 'You have to select at least one stadium'
                    });
                }
                else {

                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Confirm',
                        template: 'Are you sure you want to send the challenges?'
                    });

                    confirmPopup.then(function (res) {
                        if (res) {

                            ChallengeStore.GetNumChallengeByDate($state.params.date, $scope.myteam, function (result) {
                                alert(result);
                                if (result + $state.params.teams.length < 4) {
                                    ChallengeStore.ChallengeTeams($state.params.date, $state.params.teams, $scope.selectedstadiums, $scope.myteam, $scope.profile)
                                        .then(function (value) {

                                            var alertPopup = $ionicPopup.alert({
                                                title: 'Success',
                                                template: 'Successfully Challenged'
                                            }).then(function () {
                                                $ionicHistory.nextViewOptions({
                                                    disableBack: true
                                                });
                                                $state.go("app.homepage");
                                            });

                                        }, function (error) {
                                            alert(error.message);
                                        })
                                }
                                else {
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Error',
                                        template: 'You have ' + (3-result) + ' challenges left for the selected date' 
                                    }).then(function () {

                                    });
                                }



                            }, function (error) {
                                alert(error.message);
                            })



                        }


                    })


                }
                $scope.challengestatus = false;
            }
            catch (error) {
                alert(error.message);
            }

        }

    })

    .controller('ChooseYourTeamController', function ($scope, $ionicPopup, $ionicLoading, $state, $stateParams, ChallengeStore, $timeout) {



        $scope.$on("$ionicView.beforeEnter", function (event, data) {
            // handle event
            //works
            $timeout(function () {

                try {

                    ChallengeStore.GetMyAdminTeams(function (myteams) {

                        $ionicLoading.hide();
                        $scope.test = myteams;

                        if (myteams.length == 0) {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Empty',
                                template: 'You do not belong to any team right now'
                            });
                        }

                        if (myteams.length == 4) {
                            $scope.gochallengeteams($scope.test[0]);
                        }

                    })

                }
                catch (error) {
                    alert(error.message);
                }
            }, 1000)
        });


        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });



        $scope.gochallengeteams = function (team) {
            try {
                $state.go('app.challengeteam',

                    {
                        myteam: team
                    });
            }
            catch (error) {
                alert(error.message);
            }
        }



    })