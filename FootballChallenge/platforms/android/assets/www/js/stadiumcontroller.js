
angular.module('football.controllers')
    .controller('stadiumcontroller', function ($scope, $http, $ionicPopover, ReservationFact, $ionicPopup, $ionicLoading, $timeout, $state, $cordovaDatePicker, pickerView) {

        function getDateFromDayName(selectedDay) {
            var selectedDate = new Date();
            if (selectedDay == "Tomorrow") {
                selectedDate.setDate(selectedDate.getDate() + 1);
                return weekday[selectedDate.getDay()] + monthChar[selectedDate.getMonth()] + " " + selectedDate.getDate();
            }
            for (var i = 0; i < 6; i++) {
                if (weekdayFull[selectedDate.getDay()] == selectedDay)
                    return weekday[selectedDate.getDay()] + monthChar[selectedDate.getMonth()] + " " + selectedDate.getDate();
                selectedDate.setDate(selectedDate.getDate() + 1);
            }
        }

        $scope.openPickerView = function openPickerView() {

            var picker = pickerView.show({
                titleText: '', // default empty string
                doneButtonText: 'Search', // dafault 'Done'
                cancelButtonText: 'Close', // default 'Cancel'
                items: [{
                    values: dateArrayThingy,
                    defaultIndex: 1
                }, {
                    values: [' 7:00 AM ', ' 7:30 AM ', ' 8:00 AM ', ' 8:30 AM ', ' 9:00 AM ', '9:30 AM ', ' 10:00 AM ', ' 10:30 AM', ' 11:00 AM ', ' 11:30 AM ', ' Noon ', ' 1:00 PM ', ' 1:30 PM ', ' 2:00 PM ', ' 2:30 PM ', ' 3:00 PM ', ' 3:30 PM ', ' 4:00 PM ', ' 4:30 PM ', ' 5:00 PM ', ' 5:30 PM ', ' 6:00 PM ', ' 6:30 PM ', ' 7:00 PM ', ' 7:30 PM ', ' 8:00 PM', ' 8:30 PM ', ' 9:00 PM ', ' 9:30 PM ', ' 10:00 PM ', ' 10:30 PM ', ' 11:00 PM', '11:30 PM ', ' Midnight ',],
                    defaultIndex: 27
                }, {
                    values: [" 5 Vs 5", " 6 Vs 6", " 7 Vs 7", " 8 Vs 8", " 9 Vs 9", " 10 Vs 10", " 11 Vs 11"],
                    defaultIndex: 0
                }]
            });




            if (picker) {
                picker.then(function pickerViewFinish(output) {
                    if (output) {
                        // output is Array type
                        var correctDate;
                        var selectedDate = output[0];
                        var selectedTime = output[1];
                        if (!Date.parse(selectedDate)) {
                            selectedDate = getDateFromDayName(selectedDate);
                            console.log(selectedDate);
                        }
                        $scope.search.date = new Date(selectedDate + " " + selectedTime + ", " + (new Date()).getFullYear());
                        $scope.search.players = (output[2].split(" "))[1];
                        console.log($scope.search.date);
                        $scope.search.text = output.join(" -");
                        $scope.checkfree();
                    }
                });
            }
        };

        $scope.notverified = false;
        $scope.nointernet = false;
        $scope.gotlocation = false;
        $scope.latitude = 0;
        $scope.longitude = 0;



        /*        var user = firebase.auth().currentUser;
    
                if (user != null) {
                    user.providerData.forEach(function (profile) 
                    {
                        
                        if(user.emailVerified)
                        {
                             $scope.verified = false;
                        }
                        else
                        {
                            $scope.verified = true;
                        }
                    });
                }
                else
                {
                    $scope.verified = true;
                }
    */


        $scope.filter = {
            indoor: true,
            outdoor: true,
            clay: true,
            grass: true,
            money: 0

        }
        $scope.choice = {
            sort: 'price'
        };
        $scope.tempchoice = {
            sort: 'price'
        };

        // .fromTemplate() method
        var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

        $scope.popover = $ionicPopover.fromTemplate(template, {
            scope: $scope
        });

        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('templates/my-popover.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });


        $scope.openPopover = function ($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function () {
            $scope.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.popover.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function () {
            // Execute action
            //scope.$digest();
            //alert($scope.choice)
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function () {
            // Execute action
        });


        $scope.slider6 = {
            minValue: 1,
            maxValue: 23,
            options: {
                floor: 0,
                showSelectionBar: true,
                readOnly: false,
                disabled: false,
                getSelectionBarColor: function (value) {
                    return 'dark#28b041';
                },
                getPointerColor: function (value) {
                    return 'lightgrey';

                },
                ceil: 23,
                draggableRange: true

            }
        };

        //alert(TeamStore.GetAccountInfo().code);
        // set the rate and max variables
        $scope.rating = {};
        $scope.rating.rate = 3;
        $scope.rating.max = 5;

        $scope.readOnly = true;

        var freestadiums = [];


        //$scope.search.date = "2013-01-08";
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        $scope.search = {
            date: tomorrow,
            text: "Tomorrow, 9:00PM - 5 Vs 5 "
        };







        $scope.search.date.setDate($scope.search.date.getDate() + 1);
        $scope.search.date.setHours(21);
        $scope.search.date.setMinutes(0);
        $scope.search.date.setMilliseconds(0);
        $scope.search.date.setSeconds(0);
        //alert($scope.search.date);
        $scope.allfreestadiums = [];


        $scope.checkfree = function () {


            //works
            ReservationFact.FindFreeStadiums($scope.search, function (leagues) {

                $ionicLoading.hide();
                $scope.globalstadiums = leagues;
                $scope.allfreestadiums = leagues;
                $scope.$apply();

                if (leagues.length == 0) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'No results',
                        template: 'No Available Stadiums'
                    });
                }

                /*     for (var i = 0; i < $scope.allfreestadiums.length; i++) {
                         for (var i = 0; i < $scope.allfreestadiums[i].freetimes.length; i++) {
     
     
                         }
                     }*/
                if ($scope.gotlocation) {
                    /** Converts numeric degrees to radians */
                    for (var i = 0; i < leagues.length; i++) {
                        var lat1 = $scope.latitude;
                        var lon1 = $scope.longitude;

                        var lat2 = $scope.allfreestadiums[i].latitude;
                        var lon2 = $scope.allfreestadiums[i].longitude;


                        var R = 6371; // km 
                        //has a problem with the .toRad() method below.
                        var x1 = lat2 - lat1;
                        var dLat = x1.toRad();
                        var x2 = lon2 - lon1;
                        var dLon = x2.toRad();
                        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                            Math.sin(dLon / 2) * Math.sin(dLon / 2);
                        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        var d = R * c;

                        $scope.allfreestadiums[i].distance = d;
                    }
                }
            })
        }

        if (typeof (Number.prototype.toRad) === "undefined") {
            Number.prototype.toRad = function () {
                return this * Math.PI / 180;
            }
        }
        navigator.geolocation.getCurrentPosition(function (position) {
            //here
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            //here
            /*  alert('Latitude: ' + position.coords.latitude + '\n' +
            'Longitude: ' + position.coords.longitude + '\n' +
            'Altitude: ' + position.coords.altitude + '\n' +
            'Accuracy: ' + position.coords.accuracy + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
            'Heading: ' + position.coords.heading + '\n' +
            'Speed: ' + position.coords.speed + '\n' +
            'Timestamp: ' + position.timestamp + '\n');*/

            $scope.latitude = position.coords.latitude;
            $scope.longitude = position.coords.longitude;

            $scope.gotlocation = true;

            // Simple GET request example:
            $http({
                method: 'GET',
                url: 'https://us-central1-project-6346119287623064588.cloudfunctions.net/date'
            }).then(function successCallback(response) {


                $scope.checkfree();

                //alert(JSON.stringify(response.data));

            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alert(JSON.stringify(response));
            });


        }, function (error) {

            $scope.checkfree();
        });

        try {
            //  $scope.checkfree();
        }
        catch (error) {
            alert(error.message);
        }

        $scope.reserve = function (search, stadiums) {
            try {


                var confirmPopup = $ionicPopup.confirm({
                    cssClass: 'custom-class',
                    title: 'Reserve Stadium',
                    template: 'Are you sure you want to reserve the stadium on ' + search.date.toLocaleString() + '</br>'
                });

                if (!$scope.nointernet) {


                    confirmPopup.then(function (res) {
                        if (res) {

                            ReservationFact.RegisterFreeStadiums($scope.search, "", stadiums)
                                .then(function (value) {
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Success',
                                        template: 'Successfully Reserved'
                                    });
                                    $scope.search = {
                                        date: new Date(),
                                    };
                                    $scope.search.date.setDate($scope.search.date.getDate() + 1);
                                    $scope.search.date.setHours(21);
                                    $scope.search.date.setMinutes(0);
                                    $scope.search.date.setMilliseconds(0);
                                    $scope.search.date.setSeconds(0);
                                    //alert($scope.search.date);
                                    $state.go("app.bookings");
                                }, function (error) {
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Error',
                                        template: 'Stadium Not Available. Please Try Again'
                                    });

                                    alertPopup.then(function (res) {
                                        // Custom functionality....
                                    });
                                    //$scope.allfreestadiums.

                                })

                        } else {



                        }

                    });
                }

            }
            catch (error) {
                alert(error.message);
            }

        }


        $scope.updatefilter = function () {
            $scope.closePopover();
            $ionicLoading.show({
                content: 'Applying Filter',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            $scope.allfreestadiums = $scope.globalstadiums.filter(function (el) {

                return ((el.type.toLowerCase() == "indoor" && $scope.filter.indoor) &&
                    ((el.typefloor.toLowerCase() == "grass" && $scope.filter.grass) || (el.typefloor.toLowerCase() == "clay" && $scope.filter.clay))
                    ||
                    (el.type.toLowerCase() == "outdoor" && $scope.filter.outdoor) &&
                    ((el.typefloor.toLowerCase() == "grass" && $scope.filter.grass) || (el.typefloor.toLowerCase() == "clay" && $scope.filter.clay)))



            });

            if (!$scope.filter.indoor && !$scope.filter.outdoor && !$scope.filter.grass && !$scope.filter.clay) {
                $scope.allfreestadiums = $scope.globalstadiums;
            }



            $ionicLoading.hide();



            //    $scope.allfreestadiums = $scope.allfreestadiums.filter(function (el) {
            //                return el.key !== team.key;
            //            });

        }

        $scope.cancelfilter = function () {
            $scope.closePopover();
        }

        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {
                $scope.nointernet = false;
            }
            else {
                $ionicLoading.hide();
                $scope.nointernet = true;
            }
        });


    })

    .controller('stadiumdetailscontroller', function ($scope, $stateParams, $ionicPopover, ReservationFact, $ionicPopup, $ionicLoading, $timeout, $state, $cordovaDatePicker) {

        //alert(JSON.stringify(firebase.database.ServerValue.TIMESTAMP));

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        //here

        //works


        $scope.doRefresh = function () {
            try {
                //works
                ReservationFact.GetStadiumsByID($stateParams.stadiumid, function (leagues) {
                    $ionicLoading.hide();
                    $scope.stadiums = leagues;
                    $scope.$apply();
                    $scope.$broadcast('scroll.refreshComplete');
                })
            }
            catch (error) {
                alert(alert.message);
            }


        }

        $scope.doRefresh();


    }).factory('pickerView', ['$compile', '$rootScope', '$timeout', '$q', '$ionicScrollDelegate', '$ionicBackdrop',
        function ($compile, $rootScope, $timeout, $q, $ionicScrollDelegate, $ionicBackdrop) {

            var i, j, k, tmpVar;

            var domBody, pickerCtnr, pickerInfo;

            var isInit, isShowing;

            var setElementRotate = function setElementRotate(elemList, ni) {
                if (ni < 0 || ni === undefined) { return; }

                if (ni - 2 >= 0)
                    angular.element(elemList[ni - 2]).removeClass('pre-select');
                if (ni - 1 >= 0)
                    angular.element(elemList[ni - 1]).removeClass('selected').addClass('pre-select');

                angular.element(elemList[ni]).removeClass('pre-select').addClass('selected');
                if (ni + 1 < elemList.length)
                    angular.element(elemList[ni + 1]).removeClass('selected').addClass('pre-select');
                if (ni + 2 < elemList.length)
                    angular.element(elemList[ni + 2]).removeClass('pre-select');
            };

            var init = function init() {
                if (isInit) { return; }

                var template =
                    '<div class="picker-view"> ' +
                    '<div class="picker-accessory-bar">' +
                    '<a class="button button-clear" on-tap="pickerEvent.onCancelBuuton()" ng-bind-html="pickerOptions.cancelButtonText"></a>' +
                    '<h3 class="picker-title" ng-bind-html="pickerOptions.titleText"></h3>' +
                    '<a class="button button-clear" on-tap="pickerEvent.onDoneBuuton()" ng-bind-html="pickerOptions.doneButtonText"></a>' +
                    '</div>' +
                    '<div class="picker-content">' +
                    '<ion-scroll ng-repeat="(idx, item) in pickerOptions.items track by $index" ' +
                    'class="picker-scroll" ' +
                    'delegate-handle="{{ \'pickerScroll\' + idx }}" ' +
                    'direction="y" ' +
                    'scrollbar-y="false" ' +
                    'has-bouncing="true" ' +
                    'overflow-scroll="false" ' +
                    'on-touch="pickerEvent.scrollTouch(idx)" ' +
                    'on-release="pickerEvent.scrollRelease(idx)" ' +
                    'on-scroll="pickerEvent.scrollPicking(event, scrollTop, idx)">' +

                    '<div ng-repeat="val in item.values track by $index" ng-bind-html="val"></div>' +
                    '</ion-scroll>' +
                    '</div>' +
                    '</div>';

                pickerCtnr = $compile(template)($rootScope);
                pickerCtnr.addClass('hide');

                ['webkitAnimationStart', 'animationstart'].forEach(function runAnimStartHandle(eventKey) {
                    pickerCtnr[0].addEventListener(eventKey, function whenAnimationStart() {
                        if (pickerCtnr.hasClass('picker-view-slidein')) {
                            // Before Show Picker View
                            $ionicBackdrop.retain();
                            isShowing = true;
                        } else if (pickerCtnr.hasClass('picker-view-slideout')) {
                            // Before Hide Picker View
                            isShowing = false;
                        }
                    }, false);
                });

                ['webkitAnimationEnd', 'animationend'].forEach(function runAnimEndHandle(eventKey) {
                    pickerCtnr[0].addEventListener(eventKey, function whenAnimationEnd() {
                        if (pickerCtnr.hasClass('picker-view-slidein')) {
                            // After Show Picker View
                            pickerCtnr.removeClass('picker-view-slidein');
                        } else if (pickerCtnr.hasClass('picker-view-slideout')) {
                            // After Hide Picker View
                            pickerCtnr.addClass('hide').removeClass('picker-view-slideout');
                            $ionicBackdrop.release();
                        }
                    }, false);
                });

                if (!domBody) { domBody = angular.element(document.body); }
                domBody.append(pickerCtnr);
                isInit = true;
            };

            var dispose = function dispose() {
                pickerCtnr.remove();

                for (k in $rootScope.pickerOptions) { delete $rootScope.pickerOptions[k]; }
                delete $rootScope.pickerOptions;
                for (k in $rootScope.pickEvent) { delete $rootScope.pickEvent[k]; }
                delete $rootScope.pickEvent;

                pickerCtnr = pickerInfo = i = j = k = tmpVar = null;

                isInit = isShowing = false;
            };

            var close = function close() {
                if (!isShowing) { return; }

                pickerCtnr.addClass('picker-view-slideout');
            };

            var show = function show(opts) {
                if (!isInit || typeof opts !== 'object') { return undefined; }

                var pickerShowDefer = $q.defer();

                opts.titleText = opts.titleText || '';
                opts.doneButtonText = opts.doneButtonText || 'Done';
                opts.cancelButtonText = opts.cancelButtonText || 'Cancel';

                pickerInfo = [];
                for (i = 0; i < opts.items.length; i++) {
                    if (opts.items[i].defaultIndex === undefined) {
                        opts.items[i].defaultIndex = 0;
                    }

                    // push a empty string to last, because the scroll height problem
                    opts.items[i].values.push('&nbsp;');

                    pickerInfo.push({
                        scrollTopLast: undefined,
                        scrollMaxTop: undefined,
                        eachItemHeight: undefined,
                        nowSelectIndex: opts.items[i].defaultIndex,
                        output: opts.items[i].values[opts.items[i].defaultIndex],
                        isTouched: false,
                        isFixed: false,
                        scrollStopTimer: null
                    });
                }

                for (k in $rootScope.pickerOptions) { delete $rootScope.pickerOptions[k]; }
                delete $rootScope.pickerOptions;
                for (k in $rootScope.pickEvent) { delete $rootScope.pickEvent[k]; }
                delete $rootScope.pickEvent;

                $rootScope.pickerOptions = opts;
                $rootScope.pickerEvent = {
                    onDoneBuuton: function onDoneBuuton() {
                        var pickerOutput = (function () {
                            var totalOutput = [];
                            for (i = 0; i < $rootScope.pickerOptions.items.length; i++) {
                                totalOutput.push(pickerInfo[i].output);
                            }
                            return totalOutput;
                        })();
                        pickerShowDefer.resolve(pickerOutput);
                        close();
                    },
                    onCancelBuuton: function onCancelBuuton() {
                        pickerShowDefer.resolve();
                        close();
                    },
                    scrollTouch: function scrollTouch(pickerIdx) {
                        pickerInfo[pickerIdx].isTouched = true;
                        pickerInfo[pickerIdx].isFixed = false;
                    },
                    scrollRelease: function scrollRelease(pickerIdx) {
                        pickerInfo[pickerIdx].isTouched = false;
                    },
                    scrollPicking: function scrollPicking(e, scrollTop, pickerIdx) {
                        if (!$rootScope.pickerOptions) { return; }

                        if (!pickerInfo[pickerIdx].isFixed) {
                            pickerInfo[pickerIdx].scrollTopLast = scrollTop;

                            // update the scrollMaxTop (only one times)
                            if (pickerInfo[pickerIdx].scrollMaxTop === undefined) {
                                pickerInfo[pickerIdx].scrollMaxTop = e.target.scrollHeight - e.target.clientHeight + e.target.firstElementChild.offsetTop;
                            }

                            // calculate Select Index
                            tmpVar = Math.round(pickerInfo[pickerIdx].scrollTopLast / pickerInfo[pickerIdx].eachItemHeight);

                            if (tmpVar < 0) {
                                tmpVar = 0;
                            } else if (tmpVar > e.target.firstElementChild.childElementCount - 2) {
                                tmpVar = e.target.firstElementChild.childElementCount - 2;
                            }

                            if (pickerInfo[pickerIdx].nowSelectIndex !== tmpVar) {
                                pickerInfo[pickerIdx].nowSelectIndex = tmpVar;
                                pickerInfo[pickerIdx].output = $rootScope.pickerOptions.items[pickerIdx].values[pickerInfo[pickerIdx].nowSelectIndex];

                                // update item states
                                setElementRotate(e.target.firstElementChild.children,
                                    pickerInfo[pickerIdx].nowSelectIndex);
                            }
                        }


                        if (pickerInfo[pickerIdx].scrollStopTimer) {
                            $timeout.cancel(pickerInfo[pickerIdx].scrollStopTimer);
                            pickerInfo[pickerIdx].scrollStopTimer = null;
                        }
                        if (!pickerInfo[pickerIdx].isFixed) {
                            pickerInfo[pickerIdx].scrollStopTimer = $timeout(function () {
                                $rootScope.pickerEvent.scrollPickStop(pickerIdx);
                            }, 80);
                        }
                    },
                    scrollPickStop: function scrollPickStop(pickerIdx) {
                        if (pickerInfo[pickerIdx].isTouched || pickerIdx === undefined) {
                            return;
                        }

                        pickerInfo[pickerIdx].isFixed = true;

                        // check each scroll position
                        for (j = $ionicScrollDelegate._instances.length - 1; j >= 1; j--) {
                            if ($ionicScrollDelegate._instances[j].$$delegateHandle !== ('pickerScroll' + pickerIdx)) { continue; }

                            // fixed current scroll position
                            tmpVar = pickerInfo[pickerIdx].eachItemHeight * pickerInfo[pickerIdx].nowSelectIndex;
                            if (tmpVar > pickerInfo[pickerIdx].scrollMaxTop) {
                                tmpVar = pickerInfo[pickerIdx].scrollMaxTop;
                            }
                            $ionicScrollDelegate._instances[j].scrollTo(0, tmpVar, true);
                            break;
                        }
                    }
                };

                (function listenScrollDelegateChanged(options) {
                    var waitScrollDelegateDefer = $q.defer();

                    var watchScrollDelegate = $rootScope.$watch(function getDelegate() {
                        return $ionicScrollDelegate._instances;
                    }, function delegateChanged(instances) {
                        watchScrollDelegate(); // remove watch callback
                        watchScrollDelegate = null;

                        var waitingScrollContentUpdate = function waitingScrollContentUpdate(prIdx, sDele) {
                            $timeout(function contentRefresh() {
                                watchScrollDelegate = $rootScope.$watch(function getUpdatedScrollView() {
                                    return sDele.getScrollView();
                                }, function scrollViewChanged(sView) {
                                    watchScrollDelegate();
                                    watchScrollDelegate = null;

                                    pickerInfo[prIdx].eachItemHeight = sView.__content.firstElementChild.clientHeight;

                                    // padding the first item
                                    sView.__container.style.paddingTop = (pickerInfo[prIdx].eachItemHeight * 1.5) + 'px';

                                    // scroll to default index (no animation)
                                    sDele.scrollTo(0, pickerInfo[prIdx].eachItemHeight * options.items[prIdx].defaultIndex, true);

                                    // update item states
                                    setElementRotate(sView.__content.children,
                                        options.items[prIdx].defaultIndex);
                                });
                            }, 20);
                        };

                        var dele;
                        for (i = 0; i < options.items.length; i++) {
                            dele = null;
                            for (j = instances.length - 1; j >= 1; j--) {
                                if (instances[j].$$delegateHandle === undefined) { continue; }

                                if (instances[j].$$delegateHandle === ('pickerScroll' + i)) {
                                    dele = instances[j];
                                    break;
                                }
                            }

                            if (dele) { waitingScrollContentUpdate(i, dele); }
                        }

                        waitScrollDelegateDefer.resolve();
                    });

                    return waitScrollDelegateDefer.promise;
                })(opts).then(function preparePickerViewFinish() {
                    if (!isShowing) {
                        pickerCtnr.removeClass('hide').addClass('picker-view-slidein');
                    }
                });

                pickerShowDefer.promise.close = close;
                return pickerShowDefer.promise;
            };

            var getIsInit = function getIsInit() { return isInit; };
            var getIsShowing = function getIsShowing() { return isShowing; };

            ionic.Platform.ready(init); // when DOM Ready, init Picker View

            return {
                init: init,
                dispose: dispose,
                show: show,
                close: close,

                isInit: getIsInit,
                isShowing: getIsShowing
            };
        }]);

var weekday = new Array(7);
weekday[0] = "Su,";
weekday[1] = "Mo,";
weekday[2] = "Tu,";
weekday[3] = "We,";
weekday[4] = "Th,";
weekday[5] = "Fr,";
weekday[6] = "Sa,";

var weekdayFull = new Array(7);
weekdayFull[0] = "Sunday";
weekdayFull[1] = "Monday";
weekdayFull[2] = "Tuesday";
weekdayFull[3] = "Wednesday";
weekdayFull[4] = "Thursday";
weekdayFull[5] = "Friday";
weekdayFull[6] = "Saturday";


monthChar = new Array(12);
monthChar[0] = "Jan";
monthChar[1] = "Feb";
monthChar[2] = "Mar";
monthChar[3] = "Apr";
monthChar[4] = "May";
monthChar[5] = "Jun";
monthChar[6] = "Jul";
monthChar[7] = "Aug";
monthChar[8] = "Sep";
monthChar[9] = "Oct";
monthChar[10] = "Nov";
monthChar[11] = "Dec";

var nesheDate = new Date();
var dateArrayThingy = new Array();
dateArrayThingy.push("Today");
dateArrayThingy.push("Tomorrow");
//alert(nesheDate.getDay());
nesheDate.setDate(nesheDate.getDate() + 1);
for (i = 0; i < 7; i++) {
    nesheDate.setDate(nesheDate.getDate() + 1);
    dateArrayThingy.push(weekdayFull[nesheDate.getDay()]);
}
for (i = 0; i < 100; i++) {
    nesheDate.setDate(nesheDate.getDate() + 1);
    //alert(weekday[nesheDate.getDay()]);
    var day = weekday[nesheDate.getDay()];
    var month = monthChar[nesheDate.getMonth()];
    var dayInMonth = nesheDate.getDate();
    dateArrayThingy.push(day + " " + month + " " + dayInMonth);
}
