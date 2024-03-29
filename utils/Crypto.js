require("dotenv").config();
const crypto = require("crypto");
const algorithm = process.env.CRYPTO_ALGORITHM;
const iv = process.env.CRYPTO_IV;
const key = process.env.CRYPTO_SECRET_KEY;

module.exports = class Crypto {
	static Encrypt(text, dynamicKey, dynamicIV) {
		const cipher = crypto.createCipheriv(algorithm, dynamicKey, dynamicIV);
		let encrypted = cipher.update(text, "utf-8", "base64");
		encrypted += cipher.final("base64");
		return encrypted;
	}

	static Decrypt(hash, dynamicKey, dynamicIV) {
		const decipher = crypto.createDecipheriv(algorithm, dynamicKey, dynamicIV);
		let decryptedData = decipher.update(hash, "base64", "utf-8");
		decryptedData += decipher.final("utf-8");
		return decryptedData;
	}

	static Generate() {
		return {
			key: crypto.randomBytes(32).toString("base64").slice(0, 32),
			iv: crypto.randomBytes(16).toString("base64").slice(0, 16),
		};
	}
};
