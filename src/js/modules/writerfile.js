var GeoTIFF = require('geotiff/dist/geotiff.bundle.js');
import { writeGeotiff } from './geotiffwriter.js';
import fs from "fs"
import Tiff from "tiff.js"

export default class Canvasizer {

	constructor(path) {

		var self = this

		this.path = path

	}

	async render() {

		var self = this

		// https://github.com/geotiffjs/geotiff.js/

		var tiff = await fetch(self.path)
				.then(response => response.arrayBuffer())
				.then(buffer => GeoTIFF.fromArrayBuffer(buffer))

		var image = await tiff.getImage();

		//console.log(JSON.stringify(image.fileDirectory))

		var origin = image.getOrigin();

		var resolution = image.getResolution();

		var bbox = image.getBoundingBox();

	    this.tiffWidth = await image.getWidth();

	    this.tiffHeight = await image.getHeight();

	    var values = (await image.readRasters())[0]

	    var seulav = values.map( item => (item) * 1000000000)

		var metadata = {
			"ImageWidth": 171,
			"ImageLength": 128,
			"ModelPixelScale": {
				"0": 0.39999999999999997,
				"1": 0.39999999962500005,
				"2": 0
			},
			"ModelTiepoint": {
				"0": 0,
				"1": 0,
				"2": 0,
				"3": 125.8,
				"4": -1.000000048,
				"5": 0
			}
		}


		var newtiff = await writeGeotiff(seulav, metadata);

		fs.writeFile("<%= path %>/assets/geo.tif", newtiff, function(err) {

		    if(err) {
		        return console.log(err);
		    }

		    console.log("The file was saved!");
		}); 


		return newtiff

	}

}

