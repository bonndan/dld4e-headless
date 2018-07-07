
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
global.fetch = require('node-fetch-polyfill')

//const canvasModule = require('canvas');
const yaml = require('js-yaml')
const D3Node = require('d3-node')
const draw = require('../src/dld4e/dld4e-draw.js')
const Inkscape = require('inkscape')
const str = require('string-to-stream')
//serving static assets as workaround
app.use('/images', express.static('images'))



//https://stackoverflow.com/questions/18710225/node-js-get-raw-request-body-using-express
app.use(bodyParser.text({ type: "*/*" }));

app.post('/', function (req, res) {

    console.log('Received request')

    const options = { selector: '#svg', container: '<div id="container"><div id="svg"></div></div>' }
    const d3n = new D3Node(options) // initializes D3 with container element

    //load incoming yaml
    var doc = yaml.load(req.body)

    Promise.all(draw.draw(doc, d3n)).then(
        function () {

            if (req.headers.accept === "image/svg+xml") {
                console.log("Creating svg output")
                res.setHeader('Content-Type', 'image/svg+xml')
                res.write(d3n.svgString())
                res.end()
            } else {
                console.log("Creating png output")
                res.setHeader('Content-Type', 'image/png')

                svgToPdfConverter = new Inkscape(['-e']);
                str(d3n.svgString()).pipe(svgToPdfConverter).pipe(res);
            }
        }
    )

});

app.listen(3030, function () {
    console.log('Dld4e app listening on port 3030!')
});