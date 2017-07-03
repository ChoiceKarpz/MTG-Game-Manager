var app = angular.module("myApp", []);
app.controller("myCtrl", function ($scope) {
    $scope.players = [
        { name: 'Campbell', life: 0 },
        { name: 'Ben', life: 0 },
        { name: 'Dylan', life: 0 },
        { name: 'Blake', life: 0 }
    ];
});