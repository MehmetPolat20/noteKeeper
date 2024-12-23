const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const addBox = document.querySelector(".add-box");
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup-box .popup");
const popupTitle = popupBox.querySelector("header p");
const closeIcon = popupBox.querySelector("header i");
const form = document.querySelector("form");
const settings = document.querySelector(".settings");
const wrapper = document.querySelector(".wrapper");
const button = document.querySelector(".popup button");

let isUpdate = false;
let updateId;

let notes = JSON.parse(localStorage.getItem("notes")) || [];

addBox.addEventListener("click", () => {
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");

  document.querySelector("body").style.overflow = "hidden";
});

closeIcon.addEventListener("click", () => {
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let titleInput = e.target[0];
  let descriptionInput = e.target[1];

  let title = titleInput.value.trim();
  let description = descriptionInput.value.trim();

  if (title && description) {
    const date = new Date();
    let month = months[date.getMonth()];
    let day = date.getDate();
    let year = date.getFullYear();

    let noteInfo = { title, description, date: `${month} ${day}, ${year}` };
    if (isUpdate) {
      notes[updateId] = noteInfo;
      isUpdate = false;
    } else {
      notes.push(noteInfo);
    }

    localStorage.setItem("notes", JSON.stringify(notes));

    popupBoxContainer.classList.remove("show");
    popupBox.classList.remove("show");
    popupTitle.textContent = "Add Note";
    button.textContent = "Add Note";

    document.querySelector("body").style.overflow = "auto";
  }
  titleInput.value = "";
  descriptionInput.value = "";
  showNotes();
});

function deleteNote(noteId) {
  if (confirm("Are you sure you want to delete this?")) {
    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
  }
}

function updateNote(noteId, title, description) {
  isUpdate = true;
  updateId = noteId;
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");
  popupTitle.textContent = "Update Note";
  button.textContent = "Update Note";
  form.elements[0].value = title;
  form.elements[1].value = description;
}

function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

function showNotes() {
  if (!notes) return;
  document.querySelectorAll(".note").forEach((li) => li.remove());

  notes.forEach((note, id) => {
    let liTag = `<li class="note">
        <div class="details">
          <p>${note.title} </p>
          <span>${note.description}</span>
        </div>
        <div class="bottom-content">
          <span>${note.date}</span>
          <div class="settings">
            <i class="bx bx-dots-horizontal-rounded"></i>
            <ul class="menu">
              <li onclick = 'updateNote(${id}, "${note.title}", "${note.description}")'><i class="bx bx-edit"></i>Edit</li>
              <li onclick = 'deleteNote(${id})'><i class="bx bx-trash"></i>Delete</li>
            </ul>
          </div>
        </div>
      </li>
   `;
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}
wrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    showMenu(e.target);
  } else if (e.target.classList.contains("bx-trash")) {
    const noteElement = e.target.closest(".note");
    const noteId = parseInt(noteElement.dataset.id, 10);
    deleteNote(noteId);
  } else if (e.target.classList.contains("bx-edit")) {
    const noteElement = e.target.closest(".note");
    const noteId = parseInt(noteElement.dataset.id, 10);
    const title = noteElement.querySelector(".details p").innerText;
    const description = noteElement.querySelector(".details span").innerText;

    updateNote(noteId, title, description);
  }
});

document.addEventListener("DOMContentLoaded", () => showNotes());
