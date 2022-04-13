import * as db from "/modules/database.mjs"

db.createDatabase();
const albumTitles = ['Book', 'Clothing/Fashion', 'Electronics', 'Food', 'School', 'Travel', 'Other'];

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        title: "Quick Save To Album",
        contexts: ["all"],
        id: "parent",
    });
    for (var i = 0; i < albumTitles.length; i++) {
        var albumTitle = albumTitles[i];
        chrome.contextMenus.create({
            title: albumTitle,
            contexts: ["all"],
            parentId: "parent",
            id: albumTitle,
        })
    }
});

function quickSaveToAlbum(albumName, tab, dataUrl) {
    let record = {URL: tab.url, title: tab.title, tags: [albumName], img: dataUrl}
    db.insertRecord(record).then(r => {
        chrome.notifications.create('quick_Add-' + tab.url, {
            type: 'basic',
            iconUrl: dataUrl,
            title: '357-Extension',
            message: 'Page added to your ' + albumName + ' Album!',
            priority: 2,
            silent: true
        });
    });
}

function isSubMenuOption(name) {
    return albumTitles.indexOf(name) >= 0;
}

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (isSubMenuOption(info.menuItemId)) {
        chrome.tabs.captureVisibleTab(null, null, function (dataUrl) {
            quickSaveToAlbum(info.menuItemId, tab, dataUrl);
        });
    }
});




