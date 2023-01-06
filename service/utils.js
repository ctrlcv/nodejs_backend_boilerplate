exports.isEmpty = function(value) {
    if (value == "" || value == null || value == undefined ||
        (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return true
    }

    return false
};

exports.isNull = function(value) {
    if (value === null || value === undefined) {
        return true
    }

    return false
};

exports.pad = function(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

exports.bin2String = function(input) {
    var result = "";
    var array = new Uint8Array(input);

    for (var i = 0; i < array.length; i++) {
        if (array[i] === 0x00) {
            array[i] = 0x20;
        }
        result += String.fromCharCode(parseInt(array[i]));
    }

    return result;
}

exports.String2bin = function(str) {
    var codes = {},
    output = [];

    for (var i = 0; i < 256; i++) {
        codes[String.fromCharCode(i)] = i;
    }

    for (var i = 0; i < str.length; i++){
        output.push(codes[str[i]]);
    }

    return output;
}

exports.BytesToInt16 = function (array) {
    let retnumber
        = ((array[0] & 0x000000ff) |
           ((array[1] & 0x000000ff) << 8));

    return signedToUnsigned(retnumber);
};

exports.Int16ToBytes = function (number) {
    let arr = [];

    arr[1] = (number & 0x0000ff00) >> 8;
    arr[0] = (number & 0x000000ff);

    return arr;
}

exports.BytesToInt32 = function(array) {
    let retnumber
            = ((array[0]) |
               (array[1] << 8) |
               (array[2] << 16) |
               (array[3] << 24));

    return signedToUnsigned(retnumber);
};

exports.Int32ToBytes = function(number) {
    let arr = [];

    arr[3] = (number & 0xff000000) >> 24;
    arr[2] = (number & 0x00ff0000) >> 16;
    arr[1] = (number & 0x0000ff00) >> 8;
    arr[0] = (number & 0x000000ff);

    return arr;
}

function signedToUnsigned(arg) {
    return (arg >>>= 0);
}

exports.numberPad = function(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

exports.printTimeStamp = function() {
    const date = new Date();
    const dateToTimeStamp = date.getTime();
    let resultStr = date.getFullYear() + '-' +
                    this.numberPad((date.getMonth() + 1), 2) + '-' +
                    this.numberPad(date.getDate(), 2) + ' ' +
                    this.numberPad(date.getHours(),2) + ':' +
                    this.numberPad(date.getMinutes(),2) + ':' +
                    this.numberPad(date.getSeconds(),2) + '.' +
                    this.numberPad(date.getMilliseconds(), 3);

    console.log('[TIMESTAMP] ' + resultStr + ' [' + dateToTimeStamp + ']');
}
