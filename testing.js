import ReseauDiscordAPI, { ReseauDiscordAPICredentials as Credentials } from "./dist/index.js";
import { USERNAME, TOKEN } from "./credentials.js";

const ID = "820494469262213150";

const rd = new ReseauDiscordAPI();

rd.setCredentials(new Credentials(USERNAME, TOKEN));

console.log(await rd.dbName(), await rd.check(ID));

rd.check(ID)
	.then(response => {
		console.log("Is blacklisted?", response.blacklist.status);
	})
	// Handle errors
	.catch(error => {
		// ...
	});

rd.check(ID)
	.then(response => {
		console.log("Is listed?", response.suspect.status || response.blacklist.status);
	})
	// Handle errors
	.catch(error => {
		// ...
	});

// Know who added the ID to the list
rd.check(ID)
	.then(response => {
		if (!response.blacklist.status) return console.log("Not suspect");
		console.log("Added as suspect by", response.blacklist.addedBy, "on", response.blacklist.since);
	})
	// Handle errors
	.catch(error => {
		// ...
	});

rd.remove("suspect", "382869186042658818")
	.then(removed => {
		// removed will be false if it wasn't on the list
		console.log("Removed?", removed);
	})
	// Handle errors
	.catch(error => {
		// ...
	});