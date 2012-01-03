var data =
	{"contact0":{"active": true, "name": "Vittorio Colao", "BI": 5, "children":["contact1","contact2"], "team":["team0"]},
	"contact1":{"active": true, "name": "Michel Combes", "BI": 1, "children":["contact3","contact4", "contact5"], "team":["team1", "team2"]},
	"contact2":{"active": true, "name": "Nick Read", "BI": 3, "children":["contact6"], "team":["team1", "team2"]},
	"contact3":{"active": true, "name": "Warren Feingold", "BI": 3, "children":[], "team":["team1", "team3"]},
	"contact4":{"active": true, "name": "Morten Lundel", "BI": 3, "children":[], "team":["team1", "team3"]},
	"contact5":{"active": true, "name": "Steve Pusey", "BI": 3, "children":[], "team":[]},
	"contact6":{"active": true, "name": "Andy Halford", "BI": 3, "children":["contact7"], "team":["team0"]},
	"contact7":{"active": true, "name": "Ronald Schellekens", "BI": 1, "children":[], "team":[]},
	"contact8":{"active": false, "name": "Rosemary Martin", "BI": 2, "children":[], "team":[]},
	"contact9":{"active": false, "name": "Matthew Kirk", "BI": 2, "children":[], "team":[]}};
	
var team_data = 
	{"team0":{"name": "Keith Ferrazzi", "initial": "KF"},
	"team1":{"name": "John P. Kelly", "initial": "JK"},
	"team2":{"name": "Tahl Raz", "initial": "TR"},
	"team3":{"name": "Jim Hannon", "initial": "JH"}};
	
var test_node = [];
	
var canvas_vertical_offset = 200;
var canvas_horizontal_offset = 0;
var canvas_width = 800;
var canvas_height = 600;
var vertical_offset = 150;
var left_offset = 300;
var x_spacing = 125;
var y_spacing = 135;
var radius_base = 20;
var radius_weight = 8;
var team_radius = 15;
var animation_duration = 250;
var label_y_offset = 12;

var R;

var counter = new Array();
var node_positions = {};
var node_shapes = {};
var node_labels = {};
var team_shapes = {};
var team_labels = {};
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

// ** This doesn't really work when you start adding nodes
function centre_node_positions() {
	/*var svg_width = $('#svg').width();
	if(centre_offset == 0 && node_positions["contact0"].x < svg_width/2) {
		centre_offset = svg_width/2 - node_positions["contact0"].x;
	}
	
	if(centre_offset != 0) {
	//alert(centre_offset);	*/
		$.each(node_positions, function(key, value) {
			node_positions[key]["x"] = value.x + left_offset;
		});
	//}
}

function draw_nodes() {
	$.each(node_positions, function(key, value) {
		node_shapes[key] = R.circle(value.x, value.y, radius_base + data[key]["BI"]*radius_weight).attr({fill: "#98FB98", stroke: "#ffffff", "stroke-width": 5}).attr({opacity:0.0}).animate({opacity:1.0}, animation_duration).mouseover(function () { this.attr({stroke: "#AAAAAA"})}).mouseout(function () { this.attr({stroke: "#ffffff"})});
		node_shapes[key].node.id = key;
		node_labels[key] = R.text(value.x, value.y - (radius_base + data[key]["BI"]*radius_weight + label_y_offset), data[key]["name"]).attr({'font-size': '12px'}).attr({opacity:0.0}).animate({opacity:1.0}, animation_duration);
	});
}

function draw_team() {
	// Need to add check as not worth drawing team for nodes not drawn
	$.each(data, function(contact, contact_data) {
		var team_count = contact_data.team.length;
		$.each(contact_data.team, function(index, team_contact) {	
			team_shapes[contact+team_contact] = R.circle(node_positions[contact].x + Math.cos(((index+1)/team_count)*2*Math.PI)*(radius_base + data[contact]["BI"]*radius_weight), node_positions[contact].y + Math.sin(((index+1)/team_count)*2*Math.PI)*(radius_base + data[contact]["BI"]*radius_weight), team_radius).attr({fill: "#FFF68F", stroke: "#ffffff", "stroke-width": 3}).attr({opacity:0.0}).animate({opacity:1.0}, animation_duration).mouseover(function () { this.attr({stroke: "#AAAAAA"})}).mouseout(function () { this.attr({stroke: "#ffffff"})});
			
		});
	});
}

function draw_edges() {
	$.each(data, function(node_id, node_values) {
		if(node_values.children.length !== 0) {
			$.each(node_values.children, function(key, child_id) {
				//edge_paths.push({"start":node_id, "end":child_id});
				path_shapes[node_id+child_id] = R.path(["M",node_positions[node_id].x, node_positions[node_id].y, "L", node_positions[child_id].x, node_positions[child_id].y].join(" ")).attr({stroke: "#ffffff", "stroke-width": 5}).toBack().attr({opacity:0.0}).animate({opacity:1.0}, animation_duration).mouseover(function () { this.attr({stroke: "#AAAAAA"})}).mouseout(function () { this.attr({stroke: "#ffffff"})});
				//alert('connect from '+ node_id + ' to ' + child_id);
			});
  		}
	});
}

function addNode(node_id, parent_id) {

	if (node_positions[node_id]) return;
	
	//data[node_id] = node_data;
	data[parent_id].children.push(node_id);
	
	node_x=0;
	
	get_node_positions("contact0", 0);
	centre_node_positions();
	
	
	$.each(node_positions, function(node, value) {

		if(node_shapes[node] == undefined) {
	
			node_shapes[node] = R.circle(value.x, value.y, radius_base + data[node]["BI"]*radius_weight).attr({fill: "#98FB98", stroke: "#ffffff", "stroke-width": 5}).attr({opacity:0.0}).animate({opacity:1.0}, animation_duration).mouseover(function () { this.attr({stroke: "#AAAAAA"})}).mouseout(function () { this.attr({stroke: "#ffffff"})});
			node_shapes[node].node.id = node;
			node_labels[node] = R.text(value.x, value.y - (radius_base + data[node]["BI"]*radius_weight + label_y_offset), data[node]["name"]).attr({'font-size': '12px'}).attr({opacity:0.0}).animate({opacity:1.0}, animation_duration);
		}
		else {
			if(node_shapes[node].attr('cx') != value.x) {
				
				// Move the node
				node_shapes[node].animate({cx : value.x}, animation_duration);
				
				// Move the label
				node_labels[node].animate({x : value.x}, animation_duration);
				
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
					path_shapes[node+child_id] = R.path(["M",node_positions[node].x, node_positions[node].y, "L", node_positions[child_id].x, node_positions[child_id].y].join(" ")).toBack().attr({stroke: "#ffffff", "stroke-width": 5}).attr({opacity:0.0}).animate({opacity:1.0}, animation_duration).mouseover(function () { this.attr({stroke: "#AAAAAA"})}).mouseout(function () { this.attr({stroke: "#ffffff"})});
				}
			});
  		}
	});
	//alert(JSON.stringify(data));
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
			}
			else {	
				team_shapes[node_id+team_id] = R.circle(team_x, team_y, team_radius).attr({fill: "#FFF68F", stroke: "#ffffff", "stroke-width": 3}).mouseover(function () { this.attr({stroke: "#AAAAAA"})}).mouseout(function () { this.attr({stroke: "#ffffff"})});
			}
		});
	}
}

$(document).ready( function () {

    R = Raphael("svg", "100%", "100%");
	get_node_positions("contact0", 0);
	centre_node_positions();
	draw_nodes();
	draw_team();
	draw_edges();
	
	$('svg > circle').click(function() {
		var element = R.getElementByPoint(mouseX, mouseY);
		$("#right-bar").css('visibility', 'visible');
		//alert(data[element.node["id"]]["name"]);
		$("#right-bar span#name").html(data[element.node["id"]]["name"]);
		$("#right-bar span#BI").html(data[element.node["id"]]["BI"]);
	});
	$('body').mousemove(function(e) { 
	    mouseX = e.pageX;// - this.offsetLeft; 
	    mouseY = e.pageY;// - this.offsetTop; 
	});
	$.each(data, function(key, value) {
		if(value.active == true) {
			$('#account').append('<li style="color:#98FB98;" id="id_' + key + '"><span style="color:#000000;">'+ value.name + '</span></li>');
		}
		else {
			$('#account').append('<li id="id_' + key + '">'+ value.name + '</li>');
		}
		
		$('#id_' + key).draggable({ cursor: 'pointer', revert: true, stop: function(event, ui) {
			var element = R.getElementByPoint(mouseX, mouseY);
			if(element != null) addNode(key, element.node.id);
		} });
	});
	
	$.each(team_data, function(key, value) {
		$('#team').append('<li id="id_' + key + '">'+ value.name + '</li>');
		$('#id_' + key).draggable({ cursor: 'pointer', revert: true, stop: function(event, ui) {
			var element = R.getElementByPoint(mouseX, mouseY);
			if(element != null) addTeamNode(key, element.node["id"]);
		} });
	});
	
	// Drag functions
	/*var start = function () {
                 this.ox = this.attr("cx");
                 this.oy = this.attr("cy");
                 //this.animate({r: 70, opacity: .25}, 500, ">");
             },
             move = function (dx, dy) {
                 this.attr({cx: this.ox + dx, cy: this.oy});
             },
             up = function () {
                 //this.animate({r: 50, opacity: .5}, 500, ">");
             };*/
       
});