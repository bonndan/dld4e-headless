

function draw(doc, d3n) {

  var d3 = d3n.d3;
  global.d3n = d3n;
  global.d3 = d3;

  const _process = require('./dld4e-process');
  const _conns = require('./dld4e-connections');
  const _groups = require('./dld4e-groups');
  const _title = require('./dld4e-title');
  const _gridlines = require('./dld4e-gridlines');
  const _icons = require('./dld4e-icons');
  const _notes = require('./dld4e-notes');




  // set the drawing defaults
  var drawingDefaults = {
    fill: "orange",
    aspectRatio: "1:1",
    rows: 10,
    columns: 10,
    groupPadding: .33,
    gridLines: true,
    gridPaddingInner: .4, // the space between icons (%)
    iconTextRatio: .33,
    margins: { top: 20, right: 20, bottom: 50, left: 20 }
  }
  // set the title defaults
  var titleDefaults = {
    text: "Decent looking diagrams for engineers",
    subText: "More information can be found at http://github.com/cidrblock/dld4e",
    author: "Bradley A. Thornton",
    company: "Self",
    date: new Date().toLocaleDateString(),
    version: 1.01,
    color: "black",
    stroke: "orange",
    fill: "orange",
    heightPercentage: 6, // percent of total height
    logoUrl: "images/radial.png",
    logoFill: "orange"
  }
  // incase there are none
  var connections = doc.connections || [];
  var groups = doc.groups || [];
  var notes = doc.notes || [];
  var icons = doc.icons || [];

  // merge the doc properties into the defaults
  var diagram = Object.assign(drawingDefaults, doc.diagram || {})
  var title = Object.assign(titleDefaults, doc.title || {})

  // set the background color of the whole page
  //document.body.style.background = diagram.fill

  // find a good fit for the diagram
  var parentBox = { bottom: 0, height: 1024, left: 0, right: 0, top: 0, width: 1024 } //d3.select(d3n.document.querySelector("#svg")).node().getBoundingClientRect()
  var ratios = diagram.aspectRatio.split(':')

  // set the desired h/w
  var availbleHeight = parentBox.height - diagram.margins.top - diagram.margins.bottom
  var availbleWidth = parentBox.width - diagram.margins.left - diagram.margins.right

  if (availbleHeight < availbleWidth) {
    svgHeight = availbleHeight
    svgWidth = svgHeight / ratios[1] * ratios[0]
  } else if (availbleWidth < availbleHeight) {
    svgWidth = availbleWidth
    svgHeight = svgWidth / ratios[0] * ratios[1]
  } else {
    svgWidth = availbleWidth
    svgHeight = availbleHeight
  }
  // downsize if outside the bounds
  if (svgHeight > availbleHeight) {
    svgHeight = availbleHeight
    svgWidth = svgHeight / ratios[1] * ratios[0]
  }
  if (svgWidth > availbleWidth) {
    svgWidth = availbleWidth
    svgHeight = svgWidth / ratios[0] * ratios[1]
  }

  // using the svg dimentions, set the title and digrams
  title.height = svgHeight * title.heightPercentage / 100
  diagram.height = svgHeight - title.height
  diagram.width = diagram.height / ratios[1] * ratios[0]
  diagram.x = (svgWidth - diagram.width) / 2
  diagram.y = (svgHeight - title.height - diagram.height)

  // create our bands
  diagram.xBand = d3.scaleBand()
    .domain(Array.from(Array(diagram.columns).keys()))
    .rangeRound([diagram.x, diagram.width + diagram.x])
    .paddingInner(diagram.gridPaddingInner);

  diagram.yBand = d3.scaleBand()
    .domain(Array.from(Array(diagram.rows).keys()).reverse())
    .rangeRound([diagram.y, diagram.height + diagram.y])
    .paddingInner(diagram.gridPaddingInner);

  // remove the old diagram
  d3.select(d3n.document.querySelector("svg")).remove();


  // and add the svg
  var svg = d3.select(d3n.document.querySelector("#svg")).append("svg")
    .attr("width", parentBox.width)
    .attr("height", parentBox.height)
    .style("background-color", diagram.fill)
    .call(d3.zoom().on("zoom", function () {
      svg.attr("transform", d3.event.transform)
    }))
    .append("g")
    .attr("transform", "translate(" + (parentBox.width - svgWidth) / 2 + "," + (parentBox.height - svgHeight) / 2 + ")");

  // set x1,y1,x2,y2,width,height,centerX and centerY for all the stuff
  notes = _process.processEntities(svg, diagram, notes)
  icons = _process.processEntities(svg, diagram, icons)
  connections = _process.processConnections(connections, groups, icons)
  groups = _process.processGroups(groups, diagram, icons)

  // draw all the things
  _title.drawTitle(svg, diagram, title)
  _gridlines.drawGridLines(svg, diagram)
  _groups.drawGroups(svg, diagram, groups, icons)
  _conns.drawConnections(svg, diagram, connections, icons, notes)
  let promises = _icons.drawIcons(svg, diagram, icons, diagram.iconTextRatio)

  _notes.drawNotes(svg, diagram, notes)

  console.log("Finished drawing " + title.text)

  // move all the labels to the front
  svg.selectAll('.connectionLabel')
    .each(function (d) { d3.select(this).moveToFront(); })
  svg.selectAll('.groupLabel')
    .each(function (d) { d3.select(this).moveToFront(); })
  svg.selectAll('.iconLabel')
    .each(function (d) { d3.select(this).moveToFront(); })

  return promises
};

module.exports.draw = draw;