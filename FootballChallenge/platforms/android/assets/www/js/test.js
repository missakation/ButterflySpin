
angular.module('football.controllers')


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
                                    "photo": childSnapshot.child("photo").val()

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