const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const storePost = require("./middleware/storePost");
const returnPost = require("./middleware/returnPost");
const deletePost = require("./middleware/deletePost");
const updatePost = require("./middleware/updatePost");
const fs = require("fs");
const fsPromises = require("fs").promises;
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "public", "images", "uploads/"));
  },
  filename: (req, file, callback) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    callback(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

app.use(
  "/images/uploads",
  express.static(path.join(__dirname, "public", "images", "uploads"))
);

app.get("/", async (req, res) => {
  const jsonFilePath = path.join(__dirname, "/public", "refrence.json");

  try {
    if (!fs.existsSync(jsonFilePath)) {
      return res.render("noPostYet.ejs");
    }

    const fileData = fs.readFileSync(jsonFilePath, "utf8");

    if (!fileData.trim()) {
      return res.render("noPostYet.ejs");
    }

    const posts = JSON.parse(fileData);

    if (!Array.isArray(posts) || posts.length === 0) {
      return res.render("noPostYet.ejs");
    }

    returnPost(req, res);
  } catch (err) {
    console.error("Error reading or parsing JSON:", err);
    res.render("noPostYet.ejs");
  }
});

app.get("/addpost", (req, res) => {
const { id, description, image } = req.query;
const isEdit = !!(description && image && id);
res.render("addpost.ejs", {
  id: id || "",
  description: description || "",
  image: image || "",
  isEdit,
});

});


app.post("/post", upload.single("image"), async (req, res) => {
  if (!req.file) return res.send("File not uploaded");

  try {
    await storePost(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving post");
  }
});

app.post("/updatepost", upload.single("image"), async (req, res) => {
 await updatePost(req,res);
});

app.post('/deletepost',(req,res)=>{
  deletePost(req,res);
})
app.listen(PORT, () => {
  console.log(`Server Running On Port: ${PORT}`);
});
