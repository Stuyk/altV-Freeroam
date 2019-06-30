import * as alt from 'alt';

export function loadModelForPlayers(player) {
    alt.Player.all.forEach((target) => {
        alt.emitClient(target, 'updateModel', player.model);
    });
}

export function loadModelsForPlayer(player) {
    alt.Player.all.forEach((target) => {
        alt.emitClient(player, 'updateModel', target.model);
    });
}

export function revivePlayer(player) {
    alt.Player.all.forEach((target) => {
        alt.emitClient(target, 'revivePlayer', player);
    });
}

export function suicidePlayer(player) {
    alt.Player.all.forEach((target) => {
        alt.emitClient(target, 'suicidePlayer', player);
    });
}