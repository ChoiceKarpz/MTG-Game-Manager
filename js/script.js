var app = angular.module("myApp", []);
app.controller("myCtrl", function ($scope) {

    if (sessionStorage.getItem("players") === null) {
        $scope.players = [];
    }
    else {
        $scope.players = JSON.parse(sessionStorage.getItem("players"));
    }

    $scope.playerName;
    $scope.indexPlayerToDelete;

    $scope.addPlayer = function () {
        var newPlayer = { name: $scope.playerName, life: 40, damage: [{ name: '', damageReceived: 0 }], experience: 0, poison: 0 };

        for (var i = 0; i < $scope.players.length; i++)
            newPlayer.damage.push({ name: $scope.players[i].name, damageReceived: 0 });

        $scope.players.push(newPlayer);
        $scope.playerName = "";

        $scope.setNameInputFocus();

        for (var i = 0; i < $scope.players.length; i++) {
            if ($scope.players[i] != newPlayer) {
                $scope.players[i].damage.push({ name: newPlayer.name, damageReceived: 0 });
            }
        }

        $scope.savePlayers();
    }


    $scope.getPlayerToDelete = function (playerToDelete) {
        $scope.indexPlayerToDelete = $scope.players.indexOf(playerToDelete);
    }

    $scope.deletePlayer = function () {
        $scope.players.splice($scope.indexPlayerToDelete, 1);
        $scope.savePlayers();
        $('#modalDeletePlayer').modal('close');
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
        playertoAlter.life += difference;
        $scope.savePlayers();
    }

    $scope.adjustCommanderDamage = function (attackingPlayer, difference) {
        attackingPlayer.damageReceived += difference;
        $scope.savePlayers();
    }

    $scope.adjustExperienceCounter = function (playertoAlter, difference) {
        playertoAlter.experience += difference;
        if (playertoAlter.experience < 0)
            playertoAlter.experience = 0;
        $scope.savePlayers();
    }

    $scope.adjustPoisonCounter = function (playertoAlter, difference) {
        playertoAlter.poison += difference;
        if (playertoAlter.poison < 0)
            playertoAlter.poison = 0;
        $scope.savePlayers();
    }
});

$(document).ready(function () {
    $('.modal').modal({ dismissible: false });
    $('.collapsible').collapsible();
});