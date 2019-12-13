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


        // "test@1" * 100000000
        /*
        "test@1" * 100000000 AND
        "test@2" * 100000000 AND
        "test@3" * 100000000 AND
        "test@4" * 100000000 AND
        "test@5" * 100000000 AND
        "test@6" * 100000000 AND
        "test@7" * 100000000 AND
        "test@8" * 100000000 AND
        "test@9" * 100000000 AND
        "test@10" * 100000000 AND
        "test@11" * 100000000 AND
        "test@12" * 100000000 AND
        "test@13" * 100000000 AND
        "test@14" * 100000000 AND
        "test@15" * 100000000 AND
        "test@16" * 100000000 AND
        "test@17" * 100000000 AND
        "test@18" * 100000000 AND
        "test@19" * 100000000 AND
        "test@20" * 100000000 AND
        "test@21" * 100000000 AND
        "test@22" * 100000000 AND
        "test@23" * 100000000 AND
        "test@24" * 100000000 AND
        "test@25" * 100000000 AND
        "test@26" * 100000000 AND
        "test@27" * 100000000 AND
        "test@28" * 100000000 AND
        "test@29" * 100000000 AND
        "test@30" * 100000000
        */
    