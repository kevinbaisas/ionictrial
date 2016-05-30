angular.module('projectmanager.controllers')

.controller('Login', function($scope, $state, $firebaseAuth, $ionicLoading, Hasher, ProfileService){

    $scope.show = function() {
        $ionicLoading.show({
            templateUrl: 'templates/loader.html'
        });
    };
    $scope.hide = function(){
        $ionicLoading.hide();
    };

    $scope.account = {
        email : "",
        password : ""
    };

    $scope.invalid = "";

    $scope.loginUser = function(){

        $scope.show();

        ProfileService.getFirebaseAuth().$authWithPassword({
            email    : $scope.account.email,
            password : Hasher.hash($scope.account.password)
        }).then(function(authData) {
            $scope.hide();
        }).catch(function(error) {
            $scope.invalidAccount();
            $scope.hide();
            console.log(error);
        });
    };

    $scope.invalidAccount = function(){
        $scope.invalid = "Invalid Username or Password."
    };
});