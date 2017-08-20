var fields = [];
var map;

require([
    "dojo/dom",
    "dojo/on",
    "esri/map",
    "esri/graphic",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",
    "esri/InfoTemplate",
    "esri/layers/FeatureLayer",
    "esri/toolbars/draw",
    "esri/tasks/query",
    "dojo/domReady!"
], function (
    dom,
    on,
    Map,
    Graphic,
    SimpleFillSymbol,
    SimpleLineSymbol,
    Color,
    InfoTemplate,
    FeatureLayer,
    Draw,
    Query,
    Ready
) {
        map = new Map("map", {
            basemap: "gray-vector",
            center: [133.25, -24.15],
            zoom: 3
        });


        loading = dom.byId("loadingImg");

        on(map, "update-start", showLoading);
        on(map, "update-end", hideLoading);

        function showLoading() {
            esri.show(loading);
            //map.disableMapNavigation();
            map.hideZoomSlider();
        }

        function hideLoading(error) {
            esri.hide(loading);
            //map.enableMapNavigation();
            map.showZoomSlider();
        }

        var aus = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/1", {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
        });
        var ste = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/18", {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
        });
        var sa4 = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/15", {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
        });
        var sa3 = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/14", {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
        });
        var sa2 = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/13", {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
        });
        var sa1 = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/12", {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
        });
        var ssc = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/17", {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
        });
        var poa = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/11", {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
        });
        var gccsa = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/4", {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
        });
        var ced = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/2", {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
        });
        var sed = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/16", {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
        });
        var lga = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/8", {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
        });


        var currentSelection;
        var currentLayer;
        drawToolbar = new Draw(map);
        drawToolbar.on('draw-complete', function (e) {

            drawToolbar.deactivate();
            var query = new Query();
            query.geometry = e.geometry;

            currentLayer.selectFeatures(query);
            currentSelection = query;

        });
        var selectionSymbol = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([255, 0, 0]), 4),
            new Color([255, 0, 0, 0.6])
        );
        aus.setSelectionSymbol(selectionSymbol);
        ste.setSelectionSymbol(selectionSymbol);
        sa4.setSelectionSymbol(selectionSymbol);
        sa3.setSelectionSymbol(selectionSymbol);
        sa2.setSelectionSymbol(selectionSymbol);
        sa1.setSelectionSymbol(selectionSymbol);
        ssc.setSelectionSymbol(selectionSymbol);
        poa.setSelectionSymbol(selectionSymbol);
        gccsa.setSelectionSymbol(selectionSymbol);
        ced.setSelectionSymbol(selectionSymbol);
        sed.setSelectionSymbol(selectionSymbol);
        lga.setSelectionSymbol(selectionSymbol);


        map.addLayer(aus);
        map.addLayer(ste);
        map.addLayer(sa4);
        map.addLayer(sa3);
        map.addLayer(sa2);
        map.addLayer(sa1);
        map.addLayer(ssc);
        map.addLayer(poa);
        map.addLayer(gccsa);
        map.addLayer(ced);
        map.addLayer(sed);
        map.addLayer(lga);

        //aus.hide();current
        currentLayer = aus;
        ste.hide();
        sa4.hide();
        sa3.hide();
        sa2.hide();
        sa1.hide();
        ssc.hide();
        poa.hide();
        gccsa.hide();
        ced.hide();
        sed.hide();
        lga.hide();



        on(dom.byId('drawPolygon'), 'click', function () {
            clearSelectedAreas();
            drawToolbar.activate(Draw.POLYGON);
        });
        on(dom.byId('drawRectangle'), 'click', function () {
            clearSelectedAreas();
            drawToolbar.activate(Draw.RECTANGLE);
        });
        on(dom.byId('drawPoint'), 'click', function () {
            clearSelectedAreas();
            drawToolbar.activate(Draw.POINT);
        });

        function zoomLevel(e) {
            var code;
            switch (e) {
                case '0':
                    map.setZoom(4);
                    break;
                case '1':
                    map.setZoom(4);
                    break;
                case '2':
                    map.setZoom(4);
                    break;
                case '3':
                    map.setZoom(5);
                    break;
                case '4':
                    map.setZoom(9);
                    break;
                case '5':
                    map.setZoom(13);
                    break;
                case '6':
                    map.setZoom(13);
                    break;
                case '7':
                    map.setZoom(10);
                    break;
                case '8':
                    map.setZoom(4);
                    break;
                case '9':
                    map.setZoom(7);
                    break;
                case '10':
                    map.setZoom(7);
                    break;
                case '11':
                    map.setZoom(7);
                    break;
            }

        }

        on(dom.byId('selectLayer'), 'change', function (e) {
            //map.setZoom(16);
            //


            zoomLevel(e.target.value);
            if (e.target.value === 999) {
                return 0;
            }

            var layer;
            var layerID
            for (var i = 0; i < map.graphicsLayerIds.length; i++) {
                layerID = map.graphicsLayerIds[i];
                layer = map.getLayer(layerID);
                layer.setVisibility(false);
                layer.clearSelection();

            }
            layerID = map.graphicsLayerIds[e.target.value];
            layer = map.getLayer(layerID);
            layer.setVisibility(true);
            currentLayer = layer; //applies visible layer to current layer for selection query.
            // if (currentSelection != null) {
            //     layer.selectFeatures(currentSelection); //passes the selection to the new layer.
            //     console.log("current selection was passed to the new layer");
            // }
            // clearSelectedAreas();
            currentSelection = null;
            // addData();  
        });



        on(dom.byId('Reset'), 'click', function () {
            drawToolbar.deactivate();
            clearSelectedAreas();

        });


        on(dom.byId('getData'), 'click', function () {
            document.getElementById("getData").disabled = true;

            fields.length = 0;
            var layer = currentLayer;
            selection = layer.getSelectedFeatures();
            var code;
            //get the attributes for the first Object in the selected graphics
            //then search it for its CODE element. Take substring search result.
            //then build an array of all of those codes from the selected features.
            var layer;
            var layerID
            for (var i = 0; i < map.graphicsLayerIds.length; i++) {
                layerID = map.graphicsLayerIds[i];
                layer = map.getLayer(layerID);
                //console.log("this layer is number" + i + "and it is visible?" + layer.visible); 
                if (layer.visible) {
                    layerNum = i;
                }

            }
            code = getLayerAttributesGIS(layerNum);
            fields.push(code);
            //hard 1000 geo limit!
            for (var i = 0; i < selection.length && i < 1000; i++) {
                value = selection[i].attributes[code];
                fields.push(value);

            }
            document.getElementById("fieldsArr").value = fields;

            document.getElementById("getData").disabled = false;

        });

        function getLayerAttributesGIS(layerNum) {
            var code;
            switch (layerNum) {
                case 0:
                    code = "AUS_CODE_2016";
                    break;

                case 1:
                    code = "STATE_CODE_2016";
                    break;

                case 2:
                    code = "SA4_CODE_2016";
                    break;

                case 3:
                    code = "SA3_CODE_2016";
                    break;

                case 4:
                    code = "SA2_MAINCODE_2016";
                    break;

                case 5:
                    code = "SA1_7DIGIT_2016";
                    break;

                case 6:
                    code = "SSC_CENSUSCODE_2016";
                    break;

                case 7:
                    code = "POA_CENSUSCODE_2016";
                    break;

                case 8:
                    code = "GCCSA_CODE_2016";
                    break;

                case 9:
                    code = "CED_CENSUSCODE_2016";
                    break;

                case 10:
                    code = "SED_CENSUSCODE_2016";
                    break;

                case 11:
                    code = "LGA_CENSUSCODE_2016";
                    break;

            }
            return code;
        };

        function clearSelectedAreas() {
            var layer;
            var layerID
            for (var i = 0; i < map.graphicsLayerIds.length; i++) {
                layerID = map.graphicsLayerIds[i];
                layer = map.getLayer(layerID);
                layer.clearSelection();
            }
        }

    });