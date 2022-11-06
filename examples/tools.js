'use strict';

function isExternSettingsFileAvailable() {
    try {
        require.resolve('./../../vanmoofExampleSettings');
        return true;
    } catch (e) {
        return false;
    }
}

function getSettingsFile() {
    if (isExternSettingsFileAvailable()) {
        return require('./../../vanmoofExampleSettings');
    }
    return require('./settings');
}

module.exports.getSettingsFile = getSettingsFile;