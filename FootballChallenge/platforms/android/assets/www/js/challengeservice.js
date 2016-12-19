
angular.module('football.controllers')

    .factory('ChallengeStore', function () {
        var MyFiveTeams = [];
        var AllITems = [];
        var AllMyAdminTeams = [];

        return {

            GetMyTeams: function (callback) {
                var user = firebase.auth().currentUser;
                var id = user.uid;

                firebase.database().ref('/players/' + id + '/teams').on('value', function (snapshot) {
                    MyFiveTeams = [];
                    snapshot.forEach(function (childSnapshot) {
                        var Items = {
                            "key": childSnapshot.key,
                            "teamname": childSnapshot.child("teamname").val(),
                            'teamphoto': childSnapshot.child("teamphoto").val(),
                            'datecreated': childSnapshot.child("datecreated").val(),
                            'badge': childSnapshot.child("badge").val(),
                            "teamadmin":childSnapshot.child("teamadmin").val(),
                            "homejersey": childSnapshot.child("homejersey").val(),
                            "awayjersey": childSnapshot.child("awayjersey").val(),
                            "badge": childSnapshot.child("badge").val(),
                            "rank": childSnapshot.child("rank").val(),
                            "numberofgames": childSnapshot.child("numberofgames").val(),
                            "wins": childSnapshot.child("wins").val(),
                            "teamadmin":childSnapshot.child("teamadmin").val(),

                        };

                        MyFiveTeams.push(Items)
                    });
                    callback(MyFiveTeams);
                });

            },


            GetMyAdminTeams: function (callback) {


                var user = firebase.auth().currentUser;
                var id = user.uid;

                firebase.database().ref('/players/' + id).once('value').then(function (snapshot) {
                    AllMyAdminTeams = [];
                    snapshot.child("teams").forEach(function (childSnapshot) {
                        var Items = {

                            "displayname": snapshot.displayname,
                            "enableinvitations": snapshot.enableinvitations,
                            "firstname": snapshot.firstname,
                            "highestrating": snapshot.highestrating,
                            "lastname": snapshot.lastname,
                            "middlename": snapshot.middlename,

                            "key": childSnapshot.key,
                            "teamname": childSnapshot.child("teamname").val(),
                            "teamphoto": childSnapshot.child("teamphoto").val(),
                            "datecreated": childSnapshot.child("datecreated").val(),
                            "homejersey": childSnapshot.child("homejersey").val(),
                            "awayjersey": childSnapshot.child("awayjersey").val(),
                            "badge": childSnapshot.child("badge").val(),
                            "rank": childSnapshot.child("rank").val(),
                            "numberofgames": childSnapshot.child("numberofgames").val(),
                            "wins": childSnapshot.child("wins").val()
                        };

                        AllMyAdminTeams.push(Items)
                    });
                    callback(AllMyAdminTeams);
                });

            },

            GetAllTeams: function (callback) {
                firebase.database().ref('/teams').limitToFirst(4).once('value').then(function (snapshot) {
                    //alert(firstName);
                    AllITems = [];

                    snapshot.forEach(function (childSnapshot) {
                        var Items = {
                            "key": childSnapshot.key,
                            "teamname": childSnapshot.child("teamname").val(),
                            'teamphoto': childSnapshot.child("teamphoto").val(),
                            //'datecreated': childSnapshot.child("datecreated").val(),
                            "favstadium": "",
                            "favstadiumphoto": childSnapshot.child("favstadiumphoto").val(),
                            "favstadium": childSnapshot.child("favstadium").val(),
                            "homejersey": childSnapshot.child("homejersey").val(),
                            "awayjersey": childSnapshot.child("awayjersey").val(),
                            "badge": childSnapshot.child("badge").val(),
                            "rank": childSnapshot.child("rank").val(),
                            "numberofgames": childSnapshot.child("numberofgames").val(),
                            "wins": childSnapshot.child("wins").val(),
                            "selected": "select",
                            "color":"white",
                            "backcolor":"green",
                            "teamadmin":childSnapshot.child("teamadmin").val(),

                        };

                        AllITems.push(Items)
                    });
                    
                    callback(AllITems);
                });
            },

            GetTeamByKey: function (key) {
                firebase.database().ref('/teams').once('value').then(function (snapshot) {
                    var firstName = snapshot.child("barca/teamphoto").val(); // "Ada"
                    //alert(firstName);


                    snapshot.forEach(function (childSnapshot) {
                        var Items = {
                            "key": childSnapshot.val(),
                            "teamname": childSnapshot.child("teamname").val(),
                            'teamphoto': childSnapshot.child("teamphoto").val(),
                            'datecreated': childSnapshot.child("datecreated").val()

                        };

                        TempItems.push(Items)
                    });
                });

                return TempItems;
            },
            ChallengeTeams: function (date, teams, stadiums, myteam) {

                //alert(JSON.stringify(teams));
                //alert(JSON.stringify(stadiums));
                //alert(JSON.stringify(myteam));

                 var updates = {};

                var year = date.getFullYear();
                var month = date.getMonth();
                var day = date.getDate();

                var hour = date.getHours();
                var minute = date.getMinutes();

                try {
                    for (var i = 0; i < teams.length; i++) {

                        var challengedata = {
                            day: day,
                            month: month,
                            year: year,
                            hour: hour,
                            minute: minute,

                            stadiums: stadiums,

                            challengeradmin: teams[i].teamadmin,
                            //challengeradminname: adminname,
                            //challengerteamname: name,
                            //challengerteamlogo: logo,

                            team1key : teams[i].key,
                            team1name: teams[i].teamname, //
                            team1logo: teams[i].badge, //
                            team1rank: teams[i].rank, //
                            //team1jersey: teams[i].jersey, //

                            team2key: myteam.key,
                            team2name: myteam.teamname,
                            team2logo: myteam.badge,
                            team2rank: myteam.rank,
                            //team2jersey: myteam.jersey,

                            team2adminid: myteam.teamadmin,
                            //team2adminname: myteam.adminname,
                            //team2adminmobile: myteam.adminmobile,
                            accepted: false


                        }

                        var mychallengedata = {
                            day: day,
                            month: month,
                            year: year,
                            hour: hour,
                            minute: minute,

                            stadiums: stadiums,

                            //challengeradmin: id,
                            //challengeradminname: adminname,
                            //challengerteamname: name,
                            //challengerteamlogo: logo,

                            team2key:  teams[i].key,
                            team2name: teams[i].teamname,
                            team2logo: teams[i].badge,
                            team2rank: teams[i].rank,
                            team2adminid: myteam.teamadmin,
                            //team2jersey: myteam.jersey,

                            team1key : myteam.key,
                            team1name: myteam.teamname, //
                            team1logo: myteam.badge, //
                            team1rank: myteam.rank, //
                            team1adminid: myteam.teamadmin,
                            //team1jersey: teams[i].jersey, //
                            //team2adminid: myteam.admin,
                            //team2adminname: myteam.adminname,
                            //team2adminmobile: myteam.adminmobile,
                            accepted: false

                        }

                        // Get a key for a new Post.
                        var newPostKey = firebase.database().ref().child('challenges').push().key;

                        updates['/challenges/'+newPostKey] = challengedata;

                        updates['/teams/' + teams[i].key + '/challenges/'+newPostKey] = challengedata;
                        updates['/teams/' + myteam.key + '/challenges/'+newPostKey] = mychallengedata;

                        updates['/players/' + teams[i].teamadmin + '/challenges/'+newPostKey] = challengedata;
                        updates['/players/' + myteam.teamadmin + '/challenges/'+newPostKey] = mychallengedata;




                    }

                    return firebase.database().ref().update(updates);



                } catch (error) {
                    alert(error.message)
                }


            }


        }

    })

