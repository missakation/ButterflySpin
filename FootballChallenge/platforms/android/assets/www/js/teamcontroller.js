
angular.module('football.controllers')

    .controller('TeamController', function ($scope, $ionicHistory, $ionicPopup, $ionicLoading, $state, $stateParams, TeamStores, $timeout) {

        $scope.showadd = true;
        $scope.notloaded = true;

        $ionicLoading.show({
            template: 'Loading...',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        //works
        //$timeout(function () {

        try {
            $timeout(function () {
                TeamStores.GetMyTeams(function (leagues) {
                    $ionicLoading.hide();
                    $scope.test = leagues;

                    if (leagues.length == 0) {
                        //    var alertPopup = $ionicPopup.alert({
                        //        title: 'Empty',
                        //        template: 'You do not below to any team right now'
                        //    });
                    }
                    else if (leagues.length > 10) {
                        $scope.showadd = false;

                    }
                    $scope.notloaded = false;
                    $scope.$apply

                })
            }, 2000);


        }
        catch (error) {
            alert(error.message);
        }
        //  }, 2000)

        $scope.gotoadd = function () {
            $state.go("app.teamadd");
        }

        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {

            }
            else {
                $ionicLoading.hide();
            }
        });



    })

    .controller('TeamAddController', function ($scope, SearchStore, $cordovaToast, $ionicPopover, ReservationFact, $state, $ionicLoading, $ionicPopup, TeamStores) {

        $ionicLoading.show({
            template: 'Loading...',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $scope.validate =
            {
                team: false,
                teamsize: false
            }

        $scope.managecolors =
            {
                five:
                {
                    color: "green",
                    backcolor: "white"
                },
                six:
                {
                    color: "green",
                    backcolor: "white"
                },
                seven:
                {
                    color: "green",
                    backcolor: "white"
                },
                eight:
                {
                    color: "green",
                    backcolor: "white"
                },
                nine:
                {
                    color: "green",
                    backcolor: "white"
                },
                ten:
                {
                    color: "green",
                    backcolor: "white"
                },
                eleven:
                {
                    color: "green",
                    backcolor: "white"
                }
            }

        //works
        try {

            ReservationFact.GetAllStadiums(function (leagues) {

                $scope.allstadiums = leagues;
                SearchStore.GetMyProfileInfo(function (profile) {
                    $ionicLoading.hide();
                    $scope.myprofile = profile;
                })


            })

        }
        catch (error) {
            alert(error.message);
        }



        $scope.$on("$ionicView.afterEnter", function (event, data) {
            // handle event
            $scope.disabledbutton = false;
        });

        $scope.adduser =
            {
                teamname: "",
                pteamsize: "5",
                favstadium: "",
                favstadiumphoto: "",
                homejersey: "Blue",
                awayjersey: "White",
                badge: "01",
                five: false,
                six: false,
                seven: false,
                eight: false,
                nine: false,
                ten: false,
                eleven: false
            }


        $scope.next = function () {

            $scope.validate.teamsize = false;
            $scope.validate.team = false;

            var error = false;

            $scope.disabledbutton = true;
            try {
                var team = {
                    teamname: $scope.adduser.teamname,
                    teamadmin: "",
                    rating: 0,
                    pteamsize: $scope.adduser.pteamsize,
                    favstadium: $scope.adduser.favstadium,
                    homejersey: "",
                    awayjersey: "",
                    badge: false,
                    five: $scope.adduser.five,
                    six: $scope.adduser.six,
                    seven: $scope.adduser.seven,
                    eight: $scope.adduser.eight,
                    nine: $scope.adduser.nine,
                    ten: $scope.adduser.ten,
                    eleven: $scope.adduser.eleven,
                    photo: ""

                };

                for (var i = 0; i < $scope.allstadiums.length; i++) {
                    if ($scope.adduser.favstadium == $scope.allstadiums[i].name) {
                        team.photo = $scope.allstadiums[i].photo
                    }
                }

                if (!(team.five || team.six || team.seven || team.eight || team.nine || team.ten || team.eleven)) {
                    $scope.validate.teamsize = true;
                    $scope.disabledbutton = false;
                    error = true;
                }
                if (team.teamname.length < 3 && team.teamname.length < 15) {
                    $scope.validate.team = true;
                    $scope.disabledbutton = false;
                    error = true;
                }

                if (!error) {
                    $scope.validate.teamsize = false;
                    $scope.validate.team = false;

                    $state.go("app.teamadd1", {
                        team1: team,
                        myprofile:$scope.myprofile
                    });
                }
            }

            catch (error) {
                alert(error.message);
                $scope.disabledbutton = false;
            }



        };

        $scope.updateteamsize = function (x) {
            switch (x) {
                case 1:
                    if ($scope.adduser.five) {
                        $scope.managecolors.five.color = "Green";
                        $scope.managecolors.five.backcolor = "White";
                        $scope.adduser.five = false;
                    }
                    else {
                        $scope.managecolors.five.color = "white";
                        $scope.managecolors.five.backcolor = "Green";
                        $scope.adduser.five = true;
                    }

                    break;
                case 2:
                    if ($scope.adduser.six) {
                        $scope.managecolors.six.color = "Green";
                        $scope.managecolors.six.backcolor = "White";
                        $scope.adduser.six = false;
                    }
                    else {
                        $scope.managecolors.six.color = "white";
                        $scope.managecolors.six.backcolor = "Green";
                        $scope.adduser.six = true;
                    }
                    break;
                case 3:
                    if ($scope.adduser.seven) {
                        $scope.managecolors.seven.color = "Green";
                        $scope.managecolors.seven.backcolor = "White";
                        $scope.adduser.seven = false;
                    }
                    else {
                        $scope.managecolors.seven.color = "white";
                        $scope.managecolors.seven.backcolor = "Green";
                        $scope.adduser.seven = true;
                    }
                    break;
                case 4:
                    if ($scope.adduser.eight) {
                        $scope.managecolors.eight.color = "Green";
                        $scope.managecolors.eight.backcolor = "White";
                        $scope.adduser.eight = false;
                    }
                    else {
                        $scope.managecolors.eight.color = "white";
                        $scope.managecolors.eight.backcolor = "Green";
                        $scope.adduser.eight = true;
                    }
                    break;
                case 5:
                    if ($scope.adduser.nine) {
                        $scope.managecolors.nine.color = "Green";
                        $scope.managecolors.nine.backcolor = "White";
                        $scope.adduser.nine = false;
                    }
                    else {
                        $scope.managecolors.nine.color = "white";
                        $scope.managecolors.nine.backcolor = "Green";
                        $scope.adduser.nine = true;
                    }
                    break;
                case 6:
                    if ($scope.adduser.ten) {
                        $scope.managecolors.ten.color = "Green";
                        $scope.managecolors.ten.backcolor = "White";
                        $scope.adduser.ten = false;
                    }
                    else {
                        $scope.managecolors.ten.color = "white";
                        $scope.managecolors.ten.backcolor = "Green";
                        $scope.adduser.ten = true;
                    }
                    break;
                case 7:
                    if ($scope.adduser.eleven) {
                        $scope.managecolors.eleven.color = "Green";
                        $scope.managecolors.eleven.backcolor = "White";
                        $scope.adduser.eleven = false;
                    }
                    else {
                        $scope.managecolors.eleven.color = "white";
                        $scope.managecolors.eleven.backcolor = "Green";
                        $scope.adduser.eleven = true;
                    }
                    break;
            }
        }

    })
    .controller('TeamAdd1Controller', function ($scope, SearchStore, $cordovaToast, $ionicPopover, ReservationFact, $state, $ionicLoading, $ionicPopup, TeamStores) {

        $scope.validate =
            {
                badge: ""
            }


        $scope.$on("$ionicView.afterEnter", function (event, data) {
            // handle event
            $scope.disabledbutton = false;
        });

        //Ari Default Badge on Load
        $scope.badge = "Logo";

        $scope.RefreshBadge = function (col) {
            $scope.badge = col;
        }

        $scope.next = function () {

            var error = false;
            var team = $state.params.team1;
            $scope.myprofile = $state.params.myprofile;
            team.badge = $scope.badge;
            $scope.validate.badge = false;

            if (team.badge.trim() == "Logo" || team.badge == null || team.badge == '' || team.badge === undefined) {
                $scope.disabledbutton = false;
                $scope.validate.badge = true;
                error = true;
            }
            if (!error) {
                $state.go("app.teamadd2", {
                    team2: team,
                    myprofile:$scope.myprofile
                });

            }



        }

    })
    .controller('TeamAdd2Controller', function ($scope, SearchStore, $cordovaToast, $ionicPopover, ReservationFact, $state, $ionicLoading, $ionicPopup, TeamStores) {

        $scope.adduser =
            {
                homejersey: "Blue",
                awayjersey: "White",
            }
        $scope.validate =
            {
                samecolor: false
            }

        $scope.$on("$ionicView.afterEnter", function (event, data) {
            // handle event
            $scope.disabledbutton = false;
        });

        $scope.oldteam = $state.params.team2;


        $scope.add = function () {

            var error = false;
            $scope.disabledbutton = true;
            try {



                var team = $state.params.team2;
                $scope.myprofile = $state.params.myprofile;
                team.awayjersey = $scope.adduser.awayjersey;
                team.homejersey = $scope.adduser.homejersey;

                if (team.homejersey == team.awayjersey) {

                    $scope.disabledbutton = false;
                    $scope.validate.samecolor = true;
                    error = true;
                }
                if (!error) {

                    $scope.validate.samecolor = false;
                    TeamStores.AddNewTeam(team, $scope.myprofile)
                        .then(function (value) {

                            /*   $cordovaToast.showShortTop('Team Added Successfully').then(function (success) {
   
                               }, function (error) {
                                   // error
                               });  */

                            var alertPopup = $ionicPopup.alert({
                                title: 'Success',
                                template: 'Team Added'
                            }).then(function () {
                                $scope.adduser =
                                    {
                                        homejersey: "Blue",
                                        awayjersey: "White"
                                    }
                                $state.go("app.teammanagement");
                            });

                        }, function (error) {
                            if(error.code =='PERMISSION_DENIED')
                            {
                                alert("Team Name Already Taken")
                            }
                        })
                }



            }
            catch (error) {
                alert(error.message);
                $scope.disabledbutton = false;
            }



        };

        $scope.updatehomejersey = function (col) {


            switch (col) {
                case 1:
                    $scope.adduser.homejersey = "Red";
                    break;
                case 2:
                    $scope.adduser.homejersey = "Blue";
                    break;
                case 3:
                    $scope.adduser.homejersey = "Green";
                    break;
                case 4:
                    $scope.adduser.homejersey = "Black";
                    break;
                case 5:
                    $scope.adduser.homejersey = "Yellow";
                    break;
                case 6:
                    $scope.adduser.homejersey = "White";
                    break;
                case 7:
                    $scope.adduser.homejersey = "Red";
                    break;
            }

        }

        $scope.RefreshBadge = function (col) {
            $scope.adduser.badge = col;

        }



        $scope.updateawayjersey = function (col) {


            switch (col) {
                case 1:
                    $scope.adduser.awayjersey = "Red";
                    break;
                case 2:
                    $scope.adduser.awayjersey = "Blue";
                    break;
                case 3:
                    $scope.adduser.awayjersey = "Green";
                    break;
                case 4:
                    $scope.adduser.awayjersey = "Black";
                    break;
                case 5:
                    $scope.adduser.awayjersey = "Yellow";
                    break;
                case 6:
                    $scope.adduser.awayjersey = "White";
                    break;
                case 7:
                    $scope.adduser.awayjersey = "Red";
                    break;
            }

        }







    })

    .controller('TeamProfileController', function ($scope, $ionicLoading, $timeout, $ionicPopup, $stateParams, $state, TeamStores) {

        $scope.doibelong = false;

        $scope.currentprofile = {};

        $scope.tabs =
            {
                Available: false,
                Members: true,
                Statistics: false
            }
        $scope.colors =
            {
                Available: "",
                Members: true,
                Statistics: false
            }
        $scope.status =
            {
                Available: "none",
                Members: "solid",
                Statistics: "none"
            }




        $scope.switchscreens = function (x) {
            switch (x) {
                case 1:
                    $scope.tabs.Available = false;
                    $scope.tabs.Members = false;
                    $scope.tabs.Statistics = false;
                    $scope.tabs.Available = true;

                    $scope.status.Available = "none";
                    $scope.status.Members = "none";
                    $scope.status.Statistics = "none";

                    $scope.status.Available = "solid";

                    break;

                case 2:
                    $scope.tabs.Available = false;
                    $scope.tabs.Members = false;
                    $scope.tabs.Statistics = false;
                    $scope.tabs.Statistics = true;

                    $scope.status.Available = "none";
                    $scope.status.Members = "none";
                    $scope.status.Statistics = "none";

                    $scope.status.Statistics = "solid";

                    break;

                case 3:
                    $scope.tabs.Available = false;
                    $scope.tabs.Members = false;
                    $scope.tabs.Statistics = false;
                    $scope.tabs.Members = true;

                    $scope.status.Available = "none";
                    $scope.status.Members = "none";
                    $scope.status.Statistics = "none";
                    $scope.status.Members = "solid";
                    break;
            }

            $scope.$apply();
        }



        //here
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        //works

        try {
            $timeout(function () {
                TeamStores.GetTeamByKey($stateParams.teamid, function (myprofile) {

                    $ionicLoading.hide();
                    if (myprofile !== null || myprofile !== undefiend || myprofile !== "") {

                        $scope.currentprofile = myprofile;

                        var user = firebase.auth().currentUser;
                        if (!(user === null || user == '' || user === undefined)) {
                            var id = user.uid;
                            if (!(id === null || id == '' || id === undefined)) {

                                for (var j = 0; j < $scope.currentprofile.players.length; j++) {
                                    if ($scope.currentprofile.players[i].key == id) {
                                        $scope.doibelong = true;
                                    }

                                }
                            }
                        }
                    }




                })
            }, 1000);

        }
        catch (error) {
            alert(error.message);
        }


        //$scope.value = 150;



        $scope.goupdate = function () {
            $state.go('app.teamprofileedit',

                {
                    myteam: $scope.currentprofile
                });
        }

        $scope.doRefresh = function () {

            try {

                TeamStores.GetTeamByKey($stateParams.teamid, function (myprofile) {
                    $scope.currentprofile = myprofile;
                    $scope.$apply();
                    $scope.$broadcast('scroll.refreshComplete');


                })
            } catch (error) {
                alert(error.message);
            }
        }

        $scope.playeroperations = function (opercode, player) {
            var message = "";
            switch (opercode) {
                case 1:
                    message = "Are you sure you want to promote the player?"
                    break;
                case 2:
                    message = "Are you sure you want to demote the player?"
                    break;
                case 3:
                    message = "Are you sure you want to remove the player from the team?"
                    break;
                default:
                    break;
            }

            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm',
                template: message
            });

            confirmPopup.then(function (res) {
                if (res) {
                    TeamStores.PromoteDeletePlayers($scope.currentprofile, player, opercode).then(function () {


                        switch (opercode) {
                            case 1:
                                player.isadmin = true;
                                break;
                            case 2:
                                player.isadmin = false;
                                break;
                            case 3:
                                $scope.currentprofile.players = $scope.currentprofile.players.filter(function (el) {
                                    return el.key !== player.key;

                                });
                                break;
                            default:
                                break;
                        }
                        $scope.$digest();

                    }, function (error) {
                        alert(error.message);
                    });
                }
            })
        }

        $scope.Invite = function () {


            try {
                if ($scope.currentprofile.players.length < 14) {

                    $state.go('app.inviteteamplayers',

                        {
                            myteam: $scope.currentprofile
                        });
                }
                else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Forbidden',
                        template: 'You cannot have more than 15 players. Remove some players to add new ones.'
                    });
                }
            }
            catch (error) {
                alert(error.message);
            }
        }

        $scope.Challengeteam = function () {
            try {
                $state.go('app.challengeteam',

                    {
                        myteam: $scope.currentprofile
                    });
            }
            catch (error) {
                alert(error.message);
            }
        }

        $scope.LeaveTeam = function () {
            try {

                var confirmPopup = $ionicPopup.confirm({
                    title: 'Leave Team',
                    template: 'Are you sure you want to leave the team?'
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        TeamStores.LeaveTeam($scope.currentprofile)
                            .then(function (value) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: 'You Left the Team'
                                }).then(function () {
                                    $state.go("app.homepage");
                                });


                            }, function (error) {
                                alert(error.message);
                            })
                    }


                })

            }
            catch (error) {
                alert(error.message);
            }
        }
        $scope.gogamedetails = function (gameid) {
            $state.go('app.gamedetails',
                {
                    gameid: gameid
                })
        }

    })

    .controller('TeamEditController', function ($scope, $ionicHistory, $ionicPopover, $ionicLoading, $timeout, $ionicPopup, $stateParams, $state, TeamStores) {



        $scope.currentprofile = $state.params.myteam;

        // .fromTemplate() method
        var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

        $scope.popover = $ionicPopover.fromTemplate(template, {
            scope: $scope
        });

        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('my-popover.html', {
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



        $scope.$on("$ionicView.afterEnter", function (event, data) {
            // handle event
            $scope.disabledbutton = false;
        });


        $scope.slider1 = {
            minValue: 7,
            maxValue: 23,

            options: {
                floor: 0,
                showSelectionBar: true,
                readOnly: true,
                disabled: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return 'rgb(38, 175, 61)';

                },
                ceil: 23,
                draggableRange: false

            }
        };

        $scope.slider2 = {
            minValue: 7,
            maxValue: 23,
            options: {
                floor: 0,
                showSelectionBar: true,
                readOnly: true,
                disabled: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return 'rgb(38, 175, 61)';

                },
                ceil: 23,
                draggableRange: false

            }
        };


        $scope.slider3 = {
            minValue: 7,
            maxValue: 23,
            options: {
                floor: 0,
                showSelectionBar: true,
                readOnly: true,
                disabled: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return 'rgb(38, 175, 61)';

                },
                ceil: 23,
                draggableRange: false

            }
        };


        $scope.slider4 = {
            minValue: 7,
            maxValue: 23,
            options: {
                floor: 0,
                showSelectionBar: true,
                readOnly: true,
                disabled: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return 'rgb(38, 175, 61)';

                },
                ceil: 23,
                draggableRange: false

            }
        };


        $scope.slider5 = {
            minValue: 7,
            maxValue: 23,
            options: {
                floor: 0,
                showSelectionBar: true,
                readOnly: true,
                disabled: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return 'rgb(38, 175, 61)';

                },
                ceil: 23,
                draggableRange: false

            }
        };

        $scope.slider6 = {
            minValue: 7,
            maxValue: 23,
            options: {
                floor: 0,
                showSelectionBar: true,
                readOnly: true,
                disabled: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return 'rgb(38, 175, 61)';

                },
                ceil: 23,
                draggableRange: false

            }
        };

        $scope.slider7 = {
            minValue: 7,
            maxValue: 23,

            options: {
                floor: 0,
                showSelectionBar: true,
                readOnly: true,
                disabled: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return 'rgb(38, 175, 61)';

                },
                ceil: 23,
                draggableRange: false

            }
        };

        try {


            $scope.slider1.options.readOnly = $scope.currentprofile.admiadmin;
            $scope.slider1.options.disabled = $scope.currentprofile.admiadmin;

            $scope.slider2.options.readOnly = $scope.currentprofile.admiadmin;
            $scope.slider2.options.disabled = $scope.currentprofile.admiadmin;

            $scope.slider3.options.readOnly = $scope.currentprofile.admiadmin;
            $scope.slider3.options.disabled = $scope.currentprofile.admiadmin;

            $scope.slider4.options.readOnly = $scope.currentprofile.admiadmin;
            $scope.slider4.options.disabled = $scope.currentprofile.admiadmin;

            $scope.slider5.options.readOnly = $scope.currentprofile.admiadmin;
            $scope.slider5.options.disabled = $scope.currentprofile.admiadmin;

            $scope.slider6.options.readOnly = $scope.currentprofile.admiadmin;
            $scope.slider6.options.disabled = $scope.currentprofile.admiadmin;


            $scope.slider7.options.readOnly = $scope.currentprofile.admiadmin;
            $scope.slider7.options.disabled = $scope.currentprofile.admiadmin;

        }
        catch (error) {
            alert(error.message);
        }

        $scope.UpdateTeam = function (profile) {


            TeamStores.UpdateTeamByKey(profile).then(function (result) {

                $ionicHistory.goBack();

            }, function (error) {
                alert(error.message);
            });

        }

        $scope.deleteteam = function (team) {
            try {


                var confirmPopup = $ionicPopup.confirm({
                    title: 'DeleteTeam',
                    template: 'Are you sure you want to delete this team?'
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        TeamStores.DeleteTeamByKey(team)
                            .then(function (value) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: 'Successfully Deleted Team'
                                }).then(function () {
                                    $state.go("app.homepage");
                                });


                            }, function (error) {
                                alert(error.message);
                            })
                    }


                })

            }
            catch (error) {
                alert(error.message);
            }

        }
        $scope.RefreshBadge = function (col) {
            $scope.currentprofile.badge = col;

        }
        $scope.gochoosestadium = function (team) {
            $state.go("app.choosestadium", {
                myteam: team
            })
        }



    })

    .controller('InvitePlayersController', function ($scope, $ionicPopup, HomeStore, $ionicLoading, $state, $stateParams, SearchStore, TeamStores, $timeout) {

        $scope.notloaded = true;

        $scope.myteam = $state.params.myteam;


        $timeout(function () {
            SearchStore.SearchPlayers($scope.myteam, function (leagues) {
                $scope.allplayers = leagues;
                HomeStore.GetProfileInfo(function (players) {
                    $scope.profile = players;
                    $scope.notloaded = false;
                    $scope.$apply();
                })
            })
        }, 2000)




        $scope.InvitePlayerToTeam = function (player) {
            TeamStores.InvitePlayerToTeam($scope.myteam, player, $scope.profile).then(function () {

                player.status = "Invitation Sent";
                $scope.$digest();

            }, function (error) {
                alert(error.message)
            })
        }

    })

    .controller('ChooseStadiumController', function ($scope, $ionicHistory, $ionicPopover, $ionicLoading, $timeout, $stateParams, $state, TeamStores, ReservationFact) {

        $scope.notloaded = true;
        ReservationFact.GetAllStadiums(function (result) {
            $scope.stadiums = result;
            $scope.notloaded = false;

        }, function (error) {

        })


        $scope.goback = function (stadium) {
            $state.params.myteam.favstadium = stadium.name;
            $state.params.myteam.favstadiumphoto = stadium.photo;
            $ionicHistory.goBack();
        }
    })




