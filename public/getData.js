async function getData() {
    const data = await d3.json('data.json')
    return data
}

function getLevelGroups(data, id, level, levelGroups) {
    // id = 'Jörn Apel' //"Kerstin Nethen";
    // levelGroups = levelGroups.length ? levelGroups : []
    let un = data.nodes.filter((e) => !e.level)
    let ul = data.links.filter((l) => !l.level)

    // console.log('un.length: ' + un.length)
    // console.log('ul.length: ' + ul.length)
    // console.log(ul)

    const maxLevel = Math.max.apply(
        Math,
        data.nodes.map((o) => o.level || 0)
    )
    // console.log('level: ' + level)
    // console.log('maxLevel: ' + maxLevel)

    // console.log(maxLevel)

    if (!level) {
        level = 1
        data.nodes.forEach((n) => (n.level = null))
        data.links.forEach((l) => (l.level = null))
        let f = (data.nodes.filter((e) => e.id == id)[0].level = level)
    } else if (level === maxLevel + 1) {
        // console.log('second function')

        let preLevelNodeMap = data.nodes.filter((e) => e.level === maxLevel).map((n) => n.id)
        // console.log(preLevelNodeMap)

        ul.forEach((l) => {
            // console.log(l)

            if (l.source.level === level - 1) {
                l.target.level = level
                l.level = level
            }
            if (l.target.level === level - 1) {
                l.source.level = level
                l.level = level
            }
        })
        // console.log('marked levels')

        // console.log(un.filter((d) => d.level === level))
        // console.log(ul.filter((d) => d.level === level))

        let uul = data.links.filter((l) => !l.level)
        uul.forEach((l) => {
            if (l.source.level === level && l.target.level === level) {
                l.level = level
            }
        })
    } else {
        un.forEach((n) => (n.level = level - 1))
        // console.log(un)
        ul.forEach((l) => (l.level = level - 1))
        // console.log(ul)
        // console.log('aftere LEVELING')

        // console.log(data)
        return
    }

    // console.log(un.filter((d) => d.level === level))
    // console.log(ul.filter((d) => d.level === level))

    level++
    // console.log('level: ' + level)

    getLevelGroups(data, id, level, levelGroups)
}
