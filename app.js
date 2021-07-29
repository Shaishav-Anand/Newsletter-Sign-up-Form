const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }
   ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us20.api.mailchimp.com/3.0/lists/951ab32f95";
  const options = {
    method : "POST",
    auth : " adil :7ab76258314e16c3ccc3dc36495d487a-us20"
  }
  const rqst = https.request(url, options, function(response) {

    response.on("jsonData", function(jsonData) {
      console.log(JSON.parse(jsonData));
    })
    if(response.statusCode === 200){
      res.sendFile(__dirname+"/success.html");

    }else if(data.error_count===1){
        res.sendFile(__dirname+"/failure.html");
    }
    else{
        res.sendFile(__dirname+"/failure.html");
    }
  })
  rqst.write(jsonData);
  rqst.end();
});

app.post("/failure.html",function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is Up");
});
