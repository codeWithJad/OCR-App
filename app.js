const tesseract = require("tesseract.js");
const multer = require("multer"); // To handle file uploads
const express = require("express");

const app = express();

// Serve static files from the "public" directory
app.use(express.static("public"));

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.set("view engine", "ejs");

//Parse JSON request bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

async function main(fileBuffer) {
  return new Promise((resolve, reject) => {
    tesseract
      .recognize(fileBuffer, "eng", { logger: (info) => console.log(info) })
      .then(({ data }) => {
        const text = data.text;
        resolve(text);
      })
      .catch((error) => {
        console.log(error.message);
        reject(error.message);
      });
  });
}

app.post("/api/text", upload.single("file"), async (req, res) => {
  console.log(req.body);
  try {
    const fileBuffer = req.file.buffer; // Access the uploaded file buffer
    const result = await main(fileBuffer); // Pass the file buffer to the main function
    console.log(result);
    res.json({ text: result });
  } catch (error) {
    console.error("Error generating", error);
    res.status(500).json({ message: "Generation has Failed!" });
  }
});

app.listen(3000, () => {
  console.log("Server is at port 3000");
});
