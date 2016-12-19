
angular.module('football.controllers')


    .controller('profilecontroller', function ($scope, ProfileStore, $ionicPopup, $ionicLoading, $timeout) {

        $scope.currentprofile = {};

        //here
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        //works
        $timeout(function () {
            ProfileStore.GetProfileInfo(function (myprofile) {

                $ionicLoading.hide();
                $scope.currentprofile = myprofile;
            })
        }, 3000);



        //$scope.value = 150;

        $scope.slider1 = {
            minValue: 1,
            maxValue: 23,
            options: {
                floor: 0,
                showSelectionBar: true,
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

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $scope.UpdateUser = function (profile) {


            ProfileStore.UpdateProfile(profile).then(function (result) {

            }, function (error) {
                alert(error.message);
            });

        }




    })
