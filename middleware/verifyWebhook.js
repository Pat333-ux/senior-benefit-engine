const crypto = require('crypto');

function verifyWebhookSignature(sharedSecret) {
    return (req, res, next) => {
        const signatureHeader = req.headers['x-seniorengine-signature'];
        if (!signatureHeader) {
            return res.status(401).json({ error: 'Missing signature header' });
        }

        const expectedSig = crypto
            .createHmac('sha256', sharedSecret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (`sha256=${expectedSig}` !== signatureHeader) {
            return res.status(403).json({ error: 'Invalid HMAC signature' });
        }

        next();
    };
}

module.exports = verifyWebhookSignature;
