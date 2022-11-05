'use strict';

const axios = require("axios");

class VanMoofWebAPI {
    BASE_URL = 'https://my.vanmoof.com/api/v8/';
    API_KEY = 'fcb38d47-f14b-30cf-843b-26283f6a5819';

    _token;
    _refreshToken;

    async authenticate(username, password) {
        try {
            const url = new URL(this.BASE_URL + '/authenticate');
            const {data} = await axios.post(url.href, null, {
                headers: {
                    'Api-Key': this.API_KEY,
                    'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
                }
            });
            this._token = data.token;
            this._refreshToken = data.refreshToken;
            return true;
        } catch (error) {
            console.log(error);
        }
        return false;
    }

    async reauthenticate() {
        if (this._refreshToken) {
            try {
                const url = new URL(this.BASE_URL + '/token');
                const {data} = await axios.post(url.href, null, {
                    headers: {
                        'Api-Key': this.API_KEY,
                        'Authorization': 'Bearer ' + this._refreshToken
                    }
                });
                this._token = data.token;
                this._refreshToken = data.refreshToken;
                return true;
            } catch (error) {
            }
        }
        return false;
    }

    async _requestGet(url) {
        try {
            const {data} = await axios.get(url, {
                headers: {
                    'Api-Key': this.API_KEY,
                    'Authorization': 'Bearer ' + this._token
                }
            });
            return data;
        } catch (error) {
            if (error.response.status === 401) {
                await this.reauthenticate();
                return this._requestGet(url);
            }
            return null;
        }
    }

    async _requestPost(url, data = null) {
        try {
            const {data} = await axios.post(url, data, {
                headers: {
                    'Api-Key': this.API_KEY,
                    'Authorization': 'Bearer ' + this._token
                }
            });
            return data;
        } catch (error) {
            if (error.response.status === 401) {
                await this.reauthenticate();
                return this._requestPost(url, data);
            }
            return null;
        }
    }

    async getCustomerData() {
        const url = new URL(this.BASE_URL + '/getCustomerData?includeBikeDetails');
        return this._requestGet(url.href);
    }

    async getCustomerDataHash() {
        const url = new URL(this.BASE_URL + '/getCustomerDataHash/');
        return this._requestGet(url.href);
    }

    async getDevices() {
        const url = new URL(this.BASE_URL + '/getDevices/');
        return this._requestGet(url.href);
    }

    async getEncryptionKey(bikeIndex = 0) {
        const data = await this.getCustomerData();
        return data ? data.data.bikeDetails[bikeIndex].key.encryptionKey : null;
    }

    async getBikeData(bikeId) {
        const url = new URL(this.BASE_URL + '/getBikeData/' + bikeId);
        return this._requestGet(url.href);
    }

    async getBikeMessages(bikeId) {
        const url = new URL(this.BASE_URL + '/getBikeMessages/' + bikeId);
        return this._requestGet(url.href);
    }
};

module.exports = VanMoofWebAPI;