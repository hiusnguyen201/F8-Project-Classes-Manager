window.addEventListener("load", () => {
  const toastSuccess = document.querySelector("input.toastMessageSuccess");
  const toastError = document.querySelector("input.toastMessageError");

  if (!toastError && !toastSuccess) {
    return;
  }

  if (toastError) {
    Toastify({
      text: toastError.value,
      duration: 10000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#eb5757",
        "font-size": "20px",
      },
      onload: function () {},
    }).showToast();
  }

  if (toastSuccess) {
    Toastify({
      text: toastSuccess.value,
      duration: 10000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#6fcf97",
        "font-size": "20px",
      },
      onload: function () {},
    }).showToast();
  }
});
