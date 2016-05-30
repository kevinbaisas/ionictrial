angular.module('projectmanager.controllers')

.controller('ProfileModal', function($scope, $firebaseArray, $firebaseObject, $ionicPopup, ProfileService, ConnectionsService){

    $scope.userPicture = null;
    $scope.userProfile = null;
    $scope.viewerUid = ProfileService.getAuth().uid;

    $scope.profileConnections = [];
    $scope.profileRequests = [];
    $scope.profileResponds = [];

    $scope.isConnected = 'no';

    $scope.$on('userReady', function(){

        //fetch profile and picture of the viewed user
        $scope.userPicture = ProfileService.getOtherPictureRef();
        $scope.userProfile = ProfileService.getOtherProfileRef();

        //fetch to know if already connected, has request from the logged in user
        $scope.profileRequests = $firebaseArray(firebaseRef
                .child('user_accounts')
                .child($scope.userProfile.$id)
                .child('requests')
        );

        $scope.profileConnections = $firebaseArray(firebaseRef
                .child('user_accounts')
                .child($scope.userProfile.$id)
                .child('connections')
        );

        $scope.profileResponds = $firebaseArray(firebaseRef
                .child('user_accounts')
                .child($scope.viewerUid)
                .child('requests')
        );

        $scope.profileRequests.$watch(function(event){
            $scope.changeConnectionStatus();
        });

        $scope.profileConnections.$watch(function(event){
            $scope.changeConnectionStatus();
        });

        $scope.profileResponds.$watch(function(event){
            $scope.changeConnectionStatus();
        });
    });

    $scope.changeConnectionStatus = function(){

        var checker = false;
        $scope.profileRequests.forEach(function(value){
           if(value.$id == $scope.viewerUid){
               $scope.isConnected = 'requested';
               checker = true;
           }
        });

        $scope.profileConnections.forEach(function(value){
            if(value.$id == $scope.viewerUid){
                $scope.isConnected = 'connected';
                checker = true;
            }
        });

        $scope.profileResponds.forEach(function(value){
            if(value.$id == $scope.userProfile.$id){
                $scope.isConnected = 'respond';
                checker = true;
            }
        });

        if(!checker){ $scope.isConnected = 'no' }
    };

    $scope.sendConnectionRequest = function(uid){
        var requestsRef = $firebaseObject(firebaseRef.child('user_accounts').child(uid).child('requests').child($scope.viewerUid));
        requestsRef.$value = false;
        requestsRef.$priority = new Date().getTime();

        requestsRef.$save().then(function(ref){
        }, function(err){
            console.log(err);
        });
    };

    $scope.cancelRequest = function(uid){

        var confirmPopup = $ionicPopup.confirm({
            title: 'Cancel Request',
            template: 'Are you sure you want cancel the request?'
        });
        confirmPopup.then(function(res) {
            if(res) {

                var connectionRef = $firebaseObject(
                    firebaseRef
                        .child('user_accounts')
                        .child(uid)
                        .child('requests')
                        .child($scope.viewerUid)
                );

                connectionRef.$remove().then(function(ref) {

                }, function(error) {
                    console.log("Error:", error);
                });
            }
        });
    };

    $scope.respondRequest = function(uid){
        var respondPopup = $ionicPopup.show({
            template: 'Respond to connection request',
            title: 'Add as connection',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: 'Add',
                    type: 'button-positive',
                    onTap: function(e) {
                        return true;
                    }
                },
                {
                    text: 'Delete',
                    type: 'button-assertive',
                    onTap: function(e) {
                        return false;
                    }
                }
            ]
        });

        respondPopup.then(function(res){
            if(res){

                var requestRef = $firebaseObject(ProfileService.getProfileRef().child('requests').child(uid));
                var userConnectionsRef = $firebaseObject(ProfileService.getProfileRef().child('connections').child(uid));
                var requestorRef = $firebaseObject(firebaseRef.child('user_accounts').child(uid).child('connections').child($scope.viewerUid));

                requestorRef.$value = false;
                requestorRef.$priority = new Date().getTime();
                requestorRef.$save().then(function(ref){
                }, function(err){
                    console.log(err);
                });

                userConnectionsRef.$value = false;
                userConnectionsRef.$priority = new Date().getTime();
                userConnectionsRef.$save().then(function(ref){
                }, function(err){
                    console.log(err);
                });

                requestRef.$remove().then(function(ref) {
                }, function(error) {
                    console.log("Error:", error);
                });
            }else{

                var requestRef = $firebaseObject(
                    ProfileService.getProfileRef()
                        .child('requests')
                        .child(uid)
                );

                requestRef.$remove().then(function(ref) {

                }, function(error) {
                    console.log("Error:", error);
                });
            }
        });
    };

    $scope.removeConnection = function(uid, name) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Remove Connection',
            template: 'Are you sure you want to remove ' + name + ' from your connections?'
        });
        confirmPopup.then(function(res) {
            if(res) {

                var connectionRef = $firebaseObject(
                    firebaseRef
                        .child('user_accounts')
                        .child(uid)
                        .child('connections')
                        .child($scope.viewerUid)
                );

                connectionRef.$remove().then(function(ref) {

                }, function(error) {
                    console.log("Error:", error);
                });

                var viewerRef = $firebaseObject(
                    firebaseRef
                        .child('user_accounts')
                        .child($scope.viewerUid)
                        .child('connections')
                        .child(uid)
                );

                viewerRef.$remove().then(function(ref) {

                }, function(error) {
                    console.log("Error:", error);
                });
            }
        });
    };

    $scope.createConversation = function(clientUid, receiverUid, userMessage){

        //create new
        var conversation = {};
        conversation[clientUid] = true;
        conversation[receiverUid] = true;
        var conversationMembersRef = $firebaseArray(firebaseRef.child('conversations'));

        conversationMembersRef.$add(conversation).then(function(data){
            var message = {}

            message.sender = clientUid;
            message.date = new Date().getTime();
            message.message = userMessage;
            message.seen = false;

            var messages = $firebaseArray(firebaseRef.child('messages').child(data.key()));

            messages.$add(message).then(function(e){
                //user that is logged in
                var userMessagesRef = $firebaseObject(firebaseRef.child('user_accounts').child(clientUid).child('conversations').child(data.key()));
                userMessagesRef.$value = true;

                userMessagesRef.$save().then(function(ref){
                }, function(err){
                    console.log(err);
                });

                //recipient
                var recipientMessagesRef = $firebaseObject(firebaseRef.child('user_accounts').child(receiverUid).child('conversations').child(data.key()));
                recipientMessagesRef.$value = true;


                recipientMessagesRef.$save().then(function(ref){
                }, function(err){
                    console.log(err);
                });
            }, function(err){
                console.log(err);
            });
        }, function(err){
            console.log(err);
        });
    };

    $scope.sendMessage = function(receiverUid, receiver){

        $scope.data = {};
        var messagePopup = $ionicPopup.show({
            templateUrl: 'templates/message-popup.html',
            title: 'Send a message',
            subTitle: 'To: '+receiver,
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: 'Send',
                    type: 'button-positive',
                    onTap: function(e) {
                        return $scope.data.message;
                    }
                }
            ]
        });

        messagePopup.then(function(res){

            if(res) {
                firebaseRef.child('conversations')
                    .orderByChild($scope.viewerUid)
                    .once("value", function(snapshot){
                        var roomsList = snapshot;

                        if(roomsList.numChildren() > 0){
                            //has children. check childrens
                            var listCount = roomsList.numChildren();
                            var counterChecker = 0;

                            roomsList.forEach(function(data){
                                //if has only 2 childs. target is only for 1 to 1 chat
                                if(data.hasChild(receiverUid) && data.hasChild($scope.viewerUid)){
                                    var message = {}

                                    var messagesRef = $firebaseArray(firebaseRef.child('messages').child(data.key()));

                                    message.sender = $scope.viewerUid;
                                    message.date = new Date().getTime();
                                    message.message = res;
                                    message.seen = false;

                                    //push to reference
                                    messagesRef.$add(message);
                                }else{
                                    counterChecker++;

                                    if(counterChecker == listCount){
                                        $scope.createConversation($scope.viewerUid, receiverUid, res);
                                    }
                                }
                            });
                        }else{
                            $scope.createConversation($scope.viewerUid, receiverUid, res);
                        }
                    }, function(err){
                        console.log(err);
                    });
            }
        });
    };
});
