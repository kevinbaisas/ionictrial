angular.module('projectmanager.controllers')

.controller('Register', function($scope, $state, $stateParams, $ionicHistory, $ionicModal, ProfileService, RegisterService, FieldValidator, Hasher){

    $ionicHistory.nextViewOptions({
        disableBack: true
    });

    $ionicModal.fromTemplateUrl('templates/modal-registered.html', {
        id: '1',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.congratsModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal-terms.html', {
        id: '2',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.termsModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal-privacy.html', {
        id: '3',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.privacyModal = modal;
    });

    $scope.closeModal = function(){
        $scope.termsModal.hide();
        $scope.privacyModal.hide();
    };

    var defAccountHint = "You' ll use this when you log in and if you want to change your password";
    var defPersonalHint = "Contact Number and Email Address is private by default.";
    var defCompanyHint = "Let others know your professional background";
    var defEmailTaken = "Email is already taken.";

    $scope.accountHint = defAccountHint;
    $scope.personalHint = defPersonalHint;
    $scope.companyHint = defCompanyHint;
    $scope.disabled = true;

    var errorMsg = "";
    $scope.pClass = "";

    $scope.accountDetails = {
        password : "",
        firstName : "",
        lastName : "",
        email : "",
        contact : "",
        company : "",
        position : ""
    };

    $scope.checkEmail = function(){

        errorMsg = "";

        errorMsg += FieldValidator.validateRequired("Email", $scope.accountDetails.email);

        if(errorMsg.length > 0){
            $scope.pClass = "error";
            $scope.accountHint = errorMsg;
        }else{
            firebaseRef.child('user_accounts').orderByChild('email').equalTo($scope.accountDetails.email)
                .once("value", function(snapshot){

                    if(snapshot.hasChildren()){
                        $scope.$evalAsync( $scope.throwEmailTaken());
                    }else{
                        $scope.$evalAsync($scope.throwEmailAvailable());
                    }
                }, function(errorObject){
                    console.log("The read failed: " + errorObject.code);
                })
        }
    };

    $scope.throwEmailTaken = function(){
        $scope.pClass = "error";
        $scope.accountHint = defEmailTaken;
        $scope.disabled = true;
    };

    $scope.throwEmailAvailable = function(){
        $scope.pClass = ""
        $scope.accountHint = defAccountHint
        $scope.disabled = false
    };

    $scope.disableCtn = function(){
        $scope.disabled = true;
    };

    $scope.goToAccount = function(){
        $state.go("register.account");
    };

    $scope.goToPersonal = function(){

        errorMsg = "";

        errorMsg += FieldValidator.validateRequired("Email", $scope.accountDetails.email);
        errorMsg += FieldValidator.validateMinMax("Password", $scope.accountDetails.password);

        if(this.accountDetails.email != ""){
            errorMsg += FieldValidator.validateEmail(this.accountDetails.email);
        }

        if(errorMsg.length > 0){
            $scope.pClass = "error";
            $scope.accountHint = errorMsg;
        }else{
            $scope.pClass = "";
            $scope.accountHint = defAccountHint;
            RegisterService.set("email", $scope.accountDetails.email);
            RegisterService.set("password", Hasher.hash($scope.accountDetails.password));
            $state.go("register.personal");
        }
    };

    $scope.goToCompany = function(){

        errorMsg = "";

        errorMsg += FieldValidator.validateRequired("First Name", $scope.accountDetails.firstName);
        errorMsg += FieldValidator.validateRequired("Last Name", $scope.accountDetails.lastName);

        if(errorMsg.length > 0){
            $scope.pClass = "error";
            $scope.personalHint = errorMsg;
        }else {
            $scope.pClass = "";
            $scope.personalHint = defPersonalHint;
            RegisterService.set("firstName", $scope.accountDetails.firstName);
            RegisterService.set("lastName", $scope.accountDetails.lastName);
            RegisterService.set("contact", $scope.accountDetails.contact);
            $state.go("register.company");
        }
    };

    $scope.getDetails = function(){
        errorMsg = "";

        errorMsg += FieldValidator.validateRequired("Company", $scope.accountDetails.company);
        errorMsg += FieldValidator.validateRequired("Position", $scope.accountDetails.position);

        if(errorMsg.length > 0){
            $scope.pClass = "error";
            $scope.companyHint = errorMsg;
        }else {
            $scope.pClass = "";
            $scope.companyHint = defCompanyHint;
            RegisterService.set("company", $scope.accountDetails.company);
            RegisterService.set("position", $scope.accountDetails.position);
            ProfileService.registerUser();
            $scope.congratsModal.show();
        }
    };

    $scope.goToLogin = function(){
        $scope.congratsModal.hide();
        $state.go("login");
    };

    $scope.openTosModal = function(){

        $scope.termsModal.show();
    };

    $scope.openPrivacyModal = function(){

        $scope.privacyModal.show();
    };
});