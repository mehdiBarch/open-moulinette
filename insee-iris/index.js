"use strict";


var fs =  require("fs");
var glob = require("glob");
var csv = require('csv-parser');
var shapefile = require('shapefile');


// var departement = 'departement_CC_lambert.csv';

// var dep = fs.createReadStream(departement).pipe(csv({separator: ','}));

// var CC = 45; // CC is the number of the lamber projection 
// var deltaX = 4177302.562212417;
// var deltaY = 1297500.1046884255; 




var output = fs.createWriteStream("output.geojson");
output.write("[");

// fs.createReadStream('data/iris-france.zip').pipe(unzip.Extract({ path: 'data/iris-france' }))

// var readStream = fs.createReadStream('data/iris-france.zip');

// readStream.pipe(unzip.Parse()).pipe().on('entry', function (entry) {console.log(entry.path);});

// fs.createReadStream('data/iris-france.zip').pipe(unzip.Parse()).on('entry', function (entry) {var fileName = entry.path;console.log('fileName');});
 
var Zip = require('node-7z'); // Name the class as you want!
var myTask = new Zip();

var compteur = 0;

myTask.extractFull('data/CONTOURS-IRIS_1-0__SHP_LAMB93_FXX_2013-01-01.7z', 'data/CONTOURS-IRIS_1-0__SHP_LAMB93_FXX_2013-01-01')
// Equivalent to `on('data', function (files) { // ... });`
.progress(function (file) {
  file.forEach(function(fileName) {
    if (/\.shp$/.test(fileName)) {
        compteur++;
    } 
  })
})
// When all is done
.then(function () {
  console.log('Extracting done!');
  console.log(compteur);
})
// On error
.catch(function (err) {
  console.error(err);
})

glob('data/CONTOURS-IRIS_1-0__SHP_LAMB93_FXX_2013-01-01/CONTOURS-IRIS_1-0__SHP_LAMB93_FXX_2013-01-01/CONTOURS-IRIS/1_DONNEES_LIVRAISON_2014-06-00379/*/*/*.shp', function(err, shapefiles) {
  shapefiles.forEach(function(file){
    
    var reader = shapefile.reader(file)
    reader.readHeader(function(error, header) {
      if (error) throw error;
      readNextRecord();
    }); 

    function readNextRecord() {
        reader.readRecord(function(error, record) {
          if (error) {
            console.log("error file : ", file)
            throw error;
          }
          if (record === shapefile.end) {
            output.write("]");
            console.log("end of file :", file);
            return reader.close();
          } else {
            var coord = record.geometry.coordinates[0];
            var newCoord = coord.map(function(c) {
              var lonlat = lw.toLonLat(c[0], c[1]);
              return [lonlat.lon, lonlat.lat];
            });
            record.geometry.coordinates = [newCoord];
            output.write(JSON.stringify(record));
            output.write(",");
          };
          setImmediate(readNextRecord);
        });
    }
    console.log(shapefiles)
  })

});

// fs.createReadStream('data/iris-france.zip')
//   .pipe(unzip.Parse())
  // .on('entry', function (entry) {
  //   var fileName = entry.path;
  //   var type = entry.type; // 'Directory' or 'File'
  //   var size = entry.size;
  //   console.log(fileName);
  //   // if (fileName === "this IS the file I'm looking for") {
  //   //   entry.pipe(fs.createWriteStream('output/path'));
  //   // } else {
  //   //   entry.autodrain();
  //   // }
  // });




// 		var reader = shapefile.reader(file)
// 		reader.readHeader(function(error, header) {
// 		  if (error) throw error;
// 		  readNextRecord();
// 		});	

// 		function readNextRecord() {
// 		  	reader.readRecord(function(error, f) {
// 			    if (error) {
// 			    	console.log("error file : ", file)
// 			    	throw error;
// 			    }
// 			    if (record === shapefile.end) {
// 			    	output.write("]");
// 			    	console.log("end of file :", file);
// 			    	return reader.close();
// 			    } else {
// 			    	var coord = record.geometry.coordinates[0];
// 			    	var newCoord = coord.map(function(c) {
// 			    		var lonlat = lw.toLonLat(c[0], c[1]);
// 			    		return [lonlat.lon, lonlat.lat];
// 			    	});
// 			    	record.geometry.coordinates = [newCoord];
// 			    	output.write(JSON.stringify(record));
// 			    	output.write(",");
// 			    };
// 			    setImmediate(readNextRecord);
// 	  		});
// 		}
// 		console.log(shapefiles)
// })

// });




// testing

// dep.forEach(function(value, key){
// 	o[key] = value;
// });

// for(key in dep) {
//     if(data.hasOwnProperty(key)) {
//         var CC = data[key];
        
//     }
// }


// Object.keys(dep).map(function(key){
// 	return dep[keyIris]
// });

// readStream.forEach(function(value, key) { console.log(key); });

