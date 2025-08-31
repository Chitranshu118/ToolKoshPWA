if ("serviceWorker" in navigator) {
  // navigator.serviceWorker.register("./service-worker.js")
  //   .then(() => console.log("Service Worker registered"))
  //   .catch((err) => console.error("SW registration failed", err));
}


// document.getElementById("closeBtn").addEventListener("click", () => {
//   window.close();
// });

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.getAttribute("data-tab");
    document
      .querySelectorAll(".tab-content")
      .forEach((c) => c.classList.add("hidden"));
    document.getElementById(tab).classList.remove("hidden");
  });
});

const messageBlock = document.getElementById("messageBlock");

const pdfInput = document.getElementById("pdfInput");
const pdfFileList = document.getElementById("pdfFileList");
const clearPdfBtn = document.getElementById("clearPdfBtn");
let selectedPdfFiles = [];
// Handle file selection
pdfInput.addEventListener("change", (event) => {
  selectedPdfFiles = [...event.target.files];
  renderPdfFileList();
});

// Render selected file list
function renderPdfFileList() {
  pdfFileList.innerHTML = "";
  selectedPdfFiles.forEach((file, index) => {
    if (file.type !== "application/pdf") {
      displayMessage(
        "You were trying to select non supportive file format",
        "Red"
      );
      selectedPdfFiles = [];
    } else {
      const div = document.createElement("div");
      div.classList.add("file-item");
      const span = document.createElement("span");
      span.textContent = file.name;
      const btn = document.createElement("button");
      btn.classList.add("remove-btn");
      btn.textContent = "x";
      btn.addEventListener("click", () => removePdfFile(index));
      div.appendChild(span);
      div.appendChild(btn);
      pdfFileList.appendChild(div);
    }
  });
}

1;

// Remove a single file
window.removePdfFile = function (index) {
  selectedPdfFiles.splice(index, 1);
  renderPdfFileList();
  pdfInput.value = ""; // reset so same file can be re‑selected
};

// Clear all
clearPdfBtn.addEventListener("click", () => {
  selectedPdfFiles = [];
  renderPdfFileList();
  pdfInput.value = "";
});

// Merge PDF button handler
document.getElementById("mergePdfBtn").onclick = async function () {
  if (!selectedPdfFiles.length) {
    //alert("Please select PDFs first!");
    displayMessage("Please select PDFs first!", "Red");
    return;
  }

  const { PDFDocument } = PDFLib;
  const mergedPdf = await PDFDocument.create();

  for (let f of selectedPdfFiles) {
    if (f.size > 50 * 1024 * 1024) {
      displayMessage(
        "Large file detected – may fail due to browser memory limits",
        "Orange"
      );
      //alert("Large file detected – may fail due to browser memory limits");
    }
    const bytes = await f.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((p) => mergedPdf.addPage(p));
  }

  const mergedBytes = await mergedPdf.save();

  // Download
  const blob = new Blob([mergedBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "merged.pdf";
  a.click();
  URL.revokeObjectURL(url);
};

// ----- JSON Formatter -----
document.getElementById("formatJsonBtn").addEventListener("click", () => {
  const input = document.getElementById("jsonInput").value;
  const output = document.getElementById("jsonOutput");
  const copyBtn = document.getElementById("copyJsonBtn");

  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, 2);
    output.textContent = formatted;
    copyBtn.style.display = "inline-block"; // show copy button
  } catch (e) {
    output.textContent = "Invalid JSON!";
    copyBtn.style.display = "none"; // hide copy button
  }
});

document.getElementById("clearJsonBtn").addEventListener("click", () => {
  document.getElementById("jsonInput").value = "";
  document.getElementById("jsonOutput").textContent = "";
  document.getElementById("copyJsonBtn").style.display = "none";
});

document.getElementById("copyJsonBtn").addEventListener("click", () => {
  const formatted = document.getElementById("jsonOutput").textContent;
  navigator.clipboard.writeText(formatted).then(() => {
    displayMessage("JSON Copied", "Green");
    // const msg = document.getElementById("messageBlock");
    // msg.style.display = "block";
    // msg.style.color = "green";
    // msg.innerHTML = "JSON Copied";
    //setTimeout(() => (msg.style.display = "none"), 2000);
  });
});

const imageInput = document.getElementById("imageInput");
const selectedImageName = document.getElementById("selectedImageName");
const clearImagesBtn = document.getElementById("clearImagesBtn");
const convertImagesBtn = document.getElementById("convertImagesBtn");
const imageStatus = document.getElementById("messageBlock");

let selectedImage = null;

// Handle file selection
imageInput.addEventListener("change", (event) => {
  selectedImage = event.target.files[0] || null;
  selectedImageName.textContent = selectedImage ? selectedImage.name : "";
  if (selectedImageName.textContent || selectedImageName.innerHTML) {
    selectedImageName.className = "file-item";
    selectedImageName.style.marginTop = "20px";
  }
});

//clear section
clearImagesBtn.addEventListener("click", () => {
  selectedImage = null;
  imageInput.value = "";
  selectedImageName?.classList?.remove("file-item");
  (selectedImageName.textContent = ""), (messageBlock.innerText = "");
});

// Convert to PDF
convertImagesBtn.addEventListener("click", async () => {
  if (!selectedImage) {
    //alert("Please select an image.");
    displayMessage("Please select an image.", "Red");
    return;
  }

  try {
    const { PDFDocument } = PDFLib;
    const pdfDoc = await PDFDocument.create();

    const bytes = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(new Uint8Array(reader.result));
      reader.onerror = reject;
      reader.readAsArrayBuffer(selectedImage);
    });

    let image;
    if (selectedImage.type === "image/jpeg") {
      image = await pdfDoc.embedJpg(bytes);
    } else if (selectedImage.type === "image/png") {
      image = await pdfDoc.embedPng(bytes);
    } else {
      displayMessage(`Unsupported file type: ${selectedImage.type}`, "Red");
      //  alert(`Unsupported file type: ${selectedImage.type}`);
      return;
    }

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "image-to-pdf.pdf";
    a.click();
    URL.revokeObjectURL(url);

    // messageBlock.style.display = "block";
    // messageBlock.style.color = "green";
    // messageBlock
    // messageBlock.innerText = "PDF created successfully!";
    // setTimeout(() => (messageBlock.style.display = "none"), 2500);
    displayMessage("PDF created successfully.", "Green");
  } catch (err) {
    console.error(err);
  }
});

const jpgInput = document.getElementById("jpgInput");
const jpgFileList = document.getElementById("jpgFileList");
const clearJpgBtn = document.getElementById("clearJpgBtn");
const mergeJpgBtn = document.getElementById("mergeJpgBtn");

let selectedJpgFiles = [];

// Handle file selection
jpgInput.addEventListener("change", (event) => {
  selectedJpgFiles = [...event.target.files];
  renderJpgFileList();
});

// Render selected file list
function renderJpgFileList() {
  jpgFileList.innerHTML = "";
  selectedJpgFiles.forEach((file, index) => {
    if (file.type !== "image/jpeg") {
      displayMessage(
        "You were trying to select non supportive file format",
        "Red"
      );
      jpgFileList.innerHTML = "";
    } else {
      const div = document.createElement("div");
      div.classList.add("file-item");

      const span = document.createElement("span");
      span.textContent = file.name;

      const btn = document.createElement("button");
      btn.classList.add("remove-btn");
      btn.textContent = "x";
      btn.addEventListener("click", () => removeJpgFile(index));

      div.appendChild(span);
      div.appendChild(btn);
      jpgFileList.appendChild(div);
    }
  });
}

// Remove single file
function removeJpgFile(index) {
  selectedJpgFiles.splice(index, 1);
  renderJpgFileList();
  jpgInput.value = ""; // allow re-select same file
}

// Clear all
clearJpgBtn.addEventListener("click", () => {
  selectedJpgFiles = [];
  renderJpgFileList();
  jpgInput.value = "";
});

// Merge images button handler
mergeJpgBtn.addEventListener("click", async () => {
  if (!selectedJpgFiles.length) {
    displayMessage("Please select images first!", "Red");
    //alert("Please select images first!");
    return;
  }

  // Load all images
  const images = await Promise.all(
    selectedJpgFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    })
  );

  // Determine total width/height (stack vertically)
  const width = Math.max(...images.map((img) => img.width));
  const height = images.reduce((sum, img) => sum + img.height, 0);

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Draw images one below the other
  let y = 0;
  images.forEach((img) => {
    ctx.drawImage(img, 0, y, img.width, img.height);
    y += img.height;
  });

  // Download merged image
  canvas.toBlob(
    (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.jpg";
      a.click();
      URL.revokeObjectURL(url);
    },
    "image/jpeg",
    0.95
  );
});

function displayMessage(text = "", color = "black") {
  messageBlock.classList.add("messageBlockContainer");
  messageBlock.style.display = "block";
  messageBlock.style.color = color;
  messageBlock.innerText = text;
  setTimeout(() => (messageBlock.style.display = "none"), 2500);
}
