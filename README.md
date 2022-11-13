# VanMoof Web API Library

![S3](./vanmoof-s3.png)

This is a library for accessing the VanMoof Web API (read-only)

# Before you install

* This library provides access to your VanMoof account information only
* You cannot connect to any bike (via Bluetooth)
* You cannot change any information or settings

# Installation

```bash
git clone https://github.com/mrbungle64/vanmoof-webapi.js.git
cd vanmoof-webapi.js
npm install
```

# Example files

* `example/customerAndBikeData.js`

## Setup

Copy the `settings.js` file to the parent folder of the working directory

```bash
cp example/settings.js ./../
```

Add your VanMoof account information to this file
```js
exports.ACCOUNT_ID = 'email@domain.com';
exports.PASSWORD = 'a1b2c3d4';
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

# Functions

* `getCustomerData()`
* `getDevices()`
* `getBikeData(bikeId)`
* `getBikeMessages(bikeId)`
* `getCurrentBikeShares(bikeId)`

## Changelog

### 0.1.0

* Implemented basic functionality
* Added example app

## Disclaimer

I am in no way affiliated with VanMoof

## Thanks and credits

* @Poket-Jony ([VanBike-Library](https://github.com/Poket-Jony/vanbike-lib))
* @mjarkk ([Mooovy](https://github.com/mjarkk/vanmoof-web-controller))

## License

MIT License

Copyright (c) 2022 Sascha Hölzel <mrb1232@posteo.de>

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
