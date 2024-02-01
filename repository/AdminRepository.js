const mysql = require("../database/mysql");

module.exports = class AdminRepository {
	GetPartyIDList() {
		const query = `SELECT party_id FROM cpos`;
		return new Promise((resolve, reject) => {
			mysql.query(query, (err, result) => {
				if (err) {
					reject(err);
				}

				resolve(result);
			});
		});
	}

	GetCPO(cpo_id) {
		const query = `SELECT country_code, cpo_name FROM cpos WHERE cpo_id = ?`;

		return new Promise((resolve, reject) => {
			mysql.getConnection((err, connection) => {
				if (err) {
					connection.release();
					reject(err);
				}

				connection.query(query, [cpo_id], (err, result) => {
					if (err) {
						reject(err);
						connection.release();
					}

					resolve({ result, connection });
				});
			});
		});
	}

	ApproveChargingPointOperator({ party_id, token_a, cpo_id, connection }) {
		const query = `
        UPDATE cpos SET party_id = ?, token_a = ?, status = 'APPROVED'
        WHERE cpo_id = ? AND party_id IS NULL`;

		return new Promise((resolve, reject) => {
			connection.query(query, [party_id, token_a, cpo_id], (err, result) => {
				if (err) {
					reject(err);
				}

				resolve(result);
				connection.release();
			});
		});
	}
};
