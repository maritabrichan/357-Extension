import * as db from "/modules/database.mjs"

db.createDatabase();
const albumTitles = new Map(
    [[0, 'Book'],
        [1, 'Clothing/Fashion'],
        [2, 'Electronics'],
        [3, 'Food'],
        [4, 'School'],
        [5, 'Travel'],
        [6, 'Other']]);

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        title: "Quick Save To Album",
        contexts: ["all"],
        id: "parent",
    });
    albumTitles.forEach((value, key) => {
        // for (var albumTitle of albumTitles.entries()) {
        chrome.contextMenus.create({
            title: value,
            contexts: ["all"],
            parentId: "parent",
            id: "" + key
        })
    })
});

function quickAddAlbumRecord(albumName, tab, dataUrl) {
    let record = {URL: tab.url, title: tab.title, tags: [albumName], img: dataUrl}
    db.insertRecord(record).then(r => {
        chrome.notifications.create('quick_Add-' + tab.url, {
            type: 'basic',
            iconUrl: 'notification.png',
            title: '357-Extension',
            message: 'Page added to your ' + albumName + ' Album!',
            priority: 2,
            silent: true
        });
    });
}

const addAlbumRecord = async function addAlbum(tags) {
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.captureVisibleTab(null, null, function (dataUrl) {
            let record = {URL: tab.url, title: tab.title, tags: tags, img: dataUrl}
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
        });
    });
}

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (isSubMenuOption(info.menuItemId)) {
        chrome.tabs.captureVisibleTab(null, null, function (dataUrl) {
            quickAddAlbumRecord(getAlbumNameFromKey(parseInt(info.menuItemId)), tab, dataUrl);
        });
    }
});

function isSubMenuOption(key) {
    return albumTitles.has(parseInt(key));
}

const getAlbumNameFromKey = function getAlbumNameFromKey(key) {
    return albumTitles.get(key);
}


window.addAlbumRecord = addAlbumRecord;
window.getAlbumNameFromKey = getAlbumNameFromKey;
