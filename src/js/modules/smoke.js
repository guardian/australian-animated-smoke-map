// import moment from 'moment'
//import Canvasizer from "../modules/canvasizer"
import * as d3 from 'd3'
import GoogleMapsLoader from 'google-maps';
import mapstyles from '../modules/mapstyles.json'
import L from 'leaflet/dist/leaflet-src' // Check it out... https://blog.webkid.io/rarely-used-leaflet-features/ '../modules/leaflet/dist/leaflet-src'
import '../modules/Leaflet.GoogleMutant.js'
import '../modules/L.CanvasOverlay.js'
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

        var geojsonLayer =  L.geoJSON(self.settings.bbox).addTo(self.map);

        self.map.fitBounds(geojsonLayer.getBounds());

        this.render().then( (data) => {

            self.database = data

            self.setup()

        })

    }

    setup() {

        var self = this

        self.canvas = document.createElement('canvas');
        self.context = self.canvas.getContext("2d");
        self.canvas.id     = "SmokeLayer";
        self.canvas.width  = self.database.width;
        self.canvas.height = self.database.height;
        document.body.appendChild(self.canvas);

        var smokeMap = function() {

            this.onLayerDidMount = function (){      
                // prepare custom drawing    
            };

            this.onLayerWillUnmount  = function(){
                // custom cleanup    
            };

            this.setData = function (data={}) {

                this.needRedraw();

            };

            this.onDrawLayer = function (params) {

                /*
                canvas   : <canvas>,
                bounds   : <bounds in WGS84>
                size     : <view size>,
                zoomScale: <zoom scale is  1/resolution>,
                zoom     : <current zoom>,
                options  : <options passed >
                */

                //var dot = self.map.latLngToContainerPoint([d[0], d[1]]);

                var ctx = params.canvas.getContext('2d');
                ctx.globalAlpha = 0.5;
                /*
                Source image origin (small canvas)
                */
                var sx = 0
                var sy = 0
                var sw = self.database.width
                var sh = self.database.height

                /*
                Position of map canvas we are rendering to
                */
                var nw = params.layer._map.latLngToContainerPoint([-1.000000048,125.80000000000001]);
                var se = params.layer._map.latLngToContainerPoint([-52.2,194.2])   

                /*
                Coordinates of desination canvas
                */
                var dx = nw.x
                var dy = nw.y
                var dw = se.x - nw.x
                var dh = se.y - nw.y
                var width = se.x - nw.x
                var height = se.y - nw.y

                // select canvas elements
                var sourceCanvas = document.getElementById("SmokeLayer");

                //copy canvas by DataUrl
                var sourceImageData = sourceCanvas.toDataURL("image/png");

                var destinationImage = new Image;

                destinationImage.onload = function(){
                    ctx.clearRect(0, 0, width, height);
                    ctx.drawImage(destinationImage, sx, sy, sw, sh, dx, dy, dw, dh); 
                };

                destinationImage.src = sourceImageData;

            }

        }
          
        smokeMap.prototype = new L.CanvasLayer(); 
          
        this.smokie = new smokeMap();

        this.smokie.addTo(self.map);

        self.interval = setInterval(function(){ self.generate(); }, 1000);

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

        var cleaned = values.map( item => (item).toFixed(20) * 100000000)

        var min = d3.min(cleaned)

        var max = d3.max(cleaned)

        console.log(`Domain: ${min}, ${max}`)

        return  { data : cleaned, width : tiffWidth, height : tiffHeight, domain : [min,max] }

    }

    generate() {

        var self = this

        console.log(`Band: ${self.settings.current}`)

        this.context.clearRect(0, 0, self.database.width, self.database.height);

        var plot = new plotty.plot({
          canvas: self.canvas,
          data: self.database.data,
          width: self.database.width,
          height: self.database.height,
          domain: self.database.domain,
          colorScale: "viridis"
        });

        plot.render();

        this.smokie.setData()

        self.settings.current = (self.settings.current < self.settings.max ) ? self.settings.current + 1 : 0 ;

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