var data =
	{"contact0":{"name": "Barack Obama", "BI": 5, "children":["contact1","contact2"], "team":["team0"]},
	"contact1":{"name": "Hilary Clinton", "BI": 1, "children":["contact3","contact4", "contact5"], "team":["team1", "team2"]},
	"contact2":{"name": "John McCaine", "BI": 3, "children":["contact6"], "team":["team1", "team2"]},
	"contact3":{"name": "Nick Cordrey", "BI": 3, "children":[], "team":["team1", "team3"]},
	"contact4":{"name": "Natalie Brooking", "BI": 3, "children":[], "team":["team1", "team3"]},
	"contact5":{"name": "Paul Brooking", "BI": 3, "children":[], "team":[]},
	"contact6":{"name": "Mary Brooking", "BI": 3, "children":["contact7", "contact8"], "team":["team0"]},
	"contact7":{"name": "Jemima Puddleduck", "BI": 1, "children":[], "team":[]},
	"contact8":{"name": "Gruffalo", "BI": 2, "children":[], "team":["team1"]}};
	
var team_data = 
	{"team0":{"name": "Nick Cordrey"},
	"team1":{"name": "Nat Brooking"},
	"team2":{"name": "Mark Priestley"},
	"team3":{"name": "James Cole"}};
	
var test_node = [];
	
var canvas_vertical_offset = 200;
var canvas_horizontal_offset = 0;
var canvas_width = 800;
var canvas_height = 600;
var vertical_offset = 100;
var x_spacing = 125;
var y_spacing = 125;
var radius_base = 15;
var radius_weight = 10;
var team_radius = 15;
var animation_duration = 300;

var R;

var counter = new Array();
var node_positions = {};
var node_shapes = {};
var team_shapes = {};
var path_shapes = {};
//var edge_paths = [];
var node_x = 0;

var mouseX;
var mouseY;

function get_node_positions(node, level) {

		
	if(data[node].children.length !== 0) {
		level++;
		$.each(data[node].children, function(key, value) {
			get_node_positions(value, level);
		});
		level--;
		x_left = node_positions[data[node].children[0]].x;
		x_right = node_positions[data[node].children[data[node].children.length - 1]].x;
		x_node = x_left + (x_right - x_left)/2;
		node_positions[node] = {"x":x_node, "y":vertical_offset + level*y_spacing};
  	}
	else {
		node_x++;
		node_positions[node] = {"x":node_x*x_spacing, "y":vertical_offset + level*y_spacing};
 	}
}

function draw_nodes() {
	$.each(node_positions, function(key, value) {
		node_shapes[key] = R.circle(value.x, value.y, radius_base + data[key]["BI"]*radius_weight).attr({fill: "hsb(0, 1, 1)", stroke: "none"});
		node_shapes[key].node.id = key;
	});
}

function draw_team() {
	$.each(data, function(contact, contact_data) {
		var team_count = contact_data.team.length;
		$.each(contact_data.team, function(index, team_contact) {	
			team_shapes[contact+team_contact] = R.circle(node_positions[contact].x + Math.cos(((index+1)/team_count)*2*Math.PI)*(radius_base + data[contact]["BI"]*radius_weight), node_positions[contact].y + Math.sin(((index+1)/team_count)*2*Math.PI)*(radius_base + data[contact]["BI"]*radius_weight), team_radius).attr({fill: "blue", stroke: "none"});
			
		});
	});
}

function draw_edges() {
	$.each(data, function(node_id, node_values) {
		if(node_values.children.length !== 0) {
			$.each(node_values.children, function(key, child_id) {
				//edge_paths.push({"start":node_id, "end":child_id});
				path_shapes[node_id+child_id] = R.path(["M",node_positions[node_id].x, node_positions[node_id].y, "L", node_positions[child_id].x, node_positions[child_id].y].join(" ")).toBack();
				//alert('connect from '+ node_id + ' to ' + child_id);
			});
  		}
	});
}

function addNode(node_id, parent_id, node_data) {

	data[node_id] = node_data;
	data[parent_id].children.push(node_id);
	
	node_x=0;
	
	get_node_positions("contact0", 0);
	//alert(JSON.stringify(node_positions));
	//alert(team_shapes["contact0team0"].attr("x"));
	
	$.each(node_positions, function(node, value) {

		if(node_shapes[node] == undefined) {
			//alert(key + ' is new!');
			node_shapes[node] = R.circle(value.x, value.y, radius_base + data[node]["BI"]*radius_weight).attr({fill: "hsb(0, 1, 1)", stroke: "none"}).attr({opacity:0.0}).animate({opacity:1.0}, animation_duration);
			// and add any team nodes!
		}
		else {
			if(node_shapes[node].attr('cx') != value.x) {
				
				// Move the node
				node_shapes[node].animate({cx : value.x}, animation_duration);
				
				// Move any team child nodes
				var team_count = data[node].team.length;
				$.each(data[node].team, function(index, team_contact) {
					if(team_shapes[node+team_contact]) {
						team_x = node_positions[node].x + Math.cos(((index+1)/team_count)*2*Math.PI)*(radius_base + data[node]["BI"]*radius_weight);
						team_y = node_positions[node].y + Math.sin(((index+1)/team_count)*2*Math.PI)*(radius_base + data[node]["BI"]*radius_weight);
						team_shapes[node+team_contact].animate({cx : team_x, cy : team_y}, animation_duration);
					}	
				});
			}
		}
		
		// Create any new connectors, move any existing ones
		if(data[node].children.length !== 0) {
			$.each(data[node].children, function(key, child_id) {
				if(path_shapes[node+child_id]) {
					path_shapes[node+child_id].animate({path : ["M",node_positions[node].x, node_positions[node].y, "L", node_positions[child_id].x, node_positions[child_id].y].join(" ")}, animation_duration);
				}
				else {
					path_shapes[node+child_id] = R.path(["M",node_positions[node].x, node_positions[node].y, "L", node_positions[child_id].x, node_positions[child_id].y].join(" ")).toBack().attr({opacity:0.0}).animate({opacity:1.0}, animation_duration);
				}
			});
  		}
		
	});
}

function addTeamNode(team_id, node_id) {
	
	if($.inArray(team_id, data[node_id].team) == -1 && data[node_id]) {
		
		data[node_id].team.push(team_id);

		var team_count = data[node_id].team.length;

		$.each(data[node_id].team, function(index, team_id) {

			team_x = node_positions[node_id].x + Math.cos(((index+1)/team_count)*2*Math.PI)*(radius_base + data[node_id]["BI"]*radius_weight);
			team_y = node_positions[node_id].y + Math.sin(((index+1)/team_count)*2*Math.PI)*(radius_base + data[node_id]["BI"]*radius_weight);

			if(team_shapes[node_id+team_id]) {	
				team_shapes[node_id+team_id].animate({cx : team_x, cy : team_y}, animation_duration);
				//team_shapes[node_id+team_id].attr({cx : team_x, cy : team_y});
			}
			else {	
				team_shapes[node_id+team_id] = R.circle(team_x, team_y, team_radius).attr({fill: "blue", stroke: "none"});
			}
		});
	}
}

function test_update_nodes() {
	test_node.push(R.circle(200,300,50).attr({fill: "gray", stroke: "none"}));
}

function test_animate_nodes() {
	test_node[0].animate({cx: 500}, 500, ">");
}

$(document).ready( function () {

    R = Raphael("svg", "100%", "100%");
	get_node_positions("contact0", 0);
	//alert(JSON.stringify(node_positions));
	draw_nodes();
	draw_team();
	draw_edges();
	$('svg > circle').click(function() {
		alert(R.getElementByPoint(mouseX, mouseY).node.id);
	});
	$('body').mousemove(function(e) { 
	    mouseX = e.pageX;// - this.offsetLeft; 
	    mouseY = e.pageY;// - this.offsetTop; 
	    $("span").html("X: " + mouseX + "   Y: " + mouseY); 
	});
	//$('#id_team0').html('<ul><li id = "id_team0">John Kelly</li></ul>');
	$('#id_team0').draggable({ cursor: 'pointer', revert: true, stop: function(event, ui) {
		//alert(R.getElementByPoint(mouseX, mouseY).node.id);
		addNode("contact9", R.getElementByPoint(mouseX, mouseY).node.id, {"name": "Winnie the Pooh", "level":3, "BI": 2, "children":[], "team":[]});
	} });

			/*var R = Raphael(0, 0, canvas_width, canvas_height);
				var contact_nodes = new Array();
				
				//alert_me();
				// Drag functions
				var start = function () {
                    this.ox = this.attr("cx");
                    this.oy = this.attr("cy");
                    //this.animate({r: 70, opacity: .25}, 500, ">");
                },
                move = function (dx, dy) {
                    this.attr({cx: this.ox + dx, cy: this.oy});
                },
                up = function () {
                    //this.animate({r: 50, opacity: .5}, 500, ">");
                };

				// Draw some nodes
				for (i=0; i < data.length; i++)
				{
					//contact_nodes[i] = R.circle(canvas_width/2, vertical_offset + data[i]['level']*100, data[i]['BI']*10).attr({fill: "hsb(0, 1, 1)", stroke: "none", opacity: .5});
				}
				
				// Draw some edges between nodes
				$.each(contact_nodes, function() {
					//alert(this.attr('cx'));
				  from_x = this.attr('cx');
				  from_y = this.attr('cy');
				  $.each(data[this.id].child_ids, function() {
					//child = r.getById(this); // Very sensitive to error
					//to_x = child.attr('cx');
					//to_y = child.attr('cy');
					alert(this);
					//alert([from_x, from_y, to_x, to_y].join(","));
					//alert(to_x);
					//R.path(["M",from_x, from_y, "L", 500, 600].join(" "));
				  });
				});
                
				
                R.set(contact_nodes[0], contact_nodes[1], contact_nodes[2]).drag(move, start, up);  */        
});