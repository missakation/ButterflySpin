angular.module('football.controllers')


    .factory('TeamStores', function () {
        var MyTeams = [];
        var TeamProfile = {};
        return {

            GetMyTeams: function (callback) {
                var user = firebase.auth().currentUser;
                var id = user.uid;

                if(id !== null || id == '' || id === undefined)
                {

                
                firebase.database().ref('/players/' + id + '/teams').on('value', function (snapshot) {
                    MyTeams = [];
                    snapshot.forEach(function (childSnapshot) {

                        var datecreated = new Date();


                            datecreated.setMinutes(childSnapshot.child("dateminute").val());
                            datecreated.setFullYear(childSnapshot.child("dateyear").val());
                            datecreated.setMonth(childSnapshot.child("datemonth").val());
                            datecreated.setHours(childSnapshot.child("datehour").val());
                            datecreated.setDate(childSnapshot.child("dateday").val());


                        var Items = {
                            "key": childSnapshot.key,
                            "teamname": childSnapshot.child("teamname").val(),
                            'teamphoto': childSnapshot.child("teamphoto").val(),
                            'datecreated': datecreated,
                            'badge': childSnapshot.child("badge").val(),
                            'members': childSnapshot.child("players").numChildren()

                        };

                        MyTeams.push(Items);
                    });
                    callback(MyTeams);
                });
                }
                else
                {
                    callback(MyTeams);
                }

            },

            GetAllTeams: function () {
                firebase.database().ref('/teams').once('value').then(function (snapshot) {
                    var firstName = snapshot.child("barca/teamphoto").val(); // "Ada"
                    //alert(firstName);
                    var members = 0 ;

                    snapshot.forEach(function (childSnapshot) {

                        var Items = {

                            "key": childSnapshot.val(),
                            "teamname": childSnapshot.child("teamname").val(),
                            'teamphoto': childSnapshot.child("teamphoto").val(),
                            'datecreated': datecreated
                            //'members': childSnapshot.child("players").numChildren()

                        };

                        TempItems.push(Items)
                    });
                });

                return TempItems;
            },

            AddNewTeam: function (newteam , profile) {
                //alert(user.teamname);
                // Get a key for a new Post.
                var user = firebase.auth().currentUser;
                var id = user.uid;
                
                

                 var today = new Date();

                    var year = today.getFullYear();
                    var month = today.getMonth();
                    var day = today.getDate();

                    var hour = today.getHours();
                    var minute = today.getMinutes();
                
                try {
                    var contact = {
                        //badge:team.badge,
                        rating: 1000,
                        status: '1',
                        teamadmin: id,
                        teamname: newteam.teamname,
                        yellowcard: 0,
                        pteamsize: newteam.pteamsize,
                        startmonday: 1,
                        startmondayend: 23,
                        starttuesday: 1,
                        starttuesdayend: 23,
                        startwednesday: 1,
                        startwednesdayend: 23,
                        startthursday: 1,
                        startthursdayend: 23,
                        startfriday: 1,
                        startfridayend: 23,
                        startsaturday: 1,
                        startsaturdayend: 23,
                        startsunday: 1,
                        startsundayend: 23,
                        favstadium: newteam.favstadium,
                        favstadiumphoto: newteam.photo,
                        favstadium: newteam.favstadium,
                        homejersey: newteam.homejersey,
                        awayjersey: newteam.awayjersey,
                        badge: newteam.badge,
                        rank: 1500,
                        numberofgames: 0,
                        wins: 0,

                        teamoffive: newteam.five,
                        teamofsix: newteam.six,
                        teamofseven: newteam.seven,
                        teamofeight: newteam.eight,
                        teamofnine: newteam.nine,
                        teamoften: newteam.ten,
                        teamofeleven: newteam.eleven,

                        dateyear : year,
                        datemonth : month,
                        dateday : day,

                        datehour : hour,
                        dateminute : minute,
                        players:{
                            firstone:true,
                            },
                        captain:{
                            firstone:true,
                            },

                        comments:""

                    };

                    contact.players[id] = {
                        name: profile.displayname,
                        isadmin: true
                    };
                    
                    contact.captain[id] =
                        {
                            name: profile.displayname,
                            isadmin: true
                        };


                    var playerside = {
                        //badge:team.badge,

                        teamname: newteam.teamname,
                        badge: newteam.badge,
                        rank: 1500,

                        dateyear : year,
                        datemonth : month,
                        dateday : day,

                        datehour : hour,
                        dateminute : minute,
                        players:{
                            firstone:true,
                            },

                    };

                    playerside.players[id] =
                        {
                            name: profile.displayname,
                            isadmin: "True"
                        };


                        
                        
                    var newPostKey = firebase.database().ref().child('teams').push().key;
                    var teamstats = {
                        rank: 1500,
                        numberofgames: 0,
                        wins: 0,
                        badge: newteam.badge,
                        name: newteam.teamname
                    }

                    
                    var updates = {};
                    
                    if(id !== null || id == '' || id === undefined)
                    {

                    
                    updates['/teams/' + newPostKey] = contact;


                    updates['/players/' + id + '/teams/' + newPostKey] = playerside;


                    updates['/teampoints/' + newPostKey] = teamstats;

                    updates['/teaminfo/' + newPostKey] = contact;

                    }
                    return firebase.database().ref().update(updates);
                }
                catch (error) {
                    alert(error.message);
                }


            },

            GetTeamByKey: function (key, callback) {
                try {


                    firebase.database().ref('/teams/' + key).once('value').then(function (snapshot) {
                        TeamProfile = {};
                        if (snapshot.exists()) {

                            var players = [];
                            var admins = [];

                            var amiadmin = false;
                            var user = firebase.auth().currentUser;
                            var id = user.uid;

                            if (id == snapshot.child("teamadmin").val()) {
                                amiadmin = true;
                            }

                            //get all the captains with ID and Name
                            if (snapshot.child("captain").exists()) {
                                snapshot.child("captain").forEach(function (pl) {

                                    var data = {

                                        key : pl.key,
                                        name : pl.child("name").val()

                                    }
                                    admins.push(data);

                                })
                            }

                            //get all the players name with ID and Name
                            if (snapshot.child("players").exists()) {
                                snapshot.child("players").forEach(function (pl) {

                                    if(pl.key != "firstone")
                                    {
                                    var data = {

                                        key : pl.key,
                                        name : pl.child("name").val(),
                                        isadmin : pl.child("isadmin").val(),
                                        itsme:pl.key==id,
                                        //for game details
                                        status : 0  

                                    }
                                    players.push(data);
                                    }


                                })
                            }

                            var teamcreateddate = new Date();
                            teamcreateddate.setMinutes(snapshot.child("dateminute").val());
                            teamcreateddate.setFullYear(snapshot.child("dateyear").val());
                            teamcreateddate.setMonth(snapshot.child("datemonth").val());
                            teamcreateddate.setHours(snapshot.child("datehour").val());
                            teamcreateddate.setDate(snapshot.child("dateday").val());

                                var Items = {
                                    "key": snapshot.key,
                                    "teamname": snapshot.child("teamname").val(),
                                    'badge': snapshot.child("badge").val(),
                                    'homejersey': snapshot.child("homejersey").val(),
                                    'awayjersey': snapshot.child("awayjersey").val(),
                                    // 'datecreated': childSnapshot.child("datecreated").val(),

                                    "startmonday": snapshot.child("startmonday").val(),
                                    "startmondayend": snapshot.child("startmondayend").val(),
                                    "starttuesday": snapshot.child("starttuesday").val(),
                                    "starttuesdayend": snapshot.child("starttuesdayend").val(),
                                    "startwednesday": snapshot.child("startwednesday").val(),
                                    "startwednesdayend": snapshot.child("startwednesdayend").val(),
                                    "startthursday": snapshot.child("startthursday").val(),
                                    "startthursdayend": snapshot.child("startthursdayend").val(),
                                    "startfriday": snapshot.child("startfriday").val(),
                                    "startfridayend": snapshot.child("startfridayend").val(),
                                    "startsaturday": snapshot.child("startsaturday").val(),
                                    "startsaturdayend": snapshot.child("startsaturdayend").val(),
                                    "startsunday": snapshot.child("startsunday").val(),
                                    "startsundayend": snapshot.child("startsundayend").val(),
                                    "rank": 1500,
                                    "numberofgames": 0,
                                    "wins": 0,
                                    "amiadmin": amiadmin,
                                    "players": players,
                                    "captain":admins,
                                    "teamadmin":snapshot.child("teamadmin").val(),
                                    "accepted":false,
                                    "pending":false,
                                    "invite":false,
                                    
                                    "comments":snapshot.child("comments").val(),
                                    "datecreated":teamcreateddate
                                };
                                TeamProfile = Items;

                            }
                            callback(TeamProfile);


                        });
                }
                catch (error) {
                    alert(error.message);
                }
            },

            DeleteTeamByKey: function (team) {

                try {

                    var members = team.players;



                    var updates = {};
                    updates['/teams/' + team.key] = null;
                    updates['/teampoints/' + team.key] = null;

                    for(var i = 0 ;i<members.length; i++)
                    {
                        updates['/players/' + members[i].key + '/teams/'+team.key] = null;
                    }


                    // updates['/players/' + id + '/teams/' + newPostKey] = contact;
                    // updates['/teampoints/' + newPostKey] = teamstats;

                    return firebase.database().ref().update(updates);
                }
                catch (error) {
                    alert(error.message);
                }



                return TempItems;
            },

            UpdateTeamByKey: function (profile) {
            try
            {
             var updates = {};
             var id = profile.key;

              //updates['teams/' + id + '/enableinvitations'] = profile.enableinvitations;
              updates['teams/' + id + '/startmonday'] = profile.startmonday;
              updates['teams/' + id + '/startmondayend'] = profile.startmondayend;
              updates['teams/' + id + '/starttuesday'] = profile.starttuesday;
              updates['teams/' + id + '/starttuesdayend'] = profile.starttuesdayend;
              updates['teams/' + id + '/startwednesday'] = profile.startwednesday;
              updates['teams/' + id + '/startwednesdayend'] = profile.startwednesdayend;
              updates['teams/' + id + '/startthursday'] = profile.startthursday;
              updates['teams/' + id + '/startthursdayend'] = profile.startthursdayend;
              updates['teams/' + id + '/startfriday'] = profile.startfriday;
              updates['teams/' + id + '/startfridayend'] = profile.startfridayend;
              updates['teams/' + id + '/startsaturday'] = profile.startsaturday;
              updates['teams/' + id + '/startsaturdayend'] = profile.startsaturdayend;
              updates['teams/' + id + '/startsunday'] = profile.startsunday;
              updates['teams/' + id + '/startsundayend'] = profile.startsundayend;
              updates['teams/' + id + '/comments'] = profile.comments;


              updates['teaminfo/' + id + '/startmonday'] = profile.startmonday;
              updates['teaminfo/' + id + '/startmondayend'] = profile.startmondayend;
              updates['teaminfo/' + id + '/starttuesday'] = profile.starttuesday;
              updates['teaminfo/' + id + '/starttuesdayend'] = profile.starttuesdayend;
              updates['teaminfo/' + id + '/startwednesday'] = profile.startwednesday;
              updates['teaminfo/' + id + '/startwednesdayend'] = profile.startwednesdayend;
              updates['teaminfo/' + id + '/startthursday'] = profile.startthursday;
              updates['teaminfo/' + id + '/startthursdayend'] = profile.startthursdayend;
              updates['teaminfo/' + id + '/startfriday'] = profile.startfriday;
              updates['teaminfo/' + id + '/startfridayend'] = profile.startfridayend;
              updates['teaminfo/' + id + '/startsaturday'] = profile.startsaturday;
              updates['teaminfo/' + id + '/startsaturdayend'] = profile.startsaturdayend;
              updates['teaminfo/' + id + '/startsunday'] = profile.startsunday;
              updates['teaminfo/' + id + '/startsundayend'] = profile.startsundayend;
              updates['teaminfo/' + id + '/comments'] = profile.comments;



                return firebase.database().ref().update(updates);
            }
            catch(error)
            {
                alert(error.message)
            }

            },

            PromoteDeletePlayers: function (team, player, operation) {


                try {
                var updates = {};

                switch (operation) {
                    case 1: //promote
                        updates['/teams/' + team.key + '/players/' + player.key +'/isadmin'] = true;
                        break;
                    case 2: //demote
                        updates['/teams/' + team.key + '/players/' + player.key +'/isadmin'] = false;
                        break;
                    case 3: //remove
                        updates['/teams/' + team.key + '/players/' + player.key] = null;
                        updates['/teams/' + team.key + '/admins/' + player.key] = null;
                        updates['/players/' + player.key + '/teams/' + team.key] = null;
                        break;
                    case 4: //add
                        updates['/teams/' + team.key + '/players/' + player.key] = player;
                        break;

                    default:
                        break;
                }

                return firebase.database().ref().update(updates);
                    
                } catch (error) {
                    alert(error.message);
                }

            },

             LeaveTeam: function (team) {


                try {
                var updates = {};

                updates['/teams/' + team.key + '/players/' + player.key +'/isadmin'] = true;
                updates['/teams/' + team.key + '/players/' + player.key +'/isadmin'] = false;
                
                return firebase.database().ref().update(updates);
                    
                } catch (error) {
                    alert(error.message);
                }

            },

            InvitePlayerToTeam: function (team, player,admindetails) {

                try {

                    var updates = {};

                    var date = new Date();

                    var year = date.getFullYear();
                    var month = date.getMonth();
                    var day = date.getDate();

                    var hour = date.getHours();
                    var minute = date.getMinutes();

                    var invitedata = {

                        "key": team.key,
                        "teamname": team.teamname,
                        'badge': team.badge,
                        'homejersey': team.homejersey,
                        'awayjersey': team.awayjersey,



                        "year": year,
                        "month": month,
                        "day": day,
                        "hour": hour,
                        "minute": minute,

                        "status": 0,

                        "dateyear" : year,
                        "datemonth" : month,
                        "dateday" : day,

                        "datehour" : hour,
                        "dateminute" : minute,

                        "adminkey": admindetails.key,
                        "admindisplayname": admindetails.displayname,
                        "adminphoto": admindetails.photo,
                        "admintelephone": admindetails.telephone


                    };


                    updates['/players/' + player.key + '/teaminvitations/' + team.key] = invitedata;

                    return firebase.database().ref().update(updates);

                } catch (error) {
                    alert(error.message);
                }

            }


        }

    })
