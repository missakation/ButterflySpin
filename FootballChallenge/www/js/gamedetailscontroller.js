
angular.module('football.controllers')

    .controller('GameDetailsController', function ($scope, $ionicPopup, $ionicLoading, $state, $stateParams, TeamStores, $timeout) {

        $scope.loadingphase = false;
        $scope.isadmin = false;
        $scope.first = true;
        $scope.currentteam = "";



        $scope.gameid = $state.params.gameid;

        //alert($scope.gameid);

        $scope.inviteplayer = function (key) {

        }

        $scope.notloaded = true;
        try {
            $scope.profile = {};

            $timeout(function () {
                $scope.user = firebase.auth().currentUser;
                $scope.myid = user.uid;
                ChallengeStore.GetChallengeByKey($scope.gameid,function (challengedetails) {

                    $scope.challenge = challengedetails;

                    if ($scope.challenge.team1admin == $scope.myid) {
                        $scope.isadmin = true;
                        $scope.first = true;
                        $scope.currentteam = $scope.challenge.team1key;
                    }
                    else if ($scope.challenge.team1admin == $scope.myid) {
                        $scope.isadmin = false;
                        $scope.first = false;
                        $scope.currentteam = $scope.challenge.team2key;
                    }

                    if ($scope.isadmin) {
                        TeamStores.GetTeamByKey($scope.currentteam, function (myteam) {

                            $scope.myteam = myteam;

                            

                            $scope.profile = leagues;
                            $scope.notloaded = false;

                        })
                    }

                })
            }, 2000);
        } catch (error) {
            alert(error.message);
        }






        /*  $ionicLoading.show({
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: true,
              maxWidth: 200,
              showDelay: 0
          });
  
          //works
          $timeout(function () {
  
              try {
  
                  TeamStores.GetMyTeams(function (leagues) {
  
                      $ionicLoading.hide();
                      $scope.test = leagues;
  
                      if (leagues.length == 0) {
                          var alertPopup = $ionicPopup.alert({
                              title: 'Error',
                              template: 'No Available Stadiums'
                          });
                      }
  
                  })
  
              }
              catch (error) {
                  alert(error.message);
              }
          }, 2000)*/

        $scope.gotoadd = function () {
            $state.go("app.teamadd");
        }



    })


