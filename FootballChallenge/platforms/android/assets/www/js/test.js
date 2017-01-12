
angular.module('football.controllers')


    .factory('ProfileStore1', function () {
        var TempItems = {};
        return {

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
                    updates['players/' + id + '/comments'] = profile.comments;

                        return firebase.database().ref().update(updates);
                    }
                    catch(error)
                    {
                        alert(error.message);
                    }
        }

        }

    })