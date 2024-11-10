const express =require('express');
const router = express.Router();
var path = require('path');
var pics = path.join(__dirname, 'pics');
const multer = require('multer');
const sharp = require('sharp');
const url = require('url');
const fs = require('fs-extra');
const db = require("./db.js");


const storage= multer.diskStorage({
    destination:(req,file,callBack)=>{
        callBack(null, pics);
    },
    filename:(req,file,callBack)=>{
        callBack(null,file.originalname);
    }
  });
  var upload = multer({storage:storage});
  
  const authentication = function (req, res, next) {
    console.log(req.headers.skey);
    var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
    var params1 =[req.headers.uid, req.headers.skey];
    db.query(sql1,params1, (err, results, fields) => {
      if (err) {
        res.send({status:"Authentication Failed"});
      }else{
        if(results[0].res===1){
          return next();
        }else{
          res.send({status:"Authentication Failed"});
        }
      }
    });
    };
  
    router.post('/imgupload', authentication, upload.single('file'), (req,res,next)=>{
      const file = req.file;
      let location = req.body.location;
      let occation = req.body.occation;
      let person1 = req.body.person1;
      let person2 = req.body.person2;
      let tag5 = req.body.tag5;
      let uploadedby = req.headers.uid;
      let actualname = file.originalname;
      let optmname = "OPT_"+actualname;
      var sql2 ="INSERT INTO MEDIA_INFO (photo_name,lq_photoname,uploaded_by,added_dte,location,occation,person1,person2,tag5) VALUES (?,?,?,DATE_FORMAT(NOW(), '%d-%m-%Y'),?,?,?,?,?)";
      var sql3 ="UPDATE MEDIA_INFO SET added_dte = DATE_FORMAT(NOW(), '%d-%m-%Y'), location = ?,occation = ?,person1 = ?,person2 = ?,tag5 = ? WHERE photo_name = ?";
      var params2 =[actualname,optmname,uploadedby,location,occation,person1,person2,tag5];
      var params3 =[location,occation,person1,person2,tag5,actualname];
      console.log(file);
      console.log("1: "+location+", 2:"+occation+", 3:"+person1+", 4:"+person2+", 5:"+tag5+", photoname:"+actualname+", optname:"+optmname+", uploadedby:"+uploadedby);
      if(!file){
          const error = new Error('Please select a file');
          error.httpStatusCode = 400;
          return next(error);
      }
      console.log(pics+'/'+ actualname);
      sharp(pics+'/'+ actualname)
      .rotate()
      .resize(500,null, {
        kernel: sharp.kernel.nearest,
        fit: 'contain',
        position: 'right top',
        background: { r: 255, g: 255, b: 255, alpha: 0.5 }
      })
      .toFile(pics+'/'+ optmname)
      .then(() => {
        db.query(sql2,params2, (err, results) => {
          if (err) {
            db.query(sql3,params3, (err, results) => {
              if (err) {
                res.send(err);
              }else{
                res.send({status:"Image exists, Updates other details"});
              }
            });
          }else{
            res.send({ststus:"success"});
          }
        });
      })
      .catch( err => {console.log(err);});
      
    });
  

    const getauth = function (req, res, next) {
        const queryObject = url.parse(req.url,true).query;
          var uid = queryObject.uid;
          var skey = queryObject.skey;
          var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
          var params1 =[uid, skey];
          db.query(sql1,params1, (err, results, fields) => {
          if (err) {
            res.send({status:"Authentication Failed"});
          }else{
            if(results[0].res===1){
              return next();
            }else{
              res.send({status:"Authentication Failed"});
            }
          }
        });
        };
      
      router.get('/myuploads', authentication, (req, res) => {
        var sql1 ='select id, uploaded_by as user, added_dte as datee, substr(lq_photoname,1,LENGTH(lq_photoname)-4) as photo, substr(photo_name,1,LENGTH(photo_name)-4) as hqphoto FROM MEDIA_INFO WHERE uploaded_by = ?  ORDER BY id DESC';
        var params1 =[req.headers.uid];
        db.query(sql1,params1, (err, results, fields) => {
          if (err) {
            return res.send({status:"Authentication Failed"});
            }else{
              return res.send(results);
          }
          });
      });
      
      
      
      
        router.get("/getmyview", (req, res) => {
          var headr = req.headers;
          let skey = headr["skey"];
          let uid = headr["uid"];
          //console.log("skey : "+skey +", uid :"+uid+", gname:"+gname);
            var sql2 = "SELECT id, substr(photo_name,1,LENGTH(photo_name)-4) as photo_name, substr(lq_photoname,1,LENGTH(lq_photoname)-4) as lq_photoname, uploaded_by, added_dte, 'false' as error FROM MEDIA_INFO WHERE (uploaded_by in (SELECT g_username FROM USERACCESS_INFO WHERE p_username = ? AND status = 'C' AND accesstype = 'MEDIA') OR uploaded_by=?) ORDER by id DESC";
            var params2 =[uid,uid];
          var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
          var params1 =[uid, skey];
          db.query(sql1,params1, (err, results) => {
            if (err) {
            console.log(err);
             return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':'sql 1 err'}]);
            }else{
              if(results[0].res===1){
               db.query(sql2,params2, (err, results) => {
                 if (err) {
                  console.log(err);
                   return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':'sql 2 err'}]);
                 }else{
                  return res.send(results);
                 }  
                 });
              }else{
                console.log(err);
               return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':true}]);
              }
            }
          });
        });

router.get('/:path', getauth, (req, res) => {
      if (fs.existsSync(path.join(pics, req.params.path + ".jpg"))) {
          res.sendFile(path.join(pics, req.params.path + ".jpg"));
        }else{
        console.log('file not exist');
        res.sendStatus(404);
          }
        });
      
router.get('/',(req,res)=>{
    res.send({status:'pass'});
});


module.exports = router;