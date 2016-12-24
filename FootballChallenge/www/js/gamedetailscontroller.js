
angular.module('football.controllers')

    .controller('GameDetailsController', function ($scope, $ionicPopup, $ionicLoading, $state, $stateParams, TeamStores, ChallengeStore, $timeout) {

        $scope.loadingphase = false;
        $scope.isadmin = false;
        $scope.first = true;
        $scope.currentteam = "";

        $scope.myplayers = [];

        $scope.gameid = $state.params.gameid;

        //alert($scope.gameid);



        $scope.notloaded = true;
        try {
            $scope.profile = {};

            $timeout(function () {
                $scope.user = firebase.auth().currentUser;
                $scope.myid = $scope.user.uid;

                ChallengeStore.GetChallengeByKey($scope.myid, $scope.gameid, function (challengedetails) {

                    $scope.challenge = challengedetails;

                    //alert(JSON.stringify($scope.challenge));

                    if ($scope.challenge.team1adminid === $scope.myid) {
                        $scope.isadmin = true;
                        $scope.first = true;
                        $scope.currentteam = $scope.challenge.team1key;
                    }
                    else if ($scope.challenge.team2adminid === $scope.myid) {
                        $scope.isadmin = true;
                        $scope.first = false;
                        $scope.currentteam = $scope.challenge.team2key;
                    }
                    else {
                        $scope.isadmin = false;
                    }

                    if ($scope.isadmin) {



                        //get team depending on your admin key
                        TeamStores.GetTeamByKey($scope.currentteam, function (myteam) {



                            $scope.myteam = myteam;


                            $scope.myplayers = $scope.myteam.players;

                            if ($scope.isadmin) {
                                if ($scope.first) {
                                    for (var i = 0; i < $scope.myplayers.length; i++) {

                                        for (var j = 0; i < $scope.challenge.team1players.length; j++) {

                                            if ($scope.myplayers[i].key == $scope.challenge.team1players[j].key) {
                                                $scope.myplayers[i].status = $scope.challenge.team1players[j].status;
                                            }
                                            if ($scope.myplayers[i].key == $scope.myid) {
                                                $scope.myplayers[i].status = 5;
                                            }
                                        }

                                    }
                                }
                                else {
                                    for (var i = 0; i < $scope.myplayers.length; i++) {

                                        for (var j = 0; i < $scope.challenge.team2players.length; j++) {

                                            if ($scope.myplayers[i].key == $scope.challenge.team2players[j].key) {
                                                $scope.myplayers[i].status = $scope.challenge.team2players[j].status;
                                            }

                                        }
                                        if ($scope.myplayers[i].key == $scope.myid) {
                                            $scope.myplayers[i].status = 5;
                                        }

                                    }
                                }
                            }

                            $scope.notloaded = false;

                            $scope.$digest();

                        })
                    }
                    $scope.$digest();

                })
            }, 2000);
        } catch (error) {
            alert(error.message);
        }



        $scope.InvitePlayer = function(player)
        {

          /*  try {
                ChallengeStore.AcceptTeamInvitation(player).then(function () {
                            var alertPopup = $ionicPopup.alert({
                                title: 'New Team',
                                template: 'You know below to team ' + invitation.teamname
                            }).then(function () {
                                $state.go("app.teammanagement");
                            }, function (error) {
                                    alert(error.message);
                                })


                        });
            } catch (error) {
                
            }*/

        }

        $scope.gotoadd = function () {
            $state.go("app.teamadd");
        }



    })


