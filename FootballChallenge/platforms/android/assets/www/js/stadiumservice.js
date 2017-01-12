
angular.module('football.controllers')

    .factory('ReservationFact', function ($q) {


        var TempItems = [];
        var Availables = [];
        var StadiumInfo = {};
        var AllStadiums = [];
        return {


            FindFreeStadiums: function (search, callback) {
                //var q = $q.defer();
                try {


                    //alert("here");
                    Availables = [];
                    var year = search.date.getFullYear();
                    var month = search.date.getMonth();
                    var day = search.date.getDate();

                    var hour = search.date.getHours();
                    var minute = search.date.getMinutes();


                    //firebase.database().ref('/stadiums/ministadiums').on('value',function (snapshot) {  

                    firebase.database().ref('/stadiums').once('value', function (snapshot) {

                        snapshot.forEach(function (mainstadiumSnapshot) {


                            mainstadiumSnapshot.child("ministadiums").forEach(function (stadiumsnapshot) {

                                var available = true;
                                var starthour = stadiumsnapshot.child("starthour").val();
                                var startminute = stadiumsnapshot.child("startminute").val();

                                var endhour = stadiumsnapshot.child("endhour").val();
                                var endminute = stadiumsnapshot.child("endminute").val();

                                if (stadiumsnapshot.child('schedules/' + year + '/' + month + '/' + day).exists()) {

                                    stadiumsnapshot.child('schedules/' + year + '/' + month + '/' + day).forEach(function (minisnapshot) {


                                        var temphour = minisnapshot.child("hour").val();
                                        var tempminute = minisnapshot.child("minute").val();


                                        if (temphour < starthour || temphour > (endhour - 2) || (Math.abs(temphour - hour) < 1.5)) {
                                            available = false;
                                        }



                                    });
                                    //alert(search.date);

                                    var startdate = new Date();


                                    startdate.setMinutes(minute);
                                    startdate.setFullYear(year);
                                    startdate.setMonth(month);
                                    startdate.setHours(hour);
                                    startdate.setDate(day);

                                }
                                if (available == true) {
                                    var Data = {
                                        "admin": mainstadiumSnapshot.child("admin").val(),
                                        "stadiumkey": mainstadiumSnapshot.key,
                                        "ministadiumkey": stadiumsnapshot.key,
                                        "stadiumname": mainstadiumSnapshot.child("name").val(),
                                        "description": stadiumsnapshot.child("description").val(),
                                        //"datetime": hour + " : " + minute,
                                        "datetime": search.date,
                                        "price": stadiumsnapshot.child("price").val(),
                                        "photo": mainstadiumSnapshot.child("photo").val(),
                                        "type": stadiumsnapshot.child("type").val(),
                                        "typefloor": stadiumsnapshot.child("typefloor").val(),
                                        "distance": "5",
                                        "year": year,
                                        "month": month,
                                        "day": day,

                                        "hour": hour,
                                        "minute": minute,
                                        "selected": "select",
                                        "color": "green",
                                        "backcolor": "white",
                                        "rating" : 1
                                        //"indoor": indoor,
                                        //"outdoor": outdoor,
                                        //"clay": clay,
                                        //"grass":grass



                                    };
                                    Availables.push(Data);
                                }


                            });

                        });

                        callback(Availables);
                    }, function (error) {
                        alert(error.message);
                    });

                }
                catch (error) {
                    alert(error);
                }


            },
            RegisterFreeStadiums: function (search, user, stadiums) {
                //alert("here");
                var year = search.date.getFullYear();
                var month = search.date.getMonth();
                var day = search.date.getDate();

                var hour = search.date.getHours();
                var minute = search.date.getMinutes();

                var key = stadiums.stadiumkey;
                var subkey = stadiums.ministadiumkey;

                var newkey = subkey + year.toString() + month.toString() + day.toString() + hour.toString() + minute.toString();
                //firebase.database().ref('/stadiums/ministadiums').on('value',function (snapshot) {

                var mainkey = newkey;

                var user = firebase.auth().currentUser;

                var id = user.uid;

                var postData = {
                    uid: id,
                    hour: hour,
                    minute: minute,
                    day: day,
                    discount: "0",
                    month: month,
                    nettotal: "",
                    price: stadiums.price,
                    starthour: "",
                    startmin: "",
                    teamone: "",
                    teamonescore: "",
                    teamtwo: "",
                    teamtwoscore: "",
                    usercode: "",
                    percentage: "",
                    duration: 90,
                    type: "B",
                    year: year,
                    total: stadiums.price,
                    bookedadmin: false,
                    maindata: true,
                    references: ""//the main info of the exact beginning time


                };

                var extraslots = {
                    usercode: id,
                    type: "B",
                    maindata: false
                };
                var updates = {};

                var numslots = 90 / 15;

                var mainkey = newkey;
                var references = [];

                for (i = 1; i < numslots; i++) {
                    search.date.setMinutes(search.date.getMinutes() + 15);

                    newkey = subkey + search.date.getFullYear().toString() + search.date.getMonth().toString() + search.date.getDate().toString() + search.date.getHours().toString() + search.date.getMinutes().toString();
                    var refdata = {
                        key: newkey
                    }
                    references.push(refdata);
                    updates['/stadiums/' + key + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = extraslots;

                }
                postData.references = references;

                var accountinfo = {
                    usercode: id,
                    hour: hour,
                    minute: minute,
                    day: day,
                    discount: "0",
                    month: month,
                    nettotal: "",
                    //  price: details.price,
                    starthour: "",
                    startmin: "",
                    year: year,
                    percentage: "0",
                    type: "B",
                    total: 0,
                    bookedadmin: true,
                    fullstartdate: search.date,
                };






                var postDataPlayer = {
                    stadiumkey: stadiums.stadiumkey,
                    ministadiumkey: stadiums.ministadiumkey,
                    photo: stadiums.photo,
                    price: stadiums.price,
                    stadiumdescription: stadiums.stadiumname,
                    hour: hour,
                    minute: minute,
                    day: day,
                    discount: "0",
                    month: month,
                    nettotal: "",
                    teamone: "",
                    teamonescore: 0,
                    teamtwo: "",
                    teamtwoscore: 0,
                    year: year,
                    bookedadmin: false

                };


                // Write the new post's data simultaneously in the posts list and the user's post list.
                var newPostKey = firebase.database().ref().child('posts').push().key;

                updates['/stadiums/' + key + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;

                updates['/players/' + id + '/upcomingmatches/' + mainkey] = postDataPlayer;

                updates['/accounting/' + id + '/' + mainkey] = accountinfo;

                return firebase.database().ref().update(updates);

            },
            GetStadiumsByID: function (id, callback) {
                //var q = $q.defer();
                try {
                    //firebase.database().ref('/stadiums/ministadiums').on('value',function (snapshot) {  

                    firebase.database().ref('/stadiumsinfo/' + id).once('value', function (snapshot) {
                        StadiumInfo = {};

                        var Data = {
                            "stadiumkey": snapshot.key,
                            "stadiumname": snapshot.child("name").val(),
                            "distance": "5",
                            "cancelationpolicy": snapshot.child("cancelationpolicy").val(),
                            "cordovaaccuracy": snapshot.child("cordovaaccuracy").val(),
                            "cordovaaltitude": snapshot.child("cordovaaltitude").val(),
                            "cordovaaltitudeAccuracy": snapshot.child("cordovaaltitudeAccuracy").val(),
                            "cordovaheading": snapshot.child("cordovaheading").val(),
                            "cordovalatitude": snapshot.child("cordovalatitude").val(),
                            "cordovalongitude": snapshot.child("cordovalongitude").val(),
                            "description": snapshot.child("description").val(),
                            "email": snapshot.child("email").val(),
                            "indoor": snapshot.child("indoor").val(),
                            "locationarea": snapshot.child("locationarea").val(),
                            "locationcity": snapshot.child("locationcity").val(),
                            "locationtelephone": snapshot.child("locationtelephone").val(),
                            "name": snapshot.child("name").val(),
                            "numberofstadium": snapshot.child("numberofstadium").val(),
                            "outdoor": snapshot.child("outdoor").val(),
                            "rating": snapshot.child("rating").val(),
                            "telephone": snapshot.child("telephone").val(),
                            "water": snapshot.child("water").val()

                        };
                        StadiumInfo = Data;
                        callback(StadiumInfo);

                    });



                }
                catch (error) {
                    alert(error);
                }
            },
            GetAllStadiums: function (callback) {
                //var q = $q.defer();
                try {
                    //firebase.database().ref('/stadiums/ministadiums').on('value',function (snapshot) {  

                    firebase.database().ref('/stadiumsinfo').once('value', function (snapshot) {
                        AllStadiums = [];
                        snapshot.forEach(function (minisnapshot) {

                        var Data = {
                            "stadiumkey": minisnapshot.key,
                            "name": minisnapshot.child("name").val(),
                            "photo":minisnapshot.child("photo").val(),

                        };
                        AllStadiums.push(Data);
                        })
                        callback(AllStadiums);

                    });



                }
                catch (error) {
                    alert(error);
                }
            }
        }

    })