angular.module('football.controllers')


    .factory('LeaderBoardStore', function () {
        var RankedTeams = [];
        var TeamProfile = {};
        return {

            GetLeaderboard: function (callback) {
                
                var user = firebase.auth().currentUser;
                var id = user.uid;

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
            }

        }

    })

