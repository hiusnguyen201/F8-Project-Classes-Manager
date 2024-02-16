const btnCheckboxParent = document.querySelector("input.checkboxParent");
const listBtnChild = document.querySelectorAll("input.checkboxChildren");
const btnDeleteAllChildrenSelected = document.querySelector(
  "button[data-target='#btnDeleteAllChildrenSelected']"
);
const btnConfirmDeleteAllChildren = document.querySelector(
  "button#btnConfirmDeleteAllChildren"
);
const btnHiddenColumn = document.querySelector(".btn-hidden-column-group>.btn");

let count = 0;
let arrObjId = [];
if (btnCheckboxParent) {
  btnCheckboxParent.addEventListener("change", (e) => {
    if (e.target.checked) {
      listBtnChild.forEach((child) => {
        if (!child.checked) {
          child.checked = true;
          count = listBtnChild.length;
          btnDeleteAllChildrenSelected.disabled = false;
          arrObjId.push(child.value);
        }
      });
    } else {
      listBtnChild.forEach((child) => {
        if (child.checked) {
          child.checked = false;
          count = 0;
          btnDeleteAllChildrenSelected.disabled = true;
        }
      });

      arrObjId = [];
    }
  });
}

if (listBtnChild) {
  listBtnChild.forEach((child) => {
    child.addEventListener("change", (e) => {
      if (e.target.checked) {
        count++;
        if (count === listBtnChild.length) {
          btnCheckboxParent.checked = true;
        }
        arrObjId.push(child.value);

        btnDeleteAllChildrenSelected.disabled = false;
      } else {
        count--;
        btnCheckboxParent.checked = false;
        arrObjId.pop(child.value);

        if (!count) {
          btnDeleteAllChildrenSelected.disabled = true;
        }
      }
    });
  });
}
if (btnConfirmDeleteAllChildren) {
  btnConfirmDeleteAllChildren.addEventListener("click", () => {
    if (count > 0 && !btnDeleteAllChildrenSelected.disabled) {
      const formParent = btnConfirmDeleteAllChildren.parentNode;
      const input = formParent.querySelector("input#deleteInputBox");
      input.value = arrObjId;
      formParent.submit();
    }
  });
}

if (btnHiddenColumn) {
  btnHiddenColumn.addEventListener("click", () => {
    const menu = document.querySelector(
      ".btn-hidden-column-group>.dropdown-hidden-column"
    );
    menu.classList.toggle("active");
    btnHiddenColumn.classList.toggle("active");
  });
}

const modalOpened = document.querySelector("div.modal-edit.show.activeModal");
if (modalOpened) {
  const btnClose = modalOpened.querySelector("i.fas.fa-times");
  btnClose.addEventListener("click", (e) => closeModal());

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  const closeModal = () => {
    modalOpened.classList.remove("show");
    setTimeout(() => {
      modalOpened.style.display = "none";
      modalOpened.classList.remove("active");
    }, 100);
  };
}

const dropArea = document.querySelector("label#drop-area");

if (dropArea) {
  const btnImport = document.querySelector("button.btnImport");
  const inputFile = dropArea.querySelector("input#importFile");
  const blockUpload = dropArea.querySelector("div.upload-block");

  inputFile.addEventListener("change", (e) => {
    uploadFile(e.target.files[0]);
  });

  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    inputFile.files = e.dataTransfer.files;
    uploadFile(inputFile.files[0]);
  });

  btnImport.addEventListener("click", () => {
    dropArea.parentNode.submit();
  });

  function uploadFile(file) {
    if (!file) return;
    blockUpload.textContent = "";
    blockUpload.style.border = 0;
    const div = document.createElement("div");
    div.innerHTML = `<p class='fw-bolder'>Imported file</p><p><i class='fas fa-file mr-1'></i><span>${file.name}</span></p>`;
    btnImport.disabled = false;
    blockUpload.appendChild(div);
  }
}
