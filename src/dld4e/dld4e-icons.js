
/**
 * Returns an array of promises
 * @param {*} svg 
 * @param {*} diagram 
 * @param {*} icons 
 * @param {*} iconTextRatio 
 */
var drawIcons = function (svg, diagram, icons, iconTextRatio) {

  const _process = require('./dld4e-process');

  var deviceCellsAll = svg.selectAll("cells")
    .data(d3.entries(icons))
    .enter()

  var cells = deviceCellsAll.append("g")
    .attr("id", function (d) { return d.key })
    .attr("transform", function (d) { return "translate(" + diagram.xBand(d.value.x) + "," + diagram.yBand(d.value.y) + ")" })
    .each(function (d) {
      if (d.value.metadata) {
        var text = d3.select(this)
        text.style("cursor", "pointer")
      }
    })

  var cellFill = cells
    .append("rect")
    .attr("rx", function (d) { return d.value.rx })
    .attr("ry", function (d) { return d.value.ry })
    .attr("width", function (d) { return d.value.width })
    .attr("height", function (d) { return d.value.height })
    .attr("fill", function (d) { return d.value.fill || "orange" })
    .style("stroke", function (d) { return d.value.stroke || "orange" })
    .style("stroke-dasharray", function (d) { return d.value.strokeDashArray || [0, 0] })


  var cellText = cells
    .append("text")
    .attr('class', 'iconLabel')
    .text(function (d) { return d.value.text || d.key })
    .each(function (d) {
      var textLength = 5; //d3.select(this).getComputedTextLength() TODO
      d.value.fontSize = Math.floor(Math.min(d.value.width * .9 / textLength * 12, d.value.height / 2 * iconTextRatio))
      d.value.textPosition = _process.textPositions(0, 0, d.value.width, d.value.height, d.value.fontSize + 2)[d.value.textLocation]
      if (d.value.url) {
        var text = d3.select(this)
        text.on("click", function () { window.open(d.value.url); })
        text.style("cursor", "pointer")
        text.style("text-decoration", "underline")
      }
    })
    .style("font-size", function (d) { return d.value.fontSize + "px"; })
    .attr("id", function (d) { return d.key + '-text' })
    .attr("transform", function (d) { return "translate(" + d.value.textPosition.x + "," + d.value.textPosition.y + ")rotate(" + d.value.textPosition.rotate + ")" })
    .attr('fill', function (d) { return d.value.color || "orange" })
    .attr("text-anchor", function (d) { return d.value.textPosition.textAnchor })
    .attr("dominant-baseline", "central")

  /**
   * Returns a promise
   * @param {cell} d 
   */
  var handleCell = function (d) {
    var cell = d3n.document.querySelector("#" + d.key)
    var cellText = d3n.document.querySelector("#" + d.key + "-text")
    var fontSize = Math.ceil(parseFloat(cellText.style.fontSize))

    // center
    var x = (d.value.width * d.value.iconPaddingX)
    var y = (d.value.height * d.value.iconPaddingY)
    var width = d.value.width * (1 - 2 * d.value.iconPaddingX)
    var height = (d.value.height) * (1 - 2 * d.value.iconPaddingY)
    switch (true) {
      case d.value.textLocation.startsWith('top'):
        y += fontSize
        height = (d.value.height - fontSize) * (1 - 2 * d.value.iconPaddingY)
        break;
      case d.value.textLocation.startsWith('left'):
        x += fontSize
        width = (d.value.width - fontSize) * (1 - 2 * d.value.iconPaddingX)
        break;
      case d.value.textLocation.startsWith('right'):
        width = (d.value.width - fontSize) * (1 - 2 * d.value.iconPaddingX)
        break;
      case d.value.textLocation.startsWith('bottom'):
        height = (d.value.height - fontSize) * (1 - 2 * d.value.iconPaddingY)
        break;
    }

    var url = "http://127.0.0.1:3030/images/" + d.value.iconFamily + "/" + d.value.icon + ".svg"
    var local = __dirname + "/../../images/" + d.value.iconFamily + "/" + d.value.icon + ".svg"

    const jsdom9 = require("d3-node/node_modules/jsdom")

    //https://stackoverflow.com/questions/42649700/using-domparser-in-javascript-testing-with-mocha-and-jsdom
    require('jsdom-global')()
    global.DOMParser = window.DOMParser

    var updateCell = function (xml) {
      
      var svg = xml.getElementsByTagName("svg")[0]
      svg.setAttribute("x", x)
      svg.setAttribute("y", y)
      svg.setAttribute("width", width)
      svg.setAttribute("height", height)
      var paths = xml.getElementsByTagName("path")
      for (i = 0; i < paths.length; i++) {
        if ((d.value.preserveWhite) && (paths[i].getAttribute("fill") == '#fff')) {
          //paths[i].setAttribute("fill", d.value.replaceWhite)
        } else if ((d.value.iconFill) && (paths[i].getAttribute("fill") != 'none')) {
          paths[i].setAttribute("fill", d.value.iconFill)
        }
        if ((d.value.iconStroke) && (paths[i].getAttribute("stroke") != 'none')) {
          paths[i].setAttribute("stroke", d.value.iconStroke)
        }
        if ((d.value.iconStrokeWidth) && (paths[i].getAttribute("stroke-width"))) {
          paths[i].setAttribute("stroke-width", d.value.iconStrokeWidth)
        }
      }

      const frag = new jsdom9.jsdom(xml.documentElement.outerHTML) // fix for imported is not a NodeImpl
      const newSvg = frag.getElementsByTagName("svg")[0]
      cell.insertBefore(newSvg, cellText)
    }

    //then(
    function readIcon(url) {
      console.log("Reading icon " + url)
      
    }

    return d3.svg(url).then(updateCell)
  }

  let cellArray = []
  cells.each(function (d) {cellArray.push(d)})
  
  return cellArray.map(handleCell)

}

module.exports.drawIcons = drawIcons;