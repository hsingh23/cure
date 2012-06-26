/*
 * Student grade visualization tool
 * Original by Roshanak Zilouchian
*/
// hack to fix load order bug
if(typeof grade_visualization === 'undefined') {
  grade_visualization = {};
}

grade_visualization.storage = {
  gradeItems: [{"name": "hw0", "color": "red", "score": 85, "size": 7, "average": 75, "weight": 9, "tags": ["#hw"]},
               {"name": "lab1", "color": "red", "score": 44, "size": 8, "average": 50, "weight": 7, "tags": ["#lab", "#C++"]},
               {"name": "mp1", "color": "red", "score": 54, "size": 10, "average": 80, "weight": 10, "tags": ["#mp", "#C++"]},
               {"name": "lab2", "color": "red", "score": 100, "size": 8, "average": 84, "weight": 7, "tags": ["#lab", "#debug"]},
               {"name": "lab3", "color": "red", "score": 100, "size": 8, "average": 84, "weight": 7, "tags": ["#lab", "#debug"]},
               {"name": "lab4", "color": "red", "score": 100, "size": 8, "average": 84, "weight": 7, "tags": ["#lab", "#debug"]},
               {"name": "lab5", "color": "red", "score": 100, "size": 8, "average": 84, "weight": 7, "tags": ["#lab", "#debug"]},
               {"name": "lab6", "color": "red", "score": 100, "size": 8, "average": 84, "weight": 7, "tags": ["#lab", "#debug"]},
               {"name": "lab7", "color": "red", "score": 100, "size": 8, "average": 84, "weight": 7, "tags": ["#lab", "#debug"]},
               {"name": "lab8", "color": "red", "score": 100, "size": 8, "average": 84, "weight": 7, "tags": ["#lab", "#debug"]},
               {"name": "lab9", "color": "red", "score": 100, "size": 8, "average": 84, "weight": 7, "tags": ["#lab", "#debug"]},
               {"name": "lab10", "color": "red", "score": 100, "size": 8, "average": 84, "weight": 7, "tags": ["#lab", "#debug"]},
               {"name": "lab11", "color": "red", "score": 100, "size": 8, "average": 84, "weight": 7, "tags": ["#lab", "#debug"]},
               {"name": "lab12", "color": "red", "score": 100, "size": 8, "average": 84, "weight": 7, "tags": ["#lab", "#debug"]},
               {"name": "lab13", "color": "red", "score": 100, "size": 8, "average": 84, "weight": 7, "tags": ["#lab", "#debug"]},
               {"name": "lab14", "color": "red", "score": 100, "size": 8, "average": 84, "weight": 7, "tags": ["#lab", "#debug"]},
               {"name": "lab15", "color": "red", "score": 100, "size": 8, "average": 84, "weight": 7, "tags": ["#lab", "#debug"]},
               {"name": "lab16", "color": "red", "score": 100, "size": 8, "average": 84, "weight": 7, "tags": ["#lab", "#debug"]},
               {"name": "lab17", "color": "red", "score": 100, "size": 8, "average": 84, "weight": 7, "tags": ["#lab", "#debug"]},
               {"name": "lab18", "color": "red", "score": 91, "size": 8, "average": 81, "weight": 7, "tags": ["#lab", "#debug"]}], // completed grade data
  futureGradeItems: [{"name": "exam1", "color": "#2ca02c", "score": 100, "size": 10, "weight": 10, "tags": ["#exam", "#C++"]},
                     {"name": "mp2", "color": "#2ca02c", "score": 100, "size": 5, "weight": 5, "tags": ["#mp", "#linked list"]},
                     {"name": "lab19", "color": "#2ca02c", "score": 100, "size": 5, "weight": 5, "tags": ["#lab", "#linked list"]},
                     {"name": "mp3", "color": "#2ca02c", "score": 100, "size": 5, "weight": 5, "tags": ["#mp", "#linked list"]},
                     {"name": "mp4", "color": "#2ca02c", "score": 100, "size": 5, "weight": 5, "tags": ["#mp", "#linked list"]},
                     {"name": "mp5", "color": "#2ca02c", "score": 100, "size": 5, "weight": 5, "tags": ["#mp", "#linked list"]},
                     {"name": "mp6", "color": "#2ca02c", "score": 100, "size": 5, "weight": 5, "tags": ["#mp", "#linked list"]},
                     {"name": "lab20", "color": "#2ca02c", "score": 100, "size": 5, "weight": 5, "tags": ["#lab", "#linked list"]},
                     {"name": "lab21", "color": "#2ca02c", "score": 100, "size": 5, "weight": 5, "tags": ["#lab", "#debug"]},
                     {"name": "final", "color": "#2ca02c", "score": 100, "size": 15, "weight": 40, "tags": ["#exam"]}],  // upcoming (editable) grade data
  dispGradeItems: [],          // grade subdata to be displayed
  dispFutureGradeItems: [],    // upcoming subdata to be displayed
  currentGrade: 0,             // current accumulated weighted score
  maxPoints: 0,                // total possible score
  foundTags: [],               // list of all possible entry tags
  tagList: [],                 // current list of displayed tags
  // grade cutoffs
  gradeBars: [{"name": "F", "mingrade": 0, "maxgrade": 52, "color": "#d62728"}, 
                   {"name": "D", "mingrade": 52, "maxgrade": 64, "color": "#e47c7d"}, 
                   {"name": "C", "mingrade": 64, "maxgrade": 76, "color": "#ff7f0e"}, 
                   {"name": "B", "mingrade": 76, "maxgrade": 88, "color": "#99d099"}, 
                   {"name": "A", "mingrade": 88, "maxgrade": 100, "color": "#2ca02c"}]
}

grade_visualization.properties = {
  // dimension, size, and speed constants
  stageWidth: 0,      // width of center display
  plotWidth: 0,       // sum of the widths of the 2 plots
  padding: 80,        // CONSTANT: vertical padding for computing height
  n: 0,               // number of completed grades to be displayed
  n2: 0,              // number of future grades to be displayed
  columnWidth: 50,    // CONSTANT: width of a grade column when zoomed in
  rowWidth: 3,        // CONSTANT: height of a row
  margin: {top: 70, right: 40, bottom: 70, left: 40}, // CONSTANTS: margins
  width: 0,           // zoomed out width of the completed grades plot
  width2: 0,          // zoomed out width of the future grades plot
  zoomWidth: 0,       // zoomed in width of the respective plots (above)
  zoomWidth2: 0,      // ...
  height: 0,          // height of the plots, computed by the rowWidth and padding constants
  animspeed: 1000,    // CONSTANT: animation speed (in ms) for transitions between displays of different data sets
  zoomspeed: 100,     // CONSTANT: animation speed for zooming in and out

  // globals for zoom and drag behavior
  inanim: false,      // boolean indicating if the plots are in the middle of a transition
  zoomed: false,      // boolean indicating if the plots are "zoomed in"
  prevX: 0,           // variable used for computing velocity when the plot is dragged
  curOffset: 0,       // current position of the plots when zoomed in
  prevOffset: 0,      // position of zoomed plots before drag was initiated
  anchorX: 0,         // x position where the drag was initiated
  velocity: 0,        // speed and direction of mouse drag

  tagX: 0,            // coordinates for placing the next tag
  tagY: 0             // ...
}

// Helper functions to create and move elements
grade_visualization.helpers = {
  /*
   * Define axis functions
  */
  axis_def: function(x, y, x2){
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(3)
      .tickPadding(8);
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(3)
      .tickPadding(8);
    var xAxis2 = d3.svg.axis()
      .scale(x2)
      .orient("bottom")
      .tickSize(3)
      .tickPadding(8);
    return [xAxis, yAxis, xAxis2]
  },

  /*
   * Populate page with svg/group containers and buttons
  */
  gfx_def: function() {
    var body = d3.select("#tool_container");
    body = body.append("div")
      .attr("class", "tool_container")
    // instructional text
    body.append("p")
      .text("Points on the left are your completed grades, displayed with the class averages of each assignment. \
        Your current grade and class average are shown on the center bar. Points on the right are upcoming assignments. \
        Drag and drop upcoming assignments to predict your final grade.");
    // y-axis
    body.append("svg:svg")
      .attr("width", 1.3*grade_visualization.properties.margin.left)
      .attr("height", grade_visualization.properties.height)
      .attr("class", "ysvg")
      .attr("transform", "translate(0," + grade_visualization.properties.margin.top + ")");
    // plots container
    var base = body.append("svg:svg")
      .attr("width", grade_visualization.properties.stageWidth)
      .attr("height", grade_visualization.properties.height)
      .attr("class", "grade_vis");
    // inner plots container
    var plotbase = base.append("g")
      .attr("width", grade_visualization.properties.stageWidth)
      .attr("height", grade_visualization.properties.height)
      .attr("class", "plotbase");
    // current plot
    plotbase.append("g")
      .attr("width", grade_visualization.properties.width + grade_visualization.properties.margin.right)
      .attr("height", grade_visualization.properties.height)
      .attr("class", "dot_chart")
      .attr("transform", "translate(0," + grade_visualization.properties.margin.top + ")");
    // future plot
    plotbase.append("g")
      .attr("width", grade_visualization.properties.width)
      .attr("height", grade_visualization.properties.height)
      .attr("class", "future_dot_chart")
      .attr("transform", "translate(" + (grade_visualization.properties.width+grade_visualization.properties.margin.right) + "," + grade_visualization.properties.margin.top + ")");
    body.append("svg:svg")
      .attr("width", 1.3*grade_visualization.properties.margin.right)
      .attr("height", grade_visualization.properties.height)
      .attr("class", "barsvg")
      .attr("transform", "translate(0," + grade_visualization.properties.margin.top + ")");
    // instructions for tags
    body.append("p")
      .text("Select tags and click \"Apply filters\" to see only grades containing those tags:");
    // tag filter
    body.append("svg:svg")
      .attr("width", window.innerWidth - grade_visualization.properties.margin.left - grade_visualization.properties.margin.right)
      .attr("height", 5*(grade_visualization.storage.foundTags.length % 10))
      .attr("class", "tagsvg");
    // tag filter buttons
    var buttons = body.append("form")
    buttons.append("input")
      .attr("type", "button")
      .attr("value", "Select All")
      .attr("onClick", "grade_visualization.selectAll()");
    buttons.append("input")
      .attr("type", "button")
      .attr("value", "Select None")
      .attr("onClick", "grade_visualization.selectNone()");
    buttons.append("input")
      .attr("type", "button")
      .attr("value", "Apply Filters")
      .attr("onClick", "grade_visualization.showSelected()");
  },

  /*
   * Add static instructional texts
  */
  ins_text: function() {
    var ysvg = d3.select(".tool_container").select(".ysvg");
    ysvg.append("text")
      .text("Your")
      .attr("x", 0)
      .attr("y", 40)
      .append("tspan")
        .text("Scores:")
        .attr("x", 0)
        .attr("dy", 15);
    ysvg.append("text")
      .text("Class")
      .attr("x", 0)
      .attr("y", grade_visualization.properties.height-2*grade_visualization.properties.margin.top/3)
      .append("tspan")
        .text("Averages:")
        .attr("font-size", 11)
        .attr("x", 0)
        .attr("dy", 15)
  },

  /*
   * Draw tags to page
  */
  ins_tags: function() {
    var tagGroup = d3.select(".tool_container").select(".tagsvg").selectAll(".tag").data(grade_visualization.storage.foundTags, function(d){return d;}).enter().append("g")
      .attr("width", function(d){return 30+d.length*10})
      .attr("height", 20)
      .attr("class", "tag")
      .attr("id", function(d,i){return d;})
      .attr("fill-opacity", 0)
      .attr("transform", "translate(0,0)")
      .on("mouseover", function(){d3.select(this).select(".bound").style("fill-opacity", .7);})
      .on("mouseout", function(){d3.select(this).select(".bound").style("fill-opacity", 1);})
      .on("click", function(d,i){
        var base = d3.select(this);
        var idx = grade_visualization.storage.tagList.indexOf(d);
        if(idx !== -1) {
          base.select(".bound").attr("fill", "#FF6666");
          base.select(".check").attr("stroke-opacity", 0);
          grade_visualization.storage.tagList.splice(idx, 1);
        }else{
          base.select(".bound").attr("fill", "lightgreen");
          base.select(".check").attr("stroke-opacity", 1);
          grade_visualization.storage.tagList.push(d);
        }
      });
    tagGroup.append("svg:rect")
      .attr("class", "bound")
      .attr("width", function(d){return 30+d.length*10})
      .attr("height", 20)
      .attr("x", 20)
      .attr("y", 3)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", "lightgreen")
      .attr("fill-opacity", 1)
      .attr("stroke", "black")
      .attr("stroke-width", 2);
    tagGroup.append("svg:text")
      .text(function(d){return d;})
      .attr("class", "tagText")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("x", 50)
      .attr("y", 17);
    tagGroup.append("svg:path")
      .attr("class", "check")
      .attr("d", "M25,12 L30,18 40,7")
      .attr("fill-opacity", 0)
      .attr("stroke", "green")
      .attr("stroke-width", 4);

    // animate in tags list
    tagGroup.transition().duration(grade_visualization.properties.animspeed)
      .attr("fill-opacity", 1)
      .attr("transform", function(d,i){
        var curWidth = parseInt((parseInt(this.getAttribute("width"))+10));
        if(grade_visualization.properties.tagX + curWidth > window.innerWidth - grade_visualization.properties.margin.left - grade_visualization.properties.margin.right) {
          grade_visualization.properties.tagX = 0;
          grade_visualization.properties.tagY += 5;
        }
        var retval = "translate(" + grade_visualization.properties.tagX + "," + grade_visualization.properties.tagY + ")";
        grade_visualization.properties.tagX += curWidth;
        return retval;
      });
  },

  /*
   * Draw plot elements (background, axes, horizontal lines) to page
  */
  ins_plot: function(xAxis, yAxis, xAxis2, y) {
    // draw backgrounds
    // ... for current plot
    var base = d3.select(".tool_container");
    var svg = base.select(".grade_vis").select(".plotbase").select(".dot_chart");
    var svg2 = base.select(".grade_vis").select(".plotbase").select(".future_dot_chart");
    var ysvg = base.select(".ysvg")
    svg.selectAll(".back").data(grade_visualization.storage.gradeBars)
      .enter().append("svg:rect")
        .attr("class", "back")
        .attr("fill", "white")//function(d) { return d.color; })
        .attr("fill-opacity", .5)
        .attr("width", 0)
        .attr("height", function(d) { return y(d.mingrade) - y(d.maxgrade);})
        .attr("x", 0)
        .attr("y", function(d) { return y(d.maxgrade);})
    // ... for future plot
    svg2.selectAll(".back").data(grade_visualization.storage.gradeBars)
      .enter().append("svg:rect")
        .attr("class", "back")
        .attr("fill", "white")//function(d) { return d.color; })
        .attr("fill-opacity", .5)
        .attr("width", 0)
        .attr("height", function(d) { return y(d.mingrade) - y(d.maxgrade);})
        .attr("x", 0)
        .attr("y", function(d) { return y(d.maxgrade);})

    // draw axes
    svg.append("g")
      .attr("class", "x_axis")
      .attr("fill-opacity", 0)
      .attr("transform", "translate(0," + y.range()[0] + ")")
      .call(xAxis);
    ysvg.append("g")
      .attr("class", "y_axis")
      .attr("transform", "translate(" + 1.3*grade_visualization.properties.margin.left + "," + grade_visualization.properties.margin.top + ")")
      .call(yAxis);
    svg2.append("g")
      .attr("class", "x_axis")
      .attr("fill-opacity", 0)
      .attr("transform", "translate(0," + y.range()[0] + ")")
      .call(xAxis2);

    // draw horizontal lines
    var ylines = svg.append("g").attr("class", "ylines");
    var ylines2 = svg2.append("g").attr("class", "ylines")
    for(var i = 0; i <= 100; i+=10) {
      ylines.append("svg:line")
        .attr("x1", 0)
        .attr("y1", y(i))
        .attr("x2", 0)
        .attr("y2", y(i))
        .attr("class", "yline")
        .attr("stroke-width", 1)
        .attr("stroke", "#777777");
      ylines2.append("svg:line")
        .attr("x1", 0)
        .attr("y1", y(i))
        .attr("x2", 0)
        .attr("y2", y(i))
        .attr("class", "yline")
        .attr("stroke-width", 1)
        .attr("stroke", "#777777");
    }
  },

  /*
   * Draw grade bars and grade indicators to page
  */
  ins_bar: function(y) {
    // draw grade bars
    // ... for current scores
    var margin = grade_visualization.properties.margin;
    var height = grade_visualization.properties.height;
    var gradeBars = grade_visualization.storage.gradeBars;
    var svg = d3.select(".tool_container").select(".grade_vis").select(".dot_chart");
    var barsvg = d3.select(".tool_container").select(".barsvg");
    var barvis = svg.append("g")
      .attr("class", "gradebar")
      .attr("fill-opacity", 0)
      .attr("x", -margin.right);
    barvis.selectAll(".bar").data(gradeBars)
      .enter().append("svg:rect")
        .attr("class", "bar")
        .attr("fill", function(d) { return d.color; })
        .attr("stroke-width", 1.5)
        .attr("stroke", "#484848")
        .attr("width", margin.left)
        .attr("height", function(d) { return y(d.mingrade) - y(d.maxgrade);})
        .attr("y", function(d) { return y(d.maxgrade);})
        .append("svg:title")
          .text(function(d) { return "grade: " + d.name; });
    // ... for future scores
    barsvg.selectAll(".bar").data(gradeBars)
      .enter().append("svg:rect")
        .attr("class", "bar")
        .attr("fill", function(d) { return d.color; })
        .attr("fill-opacity", 0)
        .attr("stroke-width", 1.5)
        .attr("stroke", "#484848")
        .attr("stroke-opacity", 0)
        .attr("width", margin.right)
        .attr("height", function(d) { return y(d.mingrade) - y(d.maxgrade); })     
        .attr("x", -margin.right)
        .attr("y", function(d) { return margin.top + y(d.maxgrade);})
        .append("svg:title")
          .text(function(d) { return "grade: " + d.name; });

    // display scores
    // user scores
    barvis.append("text")
      .text("Your")
      .attr("font-size", 14)
      .attr("x", 0)
      .attr("y", -40)
      .append("tspan")
        .text("Average")
        .attr("font-size", 12)
        .attr("x", 0)
        .attr("dy", 15);
    barvis.append("text")
      .text("100")
      .attr("class", "avgtext")
      .attr("font-size", 14)
      .attr("x", 0)
      .attr("y", -margin.top/10);
    // ... for class average
    barvis.append("text")
      .text("Class")
      .attr("font-size", 14)
      .attr("x", 0)
      .attr("y", height-margin.top-margin.bottom+17)
      .append("tspan")
        .text("Average")
        .attr("font-size", 12)
        .attr("x", 0)
        .attr("dy", 15);
    barvis.append("text")
      .text("100")
      .attr("class", "classavgtext")
      .attr("font-size", 14)
      .attr("x", 0)
      .attr("y", height-margin.top-margin.bottom+50);
    // ... for total average
    barsvg.append("text")
      .text("Final")
      .attr("font-size", 14)
      .attr("x", 0)
      .attr("y", margin.top/4)
      .append("tspan")
        .text("Estimated")
        .attr("font-size", 11)
        .attr("x", 0)
        .attr("dy", 15)
      .append("tspan")
        .text("Average")
        .attr("font-size", 12)
        .attr("x", 0)
        .attr("dy", 15)
    barsvg.append("text")
      .text("100")
      .attr("class", "avgtext")
      .attr("font-size", 14)
      .attr("x", 0)
      .attr("y", margin.top-5);

    // add text to grade bars
    // ... for current scores
    barvis.selectAll(".text").data(gradeBars)
      .enter().append("svg:text")
        .attr("class", "text")
        .text(function(d) { return d.name; })
        .attr("font-family", "sans-serif")
        .attr("x", margin.right/2-3)
        .attr("y", function(d) { return y(d.maxgrade)+(y(d.mingrade) - y(d.maxgrade))/2+5;});
    barsvg.selectAll(".text").data(gradeBars)
      .enter().append("svg:text")
        .attr("class", "text")
        .text(function(d) { return d.name; })
        .attr("font-family", "sans-serif")
        .attr("fill-opacity", 0)
        .attr("x", margin.right/2-3)
        .attr("y", function(d) { return margin.top + y(d.maxgrade)+(y(d.mingrade) - y(d.maxgrade))/2+5;});

    // animate in total grade bar
    barsvg.selectAll(".bar").transition().duration(grade_visualization.properties.animspeed)
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1)
      .attr("x", 0);

    // average indicators
    // ... for class averages
    var classAvgmark = svg.append("g")
      .attr("class", "classAverages")
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .attr("transform", "translate("+(-margin.left)+",0)");
    classAvgmark.append("svg:polygon") 
      .attr("class", "classAverage1")
      .attr("fill", "gray")
      .attr("stroke", "black")
      .attr("points", "1,-5 10,0 1,5");
    classAvgmark.append("svg:polygon") 
      .attr("class", "classAverage2")
      .attr("fill", "gray")
      .attr("stroke", "black")
      .attr("points",  (margin.right-1) + ",-5 " + (margin.right-10) + ",0 " + (margin.right-1) + ",5");
    // ... for current grades
    var yvalue = 0;
    var avgmark = svg.append("g")
      .attr("class", "currentAverages")
      .attr("fill-opacity", 0)
      .attr("transform", "translate("+(-margin.left)+",0)")
    avgmark.append("svg:polygon") 
      .attr("class", "currentAverage1")
      .attr("fill", "black")
      .attr("stroke", "gray")
      .attr("stroke-opacity", 0)
      .attr("points", "1,-5 10,0 1,5");
    avgmark.append("svg:polygon") 
      .attr("class", "cuurentAverage2")
      .attr("fill", "black")
      .attr("stroke", "gray")
      .attr("stroke-opacity", 0)
      .attr("points",  (margin.right-1) + ",-5 " + (margin.right-10) + ",0 " + (margin.right-1) + ",5");
    //Total Average grade indicators
    avgmark = barsvg.append("g")
      .attr("class", "totalAverages")
      .attr("fill-opacity", 0)
      .attr("transform", "translate("+(-margin.left)+",0)")
    avgmark.append("svg:polygon") 
      .attr("class", "totalAverage1")
      .attr("fill", "black")
      .attr("stroke", "gray")
      .attr("stroke-opacity", 0)
      .attr("points", "1,-5 10,0 1,5");
    avgmark.append("svg:polygon") 
      .attr("class", "totalAverage2")
      .attr("fill", "black")
      .attr("stroke", "gray")
      .attr("stroke-opacity", 0)
      .attr("points",  (margin.right-1) + ",-5 " + (margin.right-10) + ",0 " + (margin.right-1) + ",5");
  },

  /*
   * Compute scores based on selected grade items
  */
  findScores:function(gradeItems, futureGradeItems){
    // ... current
    var currentGrade = 0;
    var currentTotalPoints = 0;
    var classAverage = 0;
    for(var i in gradeItems){
      currentGrade += gradeItems[i].score * gradeItems[i].weight / 100;
      currentTotalPoints += gradeItems[i].weight;
      classAverage += gradeItems[i].average * gradeItems[i].weight / 100;
    }
    grade_visualization.storage.currentGrade = currentGrade;
    // ... future
    var totalGrade = currentGrade;
    var totalPoints = currentTotalPoints;
    for(var i in futureGradeItems){
      totalGrade += futureGradeItems[i].score * futureGradeItems[i].weight / 100;
      totalPoints += futureGradeItems[i].weight;
    }
    var currentGradeAverage = currentGrade/currentTotalPoints * 100;
    var totalGradeAverage = totalGrade / totalPoints * 100;
    classAverage = classAverage / currentTotalPoints * 100;
    grade_visualization.storage.maxPoints = totalPoints;
    return [currentGradeAverage, totalGradeAverage, classAverage];
  },

  /*
   * Write scores above each grade item
  */
  setTexts:function(textname, scoretexts, yval, x){
    scoretexts.enter().append("text")
      .text(function(d){return d.score})
      .attr("class", textname)
      .attr("fill-opacity", 0)
      .attr("x", 0)
      .attr("font-size", 12)
      .attr("y", yval);
    scoretexts.transition().duration(grade_visualization.properties.animspeed)
      .attr("fill-opacity", 1)
      .attr("x", function(d){return x(d.name)-7;})
      .attr("y", yval);
    scoretexts.exit().transition().duration(grade_visualization.properties.animspeed)
      .attr("fill-opacity", 0)
      .attr("y", grade_visualization.properties.height)
        .remove();
  },

  /*
   * Generates tags list
  */
  getTags:function(){
    var gradeItems = grade_visualization.storage.gradeItems;
    var futureGradeItems = grade_visualization.storage.futureGradeItems;
    var tagList = {};
    // Use an associative array to avoid duplicates
    for(var i = 0; i < gradeItems.length; i++) {
      for(var j = 0; j < gradeItems[i].tags.length; j++) {
        if(tagList[gradeItems[i].tags[j]] === undefined) {
          tagList[gradeItems[i].tags[j]] = gradeItems[i].tags[j];
        }
      }
    }
    for(var i = 0; i < futureGradeItems.length; i++) {
      for(var j = 0; j < futureGradeItems[i].tags.length; j++) {
        if(tagList[futureGradeItems[i].tags[j]] === undefined) {
          tagList[futureGradeItems[i].tags[j]] = futureGradeItems[i].tags[j];
        }
      }
    }
    for (var i in tagList) {
      grade_visualization.storage.tagList.push(tagList[i]);
      grade_visualization.storage.foundTags.push(tagList[i]);
    }
  },

  /*
   * Updates displayed grades based on selected tags
  */
  updateGrades:function(){
    var gradeItems = grade_visualization.storage.gradeItems;
    var futureGradeItems = grade_visualization.storage.futureGradeItems;
    grade_visualization.storage.dispGradeItems = [];
    grade_visualization.storage.dispFutureGradeItems = [];

    // set up associative array
    var tagList = {};
    for (var i in grade_visualization.storage.tagList) {
      tagList[grade_visualization.storage.tagList[i]] = i;
    }

    for(var i in gradeItems) {
      var j = 0;
      while(j < gradeItems[i].tags.length) {
        if(tagList[gradeItems[i].tags[j]] !== undefined) {
          grade_visualization.storage.dispGradeItems.push(gradeItems[i])
          break;
        }
        j++;
      }
    }
    for(var i in futureGradeItems) {
      var j = 0;
      while(j < futureGradeItems[i].tags.length) {
        if(tagList[futureGradeItems[i].tags[j]] !== undefined) {
          grade_visualization.storage.dispFutureGradeItems.push(futureGradeItems[i])
          break;
        }
        j++;
      }
    }

    grade_visualization.updatePlots();
  }
}

/*
 * Recalculates dimensions of various svg elements according to currently shown data
*/
grade_visualization.resize = function(){
  var base = grade_visualization.properties;
  base.n = grade_visualization.storage.dispGradeItems.length;
  base.n2 = grade_visualization.storage.dispFutureGradeItems.length;
  base.width = base.n / (base.n+base.n2) * base.plotWidth;
  base.width2 = base.n2 / (base.n+base.n2) * base.plotWidth;
  base.zoomWidth = base.columnWidth * base.n;
  base.zoomWidth2 = base.columnWidth * base.n2;
  base.height = base.rowWidth*100 + base.padding;
}

/*
 * Initializes page data and graphics
*/
grade_visualization.initPage = function(){
  // build data arrays
  // TODO: uncomment the following line to run with server data
  // request_grades();

  //console.log("I've reached initPage.");

  // show error if no grades are found
  if(grade_visualization.storage.gradeItems.length === 0 && grade_visualization.storage.futureGradeItems.length === 0) {
    alert("No grades found!");
    return;
  }

  // get screen dimensions
  //grade_visualization.properties.stageWidth = ;
  //alert(document.getElementById("tool_container").offsetWidth)
  grade_visualization.properties.stageWidth = document.getElementById("tool_container").offsetWidth - (2*grade_visualization.properties.margin.left) - (2*grade_visualization.properties.margin.right);
  var stageWidth = grade_visualization.properties.stageWidth;
  grade_visualization.properties.plotWidth = stageWidth - grade_visualization.properties.margin.right;

  // declare local variables for convenience
  var gradeItems = grade_visualization.storage.gradeItems;
  var futureGradeItems = grade_visualization.storage.futureGradeItems;
  var data = gradeItems;
  var gradeBars = grade_visualization.storage.gradeBars;

  // default behavior: set display to show all grades
  // TODO: change this to display only #grade tags or whatever we decide
  grade_visualization.storage.dispGradeItems = gradeItems;
  grade_visualization.storage.dispFutureGradeItems = futureGradeItems;

  // size and edge properties
  this.resize();
  var padding = grade_visualization.properties.padding,
      n = grade_visualization.properties.n,
      n2 = grade_visualization.properties.n2,  
      columnWidth = grade_visualization.properties.columnWidth,
      rowWidth = grade_visualization.properties.rowWidth;
  var margin = grade_visualization.properties.margin,
      width = grade_visualization.properties.width,
      width2 = grade_visualization.properties.width2,
      height = grade_visualization.properties.height;

  // tags will be constant, so get them now
  grade_visualization.helpers.getTags();

  // define axes functions
  // ... x function for the current grade plot
  var x = d3.scale.ordinal()
    .domain($.map(grade_visualization.storage.dispGradeItems, function(gradeItem) { return gradeItem.name; }))
    .rangePoints([0, 0], 1.0);
  // ... y function works for both plots
  var y = d3.scale.linear()
    .domain([0,100])
    .range([height - margin.top - margin.bottom, 0],1.0);
  // ... x function for the future grade plot
  var x2 = d3.scale.ordinal()
    .domain($.map(grade_visualization.storage.dispFutureGradeItems, function(gradeItem) { return gradeItem.name; }))
    .rangePoints([0, 0], 1.0);

  // define axes
  var axes = grade_visualization.helpers.axis_def(x, y, x2);
  axes[0].tickValues([]);
  axes[2].tickValues([]);

  // populate page with elements
  grade_visualization.helpers.gfx_def();
  var base = d3.select(".tool_container").select(".grade_vis");

  grade_visualization.helpers.ins_text();
  grade_visualization.helpers.ins_tags();
  grade_visualization.helpers.ins_plot(axes[0], axes[1], axes[2], y);
  grade_visualization.helpers.ins_bar(y);

  // define mouse events
  // TODO: remove these or add functionality to these in productions  
 /* $("body > svg.grade_vis").mouseenter(function(e){
  });
  $("body > svg.grade_vis").mouseleave(function(e){
  });
  $("body > svg.grade_vis").mousedown(function(e){
  });*/
  base.call(d3.behavior.drag()
    .on("dragstart", grade_visualization.scrollstart)
    .on("drag", grade_visualization.scroll)
    .on("dragend", grade_visualization.scrollend));
  base.on("dblclick", function(){
    // don't resize if the data set is small enough
    if(grade_visualization.properties.plotWidth - grade_visualization.properties.zoomWidth - grade_visualization.properties.zoomWidth2 > 0) {
      return;
    }else{
      return grade_visualization.zoom();
    }
  });

  // update view for the first time
  grade_visualization.updatePlots();
}

/*
 * Updates plots for current filter selection with animations
*/
grade_visualization.updatePlots = function(){
  // declare local variables for convenience
  var animspeed = grade_visualization.properties.animspeed;
  var gradeItems = grade_visualization.storage.dispGradeItems;
  var futureGradeItems = grade_visualization.storage.dispFutureGradeItems;
  var data = gradeItems;
  var gradeBars = grade_visualization.storage.gradeBars;
  var svg = d3.select(".tool_container").select(".grade_vis").select(".plotbase").select(".dot_chart");
  var svg2 = d3.select(".tool_container").select(".grade_vis").select(".plotbase").select(".future_dot_chart");
  var barsvg = d3.select(".tool_container").select(".barsvg");

  // error if no tags are selected
  if(gradeItems.length === 0 && futureGradeItems.length === 0) {
    alert("No tags selected!");
    grade_visualization.storage.dispGradeItems = grade_visualization.storage.gradeItems;
    grade_visualization.storage.dispFutureGradeItems = grade_visualization.storage.futureGradeItems;
    return;
  }

  // prevent overlapping animations
  if(grade_visualization.properties.inanim === true) {
    return;
  }
  grade_visualization.properties.inanim = true;
  setTimeout("grade_visualization.properties.inanim = false;", animspeed);

  // compute necessary dimensions for selected data
  this.resize();
  var padding = grade_visualization.properties.padding,
      n = grade_visualization.properties.n,
      n2 = grade_visualization.properties.n2,  
      columnWidth = grade_visualization.properties.columnWidth,
      rowWidth = grade_visualization.properties.rowWidth;
  var margin = grade_visualization.properties.margin,
      width = grade_visualization.properties.width,
      width2 = grade_visualization.properties.width2,
      height = grade_visualization.properties.height;

  var grades = grade_visualization.helpers.findScores(gradeItems, futureGradeItems);
  var currentGradeAverage = grades[0];
  var totalGradeAverage = grades[1];
  var classAverage = grades[2];

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
  var axes = grade_visualization.helpers.axis_def(x, y, x2);
  var xAxis = axes[0];
  var yAxis = axes[1];
  var xAxis2 = axes[2];
  // show tick values if the data set is small enough
  if(grade_visualization.properties.plotWidth - grade_visualization.properties.zoomWidth - grade_visualization.properties.zoomWidth2 > 0) {
    grade_visualization.properties.zoomed = false;
  }else{
    xAxis.tickValues([]);
    xAxis2.tickValues([]);
    grade_visualization.properties.curOffset = 0;
    grade_visualization.properties.prevOffset = 0;
  }

  // adjust svg size
  svg.transition().duration(animspeed)
    .attr("width", width + margin.right)
    .attr("transform", "translate(0," + margin.top + ")");
  svg2.transition().duration(animspeed)
    .attr("width", width2)
    .attr("transform", "translate(" + (width+margin.right) + "," + margin.top + ")");

  // update backgrounds
  // ... for current plot
  svg.selectAll(".back").transition().duration(animspeed)
    .attr("fill-opacity", .4)
    .attr("width", width);
  // ... for future plot
  svg2.selectAll(".back").transition().duration(animspeed)
    .attr("fill-opacity", .4)
    .attr("width", width2);

  // update x axes
  svg.select(".x_axis").transition().duration(animspeed)
    .attr("fill-opacity", 1)
    .attr("transform", "translate(0," + y.range()[0] + ")")
    .call(xAxis);
  svg2.select(".x_axis").transition().duration(animspeed)
    .attr("fill-opacity", 1)
    .attr("transform", "translate(0," + y.range()[0] + ")")
    .call(xAxis2);

  // update horizontal lines
  var ylines = svg.select(".ylines").selectAll(".yline");
  var ylines2 = svg2.select(".ylines").selectAll(".yline");
  ylines.transition().duration(animspeed)
    .attr("stroke-opacity", 1).attr("x2", width);
  ylines2.transition().duration(animspeed)
    .attr("stroke-opacity", 1).attr("x2", width2);

  // vertical lines for each score
  var vertlines = svg.selectAll(".vertline").data(data, function(d){ return d.name; })
  vertlines.enter().append("line")
    .attr("class", "vertline")
    .attr("x1", -margin.right)
    .attr("y1", -10)
    .attr("x2", -margin.right)
    .attr("y2", 0)
    .style("stroke-dasharray", "3,3")
    .attr("stroke-opacity", .5)
    .attr("stroke", "black");
  vertlines.transition().duration(animspeed)
    .attr("x1", function(d){return x(d.name)})
    .attr("y2", height - margin.top - margin.bottom + 10)
    .attr("x2", function(d){return x(d.name)});
  vertlines.exit().transition().duration(animspeed)
    .attr("x1", -margin.left)
    .attr("x2", -margin.left)
      .remove();

  // draw new circles
  // ... for current scores
  var curpts = svg.selectAll(".dot").data(data, function(d){return d.name;})
  var curEnter = curpts.enter().append("svg:circle")
    .attr("class", "dot")
    .attr("fill", function(d) { return d.color; })
    .attr("fill-opacity", 0)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("stroke-opacity", 0)
    .attr("cx", -2*margin.left)
    .attr("cy", function(d) { return y(d.score); })
    .attr("r", function(d) { return d.size; })
    .on("mouseover", function(){d3.select(this).style("fill-opacity", .7).style("stroke-opacity", .5);})
    .on("mouseout", function(){d3.select(this).style("fill-opacity", 1).style("stroke-opacity", 1);})
    .append("svg:title")
      .text(function(d) { return "grade: " + d.score; });
  // ... for current averages
  var avgpts = svg.selectAll(".avg").data(data, function(d){return d.name;})
  var avgEnter = avgpts.enter().append("circle")
    .attr("class", "avg")
    .attr("fill", "lightgray")
    .attr("fill-opacity", 0)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("stroke-opacity", 0)
    .attr("cx", -2*margin.left)
    .attr("cy", function(d) { return y(d.average); })
    .attr("r", function(d) { return d.size-1; })
    .on("mouseover", function(){d3.select(this).style("fill-opacity", .7).style("stroke-opacity", .5);})
    .on("mouseout", function(){d3.select(this).style("fill-opacity", 1).style("stroke-opacity", 1);})
    .append("svg:title")
      .text(function(d) { return "average: " + d.average.toFixed(2); });
  // ... for future scores
  var futpts = svg2.selectAll(".dot").data(futureGradeItems, function(d){return d.name})
  var futEnter = futpts.enter().append("svg:circle")
    .attr("class", "dot")
    .attr("fill", function(d) { return d.color; })
    .attr("fill-opacity", 0)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("stroke-opacity", 0)
    .attr("cx", -width-2*margin.left)
    .attr("cy", function(d) { return y(d.score); })
    .attr("r", function(d) { return d.size; })
    .on("mouseover", function(){d3.select(this).style("fill-opacity", .7);})
    .on("mouseout", function(){d3.select(this).style("fill-opacity", 1);}) 
    .call(d3.behavior.drag()
    .on("dragstart", function(d) {
      this.__origin__ = [x2(d.name), y(d.score)];
      /*svg2.select(".tooltiptext").remove();
      svg2.append("svg:text")
        .attr("class", "tooltiptext")
        .text(d.score.toFixed(2))
        .attr("font-family", "sans-serif")
        .attr("x", x2(d.name) - 10)
        .attr("y", y(d.score) - 20);*/
    })
    .on("drag", function(d) {
      var cx = Math.min(width2, Math.max(0, this.__origin__[0] += d3.event.dx));
      var cy = Math.min(y.range()[0], Math.max(0, this.__origin__[1] += d3.event.dy));
      //updating the score and color when dragged
      d.score = Math.floor(y.invert(cy));
      if(d.score < 50)
        d.color = "#d62728";
      else if (d.score < 75)
        d.color = "#ff7f0e";
      else 
        d.color = "#2ca02c";
      d3.select(this).attr("cy", cy).attr("fill", function(d) { return d.color; });
      
      // update score text in the dot column
      svg2.selectAll(".futureScoretext")
        .text(function(d){ return d.score.toFixed(0); })

      /*//Tooltip next to the moving dot
      svg2.select(".tooltiptext").text(d.score.toFixed(0))
        .attr("y", y(d.score) - 20);*/
   
      //Updating the total average triangles
      var avg = grade_visualization.storage.currentGrade;
      for(i = 0; i < grade_visualization.storage.dispFutureGradeItems.length; i++){
        avg += grade_visualization.storage.dispFutureGradeItems[i].score*grade_visualization.storage.dispFutureGradeItems[i].weight/100; 
      }
      avg = avg / grade_visualization.storage.maxPoints * 100;
      barsvg.select(".avgtext").text(avg.toFixed(2));

      yvalue = avg;
      if(yvalue > 100)
        yvalue = y(100);
      else
        yvalue = y(yvalue);

      barsvg.select(".totalAverages")
        .attr("transform", "translate(0,"+(margin.top+yvalue)+")");

    })
    .on("dragend", function() {
      //svg2.select(".tooltiptext").remove();
      delete this.__origin__;
    }));
  
  // static texts for each score
  // ... current
  var scoretexts = svg.selectAll(".scoretext").data(data, function(d){ return d.name; });
  grade_visualization.helpers.setTexts("scoretext", scoretexts, -20, x);
  // ... average
  var avgScoretexts = svg.selectAll(".avgScoretext").data(data, function(d){ return d.name; });
  grade_visualization.helpers.setTexts("avgScoretext", avgScoretexts, height-1.4*margin.top, x);
  // ... future
  var futureScoretexts = svg2.selectAll(".futureScoretext").data(grade_visualization.storage.dispFutureGradeItems, function(d){ return d.name; })
  grade_visualization.helpers.setTexts("futureScoretext", futureScoretexts, -20, x);
  
  // move circles to their appropriate positions
  // ... for current scores
  curpts.transition().duration(animspeed)
    .attr("fill-opacity", 1)
    .attr("stroke-opacity", 1)
    .attr("cx", function(d) { return x(d.name); });
  // ... for current averages
  avgpts.transition().duration(animspeed)
    .attr("fill-opacity", 1)
    .attr("stroke-opacity", 1)
    .attr("cx", function(d) { return x(d.name); });
  // ... for future scores
  futpts.transition().duration(animspeed)
    .attr("fill-opacity", 1)
    .attr("stroke-opacity", 1)
    .attr("cx", function(d) { return x2(d.name); });

  // drop exiting circles and remove
  // ... for current scores
  curpts.exit().transition().duration(animspeed)
    .attr("fill-opacity", 0)
    .attr("stroke-opacity", 0)
    .attr("cy", height)
      .remove();
  // ... for curent averages
  avgpts.exit().transition().duration(animspeed)
    .attr("fill-opacity", 0)
    .attr("stroke-opacity", 0)
    .attr("cy", height)
      .remove();
  futpts.exit().transition().duration(animspeed)
    .attr("fill-opacity", 0)
    .attr("stroke-opacity", 0)
    .attr("cy", height)
      .remove();

  // reposition current grade bar
  // ... for current scores
  svg.select(".gradebar").transition().duration(animspeed)
    .attr("fill-opacity", 1)
    .attr("stroke-opacity", 1)
    .attr("transform", "translate(" + width + ",0)");

  // add text to total grade bar
  barsvg.selectAll(".text").transition().duration(animspeed)
    .attr("x", (margin.right/2-3))
    .attr("fill-opacity", 1);

  // Average Indicators
  // ... for current scores
  var yvalue = y(currentGradeAverage);
  svg.select(".currentAverages").transition().duration(animspeed)
    .attr("transform", "translate("+width+","+yvalue+")")
    .attr("fill-opacity", 1)
    .attr("stroke-opacity", 1);
  // ... for class averages
  svg.select(".classAverages").transition().duration(animspeed)
    .attr("transform", "translate("+width+","+y(classAverage)+")")
    .attr("fill-opacity", 1)
    .attr("stroke-opacity", 1);
  // ... for average scores
  svg.select(".avgtext").text(currentGradeAverage.toFixed(2));
  svg.select(".classavgtext").text(classAverage.toFixed(2));
  // ... for all scores
  var y2value = totalGradeAverage;
  if(y2value > 100)
    y2value = y(100);
  else
    y2value = y(y2value);
  barsvg.select(".totalAverages").transition().duration(animspeed)
    .attr("transform", "translate(0," + (margin.top + y2value) +")")
    .attr("fill-opacity", 1)
    .attr("stroke-opacity", 1);
  barsvg.select(".avgtext").text(totalGradeAverage.toFixed(2));
},

/*
 * Toggle tag visuals between all on or off
*/
grade_visualization.toggleTagVis = function(){
  var base = d3.select(".tool_container").select(".tagsvg").selectAll(".tag");
  if(grade_visualization.storage.tagList.length === 0){
    base.select(".bound").attr("fill", "#FF6666");
    base.select(".check").attr("stroke-opacity", 0);
  }else{
    base.select(".bound").attr("fill", "lightgreen");
    base.select(".check").attr("stroke-opacity", 1);
  }
},

// Filter functions
grade_visualization.showSelected = function(){
  grade_visualization.helpers.updateGrades();
}
grade_visualization.selectNone = function(){
  grade_visualization.storage.tagList = [];
  grade_visualization.toggleTagVis();
}
grade_visualization.selectAll = function(){
  grade_visualization.storage.tagList = grade_visualization.storage.foundTags;
  grade_visualization.toggleTagVis();
}

// Called on page load
grade_visualization.init = function() {
  //console.log("I've reached init for grade vis.");
  grade_visualization.initPage();
}

// Called when tool is unloaded
grade_visualization.uninit = function() {
  var base = d3.select(".tool_container").remove();
  grade_visualization.storage.currentGrade = 0;
  grade_visualization.storage.maxPoints = 0;
  grade_visualization.storage.foundTags = [];
  grade_visualization.storage.tagList = [];
  grade_visualization.properties.tagX = 0;
  grade_visualization.properties.tagY = 0;
}
