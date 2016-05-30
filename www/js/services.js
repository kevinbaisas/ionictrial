angular.module('projectmanager.services', [])

//methods for checking fields
.factory('FieldValidator', function(){

    return {
        validateMinMax : function(field, string){
            if(string.length < 6 || string.length > 25){
                return field+" must be atleast 6 to 25 characters. <br/>";
            }
            return "";
        },

        validateRequired : function(field, string){
            if(string.length < 1){
                return field+" is required. <br/>";
            }
            return "";
        },

        validateEmail : function(string){
            var pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            if(!pattern.test(string)){
                return "Invalid email address. <br />";
            }
            return "";
        }
    }
})

//handling navigation drawer
.factory('NavigationHandler', function(){

    var handler = {};

    handler.currentPosition = 0;

    handler.getCurrentPosition = function(){
        return handler.currentPosition;
    }

    handler.setCurrentPosition = function(position){
        handler.currentPosition = position;
    }

    return handler;
})

.factory('ProjectsService', function($rootScope, $firebaseArray, $firebaseObject, ProfileService){

    var projects = [];
    var members = [];
    var projectService = {
        constructProjectData : function(){

            if(projects.length > 0){
                //collection of projects user (logged in) projects
                projects.forEach(function(value, key){
                    //project details
                    var projectDetails = $firebaseObject(firebaseRef.child('projects').child(value.$id));
                    value.details = projectDetails;

                    //for fetching inner data. angular orderby changes the key of the array.
                    value.key = key;

                    projectDetails.$loaded(function(){
                        projectService.fetchProjectOwner(key, projectDetails.owner);

                        var contributions = $firebaseArray(firebaseRef.child('projects').child(value.$id).child('contributions'));

                        contributions.$loaded(function(){
                            contributions.forEach(function(data){
                                projectService.storeUserInvolved(key, data.$id);
                            });
                        });

                        contributions.$watch(function(){
                            contributions.forEach(function(data){
                                projectService.storeUserInvolved(key, data.$id);
                            });
                        });
                    });

                    projectDetails.$watch(function(){
                        projectService.fetchProjectOwner(key, projectDetails.owner);

                        var contributions = $firebaseArray(firebaseRef.child('projects').child(value.$id).child('contributions'));

                        contributions.$loaded(function(){
                            contributions.forEach(function(data){
                                projectService.storeUserInvolved(key, data.$id);
                            });
                        });

                        contributions.$watch(function(){
                            contributions.forEach(function(data){
                                projectService.storeUserInvolved(key, data.$id);
                            });
                        });
                    });

                });
            }else{
                projectService.broadcastProjects();
            }
        },

        fetchProjectMilestones : function(key){

            var projectMilestones = $firebaseArray(firebaseRef.child('project_milestones').child(projects[key].$id));

            projects[key].milestones = projectMilestones;

            projectMilestones.$loaded(function(){
                projectService.broadcastMilestones();
                projectService.fetchMilestoneTasks(key, projects[key].milestones);
            });

            projectMilestones.$watch(function(){
                projectService.broadcastMilestones();
                projectService.fetchMilestoneTasks(key, projects[key].milestones);
            });
        },

        fetchMilestoneTasks : function(projectIndex, milestones){
            var projectId = projects[projectIndex].$id;

            if(milestones.length > 0){
                milestones.forEach(function(milestone, index){
                    var milestoneTasks = $firebaseArray(firebaseRef.child('milestone_tasks').child(projectId).child(milestone.$id));

                    if(typeof projects[projectIndex]['milestone_tasks'] == 'undefined'){
                        projects[projectIndex]['milestone_tasks'] = {};
                    }

                    projects[projectIndex]['milestone_tasks'][milestone.$id] = milestoneTasks;

                    milestoneTasks.$loaded(function(){
                        projectService.broadcastTasks();
                    });

                    milestoneTasks.$watch(function(){
                        projectService.broadcastTasks();
                    });
                });
            }else{
                projectService.broadcastTasks();
            }
        },

        fetchMilestoneDiscussions : function(projectIndex, milestoneIndex){

            var projectId = projects[projectIndex].$id;

            var milestoneDiscussions = $firebaseArray(firebaseRef.child('milestone_discussions').child(projectId).child(milestoneIndex));

            projects[projectIndex]['milestone_discussions'] = {};
            projects[projectIndex]['milestone_discussions'][milestoneIndex] = milestoneDiscussions;

            milestoneDiscussions.$loaded(function(){
                projectService.fetchDiscussionsPoster(projectIndex, projects[projectIndex]['milestone_discussions'][milestoneIndex]);

                if(projects[projectIndex]['milestone_discussions'][milestoneIndex].length > 0){
                    projects[projectIndex]['milestone_discussions'][milestoneIndex].forEach(function(discussion){
                        projectService.fetchDiscussionsComments(projectIndex, milestoneIndex, discussion.$id);
                    });
                }else{
                    projectService.broadcastDiscussions();
                }
            });

            milestoneDiscussions.$watch(function(){
                projectService.fetchDiscussionsPoster(projectIndex, projects[projectIndex]['milestone_discussions'][milestoneIndex]);

                if(projects[projectIndex]['milestone_discussions'][milestoneIndex].length > 0){
                    projects[projectIndex]['milestone_discussions'][milestoneIndex].forEach(function(discussion){
                        projectService.fetchDiscussionsComments(projectIndex, milestoneIndex, discussion.$id);
                    });
                }
            });
        },

        fetchDiscussionsComments : function(projectIndex, milestoneId, discussionId){

            var projectId = projects[projectIndex].$id;

                if(typeof projects[projectIndex]['discussion_comments'] == 'undefined'){ projects[projectIndex]['discussion_comments'] = {}; }
                if(typeof projects[projectIndex]['discussion_comments'][milestoneId] == 'undefined'){ projects[projectIndex]['discussion_comments'][milestoneId] = {}; }

                if(typeof projects[projectIndex]['discussion_comments'][milestoneId][discussionId] == 'undefined'){

                    var commentsRef = $firebaseArray(firebaseRef.child('discussion_comments').child(projectId).child(milestoneId).child(discussionId));

                    projects[projectIndex]['discussion_comments'][milestoneId][discussionId] = commentsRef;

                    commentsRef.$loaded(function(){
                        projectService.broadcastDiscussions();
                        projects[projectIndex]['discussion_comments'][milestoneId][discussionId].forEach(function(commentDetails){
                            projectService.storeUserInvolved(projectIndex, commentDetails.poster);
                            projectService.broadcastComments();
                        });
                    });

                    commentsRef.$watch(function(){
                        projectService.broadcastDiscussions();
                        projects[projectIndex]['discussion_comments'][milestoneId][discussionId].forEach(function(commentDetails){
                            projectService.storeUserInvolved(projectIndex, commentDetails.poster);
                        });
                    });
                }
        },

        fetchDiscussionsPoster : function(projectIndex, discussions){

            discussions.forEach(function(discussion){
                projectService.storeUserInvolved(projectIndex, discussion.user);
            });
        },

        /*
         users :
         from, discussionPosterId, posterUid

         types :
            crud task
            crud post
            crud comments
         */
        fetchMilestoneLogs : function(projectIndex, milestoneIndex){

            var projectId = projects[projectIndex].$id;

            var milestoneLogs = $firebaseArray(firebaseRef.child('milestone_logs').child(projectId).child(milestoneIndex));

            projects[projectIndex]['milestone_logs'] = {};
            projects[projectIndex]['milestone_logs'][milestoneIndex] = milestoneLogs;

            milestoneLogs.$loaded(function(){
                if(milestoneLogs.length > 0){
                    projects[projectIndex]['milestone_logs'][milestoneIndex].forEach(function(log){

                        if(typeof log.from != 'undefined'){ projectService.storeUserInvolved(projectIndex, log.from); }
                        if(typeof log.discussionPosterId != 'undefined'){ projectService.storeUserInvolved(projectIndex, log.discussionPosterId); }
                        if(typeof log.posterUid != 'undefined'){ projectService.storeUserInvolved(projectIndex, log.posterUid); }

                        projectService.broadcastLogs();
                    });
                }else{
                    projectService.broadcastLogs();
                }
            });

            milestoneLogs.$watch(function(){
                if(milestoneLogs.length > 0){
                    projects[projectIndex]['milestone_logs'][milestoneIndex].forEach(function(log){

                        if(typeof log.from != 'undefined'){ projectService.storeUserInvolved(projectIndex, log.from); }
                        if(typeof log.discussionPosterId != 'undefined'){ projectService.storeUserInvolved(projectIndex, log.discussionPosterId); }
                        if(typeof log.posterUid != 'undefined'){ projectService.storeUserInvolved(projectIndex, log.posterUid); }

                        projectService.broadcastLogs();
                    });
                }
            });
        },

        fetchProjectOwner : function(key, id){

            if(typeof id != 'undefined'){
                //project owner details
                var userAccount = $firebaseObject(firebaseRef.child('user_accounts').child(id));

                userAccount.$loaded(function(){
                    projects[key].owner = userAccount;
                    projectService.broadcastProjects();
                });

                userAccount.$watch(function(){
                    projects[key].owner = userAccount;
                    projectService.broadcastProjects();
                });

                projectService.storeUserInvolved(key, id);
            }
        },

        fetchProjectMembers : function(key){

            //fetch members of the project
            projects[key].members = $firebaseArray(firebaseRef.child('project_members').child(projects[key].$id));

            projects[key].members.$loaded(function(){
                projectService.fetchMemberData(key, projects[key].members);
            });

            projects[key].members.$watch(function(){
                projectService.fetchMemberData(key, projects[key].members);
            });
        },

        fetchProjectTimeLogs : function(key){

            if(typeof projects[key].time_logs == 'undefined'){ projects[key].time_logs = {}; }

            var timeLogs = $firebaseArray(firebaseRef.child('project_budget').child(projects[key].$id));

            projects[key].time_logs = timeLogs;

            timeLogs.$loaded(function(){
                if(timeLogs.length > 0){
                    timeLogs.forEach(function(log){
                        projectService.storeUserInvolved(key, log.user);
                    });

                    projectService.broadcastTimeLogs();
                }else{
                    projectService.broadcastTimeLogs();
                }
            });

            timeLogs.$watch(function(){
                if(typeof timeLogs.length != 'undefined' && timeLogs.length > 0){
                    timeLogs.forEach(function(log){
                        projectService.storeUserInvolved(key, log.user);
                    });

                    projectService.broadcastTimeLogs();
                }
            });
        },

        fetchProjectLogs : function(projectIndex){

            var projectId = projects[projectIndex].$id;

            var projectLogs = $firebaseArray(firebaseRef.child('project_logs').child(projectId));

            projects[projectIndex]['project_logs'] = projectLogs;

            projectLogs.$loaded(function(){
                if(projectLogs.length > 0){
                    projects[projectIndex]['project_logs'].forEach(function(log){

                        if(typeof log.from != 'undefined'){ projectService.storeUserInvolved(projectIndex, log.from); }
                        if(typeof log.to != 'undefined'){ projectService.storeUserInvolved(projectIndex, log.to); }

                        projectService.broadcastProjectLogs();
                    });
                }else{
                    projectService.broadcastProjectLogs();
                }
            });

            projectLogs.$watch(function(){
                if(projectLogs.length > 0){
                    projects[projectIndex]['project_logs'].forEach(function(log){

                        if(typeof log.from != 'undefined'){ projectService.storeUserInvolved(projectIndex, log.from); }
                        if(typeof log.to != 'undefined'){ projectService.storeUserInvolved(projectIndex, log.to); }

                        projectService.broadcastProjectLogs();
                    });
                }else{
                    projectService.broadcastProjectLogs();
                }
            });
        },

        fetchMemberData : function(projectIndex, members){

            if(members.length > 0){
                //fetch details of the member of the project
                members.forEach(function(value){
                    var userAccount = $firebaseObject(firebaseRef.child('user_accounts').child(value.$id));
                    var pictures = $firebaseObject(firebaseRef.child('pictures').child(value.$id));

                    userAccount.$loaded(function(){
                        value.details = userAccount;
                        projectService.broadcastMembers();
                    });

                    userAccount.$watch(function(){
                        value.details = userAccount;
                        projectService.broadcastMembers();
                    });

                    pictures.$loaded(function(){
                        value.pictures = pictures;
                        projectService.broadcastMembers();
                    });

                    pictures.$watch(function(){
                        value.pictures = pictures;
                        projectService.broadcastMembers();
                    });

                    projectService.storeUserInvolved(projectIndex, value.$id);
                });
            }else{
                projectService.broadcastMembers();
            }
        },

        storeUserInvolved : function(projectIndex, uid){

            if(typeof uid != 'undefined'){
                if(typeof projects[projectIndex].involved_users == 'undefined'){
                    projects[projectIndex].involved_users = {};
                }

                if(typeof projects[projectIndex].involved_users[uid] == 'undefined'){
                    var userAccount = $firebaseObject(firebaseRef.child('user_accounts').child(uid));
                    var pictures = $firebaseObject(firebaseRef.child('pictures').child(uid));

                    projects[projectIndex].involved_users[uid] = {};

                    userAccount.$loaded(function(){
                        projects[projectIndex].involved_users[uid].details = userAccount;
                        projectService.broadcastProjects();
                    });

                    userAccount.$watch(function(){
                        projects[projectIndex].involved_users[uid].details = userAccount;
                        projectService.broadcastProjects();
                    });

                    pictures.$loaded(function(){
                        projects[projectIndex].involved_users[uid].pictures = pictures;
                        projectService.broadcastProjects();
                    });

                    pictures.$watch(function(){
                        projects[projectIndex].involved_users[uid].pictures = pictures;
                        projectService.broadcastProjects();
                    });
                }
            }
        },

        broadcastLogs : function(){
            $rootScope.$broadcast('renderLogs');
        },

        broadcastProjectLogs : function(){
            $rootScope.$broadcast('renderProjectLogs');
        },

        broadcastComments : function(){
            $rootScope.$broadcast('renderComments');
        },

        broadcastDiscussions : function(){
            $rootScope.$broadcast('renderDiscussions');
        },

        broadcastTasks : function(){
            $rootScope.$broadcast('renderTasks');
        },

        broadcastMilestones : function(){
            $rootScope.$broadcast('renderMilestones');
        },

        broadcastMembers : function(){
            $rootScope.$broadcast('renderMembers');
        },

        broadcastTimeLogs : function(){
            $rootScope.$broadcast('renderTimeLogs');
        },

        broadcastProjects : function(){
            $rootScope.$broadcast('renderProjects');
        }
    };

    return {
        getProjects : function(){
            return projects;
        },

        setProjects : function(){

            //uid of the user (logged in)
            var clientUid = ProfileService.getAuth().uid;

            //fetch array of projects
            projects = $firebaseArray(firebaseRef.child('user_accounts').child(clientUid).child('projects'));

            projects.$loaded(function(){
                projectService.constructProjectData();
            });

            projects.$watch(function(e){
                projectService.constructProjectData();
            });
        },

        getMilestones : function(key){
            return projects[key].milestones;
        },

        setMilestones : function(key){
            projectService.fetchProjectMilestones(key);
        },

        getMembers : function(key){
            return projects[key].members;
        },

        setMembers : function(key){
            projectService.fetchProjectMembers(key);
        },

        getTimeLogs : function(key){
            return projects[key].time_logs;
        },

        setTimeLogs : function(key){
            projectService.fetchProjectTimeLogs(key);
        },

        getDiscussions : function(projectIndex, milestoneIndex){
            return projects[projectIndex]['milestone_discussions'][milestoneIndex];
        },

        setDiscussions : function(projectIndex, milestoneIndex){
            projectService.fetchMilestoneDiscussions(projectIndex, milestoneIndex);
        },

        setComments : function(projectIndex, milestoneIndex, discussionId){
            projectService.fetchDiscussionsComments(projectIndex, milestoneIndex, discussionId);
        },

        setLogs : function(projectIndex, milestoneIndex){
            projectService.fetchMilestoneLogs(projectIndex, milestoneIndex);
        },

        setProjectLogs : function(projectIndex){
            projectService.fetchProjectLogs(projectIndex);
        }
    };
})

.factory('MessagesService', function($rootScope, $firebaseArray, $firebaseObject, ProfileService){

    var messages = { };

    var messageService = {

        getMessages : function(){
            return messages;
        },

        setMessages : function(){

            //uid of the user (logged in)
            var clientUid = ProfileService.getAuth().uid;

            //fetch conversations
            messages = $firebaseArray(firebaseRef.child('user_accounts').child(clientUid).child('conversations'));

            messages.$loaded(function(){
                messageService.constructProfileObject(clientUid);
            });

            messages.$watch(function(){
                messageService.constructProfileObject(clientUid);
            });
        },

        constructProfileObject : function(clientUid) {

            if(messages.length > 0){
                messages.forEach(function (messagesRef, key) {
                    messagesRef.key = key;
                    //fetch members of the conversation
                    var members = $firebaseArray(firebaseRef.child('conversations').child(messagesRef.$id));

                    members.$loaded(function () {
                        members.forEach(function (id) {
                            if (id.$id != clientUid) {
                                //fetch info of the user (other user)
                                var profile = $firebaseObject(firebaseRef.child('user_accounts').child(id.$id));
                                var pictures = $firebaseObject(firebaseRef.child('pictures').child(id.$id));

                                profile.$loaded(function () {
                                    messageService.reconstructProfile(messagesRef, profile);
                                });

                                profile.$watch(function(){
                                    messageService.reconstructProfile(messagesRef, profile);
                                });

                                pictures.$loaded(function () {
                                    messageService.reconstructPicture(messagesRef, pictures);
                                });

                                pictures.$watch(function(){
                                    messageService.reconstructPicture(messagesRef, pictures);
                                });

                                messageService.constructMessageObject(messagesRef, clientUid);
                            }
                        });
                    });
                });
            }else{
                $rootScope.$broadcast('countMessagesNotifications');
            }
        },

        reconstructProfile : function(messagesRef, profile){
            //reconstruct profile of the user on load or on change
            messagesRef.uid = profile.$id;
            messagesRef.firstName = profile.firstName;
            messagesRef.lastName = profile.lastName;
            messagesRef.isOnline = profile.isOnline;
        },

        reconstructPicture : function(messagesRef, pictures){
            //reconstruct picture of the user on load or on change
            messagesRef.picture = pictures.picture;
        },

        constructMessageObject : function(messagesRef, clientUid){

            //fetch messages of the conversation
            messagesRef.messages = $firebaseArray(firebaseRef.child('messages').child(messagesRef.$id));

            messagesRef.messages.$loaded(function(){
                messageService.constructLastMessage(messagesRef, clientUid);
            });

            messagesRef.messages.$watch(function(){
                messageService.constructLastMessage(messagesRef, clientUid);
            });
        },

        constructLastMessage : function(messagesRef, clientUid){
            if(messagesRef.messages.length > 0){
                //change the last sender for displaying purposes
                var lastSender = messagesRef.messages[messagesRef.messages.length-1];

                if(lastSender.sender == clientUid){
                    messagesRef.sender = 'You';
                    messagesRef.message = lastSender.message;
                    messagesRef.date = lastSender.date;
                }else{
                    messagesRef.sender = messagesRef.firstName;
                    messagesRef.message = lastSender.message;
                    messagesRef.date = lastSender.date;
                }

                messageService.countMessageNotifications(messagesRef, clientUid);
            }
        },

        countMessageNotifications : function(messagesRef, clientUid){
            var notifications = 0;

            if(messagesRef.messages.length > 0){
                //add to notification if message is not yet seen by the user (logged in)
                var lastSender = messagesRef.messages[messagesRef.messages.length-1];

                if(lastSender.sender != clientUid && lastSender.seen == false){ notifications++ }
            }

            messagesRef.notifications = notifications;

            $rootScope.$broadcast('countMessagesNotifications');
        }
    };

    return messageService;
})

.factory('ConnectionsService', function($rootScope, $firebaseArray, ProfileService){

    var connections = [];
    var requests = [];

    return {

        getConnections : function(){
            //connections
            return connections;
        },

        getRequests : function(){
            //connection request
            return requests;
        },

        setConnections : function(){
            var connectionRef = ProfileService.getProfileRef().child('connections');

            connections = $firebaseArray(connectionRef);
            return connections;
        },

        setRequests : function(){
            var requestsRef = ProfileService.getProfileRef().child('requests');

            requests = $firebaseArray(requestsRef);
            return requests;
        }
    }
})

.factory('ProfileService', function($firebase, $firebaseAuth, $firebaseObject, $rootScope, RegisterService){

    //firebase authentication reference
    var fbAuth = $firebaseAuth(firebaseRef);

    //authentication data reference
    var authData = firebaseRef.getAuth();

    var profileRef = null;
    var userRef = null;
    var picturesRef = null;
    var userPicturesRef = null;

    //other user profile reference
    var otherProfileRef = null;
    var otherPictureRef = null;

    //if currently logged in into the device
    if(authData != null && authData.hasOwnProperty('uid')){
        profileRef = firebaseRef.child('user_accounts').child(authData.uid);
        picturesRef = firebaseRef.child('pictures').child(authData.uid);
        userRef = $firebaseObject(profileRef);
        userPicturesRef = $firebaseObject(picturesRef);
    }

    return {

        getFirebaseAuth : function(){
            return fbAuth;
        },

        getAuth : function(){
            return authData;
        },

        getUserRef : function(){
            return userRef;
        },

        getProfileRef : function(){
            return profileRef;
        },

        getUserPicturesRef : function(){
            return userPicturesRef;
        },

        refreshAuthData : function(loginAuth){
            //refresh the auth data on log in or log out
            authData = loginAuth;
            profileRef = firebaseRef.child('user_accounts').child(loginAuth.uid);
            picturesRef = firebaseRef.child('pictures').child(loginAuth.uid);
            userRef = $firebaseObject(profileRef);
            userPicturesRef = $firebaseObject(picturesRef);
        },

        //update picture of the log ined user
        updatePicture : function(type, value){
          if(type == 'profile'){
              picturesRef.update({
                "picture" : value
              });
          }else if(type == 'cover'){
              picturesRef.update({
                  "cover" : value
              });
          }
        },

        //fetch profile of the viewed user
        getOtherProfileRef: function(){
            return otherProfileRef;
        },

        //fetch picture of the viewed user
        getOtherPictureRef: function(){
            return otherPictureRef;
        },

        //update email of the auth data (for account settings)
        updateAuthDataEmail: function(email){
            authData.password.email = email;
        },

        //view and fetch data of other user
        setOtherProfileRef: function(uid){
            otherProfileRef = $firebaseObject(firebaseRef.child('user_accounts').child(uid));
            otherPictureRef = $firebaseObject(firebaseRef.child('pictures').child(uid));
            $rootScope.$broadcast('userReady');
        },

        //register
        registerUser : function(){

            var account = RegisterService.get();

            fbAuth.$createUser({
                email: account.email,
                password: account.password
            }).then(function(userData) {
                var uid = userData.uid;
                //create user reference
                var accountRef = firebaseRef.child('user_accounts').child(uid);
                var picturesRef = firebaseRef.child('pictures').child(uid);

                //insert user details on the reference
                accountRef.set({
                    firstName:	    ucwords(account.firstName),
                    lastName:	    ucwords(account.lastName),
                    contact:	    account.contact,
                    company:	    account.company,
                    position:	    account.position,
                    userLearned:    account.userLearned,

                    contactPrivate: account.contactPrivate,
                    emailPrivate:   account.emailPrivate,
                    companyPrivate: account.companyPrivate,
                    positionPrivate:account.positionPrivate,
                    isSearchable:   account.isSearchable,
                    email:          account.email,
                    iFirstName:     account.firstName.toLowerCase(),
                    iLastName:      account.lastName.toLowerCase(),
                    isOnline:       false
                });

                picturesRef.set({
                   cover : "",
                    picture : ""
                });
            }).catch(function(error) {
                console.error("ERROR: " + error);
            });
        }
    }
})

.factory('RegisterService', function(){

    var account = {
        password : "",
        firstName : "",
        lastName : "",
        email : "",
        contact : "",
        company : "",
        position : "",
        userLearned : true,
        contactPrivate : true,
        emailPrivate : true,
        companyPrivate : false,
        positionPrivate : false,
        isSearchable : false
    };

    return {
        set : function(property, value){
            if(account.hasOwnProperty(property)){
                account[property] = value;
            }
        },

        get : function(){
          return account;
        }
    }
})

.factory('Hasher', function(){

    return {
        hash : function(string){

            return CryptoJS.SHA1(CryptoJS.MD5(string).toString()).toString();
        }
    }
});
