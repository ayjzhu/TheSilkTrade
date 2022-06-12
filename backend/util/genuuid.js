const crypto = require('crypto');

function getCleanUUID() {
    return crypto.randomUUID().replaceAll("-", "");
}

module.exports = getCleanUUID;