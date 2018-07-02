
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
global.fetch = require('node-fetch-polyfill');

//const canvasModule = require('canvas');
const yaml = require('js-yaml');
const D3Node = require('d3-node')
const draw = require('../src/dld4e/dld4e-draw.js');

//serving static assets as workaround
app.use('/images', express.static('images'));



//https://stackoverflow.com/questions/18710225/node-js-get-raw-request-body-using-express
app.use(bodyParser.text({ type: "*/*" }));

app.post('/', function (req, res) {

    console.log('Received request')

    const options = { selector: '#svg', container: '<div id="container"><div id="svg"></div></div>' }
    const d3n = new D3Node(options) // initializes D3 with container element
    const d3 = d3n.d3

    //const canvas = d3n.createCanvas(960, 500);
    //const context = canvas.getContext('2d');


    //load incoming yaml
    var doc = yaml.load(req.body)

    // draw on your canvas
    Promise.all(draw.draw(doc, d3n)).then(
        function () {
            //console.log(d3n.svgString())
            //res.send(d3n.svgString())

            //http://eng.wealthfront.com/2011/12/22/converting-dynamic-svg-to-png-with-node-js-d3-and-imagemagick/
            res.setHeader('Content-Type', 'image/png')
            var convert = require('child_process').spawn("convert", ["svg:", "png:-"])
            convert.stdout.on('data', function (data) {
                res.write(data)
            })

            convert.on('exit', function (code) {
                res.end()
            })

            convert.stdin.write(d3n.svgString())
            convert.stdin.end()
        })



    // output canvas to png
    // https://github.com/d3-node/d3-node
    //res.setHeader("content-type", "image/png");
    //canvas.pngStream().pipe(res);
});

app.listen(3030, function () {
    console.log('Dld4e app listening on port 3030!')
});