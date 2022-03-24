var db = null;

function setDB(database) {
    db = database;
}

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

function insertRecord(records) {
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

function readAllValues() {
    var objectStore = db.transaction("Album").objectStore("Album");
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            alert("URL " + cursor.key + " with tags " + cursor.value.tags);
            cursor.continue();
        }
    };
}

function getRecord(key) {
    if (db) {
        const transaction = db.transaction("Album", "readonly");
        const objectStore = transaction.objectStore("Album");
        return objectStore.get(key)
    }
}

function updateRecord(record) {
    if (db) {
        const transaction = db.transaction("roster", "readwrite");
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

function deleteRecord(email) {
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

            objectStore.delete(email);
        });
    }
}

export {setDB, createDatabase, getRecord, updateRecord, deleteRecord, insertRecord, readAllValues}