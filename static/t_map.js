var map;

require([
    "dojo/on",
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/geometry/Extent",
    "esri/InfoTemplate",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/renderers/ClassBreaksRenderer",
    "esri/Color",
    "dojo/domReady!"
], function (
    on,
    Map,
    FeatureLayer,
    Extent,
    InfoTemplate,
    SimpleLineSymbol,
    SimpleFillSymbol,
    SimpleRenderer,
    ClassBreaksRenderer,
    Color
) {

        map = new Map("map", {
            basemap: "streets",
            center: [133.25, -24.15],
            zoom: 4
        });

        var infoTemplate = new InfoTemplate("${NAME}", "${*}");



        function get_feature_layer(thematic_region) {
            var layer;
            switch (String(thematic_region)) {
                case "AUS_CODE_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/1", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });

                    break;

                case "STATE_CODE_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/STATE/MapServer/1", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        id: thematic_region,
                        infoTemplate: infoTemplate
                    });

                    break;

                case "SA4_CODE_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/15", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });

                    break;

                case "SA3_CODE_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/14", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });

                    break;

                case "SA2_MAINCODE_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/13", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });

                    break;

                case "SA1_7DIGIT_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/12", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });

                    break;

                case "SSC_CENSUSCODE_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/17", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });

                    break;

                case "POA_CENSUSCODE_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/11", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });

                    break;

                case "GCCSA_CODE_2016;":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/4", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });

                    break;

                case "CED_CENSUSCODE_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/2", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });

                    break;

                case "SED_CENSUSCODE_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/16", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });

                    break;

                case "LGA_CENSUSCODE_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/8", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });

                    break;

            }
            return layer;
        }

        var featureLayer = get_feature_layer(thematic_region);

        var line = new SimpleLineSymbol();
        line.setWidth(1.5);
        line.setStyle(SimpleLineSymbol.SOLID);
        line.setColor(new Color([225, 0, 0, 0.5]));

        var symbol = new SimpleFillSymbol(null);
        symbol.setColor(new Color([1, 1, 1, 0.0]));
        symbol.setOutline(line);

        var stp = min_max[2]; //Even breaks to start with.

        var stp1 = 0;
        var stp2 = stp
        var stp3 = (stp * 2);
        var stp4 = (stp * 3);
        var stp5 = (stp * 4);
        var top = min_max[1]; //max returned val

        var ren = new ClassBreaksRenderer(symbol, findvalue)
        ren.addBreak(stp1, stp2, new SimpleFillSymbol().setColor(new Color([56, 168, 0, 0.5])));
        ren.addBreak(stp2 + 1, stp3, new SimpleFillSymbol().setColor(new Color([139, 209, 0, 0.5])));
        ren.addBreak(stp3 + 1, stp4, new SimpleFillSymbol().setColor(new Color([255, 255, 0, 0.5])));
        ren.addBreak(stp4 + 1, stp5, new SimpleFillSymbol().setColor(new Color([255, 128, 0, 0.5])));
        ren.addBreak(stp5 + 1, top, new SimpleFillSymbol().setColor(new Color([254, 0, 0, 0.7])));

        // var ext_arr=[];

        function findvalue(graphic) {
            //console.log(graphic.geometry.getExtent());
            var cdx = graphic.attributes[thematic_region];
            var ext_arr = [];

            for (var i = 0; i < data.length; i++) {

                if (cdx.localeCompare(data[i][0]) == 0) {
                    var val = data[i][1];

                }
            }

            return val;
        }

        featureLayer.setRenderer(ren);
        map.addLayer(featureLayer);


        //We run this on the first time the map runs to zoom in to the extent
        //of the selected features
        var first = false;
        on(featureLayer, 'update-end', function () {
            if (first == true)
                return;
            var ext_arr = [];
            for (var i = 0; i < featureLayer.graphics.length; i++) {

                var graphic = featureLayer.graphics[i];
                var cdx = graphic.attributes[thematic_region];


                for (ii = 0; ii < data.length; ii++) {
                    if (cdx.localeCompare(data[ii][0]) === 0) {

                        ext = new Extent(graphic.geometry.getExtent());

                        ext_arr.push(ext);
                    }
                }
            }
            ext1 = ext_arr[0];
            for (j = 1; j < ext_arr.length; j++) {
                ext1 = ext1.union(ext_arr[j]);
            }
            map.setExtent(ext1.expand(1.25));
            first = true;
            document.getElementById("one_b").value = parseInt(stp1);
            document.getElementById("two_b").value = parseInt(stp2 + 1);
            document.getElementById("three_b").value = parseInt(stp3 + 1);
            document.getElementById("four_b").value = parseInt(stp4 + 1);
            document.getElementById("five_b").value = parseInt(stp5 + 1);

            document.getElementById("one_a").innerHTML = parseInt(stp2);
            document.getElementById("two_a").innerHTML = parseInt(stp3);
            document.getElementById("three_a").innerHTML = parseInt(stp4);
            document.getElementById("four_a").innerHTML = parseInt(stp5);
            document.getElementById("five_a").value = parseInt(top);

            document.getElementById("one_c").style.backgroundColor = "rgb(56, 168, 0)";
            document.getElementById("two_c").style.backgroundColor = "rgb(139, 209, 0)";
            document.getElementById("three_c").style.backgroundColor = "rgb(255, 255, 0)";
            document.getElementById("four_c").style.backgroundColor = "rgb(255, 128, 0)";
            document.getElementById("five_c").style.backgroundColor = "rgb(254, 0, 0)";

        });

        //This pulls off the current layer and the renderer and then updates
        //the breaks based on a users input!
        on(updateBreaks, 'click', function () {
            //console.log(map.graphicsLayerIds.length);
            l_id = map.graphicsLayerIds[0];
            
            layer = map.getLayer(l_id);
            map.removeLayer(layer);

            stp1 = parseFloat(document.getElementById("one_b").value);
            stp2 = parseFloat(document.getElementById("two_b").value);
            stp3 = parseFloat(document.getElementById("three_b").value);
            stp4 = parseFloat(document.getElementById("four_b").value);
            stp5 = parseFloat(document.getElementById("five_b").value);
            top = parseFloat(document.getElementById("five_a").value);

            //the minus one is a correct just to make the breaks not match up.
            document.getElementById("one_a").innerHTML = parseInt(stp2-1); 
            document.getElementById("two_a").innerHTML = parseInt(stp3-1);
            document.getElementById("three_a").innerHTML = parseInt(stp4-1);
            document.getElementById("four_a").innerHTML = parseInt(stp5-1);
            document.getElementById("five_a").value = parseInt(top);

            var ren = new ClassBreaksRenderer(symbol, findvalue)
            ren.addBreak(stp1, stp2, new SimpleFillSymbol().setColor(new Color([56, 168, 0, 0.5])));
            ren.addBreak(stp2 + 1, stp3, new SimpleFillSymbol().setColor(new Color([139, 209, 0, 0.5])));
            ren.addBreak(stp3 + 1, stp4, new SimpleFillSymbol().setColor(new Color([255, 255, 0, 0.5])));
            ren.addBreak(stp4 + 1, stp5, new SimpleFillSymbol().setColor(new Color([255, 128, 0, 0.5])));
            ren.addBreak(stp5 + 1, top, new SimpleFillSymbol().setColor(new Color([254, 0, 0, 0.7])));


            var fl = get_feature_layer(thematic_region);

            fl.setRenderer(ren);
            map.addLayer(fl);


        });



    });
