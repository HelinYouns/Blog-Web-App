document.addEventListener("DOMContentLoaded", function () {
  const dropArea = document.getElementById("drop-area");
  const fileInput = document.getElementById("fileElem");
  const fileNameDisplay = document.getElementById("file-name");

  if (!dropArea || !fileInput || !fileNameDisplay) {
    console.warn("Drop area or file input not found.");
    return;
  }

  // Open file system on click
  dropArea.addEventListener("click", () => {
    fileInput.click();
    console.log("Clicked");
  });

  // Show file name on file select
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      fileNameDisplay.textContent = fileInput.files[0].name;
    }
  });

  // Prevent default behaviors for drag/drop
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, (e) => e.preventDefault());
    dropArea.addEventListener(eventName, (e) => e.stopPropagation());
  });

  // Highlight on dragover
  dropArea.addEventListener("dragover", () => {
    dropArea.classList.add("bg-light");
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("bg-light");
  });

  // Handle dropped files
  dropArea.addEventListener("drop", (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      fileInput.files = files; // Assign files to hidden input
      fileNameDisplay.textContent = files[0].name;
    }
    dropArea.classList.remove("bg-light");
  });
});
function showFullText(element) {
  const fullText = element.getAttribute('data-full');
  const imageSrc = element.getAttribute('data-image');
  const date = element.getAttribute('data-date');

  document.getElementById('modal-description-text').textContent = fullText;
  document.getElementById('modal-post-image').src = imageSrc;
  document.getElementById('modal-post-date').textContent = date;

  // Set dropdown data
  const encodedDescription = encodeURIComponent(fullText);
  const encodedImage = encodeURIComponent(imageSrc);
  
  document.getElementById("modal-edit-link").href = `/addpost?description=${encodedDescription}&image=${encodedImage}`;
  document.getElementById("modal-description-input").value = fullText;
  document.getElementById("modal-image-input").value = imageSrc;

  const modal = new bootstrap.Modal(document.getElementById('descriptionModal'));
  modal.show();
}





 document.querySelectorAll('.clickable-description').forEach((desc, index) => {
    desc.addEventListener('click', () => {
      const dropdownBtn = desc.parentElement.querySelector('[data-bs-toggle="dropdown"]');
      if (dropdownBtn) {
        dropdownBtn.click(); // Simulate a click to open the dropdown
      }
    });
  });
