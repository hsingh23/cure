var globalSpace = {};
globalSpace.ajax_data = {};
globalSpace.graph_data = {};
globalSpace.graph_data.window_width = window.innerWidth; 
globalSpace.graph_data.window_height = window.innerHeight; 
globalSpace.ajax_data.url = "http://localhost:8000/madness/";
globalSpace.ajax_data.netid = "";
var studgraph = {
	init:function(){

        $(document).ready(function(){
		//TODO: Using authentication, get net id
		globalSpace.ajax_data.netid = "sujim1";
        // var container = document.getElementById("tool_container");
        var studviz = document.createElement("div");
        studviz.setAttribute("id", "stud_viz");
		var graph = document.createElement("div");
        graph.setAttribute("id","graph");
		var emails = document.createElement("div");
        emails.setAttribute("id","emails");
        // console.log("container: " + container);
        // console.log("studviz: " + studviz);
		// container.appendChild(studviz);
		// studviz.appendChild(graph);
        // studviz.appendChild(emails);
        $("#tool_container").append(studviz);
        $("#stud_viz").append(graph);
        $("#stud_viz").append(emails);
		getStudents();
        });
	},
	// uninit:function(){
	// 	$(#stud_viz).remove();
	// }
};

function getStudents(){
	// $.post(globalSpace.ajax_data.url, {q: '{ "function":"search", "table": "Person","query":{} }'}, processStudents);
var sampleJSON = {
	"status": "success",
	"exceptions": [],
	"rows": [
		{
			"netid": "umansky1",
			"groud_id": 5,
			"section": "awesome",
			"first_name": "Isaac",
			"last_name": "Newton",
			"uin": 655789878,
			"enrolled": true,
			"major": "Computer Science",
			"mp": 87,
			"test": 95
 		},
 		{
			"netid": "zfrank",
			"groud_id": 4,
			"section": "lame",
			"first_name": "Zelda",
			"last_name": "Frank",
			"uin": 655735645,
			"enrolled": true,
			"major": "Porn Star",
			"mp": 65,
			"test": 34
 		},
 		{
			"netid": "chris",
			"groud_id": 2,
			"section": "awesome",
			"first_name": "chris",
			"last_name": "Stephen",
			"uin": 655789456,
			"enrolled": false,
			"major": "jumping jacks",
			"mp": 56,
			"test": 43
 		},
 		{
			"netid": "zfrank",
			"groud_id": 4,
			"section": "lame",
			"first_name": "Zelda",
			"last_name": "Frank",
			"uin": 655735645,
			"enrolled": true,
			"major": "Porn Star",
			"mp": 23,
			"test": 98
 		}
	]
}
	processStudents(sampleJSON);
}

function processStudents(data){
	globalSpace.graph_data.students = [];
	var rows  = data.rows;
	 $.each(rows, function(index,value){
      var student = {};
      student.name = value.first_name + " " + value.last_name;
      student.data = [[value.mp, value.test]];
      student.color = "rgba(223, 83, 83, .5)"
      student.netid = value.netid;
      globalSpace.graph_data.students.push(student);  
  });
  drawGraph();	
}

function drawGraph(){
    var options =
    {
        chart: {
            renderTo: 'graph',
            // marginRight: 300,
            type: 'scatter',
            zoomType: 'xy',
            height: globalSpace.graph_data.window_height - 20,
            width: globalSpace.graph_data.window_width - 250,
            // borderColor: 'blue',
            events: {
                selection: selection
            } 
        },
        title: {
            text: 'Test Grades Vs. MP Grades'
        },
        subtitle: {
            text: "Highlight Points To See Students' Emails"
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'MP scores (%)'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true,
            type: "linear",
            min: 0,
            max: 100,
        },
        yAxis: {
            title: {
                text: 'Test Scores (%)'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true,
            type: "linear",
            min: 0,
            max: 100,
        },
        tooltip: {
            formatter: function() {
                    return ''+
                    this.x +' % test, '+ this.y +' % mp';
            }
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: globalSpace.graph_data.students 
    };    
    var chart = new Highcharts.Chart(options);
}

/*
 * This function overrides the highlighting functionality provided by highchart to populate email box on right
*/
function selection(event) {
    event.preventDefault();
    var  chart = this;
    chart.showLoading();
    if (event.xAxis && event.yAxis) {
        var xAxis = event.xAxis[0];
        var yAxis = event.yAxis[0];
        var xmin = xAxis.min;
        var xmax = xAxis.max;
        var ymin = yAxis.min;
        var ymax = yAxis.max;
        var seriesTemp = globalSpace.graph_data.students; 
        var email_text = document.getElementById("emails");
        for(var i =0; i < seriesTemp.length; i++){
            var currStudent = seriesTemp[i];
            if(currStudent.data[0][0] >= xmin && currStudent.data[0][0] <= xmax && currStudent.data[0][1] >= ymin && currStudent.data[0][1] <= ymax){   
                email_text.innerHTML += currStudent.netid + "@illinois.edu; <br>" ;    
            }
        }
    }
} 