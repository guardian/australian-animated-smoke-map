import * as d3 from 'd3'
const GeoTIFF = require('geotiff/dist/geotiff.bundle.js');

export default class Canvasizer {

	constructor(path) {

		var self = this

		this.path = path

	}

	async render() {

		var self = this

		var tiff = await fetch(self.path)
		  .then(response => response.arrayBuffer())
		  .then(buffer => GeoTIFF.fromArrayBuffer(buffer))

		var image = await tiff.getImage();

	    var tiffWidth = await image.getWidth();

	    var tiffHeight = await image.getHeight();

	    var values = (await image.readRasters())[0]

	    var cleaned = values.map( item => (item).toFixed(20))

	    /*

		var contours = d3.contours()
		    .size([tiffWidth, tiffHeight])
		    .smooth(false)
		    .thresholds(20)

		var data = Array.from(contours(cleaned), d => d)

		*/

		return  { data : cleaned, width : tiffWidth, height : tiffHeight }

	}

}

