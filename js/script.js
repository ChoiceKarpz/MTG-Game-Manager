var app = angular.module("myApp", []);
app.controller("myCtrl", function ($scope, $timeout) {

    if (sessionStorage.getItem("players") === null) {
        $scope.players = [];
    }
    else {
        $scope.players = JSON.parse(sessionStorage.getItem("players"));
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

        $scope.players.splice($scope.indexWorkingPlayer, 1);
        $scope.savePlayers();
        $('#modalDeletePlayer').modal('close');
        Materialize.toast('Player deleted!', 4000);

        $timeout(function () {
            $scope.refreshPlayers()
        }, 0);
    }

    $scope.savePlayers = function () {
        sessionStorage.setItem("players", JSON.stringify($scope.players));
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
        $scope.savePlayers();
    }

    $scope.adjustCommanderDamage = function (attackingPlayer, difference) {
        attackingPlayer.damageReceived += difference;
        $scope.savePlayers();
    }

    $scope.addNewCounter = function() {
        $scope.players[$scope.indexWorkingPlayer].counters.push({name: $scope.newCounterName, value: 0});
        $('#modalAddCounter').modal('close');
        $scope.newCounterName = "";
        $scope.savePlayers();
    }

    $scope.alterCounter = function(counterToAlter, difference) {
        counterToAlter.value += difference;
        $scope.savePlayers();
    }

    $scope.deleteCounter = function(player, counterToDelete) {
        for (var i = 0; i < player.counters.length; i++) {
            if(player.counters[i] == counterToDelete) {
                 player.counters.splice(i, 1);
                 break;
            }
               
        }
        $scope.savePlayers();
    }

    // $scope.adjustExperienceCounter = function (playertoAlter, difference) {
    //     playertoAlter.experience += difference;
    //     if (playertoAlter.experience < 0)
    //         playertoAlter.experience = 0;
    //     $scope.savePlayers();
    // }

    // $scope.adjustPoisonCounter = function (playertoAlter, difference) {
    //     playertoAlter.poison += difference;
    //     if (playertoAlter.poison < 0)
    //         playertoAlter.poison = 0;
    //     $scope.savePlayers();
    // }

});


$(document).ready(function () {
    $('.collapsible').collapsible();
    $('.modal').modal();

});