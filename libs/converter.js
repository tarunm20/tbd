const fs = require("fs");
const path = require('path');
const csv = require("csvtojson");
const pixels = require('image-pixels')
const getPixels = require("get-pixels")


// Generate Buffer data for a given file
function readFile(file) {
    return new Promise((resolve, reject) => {
        let chunks = [];
        // Create a readable stream
        let readableStream = fs.createReadStream(file);
    
        readableStream.on('data', chunk => {
            chunks.push(chunk);
        });

        readableStream.on('error', err => {
            reject(err)
        })
    
        return readableStream.on('end', () => {
            resolve(chunks);
        });
    });
}

// Find all directories within a given path
function getDirectories(start_path) {
    return fs.readdirSync(start_path, {withFileTypes: true})
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
}

// Generate Buffer data for all files in a given path
function convertDirectory(start_path) {
    return new Promise((resolve, reject) => {
        fs.readdir(start_path, (err, files) => {
            if (err) {
                reject(err);
            } else {
                let dirFiles = {};
                files.forEach(file => {
                    let convFile = readFile(path.join(start_path,file))
                        .then(res => {
                            return res;
                        })
                        .catch(err => {return err;})
                    dirFiles[file] = convFile
                });
                resolve(dirFiles);
            }
        });
    })

}

// csv()
//     .fromFile("/Users/tarunmurugan/Documents/Code/Javascript/Projects/tbd/test_dataset/Training_Set/Training_Set/RFMiD_Training_Labels.csv")
//     .then(obj => {console.log(obj)})

var file = readFile("/Users/tarunmurugan/Documents/Code/Javascript/Projects/tbd/test_dataset/Training_Set/Training_Set/Training/1.png")
    .then(res => {
        return Buffer.concat(res)
    })
    .then(data => {
        getPixels("https://storage.cloud.google.com/tbd_testing_bucket/1.png?authuser=1", (err, pixels) => {
            if (err) {
                console.log(err);
            } else {
                console.log(pixels)
            }
        })
        // var img_data = pixels(data)
        //     .then(pixel_data => {return pixel_data;})
        // img_data.then(rgb => console.log(rgb))
        
    })

