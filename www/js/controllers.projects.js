angular.module('projectmanager.controllers')

.controller('Projects', function($scope, $window, $timeout, $interval, $ionicModal, $ionicPopover, $ionicPopup, ProfileService, ProjectsService, $firebaseArray, $firebaseObject, $ionicScrollDelegate){

    //spinners
    $scope.projectsListSpinner = true;
    $scope.milestonesListSpinner = true;
    $scope.membersListSpinner = true;
    $scope.timeLogsListSpinner = true;
    $scope.projectLogsListSpinner = true;

    $scope.taskListSpinner = true;
    $scope.discussionListSpinner = true;
    $scope.milestoneLogsSpinner = true;

    //infinite scrolls checker
    $scope.allMilesoneLogsLoaded = false;
    $scope.allMilesoneDiscussionsLoaded = false;
    $scope.allProjectTimeLogsLoaded = false;
    $scope.allProjectLogsLoaded = false;

    $scope.projectTimeLogsScrollable = true;
    $scope.projectLogsScrollable = true;

    //infinite scrolls counts
    $scope.milestoneLogsLimit = 10;
    $scope.milestoneDiscussionsLimit = 10;
    $scope.projectTimeLogsLimit = 10;
    $scope.projectLogsLimit = 10;

    $scope.currentTime = new Date().getTime();
    //array of projects
    $scope.projects = [];

    //projects board search keyword
    $scope.pSearch = {
        keyword : ""
    };

    //selected project member search
    $scope.mSearch = {
        keyword : ""
    };

    $scope.ctx = null;
    $scope.chart = null;
    $scope.chartData = [];

    $scope.projectDetails = {
        projectName : "",
        allottedHours : "",
        startDate : new Date(),
        endDate : new Date(),
        colorLabel : '#4CAF50'
    };

    $scope.milestoneDetails = {
        title : "",
        colorLabel : '#4CAF50',
        dateCreated : new Date().getTime()
    };

    $scope.milestonePostDetails = {
        title : "",
        description : "",
        dateCreated : new Date().getTime()
    };

    //field checkers
    $scope.projectNameChecker = false;
    $scope.allottedHoursChecker = false;
    $scope.endDateChecker = false;

    $scope.milestoneTitleChecker = false;

    $scope.currentProjectKey = 0;
    $scope.currentMilestoneKey = 0;

    //select project info
    $scope.projectInfo = {};

    $scope.userProfile = {};
    $scope.tabIndex = 0;
    $scope.milestoneTab = 0;

    $scope.editPost = false;
    $scope.editComment = false;
    $scope.postTitle = "";
    $scope.postDescription = "";
    $scope.commentEditDetails = {};

    $scope.commentsReady = false;

    $scope.postComment = {
        comment : ""
    };

    $scope.timeLogDetails = {};
    $scope.colorPickerList = [
        {value : "#F44336"}, {value : "#E91E63"}, {value : "#9C27B0"}, {value : "#673AB7"}, {value : "#3F51B5"},
        {value : "#2196F3"}, {value : "#03A9F4"}, {value : "#00BCD4"}, {value : "#009688"}, {value : "#4CAF50"},
        {value : "#8BC34A"}, {value : "#CDDC39"}, {value : "#FFEB3B"}, {value : "#FFC107"}, {value : "#FF9800"},
        {value : "#FF5722"}, {value : "#795548"}, {value : "#9E9E9E"}, {value : "#607D8B"}
    ];

    $scope.deviceHeight = $window.innerHeight - 132;
    $scope.deviceWidth = $window.innerWidth;

    $scope.clientUid =  ProfileService.getAuth().uid;

    $scope.taskDetails = {
        title : "",
        value: false,
        date : new Date().getTime()
    };

    $scope.commentDetails = {
        comment : "",
        value: false,
        date : new Date().getTime()
    };

    $scope.$watch(function(){
        return $window.innerHeight;
    }, function(value) {
        $scope.deviceHeight = $window.innerHeight - 132;
        $scope.deviceWidth = $window.innerWidth;
    });

    $interval(function(){
        if(typeof $scope.projectInfo.$id != "undefined"){
            if(typeof $scope.projectInfo.details.seen[$scope.clientUid] == 'undefined'){
                var seenRef = $firebaseObject(firebaseRef.child('projects').child($scope.projectInfo.$id).child('seen').child($scope.clientUid));

                seenRef.$loaded(function(){
                    seenRef.$value = true;
                    seenRef.$save();
                });
            }
        }
    }, 2000);

    $scope.isSeen = function(projectKey){
        var seen = false;
        if(typeof $scope.projects[projectKey].details != 'undefined'){
            if(typeof $scope.projects[projectKey].details.seen != 'undefined' && typeof $scope.projects[projectKey].details.seen[$scope.clientUid] != 'undefined'){
                seen = true;
            }

            return seen;
        }
    };

    $scope.loadMilestoneLogs = function(){

        if(typeof $scope.projectInfo['milestone_logs'] != 'undefined'){
            if(typeof $scope.projectInfo['milestone_logs'][$scope.milestoneDetails.$id] != 'undefined'){
                if($scope.projectInfo['milestone_logs'][$scope.milestoneDetails.$id].length > $scope.milestoneLogsLimit){
                    $scope.milestoneLogsLimit += 5;
                }else{
                    $scope.allMilesoneLogsLoaded = true;
                }
            }
        }

        $timeout(function(){
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }, 3000);
    };

    $scope.loadMilestoneDiscussions = function(){

        if(typeof $scope.projectInfo['milestone_discussions'] != 'undefined'){
            if(typeof $scope.projectInfo['milestone_discussions'][$scope.milestoneDetails.$id] != 'undefined'){
                if($scope.projectInfo['milestone_discussions'][$scope.milestoneDetails.$id].length > $scope.milestoneDiscussionsLimit){
                    $scope.milestoneDiscussionsLimit += 5;
                }else{
                    $scope.allMilesoneDiscussionsLoaded = true;
                }
            }
        }

        $timeout(function(){
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }, 3000);
    };

    $scope.loadProjectTimeLogs = function(){

        $scope.projectTimeLogsScrollable = false;
        if(typeof $scope.projectInfo['time_logs'] != 'undefined'){
            if($scope.projectInfo['time_logs'].length > $scope.projectTimeLogsLimit){
                $scope.projectTimeLogsLimit += 5;
            }else{
                $scope.allProjectTimeLogsLoaded = true;
            }
        }

        $timeout(function(){
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.projectTimeLogsScrollable = true;
        }, 3000);
    };

    $scope.loadProjectLogs = function(){

        $scope.projectLogsScrollable = false;
        if(typeof $scope.projectInfo['project_logs'] != 'undefined'){
            if($scope.projectInfo['project_logs'].length > $scope.projectLogsLimit){
                $scope.projectLogsLimit += 5;
            }else{
                $scope.allProjectLogsLoaded = true;
            }
        }

        $timeout(function(){
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.projectLogsScrollable = true;
        }, 3000);
    };

    $scope.changeSection = function(index, milestoneIndex){
        $scope.milestoneTab = index;
        $scope.currentMilestoneKey = milestoneIndex;

        if(index == 1 && typeof $scope.milestoneDetails.$id != 'undefined' && typeof $scope.projectInfo.milestone_discussions == 'undefined') {
            $scope.discussionListSpinner = true;
            $scope.$evalAsync(function() {
                ProjectsService.setDiscussions($scope.currentProjectKey, milestoneIndex);
            });
        }else if(index == 2 && typeof $scope.milestoneDetails.$id != 'undefined' && typeof $scope.projectInfo.milestone_logs == 'undefined'){
            $scope.milestoneLogsSpinner = true;
            $scope.$evalAsync(function() {
                ProjectsService.setLogs($scope.currentProjectKey, milestoneIndex);
            });
        }
    };

    $scope.$on('renderProjects', function(){
        //set project array on app load
        $scope.projects = ProjectsService.getProjects();
        $scope.projectsListSpinner = false;
    });

    $scope.$on('renderMembers', function(){
        $scope.$evalAsync(function(){
            $scope.membersListSpinner = false;
        })
    });

    $scope.$on('renderMilestones', function(){
        $scope.$evalAsync(function(){
            $scope.milestonesListSpinner = false;
        })
    });

    $scope.$on('renderTimeLogs', function(){
        $scope.$evalAsync(function(){
            $scope.timeLogsListSpinner = false;
        });
    });

    $scope.$on('renderTasks', function(){
        $scope.taskListSpinner = false;
    });

    $scope.$on('renderDiscussions', function(){
        $scope.$evalAsync(function(){
            $scope.discussionListSpinner = false;
        });
    });

    $scope.$on('renderComments', function(){
        $scope.$evalAsync(function(){
            $scope.commentsReady = true;
        });
    });

    $scope.$on('renderLogs', function(){
        $scope.$evalAsync(function(){
            $scope.milestoneLogsSpinner = false;
        });
    });

    $scope.$on('renderProjectLogs', function(){
        $scope.$evalAsync(function(){
            $scope.projectLogsListSpinner = false;
        });
    });

    $scope.$on('tabslideboxChanged', function(event, args){
        $scope.tabIndex = args.index;

        if($scope.tabIndex == 1 && typeof $scope.projects[$scope.currentProjectKey].milestones == 'undefined') {
            $scope.milestonesListSpinner = true;
            ProjectsService.setMilestones($scope.currentProjectKey);
        } else if($scope.tabIndex == 2 && typeof $scope.projects[$scope.currentProjectKey].members == 'undefined') {
            $scope.membersListSpinner = true;
            ProjectsService.setMembers($scope.currentProjectKey);
        } else if($scope.tabIndex == 3 && typeof $scope.projects[$scope.currentProjectKey].time_logs == 'undefined') {
            $scope.timeLogsListSpinner = true;
            ProjectsService.setTimeLogs($scope.currentProjectKey);
        } else if($scope.tabIndex == 5 && typeof $scope.projects[$scope.currentProjectKey].project_logs == 'undefined') {
            $scope.projectLogsListSpinner = true;
            ProjectsService.setProjectLogs($scope.currentProjectKey);
        }
    });

    $scope.editProject = function(){
        $scope.openModal(3);
        $scope.closePopover();

        //pass details to project edit modal (needed because data is binded)
        $scope.projectDetails = {
            id : $scope.projectInfo.details.id,
            projectName : $scope.projectInfo.details.projectName,
            allottedHours : $scope.projectInfo.details.allottedHours,
            startDate : new Date($scope.projectInfo.details.startDate),
            endDate : new Date($scope.projectInfo.details.endDate),
            colorLabel : $scope.projectInfo.details.colorLabel,
            isFinished : $scope.projectInfo.details.isFinished
        };
    };

    $scope.passOwnership = function(){
        $scope.ownerDetails = {};
        $scope.closePopover();
        $scope.openModal(11);
        if(typeof $scope.projects[$scope.currentProjectKey].members == 'undefined') {
            $scope.membersListSpinner = true;
            ProjectsService.setMembers($scope.currentProjectKey);
        }
    };

    $scope.leaveProject = function(){
        $scope.closePopover();
        var confirmPopup = $ionicPopup.confirm({
            title: 'Leave Project',
            template: 'Are you sure you want to leave this project?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                if($scope.projectInfo.details.owner == $scope.clientUid){
                    confirmPopup.close();
                    $timeout(function(){
                        var alertPopup = $ionicPopup.alert({
                            title: 'Leave Project',
                            template: 'Please pass the ownership of the project before leaving.'
                        });
                        alertPopup.then(function(res) {
                        });
                    }, 500);
                }else{

                    var projectId = $scope.projectInfo.$id;
                    var userProjectsRef = $firebaseArray(firebaseRef.child('user_accounts').child($scope.clientUid).child('projects'));
                    var projectMembersRef = $firebaseArray(firebaseRef.child('project_members').child(projectId));

                    userProjectsRef.$loaded(function(){
                        var projectRecord = userProjectsRef.$getRecord(projectId);
                        //remove project from member's project records
                        userProjectsRef.$remove(projectRecord);
                    });

                    projectMembersRef.$loaded(function(){
                        var projectRecord = projectMembersRef.$getRecord($scope.clientUid);
                        //remove member from project_members data set
                        projectMembersRef.$remove(projectRecord);
                    });

                    $scope.notifyProject(projectId, 'member_leave', null, null);
                    $scope.closeModal(2);
                }
            } else {
            }
        });
    };

    $scope.saveOwner = function(){
        if(typeof $scope.ownerDetails.uid != 'undefined'){
            var confirmPopup = $ionicPopup.confirm({
                title: 'Pass Ownership',
                template: 'Are you sure you want to pass the ownership of this project?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    if($scope.projectInfo.details.owner != $scope.clientUid){
                        var alertPopup = $ionicPopup.alert({
                            title: 'Pass Ownership',
                            template: 'You dont have permission to pass the ownership of this project.'
                        });
                        alertPopup.then(function(res) {
                        });
                    }else if($scope.projectInfo.details.owner == $scope.ownerDetails.uid){
                        var alertPopup = $ionicPopup.alert({
                            title: 'Pass Ownership',
                            template: 'The user is already the owner of the project.'
                        });
                        alertPopup.then(function(res) {
                        });
                    }else{
                        firebaseRef.child('projects').child($scope.projectInfo.$id).update({
                            owner : $scope.ownerDetails.uid
                        });

                        $scope.notifyProject($scope.projectInfo.$id, 'pass_ownership', $scope.ownerDetails.uid, '')
                        $scope.closeModal(11);
                    }
                } else {
                }
            });
        }else{
            var alertPopup = $ionicPopup.alert({
                title: 'Pass Ownership',
                template: 'Please select a user.'
            });
            alertPopup.then(function(res) {
            });
        }
    };

    //save edited project
    $scope.saveProject = function(){

        var error = 0;
        var allottedHours = parseFloat($scope.projectDetails.allottedHours);
        var startDate = $scope.projectDetails.startDate.getTime();
        var endDate = $scope.projectDetails.endDate.getTime();

        if($scope.projectDetails.projectName == ""){
            $scope.projectNameChecker = true;
            error++;
        }else{
            $scope.projectNameChecker = false;
        }

        if(allottedHours < 1 || isNaN(allottedHours)){
            $scope.allottedHoursChecker = true;
            error++;
        }else{
            $scope.allottedHoursChecker = false;
        }

        if(endDate <= startDate){
            $scope.endDateChecker = true;
            error++;
        }else{
            $scope.endDateChecker = false;
        }

        if(error == 0){
            firebaseRef.child('projects').child($scope.projectInfo.$id).update({
                projectName : $scope.projectDetails.projectName,
                allottedHours : allottedHours.toFixed(2),
                startDate : startDate,
                endDate : endDate,
                colorLabel : $scope.projectDetails.colorLabel,
                isFinished : $scope.projectDetails.isFinished,
                dateModified : new Date().getTime()
            }, function(data){

                $scope.notifyProject($scope.projectInfo.$id, 'edit_project', null, null);

                $scope.resetCheckers();
                $scope.resetProjectDetails();
                $scope.closeModal(3);
            });
        }
    };

    //initialized projects on app load
    $scope.initializeProjects = function(){
        if(typeof $scope.projects.length != 'undefined' && $scope.projects.length == 0){
            ProjectsService.setProjects();
        }
    };

    $scope.createNewProject = function(){
        $scope.openModal(1);
    };

    //select current project
    $scope.openProject = function(project, key){
        $timeout(function(){
            $scope.openModal(2);
            //pass the selected project data
            $scope.projectInfo = project;
            $scope.currentProjectKey = key;
            $scope.initChart();
        }, 300);
    };

    $scope.initChart = function(){

        if($scope.ctx == null){
            var contributions = $firebaseArray(firebaseRef.child('projects').child($scope.projectInfo.$id).child('contributions'));

            contributions.$loaded(function(){
                $timeout(function(){
                    $scope.constructChartData(contributions);
                    $scope.constructChart();
                }, 800);
            });

            contributions.$watch(function(){
                $timeout(function(){
                    $scope.constructChartData(contributions);
                    $scope.constructChart();
                }, 800);
            });
        }
    };

    $scope.constructChartData = function(data){

        if(data.length > 0){
            //has contributions
            $scope.chartData = [];

            var allottedHours = parseFloat($scope.projectInfo.details.allottedHours);
            var usedHours = parseFloat($scope.projectInfo.details.usedHours);
            var remainingHours = allottedHours - usedHours;

            $scope.percentage = parseInt((usedHours/allottedHours)*100);
            data.forEach(function(contribution, key){
                var name = $scope.projectInfo.involved_users[contribution.$id].details.firstName + " " + $scope.projectInfo.involved_users[contribution.$id].details.lastName;
                var index = 0;

                if(key % 2 == 0){ index = key; }
                else{ index = 18-key; }

                if(index < 0 || index > 18){
                    index = Math.floor(Math.random() * (18 - 0 + 1)) * -1;
                }

                $scope.chartData.push({
                    value: contribution.$value,
                    color: $scope.colorPickerList[index].value,
                    highlight: $scope.colorPickerList[index].value,
                    label: name
                });
            });

            if(remainingHours > 0){
                //add unsused hours on data
                $scope.chartData.push({
                    value: remainingHours,
                    color:"#DCDCDC",
                    highlight: "#DCDCDC",
                    label: "Remaining Hours"
                });
            }
        }else{
            //has no contributions, just put the hours in the data
            $scope.percentage = 0;
            $scope.chartData = [{
                value: $scope.projectInfo.details.allottedHours,
                color:"#DCDCDC",
                highlight: "#DCDCDC",
                label: "Remaining Hours"
            }];
        }
    };

    $scope.constructChart = function(){

        if($scope.ctx == null){
            $scope.ctx = document.getElementById("doughnut").getContext("2d");
            $scope.chart = new Chart($scope.ctx);

            $scope.chart.Doughnut($scope.chartData, {
            });
        }else{
            $scope.chart.Doughnut($scope.chartData, {
                animation: false
            });
        }
    };

    $scope.openProfile = function(uid){
        if(uid != $scope.clientUid){
            $scope.openModal(4);
            ProfileService.setOtherProfileRef(uid);
        }
    };

    $scope.addPostComment = function(){

        var projectId = $scope.projectInfo.$id;
        var milestoneId = $scope.milestoneDetails.$id;
        var milestonePostId = $scope.milestonePostDetails.$id;

        if(typeof $scope.postComment.comment != 'undefined' && $scope.postComment.comment != ""){

            var message = " commented on ";
            var discussionRef = firebaseRef.child('milestone_discussions').child(projectId).child(milestoneId).child(milestonePostId);

            var discussionCommentRef = $firebaseArray(firebaseRef.child('discussion_comments').child(projectId).child(milestoneId).child(milestonePostId));
            var comment = {
                comment : $scope.postComment.comment,
                dateCreated : new Date().getTime(),
                dateModified : new Date().getTime(),
                poster : $scope.clientUid
            };

            discussionRef.update({
                dateModified : new Date().getTime()
            });

            discussionCommentRef.$add(comment);
            $scope.postComment.comment = "";

            $scope.notifyMilestone(projectId, milestoneId, milestonePostId, $scope.clientUid, $scope.milestonePostDetails.user, 'add_comment', message);
        }
    };

    $scope.editMilestoneTitle = function(){

        $scope.closePopover();
        var origTitle = $scope.milestoneDetails.title;

        var editMilestonePopup = $ionicPopup.show({
            templateUrl: "templates/popup-add-milestone.html",
            title: 'Add Milestone',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: 'OK',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.milestoneDetails.title) {
                            e.preventDefault();
                        } else {
                            return $scope.milestoneDetails.title;
                        }
                    }
                }
            ]
        });

        editMilestonePopup.then(function(res){
            if(res){
                var projectId =  $scope.projectInfo.$id;
                var milestoneRef = firebaseRef.child('project_milestones')
                    .child(projectId).child($scope.milestoneDetails.$id);

                milestoneRef.update({
                    title : ucwords($scope.milestoneDetails.title)
                });

                var message = " changed the title from " + origTitle + " to " + $scope.milestoneDetails.title + ".";
                $scope.notifyProject(projectId, 'edit_milestone', $scope.milestoneDetails.$id, message);
            }else{
                $scope.milestoneDetails.title = origTitle;
            }
        });
    };

    $scope.editTaskTitle = function($event, index, task){

        $scope.taskDetails = task;
        $scope.openPopover($event, index);
    };

    $scope.openTaskTitlePopup = function(){

        $scope.closePopover();
        var origTitle = $scope.taskDetails.title;
        var editTaskPopup = $ionicPopup.show({
            templateUrl: "templates/popup-edit-task.html",
            title: 'Edit Task',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: 'OK',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.taskDetails.title) {
                            e.preventDefault();
                        } else {
                            return $scope.taskDetails.title;
                        }
                    }
                }
            ]
        });

        editTaskPopup.then(function(res){
            if(res){
                if(res != origTitle) {
                    var projectId = $scope.projectInfo.$id;
                    var milestoneId = $scope.milestoneDetails.$id;
                    var taskId = $scope.taskDetails.$id;
                    var milestoneTaskRef = firebaseRef.child('milestone_tasks').child(projectId).child(milestoneId).child(taskId);

                    milestoneTaskRef.update({
                        title : $scope.taskDetails.title
                    })

                    var message = " edited " + origTitle + " to " + $scope.taskDetails.title + ".";

                    $scope.notifyMilestone(projectId, milestoneId, null, null, null, 'edit_task', message);


                    $scope.taskDetails = {
                        title : "",
                        value: false,
                        date : new Date().getTime()
                    };
                }else{
                    $scope.taskDetails = {
                        title : "",
                        value: false,
                        date : new Date().getTime()
                    };
                }
            }else{
                $scope.taskDetails.title = origTitle;

                $scope.taskDetails = {
                    title : "",
                    value: false,
                    date : new Date().getTime()
                };
            }
        });
    };

    $scope.deleteTask = function(){

        $scope.closePopover();
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Task',
            template: 'Are you sure you want to delete ' + $scope.taskDetails.title + '?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                var projectId = $scope.projectInfo.$id;
                var milestoneId = $scope.milestoneDetails.$id;
                var taskId = $scope.taskDetails.$id;

                var milestoneTasksRef = $firebaseArray(firebaseRef.child('milestone_tasks').child(projectId).child(milestoneId));

                milestoneTasksRef.$loaded(function(){
                    var taskRecord = milestoneTasksRef.$getRecord(taskId);

                    var message = " deleted " + taskRecord.title + ".";

                    milestoneTasksRef.$remove(taskRecord);

                    $scope.notifyMilestone(projectId, milestoneId, null, null, null, 'delete_task', message);
                });
            } else {
            }
        });
    };

    $scope.openMilestoneColorPicker = function(){

        $scope.closePopover();
        var origColor = $scope.milestoneDetails.colorLabel;

        var colorPickerPopup = $ionicPopup.show({
            templateUrl: 'templates/milestone-color-picker-popup.html',
            title: 'Pick a color',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: 'OK',
                    type: 'button-positive',
                    onTap: function(e) {
                        return $scope.milestoneDetails.colorLabel;
                    }
                }
            ]
        });

        colorPickerPopup.then(function(res){
            if(res != origColor){
                var projectId =  $scope.projectInfo.$id;
                var milestoneRef = firebaseRef.child('project_milestones')
                    .child(projectId).child($scope.milestoneDetails.$id);

                milestoneRef.update({
                    colorLabel : $scope.milestoneDetails.colorLabel
                });

                var message = " changed the color of " + $scope.milestoneDetails.title + ".";
                $scope.notifyProject(projectId, 'edit_milestone', $scope.milestoneDetails.$id, message);
            }else{
                $scope.milestoneDetails.colorLabel = origColor;
            }
        });
    };

    $scope.openAddMilestone = function(){
        $scope.milestoneDetails.colorLabel = $scope.projectInfo.details.colorLabel;


        var addMilestonePopup = $ionicPopup.show({
            templateUrl: "templates/popup-add-milestone.html",
            title: 'Add Milestone',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: 'OK',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.milestoneDetails.title) {
                            e.preventDefault();
                        } else {
                            return $scope.milestoneDetails.title;
                        }
                    }
                }
            ]
        });

        addMilestonePopup.then(function(res){
            if(res){
                var projectId = $scope.projectInfo.$id;
                var projectMilestonesRef = $firebaseArray(firebaseRef.child('project_milestones').child(projectId));
                $scope.milestoneDetails.dateCreated = new Date().getTime();

                projectMilestonesRef.$add($scope.milestoneDetails);

                var message = " created milestone " + $scope.milestoneDetails.title + ".";
                $scope.notifyProject(projectId, 'create_milestone', null, message);

                $scope.milestoneDetails = {
                    title : "",
                    colorLabel : '#4CAF50',
                    dateCreated : new Date().getTime()
                };
            }else{
                $scope.milestoneDetails = {
                    title : "",
                    colorLabel : '#4CAF50',
                    dateCreated : new Date().getTime()
                };
            }
        });
    };

    $scope.openAddTask = function(){

        $scope.closePopover();
        var addTaskPopup = $ionicPopup.show({
            templateUrl: "templates/popup-edit-task.html",
            title: 'Add Task',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: 'OK',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.taskDetails.title) {
                            e.preventDefault();
                        } else {
                            return $scope.taskDetails.title;
                        }
                    }
                }
            ]
        });

        addTaskPopup.then(function(res){
            if(res){
                var projectId = $scope.projectInfo.$id;
                var milestoneId = $scope.milestoneDetails.$id;
                var milestoneTaskRef = $firebaseArray(firebaseRef.child('milestone_tasks').child(projectId).child(milestoneId));
                var message = " added " + $scope.taskDetails.title + " to milestone tasks."

                $scope.taskDetails.date = new Date().getTime();
                milestoneTaskRef.$add($scope.taskDetails);


                $scope.notifyMilestone(projectId, milestoneId, null, null, null, 'add_task', message);

                $scope.taskDetails = {
                    title : "",
                    value: false,
                    date : new Date().getTime()
                };
            }
        });
    };

    $scope.editTaskValue = function(value, task){
        var projectId = $scope.projectInfo.$id;
        var milestoneId = $scope.milestoneDetails.$id;
        var taskId = task.$id;
        var taskRef = firebaseRef.child('milestone_tasks').child(projectId).child(milestoneId).child(taskId);
        var message = "";

        if(value){
            message = " completed " + task.title + "."
        }else{
            message = " unchecked " + task.title + "."
        }

        taskRef.update({
            value : value
        });


        $scope.taskDetails = {
            title : "",
            value: false,
            date : new Date().getTime()
        };

        $scope.notifyMilestone(projectId, milestoneId, null, null, null, 'check_task', message);
    };

    $scope.deleteProject = function(){

        $scope.closePopover();

        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Milestone',
            template: 'Are you sure you want to delete ' + $scope.projectInfo.details.projectName + '?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                if($scope.projectInfo.details.owner != $scope.clientUid){
                    confirmPopup.close();
                    $timeout(function(){
                        var alertPopup = $ionicPopup.alert({
                            title: 'Delete Project',
                            template: 'You dont have permission to delete this project.'
                        });
                        alertPopup.then(function(res) {
                        });
                    }, 500);
                }else if($scope.projectInfo.details.owner == $scope.clientUid){
                    var projectId = $scope.projectInfo.$id;

                    var discussionCommentsRef = $firebaseArray(firebaseRef.child('discussion_comments'));
                    var milestoneDiscussionsRef = $firebaseArray(firebaseRef.child('milestone_discussions'));
                    var milestoneLogsRef = $firebaseArray(firebaseRef.child('milestone_logs'));
                    var milestoneTasksRef = $firebaseArray(firebaseRef.child('milestone_tasks'));
                    var projectBudgetRef = $firebaseArray(firebaseRef.child('project_budget'));
                    var projectLogsRef = $firebaseArray(firebaseRef.child('project_logs'));
                    var projectMilestonesRef = $firebaseArray(firebaseRef.child('project_milestones'));
                    var projectMembersRef = $firebaseArray(firebaseRef.child('project_members'));
                    var memberList = $firebaseArray(firebaseRef.child('project_members').child(projectId));
                    var projectsRef = $firebaseArray(firebaseRef.child('projects'));

                    //delete discussion comments
                    discussionCommentsRef.$loaded(function(){
                        var discussionComments = discussionCommentsRef.$getRecord(projectId);
                        if(discussionComments != null){ discussionCommentsRef.$remove(discussionComments); }
                    });

                    //delete milestone discussions
                    milestoneDiscussionsRef.$loaded(function(){
                        var milestoneDiscussions = milestoneDiscussionsRef.$getRecord(projectId);
                        if(milestoneDiscussions != null){ milestoneDiscussionsRef.$remove(milestoneDiscussions); }
                    });

                    //delete milestone logs
                    milestoneLogsRef.$loaded(function(){
                        var milestoneLogs = milestoneLogsRef.$getRecord(projectId);
                        if(milestoneLogs != null){ milestoneLogsRef.$remove(milestoneLogs); }
                    });

                    //delete milestone tasks
                    milestoneTasksRef.$loaded(function(){
                        var milestoneTasks = milestoneTasksRef.$getRecord(projectId);
                        if(milestoneTasks != null){ milestoneTasksRef.$remove(milestoneTasks); }
                    });

                    //delete project budget
                    projectBudgetRef.$loaded(function(){
                        var projectBudget = projectBudgetRef.$getRecord(projectId);
                        if(projectBudget != null){ projectBudgetRef.$remove(projectBudget); }
                    });

                    //delete project logs
                    projectLogsRef.$loaded(function(){
                        var projectLogs = projectLogsRef.$getRecord(projectId);
                        if(projectLogs != null){ projectLogsRef.$remove(projectLogs); }
                    });

                    //delete project milestones
                    projectMilestonesRef.$loaded(function(){
                        var projectMilestones = projectMilestonesRef.$getRecord(projectId);
                        if(projectMilestones != null){ projectMilestonesRef.$remove(projectMilestones); }
                    });

                    //delete project in member profile
                    memberList.$loaded(function(){
                        memberList.forEach(function(member){
                            var userProjectsRef = $firebaseArray(firebaseRef.child('user_accounts').child(member.$id).child('projects'));

                            userProjectsRef.$loaded(function(){
                                var projectRecord = userProjectsRef.$getRecord(projectId);
                                //remove project from member's project records
                                userProjectsRef.$remove(projectRecord);
                            });
                        });
                    });

                    //delete project members
                    projectMembersRef.$loaded(function(){
                        var projectMembers = projectMembersRef.$getRecord(projectId);
                        if(projectMembers != null){ projectMembersRef.$remove(projectMembers); }
                    });

                    //delete project
                    projectsRef.$loaded(function(){
                        var projectData = projectsRef.$getRecord(projectId);
                        if(projectData != null){ projectsRef.$remove(projectData); }
                    });

                    $scope.closeModal(2);
                }
            } else {
            }
        });
    };

    $scope.deleteMilestone = function(){

        $scope.closePopover();

        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Milestone',
            template: 'Are you sure you want to delete ' + $scope.milestoneDetails.title + '?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                var projectId = $scope.projectInfo.$id;
                var projectMilestonesRef = $firebaseArray(firebaseRef.child('project_milestones').child(projectId));

                projectMilestonesRef.$loaded(function(){
                    var milestoneRecord = projectMilestonesRef.$getRecord($scope.milestoneDetails.$id);
                    var discussionCommentsRef = $firebaseArray(firebaseRef.child('discussion_comments').child(projectId));
                    var milestoneDiscussionsRef = $firebaseArray(firebaseRef.child('milestone_discussions').child(projectId));
                    var milestoneTasksRef = $firebaseArray(firebaseRef.child('milestone_tasks').child(projectId));
                    var milestoneLogsRef = $firebaseArray(firebaseRef.child('milestone_logs').child(projectId));

                    var message = " deleted milestone " + milestoneRecord.title + ".";

                    //remove discussion comments
                    discussionCommentsRef.$loaded(function(){
                        var discussionCommentsRecord = discussionCommentsRef.$getRecord($scope.milestoneDetails.$id);

                        console.log(discussionCommentsRecord);
                        if(discussionCommentsRecord != null){ discussionCommentsRecord.$remove(discussionCommentsRecord); }
                    });

                    //remove discussions
                    milestoneDiscussionsRef.$loaded(function(){
                        var milestoneDiscussionsRecord = milestoneDiscussionsRef.$getRecord($scope.milestoneDetails.$id);

                        if(milestoneDiscussionsRecord != null){ milestoneDiscussionsRef.$remove(milestoneDiscussionsRecord); }
                    });

                    //remove tasks
                    milestoneTasksRef.$loaded(function(){
                        var milestoneTasksRecord = milestoneTasksRef.$getRecord($scope.milestoneDetails.$id);

                        if(milestoneTasksRecord != null){ milestoneTasksRef.$remove(milestoneTasksRecord); }
                    });

                    //remove logs
                    milestoneLogsRef.$loaded(function(){
                        var milestoneLogsRecord = milestoneLogsRef.$getRecord($scope.milestoneDetails.$id);

                        if(milestoneLogsRecord != null){ milestoneLogsRef.$remove(milestoneLogsRecord); }
                    });

                    //remove milestone
                    $timeout(function(){
                        projectMilestonesRef.$remove(milestoneRecord);
                    }, 300);

                    $scope.closeModal(5);
                    $scope.notifyProject(projectId, 'delete_milestone', null, message);
                });
            } else {
            }
        });
    };

    $scope.projectSearch = function (row) {
        if(row.hasOwnProperty('details') && typeof row.details.projectName != 'undefined'){
            return (angular.lowercase(row.details.projectName).indexOf($scope.pSearch.keyword || '') !== -1);
        }
    };

    $scope.membersSearch = function (row) {
        if(row.hasOwnProperty('details') && typeof row.details.firstName != 'undefined' && $scope.clientUid != row.details.$id){
            return (
            angular.lowercase(row.details.firstName).indexOf($scope.mSearch.keyword  || '') !== -1 ||
            angular.lowercase(row.details.lastName).indexOf($scope.mSearch.keyword  || '') !== -1
            );
        }
    };

    //for project icon purposes
    $scope.getFirstLetter = function(name){
        if(typeof name != 'undefined'){ return name.charAt(0).toUpperCase(); }
    };

    //progress of milestone
    $scope.getPercentage = function(miestoneId){
        if(typeof $scope.projectInfo.milestone_tasks != 'undefined' && typeof $scope.projectInfo.milestone_tasks[miestoneId] != 'undefined'){
            var milestone_tasks = $scope.projectInfo.milestone_tasks[miestoneId];

            if(typeof milestone_tasks != 'undefined' && milestone_tasks.length < 1){
                return 0;
            }else{
                var length = milestone_tasks.length;
                var checker = 0;

                milestone_tasks.forEach(function(task){
                    if(task.value == true){ checker++; }
                });

                var average = (checker/length)*100;
                return Math.round(average);
            }
        }else{
            return 0;
        }
    };

    //for project list purposes
    $scope.getProjectName = function(name){
        return ucwords(name);
    };

    $scope.checkIfSeen = function(milestone){
        if(typeof milestone.seen != "undefined" && typeof milestone.seen[$scope.clientUid] != 'undefined'){
            return false;
        }else {
            return true;
        }
    };

    $ionicModal.fromTemplateUrl('templates/modal-project.html', {
        id: '1',
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function(modal) {
        $scope.createModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal-project-details.html', {
        id: '2',
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function(modal) {
        $scope.projectModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal-project-details.html', {
        id: '2',
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function(modal) {
        $scope.projectModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal-edit-project.html', {
        id: '3',
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function(modal) {
        $scope.editModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/profile-modal.html', {
        id: '4',
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function(modal) {
        $scope.profileModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal-milestone-details.html', {
        id: '5',
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function(modal) {
        $scope.milestoneModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal-add-post.html', {
        id: '6',
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function(modal) {
        $scope.addPostModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal-view-post.html', {
        id: '7',
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function(modal) {
        $scope.viewPostModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal-edit-post.html', {
        id: '8',
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function(modal) {
        $scope.editPostModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal-edit-comment.html', {
        id: '9',
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function(modal) {
        $scope.editCommentModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal-post-not-exists.html', {
        id: '10',
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function(modal) {
        $scope.postNotExistsModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal-pass-ownership.html', {
        id: '11',
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function(modal) {
        $scope.passOwnershipModal = modal;
    });


        $ionicPopover.fromTemplateUrl('templates/popover-milestone.html', {
        id : '1',
        scope: $scope
    }).then(function(popover) {
        $scope.milestonePopover = popover;
    });

    $ionicPopover.fromTemplateUrl('templates/popover-task.html', {
        id : '2',
        scope: $scope
    }).then(function(popover) {
        $scope.taskPopover = popover;
    });

    $ionicPopover.fromTemplateUrl('templates/popover-discussion-delete-only.html', {
        id : '3',
        scope: $scope
    }).then(function(popover) {
        $scope.deleteOnlyPopover = popover;
    });

    $ionicPopover.fromTemplateUrl('templates/popover-discussion-edit-and-delete.html', {
        id : '4',
        scope: $scope
    }).then(function(popover) {
        $scope.editAndDeletePopover = popover;
    });

    $ionicPopover.fromTemplateUrl('templates/popover-comment-delete-only.html', {
        id : '5',
        scope: $scope
    }).then(function(popover) {
        $scope.commentDeleteOnlyPopover = popover;
    });

    $ionicPopover.fromTemplateUrl('templates/popover-comment-edit-and-delete.html', {
        id : '6',
        scope: $scope
    }).then(function(popover) {
        $scope.commentEditAndDeletePopover = popover;
    });

    $ionicPopover.fromTemplateUrl('templates/popover-log-edit-and-delete.html', {
        id : '7',
        scope: $scope
    }).then(function(popover) {
        $scope.logEditAndDeletePopover = popover;
    });

    $ionicPopover.fromTemplateUrl('templates/popover-project.html', {
        id : '8',
        scope: $scope
    }).then(function(popover) {
        $scope.projectPopover = popover;
    });

    $scope.openPostPopover = function($event, index){
        $scope.openPopover($event, index);
    };

    $scope.openCommentPopover = function($event, index, comment){
        $scope.openPopover($event, index);
        $scope.commentDetails = comment;
    };

    $scope.openLogPopover = function($event, index, log){
        $scope.openPopover($event, index);
        $scope.timeLogDetails = log;
    };

    $scope.openProjectPopover = function($event, index){
        $scope.openPopover($event, index);
    };

    $scope.openPopover = function($event, index) {
        if(index == 1){ $scope.milestonePopover.show($event); }
        else if(index == 2){ $scope.taskPopover.show($event); }
        else if(index == 3){ $scope.deleteOnlyPopover.show($event); }
        else if(index == 4){ $scope.editAndDeletePopover.show($event); }
        else if(index == 5){ $scope.commentDeleteOnlyPopover.show($event); }
        else if(index == 6){ $scope.commentEditAndDeletePopover.show($event); }
        else if(index == 7){ $scope.logEditAndDeletePopover.show($event); }
        else if(index == 8){ $scope.projectPopover.show($event); }

    };

    $scope.closePopover = function(index) {
        $scope.milestonePopover.hide();
        $scope.taskPopover.hide();
        $scope.deleteOnlyPopover.hide();
        $scope.editAndDeletePopover.hide();
        $scope.commentDeleteOnlyPopover.hide();
        $scope.commentEditAndDeletePopover.hide();
        $scope.logEditAndDeletePopover.hide();
        $scope.projectPopover.hide();
    };

    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.milestonePopover.remove();
        $scope.taskPopover.remove();
        $scope.deleteOnlyPopover.remove();
        $scope.editAndDeletePopover.remove();
        $scope.commentDeleteOnlyPopover.remove();
        $scope.commentEditAndDeletePopover.remove();
        $scope.logEditAndDeletePopover.remove();
        $scope.projectPopover.remove();
    });

    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
        // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
        // Execute action
    });

    $scope.openModal = function(index) {
        if(index == 1) { $scope.createModal.show() }
        else if(index == 2) { $scope.projectModal.show() }
        else if(index == 3) { $scope.editModal.show() }
        else if(index == 4) { $scope.profileModal.show() }
        else if(index == 5){ $scope.milestoneModal.show() }
        else if(index == 6){
            $scope.milestonePostDetails = {
                title : "",
                description : "",
                dateCreated : new Date().getTime()
            };

            $scope.addPostModal.show();
        }else if(index == 7){
            $scope.viewPostModal.show();
        }else if(index == 8){
            $scope.editPostModal.show()
        }else if(index == 9){
            $scope.editCommentModal.show()
        }else if(index == 10){
            $scope.postNotExistsModal.show();
        }else if(index == 11){
            $scope.passOwnershipModal.show();
        }
    };

    $scope.closeModal = function(index) {
        if(index == 1) { $scope.createModal.hide() }
        else if(index == 2) {
            $scope.tabIndex = 0;
            $scope.projectModal.hide();
            $scope.milestoneLogsLimit = 10;
            $scope.milestoneDiscussionsLimit = 10;
            $scope.projectTimeLogsLimit = 10;
            $scope.projectLogsLimit = 10;

            $timeout(function(){

                $scope.ctx = null;
                $scope.chart = null;
                $scope.chartData = [];

                $scope.milestoneModal.remove();
                $scope.editModal.remove();
                $scope.projectModal.remove();
                $scope.profileModal.remove();
                $scope.addPostModal.remove();
                $scope.editPostModal.remove();
                $scope.viewPostModal.remove();
                $scope.editCommentModal.remove();
                $scope.postNotExistsModal.remove();
                $scope.passOwnershipModal.remove();

                $scope.milestonePopover.remove();
                $scope.taskPopover.remove();
                $scope.deleteOnlyPopover.remove();
                $scope.editAndDeletePopover.remove();
                $scope.commentDeleteOnlyPopover.remove();
                $scope.commentEditAndDeletePopover.remove();
                $scope.logEditAndDeletePopover.remove();
                $scope.projectPopover.remove();

                $scope.recreateModalInstance();
                $scope.recreatePopoverInstance();
            }, 800);
        } else if(index == 3) {
            $scope.editModal.hide();
            $scope.resetCheckers();
            $scope.resetProjectDetails();
        } else if(index == 4) {
            $scope.profileModal.hide();

            $timeout(function(){
                $scope.profileModal.remove();
                $scope.recreateProfileModal();
            }, 300);
        } else if(index == 5) {
            $scope.milestoneTab = 0;
            $scope.milestoneModal.hide();

            $scope.milestoneDetails = {
                title : "",
                colorLabel : '#4CAF50',
                dateCreated : new Date().getTime()
            };
        } else if(index == 6) {
            $scope.milestonePostDetails = {
                title : "",
                description : "",
                dateCreated : new Date().getTime()
            };

            $scope.addPostModal.hide();
        } else if(index == 7) {
            $scope.milestonePostDetails = {
                title : "",
                description : "",
                dateCreated : new Date().getTime()
            };

            $scope.editPost = false;
            $scope.viewPostModal.hide();
        } else if(index == 8) {
            $scope.editPost = false;
            $scope.editPostModal.hide();
        } else if(index == 9) {
            $scope.editCommentModal.hide();

            $timeout(function(){
                $scope.commentEditDetails = {};
                $scope.editComment = false;
                $scope.commentDetails = {
                    comment : "",
                    value: false,
                    date : new Date().getTime()
                };
            }, 1000);
        } else if(index == 10){
            $scope.postNotExistsModal.hide();
        }else if(index == 11){
            $scope.passOwnershipModal.hide();
        }
    };

    $scope.changeEditPost = function(value){
        $scope.closePopover();
        $scope.editPost = value;

        if(value){
            $scope.openModal(8);
            $scope.postTitle = $scope.milestonePostDetails.title;
            $scope.postDescription = $scope.milestonePostDetails.description;
        }else{
            $scope.closeModal(8);
            $scope.milestonePostDetails.title = $scope.postTitle;
            $scope.milestonePostDetails.description = $scope.postDescription;
            $scope.postTitle = "";
            $scope.postDescription = "";
        }
    };

    $scope.changeEditComment = function(value){
        $scope.closePopover();
        $scope.editComment = value;

        if(value){
            $scope.openModal(9);
            $scope.commentEditDetails.text = $scope.commentDetails.comment;
        }else{ $scope.closeModal(9) }
    };

    $scope.savePost = function(){

        var projectId = $scope.projectInfo.$id;
        var milestoneId = $scope.milestoneDetails.$id;
        var postId = $scope.milestonePostDetails.$id;

        if($scope.milestonePostDetails.title != "" && ($scope.postTitle != $scope.milestonePostDetails.title || $scope.postDescription != $scope.milestonePostDetails.description)){
            $scope.editPost = false;

            var postRef = firebaseRef.child('milestone_discussions').child(projectId).child(milestoneId).child(postId);
            var message = " edited his/her post."
            var isEdited = false;

            postRef.update({
                title : $scope.milestonePostDetails.title,
                description : $scope.milestonePostDetails.description,
                dateModified : new Date().getTime(),
                isEdited : true
            });

            $scope.postTitle = "";
            $scope.postDescription = "";

            $scope.notifyMilestone(projectId, milestoneId, postId, null, null, 'edit_discussion', message);
            $scope.closeModal(8);
        }else{
            $scope.closeModal(8);
        }
    };

    $scope.saveComment = function(){

        var projectId = $scope.projectInfo.$id;
        var milestoneId = $scope.milestoneDetails.$id;
        var postId = $scope.milestonePostDetails.$id;
        var commentId = $scope.commentDetails.$id;

        if($scope.commentEditDetails.text != "" && $scope.commentEditDetails.text != $scope.commentDetails.comment){
            var commentRef = firebaseRef.child('discussion_comments').child(projectId).child(milestoneId).child(postId).child(commentId);

            commentRef.update({
               comment : $scope.commentEditDetails.text,
                isEdited : true
            });

            $scope.notifyMilestone(projectId, milestoneId, postId, $scope.clientUid, $scope.milestonePostDetails.user, 'edit_comment', ' edited his/her comment on ');

            $scope.closeModal(9);
        }else{
            $scope.closeModal(9);
        }
    };

    $scope.deletePost = function(){

        $scope.closePopover();
        var deletePostPopup = $ionicPopup.confirm({
            template: "Are you sure you want to delete this post?",
            title: 'Delete Post'
        });

        deletePostPopup.then(function(res){
            if(res){
                var projectId = $scope.projectInfo.$id;
                var milestoneId = $scope.milestoneDetails.$id;
                var postId = $scope.milestonePostDetails.$id;
                var posterUid = $scope.milestonePostDetails.user;
                var message = "";

                var milestonePostsRef = $firebaseArray(firebaseRef.child('milestone_discussions').child(projectId).child(milestoneId));
                var discussionCommentsRef = $firebaseArray(firebaseRef.child('discussion_comments').child(projectId).child(milestoneId));

                //remove discussion comments
                discussionCommentsRef.$loaded(function(){
                    var discussionCommentsRecord = discussionCommentsRef.$getRecord(postId);

                    if(discussionCommentsRecord != null){ discussionCommentsRecord.$remove(discussionCommentsRecord); }
                });

                //remove post
                milestonePostsRef.$loaded(function(){
                    var postRecord = milestonePostsRef.$getRecord(postId);
                    milestonePostsRef.$remove(postRecord);

                    if($scope.clientUid == posterUid){
                        message = " deleted his/her post."
                        $scope.notifyMilestone(projectId, milestoneId, postId, null, null, 'delete_discussion', message);
                    }else{
                        message = " deleted "
                        $scope.notifyMilestone(projectId, milestoneId, postId, posterUid, null, 'delete_discussion', message);
                    }

                });

                $scope.closeModal(7);
            }
        });
    };

    $scope.deleteComment = function(){

        $scope.closePopover();
        var deletePostPopup = $ionicPopup.confirm({
            template: "Are you sure you want to delete this comment?",
            title: 'Delete Comment'
        });

        deletePostPopup.then(function(res){
            if(res){
                var projectId = $scope.projectInfo.$id;
                var milestoneId = $scope.milestoneDetails.$id;
                var postId = $scope.milestonePostDetails.$id;
                var commentId = $scope.commentDetails.$id;
                var message = "";

                var discussionCommentsRef = $firebaseArray(firebaseRef.child('discussion_comments').child(projectId).child(milestoneId).child(postId));

                //remove discussion comment
                discussionCommentsRef.$loaded(function(){
                    var discussionCommentRecord = discussionCommentsRef.$getRecord(commentId);

                    $scope.notifyMilestone(projectId, milestoneId, postId, discussionCommentRecord.poster, $scope.milestonePostDetails.user, 'delete_comment', message);

                    if(discussionCommentRecord != null){ discussionCommentsRef.$remove(discussionCommentRecord); }
                });
            }
        });
    };

    $scope.recreateModalInstance = function(){

        $ionicModal.fromTemplateUrl('templates/modal-project-details.html', {
            id: '2',
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function(modal) {
            $scope.projectModal = modal;
        });

        $ionicModal.fromTemplateUrl('templates/modal-edit-project.html', {
            id: '3',
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function(modal) {
            $scope.editModal = modal;
        });

        $ionicModal.fromTemplateUrl('templates/profile-modal.html', {
            id: '4',
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function(modal) {
            $scope.profileModal = modal;
        });

        $ionicModal.fromTemplateUrl('templates/modal-milestone-details.html', {
            id: '5',
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function(modal) {
            $scope.milestoneModal = modal;
        });

        $ionicModal.fromTemplateUrl('templates/modal-add-post.html', {
            id: '6',
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function(modal) {
            $scope.addPostModal = modal;
        });

        $ionicModal.fromTemplateUrl('templates/modal-view-post.html', {
            id: '7',
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function(modal) {
            $scope.viewPostModal = modal;
        });

        $ionicModal.fromTemplateUrl('templates/modal-edit-post.html', {
            id: '8',
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function(modal) {
            $scope.editPostModal = modal;
        });

        $ionicModal.fromTemplateUrl('templates/modal-edit-comment.html', {
            id: '9',
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function(modal) {
            $scope.editPostModal = modal;
        });

        $ionicModal.fromTemplateUrl('templates/modal-post-not-exists.html', {
            id: '10',
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function(modal) {
            $scope.postNotExistsModal = modal;
        });

        $ionicModal.fromTemplateUrl('templates/modal-pass-ownership.html', {
            id: '11',
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function(modal) {
            $scope.passOwnershipModal = modal;
        });
    };

    $scope.recreatePopoverInstance = function(){

        $ionicPopover.fromTemplateUrl('templates/popover-milestone.html', {
            id : '1',
            scope: $scope
        }).then(function(popover) {
            $scope.milestonePopover = popover;
        });

        $ionicPopover.fromTemplateUrl('templates/popover-task.html', {
            id : '2',
            scope: $scope
        }).then(function(popover) {
            $scope.taskPopover = popover;
        });

        $ionicPopover.fromTemplateUrl('templates/popover-discussion-delete-only.html', {
            id : '3',
            scope: $scope
        }).then(function(popover) {
            $scope.deleteOnlyPopover = popover;
        });

        $ionicPopover.fromTemplateUrl('templates/popover-discussion-edit-and-delete.html', {
            id : '4',
            scope: $scope
        }).then(function(popover) {
            $scope.editAndDeletePopover = popover;
        });

        $ionicPopover.fromTemplateUrl('templates/popover-comment-delete-only.html', {
            id : '5',
            scope: $scope
        }).then(function(popover) {
            $scope.commentDeleteOnlyPopover = popover;
        });

        $ionicPopover.fromTemplateUrl('templates/popover-comment-edit-and-delete.html', {
            id : '6',
            scope: $scope
        }).then(function(popover) {
            $scope.commentEditAndDeletePopover = popover;
        });

        $ionicPopover.fromTemplateUrl('templates/popover-log-edit-and-delete.html', {
            id : '7',
            scope: $scope
        }).then(function(popover) {
            $scope.logEditAndDeletePopover = popover;
        });

        $ionicPopover.fromTemplateUrl('templates/popover-project.html', {
            id : '8',
            scope: $scope
        }).then(function(popover) {
            $scope.projectPopover = popover;
        });
    };

    $scope.recreateProfileModal = function(){

        $ionicModal.fromTemplateUrl('templates/profile-modal.html', {
            id: '4',
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function(modal) {
            $scope.profileModal = modal;
        });
    };

    $scope.recreateAddPostModal = function(){

        $ionicModal.fromTemplateUrl('templates/modal-add-post.html', {
            id: '6',
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function(modal) {
            $scope.addPostModal = modal;
        });
    };

    $scope.$on('$destroy', function() {
        $scope.createModal.remove();
        $scope.projectModal.remove();
        $scope.editModal.remove();
        $scope.profileModal.remove();
        $scope.milestoneModal.remove();
        $scope.addPostModal.remove();
        $scope.editPostModal.remove();
        $scope.viewPostModal.remove();
        $scope.editCommentModal.remove();
        $scope.postNotExistsModal.remove();
    });

    $scope.openViewPostModal = function(discussion){

        $scope.milestonePostDetails = discussion;
        $scope.openModal(7);
    };

    $scope.openColorPicker = function(){

        var colorPickerPopup = $ionicPopup.show({
            templateUrl: 'templates/project-color-picker-popup.html',
            title: 'Pick a color',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: 'OK',
                    type: 'button-positive',
                    onTap: function(e) {
                    }
                }
            ]
        });
        colorPickerPopup.then(function(res){
        });
    };

    $scope.openMilestoneModal = function(milestone){
        $scope.openModal(5);
        $scope.milestoneTab = 0;
        $scope.milestoneDetails = milestone;

        console.log($scope.projectInfo);
        $timeout(function(){
            var projectId = $scope.projectInfo.$id;
            var milestoneId = milestone.$id;

            if(typeof milestone['seen'] == "undefined" || typeof milestone['seen'][$scope.clientUid] == "undefined"){
                var milestoneSeenRef = $firebaseObject(firebaseRef.child('project_milestones').child(projectId)
                    .child(milestoneId).child('seen').child($scope.clientUid));

                milestoneSeenRef.$value = true;
                milestoneSeenRef.$save();
            }
        }, 1000);
    };

    $scope.createProject = function(uid, name){

        var error = 0;
        var allottedHours = parseFloat($scope.projectDetails.allottedHours);
        var startDate = $scope.projectDetails.startDate.getTime();
        var endDate = $scope.projectDetails.endDate.getTime();

        if($scope.projectDetails.projectName == ""){
            $scope.projectNameChecker = true;
            error++;
        }else{
            $scope.projectNameChecker = false;
        }

        if(allottedHours < 1 || isNaN(allottedHours)){
            $scope.allottedHoursChecker = true;
            error++;
        }else{
            $scope.allottedHoursChecker = false;
        }

        if(endDate <= startDate){
            $scope.endDateChecker = true;
            error++;
        }else{
            $scope.endDateChecker = false;
        }

        if(error == 0){
            var projectRef = $firebaseArray(firebaseRef.child('projects'));

            projectRef.$add({
                projectName : $scope.projectDetails.projectName,
                allottedHours : allottedHours.toFixed(2),
                startDate : startDate,
                endDate : endDate,
                colorLabel : $scope.projectDetails.colorLabel,
                dateCreated : new Date().getTime(),
                dateModified : new Date().getTime(),
                owner : uid,
                modifiedBy : uid,
                isFinished : false
            }).then(function(data){

                //add user (logged in) to project_members
                var projectMembersRef = $firebaseObject(firebaseRef.child('project_members').child(data.key()).child(uid));
                projectMembersRef.$value = true;

                projectMembersRef.$save();

                //add project to user (logged in) projects
                var userProjects = $firebaseObject(firebaseRef.child('user_accounts').child(uid).child('projects').child(data.key()));
                userProjects.$value = true;

                userProjects.$save();

                //projectId, type, member
                $scope.notifyProject(data.key(), 'create_project', null, null);

                $scope.resetCheckers();
                $scope.resetProjectDetails();
                $scope.closeModal(1);
            }, function(err){
                console.log(err);
            });
        }
    };

    $scope.addPost = function(){
        if($scope.milestonePostDetails.title != ""){
            var projectId = $scope.projectInfo.$id;
            var milestoneId = $scope.milestoneDetails.$id;
            var postRef = $firebaseArray(firebaseRef.child('milestone_discussions').child(projectId).child(milestoneId));

            $scope.milestonePostDetails.user = $scope.clientUid;
            $scope.milestonePostDetails.dateCreated = new Date().getTime();
            $scope.milestonePostDetails.dateModified = new Date().getTime();

            postRef.$add($scope.milestonePostDetails).then(function(postDetails){

                var message = " posted a discussion. "
                $scope.notifyMilestone(projectId, milestoneId, postDetails.key(), null, null, 'add_discussion', message);
            }, function(err){
                console.log(err);
            });

            $scope.milestonePostDetails = {
                title : "",
                description : "",
                dateCreated : new Date().getTime()
            };

            $scope.closeModal(6);
        }
    };

    $scope.removeMember = function(details){

        var removeMemberPopup = $ionicPopup.confirm({
            template: "Are you sure you want to remove " + details.firstName + " in this project?",
            title: 'Remove Member'
        });

        removeMemberPopup.then(function(res){
            if(res){
                var projectId = $scope.projectInfo.$id;
                var userProjectsRef = $firebaseArray(firebaseRef.child('user_accounts').child(details.$id).child('projects'));
                var projectMembersRef = $firebaseArray(firebaseRef.child('project_members').child(projectId));

                userProjectsRef.$loaded(function(){
                    var projectRecord = userProjectsRef.$getRecord(projectId);
                    //remove project from member's project records
                    userProjectsRef.$remove(projectRecord);
                });

                projectMembersRef.$loaded(function(){
                    var projectRecord = projectMembersRef.$getRecord(details.$id);
                    //remove member from project_members data set
                    projectMembersRef.$remove(projectRecord);
                });

                $scope.notifyProject(projectId, 'remove_member', details.$id, null);
            }
        })
    };

    $scope.openAddMember = function(){

        $scope.member = {};

        var addMemberPopup = $ionicPopup.show({
            templateUrl: "templates/add-member-popup.html",
            title: 'Add Member',
            subTitle: 'Add a member by entering email address',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: 'OK',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.member.email) {
                            e.preventDefault();
                        } else {
                            addMemberPopup.close();
                            $timeout(function(){
                                $scope.addMember($scope.member.email);
                            }, 300);
                        }
                    }
                }
            ]
        });
    };


    $scope.openTimeLogPopup = function(){
        $scope.timeLog = {
            hours : "",
            description : ""
        };

        var addTimeLogPopup = $ionicPopup.show({
            templateUrl: "templates/popup-time-log.html",
            title: 'Add Time Log',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: 'OK',
                    type: 'button-positive',
                    onTap: function(e) {
                        if(!$scope.timeLog.hours || $scope.timeLog.description == ""){
                            e.preventDefault();
                        }else{
                            var positiveIntegerRegEx = /^\d+$/;
                            var floatRegEx = /^\d+(\.\d+)?$/;
                            var timeRegEx = /^\d+(:\d\d)?$/;

                            var integerPattern = new RegExp(positiveIntegerRegEx);
                            var floatPattern = new RegExp(floatRegEx);
                            var timePattern = new RegExp(timeRegEx);

                            var hours = $scope.timeLog.hours;
                            var integerPatternResult = integerPattern.test(hours);
                            var floatPatternResult = floatPattern.test(hours);
                            var timePatternResult = timePattern.test(hours);


                            if(floatPatternResult === true && integerPatternResult == false){
                                $scope.timeLogDetails = {
                                    user : $scope.clientUid,
                                    decimal : parseFloat(hours).toFixed(2),
                                    hour : $scope.decimalToHours(hours),
                                    description : $scope.timeLog.description,
                                    dateCreated : new Date().getTime(),
                                    dateModified : new Date().getTime()
                                }

                                return true;
                            }else if(timePatternResult === true && integerPatternResult === false){
                                $scope.timeLogDetails = {
                                    user : $scope.clientUid,
                                    decimal : $scope.hoursToDecimal(hours),
                                    hour  : hours,
                                    description : $scope.timeLog.description,
                                    dateCreated : new Date().getTime(),
                                    dateModified : new Date().getTime()
                                }

                                return true;
                            }else if(integerPatternResult === true){
                                $scope.timeLogDetails = {
                                    user : $scope.clientUid,
                                    decimal : parseFloat(hours).toFixed(2),
                                    hour : $scope.decimalToHours(hours),
                                    description : $scope.timeLog.description,
                                    dateCreated : new Date().getTime(),
                                    dateModified : new Date().getTime()
                                }

                                return true;
                            }else{
                                e.preventDefault();
                            }
                        }
                    }
                }
            ]
        });

        addTimeLogPopup.then(function(res) {

            if(res){
                var projectBudgetRef = $firebaseArray(firebaseRef.child('project_budget').child($scope.projectInfo.$id));
                var projectRef = firebaseRef.child('projects').child($scope.projectInfo.$id);

                projectBudgetRef.$loaded(function(){
                    projectRef.once("value", function(snapshot){
                        var projectDetails = snapshot.val();
                        var time = $scope.timeLogDetails.hour;
                        var timeSplit = time.split(/[.:]/);
                        var message = "";

                        if(timeSplit[0] == '1'){
                            if(timeSplit[1] == '01'){
                                message = " logged " + timeSplit[0] + " hour and " + timeSplit[1] + " minute into the project.";
                            }else{
                                message = " logged " + timeSplit[0] + " hour and " + timeSplit[1] + " minutes into the project.";
                            }
                        }else{
                            if(timeSplit[1] == '01'){
                                message = " logged " + timeSplit[0] + " hours and " + timeSplit[1] + " minute into the project.";
                            }else{
                                message = " logged " + timeSplit[0] + " hours and " + timeSplit[1] + " minutes into the project.";
                            }
                        }

                        var contributions = {};
                        var usedHours = 0;

                        if(typeof $scope.projectInfo.details['contributions'] != 'undefined'){
                            if(typeof $scope.projectInfo.details['contributions'][$scope.clientUid] != 'undefined'){
                                contributions = parseFloat($scope.projectInfo.details['contributions'][$scope.clientUid]) + parseFloat($scope.timeLogDetails.decimal);
                            }else{
                                contributions = $scope.timeLogDetails.decimal;
                            }
                        }else{
                            contributions = $scope.timeLogDetails.decimal;
                        }

                        if(typeof $scope.projectInfo.details.usedHours != 'undefined'){
                            usedHours = parseFloat($scope.projectInfo.details.usedHours) + parseFloat($scope.timeLogDetails.decimal);
                        }else{
                            usedHours = parseFloat($scope.timeLogDetails.decimal);
                        }

                        projectRef.update({
                            usedHours : usedHours
                        });

                        var contributionRef = $firebaseObject(projectRef.child('contributions').child($scope.clientUid));
                        contributionRef.$value = contributions;
                        contributionRef.$save();

                        projectBudgetRef.$add($scope.timeLogDetails);
                        $scope.notifyProject($scope.projectInfo.$id, 'add_log', null, message);
                    });
                });
            }
        });
    };


    $scope.editLog = function() {
        var origId = $scope.timeLogDetails.$id;
        var origUser = $scope.timeLogDetails.user;
        var origDecimal = $scope.timeLogDetails.decimal;
        var origHour = $scope.timeLogDetails.hour;
        var origDescription = $scope.timeLogDetails.description;

        $scope.closePopover();
        $scope.timeLog = $scope.timeLogDetails;

        var editTimeLogPopup = $ionicPopup.show({
            templateUrl: "templates/popup-edit-time-log.html",
            title: 'Edit Time Log',
            scope: $scope,
            buttons: [
                { text: 'Cancel',
                    onTap: function(e) {
                        $scope.timeLogDetails.decimal = origDecimal;
                        $scope.timeLogDetails.hour = origHour;
                        $scope.timeLogDetails.description = origDescription;
                    }
                },
                {
                    text: 'OK',
                    type: 'button-positive',
                    onTap: function(e) {
                        if(!$scope.timeLog.hour || $scope.timeLog.description == ""){
                            e.preventDefault();
                        }else{
                            var positiveIntegerRegEx = /^\d+$/;
                            var floatRegEx = /^\d+(\.\d+)?$/;
                            var timeRegEx = /^\d+(:\d\d)?$/;

                            var integerPattern = new RegExp(positiveIntegerRegEx);
                            var floatPattern = new RegExp(floatRegEx);
                            var timePattern = new RegExp(timeRegEx);

                            var hours = $scope.timeLog.hour;
                            var integerPatternResult = integerPattern.test(hours);
                            var floatPatternResult = floatPattern.test(hours);
                            var timePatternResult = timePattern.test(hours);


                            if(floatPatternResult === true && integerPatternResult == false){
                                $scope.timeLogDetails = {
                                    decimal : parseFloat(hours).toFixed(2),
                                    hour : $scope.decimalToHours(hours),
                                    description : $scope.timeLog.description
                                }

                                return true;
                            }else if(timePatternResult === true && integerPatternResult === false){
                                $scope.timeLogDetails = {
                                    decimal : $scope.hoursToDecimal(hours),
                                    hour  : hours,
                                    description : $scope.timeLog.description
                                }

                                return true;
                            }else if(integerPatternResult === true){
                                $scope.timeLogDetails = {
                                    decimal : parseFloat(hours).toFixed(2),
                                    hour : $scope.decimalToHours(hours),
                                    description : $scope.timeLog.description
                                }

                                return true;
                            }else{
                                e.preventDefault();
                            }
                        }
                    }
                }
            ]
        });

        editTimeLogPopup.then(function(res) {
            if(res){

                var projectId = $scope.projectInfo.$id;
                if(origHour != $scope.timeLogDetails.hour){

                    var usedHours = parseFloat($scope.projectInfo.details.usedHours);
                    var contributionRef = $firebaseObject(firebaseRef.child('projects').child(projectId).child('contributions').child(origUser));

                    contributionRef.$loaded(function(){
                        var contribution = contributionRef.$value;
                        var message = "";

                        if(contribution != null){

                            //edit usedHours
                            usedHours = (usedHours - parseFloat(origDecimal)) + parseFloat($scope.timeLogDetails.decimal);
                            firebaseRef.child('projects').child(projectId).update({
                               usedHours :  usedHours
                            });

                            //edit project contributions
                            contribution = (parseFloat(contribution) - parseFloat(origDecimal)) + parseFloat($scope.timeLogDetails.decimal);
                            contributionRef.$value = contribution;
                            contributionRef.$save();

                            //edit project budget ref
                            var projectBudgetRef = $firebaseObject(firebaseRef.child('project_budget').child(projectId).child(origId));

                            projectBudgetRef.$loaded(function(){
                                projectBudgetRef.decimal = $scope.timeLogDetails.decimal;
                                projectBudgetRef.hour = $scope.timeLogDetails.hour;
                                projectBudgetRef.dateModified = new Date().getTime();
                                projectBudgetRef.isEdited = true;
                                projectBudgetRef.$save();
                            });
                        }

                        message = " log from " + $scope.decimalToHours(origDecimal) + " to " + $scope.decimalToHours($scope.timeLogDetails.decimal) + ".";

                        $scope.notifyProject(projectId, 'edit_log', origUser, message);
                    });
                }

                if(origDescription != $scope.timeLogDetails.description){
                    firebaseRef.child('project_budget').child(projectId).child(origId).update({
                        description : $scope.timeLogDetails.description,
                        isEdited : true
                    });

                    //description edited
                    $scope.notifyProject(projectId, 'edit_log_description', origUser, '');
                }
            }
        });
    };

    $scope.deleteLog = function() {

        $scope.closePopover();
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Log',
            template: 'Are you sure you want to delete this log?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                var projectId = $scope.projectInfo.$id;

                var usedHours = parseFloat($scope.projectInfo.details.usedHours);
                var contributionRef = $firebaseObject(firebaseRef.child('projects').child(projectId).child('contributions').child($scope.timeLogDetails.user));

                contributionRef.$loaded(function(){
                    var contribution = contributionRef.$value;

                    if(contribution != null){

                        //edit usedHours
                        usedHours -= parseFloat($scope.timeLogDetails.decimal);
                        firebaseRef.child('projects').child(projectId).update({
                            usedHours :  usedHours
                        });

                        //edit project contributions
                        contribution = (parseFloat(contribution) - parseFloat($scope.timeLogDetails.decimal));
                        contributionRef.$value = contribution;
                        contributionRef.$save();

                        //edit project budget ref
                        var projectBudgetRef = $firebaseArray(firebaseRef.child('project_budget').child(projectId));

                        projectBudgetRef.$loaded(function(){
                           var logRecord = projectBudgetRef.$getRecord($scope.timeLogDetails.$id);
                            projectBudgetRef.$remove(logRecord);
                        });
                    }

                    var message = $scope.timeLogDetails.hour;

                    $scope.notifyProject(projectId, 'delete_log', $scope.timeLogDetails.user, message);
                });
            } else {
            }
        });
    };

    $scope.getRemainingHours = function(projectKey){

        var remainingHours = 0;

        if(typeof $scope.projects[projectKey] != 'undefined'){
            if(typeof $scope.projects[projectKey].details.usedHours == 'undefined'){
                remainingHours = $scope.projects[projectKey].details.allottedHours;
            }else{
                remainingHours = parseFloat($scope.projects[projectKey].details.allottedHours) - parseFloat($scope.projects[projectKey].details.usedHours);
            }

            if(remainingHours == 0) {
                return "0 hours";
            }else if(remainingHours < 0){
                remainingHours = $scope.decimalToHours(remainingHours);

                var timeSplit = remainingHours.split(/[.:]/);

                var hours = timeSplit[0];
                var mins = timeSplit[1];

                if(mins == "00"){
                    if(hours == -1){ return (parseInt(hours) * -1) + " hour"; }
                    else { return (parseInt(hours) * -1) + " hours"; }
                }else{
                    if(hours == -1){ return (parseInt(hours) * -1) + " hour and " + (parseInt(mins) * -1) + " minutes"; }
                    else { return (parseInt(hours) * -1) + " hours and " + (parseInt(mins) * -1) + " minutes" }
                }
            }else{
                remainingHours = $scope.decimalToHours(remainingHours);

                var timeSplit = remainingHours.split(/[.:]/);

                var hours = timeSplit[0];
                var mins = timeSplit[1];

                if(mins == "00"){
                    if(hours == 1){ return hours + " hour"; }
                    else { return hours + " hours"; }
                }else{
                    if(hours == 1){ return hours + " hour and " + mins + " minutes"; }
                    else { return hours + " hours and " + mins + " minutes"; }
                }
            }
        }
    };

    $scope.isOverBudget = function(projectKey){

        var remainingHours = 0;

        if(typeof $scope.projects[projectKey] != 'undefined'){
            if(typeof $scope.projects[projectKey].details.usedHours == 'undefined'){
                remainingHours = $scope.projects[projectKey].details.allottedHours;
            }else{
                remainingHours = parseFloat($scope.projects[projectKey].details.allottedHours) - parseFloat($scope.projects[projectKey].details.usedHours);
            }

            if(remainingHours < 0){
                return true;
            }else{
               return false;
            }
        }
    };

    $scope.getAllottedHours = function(decimal){

        var allottedTime = $scope.decimalToHours(decimal);
        var timeSplit = allottedTime.split(/[.:]/);

        var hours = timeSplit[0];
        var mins = timeSplit[1];

        if(mins == "00"){
            if(hours == 1){ return hours + " hour"; }
            else { return hours + " hours"; }
        }else{
            if(hours == 1){ return hours + " hour and " + mins + " minutes"; }
            else { return hours + " hours and " + mins + " minutes"; }
        }
    };

    $scope.decimalToHours = function(decimal){
        var hrs = parseInt(Number(decimal));
        var min = Math.round((Number(decimal)-hrs) * 60).toFixed();

        if(min == 0) { min = "00" }
        return hrs + ":" + min;
    };

    $scope.hoursToDecimal = function(hours){
        var hoursMinutes = hours.split(/[.:]/);
        var hours = parseInt(hoursMinutes[0]);
        var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1]) : 0;
        return hours + minutes / 60;
    };

    $scope.getHours = function(time){

    };

    $scope.addMember = function(email){

        if(email != "" || typeof email != 'undefined'){
            //search for users with this email
            firebaseRef.child('user_accounts').orderByChild("email")
                .startAt(email).endAt(email).once("value", function(snapshot){
                    if(snapshot.val() == null){
                        $scope.userNotExists();
                    }else{
                        //if email exists
                        snapshot.forEach(function(data){
                            var projectId = $scope.projectInfo.$id;
                            var userProjectRef = $firebaseObject(firebaseRef.child('user_accounts').child(data.key()).child('projects').child(projectId));

                            userProjectRef.$loaded(function(){
                                //if not part of the project
                                if(userProjectRef.$value == null){
                                    var userDetails = data.val();
                                    userProjectRef.$value = false;

                                    var projectMemberRef = $firebaseObject(firebaseRef.child('project_members').child(projectId).child(data.key()));
                                    projectMemberRef.$value = false;

                                    $scope.notifyProject(projectId, 'add_member', data.key(), null);

                                    //add project to user's project list
                                    userProjectRef.$save();

                                    //add user to project_members data set
                                    projectMemberRef.$save();
                                }else{
                                    $scope.userAlreadyMember();
                                }
                            });
                        });
                    }
                });
        }
    };

    $scope.checkIfPostExists = function(){

    };

    $scope.notifyProject = function(projectId, type, member, message){

        //edit date modified
        var projectRef = firebaseRef.child('projects').child(projectId);
        projectRef.update({
            dateModified : new Date().getTime(),
            modifiedBy : $scope.clientUid
        });

        var seen = {};
        seen[$scope.clientUid] = true;
        projectRef.child('seen').set(seen)

        /*
            LOG TYPES :
            //no extra
            edit_project : edit project
            create_project : project created
            member_leave : member leaved the project

            //2 uid involved
            add_member : member added
            remove_member : member removed
            pass_ownership : project owner pass to member

            //has message
            create_milestone : milestone created
            edit_milestone : edit milestone
            delete_milestone : milestone deleted

            //
         */

        var log = {};

        if(type == "edit_project" || type == "create_project" || type == "member_leave") {
            log = {
                from: $scope.clientUid,
                type: type,
                date: new Date().getTime()
            };
        }else if(type == "create_milestone" || type == "edit_milestone" || type == "delete_milestone" || type == "add_log") {
            log = {
                from: $scope.clientUid,
                type: type,
                message: message,
                date: new Date().getTime()
            };
        }else if(type == "edit_log" || type == "delete_log" ){
            log = {
                from: $scope.clientUid,
                type: type,
                message: message,
                to : member,
                date: new Date().getTime()
            };
        }else{
            //add_member, remove_member, pass_ownership, edit_log_description
            log = {
                from : $scope.clientUid,
                type : type,
                date : new Date().getTime(),
                to : member
            };
        }

        //add log
        var projectLogsRef = $firebaseArray(firebaseRef.child('project_logs').child(projectId));
        projectLogsRef.$add(log);
    };

    $scope.notifyMilestone = function(projectId, milestoneId, discussionId, posterUid, discussionPosterId, type, message){

        //edit date modified
        var projectRef = firebaseRef.child('projects').child(projectId);
        projectRef.update({
            dateModified : new Date().getTime(),
            modifiedBy : $scope.clientUid
        });

        var seen = {};
        seen[$scope.clientUid] = true;
        projectRef.child('seen').set(seen)

        var projectMilestoneRef = firebaseRef.child('project_milestones').child(projectId).child(milestoneId);
        projectMilestoneRef.child('seen').set(seen);

        /*
         LOG TYPES :
         //no extra
         add_task : create task
         edit_task : edit task
         delete_task : member deleted the project
         check_task : member checked/unchecked the project

         add_discussion : add post
         edit_discussion : edit post
         delete_discussion : post post

         add/edit/delete_comment : comment
         */

        var log = {};

        if(type == "add_task" || type == "edit_task" || type == "delete_task" || type == "check_task") {
            //normal render
            log = {
                from: $scope.clientUid,
                type: type,
                message: message,
                date: new Date().getTime()
            };
        }else if(type == "add_discussion" || type == "edit_discussion"){
            //normal render + fetch post if exist
            log = {
                from: $scope.clientUid,
                type: type,
                message: message,
                discussionId : discussionId,
                date: new Date().getTime()
            };
        }else if(type == "delete_discussion"){
            //normal render + no link to post
            if(posterUid != null){
                log = {
                    from: $scope.clientUid,
                    type: type,
                    message: message,
                    discussionId : discussionId,
                    posterUid : posterUid,
                    date: new Date().getTime()
                };
            }else{
                log = {
                    from: $scope.clientUid,
                    type: type,
                    message: message,
                    discussionId : discussionId,
                    date: new Date().getTime()
                };
            }
        }else if(type == "delete_comment" || type == "add_comment" || type == "edit_comment"){
            /*
            add : normal render + link to post if exists
            edit : normal render + link to post if exists
            delete :  normal render + link to post if exists
             */
            log = {
                from: $scope.clientUid,
                type: type,
                message: message,
                discussionId : discussionId,
                discussionPosterId : discussionPosterId,
                posterUid : posterUid,
                date: new Date().getTime()
            };
        }

        //add log
        var milestoneLogsRef = $firebaseArray(firebaseRef.child('milestone_logs').child(projectId).child(milestoneId));
        milestoneLogsRef.$add(log);
    };

    $scope.checkIfPostExists = function(discussionId){

        var projectId = $scope.projectInfo.$id;
        var milestoneId = $scope.milestoneDetails.$id;
        var discussionRef = $firebaseObject(firebaseRef.child('milestone_discussions').child(projectId).child(milestoneId).child(discussionId));

        discussionRef.$loaded(function(){
            if(typeof discussionRef.title != 'undefined'){
                ProjectsService.setComments($scope.currentProjectKey, milestoneId, discussionId);
                $scope.milestonePostDetails = discussionRef;
                $scope.openModal(7);
            }else{
                $scope.openModal(10);
            }
        });
    };

    $scope.userNotExists = function(){
        var notExistsPopup = $ionicPopup.alert({
            title: "Error",
            templateUrl: "templates/user-not-exists-popup.html"
        });
        notExistsPopup.then(function(res) { });
    };

    $scope.userAlreadyMember = function(){
        var notExistsPopup = $ionicPopup.alert({
            title: "Error",
            templateUrl: "templates/already-member-popup.html"
        });
        notExistsPopup.then(function(res) { });
    };

    $scope.resetCheckers = function(){
        $scope.projectNameChecker = false;
        $scope.allottedHoursChecker = false;
        $scope.endDateChecker = false;
    };

    $scope.resetProjectDetails = function(){
        $scope.projectDetails = {
            projectName : "",
            allottedHours : "",
            startDate : new Date(),
            endDate : new Date(),
            colorLabel : '#4CAF50'
        };
    };

    $scope.displayDate = function(itemDate){

        var date = "";
        var todayMessageDateStart = moment().startOf('day').format("x");
        var todayMessageDateEnd = moment().endOf('day').format("x");

        var yesterdayMessageDateStart = moment().subtract(1, 'days').startOf('day').format("x");
        var yesterdayMessageDateEnd = moment().subtract(1, 'days').endOf('day').format("x");

        var weekMessageDateStart = moment().startOf('week').format("x");
        var weekMessageDateEnd = moment().endOf('week').format("x");

        var thisYearMessageDateStart = moment().startOf('year').format("x");
        var thisYearMessageDateEnd = moment().endOf('year').format("x");

        if(itemDate >= todayMessageDateStart && itemDate <= todayMessageDateEnd){
            date = "Today  " + moment(itemDate).format('h:mm a');
        }else if(itemDate >= yesterdayMessageDateStart && itemDate <= yesterdayMessageDateEnd) {
            date = "Yesterday  " + moment(itemDate).format('h:mm a');
        }else if(itemDate >= weekMessageDateStart && itemDate <= weekMessageDateEnd){
            date = moment(itemDate).format("dddd") + " " +  moment(itemDate).format('h:mm a');
        }else if(itemDate >= thisYearMessageDateStart && itemDate <= thisYearMessageDateEnd) {
            date = moment(itemDate).format("MMM Do");
        }else{
            date = moment(itemDate).format("MM/DD/YYYY");
        }

        return date;
    };
});