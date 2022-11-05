'use strict';

const VanMoofWebAPI = require('../src/index.js');
const tools = require('./tools');
const { buntstift } = require('buntstift');

let settingsFile = tools.getSettingsFile();

const account = settingsFile.ACCOUNT;
const password = settingsFile.PASSWORD;

(async () => {
    const webService = new VanMoofWebAPI.WebService();
    const success = await webService.authenticate(account, password);
    if (success) {
        const customerData = await webService.getCustomerData();
        const data = customerData.data;
        buntstift.list(`Name: ${data.name}`);
        buntstift.list(`Email: ${data.email}`);
        for (let i = 0; i < data.bikes.length; i++) {
            const bike = data.bikes[i];
            buntstift.header(`Bike ${i} (id: ${bike.id}):`);
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
            const stolen = bike.stolen;
            buntstift.list(`is stolen: ${stolen.isStolen}`);
            if (stolen.isStolen) {
                buntstift.list(`date stolen: ${stolen.dateStolen}`);
                buntstift.list(`latest location: ${stolen.latestLocation}`);
            }
        }
    }
})();
