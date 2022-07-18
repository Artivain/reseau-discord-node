import ReseauDiscordAPI, { ReseauDiscordAPICredentials as Credentials } from "./dist/index.js";
import { USERNAME, TOKEN } from "./credentials.js";

const ID = "820494469262213150";

const rd = new ReseauDiscordAPI();

rd.setCredentials(new Credentials(USERNAME, TOKEN));

console.log(await rd.dbName(), await rd.check(ID));