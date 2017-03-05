﻿
angular.module('football.controllers')



    .controller('ChallengeController', function ($scope, ChallengeStore, $state, $ionicPopup, $ionicLoading, $ionicPopover, pickerView) {


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
            text: "Tomorrow, 9:00PM - 5 Vs 5 "

        };
        $scope.search.date.setDate($scope.search.date.getDate() + 1);
        $scope.search.date.setHours(21);
        $scope.search.date.setMinutes(00);
        $scope.search.date.setMilliseconds(0);
        $scope.search.date.setSeconds(0);
        
        function getDateFromDayName(selectedDay) {
            var selectedDate = new Date();
            if (selectedDay == "Today") {
                selectedDate.setDate(selectedDate.getDate());
                return weekday[selectedDate.getDay()] + monthChar[selectedDate.getMonth()] + " " + selectedDate.getDate();
            }
            else if (selectedDay == "Tomorrow") {
                selectedDate.setDate(selectedDate.getDate() + 1);
                return weekday[selectedDate.getDay()] + monthChar[selectedDate.getMonth()] + " " + selectedDate.getDate();
            }
            else {
                selectedDate.setDate(selectedDate.getDate() + 2);
                for (var i = 0; i <= 6; i++) {
                    if (weekdayFull[selectedDate.getDay()] == selectedDay)
                        return weekday[selectedDate.getDay()] + monthChar[selectedDate.getMonth()] + " " + selectedDate.getDate();
                    selectedDate.setDate(selectedDate.getDate() + 1);
                }
            }
        }

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
                picker.then(function pickerViewFinish(output) {
                    if (output) {
                        // output is Array type
                        var correctDate;
                        var selectedDate = output[0];
                        var selectedTime = output[1];
                        if (!Date.parse(selectedDate)) {
                            selectedDate = getDateFromDayName(selectedDate);
                            console.log(selectedDate);
                        }
                        $scope.search.date = new Date(selectedDate + " " + selectedTime + ", " + (new Date()).getFullYear());
                        $scope.search.players = (output[2].split(" "))[1];
                        console.log($scope.search.date);
                        $scope.search.text = output.join(" -");
                        $scope.checkTeams();
                    }
                });
            }
        };


        




        
        $scope.checkTeams = function () {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            try {
                //works
                ChallengeStore.GetAllTeams(function (leagues) {
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
        };

        $scope.checkTeams();

        $scope.updateselectedteams = function (team) {


            try {


                if (team.selected == "unselect") {
                    $scope.selectedteams = $scope.selectedteams.filter(function (el) {
                        return el.key !== team.key;
                    });
                    team.selected = "select";
                    team.color = "green";
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
                        team.backcolor = "green";

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

    .controller('challengestadiumcontroller', function ($scope, ChallengeStore, HomeStore, ReservationFact, $state, $stateParams, $ionicPopup, $ionicLoading, $ionicPopover) {

        $scope.selectedstadiums = [];
        $scope.profile = [];
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
            HomeStore.GetProfileInfo(function (myprofile) {
                $ionicLoading.hide();
                $scope.profile = myprofile;
            })

        })
        $scope.updateselectedteams = function (stadiums) {

            try {

                if (stadiums.selected == "unselect") {
                    $scope.selectedstadiums = $scope.selectedstadiums.filter(function (el) {
                        return ((el.stadiumkey !== stadiums.stadiumkey) || (el.stadiumkey == stadiums.stadiumkey && el.ministadiumkey !== stadiums.ministadiumkey));
                    });
                    stadiums.selected = "select";
                    stadiums.color = "green";
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
                        stadiums.backcolor = "green";
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

                            ChallengeStore.ChallengeTeams($state.params.date, $state.params.teams, $scope.selectedstadiums, $scope.myteam, $scope.profile)
                                .then(function (value) {

                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Success',
                                        template: 'Successfully Challenged'
                                    }).then(function () {
                                        $state.go("app.homepage");
                                    });

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

                    ChallengeStore.GetMyTeams(function (myteams) {

                        $ionicLoading.hide();
                        $scope.test = myteams;

                        if (myteams.length == 0) {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Empty',
                                template: 'You do not below to any team right now'
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
//day stuff
var weekday = new Array(7);
weekday[0] = "Sun,";
weekday[1] = "Mon,";
weekday[2] = "Tue,";
weekday[3] = "Wed,";
weekday[4] = "Thu,";
weekday[5] = "Fri,";
weekday[6] = "Sat,";

var weekdayFull = new Array(7);
weekdayFull[0] = "Sunday";
weekdayFull[1] = "Monday";
weekdayFull[2] = "Tuesday";
weekdayFull[3] = "Wednesday";
weekdayFull[4] = "Thursday";
weekdayFull[5] = "Friday";
weekdayFull[6] = "Saturday";


monthChar = new Array(12);
monthChar[0] = "Jan";
monthChar[1] = "Feb";
monthChar[2] = "Mar";
monthChar[3] = "Apr";
monthChar[4] = "May";
monthChar[5] = "Jun";
monthChar[6] = "Jul";
monthChar[7] = "Aug";
monthChar[8] = "Sep";
monthChar[9] = "Oct";
monthChar[10] = "Nov";
monthChar[11] = "Dec";

var nesheDate = new Date();
var dateArrayThingy = new Array();
dateArrayThingy.push("Today");
dateArrayThingy.push("Tomorrow");
//alert(nesheDate.getDay());
nesheDate.setDate(nesheDate.getDate() + 1);
for (i = 0; i < 7; i++) {
    nesheDate.setDate(nesheDate.getDate() + 1);
    dateArrayThingy.push(weekdayFull[nesheDate.getDay()]);
}
for (i = 0 ; i < 100 ; i++) {
    nesheDate.setDate(nesheDate.getDate() + 1);
    //alert(weekday[nesheDate.getDay()]);
    var day = weekday[nesheDate.getDay()];
    var month = monthChar[nesheDate.getMonth()];
    var dayInMonth = nesheDate.getDate();
    dateArrayThingy.push(day + " " + month + " " + dayInMonth);
}


//end of day stufff----------------

