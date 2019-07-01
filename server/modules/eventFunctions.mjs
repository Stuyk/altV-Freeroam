import * as alt from 'alt';
import * as extended from 'server-extended'; //https://github.com/team-stuyk-alt-v/altV-Extended
import * as chat from 'chat'; //https://github.com/team-stuyk-alt-v/altV-Chat-Extended
import { skinList } from './skins.mjs';
import * as utility from './utility.mjs';

const spawnLocation = {x: -1136.07, y: -3044.18, z: 14.1};
var disconnectedPlayers = new Map();

export function playerFirstJoin(player) {
	// Prevent reconnections to the server to some degree.
	if (disconnectedPlayers.get(player.name)) {
		extended.SetupExportsForPlayer(player);
		player.fadeScreen(true, 5000);
		player.freeze(true);
		disconnectedPlayers.set(player.name, Date.now() + 120000);
		chat.send(player, '{FF0000} You recently disconnected. Please close your game and rejoin.');
		setTimeout(() => {
			player.kick();
		}, 15000);
		return;
	}

	alt.emit('broadcastMessage', `{FFF000}${player.name}{FFFFFF} has joined the server.`);
	utility.loadModelForPlayers(player);

	SpawnPlayer(player); 
}

export function playerDisconnect(player) {
	// Remove from dimension if they're in one.
	if (player.currentDimension)
		player.currentDimension.Remove(player);

	// Disconnect the player for 25 seconds.
	disconnectedPlayers.set(player.name, Date.now() + 120000);
}

export function checkDisconnects() {
	disconnectedPlayers.forEach((time, name) => {
		if (Date.now() < time)
			return;

		disconnectedPlayers.delete(name);
		console.log(`===> ${name} is free to rejoin.`);
	});
}

export function respawnPlayer(target) {
	target.showSubtitle('~r~You have died; you will be respawned shortly.', 5000);
	const randomPosition = extended.RandomPosAround(spawnLocation, 50);
    
	const skin = target.model;
	target.fadeScreen(true, 3000);
    
	setTimeout(() => {
		target.model = skin;
		target.spawn(randomPosition.x, randomPosition.y, randomPosition.z);
		target.health = 200;
		target.fadeScreen(false, 2000);
	}, 4000);
}

function SpawnPlayer(player) {
	const randomPosition = extended.RandomPosAround(spawnLocation, 30);
	const randomModel = Math.floor(Math.random() * skinList.length);
	player.model = alt.hash(skinList[randomModel]);
    
	// Wait to set player health.
	setTimeout(() => {
		player.pos = randomPosition;
		player.health = 200;
	}, 1000);
    
	// Setup for extended / chat
	chat.setupPlayer(player);
	extended.SetupExportsForPlayer(player);
}