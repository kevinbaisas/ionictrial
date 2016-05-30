angular.module('projectmanager.controllers')

.controller('Test', function($scope){

    $scope.data = [
        {
            value: 300,
            color:"#F7464A",
            highlight: "#FF5A5E",
            label: "Red"
        },
        {
            value: 50,
            color: "#46BFBD",
            highlight: "#5AD3D1",
            label: "Green"
        },
        {
            value: 100,
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "Yellow"
        }
    ];

    $scope.ctx = null;
    $scope.chart = null;

    // String - Animation easing effect
    // Possible effects are:
    // [easeInOutQuart, linear, easeOutBounce, easeInBack, easeInOutQuad,
    //  easeOutQuart, easeOutQuad, easeInOutBounce, easeOutSine, easeInOutCubic,
    //  easeInExpo, easeInOutBack, easeInCirc, easeInOutElastic, easeOutBack,
    //  easeInQuad, easeInOutExpo, easeInQuart, easeOutQuint, easeInOutCirc,
    //  easeInSine, easeOutExpo, easeOutCirc, easeOutCubic, easeInQuint,
    //  easeInElastic, easeInOutSine, easeInOutQuint, easeInBounce,
    //  easeOutElastic, easeInCubic]
    $scope.refresh = function(){
        $scope.ctx = document.getElementById("doughnut").getContext("2d");
        $scope.chart = new Chart($scope.ctx);

        $scope.chart.Doughnut($scope.data, {
            responsive : true,
            animationEasing: "easeInCubic"
        });
    };

    $scope.update = function(){


        $scope.data = [
            {
                value: Math.random() * 100,
                color:"#F7464A",
                highlight: "#FF5A5E",
                label: "Red"
            },
            {
                value: Math.random() * 100,
                color: "#46BFBD",
                highlight: "#5AD3D1",
                label: "Green"
            },
            {
                value: Math.random() * 100,
                color: "#FDB45C",
                highlight: "#FFC870",
                label: "Yellow"
            }
        ];

        $scope.chart.Doughnut($scope.data, {
            responsive : true,
            animation: false
        });
    };
});