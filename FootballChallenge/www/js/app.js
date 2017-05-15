// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('football', ['ionic', 'ionicImgCache', 'football.controllers', 'ionic.cloud', "ion-datetime-picker", "ionicLazyLoad", "ion-floating-menu", 'ngCordova', 'ionic.rating', 'rzModule'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (cordova.platformId === 'ios' && window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });

        //  // This hooks all auth events to check everything as soon as the app starts
        //auth.hookEvents();



    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicCloudProvider, ionicImgCacheProvider) {
        $ionicCloudProvider.init({
            "core": {
                "app_id": "de07ef7c"
            },
            "push": {
                "sender_id": "597359579523",
                "pluginConfig": {
                    "ios": {
                        "badge": true,
                        "sound": true
                    },
                    "android": {
                        "iconColor": "#343434"
                    }
                }
            }
        })

        ionicImgCacheProvider.debug(true);

        // Set storage size quota to 100 MB. 
        ionicImgCacheProvider.quota(100);

        // Set foleder for cached files. 
        ionicImgCacheProvider.folder('ARINACACHE');
        $stateProvider

            .state('firstpage', {
                url: '/firstpage',
                templateUrl: 'templates/firstpage.html',
                controller: 'FirstPageController'
            })

            .state('signin', {
                url: '/loginpage',
                templateUrl: 'templates/loginpage.html',
                controller: 'LoginController'
            })
            .state('loginforgotpass', {
                url: '/loginforgotpass',
                templateUrl: 'templates/loginforgotpass.html',
                controller: 'LoginPassController'
            })


            .state('registerpage', {
                url: '/register',
                templateUrl: 'templates/loginRegisterPage.html',
                controller: 'LoginController'
            })


            .state('app',
            {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html'
            }
            )
            .state('app.search', {
                url: '/search',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/search.html'
                    }
                }
            })
            .state('app.searchAll', {
                url: '/searchAll/:searchCriteria',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/searchPage.html',
                        controller: 'GlobalSearchController'
                    }
                }
            })

            .state('app.firsttimelogin', {
                url: '/firsttimelogin',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/firsttimelogin.html',
                        controller: 'FirstTimeLoginController'
                    }
                }
            })

            .state('app.browse', {
                url: '/browse',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/browse.html'
                    }
                }
            })
            .state('app.homepage', {
                url: '/homepage',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/homepage.html',
                        controller: 'HomeController'
                    }
                }
            })

            .state('app.feedbacks', {
                url: '/feedbacks',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/feedbacks.html'
                    }
                }
            })

            .state('app.reservestadium', {
                url: '/reservestadium',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/reservestadium.html',
                        controller: 'stadiumcontroller'
                    }
                }
            })

            .state('app.reservestadiumdetails', {
                url: '/reservestadiumdetails/:stadiumid',
                views: {
                    'menuContent': {

                        templateUrl: 'templates/reservestadiumdetails.html',
                        controller: 'stadiumdetailscontroller'
                    }
                }
            })

            .state('app.availableplayers', {
                url: '/availableplayers',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/availableplayers.html',
                        controller: "SearchController"
                    }
                }
            })

            .state('app.chooseyourteam', {
                url: '/chooseyourteam',
                params: {
                    otherteam: null,
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/chooseyourteam.html',
                        controller: 'ChooseYourTeamController'
                    }
                }
            })



            .state('app.availablestadiums', {
                url: '/availablestadiums',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/availablestadiums.html'
                    }
                }
            })
            .state('app.gamedetails', {
                url: '/gamedetails/:gameid',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/gamedetails.html',
                        controller: 'GameDetailsController'
                    }
                }
            })



            .state('app.teammanagement', {
                url: '/teammanagement',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/teammanagement.html',
                        controller: 'TeamController'
                    }
                }
            })


            .state('app.teamadd', {
                url: '/teamadd',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/teamadd.html',
                        controller: 'TeamAddController'

                    }
                }
            })

            .state('app.teamadd1', {
                url: '/teamadd1',
                params: {
                    team1: null,
                    myprofile: null
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/teamadd1.html',
                        controller: 'TeamAdd1Controller'

                    }
                }
            })

            .state('app.teamadd2', {
                url: '/teamadd2',
                params: {
                    team2: null,
                    myprofile: null
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/teamadd2.html',
                        controller: 'TeamAdd2Controller'

                    }
                }
            })


            .state('app.teamprofile', {
                url: '/teamprofile/:teamid',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/teamprofile.html',
                        controller: 'TeamProfileController'
                    }
                }
            })

            .state('app.teamview', {
                url: '/teamview/:teamid',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/teamview.html',
                        controller: 'TeamViewController'
                    }
                }
            })

            .state('app.choosestadium', {
                url: '/choosestadium',
                params: {
                    myteam: null
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/choosestadium.html',
                        controller: 'ChooseStadiumController'
                    }
                }
            })

            .state('app.bookings', {
                url: '/bookings',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/bookings.html',
                        controller: 'BookingController'

                    }
                }
            })


            .state('app.matchmakinghome', {
                url: '/matchmakinghome',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/matchmakinghome.html',
                    }
                }
            })

            .state('app.selfprofile', {
                url: '/selfprofile',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/selfprofile.html',
                        controller: 'profilecontroller'
                    }
                }
            })

            .state('app.profileview', {
                url: '/profileview/:key',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profileview.html',
                        controller: 'ProfileViewController'
                    }
                }
            })

            .state('app.selfprofileedit', {
                url: '/selfprofileedit',
                params: {
                    myprofile: null
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/selfprofileedit.html',
                        controller: 'ProfileEditController'
                    }
                }
            })

            .state('app.facebooklogin', {
                url: '/facebooklogin',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/facebooklogin.html',
                    }
                }
            })
            .state('app.login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/login.html',
                    }
                }
            })



            .state('app.settings', {
                url: '/settings',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/settings.html',
                        controller: 'SettingsController'

                    }
                }
            })

            .state('app.leaderboard', {
                url: '/leaderboard',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/leaderboard.html',
                        controller: 'LeaderboardController'

                    }
                }
            })


            .state('app.settingssms', {
                url: '/settingssms',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/settingssms.html',
                        controller: 'SettingsSmsController'

                    }
                }
            })


            .state('app.challengeteam', {
                url: '/challengeteam',
                params: {
                    myteam: null,
                    otherteam: null,
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/challengeteam.html',
                        controller: 'ChallengeController'

                    }
                }
            })

            .state('app.challengeteamstadium', {
                url: '/challengeteamstadium',
                params: {
                    date: null,
                    teams: null,
                    myteam: null
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/challengeteamstadium.html',
                        controller: 'challengestadiumcontroller'

                    }
                }
            })

            .state('app.choosechallengestadium', {
                url: '/choosechallengestadium',
                params: {
                    challenge: null
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/choosechallengestadium.html',
                        controller: 'ChallengeStadiumController'

                    }
                }
            })

            .state('app.teamprofileedit', {
                url: '/teamprofileedit',
                params: {
                    myteam: null
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/teamprofileedit.html',
                        controller: 'TeamEditController'

                    }
                }
            })

            .state('app.inviteteamplayers', {
                url: '/inviteteamplayers',
                params: {
                    myteam: null
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/inviteteamplayers.html',
                        controller: 'InvitePlayersController'

                    }
                }
            })


            ;
        // if none of the above states are matched, use this as the fallback

        //$urlRouterProvider.otherwise('/app/addministadium');
        //$urlRouterProvider.otherwise('/app/adminbalances');


        // $urlRouterProvider.otherwise('/app/challengeteam');


        //$urlRouterProvider.otherwise('/loginpage');
        $urlRouterProvider.otherwise('/firstpage');

        //$urlRouterProvider.otherwise('/app/search');
        //$urlRouterProvider.otherwise('/app/adminbookings');

        //$urlRouterProvider.otherwise('/app/reservestadium');
        //$urlRouterProvider.otherwise('/app/selfprofile');
        // $urlRouterProvider.otherwise('/app/teammanagement');
        //$urlRouterProvider.otherwise('/app/bookings');
        //$urlRouterProvider.otherwise('/app/homepage');



    });
