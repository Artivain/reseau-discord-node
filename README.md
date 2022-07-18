# reseau-discord-node
Node.js module for interacting with the Réseau Discord Artivain API.

## How to use
Create a new connection to an API

By default, it uses the official database from Artivain but it can be changed to any database compatible with the Réseau Discord API.

```js
// Import the library
import ReseauDiscordAPI, { ReseauDiscordAPICredentials } from "reseau-discord";

// Create a new connection
const rd = new ReseauDiscordAPI();

// Optional: use a third-party database compatible with the API
rd.setBaseUrl("https://anotherdatabase.tld");

// You can also directly set the base URL when initializing the ReseauDiscordAPI
const alternativeDatabase = new ReseauDiscordAPI("https://anotherdatabase.tld");

// Optional: set authentication credentials to use endpoints that requires permissions
const USERNAME = "username";
const TOKEN = "supersecrettoken";
rd.setCredentials(new ReseauDiscordAPICredentials(USERNAME, TOKEN));

// Check if an ID is suspect
rd.check("382869186042658818")
	.then(response => {
		console.log("Is suspect?", response.suspect.status);
	})
	// Handle errors
	.catch(error => {
		// ...
	});

// Check if an ID is blacklisted
rd.check("382869186042658818")
	.then(response => {
		console.log("Is blacklisted?", response.blacklist.status);
	})
	// Handle errors
	.catch(error => {
		// ...
	});

// Check if an ID is listed on at least one list
rd.check("382869186042658818")
	.then(response => {
		console.log("Is listed?", response.suspect.status || response.blacklist.status);
	})
	// Handle errors
	.catch(error => {
		// ...
	});

// Know who added the ID to the list
rd.check("382869186042658818")
	.then(response => {
		if (!response.suspect.status) return console.log("Not suspect");

		// Log the username and timestamp
		console.log("Added as suspect by", response.suspect.addedBy, "on", response.suspect.since);
	})
	// Handle errors
	.catch(error => {
		// ...
	});

// Add an ID to a list
// Don't forget to set the credentials first!
rd.add("suspect", "382869186042658818")
	.then(added => {
		// added will be false if it was already on the list
		console.log("Added?", added);
	})
	.catch(error => {
		// ...
	});

// Remove an ID from the list
// Don't forget to set the credentials first!
rd.remove("suspect", "382869186042658818")
	.then(removed => {
		// removed will be false if it wasn't on the list
		console.log("Removed?", removed);
	})
	// Handle errors
	.catch(error => {
		// ...
	});
```