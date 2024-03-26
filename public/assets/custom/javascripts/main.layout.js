const btnCheckboxParent = document.querySelector("input.checkboxParent");
const listBtnChild = document.querySelectorAll("input.checkboxChildren");
const btnDeleteAllChildrenSelected = document.querySelector(
  "button[data-target='#btnDeleteAllChildrenSelected']"
);
const btnConfirmDeleteAllChildren = document.querySelector(
  "button#btnConfirmDeleteAllChildren"
);

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

const btnHiddenColumn = document.querySelector(".btn-hidden-column-group>.btn");
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

const timeLearnHtml = (title, index, timeLearnStart, timeLearnEnd) => {
  return `<label class="form-label">Time Learn: ${title}</label>
                <div class="row align-items-center">
                      <div class="col-5 align-items-center d-flex">
                        <label class="form-label mr-1 mb-0" style="font-size: 14px"
                          >Start:</label
                        >
                        <div class="input-group">
                          <div class="input-group-prepend" style="border-right: 0">
                            <div class="input-group-text">
                              <i class="far fa-clock"></i>
                            </div>
                          </div>
                          <input
                            type="text"
                            value = "${
                              timeLearnStart[index] === " "
                                ? ""
                                : timeLearnStart[index]
                            }"
                            name="timeLearnStart"
                            class="form-control datetimepicker-input"
                          />
                        </div>
                      </div>
                      <div class="col-1"></div>
                      <div class="col-5 align-items-center d-flex">
                        <label class="form-label mr-1 mb-0" style="font-size: 14px"
                          >End:</label
                        >
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <div class="input-group-text">
                              <i class="far fa-clock"></i>
                            </div>
                          </div>
                          <input
                            type="text"
                            value = "${
                              timeLearnEnd[index] === " "
                                ? ""
                                : timeLearnEnd[index]
                            }"
                            name="timeLearnEnd"
                            class="form-control datetimepicker-input"
                          />
                        </div>
                      </div>
                </div>`;
};

const appendTimeLearnHtml = (
  child,
  timeLearnNode,
  index,
  timeLearnStart = [],
  timeLearnEnd = []
) => {
  const nodeDiv = document.createElement("div");
  const title = child.getAttribute("title");

  nodeDiv.innerHTML = timeLearnHtml(title, index, timeLearnStart, timeLearnEnd);
  timeLearnNode.appendChild(nodeDiv);

  $("input[name='timeLearnStart']").datetimepicker({
    format: "HH:mm",
  });
  $("input[name='timeLearnEnd']").datetimepicker({
    format: "HH:mm",
  });
};

const titlesAccept = [
  "Monday",
  "Sunday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const selectedChild = document.querySelectorAll("li.select2-selection__choice");
if (selectedChild?.length) {
  const timeLearnNode = document.querySelector("div.timeLearn");
  let [timeLearnStart, timeLearnEnd] = timeLearnNode
    .getAttribute("value")
    .split("-");

  timeLearnNode.setAttribute("value", "");
  timeLearnStart = timeLearnStart.split(",");
  timeLearnEnd = timeLearnEnd.split(",");

  selectedChild.forEach((child, index) => {
    if (titlesAccept.includes(child.getAttribute("title"))) {
      appendTimeLearnHtml(
        child,
        timeLearnNode,
        index,
        timeLearnStart,
        timeLearnEnd
      );
    }
  });
}

const observer = new MutationObserver((mutations) => {
  if (mutations[1]?.type === "childList") {
    const selectedChild = document.querySelectorAll(
      "li.select2-selection__choice"
    );

    const timeLearnNode = document.querySelector("div.timeLearn");
    timeLearnNode.innerHTML = "";

    selectedChild.forEach((child, index) => {
      let parent = child.parentNode;
      while (!parent.classList.contains("mb-3")) {
        parent = parent.parentNode;

        if (parent.classList.contains("mb-3")) {
          const div = parent.querySelector("label.form-label");
          if (div.getAttribute("for") === "schedule") {
            appendTimeLearnHtml(child, timeLearnNode, index);
          }
        }
      }
    });
  }
});

const selectionRender = document.querySelector(
  "ul.select2-selection__rendered"
);
if (selectionRender) observer.observe(selectionRender, { childList: true });

const divClearDate = document.querySelectorAll(
  ".input-group-append.btn-clearDate"
);

if (divClearDate && divClearDate.length) {
  divClearDate.forEach((div) => {
    div.addEventListener("click", () => {
      div.parentNode.querySelector("input").value = null;
    });
  });
}
