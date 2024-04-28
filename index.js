const express=require('express');
const mongoose=require('mongoose');
const postSchema=require('./models/postsSchema');
require('dotenv').config();
const app=express();

const CORS = require('cors');
app.use(CORS());

//middleware
app.use(express.json());

//connection
mongoose.connect(process.env.MongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // console.log(process.env.MongoUrl);
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
app.get('/',(req,res)=>{
    res.send("Api is LIVE");
});

// Post creation Route to store the data regarding the different posts
app.post('/createPost',async (req,res)=>{
    try{
        const data=req.body;
        console.log(data);
        console.log(data.username);
        console.log(data.post);
        const Post = getModelForId(data.username);


        // Insert data into the dynamically created collection
        const post = await Post.create(data.post);
        res.status(200).json({ status:'ok' });
    }
    catch(error){
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//retrieving all the posts of the person in their profile
app.post('/FetchAllPosts',async(req,res)=>{
    try{
        const user=req.body.username;
        const Posts=getModelForId(user);
        const posts=await Posts.find({});
        res.status(200).json(posts);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
})