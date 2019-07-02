import * as chat from 'chat'; //https://github.com/team-stuyk-alt-v/altV-Chat-Extended
import * as cmdFuncs from './commandFunctions.mjs';

// Give weapon
chat.registerCmd('giveweapon', cmdFuncs.giveWeapon);
chat.registerCmd('weapon', cmdFuncs.giveWeapon);
chat.registerCmd('wep', cmdFuncs.giveWeapon);

// Clear Weapons
chat.registerCmd('clearweapons', cmdFuncs.clearWeapons);
chat.registerCmd('clearweapon', cmdFuncs.clearWeapons);
chat.registerCmd('clearwep', cmdFuncs.clearWeapons);

// Vehicle
chat.registerCmd('veh', cmdFuncs.spawnVehicle);
chat.registerCmd('vehicle', cmdFuncs.spawnVehicle);

// Vehicle Colors
chat.registerCmd('vehiclecolor1', cmdFuncs.setVehicleColor1);
chat.registerCmd('vehiclecolor2', cmdFuncs.setVehicleColor2);

// Get Position
chat.registerCmd('position', cmdFuncs.getPos);
chat.registerCmd('pos', cmdFuncs.getPos);

// Set Skin
chat.registerCmd('skin', cmdFuncs.setSkin);

// To to Player
chat.registerCmd('tpto', cmdFuncs.teleportToPlayer);

// Tp to Coordinate
chat.registerCmd('tp', cmdFuncs.teleportToCoordinates);

// Kill Self
chat.registerCmd('kill', cmdFuncs.killSelf);

// Set Dimension
chat.registerCmd('dimension', cmdFuncs.setDimension);
chat.registerCmd('setdimension', cmdFuncs.setDimension);

// Invite Dimension
chat.registerCmd('invitedimension', cmdFuncs.inviteDimension);
chat.registerCmd('invitedim', cmdFuncs.inviteDimension);

// Join Dimension by Invite
chat.registerCmd('joindimension', cmdFuncs.joinDimension);
chat.registerCmd('joindim', cmdFuncs.joinDimension);

// Kick from Dimension
chat.registerCmd('kickdim', cmdFuncs.kickFromDimension);
chat.registerCmd('kickdimension', cmdFuncs.kickFromDimension);
