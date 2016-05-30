angular.module('projectmanager.controllers')

.controller('Connections', function($scope, $ionicTabsDelegate, $timeout, $interval, $window, $ionicModal, $firebaseArray, $firebaseObject, $ionicPopup, ProfileService, ConnectionsService){

    //for ion box scroll
    $scope.deviceHeight = $window.innerHeight - 96;

    //connection tab active slide
    $scope.activeSlide = 0;

    //array of connections
    $scope.connections = [];

    //array of requests
    $scope.requests = [];

    $scope.connectionListSpinner = true;
    $scope.requestListSpinner = true;

    //search keywords
    $scope.connectionKeyword = "";
    $scope.requestKeyword = "";

    //badge counts
    $scope.connectionBadgeCount = "";
    $scope.requestBadgeCount = "";

    //logged in user uid
    $scope.clientUid =  ProfileService.getAuth().uid;

    //infinite scrolling
    $scope.connectionsLimit = 10;
    $scope.requestsLimit = 10;
    $scope.searchLimit = 10;

    $scope.allConnectionsLoaded = false;
    $scope.allRequestsLoaded = false;
    $scope.allSearchLoaded = false;

    $scope.connectionScrollable = true;
    $scope.requestScrollable = true;
    $scope.searchScrollable = true;

    $scope.loadConnections = function(){

        $scope.connectionScrollable = false;
        if(typeof $scope.connections != 'undefined'){
            if($scope.connections.length > $scope.connectionsLimit){
                $scope.connectionsLimit += 5;
            }else{
                $scope.allProjectLogsLoaded = true;
            }
        }

        $timeout(function(){
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.connectionScrollable = true;
        }, 3000);
    };

    $scope.loadRequests = function(){

        $scope.requestScrollable = false;
        if(typeof $scope.requests != 'undefined'){
            if($scope.requests.length > $scope.requestsLimit){
                $scope.requestsLimit += 5;
            }else{
                $scope.allRequestsLoaded = true;
            }
        }

        $timeout(function(){
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.requestScrollable = true;
        }, 3000);
    };

    $scope.loadSearches = function(){

        $scope.searchScrollable = false;
        if(typeof $scope.searchAllCollection != 'undefined'){
            if($scope.searchAllCollection.length > $scope.searchLimit){
                $scope.searchLimit += 5;
            }else{
                $scope.allSearchLoaded = true;
            }
        }

        $timeout(function(){
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.searchScrollable = true;
        }, 3000);
    };

    //change scroll height on change orientation
    $scope.$watch(function(){
        return $window.innerHeight;
    }, function(value) {
        $scope.deviceHeight = $window.innerHeight - 96;
    });

    $scope.init = function(){
        //fetch connections and requests
        $scope.connections = ConnectionsService.getConnections();
        $scope.requests = ConnectionsService.getRequests();

        $scope.connections.$loaded(function(){
            if($scope.connections.length < 1){ $scope.connectionListSpinner = false; }
            $scope.evaluateBadges();
            $scope.constructConnections();

            if($scope.activeSlide == 0){
                //change badge count when user seen the notifications
                $timeout(function(){ $scope.resetConnectionsBadge(); }, 2000);
            }
        });


        $scope.connections.$watch(function(event){
            $scope.evaluateBadges();
            $scope.constructConnections();

            if($scope.activeSlide == 0){
                //change badge count when user seen the notifications
                $timeout(function(){ $scope.resetConnectionsBadge(); }, 2000);
            }
        });

        $scope.requests.$loaded(function(){
            if($scope.requests.length < 1){ $scope.requestListSpinner = false; }
            $scope.evaluateBadges();
            $scope.constructRequests();
        });

        $scope.requests.$watch(function(event){
            if($scope.requests.length < 1){ $scope.requestListSpinner = false; }
            $scope.evaluateBadges();
            $scope.constructRequests();
        });
    };

    $scope.changeSection = function(index){
        $ionicTabsDelegate.select(index);
        $scope.activeSlide = index;

        switch(index){
            case 0:
                $timeout(function(){ $scope.resetConnectionsBadge(); }, 2000);
                break;
            case 1:
                $timeout(function(){ $scope.resetRequestsBadge(); }, 2000);
                break;

        }
    };

    $scope.resetConnectionsBadge = function(){
        if($scope.connections.length > 0){
            $scope.connections.forEach(function(connection){
                if(connection.$value == false) {
                    //reset the value of data if the user already seen the new connection
                    var connectionRef = $firebaseObject(ProfileService.getProfileRef().child('connections').child(connection.$id));
                    connectionRef.$value = true;
                    connectionRef.$save();
                }
            });
        }
    };

    $scope.resetRequestsBadge = function(){
        if($scope.requests.length > 0){
            $scope.requests.forEach(function(request){
                if(request.$value == false) {
                    //reset the value of data if the user already seen the new request
                    var requestRef = $firebaseObject(ProfileService.getProfileRef().child('requests').child(request.$id));
                    requestRef.$value = true;
                    requestRef.$save();
                }
            });
        }
    };

    $scope.evaluateBadges = function(){
        var requestCtr = 0;
        var connectionCtr = 0;

        if($scope.requests.length > 0){
            $scope.requests.forEach(function(request){
                if(request.$value == false) { requestCtr++; }
            });
        }

        if($scope.connections.length > 0){
            $scope.connections.forEach(function(connection){
                if(connection.$value == false) { connectionCtr++; }
            });
        }

        if(requestCtr > 0){
            if(requestCtr > 99){
                $scope.requestBadgeCount = "99+";
            }else{
                $scope.requestBadgeCount = requestCtr;
            }
        }else{
            $scope.requestBadgeCount = "";
        }

        if(connectionCtr > 0){
            if(connectionCtr > 99){
                $scope.connectionBadgeCount = "99+";
            }else{
                $scope.connectionBadgeCount = connectionCtr;
            }
        }else{
            $scope.connectionBadgeCount = "";
        }
    };

    $scope.constructConnections = function(){
        $scope.connections.forEach(function(value){
            //fetch data by uid on user accounts data set
            firebaseRef.child('user_accounts').child(value.$id).on("value", function(snapshot){
                //fetch pictures by uid on pictures data set
                firebaseRef.child('pictures').child(value.$id).child('picture').on("value", function(pictureSnap){
                    $scope.$evalAsync(function(){
                        value.firstName = snapshot.val().firstName;
                        value.lastName = snapshot.val().lastName;
                        value.email = snapshot.val().email;
                        value.company = snapshot.val().company;
                        value.position = snapshot.val().position;
                        value.positionPrivate = snapshot.val().positionPrivate;
                        value.picture = pictureSnap.val();

                        $scope.connectionListSpinner = false;
                    });
                }, function(err){
                    console.log(err);
                });
            }, function(err){
                console.log(err);
            });
        });
    };

    $scope.constructRequests = function(){
        $scope.requests.forEach(function(value){
            //fetch data by uid on user accounts data set
            firebaseRef.child('user_accounts').child(value.$id).on("value", function(snapshot){
                //fetch pictures by uid on pictures data set
                firebaseRef.child('pictures').child(value.$id).child('picture').on("value", function(pictureSnap){
                    $scope.$evalAsync(function(){
                        value.firstName = snapshot.val().firstName;
                        value.lastName = snapshot.val().lastName;
                        value.email = snapshot.val().email;
                        value.company = snapshot.val().company;
                        value.position = snapshot.val().position;
                        value.positionPrivate = snapshot.val().positionPrivate;
                        value.picture = pictureSnap.val();

                        $scope.requestListSpinner = false;
                    });
                }, function(err){
                    console.log(err);
                });
            }, function(err){
                console.log(err);
            });
        });
    };

    $scope.connectionSearch = function (row) {
        //show on list if conditions met
        if(row.hasOwnProperty('firstName')){
            return (
            angular.lowercase(row.firstName).indexOf($scope.connectionKeyword || '') !== -1 ||
            angular.lowercase(row.lastName).indexOf($scope.connectionKeyword || '') !== -1 ||
            angular.lowercase(row.email).indexOf($scope.connectionKeyword || '') !== -1 ||
            angular.lowercase(row.company).indexOf($scope.connectionKeyword || '') !== -1 ||
            angular.lowercase(row.position).indexOf($scope.connectionKeyword || '') !== -1
            );
        }
    };

    $scope.requestSearch = function (row) {
        //show on list if conditions met
        if(row.hasOwnProperty('firstName')){
            return (
            angular.lowercase(row.firstName).indexOf($scope.requestKeyword || '') !== -1 ||
            angular.lowercase(row.lastName).indexOf($scope.requestKeyword || '') !== -1 ||
            angular.lowercase(row.email).indexOf($scope.requestKeyword || '') !== -1 ||
            angular.lowercase(row.company).indexOf($scope.requestKeyword || '') !== -1 ||
            angular.lowercase(row.position).indexOf($scope.requestKeyword || '') !== -1
            );
        }
    };

    $scope.setConnectionKeyword = function(keyword){
        $scope.connectionKeyword = keyword;
    };

    $scope.setRequestKeyword = function(keyword){
        $scope.requestKeyword = keyword;
    };

    $scope.openProfileModal = function(uid){
        //fetch data of the user on modal open
        ProfileService.setOtherProfileRef(uid);
        $scope.openModal();
    };

    $ionicModal.fromTemplateUrl('templates/profile-modal.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
})

.controller('ConnectionsSearch', function($scope, ProfileService){

    $scope.searchAllCollection = {};
    $scope.searchConnectionSpinner = false;
    $scope.uid = ProfileService.getAuth().uid;

    $scope.searchAll = function(string){

        if(string != ""){

            $scope.searchAllCollection = {};

            if(!$scope.searchConnectionSpinner){ $scope.searchConnectionSpinner = true; }

            //split keywords
            var keywords = string.split(" ");

            keywords.forEach(function(value){

                //fetch by first name depending on keywords
                firebaseRef.child('user_accounts')
                    .orderByChild("firstName")
                    .startAt(value).endAt(value + "~").on("value", function(snapshot){

                        snapshot.forEach(function(data){
                            //uid of the searched user
                            var  key = data.key();
                            var details = data.val();

                            if(!details.isSearchable){
                                if(!$scope.searchAllCollection.hasOwnProperty(key) && key != $scope.uid){
                                    //fetch pictures
                                    firebaseRef.child('pictures').child(key).child('picture').on("value", function(pictureSnap){
                                        $scope.$evalAsync(function(){
                                            $scope.searchAllCollection[key] = details;
                                            $scope.hideSearchSpinner();
                                            if($scope.searchAllCollection.hasOwnProperty(key)){
                                                $scope.searchAllCollection[key].picture = pictureSnap.val();
                                            }
                                        });
                                    }, function(err){
                                        console.log(err);
                                    });
                                }
                            }
                        });
                    }, function(err){
                        console.log(err);
                    });

                //fetch by last name depending on keywords
                firebaseRef.child('user_accounts')
                    .orderByChild("lastName")
                    .startAt(value).endAt(value + "~").on("value", function(snapshot){

                        snapshot.forEach(function(data){
                            //uid of the searched user
                            var  key = data.key();
                            var details = data.val();

                            if(!details.isSearchable){
                                if(!$scope.searchAllCollection.hasOwnProperty(key) && key != $scope.uid){
                                    //fetch pictures
                                    firebaseRef.child('pictures').child(key).child('picture').on("value", function(pictureSnap){
                                        $scope.$evalAsync(function(){
                                            $scope.searchAllCollection[key] = details;
                                            $scope.hideSearchSpinner();
                                            if($scope.searchAllCollection.hasOwnProperty(key)){
                                                $scope.searchAllCollection[key].picture = pictureSnap.val();
                                            }
                                        });
                                    }, function(err){
                                        console.log(err);
                                    });
                                }
                            }
                        });
                    }, function(err){
                        console.log(err);
                    });

                //fetch by email depending on keywords
                firebaseRef.child('user_accounts')
                    .orderByChild("email")
                    .startAt(value).endAt(value + "~").on("value", function(snapshot){

                        snapshot.forEach(function(data){
                            //uid of the searched user
                            var  key = data.key();
                            var details = data.val();

                            if(!details.isSearchable){
                                if(!$scope.searchAllCollection.hasOwnProperty(key) && key != $scope.uid){
                                    //fetch pictures
                                    firebaseRef.child('pictures').child(key).child('picture').on("value", function(pictureSnap){
                                        $scope.$evalAsync(function(){
                                            $scope.searchAllCollection[key] = details;
                                            $scope.hideSearchSpinner();
                                            if($scope.searchAllCollection.hasOwnProperty(key)){
                                                $scope.searchAllCollection[key].picture = pictureSnap.val();
                                            }
                                        });
                                    }, function(err){
                                        console.log(err);
                                    });
                                }
                            }
                        });
                    }, function(err){
                        console.log(err);
                    });

                //fetch by first name (lowercase indexed) depending on keywords
                firebaseRef.child('user_accounts')
                    .orderByChild("iFirstName")
                    .startAt(value).endAt(value + "~").on("value", function(snapshot){

                        snapshot.forEach(function(data){
                            //uid of the searched user
                            var  key = data.key();
                            var details = data.val();

                            if(!details.isSearchable){
                                if(!$scope.searchAllCollection.hasOwnProperty(key) && key != $scope.uid){
                                    //fetch pictures
                                    firebaseRef.child('pictures').child(key).child('picture').on("value", function(pictureSnap){
                                        $scope.$evalAsync(function(){
                                            $scope.searchAllCollection[key] = details;
                                            $scope.hideSearchSpinner();
                                            if($scope.searchAllCollection.hasOwnProperty(key)){
                                                $scope.searchAllCollection[key].picture = pictureSnap.val();
                                            }
                                        });
                                    }, function(err){
                                        console.log(err);
                                    });
                                }
                            }
                        });
                    }, function(err){
                        console.log(err);
                    });

                //fetch by last name (lowercase indexed) depending on keywords
                firebaseRef.child('user_accounts')
                    .orderByChild("iLastName")
                    .startAt(value).endAt(value + "~").on("value", function(snapshot){

                        snapshot.forEach(function(data){
                            //uid of the searched user
                            var  key = data.key();
                            var details = data.val();

                            if(!details.isSearchable){
                                if(!$scope.searchAllCollection.hasOwnProperty(key) && key != $scope.uid){
                                    //fetch pictures
                                    firebaseRef.child('pictures').child(key).child('picture').on("value", function(pictureSnap){
                                        $scope.$evalAsync(function(){
                                            $scope.searchAllCollection[key] = details;
                                            $scope.hideSearchSpinner();
                                            if($scope.searchAllCollection.hasOwnProperty(key)){
                                                $scope.searchAllCollection[key].picture = pictureSnap.val();
                                            }
                                        });
                                    }, function(err){
                                        console.log(err);
                                    });
                                }
                            }
                        });
                    }, function(err){
                        console.log(err);
                    });
            });
        }else{
            $scope.searchAllCollection = {};
            $scope.hideSearchSpinner();
        }
    };

    $scope.hideSearchSpinner = function(){
        $scope.searchConnectionSpinner = false;
    };

    $scope.showSearchSpinner = function(){
        $scope.searchConnectionSpinner = true;
    };
});