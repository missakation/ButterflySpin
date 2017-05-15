﻿
angular.module('football.controllers')


    .controller('profilecontroller', function ($scope, ProfileStore, $ionicPopup, TeamStores, $state, $stateParams, $ionicLoading, $timeout) {


        $scope.$on("$ionicView.afterEnter", function (event, data) {

            $scope.refreshpage();

        });




        $scope.currentprofile = {};

        $scope.teamdisplayed = {
            key: "",
            name: "",
            picture: "",
            rank: ""
        }

        //here
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $scope.notloaded = false;

        $scope.refreshpage = function () {
            //works
            $timeout(function () {
                ProfileStore.GetProfileInfo(function (myprofile) {
                    console.log(myprofile);
                    $scope.currentprofile = myprofile;
                    if ($scope.currentprofile.photo.trim() == "") {
                        $scope.currentprofile.photo = "img/PlayerProfile.png"
                    }

                    if (myprofile.teamdisplayedkey !== "none") {
                        TeamStores.GetTeamInfoByKey(myprofile.teamdisplayedkey, function (favteam) {
                            if (favteam !== null || favteam !== undefined) {

                                $scope.teamdisplayed.name = favteam.teamname;
                                $scope.teamdisplayed.picture = favteam.badge;
                                $scope.teamdisplayed.rank = favteam.rank;
                                $scope.teamdisplayed.key = favteam.key;

                            }
                            else {
                                $scope.teamdisplayed.name = "";
                                $scope.teamdisplayed.picture = "defaultteam";
                                $scope.teamdisplayed.rank = "";
                                $scope.teamdisplayed.key = "";
                            }

                            //$scope.currentprofile["teamdisplayed"] = $scope.teamdisplayed.name == "" ? "Select a Team" : $scope.teamdisplayed.name;



                        })
                    }
                    else {
                        $scope.teamdisplayed.name = "";
                        $scope.teamdisplayed.picture = "defaultteam";
                        $scope.teamdisplayed.rank = "";
                        $scope.teamdisplayed.key = "";
                    }

                    $scope.notloaded = true;
                    $ionicLoading.hide();
                    $scope.$apply();
                    $scope.$broadcast('scroll.refreshComplete');


                }, function (error) {

                })
            }, 3000);
        }

        $scope.gototeam = function (key) {
            if (!(key == null || key == '' || key === undefined)) {
                $state.go("app.teamprofile",
                    {
                        teamid: key
                    })
            }
        }



        $scope.tabs =
            {
                Available: true,
                Members: false,
                Statistics: false
            }

        $scope.status =
            {
                Available: "solid",
                Members: "none",
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

        $scope.doRefresh = function () {
            $scope.refreshpage();
        }




    })
    .controller('ProfileEditController', function ($cordovaImagePicker, $scope,SMSService, $ionicHistory, ProfileStore1, $ionicLoading, $timeout, $ionicPopup, $stateParams, $state, TeamStores, FirebaseStorageService) {

        $scope.currentprofile = $state.params.myprofile;


        $scope.isplayercolors = {
            player:
            {
                color: '#2ab041',
                backcolor: 'white'
            },
            goalkeeper:
            {
                color: '#2ab041',
                backcolor: 'white'
            }
        }

        if ($scope.currentprofile.isplayer) {
            $scope.isplayercolors.player.color = 'white';
            $scope.isplayercolors.player.backcolor = '#2ab041';

            $scope.isplayercolors.goalkeeper.color = '#2ab041';
            $scope.isplayercolors.goalkeeper.backcolor = 'white';
        }
        else {
            $scope.isplayercolors.player.color = '#2ab041';
            $scope.isplayercolors.player.backcolor = 'white';

            $scope.isplayercolors.goalkeeper.color = 'white';
            $scope.isplayercolors.goalkeeper.backcolor = '#2ab041';
        }

        $scope.gochoosestadium = function (team) {
            $state.go("app.choosestadium", {
                myteam: $scope.currentprofile
            })
        }

        $scope.switchcolors = function (x) {
            switch (x) {
                case 0:
                    $scope.currentprofile.isplayer = true;
                    $scope.isplayercolors.player.color = 'white';
                    $scope.isplayercolors.player.backcolor = '#2ab041';

                    $scope.isplayercolors.goalkeeper.color = '#2ab041';
                    $scope.isplayercolors.goalkeeper.backcolor = 'white';
                    break;
                case 1:
                    $scope.currentprofile.isplayer = false;
                    $scope.isplayercolors.player.color = '#2ab041';
                    $scope.isplayercolors.player.backcolor = 'white';

                    $scope.isplayercolors.goalkeeper.color = 'white';
                    $scope.isplayercolors.goalkeeper.backcolor = '#2ab041';
                    break;


            }
            $scope.$apply();
        }

        $scope.checkMobileNumber = function (e, verified) {
            console.log(111, verified);
            if (verified) {
                $scope.currentprofile.available = verified;
                $scope.$apply();
            }
            if ($scope.currentprofile.available && !verified) {
                e.preventDefault();
                $scope.currentprofile.available = !$scope.currentprofile.available;
                var userId = firebase.auth().currentUser.uid;
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                firebase.database().ref('/players/' + userId).once('value').then(function (snapshot) {
                    $ionicLoading.hide();
                    if (!snapshot.val().isMobileVerified) {
                        SMSService.verifyUserMobile($scope, $scope.checkMobileNumber, [e, true])
                    } else {
                        $scope.currentprofile.available = !$scope.currentprofile.available;
                    }
                });
            }
        };


        $scope.sliderskill = {
            value: 3,
            options: {
                showSelectionBar: true,
                floor: 0,
                ceil: 3,
                showSelectionBar: true,
                hideLimitLabels: true,
                stepsArray: ['Newbie', 'Not Bad', 'Solid', 'Pro']

            }
        };


        $scope.slider1 = {
            minValue: 7,
            maxValue: 23,

            options: {
                floor: 7,
                showSelectionBar: true,
                readOnly: true,
                disabled: true,
                hideLimitLabels: true,
                autoHideLimitLabels: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return '#2ab041';

                },
                ceil: 23,
                draggableRange: false

            }
        };

        $scope.slider2 = {
            minValue: 7,
            maxValue: 23,
            options: {
                floor: 7,
                showSelectionBar: true,
                readOnly: true,
                disabled: true,
                hideLimitLabels: true,
                autoHideLimitLabels: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return '#2ab041';
                },
                ceil: 23,
                draggableRange: false

            }
        };


        $scope.slider3 = {
            minValue: 7,
            maxValue: 23,
            options: {
                floor: 7,
                showSelectionBar: true,
                readOnly: true,
                disabled: true,
                hideLimitLabels: true,
                autoHideLimitLabels: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return '#2ab041';

                },
                ceil: 23,
                draggableRange: false

            }
        };


        $scope.slider4 = {
            minValue: 7,
            maxValue: 23,
            options: {
                floor: 7,
                showSelectionBar: true,
                readOnly: true,
                disabled: true,
                hideLimitLabels: true,
                autoHideLimitLabels: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return '#2ab041';

                },
                ceil: 23,
                draggableRange: false

            }
        };


        $scope.slider5 = {
            minValue: 7,
            maxValue: 23,
            options: {
                floor: 7,
                showSelectionBar: true,
                readOnly: true,
                disabled: true,
                hideLimitLabels: true,
                autoHideLimitLabels: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return '#2ab041';

                },
                ceil: 23,
                draggableRange: false

            }
        };

        $scope.slider6 = {
            minValue: 7,
            maxValue: 23,
            options: {
                floor: 7,
                showSelectionBar: true,
                readOnly: true,
                disabled: true,
                hideLimitLabels: true,
                autoHideLimitLabels: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return '#2ab041';

                },
                ceil: 23,
                draggableRange: false

            }
        };

        $scope.slider7 = {
            minValue: 7,
            maxValue: 23,

            options: {
                floor: 7,
                showSelectionBar: true,
                readOnly: true,
                hideLimitLabels: true,
                autoHideLimitLabels: true,
                disabled: true,
                getSelectionBarColor: function (value) {
                    return 'White';
                },
                getPointerColor: function (value) {
                    return '#2ab041';

                },
                ceil: 23,
                draggableRange: false

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

            console.log(profile);

            if ($scope.currentprofile.teamdisplayed == "Select a Team" || $scope.currentprofile.teamdisplayed == "" || $scope.currentprofile.teamdisplayed == null) {
                $scope.currentprofile.teamdisplayedkey = "none";
            }
            else {
                for (var i = 0; i < $scope.currentprofile.myteams.length; i++) {

                    if ($scope.currentprofile.myteams[i].teamname == $scope.currentprofile.teamdisplayed) {
                        $scope.currentprofile.teamdisplayedkey = $scope.currentprofile.myteams[i].key;
                    }

                }
            }

            ProfileStore1.UpdateProfile($scope.currentprofile, true).then(function (result) {

                $ionicHistory.goBack();

            }, function (error) {
                alert(error.message);
            });

        }

        $scope.progress = 0;
        $scope.uploading = false;

        $scope.ChangePicture = function () {
            // var options = {
            //     maximumImagesCount: 1,
            //     width: 800,
            //     height: 800,
            //     quality: 75
            // };

            console.log(JSON.stringify(window.Camera))

            var options = {
                quality: 70,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                encodingType: Camera.EncodingType.PNG,
                allowEdit: true,
                targetWidth: 400,
                targetHeight: 400,
                saveToPhotoAlbum: false
            };


            /*var getFileBlob = function (url, cb) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url);
                xhr.responseType = "blob";
                xhr.addEventListener('load', function() {
                    cb(xhr.response);
                });
                xhr.send();
            };
 
            var blobToFile = function (blob, name) {
                    blob.lastModifiedDate = new Date();
                    blob.name = name;
                    return blob;
            };
 
            var getFileObject = function(filePathOrUrl, cb) {
                getFileBlob(filePathOrUrl, function (blob) {
                    cb(blobToFile(blob, 'test.jpg'));
                });
            };
 
            getFileObject('img/test.jpg', function (fileObject) {
                console.log(fileObject);
            })*/

            navigator.camera.getPicture(function (imageURI) {
                $scope.currentprofile.photo = "data:image/png;base64," + imageURI;

                FirebaseStorageService.saveUserProfilePicture($scope.currentprofile.photo, firebase.auth().currentUser.uid).then(function (imageUrl) {
                    $scope.currentprofile.photo = imageUrl;
                    $scope.$apply();
                }, function (error) {
                    $scope.currentprofile.photo = "img/PlayerProfile.png";
                    $scope.$apply();
                    alert("Unable to save image to storage.")
                })

                $scope.$apply();

                // $scope.$apply();
                // //console.log('Image URI: ' + results[0]);
                //
                // // File or Blob named mountains.jpg
                // var file = results[0];
                //
                // // Create the file metadata
                // var metadata = {
                //     contentType: 'image/jpeg'
                // };
                //
                // var user = firebase.auth().currentUser;
                // var id = user.uid;
                //
                // $scope.uploading = true;
                //
                // // Upload file and metadata to the object 'images/mountains.jpg'
                // var uploadTask = storageRef.child('playerimages/' + '/' + id + '/' + file.name).put(file, metadata);
                //
                // // Listen for state changes, errors, and completion of the upload.
                // uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                //     function (snapshot) {
                //         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                //         $scope.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                //         //console.log('Upload is ' + progress + '% done');
                //         switch (snapshot.state) {
                //             case firebase.storage.TaskState.PAUSED: // or 'paused'
                //                 console.log('Upload is paused');
                //                 break;
                //             case firebase.storage.TaskState.RUNNING: // or 'running'
                //                 console.log('Upload is running');
                //                 break;
                //         }
                //     }, function (error) {
                //         switch (error.code) {
                //             case 'storage/unauthorized':
                //                 // User doesn't have permission to access the object
                //                 break;
                //
                //             case 'storage/canceled':
                //                 // User canceled the upload
                //                 break;
                //
                //             case 'storage/unknown':
                //                 // Unknown error occurred, inspect error.serverResponse
                //                 break;
                //         }
                //         $scope.$apply();
                //     }, function () {
                //         // Upload completed successfully, now we can get the download URL
                //         var downloadURL = uploadTask.snapshot.downloadURL;
                //     });

            }, function (error) {
                console.log(error);
                // error getting photos
            }, options)
        }

    })

    .controller('ProfileViewController', function ($scope, HomeStore, ProfileStore, $ionicPopup, TeamStores, $state, $stateParams, $ionicLoading, $timeout) {


        $stateParams.key

        $scope.$on("$ionicView.beforeEnter", function (event, data) {

            if ($stateParams.key == firebase.auth().currentUser.uid) {
                $state.go("app.selfprofile");
            }

        });

        $scope.$on("$ionicView.afterEnter", function (event, data) {

            $scope.refreshpage();

        });




        $scope.currentprofile = {};
        $scope.teamdisplayed = {
            key: "",
            name: "",
            picture: "",
            rank: ""
        }

        //here
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $scope.notloaded = false;

        $scope.refreshpage = function () {
            //works
            $timeout(function () {
                HomeStore.GetProfileInfoByKey($stateParams.key, function (myprofile) {
                    if (myprofile.teamdisplayedkey !== "none") {
                        TeamStores.GetTeamInfoByKey(myprofile.teamdisplayedkey, function (favteam) {
                            if (favteam !== null || favteam !== undefined) {

                                $scope.teamdisplayed.name = favteam.teamname;
                                $scope.teamdisplayed.picture = favteam.badge;
                                $scope.teamdisplayed.rank = favteam.rank;
                                $scope.teamdisplayed.key = favteam.key;

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

                    $scope.notloaded = true;
                    $ionicLoading.hide();
                    $scope.currentprofile = myprofile;
                    if ($scope.currentprofile.photo.trim() == "") {
                        $scope.currentprofile.photo = "img/PlayerProfile.png"
                    }
                    $scope.$apply();
                    $scope.$broadcast('scroll.refreshComplete');


                }, function (error) {

                })
            }, 1000);
        }

        $scope.gototeam = function (key) {
            if (!(key == null || key == '' || key === undefined)) {
                $state.go("app.teamprofile",
                    {
                        teamid: key
                    })
            }
        }

        $scope.tabs =
            {
                Available: true,
                Statistics: false
            }

        $scope.status =
            {
                Available: "solid",
                Statistics: "none"
            }

        $scope.switchscreens = function (x) {
            switch (x) {
                case 1:
                    $scope.tabs.Available = false;
                    $scope.tabs.Statistics = false;
                    $scope.tabs.Available = true;

                    $scope.status.Available = "none";
                    $scope.status.Statistics = "none";
                    $scope.status.Available = "solid";

                    break;

                case 2:
                    $scope.tabs.Available = false;
                    $scope.tabs.Statistics = false;
                    $scope.tabs.Statistics = true;

                    $scope.status.Available = "none";
                    $scope.status.Statistics = "none";

                    $scope.status.Statistics = "solid";

                    break;

                case 3:
                    $scope.tabs.Available = false;
                    $scope.tabs.Statistics = false;

                    $scope.status.Available = "none";
                    $scope.status.Statistics = "none";

                    break;
            }
        }

        $scope.doRefresh = function () {
            $scope.refreshpage();
        }




    })