
angular.module('football.controllers')

    .controller('SearchController', function ($scope, SearchStore, $ionicPopup,$timeout, $ionicLoading) {



        var freestadiums = [];

        $scope.search = {
            date: new Date(),
        };

        

        var user = firebase.auth().currentUser;

     /*   if (user != null) {
            user.providerData.forEach(function (profile) {

                alert("  Provider-specific UID: " + profile.uid);
                alert("  Name: " + profile.displayName);
                alert("  Email: " + profile.email);
            });
        }*/
        
            $scope.search.date.setDate($scope.search.date.getDate() + 1);
            $scope.search.date.setHours(21);
            $scope.search.date.setMinutes(0);
            $scope.search.date.setMilliseconds(0);
            $scope.search.date.setSeconds(0);

            $scope.allfreeplayers = [];

            $scope.checkfree = function (search) {

                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });

                //})
                SearchStore.SearchAvailablePlayers($scope.search, function (leagues) {
                    $ionicLoading.hide();
                    $scope.allfreeplayers = leagues;

                })

            }


            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            //})
            try {
            $timeout(function()
            {
            SearchStore.SearchAvailablePlayers($scope.search, function (leagues) {
                $scope.allfreeplayers = leagues;
                
                SearchStore.GetMyProfileInfo( function (profile) {
                $ionicLoading.hide();
                $scope.myprofile = profile;
            })
            })
            },2000)

        }
        catch (error) {
            alert(error.message);
        }

        $scope.requestnumber = function (player) {

            

         if(!player.status>0)
            {
                
               SearchStore.RequestNumber($scope.myprofile,player).then(function (value) 
                 {

                      player.status=1;
                      player.statusdesc = "Number Requested";
                      player.color="white";
                      player.backcolor="#2ab042";
                      $scope.apply();

                 }, function (error)
            {
                    alert(error.message);
            })

           }
           
        }


    })
