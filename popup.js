import * as db from "./modules/database.mjs";

const background = chrome.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', function () {

    let link = document.getElementById('addToAlbum');
    link.addEventListener('click', function () {

        let checkboxes = document.querySelectorAll('input[type=checkbox]');
        let tags = [];
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                tags.push(background.getAlbumNameFromKey(i));
            }
        }
        background.addAlbumRecord(tags);
        window.close();
    });
});