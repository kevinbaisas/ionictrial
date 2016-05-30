var firebaseRef = new Firebase("https://dazzling-torch-2725.firebaseio.com/");

angular.module('projectmanager', ['ionic', 'monospaced.elastic', 'tabSlideBox', 'ionic-datepicker','firebase', 'angularMoment', 'ngCordova', 'projectmanager.controllers', 'projectmanager.services', 'projectmanager.filters', 'projectmanager.directives'])

.config(function($stateProvider, $urlRouterProvider){

  $stateProvider
    //pages
      .state('app', {
        url:'/app/:uid',
        templateUrl:'templates/app.html',
        cached: false,
        controller:'App'
      })
      .state('app.projects', {
        url: "/projects",
        parent: "app",
        cached: false,
        views: {
          'main_app': {
            templateUrl: "templates/projects.html"
          }
        }
      })
      .state('app.messages', {
        url: "/messages",
        parent: "app",
        cached: false,
        views: {
          'main_app': {
            templateUrl: "templates/messages.html"
          }
        }
      })
      .state('app.connections', {
        url: "/connections",
        parent: "app",
        cached: false,
        views: {
          'main_app': {
            templateUrl: "templates/connections.html"
          }
        }
      })
      .state('app.account-settings', {
        url: "/account-settings",
        parent: "app",
        cached: false,
        views: {
          'main_app': {
            templateUrl: "templates/account-settings.html"
          }
        }
      })
      .state('app.about', {
        url: "/about",
        parent: "app",
        cached: false,
        views: {
          'main_app': {
            templateUrl: "templates/about.html"
          }
        }
      })
      .state('app.terms', {
        url: "/terms",
        parent: "app",
        cached: false,
        views: {
          'main_app': {
            templateUrl: "templates/terms.html"
          }
        }
      })
      .state('app.privacy', {
        url: "/privacy",
        parent: "app",
        cached: false,
        views: {
          'main_app': {
            templateUrl: "templates/privacy.html"
          }
        }
      })
      .state('app.help', {
        url: "/help",
        parent: "app",
        cached: false,
        views: {
          'main_app': {
            templateUrl: "templates/help.html"
          }
        }
      })
      .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        cached: false
      })
      .state('register', {
        url: "/register",
        templateUrl: "templates/register.html",
        cached: false
      })
      .state('register.account', {
        url: "/account",
        parent: "register",
        cached: false,
        views: {
          'main_register': {
            templateUrl: "templates/register-account.html"
          }
        }
      })
      .state('register.personal', {
        url: "/personal",
        parent: "register",
        cached: false,
        views: {
          'main_register': {
            templateUrl: "templates/register-personal.html"
          }
        }
      })
      .state('register.company', {
        url: "/company",
        parent: "register",
        cached: false,
        views: {
          'main_register': {
            templateUrl: "templates/register-company.html"
          }
        }
      })

  $urlRouterProvider
      .otherwise('/login');
})

.run(function($ionicPlatform, $location, ProfileService) {

    $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }

      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.overlaysWebView(true);
        StatusBar.backgroundColorByHexString("#388E3C");
      }
    });

    function authDataCallback(authData) {
      if (authData) {
        ProfileService.refreshAuthData(authData);
        $location.path('/app/'+authData.uid+'/projects');
      } else {
        $location.path('/login');
      }
    }

      //this will check if the user is logged in (no need to use/check local storage)
    firebaseRef.onAuth(authDataCallback);
})
;
