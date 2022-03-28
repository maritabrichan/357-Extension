chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'get') {
        let get_request = readAllValues();
        get_request.then(res => {
            chrome.runtime.sendMessage({
                message: 'get_success',
                payload: res
            });
        });
    }else if(request.message === 'delete') {
        let delete_request = deleteRecord(request.payload);
        delete_request.then(res => {
            chrome.runtime.sendMessage({
                message: 'delete_success',
                payload: res
            });
        });
    }
});


var db = null;

function createDatabase() {
    const request = window.indexedDB.open('357-Extension');

    request.onerror = function (event) {
    }

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        window.db = db;

        let objectStore = db.createObjectStore('Album', {
            keyPath: 'URL'
        });

        objectStore.transaction.oncomplete = function (event) {
        }
    }

    request.onsuccess = function (event) {
        db = event.target.result;
        window.db = db;
    }
}

const insertRecord = function insertRecord(records) {
    if (db) {
        const transaction = db.transaction("Album", "readwrite");
        const objectStore = transaction.objectStore("Album");

        return new Promise((resolve, reject) => {
            transaction.oncomplete = function () {
                resolve(true);
            }

            transaction.onerror = function () {
                resolve(false);
            }
            objectStore.add(records);
        });
    }
}
window.insertRecord = insertRecord;

const readAllValues = function readAllValues() {
    const objectStore = db.transaction("Album").objectStore("Album").getAll();
    return new Promise((resolve, reject) => {
        objectStore.onsuccess = function (event) {
            const cursor = event.target.result;
            resolve(cursor);
        }
    });


}
window.readAllValues = readAllValues;

const getRecord = function getRecord(key) {
    if (db) {
        const transaction = db.transaction("Album", "readonly");
        const objectStore = transaction.objectStore("Album");
        return objectStore.get(key)
    }
}
window.getRecord = getRecord;

const updateRecord = function updateRecord(record) {
    if (db) {
        const transaction = db.transaction("Album", "readwrite");
        const objectStore = transaction.objectStore("Album");

        return new Promise((resolve, reject) => {
            transaction.oncomplete = function () {
                resolve(true);
            }

            transaction.onerror = function () {
                resolve(false);
            }

            objectStore.put(record);
        });
    }
}
window.updateRecord = updateRecord;

const deleteRecord = function deleteRecord(key) {
    if (db) {
        const transaction = db.transaction("Album",
            "readwrite");
        const objectStore = transaction.objectStore("Album");

        return new Promise((resolve, reject) => {
            transaction.oncomplete = function () {
                resolve(true);
            }

            transaction.onerror = function () {
                resolve(false);
            }

            objectStore.delete(key);
        });
    }
};
window.updateRecord = updateRecord;

export {createDatabase, getRecord, updateRecord, deleteRecord, insertRecord, readAllValues}