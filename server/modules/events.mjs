import * as alt from 'alt';
import * as eventFuncs from './eventFunctions.mjs';

// Called when the player spawns.
alt.on('playerConnect', eventFuncs.playerFirstJoin);

// Called when the player disconnects.
alt.on('playerDisconnect', eventFuncs.playerDisconnect);

// Handle disconnected players.
setInterval(eventFuncs.checkDisconnects, 5000);

// Called when the player dies.
alt.on('playerDeath', eventFuncs.respawnPlayer);

// Called when the player kill themself.
alt.onClient('killSelf', (player) => {
	player.health = 0;
});

