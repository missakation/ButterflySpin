angular.module('football.controllers')


    .factory('LeaderBoardStore', function () {
        var MyTeams = [];
        var TeamProfile = {};
        return {

            GetLeaderBoard: function (callback) {

                callback(1);

            }

        }

    })

