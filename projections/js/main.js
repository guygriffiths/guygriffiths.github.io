import 'skeleton/css/skeleton.css!'
import * as d3 from 'd3'
import * as d3cols from 'd3-scale-chromatic'
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

let scales = [
    d3cols.interpolateBrBG,
    d3cols.interpolatePRGn,
    d3cols.interpolatePiYG,
    d3cols.interpolatePuOr,
    d3cols.interpolateRdBu,
    d3cols.interpolateRdGy,
    d3cols.interpolateRdYlBu,
    d3cols.interpolateRdYlGn,
    d3cols.interpolateSpectral,
    d3cols.interpolateBlues,
    d3cols.interpolateGreens,
    d3cols.interpolateOranges,
    d3cols.interpolatePurples,
    d3cols.interpolateReds,
    d3cols.interpolateBuGn,
    d3cols.interpolateBuPu,
    d3cols.interpolateGnBu,
    d3cols.interpolateOrRd,
    d3cols.interpolatePuBuGn,
    d3cols.interpolatePuBu,
    d3cols.interpolatePuRd,
    d3cols.interpolateRdPu,
    d3cols.interpolateYlGnBu,
    d3cols.interpolateYlGn,
    d3cols.interpolateYlOrBr,
    d3cols.interpolateYlOrRd
]

function flatten(arr) {
    return arr.reduce((flat, toFlatten) =>
        flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten), [])
}

d3.json('data/countries.geo.json', (e, data) => {
    let countryData = data.features.sort((a, b) => {
        return flatten(b.geometry.coordinates)[1] - flatten(a.geometry.coordinates)[1]
    })
    outline.append("path")
        .datum(gratGen.outline())
        .attr("d", geoPath)

    graticules.selectAll("path")
        .data(gratGen.lines())
        .enter()
        .append("path")
        .attr("d", geoPath)
        .attr("clip-path", "url(#clip)")
    
    let scale = Math.floor(Math.random() * scales.length)
    countries.selectAll("path")
        .data(countryData)
        .enter()
        .append("path")
        .attr("d", geoPath)
        .attr("fill", (d, i) => scales[scale](i / data.features.length))

    document.getElementById('projection-select').addEventListener('change', (e) => {
        let select = e.target
        let projValue = select[select.selectedIndex].value
        let projection = d3[projValue]()
        let geoPath = d3.geoPath(projection)

        redraw(geoPath)
    })

    function redraw(geoPath) {
        let t = d3.transition()
            .duration(1000)

        let scale = Math.floor(Math.random() * scales.length)
        countries.selectAll("path")
            .transition(t)
            .delay((d, i) => 1000 + 5 * i)
            .attr("d", geoPath)
            .style("fill", (d, i) => scales[scale](i / data.features.length))

        graticules.selectAll("path")
            .transition(t)
            .attr("d", geoPath)

        outline.selectAll("path")
            .transition(t)
            .attr("d", geoPath)
    }
})