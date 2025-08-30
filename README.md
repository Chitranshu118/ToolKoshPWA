# 📦 ToolKosh
👨‍💻 **Author:** Chitranshu Sharma  

---

A lightweight utility that helps you work with files seamlessly — **directly from your browser in offline mode**.  
With a simple and intuitive interface, you can:

- ✅ Merge multiple **PDF files** into one  
- ✅ Merge multiple **JPG images** into a single image  
- ✅ Convert an **Image (PNG/JPG) into a PDF**  
- ✅ Format and validate **JSON**  

---

## 🛠️ Tech Stack

- **JavaScript (Vanilla JS)** – File handling logic  
- **PDFLib (MIT Licensed)** – For PDF manipulation  
- **HTML5 + CSS3** – UI and styling  
- **Chrome Extension APIs** – For extension packaging and execution  

---

## 📂 Project Structure

utility-toolkit-extension/
│
├── manifest.json # Chrome extension config
├── index.html # Extension UI
├── app.js # Main logic (merge, convert, UI events)
├── styles.css # Styling for tabs, buttons, inputs
├── toolkosh.png # Extension icon
└── README.md # Project documentation



---

## 🔧 Installation

1. **Clone or download** this repository.  
2. Open Chrome and navigate to **chrome://extensions/**.  
3. Enable **Developer Mode** (toggle at top-right corner).  
4. Click **Load unpacked**.  
5. Select the **project folder**.  
6. The extension will now appear in your toolbar 🎉.  

---

## 🖼️ Screenshots

![ToolKosh](sample.png)

---

## ⚠️ Notes

- Only **PDF files** are allowed in the *Merge PDF* tab.  
- Only **JPG images** are allowed in the *Merge JPG* tab.  
- Only **JPG/PNG single file** is allowed in the *Image to PDF* tab.  
- Unsupported formats are **automatically rejected** with an error message.  

---


## 📜 License

This project is licensed under the **MIT License** .

---

📧 **Contact:** sharmachitranshu118@gmail.com  


