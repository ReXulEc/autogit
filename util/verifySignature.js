require('dotenv').config()
const crypto = require('crypto');
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

const verify_signature = (req) => {
    const signature = crypto
        .createHmac("sha256", WEBHOOK_SECRET)
        .update(JSON.stringify(req.body))
        .digest("hex");
    return `sha256=${signature}` === req.headers["x-hub-signature-256"];
};

const handleSignature = (req) => {
    if (!verify_signature(req)) {
        return false;
    } else {
        return true;
    }
};

module.exports = {handleSignature}