'use strict';

const axios = require("axios");

class VanMoofWebAPI {
    BASE_URL = 'https://my.vanmoof.com/api/v8/';
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

    async requestPost(url, data = null) {
        try {
            const {data} = await axios.post(url, data, {
                headers: {
                    'Api-Key': this.API_KEY,
                    'Authorization': 'Bearer ' + this.token
                }
            });
            return data;
        } catch (error) {
            if (error.response.status === 401) {
                await this.reauthenticate();
                return this.requestPost(url, data);
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

    async getCustomerDataHash() {
        const url = new URL(this.BASE_URL + '/getCustomerDataHash/');
        return this.requestGet(url.href);
    }

    async getDevices() {
        const url = new URL(this.BASE_URL + '/getDevices/');
        return this.requestGet(url.href);
    }

    async getBikeData(bikeId) {
        const url = new URL(this.BASE_URL + '/getBikeData/' + bikeId);
        return this.requestGet(url.href);
    }

    async getBikeMessages(bikeId) {
        const url = new URL(this.BASE_URL + '/getBikeMessages/' + bikeId);
        return this.requestGet(url.href);
    }
}

module.exports = VanMoofWebAPI;
