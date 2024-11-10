const express =require('express');
const router = express.Router();
const db = require("./db.js");

router.post('/registeruser', (req, res) => {
  console.log("post triggered");
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
  db.query(sql1, params1, function (err, result) {
    if (err) {
			return res.send(err);
    } else {
			db.query(sql2, params2, function (err, result) {
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
    console.log(uid);
    var sql1 ='SELECT * FROM USER_LOGIN_INFO WHERE USERNAME like ? AND PASSWORD = ?';
    var sql2 ='UPDATE USER_LOGIN_INFO SET sessionkey = ? WHERE USERNAME like ?';
    var params1 =[username, password];
    db.query(sql1, params1,(err, result, fields)=> {
      if (!err) {
        var rstring=JSON.stringify(result);
        var rjson =  JSON.parse(rstring);
        if(rjson.length>0){
          //console.log(rjson.length);
          var usrnme = rjson[0].username;
          var params2 =[uid, usrnme];
          db.query(sql2, params2, function (err, result) {
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
    headr=req.headers;
    let skey = headr['skey'];
    let uid = headr['uid'];
    var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
    var sql2 ='SELECT fname, lname, mobile, email FROM USER_INFO WHERE username like ?';
    var params1 =[uid, skey];
    var params2 =[uid];
    db.query(sql1,params1, (err, results, fields) => {
       if (err) {
        // console.log("error1");
        return res.send([{'fname':null,'lname': null,'mobile':null,'email':null,'error':true}]);
       }else{
         if(results[0].res===1){
          db.query(sql2,params2, (err, results, fields) => {
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
    headr = req.headers;
    let skey = headr["skey"];
    let uid = headr["uid"];
    let gname = headr["gname"];
    //console.log("skey : "+skey +", uid :"+uid+", gname:"+gname);
    if(uid==gname){
      var sql3 ="SELECT id as msgid, short_msg as smsg, long_msg as lmsg, status as mmsgsts, sender as msgby, 'true' as ownlst, DATE_FORMAT(added_dt, '%d-%m') as adddte, secret FROM All_MESSAGES WHERE receiver = ? ORDER BY status DESC, id DESC";
      var params3 =[uid];
      var sql2 = "SELECT ? as res";
      var params2 =[1];
    }else if(uid!=gname){
      var sql3 ="SELECT id as msdid, short_msg as smsg, long_msg as lmsg, status as mmsgsts, sender as msgby, 'false' as ownlst, DATE_FORMAT(added_dt, '%d-%m') as adddte, secret FROM All_MESSAGES WHERE (receiver = ? AND secret = 'false') OR (sender=? AND receiver = ?) ORDER BY status DESC, id DESC";
      var params3 =[gname,uid,gname];
      var sql2 = "SELECT count(p_username) as res FROM USERACCESS_INFO WHERE p_username = ? and g_username = ?";
      var params2 =[uid,gname];
    }
    var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
    var params1 =[uid, skey];
    db.query(sql1,params1, (err, results) => {
      if (err) {
        //console.log("error1");
       return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':true}]);
      }else{
        if(results[0].res===1){
         db.query(sql2,params2, (err, results) => {
           if (err) {
             //console.log("error2");
             return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':true}]);
           }else{if(results[0].res===1){
            db.query(sql3,params3, (err, results) => {
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
        }else{
         //console.log("error3");
         //console.log(results[0].res);
         return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':true}]);
        }
      }
    });
  });
  
  //-------------------------------------------------------------------------
  router.post("/postmessage", (req, res) => {
    headr = req.headers;
    let skey = headr["skey"];
    let smsg = req.body.smsg;
    let lmsg = req.body.lmsg;
    let receiver = req.body.receiver;
    let sender = req.body.sender;
    let secret = req.body.secret;
    var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
    var sql2 ="INSERT INTO All_MESSAGES (short_msg,long_msg,secret,receiver,sender,added_dt) VALUES (?,?,?,?,?,NOW())";
    var params1 =[sender, skey];
    var params2 =[smsg, lmsg,secret,receiver,sender];
    db.query(sql1,params1, (err, results) => {
      if (err) {
        //console.log("error1");
       return res.send([{'error':'true','status': 'db issue'}]);
      }else{
        if(results[0].res===1){
            db.query(sql2,params2, (err, results) => {
              if (err) {
                return res.send([{'error':'true','status': 'db issue INSERT error','err':err}]);
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
    headr=req.headers;
    let skey = headr['skey'];
    let uid = headr['uid'];
    var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
    var sql2 ="SELECT fname, lname, username, ? as hasaccess,? as updated, ? as error from USER_INFO where username in (SELECT g_username  from USERACCESS_INFO WHERE p_username = ? and status='C')";
    var params1 =[uid, skey];
    var params2 =['true','true','false',uid];
    db.query(sql1,params1, (err, results, fields) => {
       if (err) {
         //console.log("error1");
        return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':err}]);
       }else{
         if(results[0].res===1){
          db.query(sql2,params2, (err, results, fields) => {
            if (err) {
              //console.log("error2");
              return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':err}]);
            }else{
              return res.send(results);
            }  
            });
         }else{
          //console.log("error3");
          //console.log(results[0].res);
          return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':err}]);
         }
       }
     });
    });
  //------------------------------------------------------------------------------------------------------
  router.get("/searchusers", (req, res) => {
    headr = req.headers;
    let skey = headr["skey"];
    let uid = headr["uid"];
    let strm = headr["sterm"];
    var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
    var sql2 ='SELECT fname, lname, username, ? as hasaccess, ? as updated,? as error from USER_INFO where (mobile = ? or email like ? or fname like ? or lname like ? or username like ?) and username != ?';
    var params1 =[uid, skey];
    var params2 =['false','false','false',strm,strm+'%',strm+'%',strm+'%',strm+'%',uid];
    db.query(sql1,params1, (err, results) => {
      if (err) {
        //console.log("error1");
       return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':true}]);
      }else{
        if(results[0].res===1){
         db.query(sql2,params2, (err, results) => {
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

//-------------------------------------------------------
router.get("/checkacc", (req, res) => {
  headr = req.headers;
  let uid = headr["uid"];
  let gname = headr["gname"];
  var sql1 ="SELECT count(id) as res FROM USERACCESS_INFO WHERE p_username = ? and g_username = ? and status='C'";
  var params1 =[uid, gname];
  db.query(sql1,params1, (err, results) => {
    if (err) {
      //console.log("error1");
     return res.send([{'hasaccess':'null','error':'true'}]);
    }else{
      if(results[0].res===1){
        return res.send([{'hasaccess':'true','error':'false'}]);
      }else{
        return res.send([{'hasaccess':'false','error':'false'}]);
      }
    }
  });
});
  //-----------------------------------------------------------------------
  router.get("/accuserlist", (req, res) => {
    headr = req.headers;
    let skey = headr["skey"];
    let uid = headr["uid"];
    var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
    var sql2 ="SELECT fname, lname, username, email, 'fasle' as error FROM USER_INFO WHERE username in (SELECT p_username FROM USERACCESS_INFO WHERE g_username = ? AND status = 'C') ORDER by fname, id";
    var params1 =[uid, skey];
    var params2 =[uid];
    db.query(sql1,params1, (err, results) => {
      if (err) {
        //console.log("error1");
       return res.send([{'fname':null,'lname': null,'email':null, 'error':true}]);
      }else{
        if(results[0].res===1){
         db.query(sql2,params2, (err, results) => {
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
  headr = req.headers;
  let skey = headr["skey"];
  let uid = req.body.uid;
  let gname = req.body.gname; 
  var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
  var params1 =[uid, skey];
  var sql2 ='SELECT count(p_username) as res FROM USERACCESS_INFO WHERE p_username = ? and g_username = ?';
  var params2 =[uid, gname];
  var sql3 ='INSERT INTO USERACCESS_INFO (p_username,g_username) VALUES (?,?)';
  var params3 =[uid, gname];
  db.query(sql1, params1,(err, result, fields)=> {
    if (!err) {
      if(result[0].res===1){
        db.query(sql2, params2, function (err, result) {
          if(err){
            return res.send([{'error':'true','status': null}]);
          } else {
            if(result[0].res!=0){
              return res.send([{'error':'false','status': 'AE'}]);
            }else{
              db.query(sql3, params3, function (err, result) {
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
    headr = req.headers;
    let skey = headr["skey"];
    let uid = headr["uid"];
    var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
    var sql2 ="SELECT fname, lname, username, 'false' as error FROM USER_INFO WHERE username in (SELECT p_username FROM USERACCESS_INFO WHERE g_username = ? AND status = 'P')";
    var params1 =[uid, skey];
    var params2 =[uid];
    db.query(sql1,params1, (err, results) => {
      if (err) {
        //console.log("error1");
       return res.send([{'fname':null,'lname': null,'hasaccess':null,'updated':null,'username':null,'error':true}]);
      }else{
        if(results[0].res===1){
         db.query(sql2,params2, (err, results) => {
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
    headr = req.headers;
    let skey = headr["skey"];
    let gname = req.body.gname;
    let uid = req.body.uid;
    let upd = req.body.upd;
    var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
    var sql2 ="UPDATE USERACCESS_INFO SET status = 'C' WHERE p_username = ? and g_username = ?";
    var sql3 ="DELETE FROM USERACCESS_INFO WHERE p_username = ? and g_username = ?";
    var params1 =[uid, skey];
    var params2 =[gname, uid];
    db.query(sql1,params1, (err, results) => {
      if (err) {
        //console.log("error1");
       return res.send([{'error':'true','status': 'db issue'}]);
      }else{
        
        if(results[0].res===1){
          if(upd === "Add"){
            //console.log(params2);
            db.query(sql2,params2, (err, results) => {
              if (err) {
                return res.send([{'error':'true','status': 'db issue UPDATE error'}]);
              }else{
                return res.send([{'error':'false','status': 'success'}]);
              }
            });
          }else if(upd === "Rem"){
            db.query(sql3,params2, (err, results) => {
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
    headr = req.headers;
    let skey = headr["skey"];
    let cngsts = req.body.cngsts;
    let uid = req.body.uid;
    let msgid = req.body.msgid;
    var sql1 ='SELECT count(username) AS res from USER_LOGIN_INFO WHERE username like ? and sessionkey =?';
    var sql2 ="UPDATE All_MESSAGES SET status = ? WHERE id = ?";
    var params1 =[uid, skey];
    var params2 =[cngsts, msgid];
    db.query(sql1,params1, (err, results) => {
      if (err) {
        //console.log("error1");
       return res.send([{'error':'true','status': 'db issue'}]);
      }else{
        if(results[0].res===1){
            db.query(sql2,params2, (err, results) => {
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
       
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
        return res.send({'status':'pass'});
});

module.exports = router;