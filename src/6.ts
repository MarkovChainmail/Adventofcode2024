import { readFileSync } from "fs"

// If the position collides with an object, return true else false
function checkCollision(pos: number[], data: string[]) {
    if (data[pos[1]] == undefined || data[pos[1]][pos[0]] == undefined) {
        return false;
    }

    return data[pos[1]][pos[0]] == "#";
}

class ObjectSet extends Set<Object>{
    add(elem: Object){
      return super.add(typeof elem === 'object' ? JSON.stringify(elem) : elem);
    }
    has(elem: Object){
      return super.has(typeof elem === 'object' ? JSON.stringify(elem) : elem);
    }
    copy(){
        return new ObjectSet(this);
    }
}


function A() {
    const data = readFileSync('./input/day6.txt', 'utf-8').split("\n")

    let pos = data.map((line, index) => [line.indexOf("^"), index]).filter(n => n[0] != -1)[0]
    let direction = "^"
    let visited = new ObjectSet()

    while (pos[0] >= 0 && pos[0] < data[0].length && pos[1] >= 0 && pos[1] < data.length) {
        visited.add(pos);
        switch(direction) {
            case "^": {
                const newPos = [pos[0], pos[1]-1]
                if (checkCollision(newPos, data)) {
                    direction = ">"
                } else {
                    pos = newPos;
                }
                break;
            }
            case ">": {
                const newPos = [pos[0]+1, pos[1]]
                if (checkCollision(newPos, data)) {
                    direction = "v"
                } else {
                    pos = newPos;
                }
                break;
            }
            case "v": {
                const newPos = [pos[0], pos[1]+1]
                if (checkCollision(newPos, data)) {
                    direction = "<"
                } else {
                    pos = newPos;
                }
                break;
            }
            case "<": {
                const newPos = [pos[0]-1, pos[1]]
                if (checkCollision(newPos, data)) {
                    direction = "^"
                } else {
                    pos = newPos;
                }
                break;
            }
        }

    }

    console.log(visited.size)
}

function rotate(s: string) {
    switch(s) {
        case "^":
            return ">"
        case ">":
            return "v"
        case "v":
            return "<"
        case "<":
            return "^"
    }
}

// Simulate the path and find out whether there's an infinite loop
function isLoop(direction: string, position: number[], data: string[]) {
    let pos = position;
    let visited: ObjectSet = new ObjectSet();

    while (pos[0] >= 0 && pos[0] < data[0].length && pos[1] >= 0 && pos[1] < data.length) {
        if (visited.has([pos, direction])) {
            return true;
        }
        visited.add([pos, direction])
        switch(direction) {
            case "^": {
                const newPos = [pos[0], pos[1]-1]
                if (checkCollision(newPos, data)) {
                    direction = ">"
                } else {
                    pos = newPos;
                }
                break;
            }
            case ">": {
                const newPos = [pos[0]+1, pos[1]]
                if (checkCollision(newPos, data)) {
                    direction = "v"
                } else {
                    pos = newPos;
                }
                break;
            }
            case "v": {
                const newPos = [pos[0], pos[1]+1]
                if (checkCollision(newPos, data)) {
                    direction = "<"
                } else {
                    pos = newPos;
                }
                break;
            }
            case "<": {
                const newPos = [pos[0]-1, pos[1]]
                if (checkCollision(newPos, data)) {
                    direction = "^"
                } else {
                    pos = newPos;
                }
                break;
            }
        }

    }
    return false;
}

function placeObject(pos: number[], data: string[]) {
    // JAVASCRIIIIIPT WHY NO NORMAL COPY FUNCTION???
    const clone = JSON.parse((JSON.stringify(data)))
    const s = clone[pos[1]];
    clone[pos[1]] = s.substring(0, pos[0]) + '#' + s.substring(pos[0] + 1);
    // console.log(clone.join("\n"))
    // console.log();
    return clone;
}

function hasSpace(pos: number[], data: string[], startingpos: number[]) {
    // Check if out of bounds, or position is the starting position
    if (data[pos[1]] == undefined || data[pos[1]][pos[0]] == undefined || (pos[0] == startingpos[0] && pos[1] == startingpos[1])) {
        return false;
    }

    // Check if location has a box
    return data[pos[1]][pos[0]] != "#";
}

function B() {
    const data = readFileSync('./input/day6.txt', 'utf-8').split("\n")

    const startingpos = data.map((line, index) => [line.indexOf("^"), index]).filter(n => n[0] != -1)[0]
    let pos = startingpos;
    let direction = "^"
    let total = 0;

    // while in-bounds
    while (pos[0] >= 0 && pos[0] < data[0].length && pos[1] >= 0 && pos[1] < data.length) {
        // do something based on direction
        switch(direction) {
            case "^": {
                // if the next position is a collision, turn
                const newPos = [pos[0], pos[1]-1]
                if (checkCollision(newPos, data)) {
                    direction = ">"
                } else {
                    // if the next position isn't a collision, attempt to place an object
                    if (hasSpace(newPos, data, startingpos)) {
                        if (isLoop(direction, pos, placeObject(newPos, data))) {
                            total++;
                        }
                    }
                    pos = newPos;
                }
                break;
            }
            case ">": {
                const newPos = [pos[0]+1, pos[1]]
                if (checkCollision(newPos, data)) {
                    direction = "v"
                } else {
                    if (hasSpace(newPos, data, startingpos)) {
                        if (isLoop(direction, pos, placeObject(newPos, data))) {
                            total++;
                        }
                    }
                    pos = newPos;
                }
                break;
            }
            case "v": {
                const newPos = [pos[0], pos[1]+1]
                if (checkCollision(newPos, data)) {
                    direction = "<"
                } else {
                    if (hasSpace(newPos, data, startingpos)) {
                        if (isLoop(direction, pos, placeObject(newPos, data))) {
                            total++;
                        }
                    }
                    pos = newPos;
                }
                break;
            }
            case "<": {
                const newPos = [pos[0]-1, pos[1]]
                if (checkCollision(newPos, data)) {
                    direction = "^"
                } else {
                    if (hasSpace(newPos, data, startingpos)) {
                        if (isLoop(direction, pos, placeObject(newPos, data))) {
                            total++;
                        }
                    }
                    pos = newPos;
                }
                break;
            }
        }

    }

    console.log(total)
}

A()
B()