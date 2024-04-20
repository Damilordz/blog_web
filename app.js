import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
let posts = [];
let postInfo = "";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Render the homepage with post information
app.get("/", (req, res) => {
  res.render("home.ejs", { postInfo: postInfo, posts: posts });
  postInfo = "";
});

// Route to render the "about" page
app.get("/about", (req, res) => {
    res.render("about.ejs")
})

// Route to render the "contact" page
app.get("/contact", (req, res) => {
    res.render("contact.ejs")
})


// Handle post requests to create new posts
app.post("/post", (req, res) => {
  let title = req.body["title"];
  let content = req.body["content"];

  // Check if title or content is empty
  if (title === "" || content === "") {
    // If either is empty, display an error message
    postInfo = "Please enter both title and content for each post !!";
  } else {
    // If both title and content are provided, create a new post
    let postId = generateId(); // Generate unique ID for the post
    posts.push({ id: postId, title: title, content: content });
    postInfo = "Post created successfully !!";
  }
  res.redirect("/"); // Redirect to homepage to display all posts
});

// Render the edit page for a specific post
app.post("/edit", (req, res) => {
    let postId = req.body["postId"];
    let post = posts.find(post => post.id === postId);
    if (!post) {
        res.status(404).send("Post not found");
        return;
    }
    res.render("edit.ejs", { postId: postId, post: post });
});

// Save the edited post
app.post("/save", (req, res) => {
    let postId = req.body["postId"];
    let newTitle = req.body["title"];
    let newContent = req.body["content"];
    postInfo = "Post Edited Successfully !!";
    
    // Find the index of the post with the given ID
    let postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
        // Update the title and content of the post
        posts[postIndex].title = newTitle;
        posts[postIndex].content = newContent;
        // Redirect to the homepage
        res.redirect("/");
    } else {
        // Handle case where post with given ID is not found
        res.status(404).send("Post not found");
    }
});

// Delete a post
app.post("/delete", (req, res) => {
    let postId = req.body["postId"];
    posts = posts.filter(post => post.id !== postId); // Remove post with specified ID
    postInfo = "Post deleted !!";
    res.redirect("/");
});

// Generate a random alphanumeric ID
function generateId() {
    return Math.random().toString(36).slice(2);
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
