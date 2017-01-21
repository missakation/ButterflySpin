
angular.module('football.controllers')

    .factory('ChallengeStore', function () {
        var MyFiveTeams = [];
        var AllITems = [];
        var AllMyAdminTeams = [];
        var ChallengeDetails = {};


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
            //    firebase.database().ref('/teams').limitToFirst(4).once('value').then(function (snapshot) {
                    firebase.database().ref('/teams').once('value').then(function (snapshot) {
                    //alert(firstName);
                    AllITems = [];

                    var user = firebase.auth().currentUser;
                    var id = user.uid;

                    if(id !== null || id == '' || id === undefined)
                    {
                    snapshot.forEach(function (childSnapshot) {
                        if(!childSnapshot.child("players/"+id).exists())
                        {
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
                            "color":"green",
                            "backcolor":"white",
                            "teamadmin":childSnapshot.child("teamadmin").val(),

                        };
                        }
                        AllITems.push(Items)
                    });
                    }
                    callback(AllITems);
                });
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

                            admin : myteam.teamadmin,

                            stadiums: stadiums,

                            challengeradmin: teams[i].teamadmin,
                            
                            //challengeradminname: adminname,
                            //challengerteamname: name,
                            //challengerteamlogo: logo,
                            team1adminid : teams[i].teamadmin,
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

                            admin : myteam.teamadmin,

                            //challengeradmin: id,
                            //challengeradminname: adminname,
                            //challengerteamname: name,
                            //challengerteamlogo: logo,

                            team2key:  teams[i].key,
                            team2name: teams[i].teamname,
                            team2logo: teams[i].badge,
                            team2rank: teams[i].rank,
                            team2adminid: teams[i].teamadmin,
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


            },
            GetChallengeByKey: function(myid,key,callback)
            {
                
                try {
                
                firebase.database().ref('/challenges/' + key).once('value', function (challenges) {
                    ChallengeDetails = {};
                            var team1players = [];
                            var team2players = [];

                            var challengedate = new Date();

                            
                            var isadmin = challenges.child("admin").val() == myid;
                            
                            challengedate.setMinutes(challenges.child("minute").val());
                            challengedate.setFullYear(challenges.child("year").val());
                            challengedate.setMonth(challenges.child("month").val());
                            challengedate.setHours(challenges.child("hour").val());
                            challengedate.setDate(challenges.child("day").val());

                            if (challenges.child("team1players").exists()) 
                            {

                            challenges.child("team1players").forEach(function (pl) {

                                    var data = {

                                        key : pl.key,
                                        status : pl.child("status").val()

                                    }
                                    team1players.push(data);

                                })

                            }
                            
                           if (challenges.child("team2players").exists()) 
                            {

                            challenges.child("team2players").forEach(function (p2) {

                                    var data2 = {

                                        key : p2.key,
                                        status : p2.child("status").val()

                                    }
                                    team2players.push(data2);

                                })

                            }

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
                                challengeradmin: challenges.child("challengeradmin").val(),
                                year: challenges.child("year").val(),
                                date: challengedate,
                                isadmin:isadmin,
                                team1players : team1players,
                                team2players : team2players
                                
                            }
                            ChallengeDetails = challengedata;

                           // alert(JSON.stringify(ChallengeDetails));
                            callback(ChallengeDetails);

                          }, function (error)
                         {
                            alert(error.message);
                         });

                } catch (error) {
                    alert(error.message);
                }

            },
            
            InvitePlayerToGame: function(challenge,player,whichteam)
            {

                var updates = {};

                try {
                   

                        var challengedata = {

                            day: challenge.day,
                            month: challenge.month,
                            year: challenge.year,
                            hour: challenge.hour,
                            minute: challenge.minute,

                            challengeradmin:challenge.challengeradmin,

                            team1adminid:challenge.team1adminid,
                            team1key:challenge.team1key,
                            team1name:challenge.team1name, //
                            team1logo:challenge.team1logo, //
                            team1rank:challenge.team1rank, //
                            //team1jersey: teams[i].jersey, //

                            team2key:challenge.team2key,
                            team2name:challenge.team2name,
                            team2logo:challenge.team2logo,
                            team2rank:challenge.team2rank,
                            //team2jersey: myteam.jersey,

                            team2adminid:challenge.team2adminid,

                            stadium : challenge.stadiums,

                            belonging : whichteam

                        }
                        updates['/players/' + player.key + '/gameinvitation/'+challenge.key] = challengedata;
                        updates['/challenges/' + challenge.key +'/'+whichteam +'/'+player.key] = 
                        {
                            status : 1
                        };

                    return firebase.database().ref().update(updates);



                } catch (error) {
                    alert(error.message)
                }
            },
            AcceptGameInvitation:function(player)
            {

            }


        }

    })

