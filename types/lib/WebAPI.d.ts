export = VanMoofWebAPI;
declare class VanMoofWebAPI {
    BASE_URL: string;
    API_KEY: string;
    token: any;
    refreshToken: any;
    authenticate(username: any, password: any): Promise<boolean>;
    reauthenticate(): Promise<boolean>;
    requestGet(url: any): any;
    getCustomerData(includeBikeDetails?: boolean): Promise<any>;
    customerData: any;
    getDevices(): Promise<any>;
    requestData(path: any): Promise<any>;
    getBikeData(bikeId: any): Promise<any>;
    getBikeMessages(bikeId: any): Promise<any>;
    getCurrentBikeShares(bikeId: any): Promise<any>;
    requestBikeData(path: any, bikeId: any): Promise<any>;
}
//# sourceMappingURL=WebAPI.d.ts.map