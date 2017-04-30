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
}

function makeTable(data) {
    d3.select("#info").append("h2").attr("class", "heading").html("General Information");

    var table_div = d3.select("#info").append("div")
        .attr("class", "table_div");

    var table = table_div.append("table")
        .attr("class", "table table-hover table-bordered");

    var thead = table.append("thead").append("tr");

    thead.append("th");
    thead.append("th").html("Description");
    thead.append("th").html("Status");
    thead.append("th").html("Region");
    thead.append("th").style("white-space", "pre").html("Tuition Cost \n(in-state)");
    thead.append("th").style("white-space", "pre").html("Tuition Cost \n(out-of-state)");

    var tbody = table.append("tbody");

    var tr = tbody.selectAll("tr")
        .data(data).enter()
        .append("tr");

    tr.append('th').html(function(d) { return d.INSTNM; });
    tr.append('td').html(function(d) { return sizeset_arr[d.CCSIZSET]; });
    tr.append('td').html(function(d) { return control_arr[d.CONTROL]; });
    tr.append('td').html(function(d) { return region_arr[d.REGION]; });
    tr.append('td').html(function(d) {
        return "$" + Number(d.TUITIONFEE_IN).toLocaleString('en-US', {minimumFractionDigits: 0});
    });
    tr.append('td').html(function(d) {
        return "$" + Number(d.TUITIONFEE_OUT).toLocaleString('en-US', {minimumFractionDigits: 0});
    });
}

function makeSAT(data) {
    d3.select("#info").append("h2").attr("class", "heading").html("Average Acceptance Scores");

    d3.select("#info").append("div").attr("class", "SAT_div");
    d3.select(".SAT_div").append("h3").html("SAT");

    var width = 550;
    var height = 500;

    var svg = d3.select(".SAT_div")
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var bars = svg.append('g');

    var yDom = ["Writing", "Reading", "Math", "Average (R&M)"];

    var divTooltip = d3.select("body").append("div").attr("class", "toolTip");

    var xScale = d3.scale.linear().range([60, (width - 20)]);
    var yScale = d3.scale.ordinal().rangeRoundBands([0, (height - 60)], 0.3);

    var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
    var yAxis = d3.svg.axis().scale(yScale).orient('left');

    xScale.domain([0, 1600]);

    yScale.domain(yDom);

    var z = ["#4575b3", "#e57e00", "#5fa034", "#ba2924", "#8964bb", "#7f574b", "#cc74bf", "#7e7e7e", "#bbbd28", "#69bdcf"];

    bars.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(60, 0)')
        .call(yAxis)
        .selectAll("text")
        .style("text-anchor", "middle")
        .attr("dy", "-10")
        .attr("dx", yScale.rangeBand() / data.length / 2 - 3)
        .attr("transform", "rotate(-90)" );

    bars.append('g')
        .attr('class', 'axis')
        .attr('transform', "translate(0," + (height - 60) + ")")
        .call(xAxis);

    bars.append('g')
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .style("fill", function(d, i) { return z[i]; })
        .attr('x', 60)
        .attr('y', function(d, i) {
            return yScale('Reading') + (i * yScale.rangeBand() / data.length);
        })
        .attr('width', function(d) {
            return xScale(d['SATVRMID']) - 60;
        })
        .attr('height', function(d) {
            return yScale.rangeBand() / data.length;
        })
        .on("mousemove", function(d){
            divTooltip.style("left", d3.event.pageX+10+"px");
            divTooltip.style("top", d3.event.pageY-25+"px");
            divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY;
            var elements = document.querySelectorAll(':hover');
            l = elements.length;
            l = l-1;
            elementData = elements[l].__data__;
            divTooltip.html("<b>Average Reading Score: </b>" + d["SATVRMID"]);
        })
        .on("mouseout", function(d){
            divTooltip.style("display", "none");
        });

    bars.append('g')
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .style("fill", function(d, i) { return z[i]; })
        .attr('x', 60)
        .attr('y', function(d, i) {
            return yScale('Math') + (i*yScale.rangeBand() / data.length);
        })
        .attr('width', function(d) {
            return xScale(d['SATMTMID']) - 60;
        })
        .attr('height', function(d) {
            return yScale.rangeBand() / data.length;
        })
        .on("mousemove", function(d){
            divTooltip.style("left", d3.event.pageX+10+"px");
            divTooltip.style("top", d3.event.pageY-25+"px");
            divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY;
            var elements = document.querySelectorAll(':hover');
            l = elements.length;
            l = l-1;
            elementData = elements[l].__data__;
            divTooltip.html("<b>Average Math Score: </b>" + d["SATMTMID"]);
        })
        .on("mouseout", function(d){
            divTooltip.style("display", "none");
        });

    bars.append('g')
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .style("fill", function(d, i) { return z[i]; })
        .attr('x', 60)
        .attr('y', function(d, i) {
            return yScale('Writing') + (i*yScale.rangeBand() / data.length);
        })
        .attr('width', function(d) {
            return xScale(d['SATWRMID']) - 60;
        })
        .attr('height', function(d) {
            return yScale.rangeBand() / data.length;
        })
        .on("mousemove", function(d){
            divTooltip.style("left", d3.event.pageX+10+"px");
            divTooltip.style("top", d3.event.pageY-25+"px");
            divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY;
            var elements = document.querySelectorAll(':hover');
            l = elements.length;
            l = l-1;
            elementData = elements[l].__data__;
            divTooltip.html("<b>Average Writing Score: </b>" + d["SATWRMID"]);
        })
        .on("mouseout", function(d){
            divTooltip.style("display", "none");
        });

    bars.append('g')
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .style("fill", function(d, i) { return z[i]; })
        .attr('x', 60)
        .attr('y', function(d, i) {
            return yScale('Average (R&M)') + (i*yScale.rangeBand() / data.length);
        })
        .attr('width', function(d) {
            return xScale(d['SAT_AVG']) - 60;
        })
        .attr('height', function(d) {
            return yScale.rangeBand() / data.length;
        })
        .on("mousemove", function(d){
            divTooltip.style("left", d3.event.pageX+10+"px");
            divTooltip.style("top", d3.event.pageY-25+"px");
            divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY;
            var elements = document.querySelectorAll(':hover');
            l = elements.length;
            l = l-1;
            elementData = elements[l].__data__;
            divTooltip.html("<b>Average Reading + Math Score: </b>" + d["SAT_AVG"]);
        })
        .on("mouseout", function(d){
            divTooltip.style("display", "none");
        });

    svg.append("text")
        .style("text-anchor", "middle")
        .attr("x", width / 2 + 10)
        .attr("y", height - 20)
        .text("Score (Out of 1600 for Average | 800 for the Rest)");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height / 2) + 30)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Category");

    var schoolNames = [];
    data.forEach(function (d) {
        schoolNames.push(d.INSTNM);
    });

    var legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(schoolNames)
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(2," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", function (d, i) {
            return z[i];
        });

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });
}

function makeACT(data) {
    d3.select("#info").append("div").attr("class", "ACT_div");
    d3.select(".ACT_div").append("h3").html("ACT");

    var width = 550;
    var height = 500;

    var svg = d3.select(".ACT_div")
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var bars = svg.append('g');

    var yDom = ["Writing", "English", "Math", "Cumulative"];

    var divTooltip = d3.select("body").append("div").attr("class", "toolTip");

    var xScale = d3.scale.linear().range([60, (width - 20)]);
    var yScale = d3.scale.ordinal().rangeRoundBands([0, (height - 60)], 0.3);

    var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
    var yAxis = d3.svg.axis().scale(yScale).orient('left');

    xScale.domain([0, 36]);

    yScale.domain(yDom);

    var z = ["#4575b3", "#e57e00", "#5fa034", "#ba2924", "#8964bb", "#7f574b", "#cc74bf", "#7e7e7e", "#bbbd28", "#69bdcf"];

    bars.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(60, 0)')
        .call(yAxis)
        .selectAll("text")
        .style("text-anchor", "middle")
        .attr("dy", "-10")
        .attr("dx", yScale.rangeBand() / data.length / 2 - 3)
        .attr("transform", "rotate(-90)" );

    bars.append('g')
        .attr('class', 'axis')
        .attr('transform', "translate(0," + (height - 60) + ")")
        .call(xAxis);

    bars.append('g')
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .style("fill", function(d, i) { return z[i]; })
        .attr('x', 60)
        .attr('y', function(d, i) {
            return yScale('English') + (i * yScale.rangeBand() / data.length);
        })
        .attr('width', function(d) {
            return xScale(d['ACTENMID']) - 60;
        })
        .attr('height', function(d) {
            return yScale.rangeBand() / data.length;
        })
        .on("mousemove", function(d){
            divTooltip.style("left", d3.event.pageX+10+"px");
            divTooltip.style("top", d3.event.pageY-25+"px");
            divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY;
            var elements = document.querySelectorAll(':hover');
            l = elements.length;
            l = l-1;
            elementData = elements[l].__data__;
            divTooltip.html("<b>Average English Score: </b>" + d["ACTENMID"]);
        })
        .on("mouseout", function(d){
            divTooltip.style("display", "none");
        });

    bars.append('g')
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .style("fill", function(d, i) { return z[i]; })
        .attr('x', 60)
        .attr('y', function(d, i) {
            return yScale('Math') + (i*yScale.rangeBand() / data.length);
        })
        .attr('width', function(d) {
            return xScale(d['ACTMTMID']) - 60;
        })
        .attr('height', function(d) {
            return yScale.rangeBand() / data.length;
        })
        .on("mousemove", function(d){
            divTooltip.style("left", d3.event.pageX+10+"px");
            divTooltip.style("top", d3.event.pageY-25+"px");
            divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY;
            var elements = document.querySelectorAll(':hover');
            l = elements.length;
            l = l-1;
            elementData = elements[l].__data__;
            divTooltip.html("<b>Average Math Score: </b>" + d["ACTMTMID"]);
        })
        .on("mouseout", function(d){
            divTooltip.style("display", "none");
        });

    bars.append('g')
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .style("fill", function(d, i) { return z[i]; })
        .attr('x', 60)
        .attr('y', function(d, i) {
            return yScale('Writing') + (i*yScale.rangeBand() / data.length);
        })
        .attr('width', function(d) {
            return xScale(d['ACTWRMID']) - 60;
        })
        .attr('height', function(d) {
            return yScale.rangeBand() / data.length;
        })
        .on("mousemove", function(d){
            divTooltip.style("left", d3.event.pageX+10+"px");
            divTooltip.style("top", d3.event.pageY-25+"px");
            divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY;
            var elements = document.querySelectorAll(':hover');
            l = elements.length;
            l = l-1;
            elementData = elements[l].__data__;
            divTooltip.html("<b>Average Writing Score: </b>" + d["ACTWRMID"]);
        })
        .on("mouseout", function(d){
            divTooltip.style("display", "none");
        });

    bars.append('g')
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .style("fill", function(d, i) { return z[i]; })
        .attr('x', 60)
        .attr('y', function(d, i) {
            return yScale('Cumulative') + (i*yScale.rangeBand() / data.length);
        })
        .attr('width', function(d) {
            return xScale(d['ACTCMMID']) - 60;
        })
        .attr('height', function(d) {
            return yScale.rangeBand() / data.length;
        })
        .on("mousemove", function(d){
            divTooltip.style("left", d3.event.pageX+10+"px");
            divTooltip.style("top", d3.event.pageY-25+"px");
            divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY;
            var elements = document.querySelectorAll(':hover');
            l = elements.length;
            l = l-1;
            elementData = elements[l].__data__;
            divTooltip.html("<b>Average Cumulative Score: </b>" + d["ACTCMMID"]);
        })
        .on("mouseout", function(d){
            divTooltip.style("display", "none");
        });
    svg.append("text")
        .style("text-anchor", "middle")
        .attr("x", width / 2 + 10)
        .attr("y", height - 20)
        .text("Score (Out of 12 for Writing | 36 for the Rest)");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height / 2) + 30)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Category");
}

function makeAdmission(data) {
    d3.select("#info").append("h2").attr("class", "heading spacing").html("Admission/Retention Rates");

    d3.select("#info").append("div").attr("class", "admission_div");
    d3.select(".admission_div").append("h3").html("Admission Rate");

    var width = 550;
    var height = 500;

    var svg = d3.select(".admission_div")
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var bars = svg.append('g');

    var xScale = d3.scale.linear().range([85, (width - 20)]);
    var yScale = d3.scale.ordinal().rangeRoundBands([0, (height - 60)], 0.1);

    var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
    var yAxis = d3.svg.axis().scale(yScale).orient('left');

    var yDom = [];
    data.forEach(function (d) {
        yDom.push(d.INSTNM);
    });

    xScale.domain([0, 100]);

    yScale.domain(yDom);

    var divTooltip = d3.select("body").append("div").attr("class", "toolTip");

    bars.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(85, 0)')
        .call(yAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", yScale.rangeBand() / data.length / 2 + 5)
        .attr("transform", function(d) {
            return "translate(" + this.getBBox().height*-2 + ",0)rotate(-65)";
        })
        .style("font-size", "6px");

    bars.append('g')
        .attr('class', 'axis')
        .attr('transform', "translate(0," + (height - 60) + ")")
        .call(xAxis);

    bars.append('g')
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', 85)
        .attr('y', function(d) {
            return yScale(d.INSTNM);
        })
        .attr('width', function(d) {
            return xScale(d['ADM_RATE'] * 100) - 85;
        })
        .attr('height', function(d) {
            return yScale.rangeBand();
        })
        .on("mousemove", function(d){
            divTooltip.style("left", d3.event.pageX+10+"px");
            divTooltip.style("top", d3.event.pageY-25+"px");
            divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY;
            var elements = document.querySelectorAll(':hover');
            l = elements.length;
            l = l-1;
            elementData = elements[l].__data__;
            divTooltip.html("<b>Admission Rate: </b>" + (d["ADM_RATE"] * 100).toFixed(2) + "%");
        })
        .on("mouseout", function(d){
            divTooltip.style("display", "none");
        });

    svg.append("text")
        .style("text-anchor", "middle")
        .attr("x", width / 2 + 30)
        .attr("y", height - 20)
        .text("Admission Rate (%)");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height / 2) + 30)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("School");
}

function makeRetention(data) {
    d3.select("#info").append("div").attr("class", "retention_div");
    d3.select(".retention_div").append("h3").html("Retention Rate");

    var width = 550;
    var height = 500;

    var svg = d3.select(".retention_div")
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var bars = svg.append('g');

    var xScale = d3.scale.linear().range([85, (width - 20)]);
    var yScale = d3.scale.ordinal().rangeRoundBands([0, (height - 60)], 0.1);

    var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
    var yAxis = d3.svg.axis().scale(yScale).orient('left');

    var yDom = [];
    data.forEach(function (d) {
        yDom.push(d.INSTNM);
    });

    xScale.domain([0, 100]);

    yScale.domain(yDom);

    var divTooltip = d3.select("body").append("div").attr("class", "toolTip");

    bars.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(85, 0)')
        .call(yAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", yScale.rangeBand() / data.length / 2 + 5)
        .attr("transform", function(d) {
            return "translate(" + this.getBBox().height*-2 + ",0)rotate(-65)";
        })
        .style("font-size", "6px");

    bars.append('g')
        .attr('class', 'axis')
        .attr('transform', "translate(0," + (height - 60) + ")")
        .call(xAxis);

    bars.append('g')
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', 85)
        .attr('y', function(d) {
            return yScale(d.INSTNM);
        })
        .attr('width', function(d) {
            return xScale(d['RET_FT4'] * 100) - 85;
        })
        .attr('height', function(d) {
            return yScale.rangeBand();
        })
        .on("mousemove", function(d){
            divTooltip.style("left", d3.event.pageX+10+"px");
            divTooltip.style("top", d3.event.pageY-25+"px");
            divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY;
            var elements = document.querySelectorAll(':hover');
            l = elements.length;
            l = l-1;
            elementData = elements[l].__data__;
            divTooltip.html("<b>Retention Rate: </b>" + (d["RET_FT4"] * 100).toFixed(2) + "%");
        })
        .on("mouseout", function(d){
            divTooltip.style("display", "none");
        });

    svg.append("text")
        .style("text-anchor", "middle")
        .attr("x", width / 2 + 30)
        .attr("y", height - 20)
        .text("Retention Rate (%)");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height / 2) + 30)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("School");
}

function makePie(data) {
    d3.select("#info").append("h2").attr("class", "heading spacing").html("Gender Ratio");

    d3.select("#info").append("div").attr("class", "ratio_div");

    var divTooltip = d3.select("body").append("div").attr("class", "toolTip");

    var width = d3.select(".ratio_div").style("width");
    width = +width.slice(0, -2);

    if (data.length < 5) {
        width = width / data.length;
    } else {
        width = width / 5;
    }


    var height = width - (120 / data.length);

    var radius = Math.min(height, width) / 2;

    var dataContainer = [];
    for (var i = 0; i < data.length; i++) {
        dataContainer.push([
            {"School": data[i].INSTNM, "Gender": "Men", "Percentage": data[i].UGDS_MEN, "Color": "#5da6ff"},
            {"School": data[i].INSTNM, "Gender": "Women", "Percentage": data[i].UGDS_WOMEN, "Color": "#d96962"}
        ])
    }

    var schoolNames = [];
    data.forEach(function (d) {
        schoolNames.push(d.INSTNM);
    });

    var k = 0;

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

        var arc = d3.svg.arc().innerRadius(0)
            .outerRadius(radius);

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
            .attr("fill", function(d){ return d.data.Color; })
            .style("stroke", "#fff")
            .on("mousemove", function(d){
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
            .on("mouseout", function(d){
                divTooltip.style("display", "none");
            });

        g.append("text")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .text(function(d) { return d.data.Gender; })
            .style("fill", "#fff")
            .style("text-anchor", "middle");
        // .style("font-size", "18px");
    }
}

function makeEarnings(data) {
    d3.select("#info").append("h2").attr("class", "heading spacing").html("Earnings Post Graduation");

    d3.select("#info").append("div").attr("class", "earnings_div");

    var width = 1120;
    var height = 600;

    var svg = d3.select(".earnings_div")
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var lines = svg.append('g');

    var z = ["#4575b3", "#e57e00", "#5fa034", "#ba2924", "#8964bb", "#7f574b", "#cc74bf", "#7e7e7e", "#bbbd28", "#69bdcf"];

    var xScale = d3.scale.ordinal().rangeBands([80, (width - 60)]);
    var yScale = d3.scale.linear().range([40, (height - 60)]);

    var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
    var yAxis = d3.svg.axis().scale(yScale).orient('left');

    var lineData = [];
    for (var i=0; i < data.length; i++) {
        lineData.push([
            {
                "earnings": data[i].MN_EARN_WNE_P6,
                "year": "6 Years"
            }, {
                "earnings": data[i].MN_EARN_WNE_P7,
                "year": "7 Years"
            }, {
                "earnings": data[i].MN_EARN_WNE_P8,
                "year": "8 Years"
            }, {
                "earnings": data[i].MN_EARN_WNE_P9,
                "year": "9 Years"
            }, {
                "earnings": data[i].MN_EARN_WNE_P10,
                "year": "10 Years"
            }
        ]);
    }

    var xDom = ["6 Years", "7 Years", "8 Years", "9 Years", "10 Years"];

    xScale.domain(xDom);

    yScale.domain([d3.max(data, function (d) {
        return +d["MN_EARN_WNE_P10"];

    }), d3.min(data, function (d) {
        return +d["MN_EARN_WNE_P6"] - 5000;
    })]);

    lines.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(80, 0)')
        .call(yAxis);

    lines.append('g')
        .attr('class', 'axis')
        .attr('transform', "translate(0," + (height - 60) + ")")
        .call(xAxis);

    var lineGen = d3.svg.line()
        .x(function(d) {
            return xScale(d.year) + 100;
        })
        .y(function(d) {
            return yScale(d.earnings);
        });

    lineData.forEach(function (d, i) {
        svg.select('g')
            .append('svg:path')
            .attr('d', lineGen(lineData[i]))
            .attr('stroke', z[i])
            .attr('stroke-width', 2)
            .attr('fill', 'none');
    });

    svg.append("text")
        .style("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height - 20)
        .text("Years After Graduation");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Salary ($)");

    var schoolNames = [];
    data.forEach(function (d) {
        schoolNames.push(d.INSTNM);
    });

    var legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(schoolNames)
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(2," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", function (d, i) {
            return z[i];
        });

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });
}