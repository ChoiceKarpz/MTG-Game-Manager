var app = angular.module("myApp", []);
app.controller("myCtrl", function ($scope, $timeout) {

    if (sessionStorage.getItem("players") === null) {
        $scope.players = [];
    }
    else {
        $scope.players = JSON.parse(sessionStorage.getItem("players"));
    }

    if (sessionStorage.getItem("gameLog") === null) {
        $scope.gameLog = [];
    }
    else {
        $scope.gameLog = JSON.parse(sessionStorage.getItem("gameLog"));
    }

    $scope.currentID = $scope.players.length;
    $scope.playerName;
    $scope.newCounterName;
    $scope.indexWorkingPlayer;

    $scope.addPlayer = function () {
        var newPlayer = { id: $scope.currentID, name: $scope.playerName, life: 40, damage: [], counters: [] };

        $scope.currentID++;

        //add all old players to commander damage for new players
        for (var i = 0; i < $scope.players.length; i++)
            newPlayer.damage.push({ id: $scope.players[i].id, name: $scope.players[i].name, damageReceived: 0 });

        //add new player to all old players
        for (var i = 0; i < $scope.players.length; i++) {
            $scope.players[i].damage.push({ id: newPlayer.id, name: newPlayer.name, damageReceived: 0 });
        }

        $scope.players.push(newPlayer);
        $scope.gameLog.push({ text: "Added " + newPlayer.name + " [id = " + newPlayer.id + "]", difference: "", endTotal: "" });
        $scope.concatGameLog();
        $scope.playerName = "";

        $scope.setNameInputFocus();


        $scope.savePlayers();

        $timeout(function () {
            $scope.refreshPlayers()
        }, 0);


    }


    $scope.getWorkingPlayer = function (player) {
        $scope.indexWorkingPlayer = $scope.players.indexOf(player);
    }

    $scope.deletePlayer = function () {
        //delete the player from other players under commander damage, before deleting themselves

        for (var i = 0; i < $scope.players.length; i++) {
            if (i != $scope.indexWorkingPlayer) {
                for (var j = 0; j < $scope.players[i].damage.length; j++) {
                    if ($scope.players[i].damage[j].id == $scope.players[$scope.indexWorkingPlayer].id) {
                        $scope.players[i].damage.splice(j, 1);
                    }
                }
            }
        }

        $scope.temp = $scope.players[$scope.indexWorkingPlayer];
        $scope.players.splice($scope.indexWorkingPlayer, 1);
        $scope.gameLog.push({ text: "Deleted " + $scope.temp.name + " [id = " + $scope.temp.id + "]", difference: "", endTotal: "" });
        $scope.concatGameLog();
        $scope.savePlayers();
        $('#modalDeletePlayer').modal('close');
        Materialize.toast('Player deleted!', 4000);

        $timeout(function () {
            $scope.refreshPlayers()
        }, 0);
    }

    $scope.savePlayers = function () {
        sessionStorage.setItem("players", JSON.stringify($scope.players));
        sessionStorage.setItem("gameLog", JSON.stringify($scope.gameLog));
    }

    $scope.refreshPlayers = function () {
        $('.collapsible').collapsible();
        $('.modal').modal();
    }

    $scope.setNameInputFocus = function () {
        document.getElementById("playerNameInput").focus();
    }

    $scope.adjustPlayerLife = function (playertoAlter, difference) {
        playertoAlter.life = Math.round(playertoAlter.life + difference);
        $scope.gameLog.push({ text: "Life of " + playertoAlter.name + " altered by ", difference: difference, endTotal: " (" + playertoAlter.life + ")" });
        $scope.concatGameLog();
        $scope.savePlayers();

    }

    $scope.adjustCommanderDamage = function (defendingPlayer, attackingPlayer, difference) {
        attackingPlayer.damageReceived += difference;
        $scope.gameLog.push({ text: "Commander damage to " + defendingPlayer.name + " by " + attackingPlayer.name + " altered by ", difference: difference, endTotal: " (" + attackingPlayer.damageReceived + ")" });
        $scope.concatGameLog();
        $scope.savePlayers();
    }


    $scope.addNewCounter = function () {
        $scope.players[$scope.indexWorkingPlayer].counters.push({ name: $scope.newCounterName, value: 0 });
        $('#modalAddCounter').modal('close');
        $scope.newCounterName = "";
        $scope.savePlayers();
    }

    $scope.alterCounter = function (player, counterToAlter, difference) {
        counterToAlter.value += difference;
        $scope.gameLog.push({ text: counterToAlter.name + " counters for " + player.name + " altered by ", difference: difference, endTotal: " (" + counterToAlter.value + ")" });
        $scope.concatGameLog();
        $scope.savePlayers();
    }

    $scope.deleteCounter = function (player, counterToDelete) {
        for (var i = 0; i < player.counters.length; i++) {
            if (player.counters[i] == counterToDelete) {
                player.counters.splice(i, 1);
                break;
            }

        }
        $scope.savePlayers();
    }

    $scope.concatGameLog = function () {
        if ($scope.gameLog.length >= 2) {
            for (var i = 0; i < $scope.gameLog.length - 1; i++) {
                if ($scope.gameLog[i].text == $scope.gameLog[i + 1].text) {
                    $scope.gameLog[i + 1].difference += $scope.gameLog[i].difference;
                    $scope.gameLog.splice(i, 1);
                }
            }
        }

    }

});


$(document).ready(function () {
    $('.collapsible').collapsible();
    $('.modal').modal();

});

