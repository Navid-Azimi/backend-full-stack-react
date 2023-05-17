import express from "express";
import cors from "cors";
import {db, connectToDb} from "./db.js"


const app = express();

app.use(express.json());
app.use(cors())

app.get('/api/articles/:name/', async (req, res) => {
  const { name } = req.params;
 

  const article = await db.collection('articles').findOne({ name });

  if (article) {
    res.json(article);
  } else {
    res.sendStatus(404);
  }

})


app.put('/api/articles/:name/upvote', async (req, res) => {
  const { name } = req.params;

  await db.collection('articles').updateOne({ name }, {
    $inc: { votes: 1 }
  });
  const articles = await db.collection('articles').findOne({ name });

  if (articles) {
    res.send(`the ${name} article now has ${articles.votes}`)
  } else {
    res.send('this article doesn\'t exist');
  }
})

app.post('/api/articles/:name/comments', async (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;


  await db.collection('articles').updateOne({name}, {
    $push: {comments: {postedBy, text}}
  });

  const article = await db.collection('articles').findOne({name});
  if (article) {
    res.send(article.comments);
  } else {
    res.send('this article doesn\'t exist');
  }

})

connectToDb(() => {
  app.listen(8000, () => {
    console.log("server is listening from port 8000");
  })
})
