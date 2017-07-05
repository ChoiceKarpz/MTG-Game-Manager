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
        var newPlayer = { name: $scope.playerName, life: 40, damage: [{name: '', damageReceived: 0}] };

        for (var i = 0; i < $scope.players.length; i++)
            newPlayer.damage.push({ name: $scope.players[i].name, damageReceived: 0 });

        alert(newPlayer.damage);

        $scope.players.push(newPlayer);
        $scope.playerName = "";
        $scope.savePlayers();
        $scope.setNameInputFocus();

        for (var i = 0; i < $scope.players.length; i++) {
            if ($scope.players[i] != newPlayer) {
                $scope.players[i].damage.push({ name: newPlayer.name, damageReceived: 0 });
            }
        }
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

    $scope.adjustCommanderDamage = function (defendingPlayer, attackingPlayer, difference) {
        var indexDefender = $scope.players.indexOf(defendingPlayer);
        var indexAttacker = $scope.players[indexDefender].damage.indexOf(attackingPlayer);
        $scope.players[indexDefender].damage[indexAttacker].damageReceived += difference;
        $scope.savePlayers();
    }
});

$(document).ready(function () {
    $('.modal').modal({ dismissible: false });
    $('.collapsible').collapsible();
});