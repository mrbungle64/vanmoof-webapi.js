'use strict';

const VanMoofWebAPI = require('../index.js');
const tools = require('./tools');
const {buntstift} = require('buntstift');

let settingsFile = tools.getSettingsFile();

const account = settingsFile.ACCOUNT;
const password = settingsFile.PASSWORD;

(async () => {
    const webAPI = new VanMoofWebAPI.WebAPI(account, password);
    try {
        await webAPI.initialize();
        const data = webAPI.getCustomerData().data;
        console.log(data);
        buntstift.line();
        buntstift.list(`Name: ${data.name}`);
        buntstift.list(`Email: ${data.email}`);
        buntstift.list(`Number of bikes: ${data.bikes.length}`);
        for (let i = 0; i < data.bikeDetails.length; i++) {
            const bike = data.bikeDetails[i];
            buntstift.header(`Bike #${i + 1} (id: ${bike.id}):`);
            buntstift.list(`name: ${bike.name}`);
            buntstift.list(`frame number: ${bike.frameNumber}`);
            buntstift.list(`mac address: ${bike.macAddress}`);
            const tripDistance = await webAPI.getOdometer(bike.id);
            const distanceKilometers = tripDistance.toFixed(1);
            buntstift.list(`distance: ${distanceKilometers} km`);
            buntstift.list(`firmware: ${bike.smartmoduleCurrentVersion}`);
            if (bike.smartmoduleDesiredVersion) {
                buntstift.list(`new firmware available: ${bike.smartmoduleDesiredVersion}`);
            }
            buntstift.list(`is tracking: ${bike.isTracking}`);
            const stolen = bike.stolen;
            buntstift.list(`is stolen: ${stolen.isStolen}`);
            if (stolen.isStolen) {
                buntstift.list(`date stolen: ${stolen.dateStolen}`);
                buntstift.list(`latest location: ${stolen.latestLocation}`);
            }
            const modelColor = bike.modelColor;
            buntstift.list(`color: ${modelColor.name}`);
            buntstift.list(`color code (primary): ${modelColor.primary}`);
            buntstift.list(`color code (secondary): ${modelColor.secondary}`);
            const key = bike.key;
            if (key !== null) {
                buntstift.list(`encryptionKey ${key.encryptionKey}`);
                buntstift.list(`passcode ${key.passcode}`);
                buntstift.list(`userKeyId ${key.userKeyId}`);
            }
            console.log(bike.links)
        }
    } catch (e) {
        buntstift.error(e.toString());
    }
})();