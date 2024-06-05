// ==UserScript==
// @name        MyStat homework display
// @namespace   Violentmonkey Scripts
// @match       https://mystat.itstep.org/*
// @grant       none
// @version     1.1
// @author      regularuser548
// @description Скрипт который отображает текстовые дз прямо в Майстате
// @license     MIT
// ==/UserScript==

const modalHTML = '<button class="float-right" id="modalCloseBtn">X</button> <p></p>';


document.addEventListener('click', clickHandler);

function clickHandler(event) {
    if (event.target.parentElement.parentElement.classList.contains("load-file"))
        displayFile(event);
}

function closeDialog() {
    document.querySelector('.customModal').close();
}

function displayFile(event) {
    event.preventDefault();

    let link = event.target.parentElement;

    fetch(link, { method: 'HEAD' })
        .then((response) => {

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            let contentType = response.headers.get("Content-Type").split(";")[0];


            if (contentType == 'text/plain')
                downloadFile(link);
            else
                link.click();

        })

}

function downloadFile(link) {
    fetch(link)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.text();

        })
        .then((content) => {
            displayModal(content.trim());
        });

}

function displayModal(text) {
    let container = document.querySelector('.homeworks-section');
    let modal = container.querySelector('.customModal');


    if (modal == null) {
        //create dialog node
        modal = document.createElement('dialog');
        modal.innerHTML = modalHTML;
        modal.classList.add("customModal");
        modal.querySelector('#modalCloseBtn').onclick = closeDialog;
        container.appendChild(modal);
    }

    //update text
    modal.querySelector('p').innerText = text;
    modal.showModal();
}