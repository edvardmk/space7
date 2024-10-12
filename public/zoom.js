//----- zoom
const extentminX = 1
const kMax = 21
const zoom = d3
    .zoom()
    .extent([
        [0, 0],
        [width, height]
    ])
    .scaleExtent([1, kMax])
    .on('start', zoomStart)
    .on('zoom', zoomed)
    .on('end', zoomEnd)

svg.call(zoom)

let zoomCenter
let o = {
    x: 0,
    y: 0,
    k: 1
}
function zoomStart() {
    console.log('------ START ------')
    console.log(d3.event.transform)

    // const x = d3.event.transform.invertX(d3.event.sourceEvent.x)
    // const y = d3.event.transform.invertY(d3.event.sourceEvent.y)

    // o.x = x
    // o.y = y

    // nodeG
    //     .append('circle')
    //     .attr('fill', '#555')
    //     .attr('cx', x)
    //     .attr('cy', y)
    //     .attr('r', 0)
    //     .transition(2000)
    //     .attr('r', 15)
    //     .remove()

    // const closestNode = simulation.find(x, y)
    // console.log(closestNode)
    // console.log(closestNode.id)

    // const transform = d3.zoomIdentity.translate(width / 2, height / 2)

    //         .scale(d3.event.transform.k)
    //         .translate(-closestNode.x, -closestNode.y)
    // )
    // var t = d3.zoomIdentity //.translateBy(100, 200).scale(1)
    // console.log(t)

    // console.log(d3.event.transform)
    // svg.call(zoom.transform, transform)
    // svg.call(zoom)

    //.transition()
    //.duration(2500)
    // .call(zoom.translateBy, 200, 100)
    // d3.mouse(svg.node())
    // zoomBaseElement.call(zoom.transform, t)

    // zoomCenter = closestNode
    // console.log(zoomCenter)
}

let lastTrasform
let kSum = 0
let t0 = { x: 0, y: 0, k: 1 }
let l = { x: 0, y: 0 }
function zoomed() {
    console.log('------ MIDDLE ------')
    if (d3.event.sourceEvent) {
        // relative to upper left screen corner
        // console.log(d3.event.transform)
        // const ex = d3.event.transform.x
        // const ey = d3.event.transform.y
        let k = d3.event.transform.k
        const w = width
        const h = height

        // console.log(ex, ey)
        // console.log(d3.event.sourceEvent.x, d3.event.sourceEvent.y)

        // var xxx = (d3.event.sourceEvent.x - d3.event.transform.x) / d3.event.transform.k

        let logg1 = Math.log(k)
        let logg2 = log21(k / t0.k)
        let logg3 = log21(k / 2)
        // let logg3 = logBase(k / t0.k, kMax / t0.k)
        // console.log(k - t0.k, kMax - t0.k)
        // console.log((k - t0.k) / (kMax - t0.k))
        // let logg4 = Math.log((k - t0.k) / (kMax - t0.k))
        // console.log(logg)

        // relative position to SVG
        const x = d3.event.sourceEvent.x
        const ux = l.x || x
        const deltaX = ((ux - w / 2) * logg1) / 10 //  /(kMax - t0.k)) * (k - t0.k)
        // const factor = (k - t0.k) / (kMax - t0.k)

        // console.log(ux)
        // console.log(ux - w / 2)
        // console.log(deltaX)

        // // var x2 = (x - t0.x) / t0.k
        // // x = (x - width / 2) / (1 - logg) + x
        // const ox = (cx - t0.x) / t0.k

        // // const ox = (d3.event.sourceEvent.x - ex) / t0.k
        // //d3.event.transform.invertX(d3.event.sourceEvent.x)

        const y = d3.event.sourceEvent.y
        const uy = l.y || y
        const deltaY = (uy - h / 2) * (logg1 / 10)

        // // var y2 = (y - t0.y) / t0.k
        // // y = (y - height / 2) / (1 - logg) + y
        // const oy = (cy - t0.y) / t0.k
        // // const oy = (d3.event.sourceEvent.x - ey) / t0.k
        // //d3.event.transform.invertY(d3.event.sourceEvent.y)
        // // console.log(Math.floor(x), Math.floor(y))
        // console.log(uy)
        // console.log(uy - h / 2)
        // console.log(deltaY)

        // console.log(d3.event.transform)

        const shift = {
            x: -deltaX + t0.x,
            y: -deltaY + t0.y,
            k: 1
        }

        const scale = {
            x: -(k / t0.k) * (x - t0.x) + x,
            y: -(k / t0.k) * (y - t0.y) + y,
            k: k //tk
        }

        // const cx = width / 2
        // const cy = height / 2
        // dx = width / 2 - x
        // dy = height / 2 - y
        // dx = d3.event.transform.x + x * k - cx
        // dy = d3.event.transform.y + y * k - cy
        // dy = height / 2 - y * k
        // let pow = Math.pow(21)

        // let exp = Math.pow(kMax, (1 + 1 / kMax) * (x - width / 2))
        // let a = width / 2 - log21((1 - kMax) / (exp - 1))
        // let b = (1 - kMax * exp) / (exp - 1)

        // x = a + log21(x + b)
        // y = a + log21(y + b)
        // x = -x * (k / t0.k - 1) + (k / t0.k) * t0.x
        // y = -y * (k / t0.k - 1) + (k / t0.k) * t0.y

        // x = x - (width / 2 - x) * (1 - logg)
        // x = x + (x - width) * (1 - logg) //(k - 1)) / 400
        // x = x + ((x - width) * (k - 1)) / 400
        // y = y - (height / 2 - y) * (1 - logg)
        // y = y + (y - height) * (1 - logg) //(k - 1)) / 400
        // y = y + ((y - height) * (k - 1)) / 400

        // let xx = t0.x + kMax * ox - w / 2
        // let ex = Math.exp(xx)
        // let fx = (kMax - k) / (kMax - t0.k)
        // let cx = ex * fx

        // let yy = t0.y + kMax * oy - w / 2
        // let ey = Math.exp(yy)
        // let fy = (kMax - k) / (kMax - t0.k)
        // let cy = ey * fy

        // let c2 = (k - t0.k) / (kMax - t0.k)

        // console.log(xx)
        // console.log(ex)
        // console.log(fx)
        // console.log(cx)

        // console.log(yy)
        // console.log(ey)
        // console.log(fy)
        // console.log(cy)

        // console.log(c2)
        // k = Math.min(k, 15)
        // var lo = (k - t0.k) / (kMax - t0.k)

        // console.log(k)
        // console.log(k - t0.k)
        // console.log(ux - w / 2)

        // console.log((ux - w / 2) / (kMax - k))

        const transform = {
            x: shift.x + scale.x,
            y: shift.y + scale.y,
            k: shift.k + scale.k

            // x: -(k / t0.k) * (x - t0.x) + 1 * x + (width / 2 - x) * logg,
            // y: -(k / t0.k) * (y - t0.y) + 1 * y + (height / 2 - y) * logg,

            // x:
            // x: w / 2 - kMax * ox + Math.log(cx + c2),

            // x: ((k - t0.k) / (t0.k - kMax)) * (kMax * ox + t0.x - w / 2) + t0.x,

            // x: -k * x + x + (width / 2 - x) * logg, //  smooth log
            // x: lo * (w / 2 - kMax * x - t0.x) + t0.x,
            // x: (-k / t0.k) * (x - t0.x) + x + (w / 2 - x - kMax * t0.x) * logg1, // current best
            // x: -(k / t0.k) * (x - t0.x) + x, // zoom on cursor position with pre history
            // x: (-(k - t0.k) / (kMax - t0.k)) * (x - w / 2) - 0 * x + t0.x,
            // x: -deltaX + t0.x,
            // x: (-k / kMax) * (ox - w / 2) + t0.x,
            // x: -(k / t0.k) * (x - t0.x) + x + (width / 2 - x) * log21(k),
            // x: ((k - t0.k) / (kMax - t0.k)) * (width / 2 - x * (kMax / t0.k)) + t0.x * (k / t0.k),
            // x: 0, //-x * (tk - 1), // = d3.event.transform.x
            // x: (z.x - x) * (ek / z.k) + x + (width / 2 - x) * ((ek - z.k) / (extentMaxX - ek)),
            // x: -x * (k - 1),
            // x: -(x - (width / 2 - x) / (kMax - k)) * (k - 1),
            // x: (-(k - 1) / (kMax - t0.k)) * (x * kMax - (width * t0.k) / 2),
            // x: -ox * (tk - 1) + (width / 2 - ox) * ((tk - 1) / extentMaxX),
            //(-x * k + (cx * k) / 30) * (k / 30), //dx, //((dx * k) / 30) * d3.event.transform.k,
            // y: 0, //-y * (tk - 1), // = d3.event.transform.y
            // y: (z.y - y) * (ek / z.k) + y + (height / 2 - y) * ((ek - z.k) / (extentMaxX - ek)),

            // y: h / 2 - kMax * oy + Math.log(cy + c2),

            // y: ((k - t0.k) / (t0.k - kMax)) * (kMax * oy + t0.y - h / 2) + t0.y, //// current best

            // y: -k * y + y + (height / 2 - y) * logg, //  smooth log
            // y: lo * (h / 2 - kMax * y - t0.y) + t0.y,
            // y: (-k / t0.k) * (y - t0.y) + y + (h / 2 - y - kMax * t0.y) * logg1, // current best
            // y: -(k / t0.k) * (y - t0.y) + y, // zoom on cursor position with pre history
            // y: (-(k - t0.k) / (kMax - t0.k)) * (y - h / 2) - 0 * y + t0.y,
            // y: -deltaY + t0.y,
            // y: (-k / kMax) * (oy - h / 2) + t0.y,
            // y: -(k / t0.k) * (y - t0.y) + y + (height / 2 - y) * log21(k),
            // y: ((k - t0.k) / (kMax - t0.k)) * (height / 2 - y * (kMax / t0.k)) + t0.y * (k / t0.k),
            // y: -y * (k - 1),
            // y: -(y - (height / 2 - y) / (kMax - k)) * (k - 1),
            // y: (-(k - 1) / (kMax - t0.k)) * (y * kMax - (height * t0.k) / 2),
            // y: -oy * (tk - 1) + (height / 2 - oy) * ((tk - 1) / extentMaxX),
            //(-y * k + (cy * k) / 30) * (k / 30), //((dy * k) / 30) * d3.event.transform.k,
            // k: k //tk
        }
        l.x = ux - deltaX
        l.y = uy - deltaY
        console.log(transform) //ux - deltaX //uy - deltaY
        t0.x = transform.x //scale.x //shift.x //transform.x
        t0.y = transform.y //scale.y //shift.y //transform.y
        t0.k = transform.k
        // svgG.attr('transform', 'translate(' + shift.x + ', ' + shift.y + ') scale(' + shift.k + ')')
        // svgG.attr('transform', 'translate(' + scale.x + ', ' + scale.y + ') scale(' + scale.k + ')')

        transform = d3.event.transform
        svgG.attr('transform', 'translate(' + transform.x + ', ' + transform.y + ') scale(' + transform.k + ')')
    } else {
        console.log('ELSE')

        // ORIGINAL
        console.log(d3.event.transform)
        svgG.attr('transform', d3.event.transform)
    }

    // const transform = d3.zoomIdentity
    //     .translate(width / 2, height / 2)
    //     .scale(d3.event.transform.k)
    //     .translate(-zoomCenter.x, -zoomCenter.y)
    //     console.log(zoomCenter)

    // const transform2 = d3.zoomTransform(svgG.node()).invert([zoomCenter.x, zoomCenter.y])
    // console.log(transform)
    // console.log(transform2)
    // // console.log('xxxxxxxxxxx')
    // zoomTrans.x = d3.event.transform.x
    // zoomTrans.y = d3.event.transform.y
    // zoomTrans.scale = d3.event.transform.k

    // svg.transition()
    //     .duration(750)
    //     .call(zoom.transform, d3.zoomIdentity, d3.zoomTransform(svgG.node()).invert([zoomCenter.x, zoomCenter.y]))
    // console.log('zoomCenter')
    // console.log(zoomCenter)

    // svgG.attr('transform', transform)

    // svg.call(zoom.transform, d3.event.transform, [zoomCenter.x, zoomCenter.y])
    // console.log()
    // svg.call(zoom.transform)
    //     // .translate(-x, -y)
    // )
}
function zoomEnd() {
    console.log('------ END ------')
    console.log(d3.event.transform)
    lastTransform = d3.event.transform

    l.x = 0
    l.y = 0

    // svg.call(zoom.transform, d3.zoomIdentity)
}

let step = 2
function reset() {
    svg.transition()
        .duration(750)
        .call(zoom.transform, lastTransform)
    // .call(zoom.transform, d3.zoomIdentity, d3.zoomTransform(svgG.node()).invert([width / 2, height / 2]))

    // var zoomOutTransform = d3.zoomIdentity.scale(30)
    // svg.transition()
    //     // .duration()
    //     .call(zoom.scaleTo, step)
    //     .transition()
    //     .call(zoom.translateTo, 457 + (width / 2 - 457) * ((30 - step) / 30), 70 + (height / 2 - 70) * ((30 - step) / 30))
    // step++ //zoomOutTransform, [800, 400])
    //   .on('end', zoomToNormal)

    // function zoomToNormal() {
    //     svg.transition()
    //         .duration(3000)
    //         .ease(d3.easeQuadInOut)
    //         .call(zoom.transform, d3.zoomIdentity)
    // }
}
d3.select('#reset').on('click', reset)
