angular.module('projectmanager.directives', [])

.directive("checkEmail", function(){
    return {
        restrict    : "E",
        link        : function(scope, elem, attrs){
            elem.bind('blur', function() {
                scope.$apply("checkEmail()");
            });

            elem.bind('focus',  function() {
                scope.$apply("disableCtn()");
                scope.$apply("disableCtn()");
            });
        }
    }
})

;