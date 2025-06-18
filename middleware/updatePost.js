const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const updatePost = async (req, res) => {
  const jsonFilePath = path.join(__dirname, "../public", "refrence.json");

  try {
    let posts = [];

    if (fs.existsSync(jsonFilePath)) {
      const data = await fsPromises.readFile(jsonFilePath, "utf8");
      posts = JSON.parse(data);
    }

    const { id, description, oldImage } = req.body;

    const imagePath = req.file
      ? `/images/uploads/${req.file.filename}`
      : oldImage;

    // Update the post by matching old description + old image
    posts = posts.map((post) => {
      if (String(post.id) === String(id)) {
        return {
          ...post,
          description,
          image: imagePath,
          id: post.id, // keep original ID (or regenerate if you prefer)
        };
      }
      return post;
    });

    await fsPromises.writeFile(jsonFilePath, JSON.stringify(posts, null, 2));

    // Optionally delete the old image if replaced
    if (posts.description === description && posts.image === oldImage) {
      const fullOldImagePath = path.join(__dirname, "public", oldImage);
      if (fs.existsSync(fullOldImagePath)) {
        await fsPromises.unlink(fullOldImagePath);
      }
    }

    res.redirect("/");
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).send("Failed to update post.");
  }
};

module.exports = updatePost;
