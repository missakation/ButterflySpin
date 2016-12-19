
angular.module('football.controllers')


    .factory('ProfileStore', function () {
        var TempItems = {};
        return {
            GetProfileInfo: function (callback) {
                

                var user = firebase.auth().currentUser;
                var id = user.uid;

                try {

                        
                    firebase.database().ref('/players/' +id).on('value', function (snapshot) {
                        TempItems = {};
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
                         //   "upcomingmatches": snapshot.child("upcomingmatches").exists() ? snapshot.child("upcomingmatches").val() : "",
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

                        };

                        TempItems = Items;
                        callback(TempItems);
                    });

                    
                }
                catch (error) {
                    alert(error.message);
                }
            },

            UpdateProfile: function (profile) {

                var user = firebase.auth().currentUser;
                var id = user.uid;

            try
            {
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
                alert(error.message)
            }
            }
            


        }

    })