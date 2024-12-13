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
        return [new Coordinate(this.x-1,this.y), new Coordinate(this.x+1,this.y), new Coordinate(this.x, this.y-1), new Coordinate(this.x, this.y+1)]
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
        return [...this].map((coordinate) => coordinate.neighbors().filter(neighbor => !this.has(neighbor)).length).reduce((a, b) => a+b, 0)
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

    console.log(finalRegions.map(fr => fr.area() * fr.perimeter()).reduce((a,b)=>a+b))
}

class Side extends Set<Coordinate> {
    direction: string

    constructor(direction: string) {
        super()
        this.direction = direction
    }

    adjacent(other: Region) {
        return [...this].some(elem => [...other].some(elem2 => elem.adjacent(elem2)))
    }

    add(coordinate: Coordinate) {
        if (![...this].some(elem => elem.equals(coordinate))) {
            return super.add(coordinate);
        } else {
            return this
        }
    }

    has(coordinate: Coordinate) {
        return [...this].some(elem => elem.equals(coordinate))
    }

    conditionalAdd(coordinate) {
        switch (this.direction) {
            case "left":
                
                break;
            case "right":
                break;
            case "up":
                break;
            case "down":
                break;
        }
    }
}

function B() {
    let data = readFileSync('./input/test.txt', 'utf-8').split("\n")

    const finalRegions = calculateRegions(data)

    console.log(finalRegions.map(fr => fr.area() * fr.perimeter()).reduce((a,b)=>a+b))
}

A()