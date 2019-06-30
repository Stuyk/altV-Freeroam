import * as alt from 'alt';
import * as extended from 'server-extended'; //https://github.com/team-stuyk-alt-v/altV-Extended
import * as chat from 'chat'; //https://github.com/team-stuyk-alt-v/altV-Chat-Extended
import { skinList } from './skins.mjs';
import { CurrentDimensions } from './dimension.mjs';
import * as utility from './utility.mjs';

const spawnLocation = {x: -1136.07, y: -3044.18, z: 14.1};

// Called when the player connects.
alt.on('playerConnect', (player) => {
    alt.emit('broadcastMessage', `{FFF000}${player.name}{FFFFFF} has joined the server.`);

    // Spawns the player.
    SpawnPlayer(player); 

    // Update Player Models
    UpdateCurrentPlayerModels(player);
});

alt.on('playerDisconnect', (player) => {
    // Dimension Helper
    if (player.currentDimension !== undefined) {
        player.currentDimension.Remove(player);
    }
});

function SpawnPlayer(player) {
    var randomPosition = extended.RandomPosAround(spawnLocation, 30);
    var randomModel = Math.floor(Math.random() * skinList.length);
    player.model = alt.hash(skinList[randomModel]);
    player.pos = randomPosition;
    player.dimension = 1;
    setTimeout(() => {
        player.dimension = 0;
        player.health = 200;
    }, 1000);

    // Setup for extended / chat
    chat.setupPlayer(player);
    extended.SetupExportsForPlayer(player);
}

function UpdateCurrentPlayerModels(player) {
    alt.Player.all.forEach((target) => {
        alt.emitClient(player, 'updateModel', target.model);
        alt.emitClient(target, 'updateModel', player.model);
    });
}

// Called when the player dies.
alt.on('playerDeath', (target, killer, weapon) => {
    target.showSubtitle("~r~You have died; you will be respawned shortly.", 5000);
    var randomPosition = extended.RandomPosAround(spawnLocation, 50);
    
    var skin = target.model;
    target.fadeScreen(true, 3000);
    
    setTimeout(() => {
        target.model = skin;
        target.spawn(randomPosition.x, randomPosition.y, randomPosition.z);
        target.health = 200;
        target.fadeScreen(false, 2000);
    }, 4000);
});

alt.onClient('killSelf', (player) => {
    player.health = 0;
});

