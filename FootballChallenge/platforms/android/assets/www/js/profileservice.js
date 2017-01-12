
angular.module('football.controllers')


    .factory('ProfileStore', function () {
        var TempItems = {};
        return {
            GetProfileInfo: function (callback) {
                

                var user = firebase.auth().currentUser;
                var id = user.uid;

                var upcomingmatches = [];


                try {

                        
                    firebase.database().ref('/players/' +id).once('value').then(function (snapshot) {
                        
                    TempItems = {};
                    if (snapshot.child("upcominteamgmatches").exists()) {

                        snapshot.child("upcominteamgmatches").forEach(function (challenges) {

                            
                            var matchdate = new Date();


                            matchdate.setMinutes(challenges.child("minute").val());
                            matchdate.setFullYear(challenges.child("year").val());
                            matchdate.setMonth(challenges.child("month").val());
                            matchdate.setHours(challenges.child("hour").val());
                            matchdate.setDate(challenges.child("day").val());

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
                                stadiumdescription: challenges.child("stadiumdescription").val()
                            }
                            upcomingmatches.push(matchdata);

                        }) 


                    }
                        var Items = {
                            "key": snapshot.key,
                            "displayname": snapshot.child("displayname").val(),
                            "enableinvitations": snapshot.child("enableinvitations").val(),
                         //   "favouritesport": snapshot.child("favouritesport").val(),
                            "firstname": snapshot.child("firstname").val(),
                         //   "highestrating": snapshot.child("highestrating").val(),
                            "lastname": snapshot.child("lastname").val(),
                            "middlename": snapshot.child("middlename").val(),
                            "playposition": snapshot.child("playposition").val(),
                            "ranking": snapshot.child("ranking").val(),
                            "status": snapshot.child("status").val(),
                         //   "teams": snapshot.child("teams").exists() ? snapshot.child("teams").val() : "",
                            "telephone": snapshot.child("telephone").val(),
                            "upcomingmatches": upcomingmatches,
                         //   "winstreak": snapshot.child("winstreak").val(),

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
                            "comments": snapshot.child("comments").val()

                        };

                        TempItems = Items;
                        callback(TempItems);
                    });

                    
                }
                catch (error) {
                    alert(error.message);
                }
            },

            UpdateProfile: function (profile)
            {
                    try
                    {
                        var user = firebase.auth().currentUser;
                        var id = user.uid;

                    var updates = {};
                    updates['players/' + id + '/enableinvitations'] = profile.enableinvitations;
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

                        return firebase.database().ref().update(updates);
                    }
                    catch(error)
                    {
                        alert(error.message);
                    }
        }
            


        }

    })