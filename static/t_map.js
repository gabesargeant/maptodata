var map;
var thematic_code_name;

var map_colors =
    [
        [56, 168, 0, 0.5],
        [139, 209, 0, 0.5],
        [255, 255, 0, 0.5],
        [255, 128, 0, 0.5],
        [254, 0, 0, 0.5],

        [237, 248, 251, 0.5],
        [178, 226, 226, 0.5],
        [102, 194, 164, 0.5],
        [44, 162, 95, 0.5],
        [0, 109, 44, 0.5],

        [255, 255, 178, 0.5],
        [254, 204, 92, 0.5],
        [253, 141, 60, 0.5],
        [240, 59, 32, 0.5],
        [189, 0, 38, 0.5],

        [252, 197, 192, 0.5],
        [250, 159, 181, 0.5],
        [247, 104, 161, 0.5],
        [197, 27, 138, 0.5],
        [122, 1, 119, 0.5],

        [44, 123, 182, 0.5],
        [171, 217, 233, 0.5],
        [255, 255, 191, 0.5],
        [253, 174, 97, 0.5],
        [215, 25, 28, 0.5],

        [141, 211, 199, 0.5],
        [255, 255, 179, 0.5],
        [190, 186, 218, 0.5],
        [251, 128, 114, 0.5],
        [128, 177, 211, 0.5],

        [247, 247, 247, 0.5],
        [204, 204, 204, 0.5],
        [150, 150, 150, 0.5],
        [99, 99, 99, 0.5],
        [37, 37, 37, 0.5]
    ];
require([
    "dojo/on",
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/geometry/Extent",
    "esri/InfoTemplate",
    "esri/symbols/TextSymbol",
    "esri/layers/LabelClass",
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
    TextSymbol,
    LabelClass,
    SimpleLineSymbol,
    SimpleFillSymbol,
    SimpleRenderer,
    ClassBreaksRenderer,
    Color
) {

        map = new Map("map", {
            basemap: "streets",
            center: [133.25, -24.15],
            zoom: 4,
            showLabels: true
        });

        //var infoTemplate = new InfoTemplate("${NAME}", "${*}");

        // var infoTemplate = new InfoTemplate("${NAME}", "${*}", ""
        // "The number of people that applied under the RRTA from ${country} is approximatley <u><b size=\"12\">" + "${count(*)}\n\
        // </b></u>for details on their case before the RRTA click the following button <br><br><center> \
        // <form action=\"search.php\" method=\"get\"> \
        // <input name=\"db\" value=\"RRTA\" type=\"hidden\" >\
        // <input name=\"country\" type=\"submit\" value=\"${name}\"/><form></center>",
        // );
        var infoTemplate = new InfoTemplate();
        infoTemplate.setTitle("Title"); //Standin
        infoTemplate.setContent(getInfoContent);

        function getInfoContent(graphic) {

            var name = graphic.attributes[thematic_code_name];
            infoTemplate.setTitle(name);

            var cdx = graphic.attributes[thematic_region];
            var val = "<br/>No Data available, Sorry!";
            for (var i = 0; i < data.length; i++) {

                if (cdx.localeCompare(data[i][0]) == 0) {
                    val = data[i][1];

                }
            }
            rtn_str = "<b>" + column[0] + " : " + real_column + "</b><br>" +
                "<br> The value of the selected area <b>" + name + "</b> is <b>" + val + "</b>\
            <br/><br><hr style=\"width:75%\">For reference: The area code that relates to this region is\
            <br/> <b>Region Code</b> : <b>" + cdx + "</b>";

            return rtn_str;

        };



        function get_feature_layer(thematic_region) {
            var layer;

            switch (String(thematic_region)) {
                case "AUS_CODE_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/1", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });
                    thematic_code_name = 'AUS_NAME_2016';
                    break;

                case "STATE_CODE_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/STATE/MapServer/1", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        id: thematic_region,
                        infoTemplate: infoTemplate
                    });
                    thematic_code_name = 'STATE_NAME_2016';
                    break;

                case "SA4_CODE_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/15", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });
                    thematic_code_name = 'SA4_NAME_2016';
                    break;

                case "SA3_CODE_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/14", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });
                    thematic_code_name = 'SA3_NAME_2016';
                    break;

                case "SA2_MAINCODE_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/13", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });
                    thematic_code_name = 'SA2_NAME_2016';
                    break;

                case "SA1_7DIGIT_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/12", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });
                    thematic_code_name = 'SA1_MAINCODE_2016';
                    break;

                case "SSC_CENSUSCODE_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/17", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });
                    thematic_code_name = 'SSC_NAME_2016';
                    break;

                case "POA_CENSUSCODE_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/11", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });
                    thematic_code_name = 'POA_NAME_2016';
                    break;

                case "GCCSA_CODE_2016;":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/4", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });
                    thematic_code_name = 'GCCSA_NAME_2016';
                    break;

                case "CED_CENSUSCODE_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/2", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });
                    thematic_code_name = 'CED_NAME_2016';
                    break;

                case "SED_CENSUSCODE_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/16", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });
                    thematic_code_name = 'SED_NAME_2016';
                    break;

                case "LGA_CENSUSCODE_2016":
                    layer = new FeatureLayer("https://geo.abs.gov.au/arcgis/rest/services/ASGS2016/SEARCH/MapServer/8", {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        outFields: ["*"],
                        infoTemplate: infoTemplate
                    });
                    thematic_code_name = 'LGA_NAME_2016';
                    break;

            }
            return layer;
        }

        var featureLayer = get_feature_layer(thematic_region);

        var line = new SimpleLineSymbol();
        line.setWidth(1.5);
        line.setStyle(SimpleLineSymbol.SOLID);
        line.setColor(new Color([225, 0, 0, 0.5]));

        var symbol = new SimpleFillSymbol();
        symbol = symbol.setOutline(line);

        var stp = min_max[2]; //Even breaks to start with.

        var stp1 = 0;
        var stp2 = stp
        var stp3 = (stp * 2);
        var stp4 = (stp * 3);
        var stp5 = (stp * 4);
        var top = min_max[1]; //max returned val

        var c1 = map_colors[0];
        var c2 = map_colors[1];
        var c3 = map_colors[2];
        var c4 = map_colors[3];
        var c5 = map_colors[4];

        var ren = new ClassBreaksRenderer(symbol, findvalue)
        ren.addBreak(stp1, stp2, new SimpleFillSymbol().setColor(new Color(c1)));
        ren.addBreak(stp2 + 1, stp3, new SimpleFillSymbol().setColor(new Color(c2)));
        ren.addBreak(stp3 + 1, stp4, new SimpleFillSymbol().setColor(new Color(c3)));
        ren.addBreak(stp4 + 1, stp5, new SimpleFillSymbol().setColor(new Color(c4)));
        ren.addBreak(stp5 + 1, top, new SimpleFillSymbol().setColor(new Color(c5)));

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

        //////////////////////////////
        var label_text = new TextSymbol().setColor((new Color("#000")));
        label_text.font.setSize("12pt");
        label_text.font.setFamily("arial");
        var json_label = {
            "labelExpressionInfo": { "value": "{" + thematic_code_name + "}" }
        };
        var labelClass = new LabelClass(json_label);
        labelClass.symbol = label_text;
        //Doesn't get set on the first one

        //Adding the renderer////
        featureLayer.setRenderer(ren);
        map.addLayer(featureLayer);

        //I run this on the first time the map runs to zoom in to the extent
        //of the selected features
        var first = false;
        on(featureLayer, 'update-end', function () {
            if (first == true) {
                return;
            }

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

            document.getElementById("dataArray").value = JSON.stringify(data);

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

            document.getElementById("one_c").className = "c" + 0;
            document.getElementById("two_c").className = "c" + 1;
            document.getElementById("three_c").className = "c" + 2;
            document.getElementById("four_c").className = "c" + 3;
            document.getElementById("five_c").className = "c" + 4;

        });

        //This pulls off the current layer and the renderer and then updates
        //the breaks based on a users input, labels different colors etc!
        on(updateBreaks, 'click', function () {
            l_id = map.graphicsLayerIds[0];

            layer = map.getLayer(l_id);
            map.removeLayer(layer);
            data = JSON.parse(document.getElementById("dataArray").value);

            stp1 = parseFloat(document.getElementById("one_b").value);
            stp2 = parseFloat(document.getElementById("two_b").value);
            stp3 = parseFloat(document.getElementById("three_b").value);
            stp4 = parseFloat(document.getElementById("four_b").value);
            stp5 = parseFloat(document.getElementById("five_b").value);
            top = parseFloat(document.getElementById("five_a").value);

            //the minus one is a correct just to make the breaks not match up.
            document.getElementById("one_a").innerHTML = parseInt(stp2 - 1);
            document.getElementById("two_a").innerHTML = parseInt(stp3 - 1);
            document.getElementById("three_a").innerHTML = parseInt(stp4 - 1);
            document.getElementById("four_a").innerHTML = parseInt(stp5 - 1);
            document.getElementById("five_a").value = parseInt(top);

            var __map_color = document.getElementById("selectColor");
            var mc_i = __map_color.options[__map_color.selectedIndex].value;
            var mc_i = 5 * mc_i;

            document.getElementById("one_c").className = "c" + (mc_i + 0);
            document.getElementById("two_c").className = "c" + (mc_i + 1);
            document.getElementById("three_c").className = "c" + (mc_i + 2);
            document.getElementById("four_c").className = "c" + (mc_i + 3);
            document.getElementById("five_c").className = "c" + (mc_i + 4);

            c1 = map_colors[mc_i + 0];
            c2 = map_colors[mc_i + 1];
            c3 = map_colors[mc_i + 2];
            c4 = map_colors[mc_i + 3];
            c5 = map_colors[mc_i + 4];

            var ren = new ClassBreaksRenderer(symbol, findvalue)
            ren.addBreak(stp1, stp2, new SimpleFillSymbol().setColor(new Color(c1)));
            ren.addBreak(stp2 + 1, stp3, new SimpleFillSymbol().setColor(new Color(c2)));
            ren.addBreak(stp3 + 1, stp4, new SimpleFillSymbol().setColor(new Color(c3)));
            ren.addBreak(stp4 + 1, stp5, new SimpleFillSymbol().setColor(new Color(c4)));
            ren.addBreak(stp5 + 1, top, new SimpleFillSymbol().setColor(new Color(c5)));


            var fl = get_feature_layer(thematic_region);

            fl.setRenderer(ren);
            if (document.getElementById("check_label").checked == true) {
                fl.setLabelingInfo([labelClass]);
            }

            map.addLayer(fl);


        });



    });
