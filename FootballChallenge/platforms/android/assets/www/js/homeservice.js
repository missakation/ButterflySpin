﻿
angular.module('football.controllers')

    .factory('HomeStore', function () {
        var myprofile = {};

        var TempItems = [];

        return {
            GetProfileInfo: function (callback) {
                TempItems = [];
                var user = firebase.auth().currentUser;
                //alert("test");
                var id = user.uid;

                try {
                    

                firebase.database().ref('/players/' + id).once('value', function (snapshot) {

                    var totchallenges = [];
                    var upcomingmatches = [];
                    var teaminvitations = [];

                    if (snapshot.child("challenges").exists()) {


                        snapshot.child("challenges").forEach(function (challenges) {

                            var challengedate = new Date();


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
                                team2adminid: challenges.child("team2adminid").val(),
                                team2key: challenges.child("team2key").val(),
                                team2logo: challenges.child("team2logo").val(),
                                team2name: challenges.child("team2name").val(),
                                team2rank: challenges.child("team2rank").val(),
                                year: challenges.child("year").val(),
                                date: challengedate
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

                            var matchdata = {
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
                                stadiumdescription: challenges.child("stadiumdescription").val()
                            }
                            upcomingmatches.push(matchdata);

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
                                
                                key: challenges.child("key").val(),
                                teamname: challenges.child("teamname").val(),
                                badge: challenges.child("badge").val(),
                                homejersey: challenges.child("homejersey").val(),
                                awayjersey: challenges.child("awayjersey").val(),

                                status: challenges.child("status").val(),

                                date:matchdate
                            }
                            teaminvitations.push(matchdata);

                        })


                    }

                    myprofile = {
                        "key": snapshot.key,
                        "displayname": snapshot.child("displayname").val(),
                        "firstname": snapshot.child("firstname").val(),
                        "highestrating": snapshot.child("highestrating").val(),
                        "lastname": snapshot.child("lastname").val(),
                        "middlename": snapshot.child("middlename").val(),
                        "playposition": snapshot.child("playposition").val(),
                        "ranking": snapshot.child("ranking").val(),
                        "status": snapshot.child("status").val(),
                        //"teams": snapshot.child("teams").exists() ? snapshot.child("teams").val() : "",
                        "telephone": snapshot.child("telephone").val(),
                        "winstreak": snapshot.child("winstreak").val(),
                        "challenges": totchallenges,
                        "upcominteamgmatches": upcomingmatches,
                        "teaminvitations":teaminvitations

                    };
                    callback(myprofile);
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

            AcceptInvitation: function(challenge,stadium){


                //alert(newPostKey);
                // Write the new post's data simultaneously in the posts list and the user's post list.
                //var updates = {};
                //updates['/players/' + uid] = profileuser;
                //updates['/user-posts/' + uid + '/' + newPostKey] = postData;

                //return firebase.database().ref().update(updates);
            },
            DeleteInvitation: function(challenge){

                try {
                    
                alert(challenge.team1admin);
                alert(challenge.key);

                // Write the new post's data simultaneously in the posts list and the user's post list.
                var updates = {};
                updates['/players/' + challenge.team1adminid + '/challenges/'+challenge.key ] = null;
                updates['/players/' + challenge.team2adminid +'/challenges/'+challenge.key] = null;
                updates['/challenges/' + challenge.key ] = null;
                //updates['/user-posts/' + uid + '/' + newPostKey] = postData;

                return firebase.database().ref().update(updates);
                   } 
                   catch (error) 
                   {
                    alert(error.message);
                }
            },
            RegisterTeamMatch: function (search, user, stadiums,challenge) {
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
                    teamone: "",
                    teamonescore: 0,
                    teamtwo: "",
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
                    teamone: 0,
                    teamonescore: 0

                };


                // Write the new post's data simultaneously in the posts list and the user's post list.
                var newPostKey = firebase.database().ref().child('posts').push().key;

                updates['/stadiums/' + key + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;


                //add to players upcoming matches

                updates['/players/' + challenge.team1adminid + '/upcominteamgmatches/' + challenge.key] = postDataPlayer;

                updates['/players/' + challenge.team2adminid + '/upcominteamgmatches/' + challenge.key] = postDataPlayer;


                //delete from challenges
                updates['/challenges/' + challenge.key] = null;

                updates['/players/' + challenge.team1adminid + '/challenges/'+challenge.key ] = null;

                updates['/players/' + challenge.team2adminid +'/challenges/'+challenge.key] = null;


                return firebase.database().ref().update(updates);
                } catch (error) {
                    alert(error.message)
                }
            },
             AcceptTeamInvitation: function(invitation,myprofile){
                try {

                var user = firebase.auth().currentUser;
                var id = user.uid;

                // Write the new post's data simultaneously in the posts list and the user's post list.
                var updates = {};

                updates['/players/' + id + '/teaminvitations/'+invitation.key ] = null;

                updates['/players/' + id + '/teams/'+invitation.key ] = null;

                updates['/teams/' + invitation.teamid + '/players/'+ id] = 
                {
                    isadmin : false,
                    name : myprofile.displayname
                };

                updates['/players/' + id + '/teams/'+invitation.key ] = 
                {
                      key: invitation.key,
                      teamname: invitation.teamname,
                      badge: invitation.badge,

                      dateyear : invitation.dateyear,
                      datemonth : invitation.datemonth,
                      dateday : invitation.dateday,

                      datehour : invitation.datehour,
                      dateminute : invitation.dateminute
                };

                return firebase.database().ref().update(updates);
            } 
                   catch (error) 
                   {
                    alert(error.message);
                }
            },
             DeleteInvitation: function(invitation){

                try {
                var user = firebase.auth().currentUser;
                var id = user.uid;

                // Write the new post's data simultaneously in the posts list and the user's post list.
                var updates = {};

                updates['/players/' + id + '/teaminvitations/'+invitation.key ] = null;

                return firebase.database().ref().update(updates);
            } 
                   catch (error) 
                   {
                    alert(error.message);
                }
            },
        }

    })