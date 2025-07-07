# VanMoof Web API Client

![S3](./vanmoof.png)

This is an unofficial Node.js client for the VanMoof Web API.

# Before you install

* This library provides read-only access to your VanMoof account information only
* You cannot connect to any bike via Bluetooth
* You cannot change any information or settings

# Installation

```bash
npm install vanmoof-webapi.js
```

## Requirements

The minimum required version of Node.js is 20.x

# Example

To see the library in action, refer to the included example file. It provides a practical demonstration of the core workflow: initializing the client, and then outputting key customer data (like name and email) along with a list of all associated bikes and their odometer readings.

## Setup

Copy the `settings.js` file to the parent folder of the working directory

```bash
cp example/settings.js ./../
```

Add your VanMoof account information to this file
```js
exports.ACCOUNT_ID = 'email@domain.com';
exports.PASSWORD = 'topSecretPassword';
```

## Usage

```bash
cd example
node ./customerAndBikeData.js
```

## Example output

```
∙ Name: John Doe
∙ Email: johndoe@domain.com
∙ Number of bikes: 1
───────────────────────
▻ Bike #1 (id: xxxxxx):
───────────────────────
∙ name: My S3
∙ frame number: xxxxxxxxxx
∙ mac address: xx:xx:xx:xx:xx:xx
∙ distance: 1732.4 km
∙ firmware: 1.8.2
∙ is tracking: false
∙ is stolen: false
∙ color: Dark
∙ color code (primary): #25282a
∙ color code (secondary): #25282a
```

# API Reference

`new VanMoofApiClient(username, password)`

Creates a new API client instance.

- `username` (string, required): Your VanMoof account email
- `password` (string, required): Your VanMoof account password

`async initialize()`

Authenticates with the VanMoof servers, fetches all necessary tokens and the base customer data. This method must be called before any other methods can be used.

`getBikes()`

Returns an array of bike objects associated with the account. Throws an error if the client has not been initialized.

`getCustomerData()`

Returns the raw customer data object fetched during initialization. Throws an error if the client has not been initialized.

`async getRidesData(bikeId)`

Fetches (or retrieves from cache) the weekly rides data object for a specific bike. This data is used internally by `getOdometer` and can be used for more advanced analysis of ride statistics.

- `bikeId` (number, required): The ID of the bike.

`async getOdometer(bikeId)`

Returns the total odometer reading in kilometers for a specific bike. This method automatically determines the correct API endpoint to use based on the bike's model generation.

- `bikeId` (number, required): The ID of the bike.


## Changelog

### 0.3.0
* Refactored the API client to provide multi-model odometer support
* Bumped the minimum required version of Node.js to 20.x
* Removed axios from dependencies

### 0.2.0

* Bumped axios to 1.7.9
* Fixed base url

### 0.1.1

* Bumped axios to 1.4.0
* Added new logo

### 0.1.0

* Implemented basic functionality
* Added example app

## Disclaimer

This is an unofficial library and is not affiliated with, maintained, or endorsed by VanMoof. The VanMoof API is not officially documented and may change at any time, which could break the functionality of this library. Use at your own risk.

## Thanks and credits

* @Poket-Jony ([VanBike-Library](https://github.com/Poket-Jony/vanbike-lib))
* @mjarkk ([Mooovy](https://github.com/mjarkk/vanmoof-web-controller))
* Stefan Stranger ([Stefan Stranger's Blog](https://stefanstranger.github.io/2023/09/10/vanMoofsAPIReverseEngineeringAndDecompilation/index.html))

## License

MIT License

Copyright (c) 2025 Sascha Hölzel <mrb1232@posteo.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
