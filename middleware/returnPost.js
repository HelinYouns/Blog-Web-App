const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const returnPost = async (req, res) => {
  try {
    const jsonFilePath = path.join(__dirname, "../public", "refrence.json");
    let posts = [];

    // Check if the JSON file exists and read posts if available
    if (fs.existsSync(jsonFilePath)) {
      const data = await fsPromises.readFile(jsonFilePath, "utf-8");
      posts = JSON.parse(data);
    }

    posts.forEach(function (post) {
      const postTime = dayjs(post.id);
      const now = dayjs();

      //const ageInHours = now.diff(postTime, "hour");
      const timeInDays = now.diff(postTime, "day");

      if (timeInDays >= 1) {
        post.postedAt = postTime.format("DD/MM/YYYY"); 
      } else {
        post.postedAt = postTime.fromNow(); 
      }
    });

    
    res.render("index.ejs", { posts });
  } catch (err) {
    console.error("Error returning posts:", err);
    res.status(500).send("Failed to return posts.");
  }
};

module.exports = returnPost;
