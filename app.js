let express = require('express');
let app = express();
let port = process.env.port || 3000;
let path = require('path')
let fs = require('fs');

let bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
const router = express.Router();



router.get('/', function(req,res){
    res.sendFile(path.join(__dirname + '/public/html/index.html'))
})
app.get('/get', function(req, res) {
    fs.readFile("artist.txt", "utf-8", function(err, buf) {
        if(err){
            console.log(err)
        }
        res.json(buf)
    })
})
app.post('/add', function(req, res){
    fs.writeFile('artist.txt', JSON.stringify(req.body), (err) => {
        if(err) {
            console.log(err)
        }
        console.log("written to file");
        res.end()
    })
})
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public/js'));
app.use('/', router)
app.listen(port, () => console.log('Server ready'))