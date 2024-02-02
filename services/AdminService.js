const AdminRepository = require("../repository/AdminRepository");

// Utils
const Crypto = require("../utils/Crypto");
const SendCPODetails = require("../utils/Email/SendCPODetails");
const { HttpBadRequest } = require("../utils/HttpError");

module.exports = class AdminService {
	#repository;

	constructor() {
		this.#repository = new AdminRepository();
	}

	/** Generate Party ID */
	async #GeneratePartyID(companyName) {
		/**
		 * @Steps
		 *
		 * 1. Get all of the generated party ids first from the db.
		 *
		 * 2. Remove the spaces from company name.
		 *
		 * 3. Generate EVSE ID */

		const partyIDs = await this.#repository.GetPartyIDList();

		const companyNameWithoutSpaces = String(companyName)
			.replace(/\s+/g, "")
			.trim()
			.toUpperCase(); // Trim and remove spaces.

		let partyID = companyNameWithoutSpaces.slice(0, 2);

		/** For the mean time, generation of this party_id is for the third (3rd) letter. */
		for (let i = 2; i < companyNameWithoutSpaces.length; i++) {
			// Check if party id already exists
			const isFound = partyIDs.some(
				(data) => data.party_id === partyID + companyNameWithoutSpaces[i]
			);

			if (!isFound) {
				partyID += companyNameWithoutSpaces[i];
				break;
			}
		}

		return partyID.toUpperCase(); // Return the party id. it must be uppercase.
	}

	#GenerateTokenA(countryCode, partyID) {
		const tokenA = Crypto.Encrypt(
			JSON.stringify({
				country_code: countryCode,
				party_id: partyID,
			})
		);

		return tokenA;
	}

	async ApproveChargingPointOperator(cpoID) {
		const res = await this.#repository.GetCPO(cpoID);

		// Check if CPO is found
		if (res.result.length === 0) {
			res.connection.release();
			throw new HttpBadRequest("CPO ID does not exists", []);
		}

		// Extract necessary data.
		const cpoName = res.result[0].cpo_name;
		const countryCode = res.result[0].country_code;
		const status = res.result[0].status;

		if (status === "APPROVED") {
			res.connection.release();
			throw new HttpBadRequest("CPO already approved", []);
		}

		const partyID = await this.#GeneratePartyID(cpoName);
		const tokenA = this.#GenerateTokenA(countryCode, partyID);

		const emsp_versions = await this.#repository.GetEMSPSupportedVersions(
			res.connection
		);

		await this.#repository.ApproveChargingPointOperator({
			party_id: partyID,
			token_a: tokenA,
			cpo_id: cpoID,
			connection: res.connection,
		});

		const emailSender = new SendCPODetails(res.result[0].contact_email, {
			party_id: partyID,
			country_code: countryCode,
			token: tokenA,
			emsp_versions,
		});

		await emailSender.SendEmail();

		return {
			partyID,
			tokenA,
		};
	}
};
