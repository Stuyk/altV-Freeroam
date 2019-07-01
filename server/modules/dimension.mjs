import * as alt from 'alt';
export const CurrentDimensions = new Map();

export class Dimension {
	constructor(leader, dimensionID) {
		this.leader = leader;
		this.dimensionID = dimensionID;
		this.players = [];
		this.players.push(leader);
	}

	Join(player) {
		this.players.push(player);
		player.dimension = this.dimensionID;
		player.showSubtitle(`You have joined dimension: ${this.dimensionID}`, 3000);

		this.players.forEach((target) => {
			alt.emitClient(player, 'updateModel', target.model);
			alt.emitClient(target, 'updateModel', player.model);
		});
	}

	Remove(player) {
		const result = this.players.findIndex(player);

		if (!result || result <= -1)
			return;

		this.players.splice(result, 1);

		if (this.players.length >= 1 && player !== this.leader)
			return;

		this.players.forEach((p) => {
			if (p === player)
				return;
            
			p.dimension = 0;
			p.sendMessage('The dimension has closed.');
			p.currentDimension = undefined;
		});
	}

	KickAll() {
		this.players.forEach((p) => {
			p.dimension = 0;
			p.sendMessage('The dimension has closed.');
			p.currentDimension = undefined;
		});
	}

	Kick(playerName) {
		if (this.players.length <= 1)
			return this.leader.sendMessage('{FF0000}Failed to kick player from dimension.');

		const player = this.players.find(x => x.name === playerName);

		if (!player)
			return this.leader.sendMessage('{FF0000}Failed to kick player from dimension.');

		player.dimension = 0;
		player.sendMessage('{FFF000}You were kicked from the dimension. Wtf did you do?');
		this.leader.sendMessage('{00FF00}Successfully kicked player from dimension.');
	}
}