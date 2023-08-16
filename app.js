// extra DOM
const body = document.querySelector("body");
const header = document.querySelector("header");

// file selection DOM
const card = document.querySelector(".card");
const fileSelectorBtn = document.querySelector(".file-selector-btn");
const fileSelector = document.querySelector(".file-selector");
const fileNameDisplay = document.querySelector(".file-name-display");
const submitBtn = document.querySelector(".submit-btn");

// content DOM
const content = document.querySelector(".content");
const fileContentDisplay = document.querySelector(".file-content-display");

// main
fileSelectorBtn.addEventListener("click", () => {
  fileSelector.click();
});

fileSelector.addEventListener("change", () => {
  fileSelectorBtn.innerHTML = "Pick another book";
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    // process the selected file
    fileNameDisplay.style.display = "block";
    submitBtn.style.display = "block";
    fileNameDisplay.textContent = 'File name : "' + selectedFile.name + '"';
    submitBtn.addEventListener("click", async () => {
      content.style.display = "flex";
      header.style.display = "none";
      card.style.display = "none";
      body.style.backgroundColor = "#ccc";

      // txt processor
      if (selectedFile.type === "text/plain") {
        const textData = await selectedFile.text();
        const formattedTextData = textData.replace(/\n/g, "<br>");
        fileContentDisplay.innerHTML = formattedTextData;
      }
      // pdf processor
      else if (selectedFile.type === "application/pdf") {
        const pdfData = await selectedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

        let fullPdfText = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          const viewport = page.getViewport({ scale: 1 });
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext).promise;

          const text = textContent.items.map((item) => item.str).join(" ");

          fullPdfText += text + "\n";
          fileContentDisplay.appendChild(canvas);
        }

        // Display the extracted text in the book content display
        fileContentDisplay.textContent = fullPdfText;
      }
    });
  }
});
