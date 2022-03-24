var db = null;

function set_db(database) {
    db = database;
}

function create_database() {
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

function insert_records(records) {
    if (db) {
        const insert_transaction = db.transaction("Album", "readwrite");
        const objectStore = insert_transaction.objectStore("Album");

        return new Promise((resolve, reject) => {
            insert_transaction.oncomplete = function () {
                resolve(true);
            }

            insert_transaction.onerror = function () {
                resolve(false);
            }
            objectStore.add(records);
        });
    }
}

function read_all() {
    var objectStore = db.transaction("Album").objectStore("Album");
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            alert("URL " + cursor.key + " with tags " + cursor.value.tags);
            cursor.continue();
        }
    };
}

function get_record(key) {
    if (db) {
        const get_transaction = db.transaction("Album", "readonly");
        const objectStore = get_transaction.objectStore("Album");
        return objectStore.get(key)
    }
}

function update_record(record) {
    if (db) {
        const put_transaction = db.transaction("roster", "readwrite");
        const objectStore = put_transaction.objectStore("Album");

        return new Promise((resolve, reject) => {
            put_transaction.oncomplete = function () {
                resolve(true);
            }

            put_transaction.onerror = function () {
                resolve(false);
            }

            objectStore.put(record);
        });
    }
}

function delete_record(email) {
    if (db) {
        const delete_transaction = db.transaction("Album",
            "readwrite");
        const objectStore = delete_transaction.objectStore("Album");

        return new Promise((resolve, reject) => {
            delete_transaction.oncomplete = function () {
                resolve(true);
            }

            delete_transaction.onerror = function () {
                resolve(false);
            }

            objectStore.delete(email);
        });
    }
}

export {set_db, create_database, get_record, update_record, delete_record, insert_records, read_all}