/**
 * Helper for using Réseau Discord Artivain API.
 * @author Thomas Fournier
 * @since 1.0.0
 */
class ReseauDiscordAPI {
	constructor(baseUrl: string = "https://api-rd.artivain.com") {
		console.log(baseUrl);
		this.baseUrl = baseUrl;
	}

	baseUrl: string;

	setBaseUrl = (baseUrl: string): ReseauDiscordAPI => {
		this.baseUrl = baseUrl;
		return this;
	}
}

export default ReseauDiscordAPI;