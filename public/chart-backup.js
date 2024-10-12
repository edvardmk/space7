const starPoints = '100,10 40,198 190,78 10,78 160,198'
const starPointsRound =
    'M8,0,10.938926261462367,3.9549150281252627,15.60845213036123,5.52786404500042,12.755282581475768,9.545084971874736,12.702282018339787,' +
    '14.47213595499958,8,13,3.297717981660216,14.47213595499958,3.2447174185242327,9.545084971874738,0.39154786963877086,5.527864045000422,' +
    '5.061073738537633,3.9549150281252636Z' // inner radius 5, outer radius 8
const colorGroup = {
    '1': '#FFDF00',
    '2': '#2196f3',
    '3': '#00bcd4'
}

const yellow = '#FFDF00'
const width = document.getElementsByTagName('body')[0].clientWidth //1200
const height = document.getElementsByTagName('body')[0].clientHeight //900
console.log(width)
console.log(height)

let t0 = { x: 0, y: 0, k: 1 }
let simulation
let focusNode
let lastNode
let originalData
let data
let diveLevel = 10
let allData

const svg = d3.select('svg').attr('viewBox', [0, 0, width, height])
getData().then((jsonData) => {
    data = jsonData
    console.log(jsonData)

    originalData = JSON.parse(JSON.stringify(jsonData))
    const c = chart(svg, jsonData)
})

function logBase(x, y) {
    return Math.log(x) / Math.log(y)
}
function log21(x) {
    return Math.log(x) / Math.log(21)
}

function chart(svg, data) {
    let uData = data

    svg.on('click', clicked)
        .on('mouseover', hovering)
        .on('mouseout', hoverEnd)
        .on('mousemove', movingMouse)

    const svgG = svg.append('g').classed('canv', true)
    const linkG = svgG
        .append('g')
        .classed('links', true)
        .attr('stroke', '#555')
        .attr('stroke-width', 1)
    // .attr('stroke', '#999')
    // .attr('stroke-width', 1.5)

    let contribution = linkG.selectAll('.contribution')
    const nodeG = svgG.append('g').classed('nodes', true)
    let user = nodeG.selectAll('.user')
    let userLink = nodeG.selectAll('.user-link')
    let userImage = nodeG.selectAll('.user-image')
    let userLabel = nodeG.selectAll('.user-label')
    let project = nodeG.selectAll('.project')
    let projectIcon = nodeG.selectAll('.project-icon')
    let projectLabel = nodeG.selectAll('.project-label')
    // let tooltips = circles.selectAll('title')

    simulation = d3
        .forceSimulation(data.nodes)
        .force(
            'link',
            d3.forceLink(data.links).id((d) => d.id)
        )
        .force('charge', d3.forceManyBody().strength(-100))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('x', d3.forceX(width / 2).strength(0.05))
        .force('y', d3.forceY(height / 2).strength(0.05))
        // .alphaTarget(0.1)
        .on('tick', ticked)

    update(data)

    function update(data) {
        contribution = contribution
            .data(data.links, (d) => d.id)
            .join(
                (enter) => enter.append('line').classed('contribution', true),
                // .attr('stroke-opacity', 1)
                (update) => update,
                (exit) =>
                    exit
                        .transition()
                        .attr('stroke-opacity', 0)
                        .attrTween('x1', (d) => () => d.source.x)
                        .attrTween('x2', (d) => () => d.target.x)
                        .attrTween('y1', (d) => () => d.source.y)
                        .attrTween('y2', (d) => () => d.target.y)
                        .remove()
            )

        let users = data.nodes.filter((d) => d.type === 0)
        let enterUser
        user = user
            .data(users, (d) => d.id)
            .join(
                (enter) => {
                    enterUser = enter
                        .append('g')
                        .classed('user', true)
                        .call(drag(simulation))
                    return enterUser
                },
                (update) => update,
                (exit) =>
                    exit
                        .transition(500)
                        .style('opacity', 0)
                        .remove()
            )

        userLink = enterUser.append('a').classed('user-link', true)

        userDecor = userLink
            .append('circle')
            .classed('user-decor', true)
            .attr('r', 8.75)

        userImage = userLink
            .append('image')
            .classed('user-image', true)
            .attr('href', (d) => getImageUrl(d.id))
            .on('error', (d, i, e) => e[i].setAttribute('href', 'resources/user_blue.png'))
            .attr('x', -8)
            .attr('y', -8)
            .attr('width', 16)
            .attr('height', 16)

        userLabel = userLink
            .append('text')
            .classed('hidden', true)
            .classed('user-label', true)
            .attr('text-anchor', 'middle')
            .attr('dy', 18)
            .text((d) => d.id.split(' ')[0])

        let projects = data.nodes.filter((d) => d.type === 1)
        let enterProject
        project = project
            .data(projects, (d) => d.id)
            .join(
                (enter) => {
                    enterProject = enter
                        .append('g')
                        .classed('project', true)
                        .call(drag(simulation))
                    return enterProject
                },
                (update) => update,
                (exit) =>
                    exit
                        .transition(500)
                        .style('opacity', 0)
                        .remove()
            )

        projectIcon = enterProject
            .append('path')
            .classed('project-icon', true)
            .attr('d', starPointsRound)
            .attr('fill', yellow)

        projectLabel = enterProject
            .append('text')
            .classed('project-label', true)
            .classed('hidden', true)
            .attr('text-anchor', 'middle')
            // .attr('dx', 8)
            // .attr('dy', 4)
            .text((d) => d.id)

        d3.selectAll('.project-label').call(wrap, 200)

        simulation.nodes(data.nodes)
        simulation.force('link').links(data.links)
        simulation.alpha(1).restart()
    }
    d3.select('.loader').style('display', 'none')

    function ticked() {
        contribution
            .attr('x1', (d) => d.source.x)
            .attr('y1', (d) => d.source.y)
            .attr('x2', (d) => d.target.x)
            .attr('y2', (d) => d.target.y)

        // circles.attr('cx', (d) => d.x).attr('cy', (d) => d.y)
        user.attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
        project.attr('transform', (d) => 'translate(' + (d.x - 8) + ',' + (d.y - 8) + ')') //depends on svg path
    }

    //----- zoom
    const extentminX = 1
    const kMax = 21
    const zoom = d3
        .zoom()
        .filter(() => {
            console.log('event ' + d3.event.type, d3.event)
            return true
        })
        .wheelDelta(() => {
            return (-d3.event.deltaY * (d3.event.deltaMode ? 120 : 1)) / (event.ctrlKey ? 250 : 500)
        })
        .extent([
            [0, 0],
            [width, height]
        ])
        .scaleExtent([1, kMax])
        //       .on('start', zoomStart)
        .on('zoom', zoomed)
    //   .on('end', zoomEnd)

    svg.call(zoom)

    let zoomCenter
    function zoomStart() {}

    let lastTrasform
    let level

    function zoomed() {
        const transform = d3.event.transform
        // const x = d3.event.sourceEvent.x
        // const y = d3.event.sourceEvent.y
        // const ox = (d3.event.x - t0.x) / t0.k
        // const oy = (d3.event.y - t0.y) / t0.k
        const k = transform.k

        // console.log(k)

        // console.log(focusNode)
        // console.log(lastNode)

        // var arr = [1, 1.1, 1.2, 1.3, 1.4, 1.5]

        var newLevel = getTargetLevel(k)
        console.log('newLevel: ' + newLevel)
        console.log('diveLevel: ' + diveLevel)

        if (newLevel !== diveLevel) {
            if (newLevel > diveLevel) {
                // console.log('--- out ---')
                zoomOut(lastNode.datum().id, newLevel)
            }
            if (newLevel < diveLevel) {
                // console.log('--- in ---')
                zoomIn(lastNode.datum().id, newLevel)
            }
        }

        t0.x = transform.x
        t0.y = transform.y
        t0.k = transform.k

        svgG.attr('transform', 'translate(' + transform.x + ', ' + transform.y + ') scale(' + transform.k + ')')
    }
    function zoomEnd() {}

    let step = 2
    function reset() {
        svg.transition()
            .duration(750)
            // .call(zoom.transform, lastTransform)
            .call(zoom.transform, d3.zoomIdentity, d3.zoomTransform(svgG.node()).invert([width / 2, height / 2]))
    }

    // d3.select('#reset').on('click', reset)

    //-------------------------------------------
    //------- plus and minus functions
    // d3.select('#plus').on('click', zoomIn)
    // d3.select('#minus').on('click', zoomOut)

    function zoomIn(id, toLevel) {
        console.log('-------- zooming IN ----------')
        getLevelGroups(data, id)

        targetLevel = toLevel || diveLevel || maxLevel

        if (targetLevel && targetLevel > 0) {
            let updateData = {
                nodes: data.nodes.filter((n) => n.level <= targetLevel),
                links: data.links.filter((n) => n.level <= targetLevel)
            }
            update(updateData)
            diveLevel = targetLevel
        }
        if (diveLevel <= 4) {
            nodeG.classed('team-level', true)
            if (diveLevel <= 2) {
                nodeG.classed('focus-level', true)
            }
        }
        console.log(diveLevel)
    }

    function zoomOut(id, toLevel) {
        console.log('-------- zooming OUT ----------')
        getLevelGroups(data, id)
        const maxLevel = Math.max.apply(
            Math,
            data.nodes.map((o) => o.level || 0)
        )
        let targetLevel = toLevel || diveLevel

        if (targetLevel && targetLevel <= maxLevel + 1) {
            let uData = {
                nodes: data.nodes.filter((n) => n.level <= targetLevel),
                links: data.links.filter((n) => n.level <= targetLevel)
            }
            update(uData)
            diveLevel = targetLevel
        }
        if (diveLevel > 2) {
            nodeG.classed('focus-level', false)
            if (diveLevel > 4) {
                nodeG.classed('team-level', false)
            }
        }
        console.log(diveLevel)
    }
}

//----- moving mouse
function movingMouse() {
    // console.log('--- moving mouse ---')
    const highlightColor = '#090'
    const m = d3.mouse(this)
    const ox = (m[0] - t0.x) / t0.k
    const oy = (m[1] - t0.y) / t0.k
    // console.log([ox, oy])
    const closestData = simulation.find(ox, oy)
    // console.log(closestData)
    const nodeDistance = distanceOfCoordinates([closestData.x, closestData.y], [ox, oy])
    // console.log(nodeDistance)

    const closestNode = d3
        .select('.nodes')
        .selectAll('g')
        .filter((d) => d.id === closestData.id)
    lastNode = closestNode
    // console.log(closestNode)

    const catchRadius = 20
    if (nodeDistance < catchRadius / t0.k) {
        if (closestNode !== focusNode) {
            // if (focusNode) {
            //     focusNode.attr('fill', (d) => colorGroup[d.group])
            //     // const levelGroups = getLevelGroups(data, closestData.id)
            //     // console.log(levelGroups)
            // }
            // closestNode.attr('fill', highlightColor)
            focusNode = closestNode
        }
    } else {
        // if (focusNode) {
        //     focusNode.attr('fill', (d) => colorGroup[d.group])
        // }
        focusNode = null
    }
}
//----- hover function
function hovering() {
    let m = d3.mouse
    let e = d3.event
    // console.log(e)
}
function hoverEnd() {}

//----- color function
function color(d) {
    const scale = d3.scaleOrdinal(d3.schemeCategory10)
    return scale(d.group)
}

//----- drag function
drag = (simulation) => {
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
    }

    function dragged(d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
    }

    return d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
}

function getMaxLevel(oData) {
    return Math.max.apply(
        Math,
        oData.nodes.map((o) => o.level || 0)
    )
}

function distanceOfCoordinates(p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]))
}

function getTargetLevel(k) {
    switch (true) {
        case k > 6:
            return 1
        case k > 3.1:
            return 2
        case k > 2:
            return 3
        case k > 1.5:
            return 4
        case k > 1.3:
            return 5
        case k > 1.2:
            return 6
        case k > 1.1:
            return 7
        case k > 1.05:
            return 8
        case k > 1.0:
            return 9
        default:
            return 10
    }
}

var starGenerator = d3
    .symbol()
    .type(d3.symbolStar)
    .size(80)

var starPath = starGenerator()

function getImageUrl(fullName) {
    const name = fullName.split(' ')
    const doubleNames = ['Andrea', 'Christian', 'JÃ¶rn', 'Felix', 'Lena', 'Simon']
    let url = 'resources/' + name[0]
    if (doubleNames.indexOf(name[0]) !== -1) {
        url += ' ' + name[name.length - 1].substr(0, 1)
    }
    return url + '.jpeg'
}
function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text
                .text()
                .split(/\s+/)
                .reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = 24, //text.attr('y'),
            dy = 0, //parseFloat(text.attr('dy')),
            tspan = text
                .text(null)
                .append('tspan')
                .attr('x', 8)
                .attr('y', y)
                .attr('dy', dy + 'em')
        while ((word = words.pop())) {
            line.push(word)
            tspan.text(line.join(' '))
            if (tspan.node().getComputedTextLength() > width) {
                line.pop()
                tspan.text(line.join(' '))
                line = [word]
                tspan = text
                    .append('tspan')
                    .attr('x', 8)
                    .attr('y', y)
                    .attr('dy', ++lineNumber * lineHeight + dy + 'em')
                    .text(word)
            }
        }
    })
}

function clicked() {
    // const ox = (d3.event.x - t0.x) / t0.k
    // const oy = (d3.event.y - t0.y) / t0.k
    // nodeG
    //     .append('rect')
    //     .attr('fill', '#999')
    //     .attr('fill-opacity', 0.5)
    //     .attr('x', ox)
    //     .attr('y', oy)
    //     .attr('width', 0)
    //     .attr('height', 0)
    //     .transition(10)
    //     .attr('x', ox - 10)
    //     .attr('y', oy - 10)
    //     .attr('width', 20)
    //     .attr('width', 20)
    //     .attr('height', 20)
    //     .remove()
    // if (focusNode) {
    //     console.log(focusNode.datum().id)
    //     zoomIn(focusNode.datum().id)
    // }
}