const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const storePost = async (req, res) => {
  const { description } = req.body;
  const imagePath = `/images/uploads/${req.file.filename}`;
  console.log(description, " ", imagePath);
  const newPost = {
    id: Date.now(),
    description,
    image: imagePath,
  };

  const jsonFilePath = path.join(__dirname, "../public", "refrence.json");

  try {
    // Ensure the JSON file exists, create it with an empty array if not
    if (!fs.existsSync(jsonFilePath)) {
      await fsPromises.writeFile(jsonFilePath, JSON.stringify([], null, 2));
    }

    // Read existing posts
    const data = await fsPromises.readFile(jsonFilePath, "utf-8");
    const posts = JSON.parse(data);
    const isDuplicate = posts.some(
      (post) => post.description.trim() === description.trim()
    );

    if (isDuplicate) {
      console.log("Duplicate post, skipping save");
      return; // Skip saving
    }
    // Add the new post
    posts.push(newPost);

    // Overwrite the file with the updated post list
    await fsPromises.writeFile(jsonFilePath, JSON.stringify(posts, null, 2));

  res.render('index.ejs',{posts});
  } catch (err) {
    console.error("Error saving post:", err);
    res.status(500).send("Failed to save post.");
  }
};

module.exports = storePost;
