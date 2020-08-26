const express =require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(__dirname + '/db/gitapp.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.log(__dirname + '/db/gitapp.db');
    console.error(err.message);
  }else{
    console.log('connected to feed');
  }
});

router.post('/registeruser', (req, res) => {
    //console.log("post triggered");
    let fname = req.body.fname;
    let lname = req.body.lname;  
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let mobile = req.body.mobile;
    var status = false;
    var sql1 ='INSERT INTO USER_LOGIN_INFO (username,password) VALUES (?,?)';
    var sql2 ='INSERT INTO USER_INFO (fname,lname,mobile,email,username) VALUES (?,?,?,?,?)';
    var params1 =[username, password];
    var params2 =[fname, lname, mobile, email, username];
    db.run(sql1, params1, function (err, result) {
      if (err) {
              return res.send(err);
      } else {
              db.run(sql2, params2, function (err, result) {
                  if(err){
                      return res.send(err);
                  } else {
                      return res.send({'status':'pass'});
                  }
              });
      }
    });
  });
//---------------------------------------------------------------------
  
  router.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password; 
    const {randomBytes} = require('crypto');
  const uid = Math.random().toString(36).slice(2) + randomBytes(8).toString('hex') + new Date().getTime();
      //console.log(uid);
    var sql1 ='SELECT * FROM USER_LOGIN_INFO WHERE USERNAME like ? AND PASSWORD = ?';
    var sql2 ='UPDATE USER_LOGIN_INFO SET sessionkey = ? WHERE USERNAME like ?';
    var params1 =[username, password];
    db.all(sql1, params1,(err, result, fields)=> {
      if (!err) {
        var rstring=JSON.stringify(result);
        var rjson =  JSON.parse(rstring);
        if(rjson.length>0){
          //console.log(rjson.length);
          var usrnme = rjson[0].username;
          var params2 =[uid, usrnme];
          db.run(sql2, params2, function (err, result) {
            if(err){
              return res.send(err);
            } else {
              return res.send({'error':'false','uid': username, 'skey':uid});
            }
          });
        } else {
          return res.send({'error':'invalid','uid': null, 'skey':null});
        }
      }else{
        //console.log(err);
      }
    });
  });
//--------------------------------------------------------------------------------------
  router.get('/getuserdetails', (req, res) => {
    var headr=req.headers;
    let skey = headr['skey'];
    let uid = headr['uid'];
    var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
    var sql2 ='SELECT fname, lname, mobile, email FROM USER_INFO WHERE username like ?';
    var params1 =[uid, skey];
    var params2 =[uid];
    db.all(sql1,params1, (err, results, fields) => {
       if (err) {
        // console.log("error1");
        return res.send([{'fname':null,'lname': null,'mobile':null,'email':null,'error':true}]);
       }else{
         if(results[0].res===1){
          db.all(sql2,params2, (err, results, fields) => {
            if (err) {
              //console.log("error2");
              return res.send([{'fname':null,'lname': null,'mobile':null,'email':null,'error':true}]);
            }else{
              var fname = results[0].fname;
              var lname = results[0].lname;
              var mobile = results[0].mobile;
              var email = results[0].email;
              return res.send([{'fname':fname,'lname': lname,'mobile':mobile,'email':email,'error':false}]);
            }  
            });
         }else{
          //console.log("error3");
          return res.send([{'fname':null,'lname': null,'mobile':null,'email':null,'error':true}]);
         }
       }
     });
  });
  //---------------------------------------------------------------------------------------------------
  router.get("/getmytodo", (req, res) => {
    var headr = req.headers;
    let skey = headr["skey"];
    let uid = headr["uid"];
    let gname = headr["gname"];
    //console.log("skey : "+skey +", uid :"+uid+", gname:"+gname);
    if(uid==gname){
      var sql3 ="SELECT id as msgid, short_msg as smsg, long_msg as lmsg, status as mmsgsts, sender as msgby, 'true' as ownlst, strftime('%d-%m',added_dt) as adddte, secret FROM All_MESSAGES WHERE receiver = ? ORDER BY status DESC, id DESC";
      var params3 =[uid];
      var sql2 = "SELECT ? as res";
      var params2 =[1];
    }else if(uid!=gname){
      var sql3 ="SELECT id as msdid, short_msg as smsg, long_msg as lmsg, status as mmsgsts, sender as msgby, 'false' as ownlst, strftime('%d-%m',added_dt) as adddte, secret FROM All_MESSAGES WHERE (receiver = ? AND secret = 'false') OR (sender=? AND receiver = ?) ORDER BY status DESC, id DESC";
      var params3 =[gname,uid,gname];
      var sql2 = "SELECT count(p_username) as res FROM USERACCESS_INFO WHERE p_username = ? and g_username = ? and accesstype='LIST'";
      var params2 =[uid,gname];
    }
    var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
    var params1 =[uid, skey];
    db.all(sql1,params1, (err, results) => {
      if (err) {
      console.log(err);
       return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':'sql 1 err'}]);
      }else{
        if(results[0].res===1){
         db.all(sql2,params2, (err, results) => {
           if (err) {
            console.log(err);
             return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':'sql 2 err'}]);
           }else{if(results[0].res===1){
            db.all(sql3,params3, (err, results) => {
              if (err) {
                console.log(err);
                return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':'sql 3 err'}]);
              }else{
                return res.send(results);
              }  
              });
           }else{
            console.log(err);
            return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':'checking listaccess err'}]);
           }
           }  
           });
        }else{
          console.log(err);
         return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':true}]);
        }
      }
    });
  });
  
  //-------------------------------------------------------------------------
  router.post("/postmessage", (req, res) => {
    var headr = req.headers;
    let skey = headr["skey"];
    let smsg = req.body.smsg;
    let lmsg = req.body.lmsg;
    let receiver = req.body.receiver;
    let sender = req.body.sender;
    let secret = req.body.secret;
    var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
    var sql2 ="INSERT INTO All_MESSAGES (short_msg,long_msg,secret,receiver,sender,added_dt) VALUES (?,?,?,?,?,date())";
    var params1 =[sender, skey];
    var params2 =[smsg, lmsg,secret,receiver,sender];
    db.all(sql1,params1, (err, results) => {
      if (err) {
        //console.log("error1");
       return res.send([{'error':'true','status': 'db issue'}]);
      }else{
        if(results[0].res===1){
            db.run(sql2,params2, (err, results) => {
              if (err) {
                return res.send([{'error':'true','status': 'db issue INSERT error'}]);
              }else{
                return res.send([{'error':'false','status': 'success'}]);
              }
            });
        }else{
         return res.send([{'error':'true','status': 'loginissue'}]);
        }
      }
    });
  });
  //-----------------------------------------------------------------
  router.get('/myusrlist', (req, res) => {
    var headr=req.headers;
    let skey = headr['skey'];
    let uid = headr['uid'];
    var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
    var sql2 ="SELECT USER_INFO.fname, USER_INFO.lname, USER_INFO.username, 'C' as listaccess, 'true' as updated FROM USER_INFO INNER JOIN USERACCESS_INFO ON USER_INFO.username = USERACCESS_INFO.g_username WHERE USERACCESS_INFO.status = 'C' and  USERACCESS_INFO.accesstype = 'LIST' and USERACCESS_INFO.p_username = ?";
    var params1 =[uid, skey];
    var params2 =[uid];
    db.all(sql1,params1, (err, results, fields) => {
       if (err) {
         console.log("error1");
        return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':true}]);
       }else{
         if(results[0].res===1){
          db.all(sql2,params2, (err, results, fields) => {
            if (err) {
              console.log("error2");
              console.log(err);
              return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':true}]);
            }else{
              return res.send(results);
            }  
            });
         }else{
          console.log("error3");
          console.log(results[0].res);
          return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':true}]);
         }
       }
     });
  });
  //------------------------------------------------------------------------------------------------------
  router.get("/searchusers", (req, res) => {
    var headr = req.headers;
    let skey = headr["skey"];
    let uid = headr["uid"];
    let strm = headr["sterm"];
    let acctype = headr["acct"];
    var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
    if(acctype==='LIST'){
      var sql2 ='SELECT fname, lname, username, ? as listaccess, ? as updated,? as error from USER_INFO where (mobile = ? or email like ? or fname like ? or lname like ? or username like ?) and username != ?';
      }else if(acctype==='MEDIA'){
        var sql2 ='SELECT fname, lname, username, ? as mediaaccess, ? as updated,? as error from USER_INFO where (mobile = ? or email like ? or fname like ? or lname like ? or username like ?) and username != ?';
      }var params1 =[uid, skey];
    var params2 =['false', 'false','false',strm,strm+'%',strm+'%',strm+'%',strm+'%',uid];
    db.all(sql1,params1, (err, results) => {
      if (err) {
        console.log("error1");
       return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':true}]);
      }else{
        if(results[0].res===1){
         db.all(sql2,params2, (err, results) => {
           if (err) {
             console.log("error2");
             console.log(err);
             return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':true}]);
           }else{
             return res.send(results);
           }  
           });
        }else{
         console.log("error3");
         console.log(results[0].res);
         return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':true}]);
        }
      }
    });
});

//-------------------------------------------------------
router.get("/checkacc", (req, res) => {
    var headr = req.headers;
    let uid = headr["uid"];
    let gname = headr["gname"];
    let acctype = headr["acct"];
    if(acctype==="LIST"){
      var sql1 ="SELECT status as listaccess, 'false' as error FROM USERACCESS_INFO WHERE g_username = ? and p_username = ? and accesstype='LIST'";
    }else if(acctype==="MEDIA"){
      var sql1 ="SELECT status as mediaaccess, 'false' as error FROM USERACCESS_INFO WHERE g_username = ? and p_username = ? and accesstype='MEDIA'";
    }var params1 =[gname, uid];
    db.all(sql1,params1, (err, results) => {
      if (err) {
        console.log("----------------------------------------------")
        console.log("checkacc");
        console.log(err);
        console.log("----------------------------------------------")
       return res.send([{'hasaccess':'null','error':'true'}]);
      }else{
        //console.log(results.length);
        if(results.length===0){
        return res.send([{'listaccess':'false','error':'false'}]);
        }else{
        return res.send(results);
        }
      }
    });
  });
  //-----------------------------------------------------------------------
  router.get("/accuserlist", (req, res) => {
    var headr = req.headers;
    let skey = headr["skey"];
    let uid = headr["uid"];
    var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
    var sql2 ="select USER_INFO.fname, USER_INFO.lname, USER_INFO.username, USERACCESS_INFO.accesstype from USERACCESS_INFO INNER JOIN USER_INFO ON USER_INFO.username = USERACCESS_INFO.p_username WHERE USERACCESS_INFO.g_username = ? and USERACCESS_INFO.status='C'";
    var params1 =[uid, skey];
    var params2 =[uid];
    db.all(sql1,params1, (err, results) => {
      if (err) {
        //console.log("error1");
       return res.send([{'fname':null,'lname': null,'email':null, 'error':true}]);
      }else{
        if(results[0].res===1){
         db.all(sql2,params2, (err, results) => {
           if (err) {
             //console.log("error2");
             return res.send([{'fname':null,'lname': null,'email':null, 'error':true}]);
           }else{
             //console.log(results);
             return res.send(results);
           }  
           });
        }else{
         //console.log("error3");
         //console.log(results[0].res);
         return res.send([{'fname':null,'lname': null,'email':null, 'error':true}]);
        }
      }
    });
  });
//-------------------------------------------------------------------------------------------------
router.post('/createaccreq', (req, res) => {
    var headr = req.headers;
    let skey = headr["skey"];
    let uid = req.body.uid;
    let gname = req.body.gname; 
    let acctype = req.body.acctype; 
    var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
    var params1 =[uid, skey];
    var sql2 ='SELECT count(p_username) as res FROM USERACCESS_INFO WHERE p_username = ? and g_username = ? and accesstype = ?';
    var params2 =[uid, gname,acctype];
    var sql3 ="INSERT INTO USERACCESS_INFO (p_username,g_username,accesstype) VALUES (?,?,?)";
    var params3 =[uid, gname,acctype];
    db.all(sql1, params1,(err, result, fields)=> {
      if (!err) {
        if(result[0].res===1){
          db.all(sql2, params2, function (err, result) {
            if(err){
              return res.send([{'error':'true','status': null}]);
            } else {
              if(result[0].res!=0){
                return res.send([{'error':'false','status': 'AE'}]);
              }else{
                db.run(sql3, params3, function (err, result) {
                  if(err){
                    return res.send([{'error':'false','status': 'TE'}]);
                  } else {
                    return res.send([{'error':'false','status': 'AC'}]);
                  }
                });
              }
            }
          });
        } else {
          return res.send([{'error':'true','status': null}]);
        }
      }else{
        //console.log(err);
        return res.send([{'error':'true','status': null}]);
      }
    });
  });
  //------------------------------------------------------------------------
  router.get("/getrequests", (req, res) => {
    var headr = req.headers;
    let skey = headr["skey"];
    let uid = headr["uid"];
    var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
    var sql2 ="select USER_INFO.fname, USER_INFO.lname, USER_INFO.username, USERACCESS_INFO.accesstype from USERACCESS_INFO INNER JOIN USER_INFO ON USER_INFO.username = USERACCESS_INFO.p_username where USERACCESS_INFO.g_username = ? and USERACCESS_INFO.status='P' ";
    var params1 =[uid, skey];
    var params2 =[uid];
    db.all(sql1,params1, (err, results) => {
      if (err) {
        //console.log("error1");
       return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':true}]);
      }else{
        if(results[0].res===1){
         db.all(sql2,params2, (err, results) => {
           if (err) {
            //console.log("error2");
             return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':true}]);
           }else{
             return res.send(results);
           }  
           });
        }else{
         //console.log("error3");
         //console.log(results[0].res);
         return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':true}]);
        }
      }
    });
  });
  
  //----------------------------------------------------------------------
  router.post("/accrejreq", (req, res) => {
    var headr = req.headers;
    let skey = headr["skey"];
    let gname = req.body.gname;
    let uid = req.body.uid;
    let upd = req.body.upd;
    let acctyp = req.body.acctyp;
    var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
    var sql2 ="UPDATE USERACCESS_INFO SET status = 'C' WHERE p_username = ? and g_username = ? and accesstype = ?";
    var sql3 ="DELETE FROM USERACCESS_INFO WHERE p_username = ? and g_username = ? and accesstype = ?";
    var params1 =[uid, skey];
    var params2 =[gname, uid, acctyp];
    db.all(sql1,params1, (err, results) => {
      if (err) {
        //console.log("error1");
       return res.send([{'error':'true','status': 'db issue'}]);
      }else{
        
        if(results[0].res===1){
          if(upd === "Add"){
            //console.log(params2);
            db.run(sql2,params2, (err, results) => {
              if (err) {
                return res.send([{'error':'true','status': 'db issue UPDATE error'}]);
              }else{
                return res.send([{'error':'false','status': 'success'}]);
              }
            });
          }else if(upd === "Rem"){
            db.run(sql3,params2, (err, results) => {
              if (err) {
                return res.send([{'error':'true','status': 'db issue DELETE error'}]);
              }else{
                return res.send([{'error':'false','status': 'success'}]);
              }
            });
          }
        }else{
         return res.send([{'error':'true','status': 'loginissue'}]);
        }
      }
    });
  });
  //-----------------------------------------------------------------

  router.post("/updmsgstatus", (req, res) => {
    var headr = req.headers;
    let skey = headr["skey"];
    let cngsts = req.body.cngsts;
    let uid = req.body.uid;
    let msgid = req.body.msgid;
    var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
    var sql2 ="UPDATE All_MESSAGES SET status = ? WHERE id = ?";
    var params1 =[uid, skey];
    var params2 =[cngsts, msgid];
    db.all(sql1,params1, (err, results) => {
      if (err) {
        //console.log("error1");
       return res.send([{'error':'true','status': 'db issue'}]);
      }else{
        if(results[0].res===1){
            db.run(sql2,params2, (err, results) => {
              if (err) {
                //console.log("error2");
                return res.send([{'error':'true','status': 'db issue INSERT error'}]);
              }else{
                return res.send([{'error':'false','status': 'success'}]);
              }
            });
        }else{
         return res.send([{'error':'true','status': 'loginissue'}]);
        }
      }
    });
  });
  //-----------------------------------------------------------------

router.get('/',(req,res)=>{
    res.send({status:'pass'});
});

module.exports = router;