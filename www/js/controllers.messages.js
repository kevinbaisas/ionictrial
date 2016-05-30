angular.module('projectmanager.controllers')

.controller('Messages', function($scope, $ionicModal, $interval, $ionicScrollDelegate, ProfileService, MessagesService){

    $scope.messagesListSpinner = true;

    //logged in user uid
    $scope.uid = null;
    $scope.messages = {};

    //conversation key
    $scope.messageKey = "";

    $scope.currentTime = new Date().getTime();

    $scope.scrollMessages = function() {
        $ionicScrollDelegate.$getByHandle('messagesScroll').scrollBottom();
    };

    $scope.initializeMessages = function(){
        //fetch all messages and conversation
        MessagesService.setMessages();
    };

    $scope.$on('countMessagesNotifications', function(){
        $scope.$evalAsync(function(){
            $scope.scrollMessages();
            $scope.uid = ProfileService.getAuth().uid;
            $scope.messages = MessagesService.getMessages();
            $scope.messagesListSpinner = false;
        });
    });

    $scope.getMessages = function(){
        MessagesService.setMessages();
    };

    $scope.openMessagesModal = function(key){
        //set conversation key
        $scope.messageKey = key;
        $scope.scrollMessages();
        $scope.openModal();
    };

    $ionicModal.fromTemplateUrl('templates/modal-message.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.messageKey = "";
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    //set last sender for displaying purposes
    $scope.isLastSender = function(key){

        var checker = false;

        if(key > 0){
            var messageDate = $scope.messages[$scope.messageKey].messages[key].date;
            var prevMessageDateEnd = moment($scope.messages[$scope.messageKey].messages[key-1].date).endOf('day').format("x");

            var messageSender = $scope.messages[$scope.messageKey].messages[key].sender;
            var prevMessageSender = $scope.messages[$scope.messageKey].messages[key-1].sender;

            if((messageSender != prevMessageSender) || (messageDate > prevMessageDateEnd)){
                checker = true;
            }
        }else{
            checker = true;
        }

        return checker;
    };

    //date in message board
    $scope.showDate = function(key){

        var checker = true;
        if(key > 0){
            var prevMessageDateStart = moment($scope.messages[$scope.messageKey].messages[key-1].date).startOf('day').format("x");
            var prevMessageDateEnd = moment($scope.messages[$scope.messageKey].messages[key-1].date).endOf('day').format("x");

            var messageDate = moment($scope.messages[$scope.messageKey].messages[key].date).format("x");

            if(messageDate >= prevMessageDateStart && messageDate <= prevMessageDateEnd){
                checker = false;
            }
        }else{
            checker = true;
        }

        return checker;
    };

    //date in conversation
    $scope.displayDate = function(key){

        var date = "";
        var messageTimeStamp = $scope.messages[$scope.messageKey].messages[key].date;
        var todayMessageDateStart = moment().startOf('day').format("x");
        var todayMessageDateEnd = moment().endOf('day').format("x");

        var yesterdayMessageDateStart = moment().subtract(1, 'days').startOf('day').format("x");
        var yesterdayMessageDateEnd = moment().subtract(1, 'days').endOf('day').format("x");

        var weekMessageDateStart = moment().startOf('week').format("x");
        var weekMessageDateEnd = moment().endOf('week').format("x");

        var thisYearMessageDateStart = moment().startOf('year').format("x");
        var thisYearMessageDateEnd = moment().endOf('year').format("x");

        if(messageTimeStamp >= todayMessageDateStart && messageTimeStamp <= todayMessageDateEnd){
            date = "Today";
        }else if(messageTimeStamp >= yesterdayMessageDateStart && messageTimeStamp <= yesterdayMessageDateEnd) {
            date = "Yesterday";
        }else if(messageTimeStamp >= weekMessageDateStart && messageTimeStamp <= weekMessageDateEnd){
            date = "Last " + moment(messageTimeStamp).format("dddd");
        }else if(messageTimeStamp >= thisYearMessageDateStart && messageTimeStamp <= thisYearMessageDateEnd) {
            date = moment(messageTimeStamp).format("MMM Do");
        }else{
            date = moment(messageTimeStamp).format("MM/DD/YYYY");
        }

        return date;
    };
});
