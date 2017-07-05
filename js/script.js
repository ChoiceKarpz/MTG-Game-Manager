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
        $scope.setNameInputFocus();
    }


    $scope.deletePlayer = function (playertoDelete) {
        var index = $scope.players.indexOf(playertoDelete);
        $scope.players.splice(index, 1);
        $scope.savePlayers();
    }

    $scope.savePlayers = function () {
        sessionStorage.setItem("players", JSON.stringify($scope.players));
    }

    $scope.setNameInputFocus = function () {
        document.getElementById("playerNameInput").focus();
    }

    $scope.refreshPlayers = function () {
        $('.collapsible').collapsible();
    }

    $scope.adjustPlayerLife = function (playertoAlter, difference) {
        var index = $scope.players.indexOf(playertoAlter);
        $scope.players[index].life += difference;
        $scope.savePlayers();
    }
});

$(document).ready(function () {
    $('.modal').modal({ dismissible: false });
    $('.collapsible').collapsible();
});