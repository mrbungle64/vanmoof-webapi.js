'use strict';

const VanMoofWebAPI = require('../src/index.js');
const tools = require('./tools');
const {buntstift} = require('buntstift');

let settingsFile = tools.getSettingsFile();

const account = settingsFile.ACCOUNT;
const password = settingsFile.PASSWORD;

(async () => {
    const webService = new VanMoofWebAPI.WebService();
    try {
        await webService.authenticate(account, password);
        const customerData = await webService.getCustomerData();
        const data = customerData.data;
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
            const colors = bike.modelColor;
            buntstift.list(`color: ${colors.name}`);
            buntstift.list(`color code (primary): ${colors.primary}`);
            buntstift.list(`color code (secondary): ${colors.secondary}`);
        }
    } catch (e) {
        buntstift.error(e.toString());
    }
})();
