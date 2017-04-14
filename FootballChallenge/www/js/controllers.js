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
                                startmonday: 7,
                                startmondayend: 23,
                                starttuesday: 7,
                                starttuesdayend: 23,
                                startwednesday: 7,
                                startwednesdayend: 23,
                                startthursday: 7,
                                startthursdayend: 23,
                                startfriday: 7,
                                startfridayend: 23,
                                startsaturday: 7,
                                startsaturdayend: 23,
                                startsunday: 7,
                                startsundayend: 23,
                                favstadium: "",
                                favstadiumphoto: "",
                                photoURL: "",
                                comments: "",
                                ageset: 0,
                                ageyear: 1990,
                                agemonth: 1,
                                ageday: 1,
                                identity: identity,
                                playerstatus: true,
                                available: false,
                                isplayer: true,
                                teamdisplayed: "none",
                                teamdisplayedkey: "none",

                                skillevel: "newbie",
                                isbanned: false

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
                                firstname: newuser.displayName == null ? "" : newuser.displayName,
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
                                startmonday: 7,
                                startmondayend: 23,
                                starttuesday: 7,
                                starttuesdayend: 23,
                                startwednesday: 7,
                                startwednesdayend: 23,
                                startthursday: 7,
                                startthursdayend: 23,
                                startfriday: 7,
                                startfridayend: 23,
                                startsaturday: 7,
                                startsaturdayend: 23,
                                startsunday: 7,
                                startsundayend: 23,
                                favstadium: "",
                                favstadiumphoto: "",
                                photoURL: newuser.photoURL == null ? "" : newuser.photoURL,
                                comments: "",
                                ageset: 0,
                                ageyear: 1990,
                                agemonth: 1,
                                ageday: 1,
                                identity: identity,
                                playerstatus: true,

                                available: false,
                                isplayer: true,
                                teamdisplayed: "none",
                                teamdisplayedkey: "none",
                                skillevel: "newbie",
                                isbanned: false


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
            PostError(error) {
                var user = firebase.auth().currentUser;
                if (!(user == undefined || user != null)) {
                    var id = user.uid;

                    var errortoadd =
                        {
                            uid: newuser.uid,
                            errorcode: error.code,
                            errordescription: error.message,
                            date: new Date()
                        };
                    var newPostKey = firebase.database().ref().child('errors').push().key;
                    var updates = {};
                    updates['/errors/' + newPostKey] = errortoadd;
                    return firebase.database().ref().update(updates);


                }
                return 0;

            },
            getRatingDelta: function (myRating, opponentRating, myGameResult) {

                if ([0, 0.5, 1].indexOf(myGameResult) === -1) {
                    return null;
                }

                var myChanceToWin = 1 / (1 + Math.pow(10, (opponentRating - myRating) / 400));

                return Math.round(32 * (myGameResult - myChanceToWin));
            },

            getNewRating: function (myRating, opponentRating, myGameResult) {
                return myRating + this.getRatingDelta(myRating, opponentRating, myGameResult);
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


        $scope.myRating = 1600;
        $scope.opponentRating = 1700;
        $scope.gameResult = '1';

        $scope.newRating = LoginStore.getNewRating(+$scope.myRating, +$scope.opponentRating, +$scope.gameResult);
        $scope.ratingDelta = LoginStore.getRatingDelta(+$scope.myRating, +$scope.opponentRating, +$scope.gameResult);









        // since I can connect from multiple devices or browser tabs, we store each connection instance separately
        // any time that connectionsRef's value is null (i.e. has no children) I am offline
        var myConnectionsRef = firebase.database().ref('testusers/joe/connections');

        // stores the timestamp of my last disconnect (the last time I was seen online)
        var lastOnlineRef = firebase.database().ref('testusers/joe/lastOnline');

        var connectedRef = firebase.database().ref('.info/connected');
        connectedRef.on('value', function (snap) {
            if (snap.val() === true) {
                // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)

                // add this device to my connections list
                // this value could contain info about the device or a timestamp too
                var con = myConnectionsRef.push(true);

                // when I disconnect, remove this device
                con.onDisconnect().remove();

                // when I disconnect, update the last time I was seen online
                lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
            }
        });























        //alert($scope.newRating);
        //alert($scope.ratingDelta);


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

        /*var Elo = require('arpad');

        var elo = new Elo();

        var alice = 1600;
        var bob = 1300;

        var new_alice = elo.newRatingIfWon(alice, bob);
        alert("Alice's new rating if she won:", new_alice); // 1605 

        var new_bob = elo.newRatingIfWon(bob, alice);
        alert("Bob's new rating if he won:", new_bob); // 1327*/


        //var EWP_X = 1/(1+10^((PlayerY-PlayerX)/400)); 

        //alert(1 / (1 + 10 ^ ((1500 - 2000) / 400)));

        $scope.Register = function () {


            try {



                firebase.auth().createUserWithEmailAndPassword($scope.registerdata.email, $scope.registerdata.password).then(function (user) {
                    var newuser = firebase.auth().currentUser;
                    var name, email, photoUrl, uid;



                    if (user != null && newuser != null && newuser != undefined) {

                        LoginStore.GetUser(function (data) {
                            if (data) {
                                $state.go("app.homepage");

                            }
                            else {

                                LoginStore.AddUser(newuser, $scope.registerdata).then(function (user) {
                                    var user = firebase.auth().currentUser;

                                    user.sendEmailVerification().then(function () {

                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Account Registered',
                                            template: 'Thank you for registering. Check your email or verification.You will be redirected to the homepage'
                                        });

                                        alertPopup.then(function () {
                                            $state.go('app.firsttimelogin');
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

        $scope.toggle = false;
        $scope.LogIn = function (username) {

            var usere = firebase.auth().currentUser;

            if (!usere) {

                firebase.auth().signInWithEmailAndPassword($scope.registerusername, $scope.registerpassword).then(function (user) {

                    LoginStore.GetUser(function (data) {
                        var user = firebase.auth().currentUser;
                        if (data) {

                            $state.go("app.homepage");
                        }
                        else {


                            LoginStore.AddUser(user).then(function (result) {

                                user.sendEmailVerification().then(function () {

                                    $state.go('app.homepage');

                                }, function (error) {
                                    $state.go('app.homepage');
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
            }
            else {
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
            }
        };


        $scope.Switch = function () {

            $scope.toggle = !$scope.toggle;

        }



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
                                                                $state.go('app.firsttimelogin');
                                                            }, function (error) {
                                                                alert(error.message);
                                                            });
                                                        }
                                                    });

                                                }
                                            }, 1000);



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

    .controller('FirstTimeLoginController', function ($scope, $state, $ionicPopup, TeamStores, ProfileStore1, $ionicHistory) {



        $scope.currentprofile =
            {
                startmonday: 7,
                startmondayend: 23,
                starttuesday: 7,
                starttuesdayend: 23,
                startwednesday: 7,
                startwednesdayend: 23,
                startthursday: 7,
                startthursdayend: 23,
                startfriday: 7,
                startfridayend: 23,
                startsaturday: 7,
                startsaturdayend: 23,
                startsunday: 7,
                startsundayend: 23,
                favstadium: "",
                favstadiumphoto: "",
                available: false,
                skilllevel: "Newbie"
            }

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

        $scope.gochoosestadium = function (stadium) {

        }

        $scope.UpdateUser = function (profile) {

            alert("test");
            ProfileStore1.UpdateProfile(profile, false).then(function (result) {

                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go("app.homepage");

            }, function (error) {
                alert(error.message);
            });

        };


    })


    .controller('SubmitSearch', function ($scope, $ionicModal, $timeout, $state) {
        alert("Yo"); $scope.submit = function () {


            $state.go('availablestadiums');
        };
    })




    ;
