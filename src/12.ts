import { readFileSync } from "fs"

class Coordinate {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    equals(other: Coordinate) {
        return this.x == other.x && this.y == other.y
    }

    adjacent(other: Coordinate) {
        const adjacentX = Math.abs(this.x - other.x)
        const adjacentY = Math.abs(this.y - other.y)

        return (adjacentX == 0 && adjacentY == 1) || (adjacentX == 1 && adjacentY == 0)
    }

    neighbors() {
        return [new Coordinate(this.x - 1, this.y), new Coordinate(this.x + 1, this.y), new Coordinate(this.x, this.y - 1), new Coordinate(this.x, this.y + 1)]
    }
}

class Region extends Set<Coordinate> {
    type: string
    maxy: number // used to prevent unnecessary checks when merging

    constructor(type: string) {
        super()
        this.type = type
        this.maxy = 0
    }

    adjacent(other: Region) {
        return [...this].some(elem => [...other].some(elem2 => elem.adjacent(elem2)))
    }

    add(coordinate: Coordinate) {
        if (![...this].some(elem => elem.equals(coordinate))) {
            if (this.maxy < coordinate.y) {
                this.maxy = coordinate.y
            }
            return super.add(coordinate);
        } else {
            return this
        }
    }

    has(coordinate: Coordinate) {
        return [...this].some(elem => elem.equals(coordinate))
    }

    conditionalAdd(type: string, coordinate: Coordinate) {
        if (this.type == type && [...this].some(elem => elem.adjacent(coordinate))) {
            this.add(coordinate)
            return true
        }
        return false
    }

    conditionalMerge(other: Region) {
        if (other.type == this.type && this.adjacent(other)) {
            other.forEach(elem => this.add(elem))
            return true
        } else {
            return false
        }
    }

    area() {
        return this.size
    }

    perimeter() {
        return [...this].map((coordinate) => coordinate.neighbors().filter(neighbor => !this.has(neighbor)).length).reduce((a, b) => a + b, 0)
    }
}

function mergeAllRegions(list: Region[]) {
    const newlist: Region[] = []

    list.forEach(r => {
        if (!newlist.some(r2 => r2.conditionalMerge(r))) {
            newlist.push(r)
        }
    })

    return newlist
}

function calculateRegions(data: string[]) {
    let finalRegions: Region[] = []
    data.forEach((line, j) => {
        const unused = finalRegions.filter(r => r.maxy < j - 1)
        const prev = finalRegions.filter(r => r.maxy == j - 1)
        line.split("").forEach((char, i) => {
            if (prev.length == 0 || !prev.some(r => r.conditionalAdd(char, new Coordinate(i, j)))) {
                const r = new Region(char)
                r.add(new Coordinate(i, j))
                prev.push(r)
            }
        })

        finalRegions = [...unused, ...mergeAllRegions(prev)]
    })
    return finalRegions
}

function A() {
    let data = readFileSync('./input/test.txt', 'utf-8').split("\n")

    const finalRegions = calculateRegions(data)

    console.log(finalRegions.map(fr => fr.area() * fr.perimeter()).reduce((a, b) => a + b))
}

class Edge {
    x: number //Edges start at the top left of a square and point down or right 
    y: number
    down: boolean //True = down, False = right

    constructor(x: number, y: number, down: boolean) {
        this.x = x
        this.y = y
        this.down = down
    }

    equals(other: Edge) {
        return this.x == other.x && this.y == other.y && this.down == other.down
    }

    adjacent(other: Edge) {
        const adjacentX = Math.abs(this.x - other.x)
        const adjacentY = Math.abs(this.y - other.y)

        // Ajacent if both edges point in the same direction and the origins are in adjacent spaces
        return (adjacentX == 0 && adjacentY == 1 && this.down && other.down) ||
            (adjacentX == 1 && adjacentY == 0 && !this.down && !other.down)
    }

    neighbors() {
        if (this.down) {
            return [new Edge(this.x, this.y + 1, true), new Edge(this.x, this.y - 1, true)]
        } else {
            return [new Edge(this.x + 1, this.y, false), new Edge(this.x - 1, this.y, false)]
        }
    }
}

class Side extends Set<Edge> {

    constructor() {
        super()
    }

    adjacent(other: Side) {
        return [...this].some(elem => [...other].some(elem2 => elem.adjacent(elem2)))
    }

    add(edge: Edge) {
        if (![...this].some(elem => elem.equals(edge))) {
            return super.add(edge);
        } else {
            return this
        }
    }

    has(edge: Edge) {
        return [...this].some(elem => elem.equals(edge))
    }

    conditionalAdd(edge: Edge) {
        if ([...this].some(elem => elem.adjacent(edge))) {
            this.add(edge)
            return true
        }
        return false
    }

    conditionalMerge(side: Side) {
        if (this.adjacent(side)) {
            side.forEach(elem => this.add(elem))
            return true
        } else {
            return false
        }
    }

}

function calculateSides(data: string[]) {
    // Take into account that the entire right and lower side of the fence needs to be padded
    let padded = [...data, " ".repeat(data[0].length)].map(s => s + " ")

    let sides: Side[] = []
    padded.map((line, j) => line.split("").map((char, i) => {
        let checkup = true; // Booleans to keep from checking out of bounds
        let checkleft = true;
        if (i - 1 < 0) {
            if (char != " ") {
                const s = new Side()
                s.add(new Edge(i, j, true))
                sides.push(s)
            }
            checkleft = false;
        }
        if (j - 1 < 0) {
            if (char != " ") {
                const s = new Side()
                s.add(new Edge(i, j, false))
                sides.push(s)
            }
            checkup = false;
        }

        if (checkleft) {
            const leftneighbor = padded[j][i - 1]

            if (!(leftneighbor == " " && char == " ") && leftneighbor != char) {
                const s = new Side()
                s.add(new Edge(i, j, true))
                sides.push(s)
            }
        }

        if (checkup) {
            const upneighbor = padded[j - 1][i]

            if (!(upneighbor == " " && char == " ") && upneighbor != char) {
                const s = new Side()
                s.add(new Edge(i, j, false))
                sides.push(s)
            }
        }
    }))
    return mergeAllSides(sides)
}

function mergeAllSides(list: Side[]) {
    const newlist: Side[] = []

    list.forEach(r => {
        if (!newlist.some(r2 => r2.conditionalMerge(r))) {
            newlist.push(r)
        }
    })

    return newlist
}

// Returns whether a side is adjacent to the current region
function adjacentSideRegion(side: Side, region: Region) {
}

function B() {
    let data = readFileSync('./input/test.txt', 'utf-8').split("\n")

    const regions = calculateRegions(data)
    const sides = calculateSides(data)


    console.log(regions)
    console.log(sides)
}

A()
B()