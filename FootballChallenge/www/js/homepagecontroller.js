﻿
angular.module('football.controllers')


    .controller('HomeController', function ($scope, $ionicPush, $http, HomeStore, LoginStore, TeamStores, $state, $timeout, $ionicPopup, $ionicLoading, $cordovaSocialSharing) {

        $scope.nointernet = false;
        $scope.$on("$ionicView.afterEnter", function (event, data) {
            // handle event
            //works

            // LoginStore.SendNotification("ELECTRIC SCREWDRIVER",[]);

            $timeout(function () {

                try {

                    var user = firebase.auth().currentUser;

                    if (!(user === null || user == '' || user === undefined)) {

                        $ionicPush.register().then(function (t) {
                            return $ionicPush.saveToken(t);
                        }).then(function (t) {
                            var updates = {};
                            updates['/players/' + user.uid + '/devicetoken'] = t.token;
                            firebase.database().ref().update(updates).then(function () {

                            });
                        });

                        var id = user.uid;

                        if (!(id === null || id == '' || id === undefined)) {

                            if (!($scope.profile === null || $scope.profile == '' || $scope.profile === undefined)) {

                                if ($scope.profile.id !== id) {
                                    $scope.profile = [];
                                    $scope.$apply();
                                    // Simple GET request example:
                                    $http({
                                        method: 'GET',
                                        url: 'https://us-central1-project-6346119287623064588.cloudfunctions.net/date'
                                    }).then(function successCallback(response) {

                                        $scope.currentdate = new Date(response.data);
                                        $scope.doRefresh($scope.currentdate);

                                    }, function errorCallback(response) {
                                        // called asynchronously if an error occurs
                                        // or server returns response with an error status.
                                        alert(JSON.stringify(response));
                                    });

                                }
                            }


                        }
                    }

                }
                catch (error) {
                    alert(error.message);
                    LoginStore.PostError(error);
                }
            }, 500)
        });

        //Section Visibility Variables
        $scope.showteaminvite = false;
        $scope.showpendingchallenge = false;
        $scope.showupcomingmatches = false;
        $scope.showupcomingsinglematches = false;

        $scope.teaminvitationoperation = true;





        $scope.notloaded = true;
        try {

            $scope.profile = {};

            /* $timeout(function () {
                 //Get My Profile
                 // Simple GET request example:
                 $http({
                     method: 'GET',
                     url: 'https://us-central1-project-6346119287623064588.cloudfunctions.net/date'
                 }).then(function successCallback(response) {
 
                     $scope.currentdate = new Date(response.data);
                     $scope.doRefresh($scope.currentdate);
 
                 }, function errorCallback(response) {
                     // called asynchronously if an error occurs
                     // or server returns response with an error status.
                     alert(JSON.stringify(response));
                 });
             }, 2000); */


        } catch (error) {
            alert(error.message);
            LoginStore.PostError(error);
        }

        $scope.acceptinvitation = function (challenge) {
            try {

                if (challenge !== null || challenge == '' || challenge === undefined) {
                    $state.go('app.choosechallengestadium', {
                        challenge: challenge
                    });
                }


            } catch (error) {
                alert(error.message);
                LoginStore.PostError(error);
            }

        }

        $scope.gototeam = function (id) {
            if (!(id == null || id == '' || id === undefined)) {
                $state.go("app.teamprofile",
                    {
                        teamid: id
                    })
            }
        }

        $scope.declineinvitation = function (challenge) {
            try {

                var confirmPopup = $ionicPopup.confirm({
                    title: 'Decline',
                    template: 'Are you sure you want to decline the challenge?'
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        //decline the challenge
                        HomeStore.DeleteChallenge(challenge).then(function () {

                            var alertPopup = $ionicPopup.alert({
                                title: 'Success',
                                template: 'Challenge Declined'
                            })
                            //remove the challenge from homepage
                            $scope.profile.challenges = $scope.profile.challenges.filter(function (el) {
                                return el.key !== challenge.key;

                            })
                            $scope.$apply();
                        }, function (error) {
                            alert(error.message);
                            LoginStore.PostError(error);
                        })
                    }

                })

            } catch (error) {
                alert(error.message);
                LoginStore.PostError(error);
            }
        }
        $scope.cancelinvitation = function (challenge) {
            try {

                var confirmPopup = $ionicPopup.confirm({
                    title: 'Decline',
                    template: 'Are you sure you want to cancel the challenge?'
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        HomeStore.DeleteChallenge(challenge).then(function () {

                            var alertPopup = $ionicPopup.alert({
                                title: 'Success',
                                template: 'Challenge Declined'
                            })
                            $scope.profile.challenges = $scope.profile.challenges.filter(function (el) {
                                return el.key !== challenge.key;

                            })
                            $scope.$apply();
                        }, function (error) {
                            alert(error.message);
                            LoginStore.PostError(error);
                        })
                    }

                })

            } catch (error) {
                alert(error.message);
                LoginStore.PostError(error);
            }
        }

        $scope.acceptteaminvitation = function (invitation, x) {
            try {
                $scope.teaminvitationoperation = true;
                switch (x) {
                    case 1:
                        HomeStore.AcceptTeamInvitation(invitation, $scope.profile).then(function () {

                            var alertPopup = $ionicPopup.alert({
                                title: 'New Team',
                                template: 'You now belong to team ' + invitation.teamname
                            }).then(function () {
                                $state.go("app.teammanagement");
                            }, function (error) {
                                alert(error.message);
                                LoginStore.PostError(error);
                            })


                        });
                        break;
                    case 2:
                        HomeStore.DeleteInvitation(invitation).then(function () {

                            $scope.profile.teaminvitations = $scope.profile.teaminvitations.filter(function (el) {
                                return el.key !== invitation.key;

                            });

                        }, function (error) {
                            alert(error.message);
                            LoginStore.PostError(error);
                        })
                        break;

                    default:
                        break;
                }
                $scope.teaminvitationoperation = false;

            } catch (error) {
                alert(error.message);
                LoginStore.PostError(error);
            }


        }

        $scope.$on('cloud:push:notification', function (event, data) {
            var msg = data.message;
            //alert(msg.title + ': ' + msg.text);
        });


        $scope.acceptrequest = function (request, x) {
            try {
                $scope.teaminvitationoperation = true;
                switch (x) {
                    case 1:
                        HomeStore.AcceptMobileRequest(angular.copy(request), $scope.profile).then(function () {
                            $scope.profile.requestednumbers = $scope.profile.requestednumbers.filter(function (el) {
                                return el.key !== request.key;

                            });
                        });
                        break;
                    case 2:
                        HomeStore.DeleteMobileRequest(request).then(function () {

                            $scope.profile.requestednumbers = $scope.profile.requestednumbers.filter(function (el) {
                                return el.key !== request.key;

                            });

                        }, function (error) {
                            alert(error.message);
                            LoginStore.PostError(error);
                        })
                        break;

                    default:
                        break;
                }
                $scope.teaminvitationoperation = false;

            } catch (error) {
                alert(error.message);
                LoginStore.PostError(error);
            }


        }

        $scope.acceptgameinvitation = function (type, gameinvitation) {
            try {

                switch (type) {
                    case 1:
                        HomeStore.AccepGameInvitation(angular.copy(gameinvitation)).then(function () {

                            $scope.profile.gameinvitations = $scope.profile.gameinvitations.filter(function (el) {
                                return el.key !== gameinvitation.key;
                            });
                            $scope.$apply();
                        }, function (error) {
                            alert(error.message);
                            LoginStore.PostError(error);
                        })
                        break;

                    case 2:
                        HomeStore.DeleteGameInvitation(gameinvitation).then(function () {

                            $scope.profile.gameinvitations = $scope.profile.gameinvitations.filter(function (el) {
                                return el.key !== gameinvitation.key;
                            });
                            $scope.$apply();
                        }, function (error) {
                            alert(error.message);
                            LoginStore.PostError(error);
                        })
                        break;

                    default:
                        break;
                }
                $scope.$apply();
            }
            catch (error) {
                alert(error.message);
                LoginStore.PostError(error);
            }

        }

        // });
        //alert($scope.profile.displayname);

        $scope.doRefresh1 = function (currentdate) {

            $http({
                method: 'GET',
                url: 'https://us-central1-project-6346119287623064588.cloudfunctions.net/date'
            }).then(function successCallback(response) {

                $scope.currentdate = new Date(response.data);
                $scope.doRefresh($scope.currentdate);

            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alert(JSON.stringify(response));
            });

        }


        $scope.teamdisplayed = {
            key: "",
            name: "",
            picture: "",
            rank: ""
        }




        $scope.doRefresh = function (currentdate) {

            try {
                $scope.profile = {};

                HomeStore.GetProfileInfo(currentdate, function (leagues) {

                    console.log(leagues);

                    var todaydate = new Date();
                    var oldchallenges = [];
                    var newchallenges = [];
                    $scope.profile = leagues;

                    if ($scope.profile.photo.trim() == "") {
                        $scope.profile.photo = "img/PlayerProfile.png"
                    }

                    if ($scope.profile.teamdisplayedkey !== "none" && $scope.profile.teamdisplayedkey != "") {
                        console.log($scope.profile.teamdisplayedkey);
                        TeamStores.GetTeamInfoByKey($scope.profile.teamdisplayedkey, function (favteam) {
                            if (favteam !== null || favteam !== undefined) {

                                

                                $scope.teamdisplayed.name = favteam.teamname;
                                $scope.teamdisplayed.picture = favteam.badge;
                                $scope.teamdisplayed.rank = favteam.rank;
                                $scope.teamdisplayed.key = favteam.key;

                                console.log($scope.teamdisplayed);

                            }
                            else {
                                $scope.teamdisplayed.name = "";
                                $scope.teamdisplayed.picture = "defaultteam";
                                $scope.teamdisplayed.rank = "";
                                $scope.teamdisplayed.key = "";
                            }




                        })
                    }
                    else {
                        $scope.teamdisplayed.name = "";
                        $scope.teamdisplayed.picture = "defaultteam";
                        $scope.teamdisplayed.rank = "";
                        $scope.teamdisplayed.key = "";
                    }
                    //$scope.profile.upcominteamgmatches.push($scope.profile.upcomingmatches);

                    if (leagues.challenges.length > 0) {
                        for (var i = 0; i < leagues.challenges.length; i++) {
                            if (Math.abs(todaydate - leagues.challenges[i].date) / 36e5 > 24) {
                                oldchallenges.push(leagues.challenges[i]);
                            }
                            else {
                                newchallenges.push(leagues.challenges[i]);
                            }
                        }
                    }

                    $scope.profile.upcomingmatches = $scope.profile.upcomingmatches.concat($scope.profile.upcominteamgmatches);

                    HomeStore.DeleteOldChalleges(oldchallenges).then(function () {


                        $scope.challenges = newchallenges;
                        $scope.notloaded = false;
                        $scope.$apply();

                        $scope.showpendingchallenge = $scope.profile.challenges.length == 0 ? false : true;
                        $scope.showupcomingmatches = $scope.profile.upcominteamgmatches.length == 0 ? false : true;
                        $scope.showteaminvite = $scope.profile.teaminvitations.length == 0 ? false : true;
                        $scope.showupcomingsinglematches = $scope.profile.upcomingmatches.length == 0 ? false : true;



                        //Get the first 4 ranked teams
                        HomeStore.GetFirstFour(function (leagues) {
                            $scope.rankedteams = leagues;
                        })
                        //JSON.stringify()

                        $scope.$apply();
                    }, function (error) {
                        alert(error.message);
                        LoginStore.PostError(error);
                    })

                    $scope.$apply();
                    $scope.$broadcast('scroll.refreshComplete');


                })
            } catch (error) {
                alert(error.message);
                LoginStore.PostError(error);
            }
        }


        $scope.homepagedirect = function (opercode) {
            switch (opercode) {
                case 1:
                    $state.go('app.reservestadium');
                    break;
                case 2:
                    $state.go('app.availableplayers');
                    break;
                case 3:
                    $state.go('app.chooseyourteam');
                    break;
            }
        }

        $scope.gogamedetails = function (gameid) {

            if (gameid.gamestyle == "alonematch") {
                $state.go('app.bookings');
            }
            if (gameid.gamestyle == "teammatch") {
                $state.go('app.gamedetails',
                    {
                        gameid: gameid.key
                    })
            }

        }

        $scope.showSearch = false;
        $scope.toggleSearch = function () {
            $scope.showSearch = !$scope.showSearch;
        };


        $scope.goteamprofile = function (id) {
            if (!(id == null || id == '' || id === undefined)) {
                $state.go("app.teamview",
                    {
                        teamid: id
                    })
            }

        }



        $scope.InviteFacebook = function () {
            facebookConnectPlugin.appInvite(
                {
                    url: "http://example.com",
                    picture: "http://example.com/image.png"
                },
                function (obj) {
                    if (obj) {
                        if (obj.completionGesture == "cancel") {
                            // user canceled, bad guy
                        } else {
                            // user really invited someone :)
                        }
                    } else {
                        // user just pressed done, bad guy
                    }
                },
                function (obj) {
                    // error
                    console.log(obj);
                }
            );
        }

        $scope.ShareWhatsapp = function () {
            $cordovaSocialSharing
                .shareViaWhatsApp("TRY THE APP", "www.google.com", "applink")
                .then(function (result) {
                    // Success!
                }, function (err) {
                    // An error occurred. Show a message to the user
                });
        }

        $scope.ShareSMS = function () {
            // access multiple numbers in a string like: '0612345678,0687654321'
            $cordovaSocialSharing
                .shareViaSMS(message, number)
                .then(function (result) {
                    // Success!
                }, function (err) {
                    // An error occurred. Show a message to the user
                });
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


    .controller('ChallengeStadiumController', function ($timeout, $scope, $ionicHistory, LoginStore, $state, ReservationFact, HomeStore, $ionicPopup, $ionicLoading) {

        $scope.allfreestadiums = $state.params.challenge.stadiums;

        $scope.rating = {};
        $scope.rating.max = 5;

        $scope.readOnly = true;

        $scope.challenge = $state.params.challenge;

        $scope.selectreservestadium = function (stadium) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Decline',
                template: 'Are you sure to accept the challenge and reserve @ ' + $scope.challenge.date
            });

            confirmPopup.then(function (res) {
                if (res) {

                    $scope.search =
                        {
                            date: $scope.challenge.date
                        }

                    firebase.database().ref('/challenges/' + $scope.challenge.key).once('value').then(function (snapshot) {

                        if (snapshot.exists()) {

                            ReservationFact.CheckIfFree(stadium, $scope.search.date, function (result) {

                                if (!result) {

                                    HomeStore.RegisterTeamMatch($scope.search, "", stadium, $scope.challenge)
                                        .then(function (value) {
                                            var alertPopup = $ionicPopup.alert({
                                                cssClass: 'custom-class',
                                                template: 'Successfully Reserved'
                                            });

                                            $ionicHistory.nextViewOptions({
                                                disableBack: true
                                            });
                                            $state.go("app.gamedetails",
                                                {
                                                    gameid: $scope.challenge.key
                                                });
                                        }, function (error) {
                                            var alertPopup = $ionicPopup.show({
                                                title: 'Error',
                                                template: 'Stadium Not Available. Please Cancel the Challenge'
                                            });

                                            alertPopup.then(function (res) {
                                                $state.go("app.homepage");
                                            });

                                        })
                                }

                            }, function (error) {
                                var alertPopup = $ionicPopup.show({
                                    title: 'Error',
                                    template: 'Stadium Not Available. Please Cancel the Challenge'
                                });

                                alertPopup.then(function (res) {
                                    $state.go("app.homepage");
                                });
                            })

                        }

                        else {
                            var alertPopup = $ionicPopup.show({
                                title: 'Error',
                                template: 'Challenge has been cancelled by the opponent refresh your page'
                            });


                            alertPopup.then(function (res) {
                                $state.go("app.homepage");
                            });

                        }
                    });




                }
            })

        }

    })

