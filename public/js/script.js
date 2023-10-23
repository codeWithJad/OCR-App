document.addEventListener("DOMContentLoaded", () => {
  const dragDropArea = document.getElementById("dragDropArea");
  const fileInput = document.getElementById("fileInput");
  const generateButton = document.getElementById("generate");
  const img = document.querySelector(".img");
  const cloudIcon = document.querySelector(".cloud-icon");
  const instructionText = document.querySelector(".instructionText");
  let file;

  function toggleVisibility() {
    if (file) {
      img.classList.add("showElement");
      cloudIcon.classList.add("hideElement");
      instructionText.classList.add("hideElement");
    } else {
      instructionText.classList.add("showElement");
      cloudIcon.classList.add("showElement");
      img.classList.add("hideElement");
    }
  }

  function toggleGenerateButton(disabled) {
    generateButton.disabled = disabled;
    if (disabled) {
      generateButton.classList.add("disabled-button");
    } else {
      generateButton.classList.remove("disabled-button");
    }
  }
  // Initially, disable the button when no file is selected
  toggleGenerateButton(true);

  dragDropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dragDropArea.classList.add("hovered");
  });

  dragDropArea.addEventListener("dragleave", () => {
    dragDropArea.classList.remove("hovered");
  });

  dragDropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    file = e.dataTransfer.files[0];
    console.log("drop", file);
    toggleGenerateButton(!file);
    toggleVisibility();
  });

  // Handle click event to trigger file input
  dragDropArea.addEventListener("click", () => {
    fileInput.click();
  });

  // Handle file input change event
  fileInput.addEventListener("change", (e) => {
    file = e.target.files[0];
    toggleGenerateButton(!file);
    toggleVisibility();
  });

  generateButton.addEventListener("click", () => {
    // Get the file data from the hidden input
    // file = fileInput.files[0];
    console.log("btn clicked", file);

    if (file) {
      sendDataToAPI(file);
    } else {
      console.log("No file selected.");
      // Handle the case where no file is selected
    }
  });

  function sendDataToAPI(file) {
    const formData = new FormData();
    formData.append("file", file);

    // Make a POST request to the API endpoint
    fetch("/api/text", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);
        const resultDiv = document.getElementById("results");
        resultDiv.textContent = data.text;
      })
      .catch((error) => {
        console.error("API Error:", error);
        // Handle the error in your frontend code
      });
  }
});
