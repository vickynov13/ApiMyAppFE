const port=process.env.PORT || 5000;
const express =require('express');
const path = require('path');
var bodyParser = require('body-parser');
const app = express();
//Routes
const data = require('./routes/app');
const media = require('./routes/media');
const angpath = './angulardist';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(angpath));

//Routes Usage
app.use('/app',data);
app.use('/media',media);


app.get('*',(req,res)=>{
  res.sendFile(path.join(angpath,'/index.html'));
});

app.listen(port, function () {
    console.log(`service running on http://localhost:${port}/`);
  })
  
