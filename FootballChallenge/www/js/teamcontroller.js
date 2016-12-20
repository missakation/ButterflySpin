
angular.module('football.controllers')

    .controller('TeamController', function ($scope, $ionicPopup, $ionicLoading, $state, $stateParams, TeamStores, $timeout) {

        $scope.showadd = true;

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        //works
        //$timeout(function () {

            try {
                $timeout(function()
                {
                TeamStores.GetMyTeams(function (leagues) {
                    $ionicLoading.hide();
                    $scope.test = leagues;

                    if (leagues.length == 0) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Empty',
                            template: 'You do not below to any team right now'
                        });
                    }
                    else if (leagues.length > 10) {
                        $scope.showadd = false;
                    }

                })
                },200);


            }
            catch (error) {
                alert(error.message);
            }
      //  }, 2000)

        $scope.gotoadd = function () {
            $state.go("app.teamadd");
        }



    })

    .controller('TeamAddController', function ($scope,$ionicLoading, $cordovaToast, $ionicPopover,ReservationFact, $state, $ionicLoading, $ionicPopup, TeamStores) {

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        //works
            try {

                ReservationFact.GetAllStadiums(function (leagues) {

                    $ionicLoading.hide();
                    $scope.allstadiums = leagues;

                })

            }
            catch (error) {
                alert(error.message);
            }
        

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
                eleven: false,
            }

        $scope.add = function () {
            $scope.disabledbutton = true;
            try {
                var team = {
                    teamname: $scope.adduser.teamname,
                    teamadmin: "",
                    rating: 0,
                    pteamsize: $scope.adduser.pteamsize,
                    favstadium: $scope.adduser.favstadium,
                    homejersey: $scope.adduser.homejersey,
                    awayjersey: $scope.adduser.awayjersey,
                    badge: $scope.adduser.badge,
                    five: $scope.adduser.five,
                    six: $scope.adduser.six,
                    seven: $scope.adduser.seven,
                    eight: $scope.adduser.eight,
                    nine: $scope.adduser.nine,
                    ten: $scope.adduser.ten,
                    eleven: $scope.adduser.eleven,
                    photo :""

                };

                for(var i = 0; i <$scope.allstadiums.length;i++)
                {
                    if($scope.adduser.favstadium == $scope.allstadiums[i].name)
                    {
                        team.photo = $scope.allstadiums[i].photo
                    }
                }

                if (team.homejersey == team.awayjersey) {
                    alert("Home and Away Jersey Colors Should not be the Same")
                    $scope.disabledbutton = false;
                }
                else {
                    TeamStores.AddNewTeam(team)
                        .then(function (value) {

                            /*   $cordovaToast.showShortTop('Team Added Successfully').then(function (success) {
   
                               }, function (error) {
                                   // error
                               });  */

                            var alertPopup = $ionicPopup.alert({
                                title: 'Success',
                                template: 'Successfully Reserved'
                            }).then(function () {
                                $scope.adduser =
                                    {
                                        teamname: "",
                                        pteamsize: "",
                                        favstadium: "",
                                        teamphoto: "",
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
                                $state.go("app.teammanagement");
                            });

                        }, function (error) {
                            alert(error.message);
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


        $scope.currentprofile = {};

        $scope.tabs =
            {
                Available: false,
                Members: true,
                Statistics: false
            }

        $scope.switchscreens = function (x) {
            switch (x) {
                case 1:
                    $scope.tabs.Available = false;
                    $scope.tabs.Members = false;
                    $scope.tabs.Statistics = false;
                    $scope.tabs.Available = true;

                    break;

                case 2:
                    $scope.tabs.Available = false;
                    $scope.tabs.Members = false;
                    $scope.tabs.Statistics = false;
                    $scope.tabs.Statistics = true;

                    break;

                case 3:
                    $scope.tabs.Available = false;
                    $scope.tabs.Members = false;
                    $scope.tabs.Statistics = false;
                    $scope.tabs.Members = true;
                    break;
            }
        }


        $scope.slider1 = {
            minValue: 1,
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
                    return 'Green';

                },
                ceil: 23,
                draggableRange: true

            }
        };

        $scope.slider2 = {
            minValue: 1,
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
                    return 'Green';

                },
                ceil: 23,
                draggableRange: true

            }
        };


        $scope.slider3 = {
            minValue: 1,
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
                    return 'Green';

                },
                ceil: 23,
                draggableRange: true

            }
        };


        $scope.slider4 = {
            minValue: 1,
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
                    return 'Green';

                },
                ceil: 23,
                draggableRange: true

            }
        };


        $scope.slider5 = {
            minValue: 1,
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
                    return 'Green';

                },
                ceil: 23,
                draggableRange: true

            }
        };

        $scope.slider6 = {
            minValue: 1,
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
                    return 'Green';

                },
                ceil: 23,
                draggableRange: true

            }
        };

        $scope.slider7 = {
            minValue: 1,
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
                    return 'Green';

                },
                ceil: 23,
                draggableRange: true

            }
        };

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
                    $scope.currentprofile = myprofile;


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
                })
            }, 2000);

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
                    TeamStores.PromoteDeletePlayers($scope.currentprofile,player,opercode).then(function () {


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

    })

    .controller('TeamEditController', function ($scope, $ionicLoading, $timeout, $ionicPopup, $stateParams, $state, TeamStores) {



        $scope.currentprofile = $state.params.myteam;


        $scope.slider1 = {
            minValue: 1,
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
                    return 'Green';

                },
                ceil: 23,
                draggableRange: true

            }
        };

        $scope.slider2 = {
            minValue: 1,
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
                    return 'Green';

                },
                ceil: 23,
                draggableRange: true

            }
        };


        $scope.slider3 = {
            minValue: 1,
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
                    return 'Green';

                },
                ceil: 23,
                draggableRange: true

            }
        };


        $scope.slider4 = {
            minValue: 1,
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
                    return 'Green';

                },
                ceil: 23,
                draggableRange: true

            }
        };


        $scope.slider5 = {
            minValue: 1,
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
                    return 'Green';

                },
                ceil: 23,
                draggableRange: true

            }
        };

        $scope.slider6 = {
            minValue: 1,
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
                    return 'Green';

                },
                ceil: 23,
                draggableRange: true

            }
        };

        $scope.slider7 = {
            minValue: 1,
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
                    return 'Green';

                },
                ceil: 23,
                draggableRange: true

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
                                    $state.go("app.teammanagement");
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



    })

    .controller('InvitePlayersController', function ($scope, $ionicPopup, $ionicLoading, $state, $stateParams, SearchStore, TeamStores, $timeout) {

        $scope.notloaded = true;

        $scope.myteam = $state.params.myteam;


        $timeout(function () {
            SearchStore.SearchPlayers($scope.myteam, function (leagues) {
                $ionicLoading.hide();
                $scope.allplayers = leagues;
                $scope.notloaded = false;

            })
        }, 2000)




        $scope.InvitePlayerToTeam = function (player) {
            TeamStores.InvitePlayerToTeam($scope.myteam, player).then(function () {

            player.status = "Invitation Sent";
            $scope.$digest();

            }, function (error) {
                    alert(error.message)
                })
        }





    })



