import axios from "axios";

/**
 * Helper for using Réseau Discord Artivain API.
 * @author Thomas Fournier
 * @since 1.0.0
 */
export class ReseauDiscordAPI {
	constructor(baseUrl: string = "https://api-rd.artivain.com") {
		this.setBaseUrl(baseUrl);
	}

	baseUrl: string;
	credentials?: ReseauDiscordAPICredentials;

	/**
	 * Set base URL to use for the API
	 * @param {String} baseUrl
	 * @since 1.0.0
	 */
	setBaseUrl = (baseUrl: string): ReseauDiscordAPI => {
		if (baseUrl.endsWith("/")) baseUrl = baseUrl.slice(0, -1);
		this.baseUrl = baseUrl;
		return this;
	}

	/**
	 * Set the credentials to use for the API
	 * - Required for more advanced functions
	 * @param {ReseauDiscordAPICredentials} credentials
	 * @since 1.0.0
	 */
	setCredentials = (credentials: ReseauDiscordAPICredentials): ReseauDiscordAPI => {
		this.credentials = credentials;
		return this;
	}

	/**
	 * Check if id is on a list
	 * @since 1.0.0
	 */
	check = async (id: string): Promise<{
		dbName: string,
		suspect: { status: boolean, since?: string, addedBy?: string },
		blacklist: { status: boolean, since?: string, addedBy?: string }
	}> => {
		if (!isValidId(id)) throw new Error("ID is not valid");

		const checkResult = {
			dbName: "",
			suspect: {
				status: false,
				since: undefined,
				addedBy: undefined
			},
			blacklist: {
				status: false,
				since: undefined,
				addedBy: undefined
			}
		};

		const response = await axios({
			url: this.baseUrl + "/v1/check?id=" + id,
			method: "GET",
			responseType: "json",
			validateStatus: () => true
		});

		checkResult["dbName"] = response.data.dbName;

		if (response.data.suspect) {
			checkResult.suspect = {
				status: true,
				since: response.data.suspect.since,
				addedBy: response.data.suspect.addedBy
			};
		} else {
			checkResult.suspect.status = false;
		}

		if (response.data.blacklist) {
			checkResult.blacklist = {
				status: true,
				since: response.data.blacklist.since,
				addedBy: response.data.blacklist.addedBy
			};
		} else {
			checkResult.blacklist.status = false;
		}

		return checkResult;
	}

	/**
	 * Add an ID to a list
	 * @param {"suspect"|"blacklist"} list
	 * @param {String} id
	 * @returns {Promise.<boolean>}
	 * @since 1.0.0
	 */
	add = async (list: "suspect" | "blacklist", id: string): Promise<boolean> => {
		if (!isValidId(id)) throw new Error("ID is not valid");
		if (!this.credentials) throw new Error("Missing credentials");

		const response = await axios({
			url: `${this.baseUrl}/v1/add-${list}?id=${id}&username=${this.credentials.username}&token=${this.credentials.token}`,
			method: "GET",
			responseType: "json",
			validateStatus: () => true
		});

		if (response.status != 200) throw new ResponseStatusError(response.statusText);

		return response.data.added;
	}

	/**
	 * Remove an ID from a list
	 * @param {"suspect"|"blacklist"} list
	 * @param {String} id
	 * @returns {Promise.<boolean>}
	 * @since 1.0.0
	 */
	remove = async (list: "suspect" | "blacklist", id: string): Promise<boolean> => {
		if (!isValidId(id)) throw new Error("ID is not valid");
		if (!this.credentials) throw new Error("Missing credentials");

		const response = await axios({
			url: `${this.baseUrl}/v1/remove-${list}?id=${id}&username=${this.credentials.username}&token=${this.credentials.token}`,
			method: "GET",
			responseType: "json",
			validateStatus: () => true
		});

		if (response.status != 200) throw new ResponseStatusError(response.statusText);

		return response.data.removed;
	}

	/**
	 * Ping the API to check if online and available
	 * @returns {Promise.<boolean>}
	 * @since 1.0.0
	 */
	ping = async (): Promise<boolean> => {
		const response = await axios({
			url: `${this.baseUrl}/v1/ping`,
			method: "GET",
			responseType: "json",
			validateStatus: () => true
		});

		if (response.status != 200) return false;

		return response.data.online;
	}

	/**
	 * Get the database name of the API
	 * @returns {Promise.<String>}
	 * @since 1.0.0
	 */
	dbName = async (): Promise<string> => {
		const response = await axios({
			url: `${this.baseUrl}/v1/ping`,
			method: "GET",
			responseType: "json",
			validateStatus: () => true
		});

		if (response.status != 200) throw new ResponseStatusError(response.statusText);

		return response.data.dbName;
	}
}

/**
 * Credentials to login into the API
 * @since 1.0.0
 */
export class ReseauDiscordAPICredentials {
	constructor(username: string, token: string) {
		this.username = username;
		this.token = token;
	}

	readonly username: string;
	readonly token: string;
}

/**
 * This is thrown when a response from the API is not 200
 * @since 1.0.0
 */
export class ResponseStatusError extends Error {
	name: string = "ResponseStatusError";
}

export default ReseauDiscordAPI;

/**
 * Check if a string is a valid Discord ID
 * @param id - String to verify
 */
function isValidId(id: string): boolean {
	if (isNaN(parseInt(id)) || id.length < 18) return false;
	return true;
}