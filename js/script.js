var app = angular.module("myApp", []);
app.controller("myCtrl", function ($scope) {
    $scope.players = [];
    $scope.playerName;

    $scope.addPlayer = function () {
        var newPlayer = { name: $scope.playerName, life: 40 };
        $scope.players.push(newPlayer);
        $scope.playerName = "";
    }

    $scope.deletePlayer = function (playertoDelete) {
        var index = $scope.players.indexOf(playertoDelete);
        $scope.players.splice(index, 1);
    }
});

$(document).ready(function () {
    $(".button-collapse").sideNav();
    $('.modal').modal();
});