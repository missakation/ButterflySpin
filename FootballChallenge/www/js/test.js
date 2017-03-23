
angular.module('football.controllers')


    .factory('ProfileStore1', function () {
        var TempItems = {};
        return {

            UpdateProfile: function (profile) {
                try {


                    var ageset = profile.age.getFullYear() == 1900 ? false : true;

                    var year = profile.age.getFullYear();
                    var month = profile.age.getMonth();
                    var day = profile.age.getDate();

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

                    //Age
                    updates['players/' + id + '/ageyear'] = year;
                    updates['players/' + id + '/agemonth'] = month;
                    updates['players/' + id + '/ageday'] = day;
                    updates['players/' + id + '/ageset'] = ageset;
                    updates['players/' + id + '/firstname'] = profile.firstname;
                    updates['players/' + id + '/lastname'] = profile.lastname;


                    updates['playersinfo/' + id + '/enableinvitations'] = profile.enableinvitations;
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

                    //Age
                    updates['playersinfo/' + id + '/ageyear'] = year;
                    updates['playersinfo/' + id + '/agemonth'] = month;
                    updates['playersinfo/' + id + '/ageday'] = day;
                    updates['playersinfo/' + id + '/ageset'] = ageset;
                    updates['playersinfo/' + id + '/firstname'] = profile.firstname;
                    updates['playersinfo/' + id + '/lastname'] = profile.lastname;

                    return firebase.database().ref().update(updates);
                }
                catch (error) {
                    alert(error.message);
                }
            }

        }

    })