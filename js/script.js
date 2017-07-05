var app = angular.module("myApp", []);
app.controller("myCtrl", function ($scope) {

    if (sessionStorage.getItem("players") === null) {
        $scope.players = [];
    }
    else {
        $scope.players = JSON.parse(sessionStorage.getItem("players"));
    }

    $scope.playerName;

    $scope.addPlayer = function () {
        var newPlayer = { name: $scope.playerName, life: 40 };
        $scope.players.push(newPlayer);
        $scope.playerName = "";
        $scope.savePlayers();
        document.getElementById("playerNameInput").focus();
    }

    $scope.deletePlayer = function (playertoDelete) {
        var index = $scope.players.indexOf(playertoDelete);
        $scope.players.splice(index, 1);
        $scope.savePlayers();
    }

    $scope.savePlayers = function () {
        sessionStorage.setItem("players", JSON.stringify($scope.players));
    }
});

$(document).ready(function () {
    $(".button-collapse").sideNav();
    $('.modal').modal();
    $('.collapsible').collapsible();
});