angular.module('ncsolar').controller('BodyCtrl', ["$scope", "$interval", "$log", "Restangular", "alert", "formAlert", function ($scope, $interval, $log, Restangular, alert, formAlert) {
    // for future use
    $scope._alert = alert;
    $scope._fAlert = formAlert;
}]);
