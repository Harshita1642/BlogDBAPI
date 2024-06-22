const express = require('express');
const mongoose = require('mongoose');
const postSchema = require('./models/postsSchema');
require('dotenv').config();
const app = express();

const CORS = require('cors');
app.use(CORS());

// Middleware
app.use(express.json());

// Connection
mongoose.connect(process.env.MongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');

        // Start the server after the database connection is established
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
    });

// Function to create or retrieve the Mongoose model for a given ID
const getModelForId = id => {
    let Post;
    try {
        Post = mongoose.model(id);
    } catch (error) {
        Post = mongoose.model(id, postSchema);
    }
    return Post;
};

app.get('/', (req, res) => {
    res.send("API is LIVE");
});

// Post creation Route to store the data regarding the different posts
app.post('/createPost', async (req, res) => {
    try {
        const data = req.body;
        const Post = getModelForId(data.username);

        // Insert data into the dynamically created collection
        const post = await Post.create(data.post);
        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Retrieving all the posts of the person in their profile
app.post('/FetchAllPosts', async (req, res) => {
    try {
        const user = req.body.username;
        const Posts = getModelForId(user);
        const posts = await Posts.find({});
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get random posts from all user collections
app.get('/randomPosts', async (req, res) => {
    try {
        const users = await mongoose.connection.db.listCollections().toArray();
        let allPosts = [];

        for (let userCollection of users) {
            const userCollectionName = userCollection.name;
            if (userCollectionName !== 'system.indexes') {
                const UserPost = mongoose.connection.collection(userCollectionName);
                const posts = await UserPost.find().toArray();
                allPosts = allPosts.concat(posts);
            }
        }

        // Shuffle allPosts array to randomize
        allPosts = allPosts.sort(() => 0.5 - Math.random());

        // Limit to 5 posts (or any number you prefer)
        const randomPosts = allPosts.slice(0, 8);

        res.json(randomPosts);
    } catch (error) {
        console.error('Error fetching random posts:', error);
        res.status(500).json({ message: 'Error fetching random posts', error });
    }
});

module.exports = app;