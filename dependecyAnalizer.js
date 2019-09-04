const fs = require('fs');
const os = require('os');
const fetch = require("node-fetch");
const path = './websites.csv';

let totalDependencies = {};
let pagesLength = [];
let pagesDependencies = [];
let dependenciesPerPage = [];

readFile(path).then(async (csvLines) => {
    const pages = csvLines.map(async (elem) => {
        const line = elem.split(',');
        const page = await getPage(line[1].trim());
        const lengthOfPage = getLengthOfPage(page);
        const dependencies = getDependencies(page);
       
        pagesLength.push(line[0]+', '+lengthOfPage);
        
        for (let index = 0; index < dependencies.length; index++) {            
            dependenciesPerPage.push(line[0]+', '+dependencies[index]);            
        }

        pagesDependencies[line[0]] = dependencies;
        dependencies.forEach(dependency => {
            if (totalDependencies.hasOwnProperty(dependency)) {
                totalDependencies[dependency] += 1;
            } else {
                totalDependencies[dependency] = 1;
            }
        });
    });

    await Promise.all(pages);
    console.log('Lenght:');
    printLength(pagesLength.slice(','));
    console.log(' ');
    console.log('Dependencies:');
    printDependencies(dependenciesPerPage.slice(','));
    console.log(' ');
    console.log('Frequency:');
    printTotalDependencies(totalDependencies);    
});

function printLength(pagesLength){
    pagesLength.forEach(element => {
        console.log(element);
    });
}

function printDependencies(pagesDependencies){
    pagesDependencies.forEach(element => {
        console.log(element);
    });
}

function printTotalDependencies(totalDependencies){
    for (var [key, value] of Object.entries(totalDependencies)) {
        console.log(key.toString(), value.toString());
    }    
}

function readFile(path) {
    return new Promise(resolve => {
        fs.readFile(path, function (err, data) {
            resolve(data.toString().split(/\n/g));
        });
    });
}

const getPage = async (dir) => {
    if (isLocalFile(dir)) {
        return await localFile(dir);
    } else {
        return await urlFile(dir);
    }
}

const isLocalFile = (pathFile) => {
    if ((pathFile.trim().charAt(0) == '~') || (pathFile.trim().charAt(0) == '.')) {
        return true;
    }
}

const localFile = async (pathFile) => {
    if (isWin) {
        pathFile = pathFile.replace(/~/g, '.'); // If OS is win replaces char to find the file
    }
    return new Promise(resolve => {
        fs.readFile(pathFile, function (err, data) {
            resolve(data.toString());
        });
    });
}

const urlFile = async (pathFile) => {
    const res = await fetch(pathFile);
    return await res.text();
}

const isWin = () => {
    if (os.platform().charAt(0) == 'w') {
        return true;
    }
}

const getLengthOfPage = (str) => {
    var s = str.length;
    for (var i = str.length - 1; i >= 0; i--) {
        var code = str.charCodeAt(i);
        if (code > 0x7f && code <= 0x7ff) s++;
        else if (code > 0x7ff && code <= 0xffff) s += 2;
        if (code >= 0xDC00 && code <= 0xDFFF) i--;
    }
    return s;
}

const getDependencies = (page) => {
    const fileLine = page.split(/\n/g);
    return fileLine.filter(element => isDependency(element)).map(element => cleanLine(element));
}

const isDependency = (line) => {
    const regExp = /<script.*><\/script>/i;
    const dependency = line.match(regExp);
    if (dependency !== null) {
        return true;
    }
}

const cleanLine = (line) => {
    line = line.replace('<script src="', '').replace('"></script>', '').replace(/\?.*/,'').replace(/\r/, '');
    const splitLine = line.split('/');
    return splitLine.pop();
}
