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
            for (let i = 0; i < element.tags.length; i++)
                renderURL(element, element.tags[i]);
        });
    }
}

function updateLinks(tag) {
    elements = db.transaction("Album").objectStore("Album").getAll();
    elements.onsuccess = function (event) {
        event.target.result.map(element => {
            for (let i = 0; i < element.tags.length; i++)
                if (element.tags[i] === tag)
                    renderURL(element, element.tags[i]);
        });
    }
}

const albumTitles = ['Book', 'Clothing/Fashion', 'Electronics', 'Food', 'School', 'Travel', 'Other'];

function renderURL(record, tag) {
    const recordDivCont = document.createElement("div");
    const recordDiv = document.createElement("div");
    const imgDiv = document.createElement("div");
    const img = document.createElement("img");
    const container = document.createElement("div");
    const containerBtn = document.createElement("div");
    const cp_mvBtn = document.createElement("div");
    const title = document.createElement("h6");
    const urlBtn = document.createElement("a");
    const delBtn = document.createElement("a");
    const moveBtn = document.createElement("select")
    const copyBtn = document.createElement("select")


    recordDivCont.className = "w3-col m4 w3-margin-bottom"
    recordDiv.className = "w3-light-grey"
    recordDivCont.style = "min-width:20em;  margin-right:10px; margin-left:10px "
    recordDiv.style = "max-width:20em;"
    imgDiv.className = "imgDiv"
    img.src = record.img;
    img.style = "width:100% "
    img.className = "card-img-top img-fluid"
    container.className = "w3-container"
    title.textContent = record.title;
    title.className = "titleScroll";

    urlBtn.href = record.URL;
    urlBtn.textContent = "Open "
    urlBtn.innerHTML += "<i class=\"bi bi-box-arrow-up-right\"></i>\n"
    urlBtn.target = "_blank"
    delBtn.textContent = "Delete"
    urlBtn.setAttribute("title", "Open record in a new tab")
    delBtn.setAttribute("title", "Delete this record")
    moveBtn.setAttribute("title", "Move record to another album")
    copyBtn.setAttribute("title", "Copy record to another album")

    containerBtn.className = "btn-group btn-group-justified"
    urlBtn.className = "btn btnSeparator w3-padding-small w3-button w3-dark-grey"
    delBtn.className = "btn w3-padding-small w3-hover-red w3-dark-grey"
    cp_mvBtn.className = "btn-group d-flex"
    cp_mvBtn.style.marginTop = "2px";
    moveBtn.className = "btn btnSeparatorR w3-button w3-padding-small w3-dark-grey"
    copyBtn.className = "btn  btnSeparatorL w3-button w3-padding-small w3-dark-grey"
    moveBtn.style="max-width:50%; min-width:9.5em"
    copyBtn.style="max-width:50%; min-width:9.4em"



    let option = document.createElement("option");
    option.text = "Move";
    option.setAttribute("hidden", true)
    moveBtn.appendChild(option);
    for (let i = 0; i < albumTitles.length; i++) {
        let option = document.createElement("option");
        if (!record.tags.includes(albumTitles[i])) {
            option.setAttribute("value", albumTitles[i]);
            option.text = albumTitles[i];
            moveBtn.appendChild(option);
        }
    }


    let coption = document.createElement("option");
    coption.text = "Copy";
    coption.setAttribute("hidden", true)
    copyBtn.appendChild(coption);
    for (let i = 0; i < albumTitles.length; i++) {
        let coption = document.createElement("option");
        if (!record.tags.includes(albumTitles[i])) {
            coption.setAttribute("value", albumTitles[i]);
            coption.text = albumTitles[i];
            copyBtn.appendChild(coption);
        }
    }

    moveBtn.addEventListener("change", () => {
        updateRecord(record, tag, moveBtn.value, 'move');
    })


    copyBtn.addEventListener("change", () => {
        updateRecord(record, tag, copyBtn.value, 'copy');
    })


    delBtn.addEventListener("click", () => {
        deleteRecord(record, tag);
    })
    container.appendChild(title);
    containerBtn.appendChild(urlBtn);
    containerBtn.appendChild(delBtn);
    cp_mvBtn.appendChild(moveBtn);
    cp_mvBtn.appendChild(copyBtn);
    imgDiv.appendChild(img);
    recordDiv.appendChild(imgDiv);
    recordDiv.appendChild(container);
    recordDiv.appendChild(containerBtn);
    recordDiv.appendChild(cp_mvBtn);
    recordDivCont.appendChild(recordDiv);

    document.getElementById(`${tag}Container`).removeAttribute("hidden")
    document.getElementById(`${tag}`).appendChild(recordDivCont)
}


function updateRecord(record, oldTag, newTag, cp_mv) {
    const transaction = db.transaction("Album", "readwrite");
    const objectStore = transaction.objectStore("Album");
    document.getElementById(`${oldTag}Container`).setAttribute("hidden", true)
    document.getElementById(`${newTag}Container`).setAttribute("hidden", true)
    document.getElementById(`${oldTag}`).innerHTML = ""
    document.getElementById(`${newTag}`).innerHTML = ""
    updateLinks(oldTag);
    updateLinks(newTag);
    record.tags.push(newTag)
    if (cp_mv === 'move') {

        for (let i = 0; i < record.tags.length; i++)
            if (record.tags[i] === oldTag) {
                record.tags.splice(i, 1);
                objectStore.put(record);
            }
    } else
        objectStore.put(record);
}

function deleteRecord(record, tag) {
    const transaction = db.transaction("Album", "readwrite");
    const objectStore = transaction.objectStore("Album");
    document.getElementById(`${tag}Container`).setAttribute("hidden", true)
    document.getElementById(`${tag}`).innerHTML = ""
    updateLinks(tag);
    if (record.tags.length === 1)
        objectStore.delete(record.URL);
    else
        for (let i = 0; i < record.tags.length; i++)
            if (record.tags[i] === tag) {
                record.tags.splice(i, 1);
                objectStore.put(record);
            }
}

let searchResult;

function search(keywords) {
    let keyword = keywords.split(" ")
    keyword = keyword.filter(i => i);
    document.getElementById('searchContainer').setAttribute("hidden", true)
    document.getElementById('search').innerHTML = ""
    for (let i = 0; i < albumTitles.length; i++)
        document.getElementById(`${albumTitles[i]}Container`).setAttribute("hidden", true)

    elements = db.transaction("Album").objectStore("Album").getAll();
    elements.onsuccess = function (event) {
        let elements = event.target.result
        let flag = true
        for (let j = 0; j < elements.length; j++) {
            for (let x = 0; x < keyword.length; x++) {
                if (elements[j].title.toLowerCase().includes(keyword[x]) || elements[j].URL.toLowerCase().includes(keyword[x])) {
                    renderURL(elements[j], 'search')
                    flag = false
                    elements.splice(j, 1)
                }
            }
        }
        if (flag)
            document.getElementById('noSearchResult').removeAttribute("hidden")

    }
}

const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", event => {
    event.preventDefault();
    const keywords = document.getElementById("searchKeywords");
    if (keywords.value.trim() !== '')
        search(keywords.value.toLowerCase());

})
