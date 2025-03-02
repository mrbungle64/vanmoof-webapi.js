'use strict';

const axios = require('axios').default;

class VanMoofWebAPI {
    BASE_URL = 'https://my.vanmoof.com/api/v8';
    API_KEY = 'fcb38d47-f14b-30cf-843b-26283f6a5819';

    token;
    refreshToken;

    async authenticate(username, password) {
        try {
            const url = new URL(this.BASE_URL + '/authenticate');
            const {data} = await axios.post(url.href, null, {
                headers: {
                    'Api-Key': this.API_KEY,
                    'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
                }
            });
            this.token = data.token;
            this.refreshToken = data.refreshToken;
            return true;
        } catch (error) {
            throw new Error(error);
        }
    }

    async reauthenticate() {
        if (this.refreshToken) {
            try {
                const url = new URL(this.BASE_URL + '/token');
                const {data} = await axios.post(url.href, null, {
                    headers: {
                        'Api-Key': this.API_KEY,
                        'Authorization': 'Bearer ' + this.refreshToken
                    }
                });
                this.token = data.token;
                this.refreshToken = data.refreshToken;
                return true;
            } catch (error) {
                throw new Error(error);
            }
        }
        return false;
    }

    async requestGet(url) {
        try {
            const {data} = await axios.get(url, {
                headers: {
                    'Api-Key': this.API_KEY,
                    'Authorization': 'Bearer ' + this.token
                }
            });
            return data;
        } catch (error) {
            if (error.response.status === 401) {
                await this.reauthenticate();
                return this.requestGet(url);
            }
            return null;
        }
    }

    async getCustomerData(includeBikeDetails = false) {
        const url = new URL(this.BASE_URL + '/getCustomerData');
        if (includeBikeDetails) {
            url.searchParams.set('includeBikeDetails', '');
        }
        this.customerData = this.requestGet(url.href);
        return this.customerData;
    }

    async getDevices() {
        return this.requestData('getDevices');
    }

    async requestData(path) {
        const url = new URL(this.BASE_URL + `/${path}/`);
        return this.requestGet(url.href);
    }

    async getBikeData(bikeId) {
        return this.requestBikeData('getBikeData', bikeId);
    }

    async getBikeMessages(bikeId) {
        return this.requestBikeData('getBikeMessages', bikeId);
    }

    async getCurrentBikeShares(bikeId) {
        return this.requestBikeData('getBikeSharingInvitationsForBike', bikeId);
    }

    async requestBikeData(path, bikeId) {
        const url = new URL(this.BASE_URL + `/${path}/${bikeId}`);
        return this.requestGet(url.href);
    }
}

module.exports = VanMoofWebAPI;
