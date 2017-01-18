import 'bulma/css/bulma.css!'
import * as d3 from 'd3'
import * as topojson from 'topojson'

let w = 100
let h = 100

let svg = d3.select("#map")
    .attr("width", "100%")
    .attr("height", "100%")
let projection = d3.geoAzimuthalEqualArea()
let geoPath = d3.geoPath(projection)
let gratGen = d3.geoGraticule()

let outline = svg.append("g").attr("class", "outline")
let graticules = svg.append("g").attr("class", "graticule")
let countries = svg.append("g").attr("class", "countries")

//var path = d3.geoPath()
//    .projection(projection);
//let defs = svg.append("defs");
//defs.append("path")
//    .datum({
//        type: "Sphere"
//    })
//    .attr("id", "sphere")
//    .attr("d", path);
//defs.append("clipPath")
//    .attr("id", "clip")
//    .append("use")
//    .attr("xlink:href", "#sphere");
//

let countryData = undefined

d3.json('data/countries.geo.json', (e, data) => {
    countryData = data.features
    outline.append("path")
        .datum(gratGen.outline())
        .attr("d", geoPath)

    graticules.selectAll("path")
        .data(gratGen.lines())
        .enter()
        .append("path")
        .attr("d", geoPath)
        .attr("clip-path", "url(#clip)")

    countries.selectAll("path")
        .data(countryData)
        .enter()
        .append("path")
        .attr("d", geoPath)
        .attr("fill", () => "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")")
})

document.getElementById('projection-select').addEventListener('change', (e) => {
    let select = e.target
    let projValue = select[select.selectedIndex].value
    let projection = d3[projValue]()
    let geoPath = d3.geoPath(projection)
    
    redraw(geoPath)
})

function redraw(geoPath) {
    countries.selectAll("path")
        .transition()
        .attr("d", geoPath)
//        .attr("fill", () => "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")")
    
    graticules.selectAll("path")
        .transition()
        .attr("d", geoPath)
    
    outline.selectAll("path")
        .transition()
        .attr("d", geoPath)
}