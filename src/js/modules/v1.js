// import moment from 'moment'
//import Canvasizer from "../modules/canvasizer"
import GoogleMapsLoader from 'google-maps';
import mapstyles from '../modules/mapstyles.json'
import L from 'leaflet/dist/leaflet-src' // Check it out... https://blog.webkid.io/rarely-used-leaflet-features/ '../modules/leaflet/dist/leaflet-src'
import '../modules/Leaflet.GoogleMutant.js'
import * as plotty from 'plotty'
var GeoTIFF = require('geotiff/dist/geotiff.bundle.js');
var parse_georaster = require("georaster");
var GeoRasterLayer = require("georaster-layer-for-leaflet");


export class Smoke {

	constructor() {

		var self = this

        this.map = null

        this.settings = {}

        this.settings.latitude = -27

        this.settings.longitude = 133.772541

        this.settings.zoom = 4

        this.settings.geotiff = "<%= path %>/assets/test.tif"

        this.settings.bbox = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[125.80000000000001, -1.000000048],[194.2, -1.000000048],[194.2, -52.2],[125.80000000000001, -52.2],[125.80000000000001, -1.000000048]]]
            }
        }

        this.googleizer()

	} 

    googleizer() {

        var self = this

        GoogleMapsLoader.KEY = 'AIzaSyD8Op4vGvy_plVVJGjuC5r0ZbqmmoTOmKk';
        GoogleMapsLoader.REGION = 'AU';
        GoogleMapsLoader.load(function(google) {
            self.initMap()
        });

    }

    initMap() {

        var self = this

        this.map = new L.Map('map', { 
            renderer: L.canvas(),
            center: new L.LatLng(self.settings.latitude, self.settings.longitude), 
            zoom: self.settings.zoom,
            scrollWheelZoom: false,
            dragging: true,
            zoomControl: true,
            doubleClickZoom: true,
            zoomAnimation: true
        })

        var styled = L.gridLayer.googleMutant({

            type: 'roadmap',

            styles: mapstylež

        }).addTo(self.map);

    }

    resize() {

        var self = this

        window.addEventListener("resize", function() {

            clearTimeout(document.body.data)

            document.body.data = setTimeout( function() { 

                console.log("Resized")

            }, 200);

        });

        window.addEventListener("orientationchange", function() {
            
            console.log("orientationchange")
            
        }, false);

    }

}