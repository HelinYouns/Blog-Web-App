const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");


const deletePost = async (req, res) => {
  try {
    const jsonFilePath = path.join(__dirname, "../public", "refrence.json");
    const { description, image } = req.body;

    const data = await fsPromises.readFile(jsonFilePath, "utf8");
    let posts = JSON.parse(data);

    // Filter out the post to delete
    posts = posts.filter(post => !(post.description === description && post.image === image));

    // Save updated posts
    await fsPromises.writeFile(jsonFilePath, JSON.stringify(posts, null, 2));

    // Optionally delete the image file too
    const imagePath = path.join(__dirname, "../public", image);
    if (fs.existsSync(imagePath)) {
      await fsPromises.unlink(imagePath);
    }

    res.redirect("/");
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).send("Failed to delete post.");
  }
};
module.exports = deletePost;
