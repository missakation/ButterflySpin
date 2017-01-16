
angular.module('football.controllers')


    .controller('profilecontroller', function ($scope, ProfileStore, $ionicPopup,$state, $stateParams, $ionicLoading, $timeout) {

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

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });


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


        $scope.goupdate = function () {
            $state.go('app.selfprofileedit',

                {
                    myprofile: $scope.currentprofile
                });
        }

                $scope.gogamedetails = function (gameid) {
            $state.go('app.gamedetails',
                {
                    gameid: gameid
                })
        }


    })
    .controller('ProfileEditController', function ($scope,ProfileStore1, $ionicLoading,$state, $stateParams, $timeout, $ionicPopup, $stateParams, $state, TeamStores) {

        $scope.currentprofile = $state.params.myprofile;


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

        $scope.UpdateUser = function (profile) {

            ProfileStore1.UpdateProfile(profile).then(function (result) {

            }, function (error) {
                alert(error.message);
            });

        }

    })