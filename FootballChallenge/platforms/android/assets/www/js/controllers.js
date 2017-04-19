angular.module('football.controllers', [])
    .factory('SMSService', function ($ionicPopup, $http, $q, $ionicLoading) {
        var accountSid = "AC4c662d337b7c4d408c5ec62bf16f2206";
        var authToken = "17dac42e587aea7dc1a4371fb303a417";

        var twilioURL = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages";

        function generateCode(length, codeType) {
            if (typeof length === "undefined") {
                length = 5;
            }
            if (typeof codeType === "undefined") {
                codeType = 0;
            }
            var text = "";
            var possible = "0123456789";
            if (codeType === 1) {
                possible += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
            }

            for (var i = 0; i < length; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }

        var sendSMS = function (to, message) {
            return $http({
                method: 'POST',
                url: twilioURL,
                data: {
                    To: to,
                    From: "+12012796865",
                    Body: message
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                headers: {
                    'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            // var deferred = $q.defer();
            // deferred.resolve(true);
            // return deferred.promise;
        };

        var verifyUserMobile = function ($scope, callback, argumentsArray) {
            $scope.smsVerification = {
                mobileNumber: "",
                codeNumber: ""
            };
            var confirmPopup = $ionicPopup.confirm({
                cssClass: 'custom-class',
                template: 'Please Verify Your Mobile Number<br/> <div class="row" style="padding-top:10px"><div style="width:15%;padding-top:15px">+961</div><div class="col"><input type="tel" required placeholder="Enter your mobile number" ng-model="smsVerification.mobileNumber" style="padding:20px 10px 20px 10px;background-color:rgba(0, 0, 0, 0.4);padding-left:10px;color:#2ab041;border-radius:5px"></div></div>',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Confirm</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.smsVerification.mobileNumber) {
                                e.preventDefault();
                            } else {
                                return "+961" + $scope.smsVerification.mobileNumber;
                            }
                        }
                    }
                ]
            });

            if (!$scope.nointernet) {
                confirmPopup.then(function (res) {
                    if (res) {
                        var code = generateCode(6);
                        console.log(code);
                        $ionicLoading.show({
                            content: 'Loading',
                            animation: 'fade-in',
                            showBackdrop: true,
                            maxWidth: 200,
                            showDelay: 0
                        });
                        sendSMS(res, "Please enter the code: " + code + " to confirm your mobile number").then(function (res) {
                            $ionicLoading.hide();
                            console.log(res)
                            var tries = 0;
                            var verifyPopup = $ionicPopup.confirm({
                                cssClass: 'custom-class',
                                template: 'Enter the verification code we sent via SMS below to verify your mobile number <br/> <div class="row"><div class="col"><input type="number" required placeholder="Enter the verification code" ng-model="smsVerification.codeNumber" style="padding:20px 10px 20px 10px;background-color:rgba(0, 0, 0, 0.4);padding-left:10px;color:#2ab041;border-radius:5px""></div></div>',
                                scope: $scope,
                                buttons: [
                                    { text: 'Cancel' },
                                    {
                                        text: '<b>Verify</b>',
                                        type: 'button-positive',
                                        onTap: function (e) {
                                            if (!$scope.smsVerification.codeNumber) {
                                                e.preventDefault();
                                            } else if (code !== $scope.smsVerification.codeNumber && tries < 3) {
                                                $ionicPopup.alert({
                                                    cssClass: 'custom-class',
                                                    template: "Invalid Code"
                                                });
                                                tries++;
                                                e.preventDefault();
                                            } else if (tries >= 3) {
                                                $ionicPopup.alert({
                                                    cssClass: 'custom-class',
                                                    template: "Too many bad attempts. Try again"
                                                });
                                                return false;
                                            } else {
                                                return $scope.smsVerification.codeNumber;
                                            }
                                        }
                                    }
                                ]
                            });

                            verifyPopup.then(function (res) {
                                if (res) {
                                    var user = firebase.auth().currentUser;
                                    var id = user.uid;
                                    var updates = {};
                                    updates['players/' + id + '/isMobileVerified'] = true;
                                    firebase.database().ref().update(updates).then(function () {
                                        callback.apply($scope, argumentsArray)
                                    });
                                }
                            });

                        }, function (err) {
                            $ionicLoading.hide();
                            console.log(err)
                        })
                    }
                });
            }
        };

        return {
            verifyUserMobile: verifyUserMobile
        }
    })
        .factory('FirebaseStorageService', function ($q) {
        return {
            saveUserProfilePicture: function (data, userId) {
                var deferred = $q.defer();

                data = data.substr("data:image/png;base64,".length);

                var storage = firebase.app().storage().ref();
                var name = userId + "/" + (new Date()).getTime() + ".png";
                var f = storage.child("playerimages/" + name);
                var task = f.putString(data, 'base64');

                task.on('state_changed', function(snapshot) {

                }, function(error) {
                    console.error("Unable to save image.");
                    console.error(error);
                    deferred.reject(error);
                }, function() {
                    var url = task.snapshot.downloadURL;
                    console.log("Saved to " + url);

                    var db = firebase.database();
                    var players = db.ref().child("players");
                    players.child(userId).child("photoURL").set(url);
                    deferred.resolve(url);
                });

                return deferred.promise;
            }
        }
    })
    .factory('ProfileStore1', function () {
        var TempItems = {};
        return {

            UpdateProfile: function (profile, withdetails) {
                try {

                    if (withdetails) {
                        var ageset = profile.age.getFullYear() == 1900 ? false : true;

                        var year = profile.age.getFullYear();
                        var month = profile.age.getMonth();
                        var day = profile.age.getDate();
                    }


                    var user = firebase.auth().currentUser;
                    var id = user.uid;

                    var updates = {};
                    updates['players/' + id + '/startmonday'] = profile.startmonday;
                    updates['players/' + id + '/startmondayend'] = profile.startmondayend;
                    updates['players/' + id + '/starttuesday'] = profile.starttuesday;
                    updates['players/' + id + '/starttuesdayend'] = profile.starttuesdayend;
                    updates['players/' + id + '/startwednesday'] = profile.startwednesday;
                    updates['players/' + id + '/startwednesdayend'] = profile.startwednesdayend;
                    updates['players/' + id + '/startthursday'] = profile.startthursday;
                    updates['players/' + id + '/startthursdayend'] = profile.startthursdayend;
                    updates['players/' + id + '/startfriday'] = profile.startfriday;
                    updates['players/' + id + '/startfridayend'] = profile.startfridayend;
                    updates['players/' + id + '/startsaturday'] = profile.startsaturday;
                    updates['players/' + id + '/startsaturdayend'] = profile.startsaturdayend;
                    updates['players/' + id + '/startsunday'] = profile.startsunday;
                    updates['players/' + id + '/startsundayend'] = profile.startsundayend;
                    updates['players/' + id + '/available'] = profile.available;
                    updates['players/' + id + '/skilllevel'] = profile.skilllevel;
                    //updates['players/' + id + '/favstadium'] = profile.favstadium;
                    //updates['players/' + id + '/favstadiumphoto'] = profile.favstadiumphoto;


                    //Age
                    if (withdetails) {
                        updates['players/' + id + '/teamdisplayed'] = profile.teamdisplayed;
                        updates['players/' + id + '/teamdisplayedkey'] = profile.teamdisplayedkey;
                        updates['players/' + id + '/comments'] = profile.comments;
                        updates['players/' + id + '/isplayer'] = profile.isplayer;
                        updates['players/' + id + '/ageyear'] = year;
                        updates['players/' + id + '/agemonth'] = month;
                        updates['players/' + id + '/ageday'] = day;
                        updates['players/' + id + '/ageset'] = ageset;
                        updates['players/' + id + '/firstname'] = profile.firstname;
                        updates['players/' + id + '/lastname'] = profile.lastname;
                    }


                    updates['playersinfo/' + id + '/startmonday'] = profile.startmonday;
                    updates['playersinfo/' + id + '/startmondayend'] = profile.startmondayend;
                    updates['playersinfo/' + id + '/starttuesday'] = profile.starttuesday;
                    updates['playersinfo/' + id + '/starttuesdayend'] = profile.starttuesdayend;
                    updates['playersinfo/' + id + '/startwednesday'] = profile.startwednesday;
                    updates['playersinfo/' + id + '/startwednesdayend'] = profile.startwednesdayend;
                    updates['playersinfo/' + id + '/startthursday'] = profile.startthursday;
                    updates['playersinfo/' + id + '/startthursdayend'] = profile.startthursdayend;
                    updates['playersinfo/' + id + '/startfriday'] = profile.startfriday;
                    updates['playersinfo/' + id + '/startfridayend'] = profile.startfridayend;
                    updates['playersinfo/' + id + '/startsaturday'] = profile.startsaturday;
                    updates['playersinfo/' + id + '/startsaturdayend'] = profile.startsaturdayend;
                    updates['playersinfo/' + id + '/startsunday'] = profile.startsunday;
                    updates['playersinfo/' + id + '/startsundayend'] = profile.startsundayend;
                    updates['playersinfo/' + id + '/available'] = profile.available;
                    updates['playersinfo/' + id + '/skilllevel'] = profile.skilllevel;
                    //updates['playersinfo/' + id + '/favstadium'] = profile.favstadium;
                    //updates['playersinfo/' + id + '/favstadiumphoto'] = profile.favstadiumphoto;

                    if (withdetails) {
                        //Age
                        updates['playersinfo/' + id + '/ageyear'] = year;
                        updates['playersinfo/' + id + '/agemonth'] = month;
                        updates['playersinfo/' + id + '/ageday'] = day;
                        updates['playersinfo/' + id + '/ageset'] = ageset;
                        updates['playersinfo/' + id + '/teamdisplayed'] = profile.teamdisplayed;
                        updates['playersinfo/' + id + '/teamdisplayedkey'] = profile.teamdisplayedkey;
                        updates['playersinfo/' + id + '/firstname'] = profile.firstname;
                        updates['playersinfo/' + id + '/lastname'] = profile.lastname;
                        updates['playersinfo/' + id + '/isplayer'] = profile.isplayer;
                    }


                    return firebase.database().ref().update(updates);
                }
                catch (error) {
                    alert(error.message);
                }
            },
            SearchPlayers: function (team, callback) {
                var user = firebase.auth().currentUser;
                var id = user.uid;

                AllPlayers = [];

                try {
                    console.log(team);
                    firebase.database().ref('/players').once('value').then(function (snapshot) {

                        snapshot.forEach(function (childSnapshot) {

                            var toadd = true;



                            //       if (childSnapshot.key != id) {

                            var status = "Invite to Team";

                            if (childSnapshot.child("teaminvitations/" + team.key).exists()) {

                                switch (childSnapshot.child("teaminvitations/" + team.key + "/status")) {
                                    case 0:
                                        status = "Pending Request";
                                        break;
                                    case 1:
                                        toadd = false;
                                        break;
                                    case 2:
                                        status = "Invite to Team";
                                        break;

                                    default:
                                        break;
                                }

                            }
                            if (toadd) {

                                var Items = {
                                    "key": childSnapshot.key,
                                    "displayname": childSnapshot.child("displayname").val(),
                                    "enableinvitations": childSnapshot.child("enableinvitations").val(),
                                    "favouritesport": childSnapshot.child("favouritesport").val(),
                                    "firstname": childSnapshot.child("firstname").val(),
                                    "highestrating": childSnapshot.child("highestrating").val(),
                                    "lastname": childSnapshot.child("lastname").val(),
                                    "middlename": childSnapshot.child("middlename").val(),
                                    "playposition": childSnapshot.child("playposition").val(),
                                    "ranking": childSnapshot.child("ranking").val(),
                                    "status": status,
                                    "teams": childSnapshot.child("teams").val(),
                                    "telephone": childSnapshot.child("telephone").val(),
                                    "winstreak": childSnapshot.child("winstreak").val(),
                                    "photo": childSnapshot.child("photoURL").val()

                                };

                                AllPlayers.push(Items);
                            }

                        })

                        callback(AllPlayers);
                    })

                } catch (error) {
                    alert(error.message);
                }

            }

        }

    })
    .factory('HomeStore', function () {
        var myprofile = {};
        myprofile["key"] = "";
        myprofile['photo'] = "img/PlayerProfile.png";
        myprofile["displayname"] = "";
        myprofile["firstname"] = "";
        myprofile["lastname"] = "";
        myprofile["highestrating"] = "";
        myprofile["middlename"] = "";
        myprofile["playposition"] = "";
        myprofile["ranking"] = "";
        myprofile["status"] = "";
        myprofile["telephone"] = "";
        myprofile["winstreak"] = "";
        myprofile["challenges"] = "";
        myprofile["upcominteamgmatches"] = [];
        myprofile["teaminvitations"] = [];
        myprofile["gameinvitation"] = [];
        myprofile["myteams"] = [];
        myprofile["requestednumbers"] = [];
        myprofile["upcomingmatches"] = [];
        myprofile["teamdisplayed"] = "none";
        myprofile["teamdisplayedkey"] = "";

        var profile = {};
        profile['photo'] = "img/PlayerProfile.png";
        profile["key"] = "";
        profile["displayname"] = "";
        profile["firstname"] = "";
        profile["lastname"] = "";
        profile["highestrating"] = "";
        profile["middlename"] = "";
        profile["playposition"] = "";
        profile["ranking"] = "";
        profile["status"] = "";
        profile["photo"] = "";
        profile["telephone"] = "";
        profile["winstreak"] = "";
        profile["teamdisplayed"] = "";
        profile["teamdisplayedkey"] = "";
        
        var TempItems = [];
        var RankedTeams = [];
        return {
            GetProfileInfo: function (currentdate, callback) {
                TempItems = [];
                var user = firebase.auth().currentUser;
                //alert("test");
                var id = user.uid;

                try {


                    firebase.database().ref('/players/' + id).once('value', function (snapshot) {

                        var totchallenges = [];
                        var upcomingmatches = [];
                        var teaminvitations = [];
                        var gameinvitation = [];
                        var myteams = [];
                        var requestednumbers = [];
                        var upcomingsinglematches = [];

                        if (snapshot.child("challenges").exists()) {


                            snapshot.child("challenges").forEach(function (challenges) {

                                var challengedate = new Date();
                                var isadmin = challenges.child("admin").val() == id;

                                challengedate.setMinutes(challenges.child("minute").val());
                                challengedate.setFullYear(challenges.child("year").val());
                                challengedate.setMonth(challenges.child("month").val());
                                challengedate.setHours(challenges.child("hour").val());
                                challengedate.setDate(challenges.child("day").val());

                                var challengedata = {
                                    key: challenges.key,
                                    accepted: challenges.child("accepted").val(),
                                    day: challenges.child("day").val(),
                                    hour: challenges.child("hour").val(),
                                    minute: challenges.child("minute").val(),
                                    month: challenges.child("month").val(),
                                    stadiums: challenges.child("stadiums").val(),
                                    team1adminid: challenges.child("team1adminid").val(),
                                    team1key: challenges.child("team1key").val(),
                                    team1logo: challenges.child("team1logo").val(),
                                    team1name: challenges.child("team1name").val(),
                                    team1rank: challenges.child("team1rank").val(),
                                    team1jersey: challenges.child("team1jersey").val(),

                                    team2adminid: challenges.child("team2adminid").val(),
                                    team2key: challenges.child("team2key").val(),
                                    team2logo: challenges.child("team2logo").val(),
                                    team2name: challenges.child("team2name").val(),
                                    team2rank: challenges.child("team2rank").val(),
                                    team2jersey: challenges.child("team2jersey").val(),

                                    year: challenges.child("year").val(),
                                    date: challengedate,
                                    isadmin: isadmin,


                                    adminphoto: challenges.child("adminphoto").val() == "" ? "img/PlayerProfile.png" : challenges.child("adminphoto").val(),
                                    admintelephon: challenges.child("admintelephon").val(),
                                    adminname: challenges.child("adminname").val()

                                }
                                totchallenges.push(challengedata);

                            })
                        }
                        if (snapshot.child("upcominteamgmatches").exists()) {
                            snapshot.child("upcominteamgmatches").forEach(function (challenges) {


                                var matchdate = new Date();


                                matchdate.setMinutes(challenges.child("minute").val());
                                matchdate.setFullYear(challenges.child("year").val());
                                matchdate.setMonth(challenges.child("month").val());
                                matchdate.setHours(challenges.child("hour").val());
                                matchdate.setDate(challenges.child("day").val());

                                if (currentdate <= matchdate) {
                                    var matchdata = {

                                        key: challenges.key,

                                        accepted: challenges.child("accepted").val(),
                                        day: challenges.child("day").val(),
                                        hour: challenges.child("hour").val(),
                                        minute: challenges.child("minute").val(),
                                        month: challenges.child("month").val(),

                                        team1adminid: challenges.child("team1adminid").val(),
                                        team1key: challenges.child("team1key").val(),
                                        team1logo: challenges.child("team1logo").val(),
                                        team1name: challenges.child("team1name").val(),
                                        team1rank: challenges.child("team1rank").val(),
                                        team2adminid: challenges.child("team2adminid").val(),
                                        team2key: challenges.child("team2key").val(),
                                        team2logo: challenges.child("team2logo").val(),
                                        team2name: challenges.child("team2name").val(),
                                        team2rank: challenges.child("team2rank").val(),
                                        year: challenges.child("year").val(),
                                        date: matchdate,

                                        stadiumkey: challenges.child("stadiumkey").val(),
                                        ministadiumkey: challenges.child("ministadiumkey").val(),
                                        photo: challenges.child("photo").val(),
                                        price: challenges.child("price").val(),
                                        stadiumdescription: challenges.child("stadiumdescription").val(),
                                        gamestyle: "teammatch"
                                    }
                                    upcomingmatches.push(matchdata);
                                }

                            })


                        }


                        if (snapshot.child("upcomingmatches").exists()) {
                            snapshot.child("upcomingmatches").forEach(function (game) {


                                var matchdate = new Date();


                                matchdate.setMinutes(game.child("minute").val());
                                matchdate.setFullYear(game.child("year").val());
                                matchdate.setMonth(game.child("month").val());
                                matchdate.setHours(game.child("hour").val());
                                matchdate.setDate(game.child("day").val());
                                if (currentdate <= matchdate) {
                                    var matchdata = {

                                        key: game.key,

                                        day: game.child("day").val(),
                                        hour: game.child("hour").val(),
                                        minute: game.child("minute").val(),
                                        month: game.child("month").val(),

                                        year: game.child("year").val(),
                                        date: matchdate,

                                        stadiumkey: game.child("stadiumkey").val(),
                                        ministadiumkey: game.child("ministadiumkey").val(),
                                        stadiumdescription: game.child("stadiumdescription").val(),
                                        photo: game.child("photo").val(),
                                        price: game.child("price").val(),
                                        stadiumdescription: game.child("stadiumdescription").val(),
                                        gamestyle: "alonematch"
                                    }
                                    upcomingsinglematches.push(matchdata);
                                }
                            })


                        }
                        if (snapshot.child("teaminvitations").exists()) {
                            snapshot.child("teaminvitations").forEach(function (challenges) {


                                var matchdate = new Date();


                                matchdate.setMinutes(challenges.child("minute").val());
                                matchdate.setFullYear(challenges.child("year").val());
                                matchdate.setMonth(challenges.child("month").val());
                                matchdate.setHours(challenges.child("hour").val());
                                matchdate.setDate(challenges.child("day").val());

                                var matchdata = {
                                    accepted: challenges.child("accepted").val(),
                                    day: challenges.child("day").val(),
                                    hour: challenges.child("hour").val(),
                                    minute: challenges.child("minute").val(),
                                    month: challenges.child("month").val(),
                                    year: challenges.child("year").val(),

                                    key: challenges.child("key").val(),
                                    teamname: challenges.child("teamname").val(),
                                    badge: challenges.child("badge").val(),
                                    homejersey: challenges.child("homejersey").val(),
                                    awayjersey: challenges.child("awayjersey").val(),

                                    status: challenges.child("status").val(),

                                    date: matchdate,

                                    adminkey: challenges.child("adminkey").val(),
                                    admindisplayname: challenges.child("admindisplayname").val(),
                                    adminphoto: challenges.child("adminphoto").val() == "" ? "img/PlayerProfile.png" : challenges.child("adminphoto").val(),
                                    admintelephone: challenges.child("admintelephone").val(),

                                }
                                teaminvitations.push(matchdata);

                            })


                        }


                        if (snapshot.child("teams").exists()) {
                            snapshot.child("teams").forEach(function (teams) {

                                var matchdata = {
                                    key: teams.key,
                                    badge: teams.child("badge").val(),
                                    rank: teams.child("rank").val(),
                                    teamname: teams.child("teamname").val()

                                }
                                myteams.push(matchdata);

                            })


                        }

                        if (snapshot.child("myrequests").exists()) {
                            snapshot.child("myrequests").forEach(function (teams) {

                                var matchdata = {
                                    key: teams.key,
                                    firstname: teams.child("firstname").val(),
                                    lastname: teams.child("lastname").val(),
                                    photo: teams.child("requestorphoto").val() == "" ? "img/PlayerProfile.png" : teams.child("requestorphoto").val(),
                                    telephone: teams.child("requestortelephone").val()

                                }
                                requestednumbers.push(matchdata);

                            })


                        }


                        if (snapshot.child("gameinvitation").exists()) {
                            snapshot.child("gameinvitation").forEach(function (challenges) {


                                var matchdate = new Date();


                                matchdate.setMinutes(challenges.child("minute").val());
                                matchdate.setFullYear(challenges.child("year").val());
                                matchdate.setMonth(challenges.child("month").val());
                                matchdate.setHours(challenges.child("hour").val());
                                matchdate.setDate(challenges.child("day").val());

                                var matchdata = {
                                    key: challenges.key,


                                    day: challenges.child("day").val(),
                                    hour: challenges.child("hour").val(),
                                    minute: challenges.child("minute").val(),
                                    month: challenges.child("month").val(),

                                    team1adminid: challenges.child("team1adminid").val(),
                                    team1key: challenges.child("team1key").val(),
                                    team1logo: challenges.child("team1logo").val(),
                                    team1name: challenges.child("team1name").val(),
                                    team1rank: challenges.child("team1rank").val(),

                                    team2adminid: challenges.child("team2adminid").val(),
                                    team2key: challenges.child("team2key").val(),
                                    team2logo: challenges.child("team2logo").val(),
                                    team2name: challenges.child("team2name").val(),
                                    team2rank: challenges.child("team2rank").val(),

                                    year: challenges.child("year").val(),
                                    date: matchdate,

                                    stadiums: challenges.child("stadium").val(),

                                    belonging: challenges.child("belonging").val(),

                                }
                                gameinvitation.push(matchdata);

                            })


                        }

                        myprofile["key"] = snapshot.key;
                        myprofile["photo"] = snapshot.child("photoURL").val();
                        myprofile["displayname"] = snapshot.child("displayname").val();
                        myprofile["firstname"] = snapshot.child("firstname").val();
                        myprofile["lastname"] = snapshot.child("lastname").val();
                        myprofile["highestrating"] = snapshot.child("highestrating").val();
                        myprofile["middlename"] = snapshot.child("middlename").val();
                        myprofile["playposition"] = snapshot.child("playposition").val();
                        myprofile["ranking"] = snapshot.child("ranking").val();
                        myprofile["status"] = snapshot.child("status").val();
                        myprofile["telephone"] = snapshot.child("telephone").val();
                        myprofile["winstreak"] = snapshot.child("winstreak").val();
                        myprofile["challenges"] = totchallenges;
                        myprofile["upcominteamgmatches"] = upcomingmatches;
                        myprofile["teaminvitations"] = teaminvitations;
                        myprofile["gameinvitation"] = gameinvitation;
                        myprofile["myteams"] = myteams;
                        myprofile["requestednumbers"] = requestednumbers;
                        myprofile["upcomingmatches"] = upcomingsinglematches;
                        myprofile["teamdisplayed"] = "none";
                        myprofile["teamdisplayedkey"] = snapshot.child("teamdisplayedkey").val();

                        callback(myprofile);
                    }, function (error) {
                        alert(error.message);
                    });
                } catch (error) {

                }
                // return myprofile;
            },

            GetProfileInfoByKey: function (key, callback) {
                TempItems = [];
                var user = firebase.auth().currentUser;
                //alert("test");
                var id = user.uid;

                try {

                    firebase.database().ref('/players/' + id).once('value', function (snapshot) {
                        profile["key"] = snapshot.key;
                        profile["displayname"] = snapshot.child("displayname").val();
                        profile["firstname"] = snapshot.child("firstname").val();
                        profile["lastname"] = snapshot.child("lastname").val();
                        profile["highestrating"] = snapshot.child("highestrating").val();
                        profile["middlename"] = snapshot.child("middlename").val();
                        profile["playposition"] = snapshot.child("playposition").val();
                        profile["ranking"] = snapshot.child("ranking").val();
                        profile["isMobileVerified"] = snapshot.child("isMobileVerified").val();
                        profile["status"] = snapshot.child("status").val();
                        profile["photo"] = snapshot.child("photoURL").val();
                        profile["telephone"] = snapshot.child("telephone").val();
                        profile["winstreak"] = snapshot.child("winstreak").val();
                        profile["teamdisplayed"] = "none";
                        profile["teamdisplayedkey"] = snapshot.child("teamdisplayedkey").val();
                        callback(profile);
                    }, function (error) {
                        alert(error.message);
                    });
                } catch (error) {

                }
                // return myprofile;
            },

            UpdateProfile: function (profile) {

                var profileuser = {

                    "availabledays": profile.availabledays,
                    "displayname": profile.displayname,
                    "enableinvitations": profile.enableinvitations,
                    "favouritesport": profile.child("favouritesport").val(),
                    "firstname": profile.child("firstname").val(),
                    "lastname": profile.lastname,
                    "middlename": profile.middlename,
                    "playposition": profile.playposition,
                    "ranking": profile.ranking,
                    "status": profile.status,
                    "teams": profile.teams,
                    "telephone": profile.telephone

                };



                //alert(newPostKey);
                // Write the new post's data simultaneously in the posts list and the user's post list.
                var updates = {};
                updates['/players/' + uid] = profileuser;
                //updates['/user-posts/' + uid + '/' + newPostKey] = postData;

                return firebase.database().ref().update(updates);
            },

            AcceptInvitation: function (challenge, stadium) {


                //alert(newPostKey);
                // Write the new post's data simultaneously in the posts list and the user's post list.
                //var updates = {};
                //updates['/players/' + uid] = profileuser;
                //updates['/user-posts/' + uid + '/' + newPostKey] = postData;

                //return firebase.database().ref().update(updates);
            },
            DeleteChallenge: function (challenge) {

                try {
                    alert(challenge.team1adminid);
                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};
                    updates['/players/' + challenge.team1adminid + '/upcomingteammatches/' + challenge.key] = null;
                    updates['/players/' + challenge.team2adminid + '/upcomingteammatches/' + challenge.key] = null;

                    for (var i = 0; i < challenge.team1players; i++) {
                        updates['/players/' + challenge.team1players[i].key + '/upcomingteammatches/' + challenge.key] = null;
                    }
                    for (var i = 0; i < challenge.team2players; i++) {
                        updates['/players/' + challenge.team2players[i].key + '/upcomingteammatches/' + challenge.key] = null;
                    }

                    //should be already nulls;
                    updates['/players/' + challenge.team1adminid + '/challenges/' + challenge.key] = null;
                    updates['/players/' + challenge.team2adminid + '/challenges/' + challenge.key] = null;

                    //
                    updates['/teams/' + challenge.team1key + '/upcomingteammatches/' + challenge.key] = null;
                    updates['/teams/' + challenge.team2key + '/upcomingteammatches/' + challenge.key] = null;

                    updates['/stadiums/' + challenge.stadiums.stadiumkey + '/ministadiums/' + challenge.stadiums.ministadiumkey + '/schedules/' + challenge.stadiums.year + '/' + challenge.stadiums.month + '/' + challenge.stadiums.day + '/' + challenge.key] = null;


                    updates['/challenges/' + challenge.key] = null;
                    //updates['/user-posts/' + uid + '/' + newPostKey] = postData;

                    return firebase.database().ref().update(updates);
                }
                catch (error) {
                    alert(error.message);
                }
            },

            RegisterTeamMatch: function (search, user, stadiums, challenge) {
                //alert("here");

                try {


                    var year = search.date.getFullYear();
                    var month = search.date.getMonth();
                    var day = search.date.getDate();

                    var hour = search.date.getHours();
                    var minute = search.date.getMinutes();

                    var key = stadiums.stadiumkey;
                    var subkey = stadiums.ministadiumkey;

                    var newkey = subkey + year.toString() + month.toString() + day.toString() + hour.toString() + minute.toString();
                    //firebase.database().ref('/stadiums/ministadiums').on('value',function (snapshot) {

                    var mainkey = newkey;

                    var user = firebase.auth().currentUser;

                    var id = user.uid;

                    var postData = {
                        uid: id,
                        hour: hour,
                        minute: minute,
                        day: day,
                        discount: "0",
                        month: month,
                        nettotal: "",
                        price: stadiums.price,
                        percentage: "",
                        duration: 90,
                        type: "B",
                        year: year,
                        total: stadiums.price,
                        bookedadmin: false,
                        maindata: true,
                        references: "",

                        challengekey: challenge.key,
                        accepted: challenge.accepted,
                        //stadium: challenge.stadium,
                        team1adminid: challenge.team1adminid,
                        team1key: challenge.team1key,
                        team1logo: challenge.team1logo,
                        team1name: challenge.team1name,
                        team1rank: challenge.team1rank,
                        team2adminid: challenge.team2adminid,
                        team2key: challenge.team2key,
                        team2logo: challenge.team2logo,
                        team2name: challenge.team2name,
                        team2rank: challenge.team2rank,
                        teamone: 0,
                        teamonescore: 0

                    };

                    var extraslots = {
                        usercode: id,
                        type: "B",
                        maindata: false
                    };
                    var updates = {};

                    var numslots = 90 / 15;

                    var mainkey = newkey;
                    var references = [];

                    for (i = 1; i < numslots; i++) {
                        search.date.setMinutes(search.date.getMinutes() + 15);

                        newkey = subkey + search.date.getFullYear().toString() + search.date.getMonth().toString() + search.date.getDate().toString() + search.date.getHours().toString() + search.date.getMinutes().toString();
                        var refdata = {
                            key: newkey
                        }
                        references.push(refdata);
                        updates['/stadiums/' + key + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = extraslots;

                    }
                    postData.references = references;

                    var postDataPlayer = {
                        stadiumkey: stadiums.stadiumkey,
                        ministadiumkey: stadiums.ministadiumkey,
                        photo: stadiums.photo,
                        price: stadiums.price,
                        stadiumdescription: stadiums.stadiumname,
                        hour: hour,
                        minute: minute,
                        day: day,
                        discount: "0",
                        month: month,
                        nettotal: "",
                        teamonescore: 0,
                        teamtwoscore: 0,
                        year: year,
                        bookedadmin: false,

                        challengekey: challenge.key,

                        accepted: challenge.accepted,
                        //stadium: challenge.stadium,
                        team1adminid: challenge.team1adminid,
                        team1key: challenge.team1key,
                        team1logo: challenge.team1logo,
                        team1name: challenge.team1name,
                        team1rank: challenge.team1rank,

                        team2adminid: challenge.team2adminid,
                        team2key: challenge.team2key,
                        team2logo: challenge.team2logo,
                        team2name: challenge.team2name,
                        team2rank: challenge.team2rank,


                    };


                    if (id !== null || id == '' || id === undefined) {


                        // Write the new post's data simultaneously in the posts list and the user's post list.
                        var newPostKey = firebase.database().ref().child('posts').push().key;

                        updates['/stadiums/' + key + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;


                        //add to players upcoming matches

                        updates['/players/' + challenge.team1adminid + '/upcominteamgmatches/' + challenge.key] = postDataPlayer;

                        updates['/players/' + challenge.team2adminid + '/upcominteamgmatches/' + challenge.key] = postDataPlayer;

                        //add to teams upcoming matches
                        updates['/teams/' + challenge.team1key + '/upcominteamgmatches/' + challenge.key] = postDataPlayer;

                        updates['/teams/' + challenge.team2key + '/upcominteamgmatches/' + challenge.key] = postDataPlayer;


                        //delete from challenges
                        //updates['/challenges/' + challenge.key] = null;

                        updates['/players/' + challenge.team1adminid + '/challenges/' + challenge.key] = null;

                        updates['/players/' + challenge.team2adminid + '/challenges/' + challenge.key] = null;

                        updates['/challenges/' + challenge.key + '/stadiums'] = angular.copy(stadiums);

                        updates['/challenges/' + challenge.key + '/team1players/' + challenge.team1adminid] =
                            {
                                status: 5, //it means already accepted
                            }

                        updates['/challenges/' + challenge.key + '/team2players/' + challenge.team2adminid] =
                            {
                                status: 5, //it means already accepted
                            }


                    }

                    return firebase.database().ref().update(updates);

                } catch (error) {
                    alert(error.message)
                }
            },
            AcceptTeamInvitation: function (invitation, myprofile) {
                try {

                    var user = firebase.auth().currentUser;
                    var id = user.uid;

                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};

                    if (id !== null || id == '' || id === undefined) {

                        updates['/players/' + id + '/teaminvitations/' + invitation.key] = null;

                        updates['/players/' + id + '/teams/' + invitation.key] = null;

                        updates['/teams/' + invitation.key + '/players/' + id] =
                            {
                                isadmin: false,
                                name: myprofile.displayname,
                                name: myprofile.displayname,
                                firstname: myprofile.firstname,
                                lastname: myprofile.lastname
                            };

                        updates['/players/' + id + '/teams/' + invitation.key] =
                            {
                                key: invitation.key,
                                teamname: invitation.teamname,
                                badge: invitation.badge,

                                dateyear: invitation.year,
                                datemonth: invitation.month,
                                dateday: invitation.day,

                                datehour: invitation.hour,
                                dateminute: invitation.minute
                            };
                    }
                    return firebase.database().ref().update(updates);
                }
                catch (error) {
                    alert(error.message);
                }
            },
            AcceptMobileRequest: function (request, myprofile) {

                try {
                    var user = firebase.auth().currentUser;
                    var id = user.uid;

                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};

                    if (id !== null || id == '' || id === undefined) {

                        updates['/players/' + id + '/myrequests/' + request.key] = null;



                        updates['/players/' + request.key + '/friends/' + id] =
                            {
                                firstname: request.firstname,
                                lastname: request.lastname,
                                key: request.key,
                                telephone: request.telephone,
                                photo: request.photo
                            };

                        updates['/players/' + id + '/myrequests/' + request.key] = request;

                    }

                    return firebase.database().ref().update(updates);
                }
                catch (error) {
                    alert(error.message);
                }
            },
            DeleteMobileRequest: function (request) {

                try {
                    var user = firebase.auth().currentUser;
                    var id = user.uid;

                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};

                    if (id !== null || id == '' || id === undefined) {

                        updates['/players/' + id + '/myrequests/' + request.key] = 2;

                    }

                    return firebase.database().ref().update(updates);
                }
                catch (error) {
                    alert(error.message);
                }
            },
            DeleteOldChalleges: function (oldchallenges) {

                try {

                    var updates = {};
                    for (var i = 0; i < oldchallenges.length; i++) {
                        updates['/players/' + oldchallenges.team1adminid + '/challenges/' + oldchallenges.key] = null;
                        updates['/players/' + oldchallenges.team2adminid + '/challenges/' + oldchallenges.key] = null;
                    }

                    return firebase.database().ref().update(updates);
                }
                catch (error) {
                    alert(error.message);
                }
            },
            DeleteInvitation: function (invitation) {

                try {
                    var user = firebase.auth().currentUser;
                    var id = user.uid;

                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};

                    if (id !== null || id == '' || id === undefined) {

                        updates['/players/' + id + '/teaminvitations/' + invitation.key + '/requeststatus'] = 2;

                    }


                    return firebase.database().ref().update(updates);
                }
                catch (error) {
                    alert(error.message);
                }
            },
            GetFirstFour: function (callback) {
                var user = firebase.auth().currentUser;
                var id = user.uid;

                firebase.database().ref('/teampoints').orderByChild("rank").limitToFirst(4).once('value').then(function (snapshot) {
                    RankedTeams = [];
                    snapshot.forEach(function (childSnapshot) {


                        var Items = {
                            "key": childSnapshot.key,
                            "teamname": childSnapshot.child("name").val(),
                            'badge': childSnapshot.child("badge").val(),
                            'rank': childSnapshot.child("rank").val()

                        };

                        RankedTeams.push(Items);
                    });
                    callback(RankedTeams);
                });
            },
            AccepGameInvitation: function (gameinvitation) {

                try {
                    var user = firebase.auth().currentUser;
                    var id = user.uid;

                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};

                    if (id !== null || id == '' || id === undefined) {
                        var postDataPlayer = {
                            stadiumkey: gameinvitation.stadiums.stadiumkey,
                            ministadiumkey: gameinvitation.stadiums.ministadiumkey,
                            photo: gameinvitation.stadiums.photo,
                            price: gameinvitation.stadiums.price,
                            stadiumdescription: gameinvitation.stadiums.stadiumname,
                            hour: gameinvitation.hour,
                            minute: gameinvitation.minute,
                            day: gameinvitation.day,
                            discount: "0",
                            month: gameinvitation.month,
                            nettotal: "",
                            teamonescore: 0,
                            teamtwoscore: 0,
                            year: gameinvitation.year,

                            challengekey: gameinvitation.key,

                            //accepted: challenge.accepted,
                            //stadium: challenge.stadium,
                            team1adminid: gameinvitation.team1adminid,
                            team1key: gameinvitation.team1key,
                            team1logo: gameinvitation.team1logo,
                            team1name: gameinvitation.team1name,
                            team1rank: gameinvitation.team1rank,
                            team2adminid: gameinvitation.team2adminid,
                            team2key: gameinvitation.team2key,
                            team2logo: gameinvitation.team2logo,
                            team2name: gameinvitation.team2name,
                            team2rank: gameinvitation.team2rank


                        };
                        //add to players upcoming matches

                        updates['/players/' + id + '/gameinvitation/' + gameinvitation.key] = null;

                        updates['/challenges/' + gameinvitation.key + '/' + gameinvitation.belonging + '/' + id + '/status'] = 5;

                        updates['/players/' + id + '/upcominteamgmatches/' + gameinvitation.key] = postDataPlayer;

                    }
                    return firebase.database().ref().update(updates);
                }
                catch (error) {
                    alert(error.message);
                }



            },
            DeleteGameInvitation: function (gameinvitation) {
                try {
                    var user = firebase.auth().currentUser;
                    var id = user.uid;

                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};

                    if (id !== null || id == '' || id === undefined) {
                        //add to players upcoming matches

                        updates['/players/' + id + '/gameinvitation/' + gameinvitation.key] = null;

                        updates['/challenges/' + gameinvitation.key + '/' + gameinvitation.belonging + '/' + id + '/status'] = 3;
                    }
                    return firebase.database().ref().update(updates);
                }
                catch (error) {
                    alert(error.message);
                }
            }
        }

    })

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
            PostError: function(error) {
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

    .controller('LoginController', function ($scope, $ionicModal, $ionicPopup, $timeout, $state, LoginStore, FirebaseStorageService) {

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

        $scope.userImage = "img/PlayerProfile.png";
        $scope.chooseImage = function () {
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

            navigator.camera.getPicture(function (imageURI) {
                $scope.userImage = "data:image/png;base64," + imageURI;
                $scope.$apply();
            }, function (error) {

            }, options);
        };
        
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

                                LoginStore.AddUser(newuser, $scope.registerdata).then(function (success) {
                                    var user = firebase.auth().currentUser;
                                    FirebaseStorageService.saveUserProfilePicture($scope.userImage, user.uid);
                                    user.sendEmailVerification().then(function () {

                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Account Registered',
                                            template: 'Welcome To Arina. Please Take a moment to set up your profile'
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
                        template: 'An email has been sent to your email to reset your password'
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

    .controller('FirstTimeLoginController', function ($scope, $state, $ionicPopup, TeamStores, ProfileStore1, $ionicHistory, SMSService, $ionicLoading) {



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
            
        $scope.checkMobileNumber = function(e, verified) {
            console.log(111, verified);
            if(verified) {
                $scope.currentprofile.available = verified;
                $scope.$apply();
            }
            if($scope.currentprofile.available && !verified) {
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
                firebase.database().ref('/players/' + userId).once('value').then(function(snapshot) {
                    $ionicLoading.hide();
                    if(!snapshot.val().isMobileVerified) {
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
