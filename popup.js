import * as db from "/modules/database.mjs";

const background = chrome.extension.getBackgroundPage();
db.setDB(background.db)

