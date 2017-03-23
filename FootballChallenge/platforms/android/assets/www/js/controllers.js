angular.module('football.controllers', [])


    .factory('LoginStore', function () {
        var TempItems = [];

        return {

            AddUser: function (newuser, registerdata) {
                try {

                    if (newuser != null) {

                        var date = new Date();
                        var char = newuser.email.charAt(0).charCodeAt(0);
                        
                        var identity = char;
                        var identity = identity.toString() + date.getDay().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();

                        var usertoadd =
                            {
                                uid: newuser.uid,
                                email: newuser.email,
                                winstreak: 0,
                                userdescription: "",
                                telephone: "",
                                enableinvitations: true,
                                highestrating: 1500,
                                firstname: registerdata.firstname,
                                lastname: registerdata.lastname,
                                status: "0",
                                playposition: "Defender",
                                displayname: registerdata.displayname,
                                favouritesport: "football",
                                middlename: "",
                                ranking: 100,
                                cancelled: 0,
                                cancelledweather: 0,
                                didnotshowup: 0,
                                startmonday: 0,
                                startmondayend: 0,
                                starttuesday: 0,
                                starttuesdayend: 0,
                                startwednesday: 0,
                                startwednesdayend: 0,
                                startthursday: 0,
                                startthursdayend: 0,
                                startfriday: 0,
                                startfridayend: 0,
                                startsaturday: 0,
                                startsaturdayend: 0,
                                startsunday: 0,
                                startsundayend: 0,
                                favstadium: "",
                                favstadiumphoto: "",
                                photoURL: "",
                                comments: "",
                                ageset: 0,
                                ageyear: 1,
                                agemonth: 1,
                                ageday: 1990,
                                identity: identity

                            }
                        //alert(newPostKey);
                        // Write the new post's data simultaneously in the posts list and the user's post list.
                        var updates = {};
                        updates['/players/' + usertoadd.uid + '/'] = usertoadd;
                        updates['/playersinfo/' + usertoadd.uid + '/'] = usertoadd;

                        return firebase.database().ref().update(updates);

                    }
                }
                catch (error) {
                    alert(error.message);
                }

            },
            GetUser: function (callback) {

                var exists = false;

                var user = firebase.auth().currentUser;

                var id = user.uid;

                try {
                    var query = firebase.database().ref('players/' + id);
                    query.once("value").then(function (snapshot) {

                        if (snapshot.exists()) {
                            exists = true;
                        }
                        callback(exists);

                    }, function (error) {
                        alert(error.message);
                    });


                }
                catch (error) {
                    alert(error.message);
                }

            },
            AddFbUser: function (newuser) {
                try {
                    var user = firebase.auth().currentUser;
                    var id = user.uid;
                    if (newuser != null) {
                        var date = new Date();
                        var identity = "" + String.fromCharCode(newuser.email[0]);
                        identity = identity + date.getDay() + date.getSeconds() + date.getMilliseconds();
                        var usertoadd =
                            {
                                uid: id,
                                email: newuser.email == null ? "" : newuser.email,
                                winstreak: 0,
                                userdescription: "",
                                telephone: "",
                                enableinvitations: true,
                                highestrating: 1500,
                                firstname: "",
                                lastname: "",
                                status: "0",
                                playposition: "Defender",
                                displayname: newuser.displayName == null ? "" : newuser.displayName,
                                favouritesport: "football",
                                middlename: "",
                                ranking: 100,
                                cancelled: 0,
                                cancelledweather: 0,
                                didnotshowup: 0,
                                startmonday: 0,
                                startmondayend: 23,
                                starttuesday: 0,
                                starttuesdayend: 23,
                                startwednesday: 0,
                                startwednesdayend: 23,
                                startthursday: 0,
                                startthursdayend: 23,
                                startfriday: 0,
                                startfridayend: 23,
                                startsaturday: 0,
                                startsaturdayend: 23,
                                startsunday: 0,
                                startsundayend: 23,
                                favstadium: "",
                                favstadiumphoto: "",
                                photoURL: newuser.photoURL == null ? "" : newuser.photoURL,
                                comments: "",
                                ageset: 0,
                                ageyear: 1,
                                agemonth: 1,
                                ageday: 1990,
                                identity:identity

                            }
                        //alert(newPostKey);
                        // Write the new post's data simultaneously in the posts list and the user's post list.
                        var updates = {};
                        updates['/players/' + usertoadd.uid + '/'] = usertoadd;
                        updates['/playersinfo/' + usertoadd.uid + '/'] = usertoadd;

                        return firebase.database().ref().update(updates);

                    }
                }
                catch (error) {
                    alert(error.message);
                }

            }

        }

    })


    .controller('LoginController', function ($scope, $ionicModal, $ionicPopup, $timeout, $state, LoginStore) {

        $scope.loginData = {};
        $scope.myprofile = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            firebase.auth().signOut().then(function () {
                // Sign-out successful.
                alert("Logged Out");
            }, function (error) {
                // An error happened.
                alert(error.message);
            });
            // $scope.modal.hide();
        };

        $scope.registerdata =
            {

                displayname: '',
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                confirmpassword: ''
            }

        $scope.registerusername = 'missakboya1@live.com';
        $scope.registerpassword = 'supermanbaba';

        $scope.Register = function () {


            try {



                firebase.auth().createUserWithEmailAndPassword($scope.registerdata.email, $scope.registerdata.password).then(function (user) {
                    var newuser = firebase.auth().currentUser;
                    var name, email, photoUrl, uid;



                    if (user != null) {

                        LoginStore.GetUser(function (data) {
                            if (data) {
                                $state.go("app.homepage");

                            }
                            else {

                                LoginStore.AddUser(newuser, $scope.registerdata).then(function (user) {
                                    var user = firebase.auth().currentUser;

                                    user.sendEmailVerification().then(function () {

                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Account Registed',
                                            template: 'Thank you for registering. Check your email or verification.You will be redirected to the homepage'
                                        });

                                        alertPopup.then(function () {
                                            $state.go("app.homepage");
                                        });
                                    }, function (error) {
                                        alert(error.message);
                                    });

                                }, function (error) {
                                    // An error happened.
                                });

                            }


                        });

                    }

                }).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    alert(errorMessage);


                    // ...
                });
            } catch (error) {
                alert(error.message);
            }



        };


        $scope.LogIn = function (username) {

            firebase.auth().signInWithEmailAndPassword($scope.registerusername, $scope.registerpassword).then(function (user) {


                LoginStore.GetUser(function (data) {
                    if (data) {

                        $state.go('app.homepage');
                    }
                    else {
                        var user = firebase.auth().currentUser;

                        user.sendEmailVerification().then(function () {
                            LoginStore.AddUser(user).then(function (result) {

                                $state.go('app.homepage');

                            }, function (error) {
                                alert(error.message);
                            });

                        }, function (error) {
                            // An error happened.
                        });



                    }

                });

            })
                .catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    alert(errorMessage);
                    // ...
                });
        };



        $scope.FacebookLogin = function () {
            try {
                // alert("test1");
                var auth = firebase.auth();
                // alert("test2");
                facebookConnectPlugin.login(['email', 'public_profile', 'user_friends'], //first argument is an array of scope permissions
                    function (userData) {

                        if (userData.authResponse) {
                            facebookConnectPlugin.api('me/?fields=email,name,first_name,last_name', ["public_profile"],
                                function (infoesult) {

                                    facebookConnectPlugin.getAccessToken(function (token) {
                                        //alert("Token: " + token);
                                        var credential = firebase.auth.FacebookAuthProvider.credential(token);
                                        firebase.auth().signInWithCredential(credential).then(function (result) {
                                            $scope.myprofile = result;
                                            $timeout(function () {
                                                var user = firebase.auth().currentUser;
                                                if (user) {

                                                    LoginStore.GetUser(function (data) {
                                                        if (data) {
                                                            $state.go('app.homepage');
                                                        }
                                                        else {
                                                            LoginStore.AddFbUser($scope.myprofile).then(function (result) {
                                                                $state.go('app.homepage');
                                                            }, function (error) {
                                                                alert(error.message);
                                                            });
                                                        }
                                                    });

                                                }
                                            }, 3000);



                                        }).catch(function (error) {
                                            // Handle Errors here.
                                            alert(error.code);
                                            alert(error.message);
                                            // ...
                                        });
                                    });
                                    //         alert(JSON.stringify(infoesult));
                                    //         alert('Good to see you, ' +
                                    //             infoesult.email + infoesult.name + '.');

                                });

                        }

                    },
                    function (error) {
                        alert(error);

                        alert(JSON.stringify(error));
                    }
                )
            }
            catch (error) {
                alert(error.message);
            }

        };


        //firebase.auth().onAuthStateChanged(function (user) {

        //    alert("test");

        //});




        $scope.GoToRegister = function () {
            $state.go('registerpage');
        };
        $scope.GoToForgetPass = function () {
            $state.go('loginforgotpass');
        };


    })

    .controller('FirstPageController', function ($scope, $ionicPopover, $ionicLoading, $state, $timeout) {


        try {
            $timeout(function () {
                var user = firebase.auth().currentUser;

                if (user) {
                    $state.go('app.homepage');
                } else {
                    $state.go('signin');
                }

            }, 3000);


        }
        catch (error) {
            alert(error.message);
        }


    })

    //add $ionicPush
    .controller('MenuController', function ($scope, $state, $stateParams, $ionicPopup, $ionicLoading) {
        $scope.logout = function () {

            try {
                firebase.auth().signOut().then(function () {
                    $state.go('signin');
                }, function (error) {
                    alert(error.message);
                });

            }
            catch (error) {
                alert(error.message);
            }
        }
    })

    .controller('FeedBackController', ['$scope', function ($scope) {

        $scope.submit = function () {
            //$scope.list.push(this.text);
            //$scope.text = '';
            alert("Yo")
            $scope.text = 'tee';

        };
    }])

    .controller('LoginPassController', function ($scope, $state, $ionicPopup) {


        $scope.email =
            {
                address: "aa"
            }

        $scope.submit = function () {
            alert("test");
            try {
                var auth = firebase.auth();
                var emailAddress = $scope.email.address;

                alert(emailAddress);

                auth.sendPasswordResetEmail(emailAddress).then(function () {

                    var alertPopup = $ionicPopup.alert({
                        title: 'Reset Password',
                        template: 'An email has been sent to your email to reset'
                    });

                    alertPopup.then(function () {
                        $state.go("signin");
                    });

                }, function (error) {

                });
            } catch (error) {
                alert(error.message);
            }


        };
    })


    .controller('SubmitSearch', function ($scope, $ionicModal, $timeout, $state) {
        alert("Yo"); $scope.submit = function () {


            $state.go('availablestadiums');
        };
    })




    ;
