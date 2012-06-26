// hack to fix load order bug
if(typeof grade_visualization === 'undefined') {
  grade_visualization = {};
}

/*
 * Scrolls plots by the given amount
*/
grade_visualization.shift = function(dx){
  // prevent overlapping animations
  if(grade_visualization.properties.inanim === true) { return; }

  // don't scroll if zoomed out
  if(grade_visualization.properties.zoomed === false) { return; }

  var margin = grade_visualization.properties.margin;
  var zoomOffset = grade_visualization.properties.curOffset + dx;
  if(zoomOffset < -(grade_visualization.properties.zoomWidth + grade_visualization.properties.zoomWidth2 - grade_visualization.properties.plotWidth)) {
    zoomOffset = -(grade_visualization.properties.zoomWidth + grade_visualization.properties.zoomWidth2 - grade_visualization.properties.plotWidth);
  }else if(zoomOffset > 0){
    zoomOffset = 0;
  }
  grade_visualization.properties.prevOffset = zoomOffset;
  d3.select("#tool_container").select(".grade_vis").select(".dot_chart")
    .attr("width", grade_visualization.properties.zoomWidth + margin.right)
    .attr("transform", "translate(" + zoomOffset + "," + margin.top + ")");
  d3.select("#tool_container").select(".grade_vis").select(".future_dot_chart")
    .attr("width", grade_visualization.properties.zoomWidth2+margin.right)
    .attr("transform", "translate(" + (zoomOffset+grade_visualization.properties.zoomWidth+margin.right) + "," + margin.top + ")");
};

/*
 * Resizes visuals to implement dynamic zoom and drag
*/
grade_visualization.zoom = function(){
  var animspeed = grade_visualization.properties.zoomspeed;

  // prevent overlapping animations, just in case
  if(grade_visualization.properties.inanim === true) {
    return;
  }else{
    grade_visualization.properties.inanim = true;
  }
  setTimeout("grade_visualization.properties.inanim = false;", animspeed);

  // declare local variables for convenience
  var gradeItems = grade_visualization.storage.dispGradeItems;
  var futureGradeItems = grade_visualization.storage.dispFutureGradeItems;
  var data = gradeItems;
  var gradeBars = grade_visualization.storage.gradeBars;
  var svg = d3.select("#tool_container").select(".grade_vis").select(".plotbase").select(".dot_chart");
  var svg2 = d3.select("#tool_container").select(".grade_vis").select(".plotbase").select(".future_dot_chart");

  // change zoom state for toggle behavior
  if(grade_visualization.properties.zoomed === true){
    grade_visualization.properties.zoomed = false;
  }else{
    grade_visualization.properties.zoomed = true;
  }

  var grades = grade_visualization.helpers.findScores(gradeItems, futureGradeItems);
  var currentGradeAverage = grades[0];
  var totalGradeAverage = grades[1];
  var classAverage = grades[2];

  // compute necessary dimensions for selected data
  grade_visualization.resize();
  var padding = grade_visualization.properties.padding,
      n = grade_visualization.properties.n,
      n2 = grade_visualization.properties.n2,  
      columnWidth = grade_visualization.properties.columnWidth,
      rowWidth = grade_visualization.properties.rowWidth;
  var margin = grade_visualization.properties.margin,
      height = grade_visualization.properties.height;

  // find dimensions and positions based on zoom
  if(grade_visualization.properties.zoomed === true){
    var width = grade_visualization.properties.zoomWidth;
    var width2 = grade_visualization.properties.zoomWidth2;
  }else{
    var width = grade_visualization.properties.width;
    var width2 = grade_visualization.properties.width2;
  }

  // define axes functions
  // ... x function for the current grade plot
  var x = d3.scale.ordinal()
       .domain($.map(gradeItems, function(gradeItem) { return gradeItem.name; }))
       .rangePoints([0, width], 1.0);
  // ... y function works for both plots
  var y = d3.scale.linear()
      .domain([0,100])
      .range([height - margin.top - margin.bottom, 0],1.0);
  // ... x function for the future grade plot
  var x2 = d3.scale.ordinal()
       .domain($.map(futureGradeItems, function(gradeItem) { return gradeItem.name; }))
       .rangePoints([0, width2], 1.0);

  // define axes
  // ... for current grade plot
  var axes = grade_visualization.helpers.axis_def(x, y, x2);
  var xAxis = axes[0];
  var yAxis = axes[1];
  var xAxis2 = axes[2];
  // remove labels in full zoom view
  // also reset shift offsets
  if(grade_visualization.properties.zoomed === false){
    xAxis.tickValues([]);
    xAxis2.tickValues([]);
    grade_visualization.properties.curOffset = 0;
    grade_visualization.properties.prevOffset = 0;
  }

  // adjust svg positions
  svg.transition().duration(animspeed).ease("linear")
    .attr("width", width + margin.right)
    .attr("transform", "translate(0," + margin.top + ")");
  svg2.transition().duration(animspeed).ease("linear")
    .attr("width", width2+margin.right)
    .attr("transform", "translate(" + (width+margin.right) + "," + margin.top + ")");

  // update backgrounds
  // ... for current plot
  svg.selectAll(".back").transition().duration(animspeed).ease("linear").attr("width", width);
  // ... for future plot
  svg2.selectAll(".back").transition().duration(animspeed).ease("linear").attr("width", width2);

  // update x axes
  svg.select(".x_axis").transition().duration(animspeed).ease("linear")
    .attr("fill-opacity", 1)
    .attr("transform", "translate(0," + y.range()[0] + ")")
    .call(xAxis);
  svg2.select(".x_axis").transition().duration(animspeed).ease("linear")
    .attr("fill-opacity", 1)
    .attr("transform", "translate(0," + y.range()[0] + ")")
    .call(xAxis2);

  // update horizontal lines
  var ylines = svg.select(".ylines").selectAll(".yline");
  var ylines2 = svg2.select(".ylines").selectAll(".yline");
  ylines.transition().duration(animspeed).ease("linear").attr("x2", width);
  ylines2.transition().duration(animspeed).ease("linear").attr("x2", width2);
  
  // move circles to their appropriate positions
  var curpts = svg.selectAll(".dot").data(data, function(d){return d.name;});
  var avgpts = svg.selectAll(".avg").data(data, function(d){return d.name;});
  var futpts = svg2.selectAll(".dot").data(futureGradeItems, function(d){return d.name});
  var scoretexts = svg.selectAll(".scoretext").data(data, function(d){return d.name});
  var avgScoretexts = svg.selectAll(".avgScoretext").data(data, function(d){return d.name});
  var futureScoretexts = svg2.selectAll(".futureScoretext").data(grade_visualization.storage.dispFutureGradeItems, function(d){return d.name});
  var vertlines = svg.selectAll(".vertline").data(data, function(d){return d.name})
  // ... for current scores
  curpts.transition().duration(animspeed).ease("linear").attr("cx", function(d) { return x(d.name); });
  // ... for current averages
  avgpts.transition().duration(animspeed).ease("linear").attr("cx", function(d) { return x(d.name); });
  // ... for future scores
  futpts.transition().duration(animspeed).ease("linear").attr("cx", function(d) { return x2(d.name); });

  // move static texts
  scoretexts.transition().duration(animspeed).ease("linear")
    .attr("x", function(d){ return x(d.name)-7});
  avgScoretexts.transition().duration(animspeed).ease("linear")
    .attr("x", function(d){ return x(d.name)-7});
  futureScoretexts.transition().duration(animspeed).ease("linear")
    .attr("x", function(d){ return x(d.name)-7});
  if(grade_visualization.properties.zoomed === false) {
    scoretexts.attr("y", function(d,i){return -20 - ((i%2)*20);})
    avgScoretexts.attr("y", function(d,i){return height-1.4*margin.top + ((i%2)*20);})
  }else{
    scoretexts.attr("y", function(d,i){return -20;})
    avgScoretexts.attr("y", function(d,i){return height-1.4*margin.top;})
  }
  // move dashed vertical lines
  vertlines.transition().duration(animspeed).ease("linear")
    .attr("x1", function(d){return x(d.name)})
    .attr("x2", function(d){return x(d.name)});

  // reposition grade bar
  var barXvalue = width;
  svg.selectAll(".gradebar").transition().duration(animspeed).ease("linear").attr("transform", "translate("+width+",0)");
  var bar2Xvalue = width2;
  svg2.selectAll(".bar").transition().duration(animspeed).ease("linear").attr("x", bar2Xvalue);

  // Average Indicators
  // ... for current scores
  var yvalue = y(currentGradeAverage);
  svg.select(".currentAverages").transition().duration(animspeed).ease("linear")
    .attr("transform", "translate("+barXvalue+","+yvalue+")");
  // ... for class average
  svg.select(".classAverages").transition().duration(animspeed).ease("linear")
    .attr("transform", "translate("+barXvalue+","+y(classAverage)+")");
  // ... for all scores
  var y2value = totalGradeAverage;
  if(y2value > 100)
    y2value = y(100);
  else
    y2value = y(y2value);
  svg2.select(".totalAverages").transition().duration(animspeed).ease("linear")
    .attr("transform", "translate("+bar2Xvalue+","+y2value+")")
    .attr("fill-opacity", 1);
};

/*
 * Initialize position variables when drag starts
*/
grade_visualization.scrollstart = function(){
  grade_visualization.properties.anchorX = d3.mouse(this)[0];
  grade_visualization.properties.prevX = grade_visualization.properties.anchorX;
};

/*
 * Implements drag behavior
*/
grade_visualization.scroll = function(){
  prevX = grade_visualization.properties.prevX;
  curX = d3.mouse(this)[0];
  grade_visualization.properties.prevX = curX;
  grade_visualization.properties.velocity = 1*(curX - prevX);
  grade_visualization.shift(curX - grade_visualization.properties.anchorX);
};

/*
 * Set up variable/s for next drag event on drag end
*/
grade_visualization.scrollend = function(){
  grade_visualization.properties.curOffset = grade_visualization.properties.prevOffset;
  grade_visualization.decelerate();
};

/*
 * Implements smooth dragging behavior
*/
grade_visualization.decelerate = function(){
  if(grade_visualization.properties.zoomed === false) { return; }
  var velocity = grade_visualization.properties.velocity;
  grade_visualization.properties.curOffset = grade_visualization.properties.prevOffset;
  grade_visualization.shift(velocity);
  if(velocity > 1 || velocity < -1) {
    setTimeout("grade_visualization.properties.velocity = grade_visualization.properties.velocity / 1.1", 10);
    setTimeout("grade_visualization.decelerate();", 10);
  }
};
