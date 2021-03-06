import * as d3 from 'd3'

let width = 1000
let height = 1000

let w = width
let h = height

let color = d3.scaleOrdinal(d3.schemeCategory20);

let svg = d3.select("body")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("pointer-events", "all")
    .call(d3.zoom().on("zoom", redraw));

let vis = svg
    .append('svg:g');

function redraw() {
    vis.attr("transform",
        "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
}

let graph = d3.forceSimulation()
    .force("link", d3.forceLink()
        .id(d => d.id)
        .distance(d => d.value / 50))
    .force("centre", d3.forceCenter(w / 2, h / 2))
    .force("size", d3.forceCollide()
        .radius(5)
        .strength(1))
    .alphaDecay(0.001)

d3.json('data/capital_distances.json', (e, data) => {
    if (e) throw e

    //    let link = svg.append("g")
    //        .attr("class", "links")
    //        .selectAll("line")
    //        .data(data.links)
    //        .enter()
    //        .append("line")
    //        .attr("stroke-width", d => 5.0 * d.value / 14000)

    let countryList = new Set()
    for (let item of data.links) {
        countryList.add(item.source)
        countryList.add(item.target)
    }
    let nodeData = []
    for (let item of countryList) {
        nodeData.push({
            "id": item
        })
    }

    let node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodeData)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", () => Math.random() * w)
        .attr("cy", () => Math.random() * h)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))

    node.append("title").html(d => d.id)

    graph.nodes(nodeData)
        .on("tick", () => {
            //            link.attr("x1", d => d.source.x)
            //                .attr("y1", d => d.source.y)
            //                .attr("x2", d => d.target.x)
            //                .attr("y2", d => d.target.y)
            node.attr("cx", d => d.x)
                .attr("cy", d => d.y)
        })

    graph.force("link")
        .links(data.links)

    resize(graph);
    d3.select(window).on("resize", resize);

    function resize() {
        width = window.innerWidth, height = window.innerHeight;
        svg.attr("width", width).attr("height", height);
//        graph.resize([width, height]).resume();
    }
})

function dragstarted(d) {
    console.log(d.id)
    if (!d3.event.active) graph.alpha(0.3).restart()
    d.fx = d.x
    d.fy = d.y
}

function dragged(d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
}

function dragended(d) {
    if (!d3.event.active) graph.alphaTarget(0)
    d.fx = null
    d.fy = null
}