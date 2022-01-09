const express =require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

let db = new sqlite3.Database(__dirname + '/db/gitapp.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.log(__dirname + '/db/gitapp.db');
    console.error(err.message);
  }else{
    console.log('connected to feed');
  }
});

router.post('/registeruser', (req, res) => {
  axios.post('http://dreamnode.ddns.net:5000/app/registeruser', req.body)
  .then(function (response) {
    console.log(response.data);
    res.send(response.data);
  })
  .catch(function (error) {
    console.log(error);
    res.send({"status":"serverDown"});
  });
  });
//---------------------------------------------------------------------
  
  router.post('/login', (req, res) => {
    axios.post('http://dreamnode.ddns.net:5000/app/login', req.body)
    .then(function (response) {
      console.log(response.data);
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res.send({"status":"serverDown"});
    });
  });
//--------------------------------------------------------------------------------------
  router.get('/getuserdetails', (req, res) => {
    console.log(req.path);
    axios({
      method: 'get',
      url: 'http://dreamnode.ddns.net:5000/app/getuserdetails',
      headers: req.headers
    })
    .then(function (response) {
      console.log(response.data);
      res.send(response.data);
    }).catch(function (error) {
      console.log(error);
      res.send({"status":"serverDown"});
    });
  });
  //---------------------------------------------------------------------------------------------------
  router.get("/getmytodo", (req, res) => {
    
    axios({
      method: 'get',
      url: 'http://dreamnode.ddns.net:5000/app/getmytodo',
      headers: req.headers
    })
    .then(function (response) {
      console.log(response.data);
      res.send(response.data);
    }).catch(function (error) {
      console.log(error);
      res.send({"status":"serverDown"});
    });
  });
  
  //-------------------------------------------------------------------------
  router.post("/postmessage", (req, res) => {
    axios({
      method: 'post',
      url: 'http://dreamnode.ddns.net:5000/app/postmessage',
      headers: req.headers,
	  data: req.body
    })
    .then(function (response) {
      console.log(response.data);
      res.send(response.data);
    }).catch(function (error) {
      console.log(error);
      res.send({"status":"serverDown"});
    });  
  });
  //-----------------------------------------------------------------
  router.get('/myusrlist', (req, res) => {
    axios({
      method: 'get',
      url: 'http://dreamnode.ddns.net:5000/app/myusrlist',
      headers: req.headers
    })
    .then(function (response) {
      console.log(response.data);
      res.send(response.data);
    }).catch(function (error) {
      console.log(error);
      res.send({"status":"serverDown"});
    });
  });
  //------------------------------------------------------------------------------------------------------
  router.get("/searchusers", (req, res) => {
    axios({
      method: 'get',
      url: 'http://dreamnode.ddns.net:5000/app/searchusers',
      headers: req.headers
    })
    .then(function (response) {
      console.log(response.data);
      res.send(response.data);
    }).catch(function (error) {
      console.log(error);
      res.send({"status":"serverDown"});
    });
});

//-------------------------------------------------------
router.get("/checkacc", (req, res) => {
  axios({
    method: 'get',
    url: 'http://dreamnode.ddns.net:5000/app/checkacc',
    headers: req.headers
  })
  .then(function (response) {
    console.log(response.data);
    res.send(response.data);
  }).catch(function (error) {
    console.log(error);
    res.send({"status":"serverDown"});
  });
  });
  //-----------------------------------------------------------------------
  router.get("/accuserlist", (req, res) => {
    axios({
      method: 'get',
      url: 'http://dreamnode.ddns.net:5000/app/accuserlist',
      headers: req.headers
    })
    .then(function (response) {
      console.log(response.data);
      res.send(response.data);
    }).catch(function (error) {
      console.log(error);
      res.send({"status":"serverDown"});
    });
  });
//-------------------------------------------------------------------------------------------------
router.post('/createaccreq', (req, res) => {
    axios({
      method: 'post',
      url: 'http://dreamnode.ddns.net:5000/app/createaccreq',
      headers: req.headers,
    data: req.body
    })
    .then(function (response) {
      console.log(response.data);
      res.send(response.data);
    }).catch(function (error) {
      console.log(error);
      res.send({"status":"serverDown"});
    });
  });
  //------------------------------------------------------------------------
  router.get("/getrequests", (req, res) => {
    axios({
      method: 'get',
      url: 'http://dreamnode.ddns.net:5000/app/getrequests',
      headers: req.headers
    })
    .then(function (response) {
      console.log(response.data);
      res.send(response.data);
    }).catch(function (error) {
      console.log(error);
      res.send({"status":"serverDown"});
    });
  });
  
  //----------------------------------------------------------------------
  router.post("/accrejreq", (req, res) => {
    axios({
      method: 'post',
      url: 'http://dreamnode.ddns.net:5000/app/accrejreq',
      headers: req.headers,
	  data: req.body
    })
    .then(function (response) {
      console.log(response.data);
      res.send(response.data);
    }).catch(function (error) {
      console.log(error);
      res.send({"status":"serverDown"});
    });
  });
  //-----------------------------------------------------------------

  router.post("/updmsgstatus", (req, res) => {
    axios({
      method: 'post',
      url: 'http://dreamnode.ddns.net:5000/app/updmsgstatus',
      headers: req.headers,
	  data: req.body
    })
    .then(function (response) {
      console.log(response.data);
      res.send(response.data);
    }).catch(function (error) {
      console.log(error);
      res.send({"status":"serverDown"});
    });
  });
  //-----------------------------------------------------------------

router.get('/',(req,res)=>{
    
    axios.get('http://dreamnode.ddns.net:5000/app')
  .then(function (response) {
    console.log(req.path);
    res.send({status:'pass'});
    //console.log(response);
  })
  .catch(function (error) {
    //console.log(error);
  });
});

module.exports = router;