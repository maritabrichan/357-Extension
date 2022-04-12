let db;
let elements;
onload = function () {
    const request = window.indexedDB.open('357-Extension');
    request.onsuccess = function (event) {
        db = event.target.result;
        window.db = db;
        getAllLinks();
    }
};

function getAllLinks() {
    elements = db.transaction("Album").objectStore("Album").getAll();
    elements.onsuccess = function (event) {
        event.target.result.map(element => {
            renderURL(element);
        });
    }
}

function updateLinks(tag) {
    elements = db.transaction("Album").objectStore("Album").getAll();
    elements.onsuccess = function (event) {
        event.target.result.map(element => {
            if (element.tags === tag)
                renderURL(element);
        });
    }
}

const albumTitles = ['Book', 'Clothing/Fashion', 'Electronics', 'Food', 'School', 'Travel', 'Other'];

function renderURL(record) {
    const recordDivCont = document.createElement("div");
    const recordDiv = document.createElement("div");
    const imgDiv = document.createElement("div");
    const img = document.createElement("img");
    const container = document.createElement("div");
    const containerBtn = document.createElement("div");
    const title = document.createElement("h6");
    const urlBtn = document.createElement("a");
    const delBtn = document.createElement("a");
    const moveBtn = document.createElement("select")


    recordDivCont.className = "w3-col m4 w3-margin-bottom"
    recordDiv.className = "w3-light-grey"
    recordDivCont.style = "min-width:15em"
    imgDiv.className="imgDiv"
    img.src = record.img;
    img.style = "width:100% "
    img.className = "card-img-top img-fluid"
    container.className = "w3-container"
    title.textContent = record.title;
    title.className = "titleScroll";

    urlBtn.href = record.URL;
    urlBtn.textContent = "Open"
    urlBtn.target = "_blank"
    delBtn.textContent = "Delete"
    urlBtn.setAttribute("title", "Open record in a new tab")
    delBtn.setAttribute("title", "Delete this record")
    moveBtn.setAttribute("title", "Move record to another album")

    containerBtn.className = "btn-group btn-group-justified"
    urlBtn.className = "btn  w3-padding-small w3-button w3-dark-grey"
    delBtn.className = "btn w3-padding-small w3-hover-red w3-dark-grey"
    moveBtn.className = "btn btn-block w3-button w3-padding-small w3-dark-grey"
    moveBtn.style.marginTop = "2px";

    for (var i = 0; i < albumTitles.length; i++) {
        var option = document.createElement("option");
        option.setAttribute("value", albumTitles[i]);
        if (albumTitles[i] === record.tags) {
            option.text = "Move to another album";
            option.setAttribute("hidden", true)
        } else
            option.text = albumTitles[i];
        moveBtn.appendChild(option);
        if (albumTitles[i] === record.tags)
            moveBtn.selectedIndex = i;

    }

    moveBtn.addEventListener("change", () => {
        const oldTag = record.tags;
        record.tags = moveBtn.value;
        updateRecord(record, oldTag);
    })
    delBtn.addEventListener("click", () => {
        deleteRecord(record.URL, record.tags);
    })
    container.appendChild(title);
    containerBtn.appendChild(urlBtn);
    containerBtn.appendChild(delBtn);
    imgDiv.appendChild(img);
    recordDiv.appendChild(imgDiv);
    recordDiv.appendChild(container);
    recordDiv.appendChild(containerBtn);
    recordDiv.appendChild(moveBtn);
    recordDivCont.appendChild(recordDiv);

    document.getElementById(`${record.tags}Container`).removeAttribute("hidden")
    document.getElementById(`${record.tags}`).appendChild(recordDivCont)
}

function deleteRecord(key, tag) {
    const transaction = db.transaction("Album", "readwrite");
    const objectStore = transaction.objectStore("Album");
    document.getElementById(`${tag}Container`).setAttribute("hidden", true)
    document.getElementById(`${tag}`).innerHTML = ""
    updateLinks(tag);
    objectStore.delete(key);
}

function search(keyword) {
    const transaction = db.transaction("Album", "readwrite");
    const objectStore = transaction.objectStore("Album");

    const request = objectStore.openCursor();
    request.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            if (cursor.value.column.indexOf(keyword) !== -1) {
                console.log("We found a row with value: " + JSON.stringify(cursor.value));
            }

            cursor.continue();
        }
    };
}

const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", event => {
    event.preventDefault();
    const keyword = document.getElementById("searchKeyword");
    search(keyword);

})

function updateRecord(record, oldTag) {
    const transaction = db.transaction("Album", "readwrite");
    const objectStore = transaction.objectStore("Album");
    document.getElementById(`${oldTag}Container`).setAttribute("hidden", true)
    document.getElementById(`${record.tags}Container`).setAttribute("hidden", true)
    document.getElementById(`${oldTag}`).innerHTML = ""
    document.getElementById(`${record.tags}`).innerHTML = ""
    updateLinks(oldTag);
    updateLinks(record.tags);
    objectStore.put(record);

}