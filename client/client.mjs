import * as alt from 'alt';
import * as native from 'natives';
import * as extended from 'server-extended'; //https://github.com/team-stuyk-alt-v/altV-Extended

// Load Animation Libraries:
function loadAnimationLibraries() {
	if (!native.hasAnimDictLoaded('mp_suicide'))
		native.requestAnimDict('mp_suicide');
}

loadAnimationLibraries();

alt.onServer('warpIntoVehicle', (veh) => {
	alt.setTimeout(() => {
		native.setPedIntoVehicle(alt.getLocalPlayer().scriptID, veh.scriptID, -1);
	}, 100);
});

alt.onServer('updateModel', (model) => {
	if (native.hasModelLoaded(native.getHashKey(model)))
		return;

	native.requestModel(native.getHashKey(model));
});

alt.onServer('suicidePlayer', (player) => {
	native.giveWeaponToPed(player.scriptID, 453432689, 1, false, true);

	// 1021093698
	if (native.getEntityModel(player.scriptID) === native.getHashKey('s_m_y_mime')) {
		native.giveWeaponToPed(player.scriptID, -1569615261, 99, false, true);
	}
  
	alt.setTimeout(() => {
		native.taskPlayAnim(player.scriptID, 'mp_suicide', 'pistol', 8.0, 1.0, -1, 2, 0, 0, 0, 0);
	}, 500);
  
	alt.setTimeout(() => {
		native.setPedShootsAtCoord(player.scriptID, 0, 0, 0, true);

		if (player.scriptID !== alt.getLocalPlayer().scriptID)
			return;

		alt.emitServer('killSelf');
	}, 1250);
});

alt.on('update', () => {
	alt.Player.all.forEach((player) => {
		// Don't draw local player.
		if (player == alt.getLocalPlayer())
			return;

		// Determine the distance we want to draw from.
		let distanceFromLocal = extended.Distance(player.pos, alt.getLocalPlayer().pos);
		if (distanceFromLocal >= 25)
			return;

		// Make sure player is on screen.
		let result = native.getScreenCoordFromWorldCoord(player.pos.x, player.pos.y, player.pos.z + 1.20, undefined, undefined);
		if (!result[0])
			return;

		let scale = distanceFromLocal / 25;
		if (scale < 0.5) {
			scale = 0.5;
		}

		if (scale > 0.6)
			scale = 0.6;

		let yModifier = (distanceFromLocal / 25) / 8;
		if (yModifier > 0.05)
			yModifier = 0.05;

		let y = result[2] - yModifier;

		if (y <= 0)
			y = 0;
      
		// Player health starts at 200, subtract 100 to normalize. Divide by 100 (AKA MAX HEALTH) to get the real value.
		let pHealth = ((native.getEntityHealth(player.scriptID) - 100) / 100) * 0.05;

		// Scaling Math
		extended.drawText(player.name, result[1], y, scale, 4, 255, 255, 255, 255, true, false);
		native.drawRect(result[1], y + 0.05, pHealth, 0.01, 255, 0, 0, 100);
	});
});

