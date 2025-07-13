export = VanMoofWebAPI;
/**
 * API client class for interacting with the VanMoof Web API.
 */
declare class VanMoofWebAPI {
    /**
     * @param {string} username - Your VanMoof email address
     * @param {string} password - Your VanMoof password
     */
    constructor(username: string, password: string);
    username: string;
    password: string;
    config: {
        apiHost: string;
        apiHostToken: string;
        apiHostRides: string;
        apiKey: string;
        userAgent: string;
    };
    initialToken: any;
    applicationToken: any;
    customerData: any;
    ridesDataCache: {};
    /**
     * Performs a generic API call
     * @private
     */
    private _apiCall;
    /**
     * Initializes the client by authenticating and fetching all necessary data.
     */
    initialize(): Promise<void>;
    /**
     * Returns the cached raw customer data object.
     * @returns {object} The full customer data object
     */
    getCustomerData(): object;
    /**
     * Returns the list of bikes from the cached customer data.
     * @returns {Array} An array of bike objects
     */
    getBikes(): any[];
    /**
     * Fetches the weekly rides data for a specific bike from the tenjin endpoint.
     * The result is cached to prevent redundant API calls.
     * @param {number} bikeId - The ID of the bike
     * @returns {Promise<object|null>} The rides data object or null on error
     */
    getRidesData(bikeId: number): Promise<object | null>;
    /**
     * Retrieves the correct odometer reading for a specific bikeId.
     * This method encapsulates the logic for distinguishing between old and new models.
     * @param {number} bikeId - The ID of the bike
     * @returns {Promise<number|null>} The total odometer reading or null in case of an error
     */
    getOdometer(bikeId: number): Promise<number | null>;
}
//# sourceMappingURL=WebAPI.d.ts.map