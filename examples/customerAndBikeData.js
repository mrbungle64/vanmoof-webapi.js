'use strict';

const VanMoofWebAPI = require('../src/index.js');
const tools = require('./tools');
const {buntstift} = require('buntstift');

let settingsFile = tools.getSettingsFile();

const account = settingsFile.ACCOUNT;
const password = settingsFile.PASSWORD;

(async () => {
    const webAPI = new VanMoofWebAPI.WebAPI();
    try {
        await webAPI.authenticate(account, password);
        const data = (await webAPI.getCustomerData()).data;
        buntstift.line();
        buntstift.list(`Name: ${data.name}`);
        buntstift.list(`Email: ${data.email}`);
        buntstift.list(`Number of bikes: ${data.bikes.length}`);
        for (let i = 0; i < data.bikes.length; i++) {
            const bike = data.bikes[i];
            buntstift.header(`Bike #${i + 1} (id: ${bike.id}):`);
            buntstift.list(`name: ${bike.name}`);
            buntstift.list(`frame number: ${bike.frameNumber}`);
            buntstift.list(`mac address: ${bike.macAddress}`);
            const tripDistance = bike.tripDistance;
            const distanceKilometers = (tripDistance / 10).toFixed(1);
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
        }
    } catch (e) {
        buntstift.error(e.toString());
    }
})();
