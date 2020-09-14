let checkIsSilkCar = function checkIsSilk(code) {
    if (code && (code.length === 10 || code.length === 11)) {
        return true
    } else {
        return false
    }
}
let checkIsSilk = function checkIsSilk(code) {
    if (code && (code.length === 14)) {
        return true
    } else {
        return false
    }
}

let checkMachine = function checkIsSilk(code) {
    if (code && code.indexOf(',')!= -1) {
        return true
    } else {
        return false
    }
}
let checkIsTemBox = function checkIsSilk(code) {
    if (code && code.indexOf('/')!=-1) {
        return true
    } else {
        return false
    }
}


export default {
    checkIsSilkCar ,checkIsSilk ,checkMachine,checkIsTemBox
}
