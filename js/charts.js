/*
 * This file contains all of the code for displaying tables, bar charts, pie charts,
 * and line charts. The code for generating each chart is separated into its own function.
 *
 * All of these function were adapted from online examples for making corresponding charts.
 * They were then heavily modified to work with our data, and to fit our styling requirements.
 *
 */

var control_arr = ["", "Public", "Private (non-profit)", "Private (for-profit)"];

var region_arr = ["U.S. Service Schools", "New England", "Mid East", "Great Lakes",
    "Plains", "Southeast", "Southwest", "Rocky Mountains", "Far West"];

var sizeset_arr = ["Not Classified", "Two year college \nVery small in size",
    "Two year college \nSmall in size", "Two year college \nMedium in size",
    "Two year college \nLarge in size", "Two year college \nVery large in size",
    "Four year college \nVery small in size \nLocated in a primarily nonresidential area",
    "Four year college \nVery small in size \nLocated in a primarily residential area",
    "Four year college \nVery small in size \nLocated in a highly residential area",
    "Four year college \nSmall in size \nLocated in a primarily nonresidential area",
    "Four year college \nSmall in size \nLocated in a primarily residential area",
    "Four year college \nSmall in size \nLocated in a highly residential area",
    "Four year college \nMedium in size \nLocated in a primarily nonresidential area",
    "Four year college \nMedium in size \nLocated in a primarily residential area",
    "Four year college \nMedium in size \nLocated in a highly residential area",
    "Four year college \nLarge in size \nLocated in a primarily nonresidential area",
    "Four year college \nLarge in size \nLocated in a primarily residential area",
    "Four year college \nLarge in size \nLocated in a highly residential area",
    "Exclusively graduate/professional college"]

function compare(data) {
    makeTable(data);
    makeSAT(data);
    makeACT(data);
    makeAdmission(data);
    makeRetention(data);
    makePie(data);
    makeEarnings(data);
    makeScrollUpArrow()
}

function makeTable(data) {
    var card = d3.select("body").append("div").attr("class", "card");

    var card_title = card.append("div").attr("class", "card-title");

    card_title.append("h2").attr("class", "heading").html("General Information");

    var table_div = card.append("div")
        .attr("class", "table_div");

    var table = table_div.append("table")
        .attr("class", "table")
        .attr("id", "infoTable");

    var thead = table.append("thead").append("tr");

    thead.append("th").html("Colleges");
    thead.append("th").html("Description");
    thead.append("th").html("Status");
    thead.append("th").html("Region");
    thead.append("th").style("white-space", "pre").html("Tuition Cost \n(in-state)");
    thead.append("th").style("white-space", "pre").html("Tuition Cost \n(out-of-state)");

    var tbody = table.append("tbody");

    var tr = tbody.selectAll("tr")
        .data(data).enter()
        .append("tr");

    tr.append('td').style({"word-wrap": "break-word", "max-width": "300px", "white-space": "normal"})
        .html(function(d) { return d.INSTNM; });
    tr.append('td').html(function(d) { return sizeset_arr[d.CCSIZSET]; });
    tr.append('td').html(function(d) { return control_arr[d.CONTROL]; });
    tr.append('td').html(function(d) { return region_arr[d.REGION]; });
    tr.append('td').html(function(d) {
        return "$" + Number(d.TUITIONFEE_IN).toLocaleString('en-US', {minimumFractionDigits: 0});
    });
    tr.append('td').html(function(d) {
        return "$" + Number(d.TUITIONFEE_OUT).toLocaleString('en-US', {minimumFractionDigits: 0});
    });

    $(document).ready(function() {
        $('#infoTable').DataTable({
            paging: false,
            info: false,
            searching: false,
            columnDefs: [
                { targets: 1, orderable: false }
            ],
            order: [0, "asc"]
        });
    });
}

function makeSAT(data) {

    var card = d3.select("body").append("div").attr("class", "small-card left");

    var card_title = card.append("div").attr("class", "card-title");

    card_title.append("h2").attr("class", "heading").html("SAT Acceptance Scores");

    card.append("div").attr("class", "SAT_div");

    var margin = {top: 20, right: 30, bottom: 40, left: 40},
        width = +d3.select(".SAT_div").style("width").slice(0, -2),
        height = 530;

    var svg = d3.select(".SAT_div")
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var colors = ["#f7cac9", "#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ECA53E", "#365882", "#197F90"];

    // var colors = ["#F7CAC9", "#F7786B", "#91A8D0", "#034F84", "#98DDDE", "#9896A4", "#B18F6A", "#DD4132", "#FAE03C", "#79C753"];

    // var colors = ["#2b4c5a", "#375f5e", "#447161", "#508465", "#539769", "#6baa6d", "#78bd70", "#86d075", "#94e475", "#a2f77c"];

    function myData() {
        var vals = [];
        for(var i = 0; i < data.length; i++) {
            vals.push(
                {
                    key: data[i].INSTNM,
                    color: colors[i],
                    values: [
                        {x: 0, y: data[i].SATMTMID === "NULL" ? 0 : +data[i].SATMTMID},
                        {x: 1, y: data[i].SATVRMID === "NULL" ? 0 : +data[i].SATVRMID},
                        {x: 2, y: data[i].SATWRMID === "NULL" ? 0 : +data[i].SATWRMID}
                    ]
                }
            );
        }
        return vals;
    }

    nv.addGraph(function() {
        var chart = nv.models.multiBarChart()
            .margin({ top: 80, right: 40, bottom: 80, left: 80 })
            .showControls(true)
            .groupSpacing(0.2)
            .showLegend(true);
            // .yDomain([0,800])


        chart.xAxis
            .axisLabel("Category")
            .tickFormat(function (d) {
                var labels = ["Math", "Reading", "Writing"];
                return labels[d];
            });

        chart.yAxis
            .axisLabel("Score")
            .tickFormat(d3.format(','));

        svg.datum(myData())
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
}

function makeACT(data) {
    var card = d3.select("body").append("div").attr("class", "small-card right act");

    var card_title = card.append("div").attr("class", "card-title");

    card_title.append("h2").attr("class", "heading").html("ACT Acceptance Scores");

    d3.select(".act").append("div").attr("class", "ACT_div");

    var margin = {top: 20, right: 30, bottom: 40, left: 40},
        width = +d3.select(".ACT_div").style("width").slice(0, -2),
        height = 530;

    var svg = d3.select(".ACT_div")
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var colors = ["#f7cac9", "#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ECA53E", "#365882", "#197F90"];

    // var colors = ["#F7CAC9", "#F7786B", "#91A8D0", "#034F84", "#98DDDE", "#9896A4", "#B18F6A", "#DD4132", "#FAE03C", "#79C753"];

    // var colors = ["#2b4c5a", "#375f5e", "#447161", "#508465", "#539769", "#6baa6d", "#78bd70", "#86d075", "#94e475", "#a2f77c"];

    function myData() {
        var vals = [];
        for(var i = 0; i < data.length; i++) {
            vals.push(
                {
                    key: data[i].INSTNM,
                    color: colors[i],
                    values: [
                        {x: 0, y: data[i].ACTMTMID === "NULL" ? 0 : +data[i].ACTMTMID},
                        {x: 1, y: data[i].ACTENMID === "NULL" ? 0 : +data[i].ACTENMID},
                        {x: 2, y: data[i].ACTWRMID === "NULL" ? 0 : +data[i].ACTWRMID}
                    ]
                }
            );
        }
        return vals;
    }

    nv.addGraph(function() {
        var chart = nv.models.multiBarChart()
            .margin({ top: 80, right: 40, bottom: 80, left: 80 })
            .showControls(true)
            .groupSpacing(0.2)
            .showLegend(true);
            // .yDomain([0,36]);

        chart.xAxis
            .axisLabel("Category")
            .tickFormat(function (d) {
                var labels = ["Math", "English", "Writing"];
                return labels[d];
            });

        chart.yAxis
            .axisLabel("Score");

        svg.datum(myData())
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
}

function makeAdmission(data) {

    var card = d3.select("body").append("div").attr("class", "small-card left");

    var card_title = card.append("div").attr("class", "card-title");

    card_title.append("h2").attr("class", "heading").html("Admission Rates");

    card.append("div").attr("class", "admission_div");

    var margin = {top: 20, right: 30, bottom: 90, left: 60},
        width = +d3.select(".admission_div").style("width").slice(0, -2) - margin.left - margin.right,
        height = 470 - margin.top - margin.bottom;

    var svg = d3.select(".admission_div")
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    var chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var divTooltip = d3.select("body").append("div").attr("class", "toolTip");

    if (data.length < 4) {
        var x = d3.scale.ordinal()
            .domain(data.map(function (d) { return d.INSTNM }))
            .rangeRoundBands([0, width], .5);
    } else {
        var x = d3.scale.ordinal()
            .domain(data.map(function (d) { return d.INSTNM }))
            .rangeRoundBands([0, width], .1);
    }

    var y = d3.scale.linear()
        .domain([0, 1])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10, "%");

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "start")
        .attr("x", 9)
        .attr("y", 0)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("font-size", "11px");

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    chart.selectAll(".adm-bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "adm-bar")
        .attr("x", function(d) { return x(d.INSTNM); })
        .attr("y", function(d) { return y(+d.ADM_RATE); })
        .attr("height", function(d) { return height - y(+d.ADM_RATE) - 1; })
        .attr("width", x.rangeBand())
        .on("mousemove", function(d){
            divTooltip.style("left", d3.event.pageX+10+"px");
            divTooltip.style("top", d3.event.pageY-25+"px");
            divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY;
            var elements = document.querySelectorAll(':hover');
            l = elements.length;
            l = l-1;
            elementData = elements[l].__data__;
            divTooltip.html("<b>" + (d.INSTNM) + "</b>" + " (" + (d["ADM_RATE"] * 100).toFixed(2) + "%)");
        })
        .on("mouseout", function(d){
            divTooltip.style("display", "none");
        });
}

function makeRetention(data) {
    var card = d3.select("body").append("div").attr("class", "small-card right ret bottom-space");

    var card_title = card.append("div").attr("class", "card-title");

    card_title.append("h2").attr("class", "heading").html("Retention Rates");

    d3.select(".ret").append("div").attr("class", "retention_div");

    var margin = {top: 20, right: 30, bottom: 90, left: 60},
        width = +d3.select(".retention_div").style("width").slice(0, -2) - margin.left - margin.right,
        height = 470 - margin.top - margin.bottom;

    var svg = d3.select(".retention_div")
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    var chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var divTooltip = d3.select("body").append("div").attr("class", "toolTip");

    if (data.length < 4) {
        var x = d3.scale.ordinal()
            .domain(data.map(function (d) { return d.INSTNM }))
            .rangeRoundBands([0, width], .5);
    } else {
        var x = d3.scale.ordinal()
            .domain(data.map(function (d) { return d.INSTNM }))
            .rangeRoundBands([0, width], .1);
    }

    var y = d3.scale.linear()
        .domain([0, 1])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10, "%");

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "start")
        .attr("x", 9)
        .attr("y", 0)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("font-size", "11px");

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    chart.selectAll(".ret-bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "ret-bar")
        .attr("x", function(d) { return x(d.INSTNM); })
        .attr("y", function(d) { return y(+d.RET_FT4); })
        .attr("height", function(d) { return height - y(+d.RET_FT4) - 1; })
        .attr("width", x.rangeBand())
        .on("mousemove", function(d){
            divTooltip.style("left", d3.event.pageX+10+"px");
            divTooltip.style("top", d3.event.pageY-25+"px");
            divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY;
            var elements = document.querySelectorAll(':hover');
            l = elements.length;
            l = l-1;
            elementData = elements[l].__data__;
            divTooltip.html("<b>" + (d.INSTNM) + "</b>" + " (" + (d["RET_FT4"] * 100).toFixed(2) + "%)");
        })
        .on("mouseout", function(d){
            divTooltip.style("display", "none");
        });
}

function makePie(data) {

    var card = d3.select("body").append("div").attr("class", "card clear");

    var card_title = card.append("div").attr("class", "card-title");

    card_title.append("h2").attr("class", "heading").html("Male to Female Ratio");

    card.append("div").attr("class", "ratio_div");

    var divTooltip = d3.select("body").append("div").attr("class", "toolTip");

    var width = d3.select(".ratio_div").style("width");
    width = +width.slice(0, -2);
    var originalWidth = width;

    if (data.length < 4) {
        width = width / data.length;
    } else {
        width = width / 4;
    }

    var height;
    if (originalWidth > 1200) {         // if window is wider than 1200px
        if (data.length < 3) {
            height = width * 0.7;       // 2 items, height smallest so circles spaced out
        } else if (data.length < 4) {
            height = width * 0.8;       // 3 items, height small so circles are kind of spaced out
        } else {
            height = width - (120 / data.length); // 4 items, normal spacing
        }
    } else {
        height = width - (120 / data.length); // if window is less than 1200px, normal spacing
    }

    var radius = Math.min(height, width) / 2;

    var dataContainer = [];
    for (var i = 0; i < data.length; i++) {
        dataContainer.push([
            {"School": data[i].INSTNM, "Gender": "Men", "Percentage": data[i].UGDS_MEN, "Color": "#5da6ff"},
            {"School": data[i].INSTNM, "Gender": "Women", "Percentage": data[i].UGDS_WOMEN, "Color": "#ff85a2"}
        ])
    }

    var schoolNames = [];
    data.forEach(function (d) {
        schoolNames.push(d.INSTNM);
    });

    var k = 0;

    var arc = d3.svg.arc().innerRadius(0)
        .outerRadius(radius);

    for (var j = 0; j < dataContainer.length; j++) {
        var container = d3.select(".ratio_div").append("div")
            .attr("class", "pie-container");
        container.append("h4")
            .style("text-align", "center")
            .html(function () {
                if (schoolNames.length >= 4) {
                    return schoolNames[k].trunc(16, false);
                } else {
                    return schoolNames[k];
                }
            });

        k++;

        var svg = container
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d){ return d.Percentage; });

        var g = svg.selectAll(".slice")
            .data(pie(dataContainer[j]))
            .enter()
            .append("g")
            .attr("class", "slice");

        g.append("path")
            .attr("d", arc)
            .attr("fill", function(d) { return d.data.Color; })
            .style("stroke", "#fff")
            .on("mousemove", function(d) {
                divTooltip.style("left", d3.event.pageX+10+"px");
                divTooltip.style("top", d3.event.pageY-25+"px");
                divTooltip.style("display", "inline-block");
                var x = d3.event.pageX, y = d3.event.pageY;
                var elements = document.querySelectorAll(':hover');
                l = elements.length;
                l = l-1;
                elementData = elements[l].__data__;
                divTooltip.html("<b>Percentage: </b>" + (d.data.Percentage * 100).toFixed(2) + "%");
            })
            .on("mouseout", function(d) {
                divTooltip.style("display", "none");
            });

        g.append("text")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .text(function(d) { return d.data.Gender; })
            .style("fill", "#fff")
            .style("text-anchor", "middle");
    }
}

function makeEarnings(data) {
    var card = d3.select("body").append("div").attr("class", "card bottom-space");

    var card_title = card.append("div").attr("class", "card-title");

    card_title.append("h2").attr("class", "heading").html("Earnings Post Graduation");

    card.append("div").attr("class", "earnings_div");

    var margin = {top: 20, right: 30, bottom: 40, left: 40},
        width = +d3.select(".earnings_div").style("width").slice(0, -2),
        height = 570;

    var svg = d3.select(".earnings_div")
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var colors = ["#f7cac9", "#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ECA53E", "#365882", "#197F90"];
    // var colors = ["#F7CAC9", "#F7786B", "#91A8D0", "#034F84", "#98DDDE", "#9896A4", "#B18F6A", "#DD4132", "#FAE03C", "#79C753"];

    // var colors = ["#2b4c5a", "#375f5e", "#447161", "#508465", "#539769", "#6baa6d", "#78bd70", "#86d075", "#94e475", "#a2f77c"];

    function myData() {
        var vals = [];
        for(var i = 0; i < data.length; i++) {
            vals.push(
                {
                    key: data[i].INSTNM,
                    color: colors[i],
                    values: [
                        {x: 6, y: +data[i].MN_EARN_WNE_P6},
                        {x: 7, y: +data[i].MN_EARN_WNE_P7},
                        {x: 8, y: +data[i].MN_EARN_WNE_P8},
                        {x: 9, y: +data[i].MN_EARN_WNE_P9},
                        {x: 10, y: +data[i].MN_EARN_WNE_P10}
                    ]
                }
            );
        }
        return vals;
    }

    nv.addGraph(function() {
        var chart = nv.models.lineChart()
            .margin({ top: 80, right: 80, bottom: 80, left: 80 })
            .useInteractiveGuideline(true)
            .interpolate("cardinal")
            .showLegend(true)
            .showYAxis(true)
            .showXAxis(true);

        chart.xAxis
            .axisLabel("Years After Graduation")
            .tickFormat(function (d) {
                return d + " Years";
            });

        chart.yAxis
            .tickFormat(d3.format('$,'));

        svg.datum(myData())
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
}

function makeScrollUpArrow() {
    d3.select("body")
        .append("div")
        .attr("class", "back-top")
        .append("div")
        .attr("class", "arrow-up")
        .append("a")
        .attr("class", "hvr-icon-wobble-vertical")
        .attr("onclick", "scroll()")
}

function scroll() {
    $("body").animate({ scrollTop: 0 }, "slow");
    return false;
}