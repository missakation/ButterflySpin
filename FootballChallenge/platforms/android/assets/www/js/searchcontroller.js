﻿
angular.module('football.controllers')

    .controller('SearchController', function ($scope, SearchStore, $ionicPopup, $ionicLoading) {



        var freestadiums = [];

        $scope.search = {
            date: new Date(),
        };

        try {

        var user = firebase.auth().currentUser;

        if (user != null) {
            user.providerData.forEach(function (profile) {

                alert("  Provider-specific UID: " + profile.uid);
                alert("  Name: " + profile.displayName);
                alert("  Email: " + profile.email);
            });
        }
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
            SearchStore.SearchAvailablePlayers($scope.search, function (leagues) {
                $ionicLoading.hide();
                $scope.allfreeplayers = leagues;

            })
        }
        catch (error) {
            alert(error.message);
        }

        $scope.requestnumber = function () {

        }


    })