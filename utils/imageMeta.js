'use strict';
const {ExifImage} = require('exif');

const getCoordinates = (imgFile) => { // imgFile = full path to uploaded image
    return new Promise((resolve, reject) => {
        try {
            // TODO: Use node-exif to get longitude and latitude from imgFile
            new ExifImage({image: imgFile}, function(error, exifData) {
                if (error) {
                    console.log('Exif Error: ' + error.message);
                    reject(error);
                } else {
                    console.log('exifData: ', exifData); // Do something with your data!
                    // coordinates below should be an array of GPS coordinates in decimal format: [longitude, latitude]

                    if(exifData.gps.GPSLongitude) {
                        const coordinates = [
                            gpsToDecimal(exifData.gps.GPSLongitude, exifData.gps.GPSLongitudeRef),
                            gpsToDecimal(exifData.gps.GPSLatitude, exifData.gps.GPSLatitudeRef),
                        ];
                        resolve(coordinates);
                    } else{
                        reject('ei gps dataa');
                    }
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

// convert GPS coordinates to decimal format
// for longitude, send exifData.gps.GPSLongitude, exifData.gps.GPSLongitudeRef
// for latitude, send exifData.gps.GPSLatitude, exifData.gps.GPSLatitudeRef
const gpsToDecimal = (gpsData, hem) => {
    let d = parseFloat(gpsData[0]) + parseFloat(gpsData[1] / 60) +
        parseFloat(gpsData[2] / 3600);
    return (hem === 'S' || hem === 'W') ? d *= -1 : d;
};

module.exports = {
    getCoordinates,
};