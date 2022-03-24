import * as db from "/modules/database.mjs"

db.createDatabase();

chrome.contextMenus.create({
    title: "Quick Save to Album",
    contexts: ["all"],
    id: "quickSave"
});


function quickSaveToAlbum(tab) {
    let record = {URL: tab.url, tags: "NONE"}
    db.insertRecord(record).then(r => {
        chrome.notifications.create('quick_Add-' + tab.url, {
            type: 'basic',
            iconUrl: 'notification.png',
            title: '357-Extension',
            message: 'Page added to your Album!',
            priority: 2,
            silent: true
        });
    });
}

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "quickSave") {
        quickSaveToAlbum(tab);
    }
});




