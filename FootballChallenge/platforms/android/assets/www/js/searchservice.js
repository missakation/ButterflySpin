﻿
angular.module('football.controllers')

    .factory('SearchStore', function () {
        var TempItems = [];
        var AllPlayers = [];

        return {
            SearchAvailablePlayers: function (searchinfo, callback) {
                AvailablePlayers = [];

                var year = searchinfo.date.getFullYear();
                var month = searchinfo.date.getMonth();
                var day = searchinfo.date.getDate();

                var hour = searchinfo.date.getHours();
                var minute = searchinfo.date.getMinutes();

                var weekday = searchinfo.date.getDay();

                var startat = "";
                var startend = "";

                switch (weekday) {
                    case 0:
                        startat = "startsunday";
                        startend = "startsundayend";
                        break;
                    case 1:
                        startat = "startmonday";
                        startend = "startmondayend";
                        break;
                    case 2:
                        startat = "starttuesday";
                        startend = "starttuesdayend";
                        break;
                    case 3:
                        startat = "startwednesday";
                        startend = "startwednesdayend";
                        break;
                    case 4:
                        startat = "startthursday";
                        startend = "startthursdayend";
                        break;
                    case 5:
                        startat = "startfriday";
                        startend = "startfridayend";
                        break;
                    case 6:
                        startat = "startsaturday";
                        startend = "startsaturdayend";
                        break;


                    default:
                        startat = "startmonday";
                        startend = "startmondayend";

                }
                firebase.database().ref('/players').orderByChild(startend).startAt(hour).once('value').then(function (snapshot) {
                    AvailablePlayers = [];

                    snapshot.forEach(function (childSnapshot) {

                        if (childSnapshot.child(startat).exists()) {
                            if (childSnapshot.child(startat).val() <= hour && childSnapshot.child("enableinvitations").val()) {


                                var Items = {
                                    "key": childSnapshot.key,
                                    "displayname": childSnapshot.child("displayname").val(),
                                    "enableinvitations": childSnapshot.child("enableinvitations").val(),
                                    "favouritesport": childSnapshot.child("favouritesport").val(),
                                    "firstname": childSnapshot.child("firstname").val(),
                                    "highestrating": childSnapshot.child("highestrating").val(),
                                    "lastname": childSnapshot.child("lastname").val(),
                                    "playposition": childSnapshot.child("playposition").val(),
                                    "ranking": childSnapshot.child("ranking").val(),
                                    "status": childSnapshot.child("status").val(),
                                    "teams": childSnapshot.child("teams").val(),
                                    "telephone": childSnapshot.child("telephone").val(),
                                    "userdescription": childSnapshot.child("userdescription").val(),
                                    "winstreak": childSnapshot.child("winstreak").val(),
                                    "photo": childSnapshot.child("photo").val(),
                                    "favstadium": childSnapshot.child("favstadium").val(),
                                    "favstadiumphoto": childSnapshot.child("favstadiumphoto").val(),
                                    "age": childSnapshot.child("age").val(),
                                    "nummatches": childSnapshot.child("nummatches").val(),

                                };

                                AvailablePlayers.push(Items)
                            }
                        }
                    });
                    //  alert(JSON.stringify(AvailablePlayers));
                    callback(AvailablePlayers);
                });
            },
            SearchAllPlayers: function (description) {
                TempItems = [];


                firebase.database().ref('/players').on('value', function (snapshot) {

                    snapshot.forEach(function (childSnapshot) {

                        var childdescription = childSnapshot.child("userdescription");

                        if (childdescription.trim().toString().includes(description.trim())) {

                            var Items = {
                                "key": childSnapshot.val(),
                                "availabledays": childSnapshot.child("availabledays").val(),
                                "displayname": childSnapshot.child("displayname").val(),
                                "enableinvitations": childSnapshot.child("enableinvitations").val(),
                                "favouritesport": childSnapshot.child("favouritesport").val(),
                                "firstname": childSnapshot.child("firstname").val(),
                                "highestrating": childSnapshot.child("highestrating").val(),
                                "lastname": childSnapshot.child("lastname").val(),
                                "middlename": childSnapshot.child("middlename").val(),
                                "playposition": childSnapshot.child("playposition").val(),
                                "ranking": childSnapshot.child("ranking").val(),
                                "status": childSnapshot.child("status").val(),
                                "teams": childSnapshot.child("teams").val(),
                                "telephone": childSnapshot.child("telephone").val(),
                                "userdescription": childSnapshot.child("userdescription").val(),
                                "winstreak": childSnapshot.child("winstreak").val(),
                                "photo": childSnapshot.child("photo").val()

                            };

                            TempItems.push(Items);
                        }
                    });
                });

                return TempItems;
            },

            SearchPlayers: function (team, callback) {

                var user = firebase.auth().currentUser;
                var id = user.uid;

                AllPlayers = [];

                try {

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
                                        "photo": childSnapshot.child("photo").val()

                                    };

                                    AllPlayers.push(Items);
                                }

                       //     }

                        });
                        callback(AllPlayers);
                    })

                } catch (error) {
                    alert(error.message);
                }

            },

            SearchStadiums: function (description) {
                TempItems = [];


                firebase.database().ref('/stadiums').on('value', function (snapshot) {

                    snapshot.forEach(function (childSnapshot) {

                        var childdescription = childSnapshot.child("name");

                        if (childdescription.trim().toString().includes(description.trim())) {

                            var Items = {
                                "key": childSnapshot.val(),
                                "description": childSnapshot.child("description").val(),
                                "indoor": childSnapshot.child("indoor").val(),
                                "locationarea": childSnapshot.child("locationarea").val(),
                                "locationcity": childSnapshot.child("locationcity").val(),
                                "locationtelephone": childSnapshot.child("locationtelephone").val(),
                                "name": childSnapshot.child("name").val(),
                                "outdoor": childSnapshot.child("outdoor").val(),
                                "photo": childSnapshot.child("photo").val(),
                                "rating": childSnapshot.child("rating").val(),
                                "water": childSnapshot.child("water").val()


                            };

                            TempItems.push(Items);
                        }
                    });
                });

                return TempItems;
            },
            SearchTeams: function (description) {
                TempItems = [];


                firebase.database().ref('/teams').on('value', function (snapshot) {

                    snapshot.forEach(function (childSnapshot) {

                        var childdescription = childSnapshot.child("teamname");

                        if (childdescription.trim().toString().includes(description.trim())) {

                            var Items = {
                                "key": childSnapshot.val(),
                                "description": childSnapshot.child("description").val(),
                                "indoor": childSnapshot.child("indoor").val(),
                                "locationarea": childSnapshot.child("locationarea").val(),
                                "locationcity": childSnapshot.child("locationcity").val(),
                                "locationtelephone": childSnapshot.child("locationtelephone").val(),
                                "name": childSnapshot.child("name").val(),
                                "outdoor": childSnapshot.child("outdoor").val(),
                                "photo": childSnapshot.child("photo").val(),
                                "rating": childSnapshot.child("rating").val(),
                                "water": childSnapshot.child("water").val()


                            };

                            TempItems.push(Items);
                        }
                    });
                });

                return TempItems;
            },
            RequestNumber: function (player) {
                //alert(user.teamname);
                // Get a key for a new Post.
                var user = firebase.auth().currentUser;
                var id = user.uid;

                try {
                    var requestdata = {
                        //badge:team.badge,
                        requesteduid: id,
                        requeststatus: 0

                    };

                    var updates = {};
                    updates['/players/' + player.uid + '/myrequests/' + id] = requestdata;

                    return firebase.database().ref().update(updates);
                }
                catch (error) {
                    alert(error.message);
                }
            }

        }

    })