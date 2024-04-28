// ==UserScript==
// @name        MyStat homework display
// @namespace   Violentmonkey Scripts
// @match       https://mystat.itstep.org/*
// @grant       none
// @version     1.0
// @author      regularuser548
// @description 4/27/2024, 5:12:31 AM
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
  downloadFile(link);
}

function downloadFile(link) {
  fetch(link)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (response.headers.get("Content-Type").split(";")[0] == 'text/plain')
      return response.text();
    else
      return response.blob();
  })
  .then((response) => {

    if (typeof response === "string")
      displayModal(response.trim());
    else
      downloadBinaryFile(response);
  });
}

function downloadBinaryFile(file) {
    let a = document.querySelector('#customLink');

    if (a == null) {
         a = document.createElement("a");
         a.id = 'customLink';
         a.style = "display: none";
         document.body.appendChild(a);
      }

    let url = window.URL.createObjectURL(file);
    a.href = url;
    a.download = file.fileName;
    a.click();
    window.URL.revokeObjectURL(url);
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