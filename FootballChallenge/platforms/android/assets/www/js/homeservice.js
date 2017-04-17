
angular.module('football.controllers')

    .factory('HomeStore', function () {
        var myprofile = {};
        var profile = {};
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

                        myprofile = {
                            "key": snapshot.key,
                            "displayname": snapshot.child("displayname").val(),
                            "firstname": snapshot.child("firstname").val(),
                            "lastname": snapshot.child("lastname").val(),
                            "highestrating": snapshot.child("highestrating").val(),
                            "middlename": snapshot.child("middlename").val(),
                            "playposition": snapshot.child("playposition").val(),
                            "ranking": snapshot.child("ranking").val(),
                            "status": snapshot.child("status").val(),
                            "photo": snapshot.child("photoURL").val(),
                            //"teams": snapshot.child("teams").exists() ? snapshot.child("teams").val() : "",
                            "telephone": snapshot.child("telephone").val(),
                            "winstreak": snapshot.child("winstreak").val(),
                            "challenges": totchallenges,
                            "upcominteamgmatches": upcomingmatches,
                            "teaminvitations": teaminvitations,
                            "gameinvitation": gameinvitation,
                            "myteams": myteams,
                            "requestednumbers": requestednumbers,
                            "upcomingmatches": upcomingsinglematches,
                            "teamdisplayed": "none",
                            "teamdisplayedkey": snapshot.child("teamdisplayedkey").val(),

                        };
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


                        profile = {
                            "key": snapshot.key,
                            "displayname": snapshot.child("displayname").val(),
                            "firstname": snapshot.child("firstname").val(),
                            "lastname": snapshot.child("lastname").val(),
                            "highestrating": snapshot.child("highestrating").val(),
                            "middlename": snapshot.child("middlename").val(),
                            "playposition": snapshot.child("playposition").val(),
                            "ranking": snapshot.child("ranking").val(),
                            "status": snapshot.child("status").val(),
                            "photo": snapshot.child("photoURL").val(),
                            //"teams": snapshot.child("teams").exists() ? snapshot.child("teams").val() : "",
                            "telephone": snapshot.child("telephone").val(),
                            "winstreak": snapshot.child("winstreak").val(),
                            "teamdisplayed": "none",
                            "teamdisplayedkey": snapshot.child("teamdisplayedkey").val(),

                        };
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
