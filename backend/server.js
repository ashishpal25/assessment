const express = require('express');
const https = require('https');
const app = express();
const cors = require('cors');
app.use(cors());



// this is function to fatch data from api
const url = 'https://hacker-news.firebaseio.com/v0';

function apidata(path){
    return new Promise((resolve,reject)=>{
        https.get(`${url}${path}`,(res)=>{
            let data='';

            res.on('data',(recivedata)=>{
                data +=recivedata
            })
            
            res.on('end',()=>{
                try{
                    resolve(JSON.parse(data));
                }
                catch(error){
                    reject(error)
                }
            })
        }).on('error',(error)=>{
            reject(error)
        })
    })

}


app.get('/api/stories/newest', async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;  
      const storyIds = await apidata('/newstories.json');
      const paginatedIds = storyIds.slice((page - 1) * limit, page * limit);
      const storyPromises = paginatedIds.map((id) => apidata(`/item/${id}.json`));
      const stories = await Promise.all(storyPromises);
      res.json(stories);
    } catch (error) {
      console.error('Error fetching stories:', error);
      res.status(500).send('Error fetching newest stories');
    }
  });

  app.get('/api/stories/search', async (req, res) => {
    try {
      const { query } = req.query;
      const storyIds = await apidata('/newstories.json');
      const storyPromises = storyIds.slice(0, 100).map((id) => apidata(`/item/${id}.json`));
      const stories = await Promise.all(storyPromises);
      const filteredStories = stories.filter(
        (story) => story.title && story.title.toLowerCase().includes(query.toLowerCase())
      );
      res.json(filteredStories);
    } catch (error) {
      console.error('Error searching stories:', error);
      res.status(500).send('Error searching stories');
    }
  });



app.listen(3000, () => {
    console.log(' port 3000');
  });