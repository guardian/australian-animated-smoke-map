// import moment from 'moment'
//import Canvasizer from "../modules/canvasizer"
import * as d3 from 'd3'
import GoogleMapsLoader from 'google-maps';
import mapstyles from '../modules/mapstyles.json'
import L from 'leaflet/dist/leaflet-src' // Check it out... https://blog.webkid.io/rarely-used-leaflet-features/ '../modules/leaflet/dist/leaflet-src'
import '../modules/Leaflet.GoogleMutant.js'
import * as plotty from 'plotty'
var GeoTIFF = require('geotiff/dist/geotiff.bundle.js');
import 'geotiff-layer-leaflet/dist/geotiff-layer-leaflet';
import 'geotiff-layer-leaflet/src/geotiff-layer-leaflet-plotty';
import 'geotiff-layer-leaflet/src/geotiff-layer-leaflet-vector-arrows';

export class Smoke {

    constructor() {

        var self = this

        this.map = null

        this.settings = {}

        this.settings.latitude = -27

        this.settings.longitude = 133.772541

        this.settings.zoom = 4

        this.settings.current = 0

        this.settings.max = 20

        this.settings.geotiff = "<%= path %>/assets/boom.tif"

        this.settings.bbox = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[125.80000000000001, -1.000000048],[194.2, -1.000000048],[194.2, -52.2],[125.80000000000001, -52.2],[125.80000000000001, -1.000000048]]]
            }
        }

        this.googleizer()

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

        var myCanvas = L.canvas();

        var styled = L.gridLayer.googleMutant({

            type: 'roadmap',

            styles: mapstyles

        }).addTo(self.map);

        var geojsonLayer =  L.geoJSON(self.settings.bbox) //.addTo(self.map);

        self.map.fitBounds(geojsonLayer.getBounds());

        this.render().then( (data) => {

            self.database = data

            self.rendered() 

            self.setup()

        })

        

        this.interval = setInterval(function(){ self.generate(); }, 1000);

        // "test@1" * 100000000
        /*
        "test@1" * 10000000 AND
        "test@2" * 10000000 AND
        "test@3" * 10000000 AND
        "test@4" * 10000000 AND
        "test@5" * 10000000 AND
        "test@6" * 10000000 AND
        "test@7" * 10000000 AND
        "test@8" * 10000000 AND
        "test@9" * 10000000 AND
        "test@10" * 10000000 AND
        "test@11" * 10000000 AND
        "test@12" * 10000000 AND
        "test@13" * 10000000 AND
        "test@14" * 10000000 AND
        "test@15" * 10000000 AND
        "test@16" * 10000000 AND
        "test@17" * 10000000 AND
        "test@18" * 10000000 AND
        "test@19" * 10000000 AND
        "test@20" * 10000000 AND
        "test@21" * 10000000 AND
        "test@22" * 10000000 AND
        "test@23" * 10000000 AND
        "test@24" * 10000000 AND
        "test@25" * 10000000 AND
        "test@26" * 10000000 AND
        "test@27" * 10000000 AND
        "test@28" * 10000000 AND
        "test@29" * 10000000 AND
        "test@30" * 10000000
        */

    }

    setup() {

        var self = this

        self.canvas = document.createElement('canvas');
        self.context = self.canvas.getContext("2d");
        self.canvas.id     = "SmokeLayer";
        self.canvas.width  = self.database.width;
        self.canvas.height = self.database.height;
        document.body.appendChild(self.canvas);
        self.generate()

    }

    async render() {

        var self = this

        var tiff = await fetch(self.settings.geotiff)
          .then(response => response.arrayBuffer())
          .then(buffer => GeoTIFF.fromArrayBuffer(buffer))

        var image = await tiff.getImage();

        var tiffWidth = await image.getWidth();

        var tiffHeight = await image.getHeight();

        var values = (await image.readRasters())[0]

        var cleaned = values.map( item => (item).toFixed(20) * 1)

        var min = d3.min(cleaned)

        var max = d3.max(cleaned)

        console.log(`Domain: ${min}, ${max}`)

        return  { data : cleaned, width : tiffWidth, height : tiffHeight, domain : [min,max] }

    }

    generate() {

        var self = this

        console.log(self.settings.current)

        this.context.clearRect(0, 0, self.database.width, self.database.height);

        var canvas = self.canvas

        var plot = new plotty.plot({
          canvas,
          band: self.settings.current,
          data: self.database.data,
          width: self.database.width,
          height: self.database.height,
          domain: self.database.domain,
          colorScale: "viridis"
        });

        plot.render();

        self.settings.current = (self.settings.current < self.settings.max ) ? self.settings.current + 1 : 0 ;

    }

    rendered() {

        var self = this

        var options = { 
            band: 0,
            name: 'Smoke screen',
            opacity: .5,
            renderer: new L.LeafletGeotiff.Plotty({
                domain: self.database.domain,
                colorScale: 'viridis'
            })
        }

        self.smoke = new L.LeafletGeotiff(

            self.settings.geotiff, options

        ).addTo(self.map);

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

    googleizer() {

        var self = this

        GoogleMapsLoader.KEY = 'AIzaSyD8Op4vGvy_plVVJGjuC5r0ZbqmmoTOmKk';
        GoogleMapsLoader.REGION = 'AU';
        GoogleMapsLoader.load(function(google) {
            self.initMap()
        });

    }

}