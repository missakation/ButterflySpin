angular.module('football.controllers')


    .factory('LeaderBoardStore', function () {
        var RankedTeams = [];
        var TeamProfile = {};
        return {

            GetLeaderboard: function (limit, callback) {



                firebase.database().ref('/teampoints').orderByChild("rank").limitToFirst(limit).once('value').then(function (snapshot) {
                    RankedTeams = [];
                    snapshot.forEach(function (childSnapshot) {


                        var Items = {
                            "key": childSnapshot.key,
                            "teamname": childSnapshot.child("name").val(),
                            'badge': childSnapshot.child("badge").val(),
                            'rank': childSnapshot.child("rank").val()

                        };

                        RankedTeams.push(Items);
                    });
                    callback(RankedTeams);
                });
            },
            GetAllLeaderboard: function ( callback) {
                firebase.database().ref('/teampoints').orderByChild("rank").once('value').then(function (snapshot) {
                    RankedTeams = [];
                    snapshot.forEach(function (childSnapshot) {


                        var Items = {
                            "key": childSnapshot.key,
                            "teamname": childSnapshot.child("name").val(),
                            'badge': childSnapshot.child("badge").val(),
                            'rank': childSnapshot.child("rank").val()

                        };

                        RankedTeams.push(Items);
                    });
                    callback(RankedTeams);
                });
            },
            UpdateRatings: function (allteams) {
                var updates = {};
                var counter = 0;
                allteams.forEach(function (element) {
                    counter++;
                    updates['/teampoints/' + element.key + '/rating'] = counter;
                    updates['/teams/' + element.key + '/rank'] = counter;
                    updates['/teaminfo/' + element.key + '/rank'] = counter;
                }, this);

                return firebase.database().ref().update(updates);
            }

        }

    })

