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
let arrId = [];
if (btnCheckboxParent) {
  btnCheckboxParent.addEventListener("change", (e) => {
    if (e.target.checked) {
      listBtnChild.forEach((child) => {
        if (!child.checked) {
          child.checked = true;
          count = listBtnChild.length;
          btnDeleteAllChildrenSelected.disabled = false;
          arrId.push(child.value);
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

      arrId = [];
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
        arrId.push(child.value);

        btnDeleteAllChildrenSelected.disabled = false;
      } else {
        count--;
        btnCheckboxParent.checked = false;
        arrId.pop(child.value);

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
      arrId.forEach((id) => {
        const input = document.createElement("input");
        input.name = "id";
        input.value = id;
        input.hidden = true;
        formParent.appendChild(input);
      });
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
