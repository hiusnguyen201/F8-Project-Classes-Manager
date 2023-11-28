//Initial references
const input = document.querySelectorAll(".input");
const inputField = document.querySelector(".inputfield");
const submitButton = document.getElementById("submit");
const btnReset = document.querySelector("button.btn-reset-form");

let inputCount = 0;

//Update input
const updateInputConfig = (element, disabledStatus) => {
  if (!disabledStatus) {
    element.focus();
  } else {
    element.blur();
  }
};

input.forEach((element) => {
  element.addEventListener("keyup", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    let { value } = e.target;

    if (value.length == 1) {
      updateInputConfig(e.target, true);
      inputCount += 1;
      if (inputCount <= 5 && e.key != "Backspace") {
        if (inputCount <= 5) {
          if (e.target.nextElementSibling) {
            updateInputConfig(e.target.nextElementSibling, false);
          }
        }
      }
    } else if (value.length == 0 || e.key == "Backspace") {
      if (inputCount == 0) {
        updateInputConfig(e.target, false);
        return false;
      }
      inputCount -= 1;
      updateInputConfig(e.target, true);
      if (e.target.previousElementSibling) {
        e.target.previousElementSibling.value = "";
        updateInputConfig(e.target.previousElementSibling, false);
      }
    } else if (value.length > 1) {
      e.target.value = value.split("")[0];
    }
  });
});

//Start
const startInput = () => {
  inputCount = 0;
  input.forEach((element) => {
    element.value = "";
  });
  updateInputConfig(inputField.firstElementChild, false);
};

window.onload = startInput();

btnReset.onclick = () => {
  input.forEach((element) => {
    element.value = "";
    element.disabled = false;
  });

  inputCount = 0;
};

const btnSubmit = document.querySelector("button.btn-submit-otp");

btnReset.onclick = () => {
  input.forEach((element) => {
    element.value = "";
    element.disabled = false;
  });

  inputCount = 0;
};
