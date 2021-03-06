var express = require('express');
var path = require('path');
var mongo = require('mongodb');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var express = require('express');
var router = express.Router()
var key = "whitehouse"
var app = express();

router.post('/sign_up', (req, res) => {

    console.log("register called")
        //enter the name of the database in the end 
    var new_db = "mongodb://localhost:27017/info";

    /*app.get('/', function(req, res) {
        res.set({
		 'Access-Control-Allow-Origin' : '*'
	 });
        return res.redirect('/public/index.html');
    }).listen(3000);*/

    //console.log("Server listening at : 3000");

    /* app.use('/public', express.static(__dirname + '/public'));
     app.use(bodyParser.json());
     app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
         extended: true
     }));*/



    //hashing

    var getHash = (pass, key) => {
        // console.log("register")

        var hmac = crypto.createHmac('sha512', key);

        //passing the data to be hashed
        data = hmac.update(pass);
        //Creating the hmac in the required format
        gen_hmac = data.digest('hex');
        //Printing the output on the console
        console.log("hmac : " + gen_hmac);
        return gen_hmac;
    }

    //signup
    // Sign-up function starts here. . .

    var name = req.body.name;
    var email = req.body.email;
    var pass = req.body.password;
    var phone = req.body.phone;
    var password = getHash(pass, key);


    var data = {
        "name": name,
        "email": email,
        "password": password,
        "phone": phone
    }

    mongo.connect(new_db, function(error, db) {
        if (error) {
            throw error;
        }
        console.log("connected to database successfully");
        //CREATING A COLLECTION IN MONGODB USING NODE.JS
        var query = { email: req.body.email }
        db.collection("details").findOne(query, function(err, result) {
            if (result) {
                return res.redirect('./public/signup.html');
            } else {
                db.collection("details").insertOne(data, (err, collection) => {
                    if (err) throw err;
                    console.log("Record inserted successfully");
                    console.log(collection.ops);
                });
                return res.redirect('./public/success.html');
            }

        });
    })

    // console.log("DATA is " + JSON.stringify(data));
    /* res.set({
         'Access-Control-Allow-Origin': '*'
     });*/


});



module.exports = router