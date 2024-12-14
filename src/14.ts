import { readFileSync } from "fs";

function extractNumbers(s: String) {
    return [...s.matchAll(/[\-*0-9]+/g)].map(m => +m[0]);
}

function pos(sizeX: number, sizeY: number, initialX: number, initialY: number, vX: number, vY: number, seconds: number) {
    return [((initialX + vX * seconds) % sizeX + sizeX) % sizeX, ((initialY + vY * seconds) % sizeY + sizeY) % sizeY]
}

function count(sizeX: number, sizeY: number, positions: number[][]) {
    const quadrants = [0, 0, 0, 0]
    const [midX, midY] = [Math.floor(sizeX/2), Math.floor(sizeY/2)]

    positions.forEach((pos) => {
        if (pos[0] < midX && pos[1] < midY) {
            quadrants[0]++
        } else if (pos[0] > midX && pos[1] < midY) {
            quadrants[1]++
        } else if (pos[0] < midX && pos[1] > midY) {
            quadrants[2]++
        } else if (pos[0] > midX && pos[1] > midY) {
            quadrants[3]++
        }
    })

    return quadrants
}

function A() {
    const sizeX = 101
    const sizeY = 103
    const seconds = 100

    let positions = readFileSync('./input/day14.txt', 'utf-8').split("\n").map(extractNumbers).map(row => pos(sizeX, sizeY, row[0], row[1], row[2], row[3], seconds))
    console.log(count(sizeX, sizeY, positions).reduce((a, b) => a*b))   
}

function has(pos: number[], positions: number[][]) {
    return positions.some(el => el[0] == pos[0] && el[1] == pos[1])
}

function clustered(positions: number[][]) {
    let distance = 0
    positions.forEach((pos, i) => {
        [...Array(positions.length - i).keys()].forEach(j => {
            const other = positions[j]
            distance += (Math.pow(pos[0] - other[0], 2) + Math.pow(pos[1] - other[1], 2))
        })
    })
    return distance
}

function draw(sizeX: number, sizeY: number, positions: number[][]) {
    let drawing = ""
    const [rangej, rangei] = [[...Array(sizeY).keys()], [...Array(sizeX).keys()]]
    rangej.forEach((j) => {
        if (j != 0) {
            drawing += "\n"
        }
        rangei.forEach((i) => {
            if (has([i, j], positions)) {
                drawing += "."
            } else {
                drawing += " "
            }
        })
    })
    return drawing
}

function B() {
    const sizeX = 101
    const sizeY = 103

    let data = readFileSync('./input/day14.txt', 'utf-8').split("\n").map(extractNumbers)
    const a = [...Array(10000).keys()]
    a.forEach((t) => {
        const bots = data.map(row => pos(sizeX, sizeY, row[0], row[1], row[2], row[3], t))
        const clus = clustered(bots)
        if (clus < 200000000) {
            console.log(t)
            console.log(draw(sizeX, sizeY, bots))
        }
    })   
}

A()
B()