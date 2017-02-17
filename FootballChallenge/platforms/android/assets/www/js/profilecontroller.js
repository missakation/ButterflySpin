
angular.module('football.controllers')


    .controller('profilecontroller', function ($scope, ProfileStore, $ionicPopup, $state, $stateParams, $ionicLoading, $timeout) {

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
    .controller('ProfileEditController', function ($cordovaImagePicker, $scope, $ionicHistory, ProfileStore1, $ionicLoading, $state, $stateParams, $timeout, $ionicPopup, $stateParams, $state, TeamStores) {

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

                $ionicHistory.goBack();

            }, function (error) {
                alert(error.message);
            });

        }

        $scope.progress = 0;
        $scope.uploading = false;

        $scope.ChangePicture = function () {
            var options = {
                maximumImagesCount: 1,
                width: 800,
                height: 800,
                quality: 80
            };

            $cordovaImagePicker.getPictures(options)
                .then(function (results) {
                    //console.log('Image URI: ' + results[0]);

                    // File or Blob named mountains.jpg
                    var file = results[0];

                    // Create the file metadata
                    var metadata = {
                        contentType: 'image/jpeg'
                    };

                    var user = firebase.auth().currentUser;
                    var id = user.uid;

                    $scope.uploading = true;

                    // Upload file and metadata to the object 'images/mountains.jpg'
                    var uploadTask = storageRef.child('playerimages/' + '/' + id + '/' + file.name).put(file, metadata);

                    // Listen for state changes, errors, and completion of the upload.
                    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                        function (snapshot) {
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                            $scope.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            //console.log('Upload is ' + progress + '% done');
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED: // or 'paused'
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING: // or 'running'
                                    console.log('Upload is running');
                                    break;
                            }
                        }, function (error) {
                            switch (error.code) {
                                case 'storage/unauthorized':
                                    // User doesn't have permission to access the object
                                    break;

                                case 'storage/canceled':
                                    // User canceled the upload
                                    break;

                                case 'storage/unknown':
                                    // Unknown error occurred, inspect error.serverResponse
                                    break;
                            }
                            $scope.$apply();
                        }, function () {
                            // Upload completed successfully, now we can get the download URL
                            var downloadURL = uploadTask.snapshot.downloadURL;
                        });

                }, function (error) {
                    // error getting photos
                });
        }

    })