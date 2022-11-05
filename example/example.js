'use strict';

const VanMoofWebAPI = require('../src/index.js');
const tools = require('./tools');

let settingsFile = tools.getSettingsFile();

const account = settingsFile.ACCOUNT;
const password = settingsFile.PASSWORD;

test();

async function test() {
    const webService = new VanMoofWebAPI.WebService();
    const success = await webService.authenticate(account, password);
    console.log(success);
    if (success) {
        const customerData = await webService.getCustomerData();
        console.log(customerData.data);
        //console.log(customerData.data.bikes[0]);
        //console.log(customerData.data.bikeDetails[0]);
        const bikeId = customerData.data.bikes[0].id;
        const bike = await webService.getBikeData(bikeId);
        console.log(bike);
        const hash = await webService.getCustomerDataHash();
        console.log(hash);
    }
}