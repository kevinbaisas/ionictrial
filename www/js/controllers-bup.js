angular.module('projectmanager.controllers', [])
    //
    //.controller('App', function($scope, $state, $ionicHistory, $ionicSideMenuDelegate, NavigationHandler, ProfileService, ConnectionsService, MessagesService){
    //
    //    //prevent back
    //    $ionicHistory.clearHistory();
    //
    //    $scope.navConnectionBadge = "";
    //    $scope.navMessagesBadge = "";
    //
    //    $scope.connections = ConnectionsService.setConnections();
    //    $scope.requests = ConnectionsService.setRequests();
    //
    //    $scope.activeNavItems = [
    //        "Projects",
    //        "Messages",
    //        "Discussions",
    //        "Connections",
    //        "Account Settings",
    //        "About",
    //        "Report"
    //    ];
    //
    //    $scope.data = null;
    //    $scope.pictures = null;
    //
    //    $scope.uid = null;
    //
    //    $scope.currentNavItem = "";
    //    $scope.currentNavPosition = 0;
    //
    //    $scope.init = function(){
    //        MessagesService.setMessages();
    //        $scope.uid = ProfileService.getAuth().uid;
    //        ProfileService.getUserRef().$bindTo($scope, 'data');
    //        ProfileService.getUserPicturesRef().$bindTo($scope, 'pictures');
    //        $scope.setActiveNav(NavigationHandler.getCurrentPosition());
    //
    //        var userLastOnlineRef = firebaseRef.child('user_accounts').child($scope.uid).child('isOnline');
    //        userLastOnlineRef.set(true);
    //        userLastOnlineRef.onDisconnect().set(false);
    //
    //        $scope.connections.$loaded(function(){
    //            if($scope.connections.length < 1){ $scope.connectionListSpinner = false; }
    //            $scope.countConnectionNotifications();
    //
    //            $scope.connections.$watch(function(event){
    //                $scope.countConnectionNotifications();
    //            });
    //        });
    //
    //        $scope.requests.$loaded(function(){
    //            if($scope.requests.length < 1){ $scope.requestListSpinner = false; }
    //            $scope.countConnectionNotifications();
    //
    //            $scope.requests.$watch(function(event){
    //                $scope.countConnectionNotifications();
    //            });
    //        });
    //    };
    //
    //    $scope.$on('countMessagesNotifications', function(){
    //
    //        var messagesNotifications = 0;
    //        var messages = MessagesService.getMessages();
    //
    //        if(messages.length > 0){
    //            messages.forEach(function(conversation){
    //                messagesNotifications += conversation.notifications;
    //            });
    //        }
    //
    //        if(messagesNotifications > 0){
    //            $scope.navMessagesBadge = parseInt($scope.navConnectionBadge);
    //            if(messagesNotifications > 99){
    //                $scope.navMessagesBadge = "99+";
    //            }else{
    //                $scope.navMessagesBadge = messagesNotifications;
    //            }
    //        }else{
    //            $scope.navMessagesBadge = "";
    //        }
    //    });
    //
    //    $scope.inConnection = function(uid){
    //        var checker = false;
    //        $scope.connections.forEach(function(connection){
    //            if(connection.$id == uid) { checker = true; }
    //        });
    //
    //        return checker;
    //    };
    //
    //    $scope.isSender = function(uid){
    //        var checker = false;
    //        if($scope.uid == uid) { checker = true; }
    //
    //        return checker;
    //    };
    //
    //    $scope.countConnectionNotifications = function(){
    //
    //        var connectionNotifications = 0;
    //        if($scope.connections.length > 0){
    //            $scope.connections.forEach(function(request){
    //                if(request.$value == false) {
    //                    connectionNotifications++;
    //                }
    //            });
    //        }
    //
    //        if($scope.requests.length > 0){
    //            $scope.requests.forEach(function(request){
    //                if(request.$value == false) {
    //                    connectionNotifications++;
    //                }
    //            });
    //        }
    //
    //        if(connectionNotifications > 0){
    //            $scope.navConnectionBadge = parseInt($scope.navConnectionBadge);
    //            if(connectionNotifications > 99){
    //                $scope.navConnectionBadge = "99+";
    //            }else{
    //                $scope.navConnectionBadge = connectionNotifications;
    //            }
    //        }else{
    //            $scope.navConnectionBadge = "";
    //        }
    //    };
    //
    //    $scope.setActiveNav = function(position){
    //        $scope.currentNavItem = $scope.activeNavItems[position];
    //        $scope.currentNavPosition = position;
    //        $ionicSideMenuDelegate.toggleLeft(false);
    //    };
    //
    //    $scope.toggleLeft = function() {
    //        $ionicSideMenuDelegate.toggleLeft();
    //    };
    //
    //    $scope.logOut = function(){
    //        ProfileService.getFirebaseAuth().$unauth();
    //    };
    //})
    //
    //.controller('Projects', function($scope, $window, $timeout, $ionicModal, $ionicPopup, ProfileService, ProjectsService, $firebaseArray, $firebaseObject){
    //
    //    $scope.projectsListSpinner = true;
    //    $scope.membersListSpinner = true;
    //    $scope.projects = [];
    //    $scope.pSearch = {
    //        keyword : ""
    //    };
    //
    //    $scope.mSearch = {
    //        keyword : ""
    //    };
    //
    //    $scope.projectDetails = {
    //        projectName : "",
    //        allottedHours : "",
    //        startDate : new Date(),
    //        endDate : new Date(),
    //        colorLabel : '#4CAF50'
    //    };
    //
    //    $scope.projectNameChecker = false;
    //    $scope.allottedHoursChecker = false;
    //    $scope.endDateChecker = false;
    //
    //    $scope.projectInfo = {};
    //    $scope.userProfile = {};
    //    $scope.tabIndex = 0;
    //
    //    $scope.colorPickerList = [
    //        {value : "#F44336"}, {value : "#E91E63"}, {value : "#9C27B0"}, {value : "#673AB7"}, {value : "#3F51B5"},
    //        {value : "#2196F3"}, {value : "#03A9F4"}, {value : "#00BCD4"}, {value : "#009688"}, {value : "#4CAF50"},
    //        {value : "#8BC34A"}, {value : "#CDDC39"}, {value : "#FFEB3B"}, {value : "#FFC107"}, {value : "#FF9800"},
    //        {value : "#FF5722"}, {value : "#795548"}, {value : "#9E9E9E"}, {value : "#607D8B"}
    //    ];
    //
    //
    //    $scope.deviceHeight = $window.innerHeight - 132;
    //
    //    $scope.clientUid =  ProfileService.getAuth().uid;
    //
    //    $scope.$watch(function(){
    //        return $window.innerHeight;
    //    }, function(value) {
    //        $scope.deviceHeight = $window.innerHeight - 132;
    //    });
    //
    //    $scope.$on('renderProjects', function(){
    //        $scope.projects = ProjectsService.getProjects();
    //        $scope.projectsListSpinner = false;
    //    });
    //
    //    $scope.$on('renderMembers', function(){
    //        $scope.membersListSpinner = false;
    //    });
    //
    //    $scope.$on('tabslideboxChanged', function(event, args){
    //        $scope.tabIndex = args.index;
    //    });
    //
    //    $scope.editProject = function(){
    //        $scope.openModal(3);
    //
    //
    //        $scope.projectDetails = {
    //            id : $scope.projectInfo.details.id,
    //            projectName : $scope.projectInfo.details.projectName,
    //            allottedHours : $scope.projectInfo.details.allottedHours,
    //            startDate : new Date($scope.projectInfo.details.startDate),
    //            endDate : new Date($scope.projectInfo.details.endDate),
    //            colorLabel : $scope.projectInfo.details.colorLabel,
    //            isFinished : $scope.projectInfo.details.isFinished
    //        };
    //    };
    //
    //    $scope.saveProject = function(){
    //
    //        var error = 0;
    //        var allottedHours = parseInt($scope.projectDetails.allottedHours);
    //        var startDate = $scope.projectDetails.startDate.getTime();
    //        var endDate = $scope.projectDetails.endDate.getTime();
    //
    //        if($scope.projectDetails.projectName == ""){
    //            $scope.projectNameChecker = true;
    //            error++;
    //        }else{
    //            $scope.projectNameChecker = false;
    //        }
    //
    //        if(allottedHours < 1 || isNaN(allottedHours)){
    //            $scope.allottedHoursChecker = true;
    //            error++;
    //        }else{
    //            $scope.allottedHoursChecker = false;
    //        }
    //
    //        if(endDate <= startDate){
    //            $scope.endDateChecker = true;
    //            error++;
    //        }else{
    //            $scope.endDateChecker = false;
    //        }
    //
    //        if(error == 0){
    //            firebaseRef.child('projects').child($scope.projectInfo.$id).update({
    //                projectName : $scope.projectDetails.projectName,
    //                allottedHours : allottedHours,
    //                remainingHours : allottedHours,
    //                startDate : startDate,
    //                endDate : endDate,
    //                colorLabel : $scope.projectDetails.colorLabel,
    //                isFinished : $scope.projectDetails.isFinished,
    //                dateModified : new Date().getTime()
    //            }, function(data){
    //
    //                var name = $scope.projectInfo.owner.firstName + " " + $scope.projectInfo.owner.lastName;
    //
    //                $scope.notifyProject($scope.projectInfo.$id, name + " edited the project details.");
    //
    //                $scope.resetCheckers();
    //                $scope.resetProjectDetails();
    //                $scope.closeModal(3);
    //            });
    //        }
    //    };
    //
    //    $scope.initializeProjects = function(){
    //        ProjectsService.setProjects();
    //    };
    //
    //    $scope.createNewProject = function(){
    //        $scope.openModal(1);
    //    };
    //
    //    $scope.openProject = function(project){
    //        $scope.openModal(2);
    //        $scope.projectInfo = project;
    //    };
    //
    //    $scope.openProfile = function(uid){
    //        $scope.openModal(4);
    //        ProfileService.setOtherProfileRef(uid)
    //    };
    //
    //    $scope.projectSearch = function (row) {
    //        if(row.hasOwnProperty('details') && typeof row.details.projectName != 'undefined'){
    //            return (angular.lowercase(row.details.projectName).indexOf($scope.pSearch.keyword || '') !== -1);
    //        }
    //    };
    //
    //    $scope.membersSearch = function (row) {
    //        if(row.hasOwnProperty('details') && typeof row.details.firstName != 'undefined' && $scope.clientUid != row.details.$id){
    //            return (
    //            angular.lowercase(row.details.firstName).indexOf($scope.mSearch.keyword  || '') !== -1 ||
    //            angular.lowercase(row.details.lastName).indexOf($scope.mSearch.keyword  || '') !== -1
    //            );
    //        }
    //    };
    //
    //    $scope.getFirstLetter = function(name){
    //        if(typeof name != 'undefined'){ return name.charAt(0).toUpperCase(); }
    //    };
    //
    //    $scope.getProjectName = function(name){
    //        return ucwords(name);
    //    };
    //
    //    $ionicModal.fromTemplateUrl('templates/modal-project.html', {
    //        id: '1',
    //        scope: $scope,
    //        animation: 'slide-in-up',
    //        backdropClickToClose: false,
    //        hardwareBackButtonClose: false
    //    }).then(function(modal) {
    //        $scope.createModal = modal;
    //    });
    //
    //    $ionicModal.fromTemplateUrl('templates/modal-project-details.html', {
    //        id: '2',
    //        scope: $scope,
    //        animation: 'slide-in-up',
    //        backdropClickToClose: false,
    //        hardwareBackButtonClose: false
    //    }).then(function(modal) {
    //        $scope.projectModal = modal;
    //    });
    //
    //    $ionicModal.fromTemplateUrl('templates/modal-project-details.html', {
    //        id: '2',
    //        scope: $scope,
    //        animation: 'slide-in-up',
    //        backdropClickToClose: false,
    //        hardwareBackButtonClose: false
    //    }).then(function(modal) {
    //        $scope.projectModal = modal;
    //    });
    //
    //    $ionicModal.fromTemplateUrl('templates/modal-edit-project.html', {
    //        id: '3',
    //        scope: $scope,
    //        animation: 'slide-in-up',
    //        backdropClickToClose: false,
    //        hardwareBackButtonClose: false
    //    }).then(function(modal) {
    //        $scope.editModal = modal;
    //    });
    //
    //    $ionicModal.fromTemplateUrl('templates/profile-modal.html', {
    //        id: '4',
    //        scope: $scope,
    //        animation: 'slide-in-up',
    //        backdropClickToClose: false,
    //        hardwareBackButtonClose: false
    //    }).then(function(modal) {
    //        $scope.profileModal = modal;
    //    });
    //
    //    $scope.openModal = function(index) {
    //        if(index == 1) { $scope.createModal.show() }
    //        else if(index == 2) { $scope.projectModal.show() }
    //        else if(index == 3) { $scope.editModal.show() }
    //        else { $scope.profileModal.show() }
    //    };
    //
    //    $scope.closeModal = function(index) {
    //        if(index == 1) { $scope.createModal.hide() }
    //        else if(index == 2) {
    //            $scope.projectModal.hide();
    //            $scope.projectInfo = {};
    //        } else if(index == 3) {
    //            $scope.editModal.hide();
    //            $scope.resetCheckers();
    //            $scope.resetProjectDetails();
    //        } else { $scope.profileModal.hide(); }
    //    };
    //
    //    $scope.$on('$destroy', function() {
    //        $scope.createModal.remove();
    //        $scope.projectModal.remove();
    //        $scope.editModal.remove();
    //        $scope.profileModal.remove();
    //    });
    //
    //    $scope.openColorPicker = function(){
    //
    //        var colorPickerPopup = $ionicPopup.show({
    //            templateUrl: 'templates/project-color-picker-popup.html',
    //            title: 'Pick a color',
    //            scope: $scope,
    //            buttons: [
    //                { text: 'Cancel' },
    //                {
    //                    text: 'OK',
    //                    type: 'button-positive',
    //                    onTap: function(e) {
    //                    }
    //                }
    //            ]
    //        });
    //        colorPickerPopup.then(function(res){
    //        });
    //    };
    //
    //    $scope.createProject = function(uid, name){
    //
    //        var error = 0;
    //        var allottedHours = parseInt($scope.projectDetails.allottedHours);
    //        var startDate = $scope.projectDetails.startDate.getTime();
    //        var endDate = $scope.projectDetails.endDate.getTime();
    //
    //        if($scope.projectDetails.projectName == ""){
    //            $scope.projectNameChecker = true;
    //            error++;
    //        }else{
    //            $scope.projectNameChecker = false;
    //        }
    //
    //        if(allottedHours < 1 || isNaN(allottedHours)){
    //            $scope.allottedHoursChecker = true;
    //            error++;
    //        }else{
    //            $scope.allottedHoursChecker = false;
    //        }
    //
    //        if(endDate <= startDate){
    //            $scope.endDateChecker = true;
    //            error++;
    //        }else{
    //            $scope.endDateChecker = false;
    //        }
    //
    //        if(error == 0){
    //            var projectRef = $firebaseArray(firebaseRef.child('projects'));
    //
    //            projectRef.$add({
    //                projectName : $scope.projectDetails.projectName,
    //                allottedHours : allottedHours,
    //                remainingHours : allottedHours,
    //                startDate : startDate,
    //                endDate : endDate,
    //                colorLabel : $scope.projectDetails.colorLabel,
    //                dateCreated : new Date().getTime(),
    //                dateModified : new Date().getTime(),
    //                owner : uid,
    //                isFinished : false
    //            }).then(function(data){
    //
    //                var projectMembersRef = $firebaseObject(firebaseRef.child('project_members').child(data.key()).child(uid));
    //                projectMembersRef.$value = true;
    //
    //                projectMembersRef.$save();
    //
    //                var userProjects = $firebaseObject(firebaseRef.child('user_accounts').child(uid).child('projects').child(data.key()));
    //                userProjects.$value = true;
    //
    //                userProjects.$save();
    //
    //                $scope.notifyProject(data.key(), name + " created the project.");
    //
    //                $scope.resetCheckers();
    //                $scope.resetProjectDetails();
    //                $scope.closeModal(1);
    //            }, function(err){
    //                console.log(err);
    //            });
    //        }
    //    };
    //
    //    $scope.removeMember = function(details){
    //
    //        var removeMemberPopup = $ionicPopup.confirm({
    //            template: "Are you sure you want to remove " + details.firstName + " in this project?",
    //            title: 'Remove Member'
    //        });
    //
    //        removeMemberPopup.then(function(res){
    //            if(res){
    //                var projectId = $scope.projectInfo.$id;
    //                var userProjectsRef = $firebaseArray(firebaseRef.child('user_accounts').child(details.$id).child('projects'));
    //                var projectMembersRef = $firebaseArray(firebaseRef.child('project_members').child(projectId));
    //
    //                userProjectsRef.$loaded(function(){
    //                    var projectRecord = userProjectsRef.$getRecord(projectId);
    //                    userProjectsRef.$remove(projectRecord);
    //                });
    //
    //                projectMembersRef.$loaded(function(){
    //                    var projectRecord = projectMembersRef.$getRecord(details.$id);
    //                    projectMembersRef.$remove(projectRecord);
    //                });
    //
    //                var logNote = $scope.projectInfo.owner.firstName + " " + $scope.projectInfo.owner.lastName +
    //                    " removed " + details.firstName + " " + details.lastName + " from the project.";
    //                $scope.notifyProject(projectId, logNote);
    //            }
    //        })
    //    };
    //
    //    $scope.openAddMember = function(){
    //
    //        $scope.member = {};
    //
    //        var addMemberPopup = $ionicPopup.show({
    //            templateUrl: "templates/add-member-popup.html",
    //            title: 'Add Member',
    //            subTitle: 'Add a member by entering email address',
    //            scope: $scope,
    //            buttons: [
    //                { text: 'Cancel' },
    //                {
    //                    text: 'OK',
    //                    type: 'button-positive',
    //                    onTap: function(e) {
    //                        if (!$scope.member.email) {
    //                            e.preventDefault();
    //                        } else {
    //                            addMemberPopup.close();
    //                            $timeout(function(){
    //                                $scope.addMember($scope.member.email);
    //                            }, 300);
    //                        }
    //                    }
    //                }
    //            ]
    //        });
    //    };
    //
    //    $scope.addMember = function(email){
    //
    //        if(email != "" || typeof email != 'undefined'){
    //            firebaseRef.child('user_accounts').orderByChild("email")
    //            .startAt(email).endAt(email).once("value", function(snapshot){
    //                if(snapshot.val() == null){
    //                    $scope.userNotExists();
    //                }else{
    //                    snapshot.forEach(function(data){
    //                        var projectId = $scope.projectInfo.$id;
    //                        var userProjectRef = $firebaseObject(firebaseRef.child('user_accounts').child(data.key()).child('projects').child(projectId));
    //
    //                        userProjectRef.$loaded(function(){
    //                            if(userProjectRef.$value == null){
    //                                var userDetails = data.val();
    //                                userProjectRef.$value = true;
    //
    //                                var projectMemberRef = $firebaseObject(firebaseRef.child('project_members').child(projectId).child(data.key()));
    //                                projectMemberRef.$value = true;
    //
    //                                var logNote = $scope.projectInfo.owner.firstName + " " + $scope.projectInfo.owner.lastName +
    //                                    " added " + userDetails.firstName + " " + userDetails.lastName + " in the project.";
    //
    //                                $scope.notifyProject(projectId, logNote);
    //
    //                                userProjectRef.$save();
    //                                projectMemberRef.$save();
    //                            }else{
    //                                $scope.userAlreadyMember();
    //                            }
    //                        });
    //                    });
    //                }
    //            });
    //        }
    //    };
    //
    //    $scope.notifyProject = function(projectId, logNote){
    //
    //        var projectMembersRef = $firebaseArray(firebaseRef.child('project_members').child(projectId));
    //
    //        projectMembersRef.$loaded(function(){
    //            projectMembersRef.forEach(function(data){
    //                if(data.$id != $scope.clientUid){
    //                    data.$value = false;
    //                    projectMembersRef.$save(data).then(function(ref){
    //                    }, function(err){ console.log(err); });
    //                }
    //            });
    //        });
    //
    //        var projectRef = firebaseRef.child('projects').child(projectId);
    //        projectRef.update({
    //            dateModified : new Date().getTime()
    //        });
    //
    //        var log = {
    //            by : $scope.clientUid,
    //            value : logNote,
    //            date : new Date().getTime()
    //        }
    //
    //        var projectLogsRef = $firebaseArray(firebaseRef.child('project_logs').child(projectId));
    //        projectLogsRef.$add(log);
    //    };
    //
    //    $scope.userNotExists = function(){
    //        var notExistsPopup = $ionicPopup.alert({
    //            title: "Error",
    //            templateUrl: "templates/user-not-exists-popup.html"
    //        });
    //        notExistsPopup.then(function(res) { });
    //    };
    //
    //    $scope.userAlreadyMember = function(){
    //        var notExistsPopup = $ionicPopup.alert({
    //            title: "Error",
    //            templateUrl: "templates/already-member-popup.html"
    //        });
    //        notExistsPopup.then(function(res) { });
    //    };
    //
    //    $scope.resetCheckers = function(){
    //        $scope.projectNameChecker = false;
    //        $scope.allottedHoursChecker = false;
    //        $scope.endDateChecker = false;
    //    };
    //
    //    $scope.resetProjectDetails = function(){
    //        $scope.projectDetails = {
    //            projectName : "",
    //            allottedHours : "",
    //            startDate : new Date(),
    //            endDate : new Date(),
    //            colorLabel : '#4CAF50'
    //        };
    //    };
    //})
    //
    //.controller('Messages', function($scope, $ionicModal, $interval, $ionicScrollDelegate, ProfileService, MessagesService){
    //
    //    $scope.messagesListSpinner = true;
    //    $scope.uid = null;
    //    $scope.messages = {};
    //    $scope.messageKey = "";
    //
    //    $scope.scrollMessages = function() {
    //        $ionicScrollDelegate.$getByHandle('messagesScroll').scrollBottom();
    //    };
    //
    //    $scope.initializeMessages = function(){
    //        MessagesService.setMessages();
    //    };
    //
    //    $scope.$on('countMessagesNotifications', function(){
    //        $scope.$evalAsync(function(){
    //            $scope.scrollMessages();
    //            $scope.uid = ProfileService.getAuth().uid;
    //            $scope.messages = MessagesService.getMessages();
    //            $scope.messagesListSpinner = false;
    //        });
    //    });
    //
    //    $scope.getMessages = function(){
    //        MessagesService.setMessages();
    //    };
    //
    //    $scope.openMessagesModal = function(key){
    //        $scope.messageKey = key;
    //        $scope.scrollMessages();
    //        $scope.openModal();
    //    };
    //
    //    $interval(function(){
    //        if($scope.messageKey !== ""){
    //            $scope.messages[$scope.messageKey].messages.forEach(function(message, index){
    //                if(message.seen == false && message.sender != $scope.uid){
    //                    message.seen = true;
    //                    $scope.messages[$scope.messageKey].messages.$save(message);
    //                }
    //            });
    //        }
    //    }, 2000);
    //
    //    $ionicModal.fromTemplateUrl('templates/modal-message.html', {
    //        scope: $scope,
    //        animation: 'slide-in-up'
    //    }).then(function(modal) {
    //        $scope.modal = modal;
    //    });
    //    $scope.openModal = function() {
    //        $scope.modal.show();
    //    };
    //    $scope.closeModal = function() {
    //        $scope.messageKey = "";
    //        $scope.modal.hide();
    //    };
    //
    //    $scope.$on('$destroy', function() {
    //        $scope.modal.remove();
    //    });
    //
    //    $scope.isLastSender = function(key){
    //
    //        var checker = false;
    //
    //        if(key > 0){
    //            var messageDate = $scope.messages[$scope.messageKey].messages[key].date;
    //            var prevMessageDateEnd = moment($scope.messages[$scope.messageKey].messages[key-1].date).endOf('day').format("x");
    //
    //            var messageSender = $scope.messages[$scope.messageKey].messages[key].sender;
    //            var prevMessageSender = $scope.messages[$scope.messageKey].messages[key-1].sender;
    //
    //            if((messageSender != prevMessageSender) || (messageDate > prevMessageDateEnd)){
    //                checker = true;
    //            }
    //        }else{
    //            checker = true;
    //        }
    //
    //        return checker;
    //    };
    //
    //    $scope.showDate = function(key){
    //
    //        var checker = true;
    //        if(key > 0){
    //            var prevMessageDateStart = moment($scope.messages[$scope.messageKey].messages[key-1].date).startOf('day').format("x");
    //            var prevMessageDateEnd = moment($scope.messages[$scope.messageKey].messages[key-1].date).endOf('day').format("x");
    //
    //            var messageDate = moment($scope.messages[$scope.messageKey].messages[key].date).format("x");
    //
    //            if(messageDate >= prevMessageDateStart && messageDate <= prevMessageDateEnd){
    //                checker = false;
    //            }
    //        }else{
    //            checker = true;
    //        }
    //
    //        return checker;
    //    };
    //
    //    $scope.displayDate = function(key){
    //
    //        var date = "";
    //        var messageTimeStamp = $scope.messages[$scope.messageKey].messages[key].date;
    //        var todayMessageDateStart = moment().startOf('day').format("x");
    //        var todayMessageDateEnd = moment().endOf('day').format("x");
    //
    //        var yesterdayMessageDateStart = moment().subtract(1, 'days').startOf('day').format("x");
    //        var yesterdayMessageDateEnd = moment().subtract(1, 'days').endOf('day').format("x");
    //
    //        var weekMessageDateStart = moment().startOf('week').format("x");
    //        var weekMessageDateEnd = moment().endOf('week').format("x");
    //
    //        var thisYearMessageDateStart = moment().startOf('year').format("x");
    //        var thisYearMessageDateEnd = moment().endOf('year').format("x");
    //
    //        if(messageTimeStamp >= todayMessageDateStart && messageTimeStamp <= todayMessageDateEnd){
    //            date = "Today";
    //        }else if(messageTimeStamp >= yesterdayMessageDateStart && messageTimeStamp <= yesterdayMessageDateEnd) {
    //            date = "Yesterday";
    //        }else if(messageTimeStamp >= weekMessageDateStart && messageTimeStamp <= weekMessageDateEnd){
    //            date = "Last " + moment(messageTimeStamp).format("dddd");
    //        }else if(messageTimeStamp >= thisYearMessageDateStart && messageTimeStamp <= thisYearMessageDateEnd) {
    //            date = moment(messageTimeStamp).format("MMM Do");
    //        }else{
    //            date = moment(messageTimeStamp).format("MM/DD/YYYY");
    //        }
    //
    //        return date;
    //    };
    //})
    //
    //.controller('Conversation', function($scope){
    //
    //    $scope.messageText = "";
    //
    //    $scope.sendMessage = function(reference, uid){
    //        if($scope.messageText.trim() != ""){
    //
    //            reference.$add({
    //                sender : uid,
    //                date : new Date().getTime(),
    //                message : $scope.messageText.trim(),
    //                seen : false
    //            });
    //
    //            $scope.messageText = "";
    //        }
    //    };
    //})
    //
    //.controller('Connections', function($scope, $ionicTabsDelegate, $timeout, $interval, $window, $ionicModal, $firebaseArray, $firebaseObject, $ionicPopup, ProfileService, ConnectionsService){
    //
    //    $scope.deviceWidth = $window.innerWidth;
    //    $scope.deviceHeight = $window.innerHeight - 96;
    //    $scope.activeSlide = 0;
    //    $scope.connections = [];
    //    $scope.requests = [];
    //
    //    $scope.connectionListSpinner = true;
    //    $scope.requestListSpinner = true;
    //
    //    $scope.connectionKeyword = "";
    //    $scope.requestKeyword = "";
    //
    //    $scope.connectionBadgeCount = "";
    //    $scope.requestBadgeCount = "";
    //
    //    $scope.clientUid =  ProfileService.getAuth().uid;
    //
    //    $scope.$watch(function(){
    //        return $window.innerHeight;
    //    }, function(value) {
    //        $scope.deviceHeight = $window.innerHeight - 96;
    //    });
    //
    //    $scope.init = function(){
    //        $scope.connections = ConnectionsService.getConnections();
    //        $scope.requests = ConnectionsService.getRequests();
    //
    //        $scope.connections.$loaded(function(){
    //            if($scope.connections.length < 1){ $scope.connectionListSpinner = false; }
    //            $scope.evaluateBadges();
    //            $scope.constructConnections();
    //
    //            if($scope.activeSlide == 0){
    //                $timeout(function(){ $scope.resetConnectionsBadge(); }, 2000);
    //            }
    //        });
    //
    //
    //        $scope.connections.$watch(function(event){
    //            $scope.evaluateBadges();
    //            $scope.constructConnections();
    //
    //            if($scope.activeSlide == 0){
    //                $timeout(function(){ $scope.resetConnectionsBadge(); }, 2000);
    //            }
    //        });
    //
    //        $scope.requests.$loaded(function(){
    //            if($scope.requests.length < 1){ $scope.requestListSpinner = false; }
    //            $scope.evaluateBadges();
    //            $scope.constructRequests();
    //        });
    //
    //        $scope.requests.$watch(function(event){
    //            if($scope.requests.length < 1){ $scope.requestListSpinner = false; }
    //            $scope.evaluateBadges();
    //            $scope.constructRequests();
    //        });
    //    };
    //
    //    $scope.changeSection = function(index){
    //        $ionicTabsDelegate.select(index);
    //        $scope.activeSlide = index;
    //
    //        switch(index){
    //            case 0:
    //                $timeout(function(){ $scope.resetConnectionsBadge(); }, 2000);
    //                break;
    //            case 1:
    //                $timeout(function(){ $scope.resetRequestsBadge(); }, 2000);
    //                break;
    //
    //        }
    //    };
    //
    //    $scope.resetConnectionsBadge = function(){
    //        if($scope.connections.length > 0){
    //            $scope.connections.forEach(function(connection){
    //                if(connection.$value == false) {
    //                    var connectionRef = $firebaseObject(ProfileService.getProfileRef().child('connections').child(connection.$id));
    //                    connectionRef.$value = true;
    //                    connectionRef.$save();
    //                }
    //            });
    //        }
    //    };
    //
    //    $scope.resetRequestsBadge = function(){
    //        if($scope.requests.length > 0){
    //            $scope.requests.forEach(function(request){
    //                if(request.$value == false) {
    //                    var requestRef = $firebaseObject(ProfileService.getProfileRef().child('requests').child(request.$id));
    //                    requestRef.$value = true;
    //                    requestRef.$save();
    //                }
    //            });
    //        }
    //    };
    //
    //    $scope.evaluateBadges = function(){
    //        var requestCtr = 0;
    //        var connectionCtr = 0;
    //
    //        if($scope.requests.length > 0){
    //            $scope.requests.forEach(function(request){
    //                if(request.$value == false) { requestCtr++; }
    //            });
    //        }
    //
    //        if($scope.connections.length > 0){
    //            $scope.connections.forEach(function(connection){
    //                if(connection.$value == false) { connectionCtr++; }
    //            });
    //        }
    //
    //        if(requestCtr > 0){
    //            if(requestCtr > 99){
    //                $scope.requestBadgeCount = "99+";
    //            }else{
    //                $scope.requestBadgeCount = requestCtr;
    //            }
    //        }else{
    //            $scope.requestBadgeCount = "";
    //        }
    //
    //        if(connectionCtr > 0){
    //            if(connectionCtr > 99){
    //                $scope.connectionBadgeCount = "99+";
    //            }else{
    //                $scope.connectionBadgeCount = connectionCtr;
    //            }
    //        }else{
    //            $scope.connectionBadgeCount = "";
    //        }
    //    };
    //
    //    $scope.constructConnections = function(){
    //        $scope.connections.forEach(function(value){
    //            firebaseRef.child('user_accounts').child(value.$id).on("value", function(snapshot){
    //                firebaseRef.child('pictures').child(value.$id).child('picture').on("value", function(pictureSnap){
    //                    $scope.$evalAsync(function(){
    //                        value.firstName = snapshot.val().firstName;
    //                        value.lastName = snapshot.val().lastName;
    //                        value.email = snapshot.val().email;
    //                        value.company = snapshot.val().company;
    //                        value.position = snapshot.val().position;
    //                        value.positionPrivate = snapshot.val().positionPrivate;
    //                        value.picture = pictureSnap.val();
    //
    //                        $scope.connectionListSpinner = false;
    //                    });
    //                }, function(err){
    //                    console.log(err);
    //                });
    //            }, function(err){
    //                console.log(err);
    //            });
    //        });
    //    };
    //
    //    $scope.constructRequests = function(){
    //        $scope.requests.forEach(function(value){
    //            firebaseRef.child('user_accounts').child(value.$id).on("value", function(snapshot){
    //                firebaseRef.child('pictures').child(value.$id).child('picture').on("value", function(pictureSnap){
    //                    $scope.$evalAsync(function(){
    //                        value.firstName = snapshot.val().firstName;
    //                        value.lastName = snapshot.val().lastName;
    //                        value.email = snapshot.val().email;
    //                        value.company = snapshot.val().company;
    //                        value.position = snapshot.val().position;
    //                        value.positionPrivate = snapshot.val().positionPrivate;
    //                        value.picture = pictureSnap.val();
    //
    //                        $scope.requestListSpinner = false;
    //                    });
    //                }, function(err){
    //                    console.log(err);
    //                });
    //            }, function(err){
    //                console.log(err);
    //            });
    //        });
    //    };
    //
    //    $scope.connectionSearch = function (row) {
    //        if(row.hasOwnProperty('firstName')){
    //            return (
    //            angular.lowercase(row.firstName).indexOf($scope.connectionKeyword || '') !== -1 ||
    //            angular.lowercase(row.lastName).indexOf($scope.connectionKeyword || '') !== -1 ||
    //            angular.lowercase(row.email).indexOf($scope.connectionKeyword || '') !== -1 ||
    //            angular.lowercase(row.company).indexOf($scope.connectionKeyword || '') !== -1 ||
    //            angular.lowercase(row.position).indexOf($scope.connectionKeyword || '') !== -1
    //            );
    //        }
    //    };
    //
    //    $scope.requestSearch = function (row) {
    //        if(row.hasOwnProperty('firstName')){
    //            return (
    //            angular.lowercase(row.firstName).indexOf($scope.requestKeyword || '') !== -1 ||
    //            angular.lowercase(row.lastName).indexOf($scope.requestKeyword || '') !== -1 ||
    //            angular.lowercase(row.email).indexOf($scope.requestKeyword || '') !== -1 ||
    //            angular.lowercase(row.company).indexOf($scope.requestKeyword || '') !== -1 ||
    //            angular.lowercase(row.position).indexOf($scope.requestKeyword || '') !== -1
    //            );
    //        }
    //    };
    //
    //    $scope.setConnectionKeyword = function(keyword){
    //        $scope.connectionKeyword = keyword;
    //    };
    //
    //    $scope.setRequestKeyword = function(keyword){
    //        $scope.requestKeyword = keyword;
    //    };
    //
    //    $scope.openProfileModal = function(uid){
    //        ProfileService.setOtherProfileRef(uid);
    //        $scope.openModal();
    //    };
    //
    //    $ionicModal.fromTemplateUrl('templates/profile-modal.html', {
    //        scope: $scope,
    //        animation: 'slide-in-up',
    //        backdropClickToClose: false,
    //        hardwareBackButtonClose: false
    //    }).then(function(modal) {
    //        $scope.modal = modal;
    //    });
    //    $scope.openModal = function() {
    //        $scope.modal.show();
    //    };
    //    $scope.closeModal = function() {
    //        $scope.modal.hide();
    //    };
    //
    //    $scope.$on('$destroy', function() {
    //        $scope.modal.remove();
    //    });
    //})
    //
    //.controller('ProfileModal', function($scope, $firebaseArray, $firebaseObject, $ionicPopup, ProfileService, ConnectionsService){
    //
    //    $scope.userPicture = null;
    //    $scope.userProfile = null;
    //    $scope.viewerUid = ProfileService.getAuth().uid;
    //
    //    $scope.profileConnections = [];
    //    $scope.profileRequests = [];
    //    $scope.profileResponds = [];
    //
    //    $scope.isConnected = 'no';
    //
    //    $scope.$on('userReady', function(){
    //
    //        $scope.userPicture = ProfileService.getOtherPictureRef();
    //        $scope.userProfile = ProfileService.getOtherProfileRef();
    //
    //        $scope.profileRequests = $firebaseArray(firebaseRef
    //                .child('user_accounts')
    //                .child($scope.userProfile.$id)
    //                .child('requests')
    //        );
    //
    //        $scope.profileConnections = $firebaseArray(firebaseRef
    //                .child('user_accounts')
    //                .child($scope.userProfile.$id)
    //                .child('connections')
    //        );
    //
    //        $scope.profileResponds = $firebaseArray(firebaseRef
    //                .child('user_accounts')
    //                .child($scope.viewerUid)
    //                .child('requests')
    //        );
    //
    //        $scope.profileRequests.$watch(function(event){
    //            $scope.changeConnectionStatus();
    //        });
    //
    //        $scope.profileConnections.$watch(function(event){
    //            $scope.changeConnectionStatus();
    //        });
    //
    //        $scope.profileResponds.$watch(function(event){
    //            $scope.changeConnectionStatus();
    //        });
    //    });
    //
    //    $scope.changeConnectionStatus = function(){
    //
    //        var checker = false;
    //        $scope.profileRequests.forEach(function(value){
    //           if(value.$id == $scope.viewerUid){
    //               $scope.isConnected = 'requested';
    //               checker = true;
    //           }
    //        });
    //
    //        $scope.profileConnections.forEach(function(value){
    //            if(value.$id == $scope.viewerUid){
    //                $scope.isConnected = 'connected';
    //                checker = true;
    //            }
    //        });
    //
    //        $scope.profileResponds.forEach(function(value){
    //            if(value.$id == $scope.userProfile.$id){
    //                $scope.isConnected = 'respond';
    //                checker = true;
    //            }
    //        });
    //
    //        if(!checker){ $scope.isConnected = 'no' }
    //    };
    //
    //    $scope.sendConnectionRequest = function(uid){
    //        var requestsRef = $firebaseObject(firebaseRef.child('user_accounts').child(uid).child('requests').child($scope.viewerUid));
    //        requestsRef.$value = false;
    //        requestsRef.$priority = new Date().getTime();
    //
    //        requestsRef.$save().then(function(ref){
    //        }, function(err){
    //            console.log(err);
    //        });
    //    };
    //
    //    $scope.cancelRequest = function(uid){
    //
    //        var confirmPopup = $ionicPopup.confirm({
    //            title: 'Cancel Request',
    //            template: 'Are you sure you want cancel the request?'
    //        });
    //        confirmPopup.then(function(res) {
    //            if(res) {
    //
    //                var connectionRef = $firebaseObject(
    //                    firebaseRef
    //                        .child('user_accounts')
    //                        .child(uid)
    //                        .child('requests')
    //                        .child($scope.viewerUid)
    //                );
    //
    //                connectionRef.$remove().then(function(ref) {
    //
    //                }, function(error) {
    //                    console.log("Error:", error);
    //                });
    //            }
    //        });
    //    };
    //
    //    $scope.respondRequest = function(uid){
    //        var respondPopup = $ionicPopup.show({
    //            template: 'Respond to connection request',
    //            title: 'Add as connection',
    //            scope: $scope,
    //            buttons: [
    //                { text: 'Cancel' },
    //                {
    //                    text: 'Add',
    //                    type: 'button-positive',
    //                    onTap: function(e) {
    //                        return true;
    //                    }
    //                },
    //                {
    //                    text: 'Delete',
    //                    type: 'button-assertive',
    //                    onTap: function(e) {
    //                        return false;
    //                    }
    //                }
    //            ]
    //        });
    //
    //        respondPopup.then(function(res){
    //            if(res){
    //
    //                var requestRef = $firebaseObject(ProfileService.getProfileRef().child('requests').child(uid));
    //                var userConnectionsRef = $firebaseObject(ProfileService.getProfileRef().child('connections').child(uid));
    //                var requestorRef = $firebaseObject(firebaseRef.child('user_accounts').child(uid).child('connections').child($scope.viewerUid));
    //
    //                requestorRef.$value = false;
    //                requestorRef.$priority = new Date().getTime();
    //                requestorRef.$save().then(function(ref){
    //                }, function(err){
    //                    console.log(err);
    //                });
    //
    //                userConnectionsRef.$value = false;
    //                userConnectionsRef.$priority = new Date().getTime();
    //                userConnectionsRef.$save().then(function(ref){
    //                }, function(err){
    //                    console.log(err);
    //                });
    //
    //                requestRef.$remove().then(function(ref) {
    //                }, function(error) {
    //                    console.log("Error:", error);
    //                });
    //            }else{
    //
    //                var requestRef = $firebaseObject(
    //                    ProfileService.getProfileRef()
    //                        .child('requests')
    //                        .child(uid)
    //                );
    //
    //                requestRef.$remove().then(function(ref) {
    //
    //                }, function(error) {
    //                    console.log("Error:", error);
    //                });
    //            }
    //        });
    //    };
    //
    //    $scope.removeConnection = function(uid, name) {
    //        var confirmPopup = $ionicPopup.confirm({
    //            title: 'Remove Connection',
    //            template: 'Are you sure you want to remove ' + name + ' from your connections?'
    //        });
    //        confirmPopup.then(function(res) {
    //            if(res) {
    //
    //                var connectionRef = $firebaseObject(
    //                    firebaseRef
    //                        .child('user_accounts')
    //                        .child(uid)
    //                        .child('connections')
    //                        .child($scope.viewerUid)
    //                );
    //
    //                connectionRef.$remove().then(function(ref) {
    //
    //                }, function(error) {
    //                    console.log("Error:", error);
    //                });
    //
    //                var viewerRef = $firebaseObject(
    //                    firebaseRef
    //                        .child('user_accounts')
    //                        .child($scope.viewerUid)
    //                        .child('connections')
    //                        .child(uid)
    //                );
    //
    //                viewerRef.$remove().then(function(ref) {
    //
    //                }, function(error) {
    //                    console.log("Error:", error);
    //                });
    //            }
    //        });
    //    };
    //
    //    $scope.createConversation = function(clientUid, receiverUid, userMessage){
    //
    //        //create new
    //        var conversation = {};
    //        conversation[clientUid] = true;
    //        conversation[receiverUid] = true;
    //        var conversationMembersRef = $firebaseArray(firebaseRef.child('conversations'));
    //
    //        conversationMembersRef.$add(conversation).then(function(data){
    //            var message = {}
    //
    //            message.sender = clientUid;
    //            message.date = new Date().getTime();
    //            message.message = userMessage;
    //            message.seen = false;
    //
    //            var messages = $firebaseArray(firebaseRef.child('messages').child(data.key()));
    //
    //            messages.$add(message).then(function(e){
    //                //user that is logged in
    //                var userMessagesRef = $firebaseObject(firebaseRef.child('user_accounts').child(clientUid).child('conversations').child(data.key()));
    //                userMessagesRef.$value = true;
    //
    //                userMessagesRef.$save().then(function(ref){
    //                }, function(err){
    //                    console.log(err);
    //                });
    //
    //                //recipient
    //                var recipientMessagesRef = $firebaseObject(firebaseRef.child('user_accounts').child(receiverUid).child('conversations').child(data.key()));
    //                recipientMessagesRef.$value = true;
    //
    //
    //                recipientMessagesRef.$save().then(function(ref){
    //                }, function(err){
    //                    console.log(err);
    //                });
    //            }, function(err){
    //                console.log(err);
    //            });
    //        }, function(err){
    //            console.log(err);
    //        });
    //    };
    //
    //    $scope.sendMessage = function(receiverUid, receiver){
    //
    //        $scope.data = {};
    //        var messagePopup = $ionicPopup.show({
    //            templateUrl: 'templates/message-popup.html',
    //            title: 'Send a message',
    //            subTitle: 'To: '+receiver,
    //            scope: $scope,
    //            buttons: [
    //                { text: 'Cancel' },
    //                {
    //                    text: 'Send',
    //                    type: 'button-positive',
    //                    onTap: function(e) {
    //                        return $scope.data.message;
    //                    }
    //                }
    //            ]
    //        });
    //
    //        messagePopup.then(function(res){
    //
    //            if(res) {
    //                firebaseRef.child('conversations')
    //                    .orderByChild($scope.viewerUid)
    //                    .once("value", function(snapshot){
    //                        var roomsList = snapshot;
    //
    //                        if(roomsList.numChildren() > 0){
    //                            //has children. check childrens
    //                            var listCount = roomsList.numChildren();
    //                            var counterChecker = 0;
    //
    //                            roomsList.forEach(function(data){
    //                                //if has only 2 childs. target is only for 1 to 1 chat
    //                                if(data.hasChild(receiverUid) && data.hasChild($scope.viewerUid)){
    //                                    var message = {}
    //
    //                                    var messagesRef = $firebaseArray(firebaseRef.child('messages').child(data.key()));
    //
    //                                    message.sender = $scope.viewerUid;
    //                                    message.date = new Date().getTime();
    //                                    message.message = res;
    //                                    message.seen = false;
    //
    //                                    //push to reference
    //                                    messagesRef.$add(message);
    //                                }else{
    //                                    counterChecker++;
    //
    //                                    if(counterChecker == listCount){
    //                                        $scope.createConversation($scope.viewerUid, receiverUid, res);
    //                                    }
    //                                }
    //                            });
    //                        }else{
    //                            $scope.createConversation($scope.viewerUid, receiverUid, res);
    //                        }
    //                    }, function(err){
    //                        console.log(err);
    //                    });
    //            }
    //        });
    //    };
    //})
    //
    //.controller('ConnectionsSearch', function($scope, ProfileService){
    //
    //    $scope.searchAllCollection = {};
    //    $scope.searchConnectionSpinner = false;
    //    $scope.uid = ProfileService.getAuth().uid;
    //
    //    $scope.searchAll = function(string){
    //
    //        if(string != ""){
    //
    //            $scope.searchAllCollection = {};
    //
    //            if(!$scope.searchConnectionSpinner){ $scope.searchConnectionSpinner = true; }
    //
    //            var keywords = string.split(" ");
    //
    //            keywords.forEach(function(value){
    //
    //                firebaseRef.child('user_accounts')
    //                    .orderByChild("firstName")
    //                    .startAt(value).endAt(value + "~").on("value", function(snapshot){
    //
    //                        snapshot.forEach(function(data){
    //                            var  key = data.key();
    //                            if(!$scope.searchAllCollection.hasOwnProperty(key) && key != $scope.uid){
    //                                firebaseRef.child('pictures').child(key).child('picture').on("value", function(pictureSnap){
    //                                    $scope.$evalAsync(function(){
    //                                        $scope.searchAllCollection[key] = data.val();
    //                                        $scope.hideSearchSpinner();
    //                                        if($scope.searchAllCollection.hasOwnProperty(key)){
    //                                            $scope.searchAllCollection[key].picture = pictureSnap.val();
    //                                        }
    //                                    });
    //                                }, function(err){
    //                                    console.log(err);
    //                                });
    //                            }
    //                        });
    //                    }, function(err){
    //                        console.log(err);
    //                    });
    //
    //                firebaseRef.child('user_accounts')
    //                    .orderByChild("lastName")
    //                    .startAt(value).endAt(value + "~").on("value", function(snapshot){
    //
    //                        snapshot.forEach(function(data){
    //                            var  key = data.key();
    //                            if(!$scope.searchAllCollection.hasOwnProperty(key) && key != $scope.uid){
    //                                firebaseRef.child('pictures').child(key).child('picture').on("value", function(pictureSnap){
    //                                    $scope.$evalAsync(function(){
    //                                        $scope.searchAllCollection[key] = data.val();
    //                                        $scope.hideSearchSpinner();
    //                                        if($scope.searchAllCollection.hasOwnProperty(key)){
    //                                            $scope.searchAllCollection[key].picture = pictureSnap.val();
    //                                        }
    //                                    });
    //                                }, function(err){
    //                                    console.log(err);
    //                                });
    //                            }
    //                        });
    //                    }, function(err){
    //                        console.log(err);
    //                    });
    //
    //                firebaseRef.child('user_accounts')
    //                    .orderByChild("email")
    //                    .startAt(value).endAt(value + "~").on("value", function(snapshot){
    //
    //                        snapshot.forEach(function(data){
    //                            var  key = data.key();
    //                            if(!$scope.searchAllCollection.hasOwnProperty(key) && key != $scope.uid){
    //                                firebaseRef.child('pictures').child(key).child('picture').on("value", function(pictureSnap){
    //                                    $scope.$evalAsync(function(){
    //                                        $scope.searchAllCollection[key] = data.val();
    //                                        $scope.hideSearchSpinner();
    //                                        if($scope.searchAllCollection.hasOwnProperty(key)){
    //                                            $scope.searchAllCollection[key].picture = pictureSnap.val();
    //                                        }
    //                                    });
    //                                }, function(err){
    //                                    console.log(err);
    //                                });
    //                            }
    //                        });
    //                    }, function(err){
    //                        console.log(err);
    //                    });
    //
    //                firebaseRef.child('user_accounts')
    //                    .orderByChild("iFirstName")
    //                    .startAt(value).endAt(value + "~").on("value", function(snapshot){
    //
    //                        snapshot.forEach(function(data){
    //                            var  key = data.key();
    //                            if(!$scope.searchAllCollection.hasOwnProperty(key) && key != $scope.uid){
    //                                firebaseRef.child('pictures').child(key).child('picture').on("value", function(pictureSnap){
    //                                    $scope.$evalAsync(function(){
    //                                        $scope.searchAllCollection[key] = data.val();
    //                                        $scope.hideSearchSpinner();
    //                                        if($scope.searchAllCollection.hasOwnProperty(key)){
    //                                            $scope.searchAllCollection[key].picture = pictureSnap.val();
    //                                        }
    //                                    });
    //                                }, function(err){
    //                                    console.log(err);
    //                                });
    //                            }
    //                        });
    //                    }, function(err){
    //                        console.log(err);
    //                    });
    //
    //                firebaseRef.child('user_accounts')
    //                    .orderByChild("iLastName")
    //                    .startAt(value).endAt(value + "~").on("value", function(snapshot){
    //
    //                        snapshot.forEach(function(data){
    //                            var  key = data.key();
    //                            if(!$scope.searchAllCollection.hasOwnProperty(key) && key != $scope.uid){
    //                                firebaseRef.child('pictures').child(key).child('picture').on("value", function(pictureSnap){
    //                                    $scope.$evalAsync(function(){
    //                                        $scope.searchAllCollection[key] = data.val();
    //                                        $scope.hideSearchSpinner();
    //                                        if($scope.searchAllCollection.hasOwnProperty(key)){
    //                                            $scope.searchAllCollection[key].picture = pictureSnap.val();
    //                                        }
    //                                    });
    //                                }, function(err){
    //                                    console.log(err);
    //                                });
    //                            }
    //                        });
    //                    }, function(err){
    //                        console.log(err);
    //                    });
    //            });
    //
    //        }else{
    //            $scope.searchAllCollection = {};
    //            $scope.hideSearchSpinner();
    //        }
    //    };
    //
    //    $scope.hideSearchSpinner = function(){
    //        $scope.searchConnectionSpinner = false;
    //    };
    //
    //    $scope.showSearchSpinner = function(){
    //        $scope.searchConnectionSpinner = true;
    //    };
    //})
    //
    //.controller('Account', function($scope, $state, $timeout, $ionicActionSheet, $cordovaCamera, $firebaseObject, ProfileService, Hasher){
    //
    //    $scope.profile = $firebaseObject(ProfileService.getProfileRef());
    //    $scope.profileCheck = false;
    //    $scope.privacyCheck = false;
    //    $scope.emailCheck = false;
    //    $scope.passwordCheck = false;
    //
    //    $scope.ceOldEmailCheck = false;
    //    $scope.ceNewEmailCheck = false;
    //    $scope.cePasswordCheck = false;
    //
    //    $scope.cpEmailCheck = false;
    //    $scope.ceOldPasswordCheck = false;
    //    $scope.cpNewPasswordCheck = false;
    //
    //
    //    $scope.ce = {
    //        ceOldEmail : "",
    //        ceNewEmail : "",
    //        cePassword : ""
    //    };
    //
    //    $scope.cp = {
    //        cpEmail : "",
    //        cpOldPassword : "",
    //        cpNewPassword : ""
    //    };
    //
    //    $scope.saveProfile = function(){
    //        $scope.profileCheck = true;
    //
    //        ProfileService.getProfileRef().update({
    //            "firstName" : ucwords($scope.profile.firstName),
    //            "lastName"  : ucwords($scope.profile.lastName),
    //            "company"   : $scope.profile.company,
    //            "position"  : $scope.profile.position,
    //            "contact"   : $scope.profile.contact,
    //            "iFirstName": $scope.profile.firstName.toLowerCase(),
    //            "iLastName" : $scope.profile.lastName.toLowerCase()
    //        });
    //
    //        $timeout(function(){
    //            $scope.profileCheck = false;
    //        }, 2000);
    //    };
    //
    //    $scope.savePrivacy = function(){
    //        $scope.privacyCheck = true;
    //        $scope.profile.$save();
    //        $timeout(function(){
    //            $scope.privacyCheck = false;
    //        }, 2000);
    //    };
    //
    //    $scope.changeEmail = function(){
    //        var auth = ProfileService.getAuth();
    //        var authEmail = auth.password.email;
    //
    //        if($scope.ce.ceOldEmail != authEmail){
    //            $scope.ceOldEmailCheck = true;
    //        }else{
    //            $scope.ceOldEmailCheck = false;
    //            $scope.ceNewEmailCheck = false;
    //            $scope.cePasswordCheck = false;
    //
    //
    //            ProfileService.getFirebaseAuth().$changeEmail({
    //                oldEmail: $scope.ce.ceOldEmail,
    //                newEmail: $scope.ce.ceNewEmail,
    //                password: Hasher.hash($scope.ce.cePassword)
    //            }).then(function() {
    //
    //                ProfileService.getProfileRef().update({
    //                    "email" : $scope.ce.ceNewEmail
    //                });
    //
    //                ProfileService.updateAuthDataEmail($scope.ce.ceNewEmail);
    //
    //                console.log(ProfileService.getAuth());
    //                $scope.emailCheck = true;
    //
    //                $scope.ce.ceOldEmail = "";
    //                $scope.ce.ceNewEmail = "";
    //                $scope.ce.cePassword = "";
    //
    //                $timeout(function(){
    //                    $scope.emailCheck = false;
    //                }, 2000);
    //            }).catch(function(error) {
    //                console.log(error);
    //                switch (error.code) {
    //                    case "EMAIL_TAKEN":
    //                        $scope.$evalAsync($scope.ceWrongNewEmail());
    //                        break;
    //                    case "INVALID_EMAIL":
    //                        $scope.$evalAsync($scope.ceWrongNewEmail());
    //                        break;
    //                    case "INVALID_PASSWORD":
    //                        $scope.$evalAsync($scope.ceWrongPassword());
    //                        break;
    //                    case "INVALID_USER":
    //                        $scope.$evalAsync($scope.ceWrongOldEmail());
    //                        break;
    //                    default:
    //                        console.log("Error creating user:", error);
    //                }
    //            });
    //        }
    //    };
    //
    //    $scope.changePassword = function(){
    //        var auth = ProfileService.getAuth();
    //        var authEmail = auth.password.email;
    //
    //        if($scope.cp.cpEmail != authEmail) {
    //            console.log("$scope.cpEmail != authEmail");
    //            $scope.cpEmailCheck = true;
    //        }else if($scope.cp.cpOldPassword.length < 6){
    //            console.log("$scope.cpOldPassword.length < 6");
    //            $scope.cpOldPasswordCheck = true;
    //        }else if($scope.cp.cpNewPassword.length < 6){
    //            console.log("$scope.cpNewPassword.length < 6");
    //            $scope.cpNewPasswordCheck = true;
    //        }else{
    //            $scope.cpEmailCheck = false;
    //            $scope.cpOldPasswordCheck = false;
    //            $scope.cpNewPasswordCheck = false;
    //
    //
    //            ProfileService.getFirebaseAuth().$changePassword({
    //                email: $scope.cp.cpEmail,
    //                oldPassword: Hasher.hash($scope.cp.cpOldPassword),
    //                newPassword: Hasher.hash($scope.cp.cpNewPassword)
    //            }).then(function() {
    //                $scope.passwordCheck = true;
    //
    //                $scope.cp.cpEmail = "";
    //                $scope.cp.cpOldPassword = "";
    //                $scope.cp.cpNewPassword = "";
    //
    //                $timeout(function(){
    //                    $scope.passwordCheck = false;
    //                }, 2000);
    //            }).catch(function(error) {
    //                console.log(error);
    //                $scope.cpWrongPassword();
    //            });
    //        }
    //    };
    //
    //    $scope.changePicture = function(type){
    //        // Show the action sheet
    //        var sheetTitle;
    //        if(type == "profile"){
    //            sheetTitle = "Change Profile Picture";
    //        }else{
    //            sheetTitle = "Change Cover Photo";
    //        }
    //
    //        var hideSheet = $ionicActionSheet.show({
    //            buttons: [
    //                { text: '<i class="icon ion-images balanced"></i> Choose From Gallery' },
    //                { text: '<i class="icon ion-camera balanced"></i> Take a picture' }
    //            ],
    //            titleText: sheetTitle,
    //            cancelText: 'Cancel',
    //            cancel: function() {
    //                hideSheet();
    //            },
    //            buttonClicked: function(index) {
    //                switch (index){
    //                    case 0:
    //                        //browse from gallery
    //                        var options = {
    //                            quality : 100,
    //                            destinationType : Camera.DestinationType.DATA_URL,
    //                            sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
    //                            allowEdit : true,
    //                            encodingType: Camera.EncodingType.JPEG,
    //                            popoverOptions: CameraPopoverOptions,
    //                            targetWidth: 500,
    //                            targetHeight: 500
    //                        };
    //                        //take picture
    //                        $cordovaCamera.getPicture(options).then(function(imageData) {
    //                            ProfileService.updatePicture(type, "data:image/jpeg;base64," + imageData);
    //                            hideSheet();
    //                        }, function(error) {
    //                            console.error(error);
    //                        });
    //                        break;
    //                    case 1:
    //                        var options = {
    //                            quality : 100,
    //                            destinationType : Camera.DestinationType.DATA_URL,
    //                            sourceType : Camera.PictureSourceType.CAMERA,
    //                            allowEdit : true,
    //                            encodingType: Camera.EncodingType.JPEG,
    //                            popoverOptions: CameraPopoverOptions,
    //                            targetWidth: 500,
    //                            targetHeight: 500,
    //                            saveToPhotoAlbum: false
    //                        };
    //                        //take picture
    //                        $cordovaCamera.getPicture(options).then(function(imageData) {
    //                            ProfileService.updatePicture(type, "data:image/jpeg;base64," + imageData);
    //                            hideSheet();
    //                        }, function(error) {
    //                            console.error(error);
    //                        });
    //                        break;
    //                }
    //            }
    //        });
    //    };
    //
    //    $scope.ceWrongOldEmail = function(){
    //        $scope.ceOldEmailCheck = true;
    //    };
    //
    //    $scope.ceWrongNewEmail = function(){
    //        $scope.ceNewEmailCheck = true;
    //    };
    //
    //    $scope.ceWrongPassword = function(){
    //        $scope.cePasswordCheck = true;
    //    };
    //
    //    $scope.cpWrongPassword = function(){
    //        $scope.cpOldPasswordCheck = true;
    //    };
    //})
    //
    //.controller('Login', function($scope, $state, $firebaseAuth, $ionicLoading, Hasher, ProfileService){
    //
    //    $scope.show = function() {
    //        $ionicLoading.show({
    //            templateUrl: 'templates/loader.html'
    //        });
    //    };
    //    $scope.hide = function(){
    //        $ionicLoading.hide();
    //    };
    //
    //    $scope.account = {
    //        email : "",
    //        password : ""
    //    };
    //
    //    $scope.invalid = "";
    //
    //    $scope.loginUser = function(){
    //
    //        $scope.show();
    //
    //        ProfileService.getFirebaseAuth().$authWithPassword({
    //            email    : $scope.account.email,
    //            password : Hasher.hash($scope.account.password)
    //        }).then(function(authData) {
    //            $scope.hide();
    //        }).catch(function(error) {
    //            $scope.invalidAccount();
    //            $scope.hide();
    //            console.log(error);
    //        });
    //    };
    //
    //    $scope.invalidAccount = function(){
    //        $scope.invalid = "Invalid Username or Password."
    //    };
    //})
    //
    //.controller('Register', function($scope, $state, $stateParams, $ionicHistory, $ionicModal, ProfileService, RegisterService, FieldValidator, Hasher){
    //
    //    $ionicHistory.nextViewOptions({
    //        disableBack: true
    //    });
    //
    //    $ionicModal.fromTemplateUrl('templates/modal-registered.html', function(modal) {
    //        $scope.congratsModal = modal;
    //    }, {
    //        scope: $scope,
    //        animation: 'slide-in-up'
    //    });
    //
    //    var defAccountHint = "You' ll use this when you log in and if you want to change your password";
    //    var defPersonalHint = "Contact Number and Email Address is private by default.";
    //    var defCompanyHint = "Let others know your professional background";
    //    var defEmailTaken = "Email is already taken.";
    //
    //    $scope.accountHint = defAccountHint;
    //    $scope.personalHint = defPersonalHint;
    //    $scope.companyHint = defCompanyHint;
    //    $scope.disabled = true;
    //
    //    var errorMsg = "";
    //    $scope.pClass = "";
    //
    //    $scope.accountDetails = {
    //        password : "",
    //        firstName : "",
    //        lastName : "",
    //        email : "",
    //        contact : "",
    //        company : "",
    //        position : ""
    //    };
    //
    //    $scope.checkEmail = function(){
    //
    //        var userAccountsRef = firebaseRef.child('user_accounts');
    //        errorMsg = "";
    //
    //        errorMsg += FieldValidator.validateRequired("Email", $scope.accountDetails.email);
    //
    //        if(errorMsg.length > 0){
    //            $scope.pClass = "error";
    //            $scope.accountHint = errorMsg;
    //        }else{
    //            var accountRef = userAccountsRef.child(Hasher.hash(this.accountDetails.email));
    //
    //            accountRef.once("value", function(snapshot) {
    //                if(snapshot.val() == null){
    //                    $scope.$evalAsync($scope.throwEmailAvailable());
    //                }else{
    //                    $scope.$evalAsync( $scope.throwEmailTaken());
    //                }
    //            }, function (errorObject) {
    //                console.log("The read failed: " + errorObject.code);
    //            });
    //        }
    //    };
    //
    //    $scope.throwEmailTaken = function(){
    //        $scope.pClass = "error";
    //        $scope.accountHint = defEmailTaken;
    //        $scope.disabled = true;
    //    };
    //
    //    $scope.throwEmailAvailable = function(){
    //        $scope.pClass = ""
    //        $scope.accountHint = defAccountHint
    //        $scope.disabled = false
    //    };
    //
    //    $scope.disableCtn = function(){
    //        $scope.disabled = true;
    //    };
    //
    //    $scope.goToAccount = function(){
    //        $state.go("register.account");
    //    };
    //
    //    $scope.goToPersonal = function(){
    //
    //        errorMsg = "";
    //
    //        errorMsg += FieldValidator.validateRequired("Email", $scope.accountDetails.email);
    //        errorMsg += FieldValidator.validateMinMax("Password", $scope.accountDetails.password);
    //
    //        if(this.accountDetails.email != ""){
    //            errorMsg += FieldValidator.validateEmail(this.accountDetails.email);
    //        }
    //
    //        if(errorMsg.length > 0){
    //            $scope.pClass = "error";
    //            $scope.accountHint = errorMsg;
    //        }else{
    //            $scope.pClass = "";
    //            $scope.accountHint = defAccountHint;
    //            RegisterService.set("email", $scope.accountDetails.email);
    //            RegisterService.set("password", Hasher.hash($scope.accountDetails.password));
    //            $state.go("register.personal");
    //        }
    //    };
    //
    //    $scope.goToCompany = function(){
    //
    //        errorMsg = "";
    //
    //        errorMsg += FieldValidator.validateRequired("First Name", $scope.accountDetails.firstName);
    //        errorMsg += FieldValidator.validateRequired("Last Name", $scope.accountDetails.lastName);
    //
    //        if(errorMsg.length > 0){
    //            $scope.pClass = "error";
    //            $scope.personalHint = errorMsg;
    //        }else {
    //            $scope.pClass = "";
    //            $scope.personalHint = defPersonalHint;
    //            RegisterService.set("firstName", $scope.accountDetails.firstName);
    //            RegisterService.set("lastName", $scope.accountDetails.lastName);
    //            RegisterService.set("contact", $scope.accountDetails.contact);
    //            $state.go("register.company");
    //        }
    //    };
    //
    //    $scope.getDetails = function(){
    //        errorMsg = "";
    //
    //        errorMsg += FieldValidator.validateRequired("Company", $scope.accountDetails.company);
    //        errorMsg += FieldValidator.validateRequired("Position", $scope.accountDetails.position);
    //
    //        if(errorMsg.length > 0){
    //            $scope.pClass = "error";
    //            $scope.companyHint = errorMsg;
    //        }else {
    //            $scope.pClass = "";
    //            $scope.companyHint = defCompanyHint;
    //            RegisterService.set("company", $scope.accountDetails.company);
    //            RegisterService.set("position", $scope.accountDetails.position);
    //            ProfileService.registerUser();
    //            $scope.congratsModal.show();
    //        }
    //    };
    //
    //    $scope.goToLogin = function(){
    //        $scope.congratsModal.hide();
    //        $state.go("login");
    //    };
    //})
;
