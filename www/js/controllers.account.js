angular.module('projectmanager.controllers')

.controller('Account', function($scope, $state, $timeout, $ionicActionSheet, $cordovaCamera, $firebaseObject, ProfileService, Hasher){

    //get profile
    $scope.profile = $firebaseObject(ProfileService.getProfileRef());

    //section checkers
    $scope.profileCheck = false;
    $scope.privacyCheck = false;
    $scope.emailCheck = false;
    $scope.passwordCheck = false;

    //change email checkers
    $scope.ceOldEmailCheck = false;
    $scope.ceNewEmailCheck = false;
    $scope.cePasswordCheck = false;

    //change password checkers
    $scope.cpEmailCheck = false;
    $scope.ceOldPasswordCheck = false;
    $scope.cpNewPasswordCheck = false;


    //change email fields
    $scope.ce = {
        ceOldEmail : "",
        ceNewEmail : "",
        cePassword : ""
    };

    //change password fields
    $scope.cp = {
        cpEmail : "",
        cpOldPassword : "",
        cpNewPassword : ""
    };

    //save profile section
    $scope.saveProfile = function(){
        $scope.profileCheck = true;

        ProfileService.getProfileRef().update({
            "firstName" : ucwords($scope.profile.firstName),
            "lastName"  : ucwords($scope.profile.lastName),
            "company"   : $scope.profile.company,
            "position"  : $scope.profile.position,
            "contact"   : $scope.profile.contact,
            "iFirstName": $scope.profile.firstName.toLowerCase(),
            "iLastName" : $scope.profile.lastName.toLowerCase()
        });

        $timeout(function(){
            $scope.profileCheck = false;
        }, 2000);
    };

    //save privacy section
    $scope.savePrivacy = function(){
        $scope.privacyCheck = true;
        $scope.profile.$save();
        $timeout(function(){
            $scope.privacyCheck = false;
        }, 2000);
    };

    //save change email section
    $scope.changeEmail = function(){
        var auth = ProfileService.getAuth();
        var authEmail = auth.password.email;

        if($scope.ce.ceOldEmail != authEmail){
            $scope.ceOldEmailCheck = true;
        }else{
            $scope.ceOldEmailCheck = false;
            $scope.ceNewEmailCheck = false;
            $scope.cePasswordCheck = false;


            ProfileService.getFirebaseAuth().$changeEmail({
                oldEmail: $scope.ce.ceOldEmail,
                newEmail: $scope.ce.ceNewEmail,
                password: Hasher.hash($scope.ce.cePassword)
            }).then(function() {

                ProfileService.getProfileRef().update({
                    "email" : $scope.ce.ceNewEmail
                });

                ProfileService.updateAuthDataEmail($scope.ce.ceNewEmail);

                console.log(ProfileService.getAuth());
                $scope.emailCheck = true;

                $scope.ce.ceOldEmail = "";
                $scope.ce.ceNewEmail = "";
                $scope.ce.cePassword = "";

                $timeout(function(){
                    $scope.emailCheck = false;
                }, 2000);
            }).catch(function(error) {
                console.log(error);
                switch (error.code) {
                    case "EMAIL_TAKEN":
                        $scope.$evalAsync($scope.ceWrongNewEmail());
                        break;
                    case "INVALID_EMAIL":
                        $scope.$evalAsync($scope.ceWrongNewEmail());
                        break;
                    case "INVALID_PASSWORD":
                        $scope.$evalAsync($scope.ceWrongPassword());
                        break;
                    case "INVALID_USER":
                        $scope.$evalAsync($scope.ceWrongOldEmail());
                        break;
                    default:
                        console.log("Error creating user:", error);
                }
            });
        }
    };

    //save change password section
    $scope.changePassword = function(){
        var auth = ProfileService.getAuth();
        var authEmail = auth.password.email;

        if($scope.cp.cpEmail != authEmail) {
            console.log("$scope.cpEmail != authEmail");
            $scope.cpEmailCheck = true;
        }else if($scope.cp.cpOldPassword.length < 6){
            console.log("$scope.cpOldPassword.length < 6");
            $scope.cpOldPasswordCheck = true;
        }else if($scope.cp.cpNewPassword.length < 6){
            console.log("$scope.cpNewPassword.length < 6");
            $scope.cpNewPasswordCheck = true;
        }else{
            $scope.cpEmailCheck = false;
            $scope.cpOldPasswordCheck = false;
            $scope.cpNewPasswordCheck = false;


            ProfileService.getFirebaseAuth().$changePassword({
                email: $scope.cp.cpEmail,
                oldPassword: Hasher.hash($scope.cp.cpOldPassword),
                newPassword: Hasher.hash($scope.cp.cpNewPassword)
            }).then(function() {
                $scope.passwordCheck = true;

                $scope.cp.cpEmail = "";
                $scope.cp.cpOldPassword = "";
                $scope.cp.cpNewPassword = "";

                $timeout(function(){
                    $scope.passwordCheck = false;
                }, 2000);
            }).catch(function(error) {
                console.log(error);
                $scope.cpWrongPassword();
            });
        }
    };

    //upload profile picture/cover
    $scope.changePicture = function(type){
        // Show the action sheet
        var sheetTitle;
        if(type == "profile"){
            sheetTitle = "Change Profile Picture";
        }else{
            sheetTitle = "Change Cover Photo";
        }

        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: '<i class="icon ion-images balanced"></i> Choose From Gallery' },
                { text: '<i class="icon ion-camera balanced"></i> Take a picture' }
            ],
            titleText: sheetTitle,
            cancelText: 'Cancel',
            cancel: function() {
                hideSheet();
            },
            buttonClicked: function(index) {
                switch (index){
                    case 0:
                        //browse from gallery
                        var options = {
                            quality : 100,
                            destinationType : Camera.DestinationType.DATA_URL,
                            sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
                            allowEdit : true,
                            encodingType: Camera.EncodingType.JPEG,
                            popoverOptions: CameraPopoverOptions,
                            targetWidth: 500,
                            targetHeight: 500
                        };
                        //take picture
                        $cordovaCamera.getPicture(options).then(function(imageData) {
                            ProfileService.updatePicture(type, "data:image/jpeg;base64," + imageData);
                            hideSheet();
                        }, function(error) {
                            console.error(error);
                        });
                        break;
                    case 1:
                        var options = {
                            quality : 100,
                            destinationType : Camera.DestinationType.DATA_URL,
                            sourceType : Camera.PictureSourceType.CAMERA,
                            allowEdit : true,
                            encodingType: Camera.EncodingType.JPEG,
                            popoverOptions: CameraPopoverOptions,
                            targetWidth: 500,
                            targetHeight: 500,
                            saveToPhotoAlbum: false
                        };
                        //take picture
                        $cordovaCamera.getPicture(options).then(function(imageData) {
                            ProfileService.updatePicture(type, "data:image/jpeg;base64," + imageData);
                            hideSheet();
                        }, function(error) {
                            console.error(error);
                        });
                        break;
                }
            }
        });
    };

    $scope.ceWrongOldEmail = function(){
        $scope.ceOldEmailCheck = true;
    };

    $scope.ceWrongNewEmail = function(){
        $scope.ceNewEmailCheck = true;
    };

    $scope.ceWrongPassword = function(){
        $scope.cePasswordCheck = true;
    };

    $scope.cpWrongPassword = function(){
        $scope.cpOldPasswordCheck = true;
    };
});