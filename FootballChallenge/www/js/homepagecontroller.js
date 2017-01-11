
angular.module('football.controllers')


    .controller('HomeController', function ($scope, $state, HomeStore, $timeout, $ionicPopup, $ionicLoading) {

        $scope.showteaminvite = true;
        $scope.showpendingchallenge = true;
        $scope.showupcomingmatches = true;


        $scope.notloaded = true;
        try {
            $scope.profile = {};

            $timeout(function () {
                HomeStore.GetProfileInfo(function (leagues) {
                    $scope.profile = leagues;
                    $scope.notloaded = false;

                    if ($scope.profile.challenges.length == 0) {
                        $scope.showpendingchallenge = false;
                    }
                    if ($scope.profile.upcominteamgmatches.length == 0) {
                        $scope.showupcomingmatches = false;
                    }
                    if ($scope.profile.teaminvitations.length == 0) {
                        $scope.showteaminvite = false;
                    }

                    HomeStore.GetFirstFour(function(leagues)
                    {
                        $scope.rankedteams = leagues;
                    })


                    $scope.$digest();
                })
            }, 2000);
        } catch (error) {
            alert(error.message);
        }

        $scope.acceptinvitation = function (challenge) {
            try {


                $state.go('app.choosechallengestadium', {
                    challenge: challenge
                });

            } catch (error) {
                alert(error.message);
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
                        HomeStore.DeleteChallenge(challenge).then(function () {

                            var alertPopup = $ionicPopup.alert({
                                title: 'Success',
                                template: 'Challenge Declined'
                            })
                            $scope.profile.challenges = $scope.profile.challenges.filter(function (el) {
                                return el.key !== challenge.key;
                                $scope.$digest();
                            })

                        }, function (error) {
                            alert(error.message);
                        })
                    }

                })

            } catch (error) {
                alert(error.message);
            }
        }

        $scope.acceptteaminvitation = function (invitation, x) {
            try {

                switch (x) {
                    case 1:
                        HomeStore.AcceptTeamInvitation(invitation, $scope.profile).then(function () {

                            var alertPopup = $ionicPopup.alert({
                                title: 'New Team',
                                template: 'You know below to team ' + invitation.teamname
                            }).then(function () {
                                $state.go("app.teammanagement");
                            }, function (error) {
                                    alert(error.message);
                                })


                        });
                        break;
                    case 2:
                        HomeStore.DeleteInvitation(invitation).then(function () {

                            $scope.profile.teaminvitations = $scope.profile.teaminvitations.filter(function (el) {
                                return el.key !== invitation.key;
                                $scope.$digest();
                            });

                        }, function (error) {
                                alert(error.message);
                            })
                        break;

                    default:
                        break;
                }

            } catch (error) {
                alert(error.message);
            }

        }

        // });
        //alert($scope.profile.displayname);

        $scope.doRefresh = function () {

            try {
                $scope.profile = {};

                HomeStore.GetProfileInfo(function (leagues) {
                    $scope.profile = leagues;
                    $scope.$digest();
                    $scope.$broadcast('scroll.refreshComplete');
                })
            } catch (error) {
                alert(error.message);
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
                    $state.go('app.matchmakinghome');
                    break;
            }
        }

        $scope.gogamedetails = function (gameid) {
            $state.go('app.gamedetails',
                {
                    gameid: gameid
                })
        }

                $scope.showSearch = false;
        $scope.toggleSearch = function () {
            $scope.showSearch = !$scope.showSearch;
        };


    })


    .controller('ChallengeStadiumController', function ($timeout, $scope, $state, HomeStore, $ionicPopup, $ionicLoading) {

        $scope.allfreestadiums = $state.params.challenge.stadiums;

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
                    HomeStore.RegisterTeamMatch($scope.search, "", stadium, $scope.challenge)
                        .then(function (value) {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Success',
                                template: 'Successfully Reserved'
                            });

                            $state.go("app.gamedetails",
                                {
                                    gameid: $scope.challenge.key
                                });
                        }, function (error) {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error',
                                template: 'Stadium Not Available. Please Try Again'
                            });

                            alertPopup.then(function (res) {
                                // Custom functionality....
                            });

                        })

                }
            })

        }

    })

