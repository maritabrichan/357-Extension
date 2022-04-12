import * as db from "/modules/database.mjs"

const background = chrome.extension.getBackgroundPage();
db.createDatabase();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'get_success') {
        if (request.payload) {
            request.payload.map(element => {

                list.innerHTML += '            <div class="col-md-4">\n' +
                    '              <div class="card mb-4 box-shadow">\n' +
                    '                <img class="card-img-top img-fluid" src="' + element.img + '" alt="Card image cap">\n' +
                    '                <div class="card-body">\n' +
                    '                  <p class="card-title">' + element.title + '</p>\n  ' +
                    '                  <input type="hidden" id="custId" name="custId" value="' + element.URL + '">\n' +
                    '                  <div class="d-flex justify-content-between align-items-center">\n' +
                    '                    <div class="btn-group">\n' +
                    '                      <a class="btn btn-sm btn-outline-secondary" href="' + element.URL + '" target="_blank"> View</a>\n' +
                    '                      <buttun class="btn btn-sm btn-outline-secondary" id="delete-link" value="' + element.URL + '"> Delete</buttun>\n' +
                    '                    </div>\n' +
                    '                  </div>\n' +
                    '                </div>\n' +
                    '              </div>\n' +
                    '            </div>'


            });
        }
    } else if (request.message === 'get_success') {
        if (request.payload) {
            chrome.runtime.sendMessage({
                message: 'get'
            });
        }
    }
});


let list = document.querySelector('#Album')

// Fetch all saved links
onload = function getAllLinks() {
    chrome.runtime.sendMessage({
        message: 'get'
    });

};
var deleteButtun = document.getElementById('delete-link');
if (deleteButtun){
    deleteButtun.addEventListener('click', event => {
        event.preventDefault();

        chrome.runtime.sendMessage({
            message: 'delete',
            payload: document.getElementById('delete-link').value
        });
    });
}