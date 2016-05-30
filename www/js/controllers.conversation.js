angular.module('projectmanager.controllers')

.controller('Conversation', function($scope){

    $scope.messageText = "";

    $scope.sendMessage = function(reference, uid){
        if($scope.messageText.trim() != ""){

            reference.$add({
                sender : uid,
                date : new Date().getTime(),
                message : $scope.messageText.trim(),
                seen : false
            });

            $scope.messageText = "";
        }
    };
});