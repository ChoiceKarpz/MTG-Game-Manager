var app = angular.module("myApp", []);
app.controller("myCtrl", function ($scope, $timeout, $http) {

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

    var currentID = $scope.players.length;
    $scope.playerName;
    $scope.newCounterName;
    var indexWorkingPlayer;
    var tempPlayer;

    $timeout(function () {
        $scope.refreshPlayers()
    }, 0);

    $scope.addPlayer = function () {
        var newPlayer = { id: currentID, name: $scope.playerName, life: 40, damage: [], counters: [] };

        currentID++;

        //add all old players to commander damage for new players
        for (var i = 0; i < $scope.players.length; i++)
            newPlayer.damage.push({ id: $scope.players[i].id, name: $scope.players[i].name, damageReceived: 0 });

        //add new player to all old players
        for (var i = 0; i < $scope.players.length; i++) {
            $scope.players[i].damage.push({ id: newPlayer.id, name: newPlayer.name, damageReceived: 0 });
        }

        $scope.players.push(newPlayer);
        $scope.gameLog.push("Added " + newPlayer.name);
        $scope.playerName = "";

        $scope.setNameInputFocus();


        $scope.savePlayers();

        $timeout(function () {
            $scope.refreshPlayers()
        }, 0);


    }


    $scope.getWorkingPlayer = function (player) {
        indexWorkingPlayer = $scope.players.indexOf(player);
    }

    $scope.deletePlayer = function () {
        //delete the player from other players under commander damage, before deleting themselves

        for (var i = 0; i < $scope.players.length; i++) {
            if (i != indexWorkingPlayer) {
                for (var j = 0; j < $scope.players[i].damage.length; j++) {
                    if ($scope.players[i].damage[j].id == $scope.players[indexWorkingPlayer].id) {
                        $scope.players[i].damage.splice(j, 1);
                    }
                }
            }
        }

        $scope.temp = $scope.players[indexWorkingPlayer];
        $scope.players.splice(indexWorkingPlayer, 1);
        $scope.gameLog.push("Deleted " + $scope.temp.name);
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
        $('.playerInfo').modal(
            {
                ready: function () { // Callback for Modal open. Modal and trigger parameters available.
                    tempPlayer = JSON.parse(JSON.stringify($scope.players[indexWorkingPlayer]));
                },

                complete: function () {
                    $scope.$apply(function () {

                        if (tempPlayer.life != $scope.players[indexWorkingPlayer].life) {
                            $scope.gameLog.push("Life for " + tempPlayer.name + " altered by " + ($scope.players[indexWorkingPlayer].life - tempPlayer.life) + " (" + $scope.players[indexWorkingPlayer].life + ")");
                        }

                        for (var i = 0; i < $scope.players[indexWorkingPlayer].damage.length; i++) {
                            if (tempPlayer.damage[i].damageReceived != $scope.players[indexWorkingPlayer].damage[i].damageReceived) {
                                $scope.gameLog.push("Commander damage to " + tempPlayer.name + " from " + tempPlayer.damage[i].name + " altered by " + ($scope.players[indexWorkingPlayer].damage[i].damageReceived - tempPlayer.damage[i].damageReceived) + " (" + $scope.players[indexWorkingPlayer].damage[i].damageReceived + ")");
                            }
                        }

                        for (var i = 0; i < $scope.players[indexWorkingPlayer].counters.length; i++) {
                            if (tempPlayer.counters[i].value != $scope.players[indexWorkingPlayer].counters[i].value) {
                                $scope.gameLog.push(tempPlayer.counters[i].name + " counters for " + tempPlayer.name + " altered by " + ($scope.players[indexWorkingPlayer].counters[i].value - tempPlayer.counters[i].value) + " (" + $scope.players[indexWorkingPlayer].counters[i].value + ")");
                            }
                        }

                        $scope.savePlayers();
                    }) // Callback for Modal close)
                }
            }
        );
    }

    $scope.setNameInputFocus = function () {
        document.getElementById("playerNameInput").focus();
    }

    $scope.adjustPlayerLife = function (playertoAlter, difference) {
        playertoAlter.life = Math.round(playertoAlter.life + difference);
        $scope.savePlayers();

    }

    $scope.adjustCommanderDamage = function (defendingPlayer, attackingPlayer, difference) {
        attackingPlayer.damageReceived += difference;
        $scope.savePlayers();
    }


    $scope.addNewCounter = function () {
        $scope.players[indexWorkingPlayer].counters.push({ name: $scope.newCounterName, value: 0 });
        //add it to temp player as well, otherwise adding to the game log won't work
        tempPlayer.counters.push({ name: $scope.newCounterName, value: 0 });
        $('#modalAddCounter').modal('close');
        $scope.newCounterName = "";
        $scope.savePlayers();
    }

    $scope.alterCounter = function (player, counterToAlter, difference) {
        counterToAlter.value += difference;
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


    //Card Lookup Shit

    $scope.cardSearchName = "";

    // var defaultCardLookup = $("#cardLookup").html();
    // console.log(defaultCardLookup);

    $scope.searchCards = function () {
        $http.get("https://api.magicthegathering.io/v1/cards?name=" + $scope.cardSearchName)
            .then(function (response) {

                $scope.cardsArray = response.data;
                $timeout(function () {
                    $('.collapsible').collapsible();

                    $(".manaCost, .cardText").html(function (_, html) {
                        return html.replace(/\{([\d]|[A-Z])\}/g, function (fullMatch, group1) {
                            group1 = group1.toLowerCase();
                            if (group1 == "t") {
                                group1 = "tap";
                            }
                            if (group1 == "q") {
                                group1 = "untap";
                            }
                            return "<i class='ms ms-cost ms-" + group1 + "'></i>";
                        })
                    });

                    $(".planeswalker").html(function (_, html) {
                        return html.replace(/\+([\d])\:/g, "<i class=\"ms ms-loyalty-up ms-loyalty-$1\"></i>")
                            .replace(/\−([\d])\:/g, "<i class=\"ms ms-loyalty-down ms-loyalty-$1\"></i>");

                    });


                }, 0);


            });
    }



});
