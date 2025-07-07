/**
 * API client class for interacting with the VanMoof Web API.
 */
class VanMoofWebAPI {
    /**
     * @param {string} username - Your VanMoof email address
     * @param {string} password - Your VanMoof password
     */
    constructor(username, password) {
        if (!username ||!password) {
            throw new Error('Username and password are required');
        }
        this.username = username;
        this.password = password;

        this.config = {
            apiHost: 'https://my.vanmoof.com/api/v8',
            apiHostToken: 'https://api.vanmoof-api.com/v8',
            apiHostRides: 'https://tenjin.vanmoof.com/api/v1',
            apiKey: 'fcb38d47-f14b-30cf-843b-26283f6a5819',
            userAgent: 'VanMoof/20 CFNetwork/1404.0.5 Darwin/22.3.0'
        };

        this.initialToken = null;
        this.applicationToken = null;
        this.customerData = null;
        this.ridesDataCache = {};
    }

    /**
     * Performs a generic API call
     * @private
     */
    async _apiCall(url, options = {}) {
        const defaultHeaders = {
            'Api-Key': this.config.apiKey,
            'User-Agent': this.config.userAgent
        };

        const requestOptions = {
            method: options.method || 'GET',
            headers: {...defaultHeaders,...options.headers }
        };

        if (options.body) {
            requestOptions.body = JSON.stringify(options.body);
            requestOptions.headers = 'application/json';
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API call failed for ${url}: ${response.status} ${response.statusText} - ${errorText}`);
        }

        return response.json();
    }

    /**
     * Initializes the client by authenticating and fetching all necessary data.
     */
    async initialize() {

        // 1. Get primary token
        const authHeader = `Basic ${btoa(`${this.username}:${this.password}`)}`;
        const authData = await this._apiCall(`${this.config.apiHost}/authenticate`, {
            method: 'POST',
            headers: { 'Authorization': authHeader }
        });
        this.initialToken = authData.token;

        // 2. Get Application Token
        const appTokenData = await this._apiCall(`${this.config.apiHostToken}/getApplicationToken`, {
            headers: { 'Authorization': `Bearer ${this.initialToken}` }
        });
        this.applicationToken = appTokenData.token;

        // 3. Fetch and store customer data
        this.customerData = await this._apiCall(`${this.config.apiHost}/getCustomerData?includeBikeDetails`, {
            headers: { 'Authorization': `Bearer ${this.initialToken}` }
        });
    }

    /**
     * Returns the cached raw customer data object.
     * @returns {object} The full customer data object
     */
    getCustomerData() {
        if (!this.customerData) {
            throw new Error('Client not initialized. Please call `initialize()` first.');
        }
        return this.customerData;
    }

    /**
     * Returns the list of bikes from the cached customer data.
     * @returns {Array} An array of bike objects
     */
    getBikes() {
        return this.getCustomerData().data.bikes;
    }

    /**
     * Fetches the weekly rides data for a specific bike from the tenjin endpoint.
     * The result is cached to prevent redundant API calls.
     * @param {number} bikeId - The ID of the bike
     * @returns {Promise<object|null>} The rides data object or null on error
     */
    async getRidesData(bikeId) {
        if (!this.customerData) {
            throw new Error('Client not initialized. Please call `initialize()` first.');
        }

        // Return from cache if available
        if (this.ridesDataCache[bikeId]) {
            return this.ridesDataCache[bikeId];
        }

        const riderId = this.getCustomerData().data.uuid;
        const tenjinUrl = `${this.config.apiHostRides}/rides/${riderId}/${bikeId}/weekly`;

        try {
            const ridesData = await this._apiCall(tenjinUrl, {
                headers: {
                    'Authorization': `Bearer ${this.applicationToken}`,
                    'Accept-Language': 'en_US',
                    'Timezone': 'Europe/Amsterdam'
                }
            });
            // Store in cache before returning
            this.ridesDataCache[bikeId] = ridesData;
            return ridesData;
        }
        catch (error) {
            console.error(`Error fetching rides data:`, error);
            return null;
        }
    }

    /**
     * Retrieves the correct odometer reading for a specific bikeId.
     * This method encapsulates the logic for distinguishing between old and new models.
     * @param {number} bikeId - The ID of the bike
     * @returns {Promise<number|null>} The total odometer reading or null in case of an error
     */
    async getOdometer(bikeId) {
        const bike = this.getBikes().find(b => b.id === bikeId);
        if (!bike) {
            throw new Error(`Bike with ID ${bikeId} not found in account.`);
        }

        const modernProfiles = ['ELECTRIFIED_2022', 'ELECTRIFIED_2021'];

        if (modernProfiles.includes(bike.bleProfile)) {
            const ridesData = await this.getRidesData(bikeId);
            return ridesData?.carousel?.summary?.totalDistance?? null;
        }
        else {
            return bike.tripDistance?? null;
        }
    }
}

module.exports = VanMoofWebAPI;