import * as extended from 'server-extended'; // https://github.com/team-stuyk-alt-v/altV-Extended
import * as alt from 'alt';
import { weaponList } from './weapons.mjs';
import { Dimension, CurrentDimensions } from './dimension.mjs';
import * as utility from './utility.mjs';

/**
 * Give a weapon to yourself.
 * @param player
 * @param arg
 */
export function giveWeapon(player, arg) {
	const weaponName = arg[0].toLowerCase();
    
	if (!weaponList[weaponName])
		return player.sendMessage('{FF0000}Weapon type is not valid.');

	player.showNotification('CHAR_AMMUNATION', '/wep', `You've recieved ~y~${weaponName}~w~.`, '');
	player.giveWeapon(weaponList[weaponName], 999, true);
}

/**
 * Clear the weapons the player currently has.
 * @param player
 */
export function clearWeapons(player) {
	player.showSubtitle('~r~Your weapons were cleared.', 5000);
	player.removeAllWeapons();
}

/**
 * Spawn a vehicle and set the player into the vehicle.
 * @param player
 * @param arg
 */
export function spawnVehicle(player, arg) {
	if (!arg[0])
		return player.sendMessage('{FF0000}Vehicle type is not valid.');

	if (player.personalVehicle !== undefined) {
		try {
			player.personalVehicle.destroy();
		} catch (err) {
			player.personalVehicle = undefined;
		}
	}
		
	const positionNear = extended.RandomPosAround(player.pos, 10);

	try {
		player.personalVehicle = new alt.Vehicle(arg[0], positionNear.x, positionNear.y, positionNear.z, 0, 0, 0);
		player.personalVehicle.dimension = player.dimension;
		alt.emitClient(player, 'warpIntoVehicle', player.personalVehicle);
		player.showSubtitle('~g~You have spawned a vehicle.', 3000);
	} catch(err) {
		player.personalVehicle = undefined;
		player.sendMessage('{FF0000}Vehicle type is not valid.');
	}
}

/**
 * Set the customPrimary Color for a vehicle.
 * @param player
 * @param arg [r, g, b]
 */
export function setVehicleColor1(player, arg) {
	if (!player.vehicle)
		return player.sendMessage('{FF0000}You are not in a vehicle.');

	if (arg.length !== 3)
		return player.sendMessage('{FF0000}/vehcolor1 [r] [g] [b]');

	player.vehicle.customPrimaryColor = { r: arg[0], g: arg[1], b: arg[2] };
}

/**
 * Set the customPrimary Color for a vehicle.
 * @param player
 * @param arg [r, g, b]
 */
export function setVehicleColor2(player, arg) {
	if (!player.vehicle)
		return player.sendMessage('{FF0000}You are not in a vehicle.');

	if (arg.length !== 3)
		return player.sendMessage('{FF0000}/vehcolor1 [r] [g] [b]');

	player.vehicle.customSecondaryColor = { r: arg[0], g: arg[1], b: arg[2] };
}

/**
 * Return the position of the player to the player's chatbox.
 * @param player
 */
export function getPos(player) {
	player.sendMessage(`${JSON.stringify(player.pos)}`);
}

/**
 * Set the skin for the player. Takes a string parameter.
 * @param player
 * @param arg
 */
export function setSkin(player, arg) {
	if (!arg[0])
		return player.sendMessage('{FF0000}Skin type is not valid.');

	try {
		player.model = arg[0];
		utility.loadModelForPlayers(player);
		player.showSubtitle('~g~You have changed your skin.', 5000);
	} catch(err) {
		player.showSubtitle('~r~Incorrect model name.', 5000);
	}
}

/**
 * Teleport to a player by name.
 * @param player
 * @param arg [playerName]
 */
export function teleportToPlayer(player, arg) {
	if (!arg[0])
		return player.sendMessage('{FF0000}/tpto [playername]');

	const target = alt.getPlayersByName(arg[0]);

	if (!target || !target[0])
		return player.sendMessage('{FF0000}Player does not exist.');

	if (Array.isArray(target) && target.length >= 2)
		return player.sendMessage('{FF0000}Too many players found; be more specific.');

	if (target[0].dimension !== player.dimension)
		return player.sendMessage('{FF0000}You are not in the same dimension.');

	player.pos = target[0].pos;
}

/**
 * Teleport to coordinates
 * @param player
 * @param arg [x, y, z]
 */
export function teleportToCoordinates(player, arg) {
	if (!arg[0])
		return player.sendMessage('{FF0000}/tp [x] [y] [z]');

	if (arg.length !== 3)
		return player.sendMessage('{FF0000}/tp [x] [y] [z]');

	player.pos = { x: arg[0], y: arg[1], z: arg[2] };
}

/**
 * Kill the player. Shoots himself.
 * @param player
 */
export function killSelf(player) {
	utility.suicidePlayer(player);
}

/**
 * Set a player's dimension and make it private.
 * @param player
 * @param arg [dimensionID]
 */
export function setDimension(player, arg) {
	if (!arg[0])
		return player.sendMessage('{FF0000}/dimension [number]');

	// Get players current dimension.
	// Check if they are the leader; kick all players from dimension if they are.
	// Otherwise just leave the dimension.
	if (player.currentDimension !== undefined) {
		// Kick all players from dimension if owner.
		if (player.currentDimension.leader === player) {
			player.currentDimension.KickAll();
		} else {
			// Remove from current dimension.
			player.currentDimension.Remove(player);
			player.dimension = 0;
			player.currentDimension = undefined;
		}
	}

	// If current dimension is 0.
	if (parseInt(arg[0]) === 0)
		return;

	let playersInCurrentDimension = alt.Player.all.find(x => x.dimension === parseInt(arg[0]));

	if (playersInCurrentDimension !== undefined)
		return player.sendMessage('{FF0000} That dimension is currently in use.');

	// Create a new dimension and set the player as the party leader.
	// Also set the player into that dimension.
	let dimension = new Dimension(player, arg[0]);
	CurrentDimensions.set(`${arg[0]}`, dimension);
	player.currentDimension = dimension; 
	player.dimension = arg[0];
	player.showSubtitle(`You have joined dimension: ${arg[0]}`, 3000);
}

/**
 * Invite a player to a dimension.
 * @param player
 * @param arg
 */
export function inviteDimension(player, arg) {
	if (!arg[0])
		return player.sendMessage('{FF0000}/invite [playername]');

	if (arg[0].length <= 2)
		return player.sendMessage('{FF0000}Please specify at least 3 characters for a username.');

	if (player.dimension <= 0)
		return player.sendMessage('{FF0000}Cannot invite to dimension 0.');

	if (!player.currentDimension) {
		player.sendMessage('{FF0000}/dimension [number]');
		return;
	}

	if (player.currentDimension.leader !== player)
		return player.sendMessage('{FF0000}You are not the dimension leader.');

	const players = alt.getPlayersByName(arg[0]);

	if (!players)
		return player.sendMessage('{FF0000}No users were found.');

	for (let i = 0; i < players.length; i++) {
		if (players[i] === player)
			continue;

		players[i].lastInvite = `${player.dimension}`;
		players[i].sendMessage(`{00FF00}You recieved an invite for dimension ${player.dimension} from ${player.name}`);
		players[i].sendMessage('Type {FFF000}/joindim {FFFFFF}to join the dimension.');
	}
}

/**
 * Join a dimension by invite.
 * @param player
 */
export function joinDimension(player) {
	if (!player.lastInvite)
		return player.sendMessage('{FF0000}No dimension is available to join.');
        

	const currentDimension = CurrentDimensions.get(player.lastInvite);

	if (!currentDimension) {
		player.lastInvite = undefined;
		return player.sendMessage('{FF0000}The dimension invite has expired.');
	}

	currentDimension.Join(player);
}

/**
 * Kick a player from your dimension.
 * Requires dimension leader.
 * @param player
 * @param arg
 */
export function kickFromDimension(player, arg) {
	if (!arg[0])
		return player.sendMessage('{FF0000}/invite [playername]');

	if (!player.currentDimension) 
		return player.sendMessage('{FF0000}/dimension [number]');

	if (player.currentDimension.leader !== player)
		return player.sendMessage('{FF0000}You are not the dimension leader.');

	player.currentDimension.Kick(arg[0]);
}
