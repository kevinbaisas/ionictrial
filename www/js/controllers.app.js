angular.module('projectmanager.controllers')

.controller('App', function($scope, $state, $ionicHistory, $ionicSideMenuDelegate, NavigationHandler, ProfileService, ConnectionsService, MessagesService, ProjectsService){

    //prevent back
    $ionicHistory.clearHistory();

    //notification badges
    $scope.navConnectionBadge = "";
    $scope.navMessagesBadge = "";
    $scope.navProjectsBadge = "";

    //data
    $scope.connections = ConnectionsService.setConnections();
    $scope.requests = ConnectionsService.setRequests();

    //nav items
    $scope.activeNavItems = [
        "Projects",
        "Messages",
        "Connections",
        "Account Settings",
        "Help",
        "Terms of Service",
        "Privacy Policy",
        "About",
    ];

    $scope.data = null;
    $scope.pictures = null;

    $scope.uid = null;

    $scope.currentNavItem = "";
    $scope.currentNavPosition = 0;

    $scope.init = function(){
        //load messages
        MessagesService.setMessages();

        //load projects
        ProjectsService.setProjects();

        //uid
        $scope.uid = ProfileService.getAuth().uid;

        //bind profile info for nav
        ProfileService.getUserRef().$bindTo($scope, 'data');

        //bind pictures for nav
        ProfileService.getUserPicturesRef().$bindTo($scope, 'pictures');

        $scope.setActiveNav(NavigationHandler.getCurrentPosition());

        //on app open change user status to online
        var userLastOnlineRef = firebaseRef.child('user_accounts').child($scope.uid).child('isOnline');
        userLastOnlineRef.set(true);

        //change to offline on app close/logout
        userLastOnlineRef.onDisconnect().set(false);

        //connections notifications
        $scope.connections.$loaded(function(){
            if($scope.connections.length < 1){ $scope.connectionListSpinner = false; }
            $scope.countConnectionNotifications();

            $scope.connections.$watch(function(event){
                $scope.countConnectionNotifications();
            });
        });

        $scope.requests.$loaded(function(){
            if($scope.requests.length < 1){ $scope.requestListSpinner = false; }
            $scope.countConnectionNotifications();

            $scope.requests.$watch(function(event){
                $scope.countConnectionNotifications();
            });
        });
    };

    $scope.$on('countMessagesNotifications', function(){

        var messagesNotifications = 0;
        var messages = MessagesService.getMessages();

        if(messages.length > 0){
            messages.forEach(function(conversation){
                messagesNotifications += conversation.notifications;
            });
        }

        if(messagesNotifications > 0){
            $scope.navMessagesBadge = parseInt(messagesNotifications);
            if(messagesNotifications > 99){
                $scope.navMessagesBadge = "99+";
            }
        }else{
            $scope.navMessagesBadge = "";
        }
    });

    $scope.$on('renderProjects', function(){

        var projectsNotifications = 0;
        var projects = ProjectsService.getProjects();

        if(projects.length > 0){
            projects.forEach(function(project){
               if(typeof project.details != 'undefined'){
                   if(typeof project.details.seen == 'undefined' || (typeof project.details.seen != 'undefined' && typeof project.details.seen[$scope.uid] == 'undefined')){
                       projectsNotifications++;
                   }
               }
            });
        }

        if(projectsNotifications > 0){
            $scope.navProjectsBadge = parseInt(projectsNotifications);
            if(projectsNotifications > 99){
                $scope.navMessagesBadge = "99+";
            }
        }else{
            $scope.navMessagesBadge = "";
        }
    });

    $scope.inConnection = function(uid){
        var checker = false;
        $scope.connections.forEach(function(connection){
            if(connection.$id == uid) { checker = true; }
        });

        return checker;
    };

    $scope.isSender = function(uid){
        var checker = false;
        if($scope.uid == uid) { checker = true; }

        return checker;
    };

    $scope.countConnectionNotifications = function(){

        var connectionNotifications = 0;
        if($scope.connections.length > 0){
            $scope.connections.forEach(function(request){
                if(request.$value == false) {
                    connectionNotifications++;
                }
            });
        }

        if($scope.requests.length > 0){
            $scope.requests.forEach(function(request){
                if(request.$value == false) {
                    connectionNotifications++;
                }
            });
        }

        if(connectionNotifications > 0){
            $scope.navConnectionBadge = parseInt(connectionNotifications);
            if(connectionNotifications > 99){
                $scope.navConnectionBadge = "99+";
            }
        }else{
            $scope.navConnectionBadge = "";
        }
    };

    $scope.setActiveNav = function(position){
        $scope.currentNavItem = $scope.activeNavItems[position];
        $scope.currentNavPosition = position;
        $ionicSideMenuDelegate.toggleLeft(false);
    };

    //nav toggle
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.logOut = function(){
        ProfileService.getFirebaseAuth().$unauth();
    };
});