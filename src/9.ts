import { readFileSync } from "fs"

class DiskMapOptimizer {
    fileblocks: string[]
    startptr: number
    endptr: number

    expand(input: string) {
        let empty = false;
        let index = 0;
        let res = [];

        for (let s of input) {
            if (empty) {
                for (let i of new Array(+s)) {
                    res.push(".")
                }
            } else {
                for (let i of new Array(+s)) {
                    res.push(index.toString())
                }
                index++;
            }
            empty = !empty;
        }

        return res
    }

    constructor(input: string) {
        this.fileblocks = this.expand(input)
        this.startptr = this.fileblocks.indexOf(".")
        this.endptr = this.fileblocks.length - 1
    }

    print() {
        console.log([...this.fileblocks].map((char, i) => +char * i).reduce((a, b) => a+b))
    }

    optimize() {
        while (this.startptr != this.endptr && this.startptr != -1) {
            // console.log(this.startptr, this.endptr)
            this.fileblocks = [...this.fileblocks.slice(0, this.startptr), this.fileblocks[this.endptr], ...this.fileblocks.slice(this.startptr+1, this.endptr)];
            this.startptr = this.fileblocks.indexOf(".")
            const symbols = this.fileblocks.map((el, i) => [el, i]).filter((v) => v[0] != ".")
            this.endptr = +symbols[symbols.length-1][1]
        }
        console.log(this.fileblocks)
        this.print()
    }
}

class DiskMapOptimizer2 {
    fileblocks: string
    startptr: number // index of current left block
    startlength: number // length of current left block
    endptr: number // index of current right block
    endlength: number; // length of current right block
    emptyptr: number; // objective start of empty space
    startptramount: number; // objective start of current block
    checkstring: string[];

    constructor(input: string) {
        this.fileblocks = input
        this.startptr = 1
        this.startlength = +input[1]
        this.emptyptr = +input[0]
        this.startptramount = +input[0]
        this.endptr = this.fileblocks.length - 1
        this.endlength = +input[this.endptr]
        this.checkstring = Array(+input[0]).fill("0")
    }

    updateStartPointers() {
        this.startptramount += this.startlength
        this.startptr++;
        this.startlength = +this.fileblocks[this.startptr]
    }

    updateEndPointers(amount: number) {
        this.endptr = this.endptr - amount;
        this.endlength = +this.fileblocks[this.endptr]
    }

    remainingSpaceAtStart() {
        return this.startlength - this.emptyptr + this.startptramount
    }

    optimize() {
        let res = 0;
        let fileindex = 1; // The first file is multiplied by 0, so irrelevant
        let fileendindex = Math.floor(this.fileblocks.length / 2)
        // console.log(fileendindex)
        while (this.startptr <= this.endptr) {
            // console.log("startptr:", this.startptr, "startlength:", this.startlength, "endptr:", this.endptr, "endlength:", this.endlength, "emptyptr:", this.emptyptr, "startptramnt:", this.startptramount)
            // console.log("total:", res)
            // console.log(this.checkstring)
            if (this.remainingSpaceAtStart() < this.endlength) {
                console.log("lessthan")
                // Add checksums of files at the end of the disk
                res += Array(this.remainingSpaceAtStart()).map((value, index) => (index + this.emptyptr) * fileendindex).reduce((a, b) => a+b, 0)
                // this.checkstring += fileendindex.toString().repeat(this.remainingSpaceAtStart())
                this.checkstring = this.checkstring.concat(Array(+this.remainingSpaceAtStart()).fill(fileendindex.toString()))
                this.endlength = this.endlength - this.remainingSpaceAtStart()
                // Add checksums of file that the startpointer is pointing to
                this.emptyptr += this.remainingSpaceAtStart()
                this.updateStartPointers()
                if (this.startptr == this.endptr) {
                    // branch never entered
                    res += Array(this.endlength).map((value, index) => (index + this.startptramount) * fileindex).reduce((a, b) => a+b, 0)
                    // this.checkstring += fileindex.toString().repeat(this.endlength)
                    this.checkstring = this.checkstring.concat(new Array(+this.endlength).fill(fileindex.toString()))
                } else {
                    res += Array(this.startlength).map((value, index) => (index + this.startptramount) * fileindex).reduce((a, b) => a+b, 0)
                    // this.checkstring += fileindex.toString().repeat(this.startlength)
                    this.checkstring = this.checkstring.concat(new Array(+this.startlength).fill(fileindex.toString()))
                    this.emptyptr += this.startlength
                }
                this.updateStartPointers()
                fileindex++
            } else if (this.remainingSpaceAtStart() == this.endlength) {
                console.log("equals")
                // Add checksums of files at the end of the disk
                res += Array(this.remainingSpaceAtStart()).map((value, index) => (index + this.emptyptr) * fileendindex).reduce((a, b) => a+b, 0)
                // this.checkstring += fileendindex.toString().repeat(this.remainingSpaceAtStart())
                this.checkstring = this.checkstring.concat(new Array(+this.remainingSpaceAtStart()).fill(fileendindex.toString()))

                this.endlength = this.endlength - this.remainingSpaceAtStart()
                this.updateEndPointers(2) // Move the end pointer past the empty space to a new file
                fileendindex--;
                // Add checksums of file that the startpointer is pointing to
                this.emptyptr += this.remainingSpaceAtStart()
                this.updateStartPointers()
                // TODO: this is suspicious... does this need to use FileEndIndex instead?
                if (this.startptr == this.endptr) {
                    res += Array(this.endlength).map((value, index) => (index + this.startptramount) * fileindex).reduce((a, b) => a+b, 0)
                    // this.checkstring += fileindex.toString().repeat(this.startlength)
                    this.checkstring = this.checkstring.concat(new Array(+this.endlength).fill(fileindex.toString()))
                } else {
                    console.log("branch")
                    res += Array(this.startlength).map((value, index) => (index + this.startptramount) * fileindex).reduce((a, b) => a+b, 0)
                    // this.checkstring += fileindex.toString().repeat(this.startlength)
                    this.checkstring = this.checkstring.concat(new Array(+this.startlength).fill(fileindex.toString()))

                    this.emptyptr += this.startlength
                }
                this.updateStartPointers()
                fileindex++;
            } else { // this.remainingspaceatstart() > this.endlength
                console.log("more")
                // Add checksums of files at the end of the disk
                res += Array(this.endlength).map((value, index) => (index + this.emptyptr) * fileendindex).reduce((a, b) => a+b, 0)
                this.emptyptr += this.endlength
                //this.checkstring += fileendindex.toString().repeat(this.endlength)
                this.checkstring = this.checkstring.concat(new Array(+this.endlength).fill(fileendindex.toString()))
                
                console.log(this.startptr, this.endptr, this.remainingSpaceAtStart(), this.startlength, this.endlength)
                this.updateEndPointers(2) // Move the end pointer past the empty space to a new file
                fileendindex--;
            }
        }

        console.log(this.startptr, this.endptr, this.remainingSpaceAtStart(), this.endlength)
        console.log(this.checkstring)
        return res;
    }
}

function arrayequals(a: string[], b: string[]) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
      
        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.
        // Please note that calling sort on an array will modify that array.
        // you might want to clone your array first.
      
        for (var i = 0; i < a.length; ++i) {
          console.log(i)  
          if (a[i] !== b[i]) return false;
        }
        return true;
}


function A() {
    const data = readFileSync('./input/test.txt', 'utf-8')
    const a = new DiskMapOptimizer(data)
    const b = new DiskMapOptimizer2(data)
    
    a.optimize()
    console.log(b.optimize())
    console.log(arrayequals(a.fileblocks.slice(0, a.fileblocks.length), b.checkstring))
    console.log(a.fileblocks.slice(a.fileblocks.length-10))
    console.log(b.checkstring.slice(b.checkstring.length-10))
}

A()
