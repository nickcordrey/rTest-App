var data =
	{"contact0":{"name": "Barack Obama", "level":0, "BI": 5, "children":["contact1","contact2"], "team":["team0"]},
	"contact1":{"name": "Hilary Clinton", "level":1, "BI": 1, "children":["contact3","contact4", "contact5"], "team":["team1", "team2"]},
	"contact2":{"name": "John McCaine", "level":1, "BI": 3, "children":["contact6"], "team":["team1", "team2"]},
	"contact3":{"name": "Nick Cordrey", "level":2, "BI": 3, "children":[], "team":["team1", "team3"]},
	"contact4":{"name": "Natalie Brooking", "level":2, "BI": 3, "children":[], "team":["team1", "team3"]},
	"contact5":{"name": "Paul Brooking", "level":2, "BI": 3, "children":[], "team":[]},
	"contact6":{"name": "Mary Brooking", "level":2, "BI": 3, "children":["contact7", "contact8"], "team":["team0"]},
	"contact7":{"name": "Jemima Puddleduck", "level":3, "BI": 1, "children":[], "team":[]},
	"contact8":{"name": "Gruffalo", "level":3, "BI": 2, "children":[], "team":["team1"]}};
	
var team_data = 
	{"team0":{"name": "Nick Cordrey"},
	"team1":{"name": "Nat Brooking"},
	"team2":{"name": "Mark Priestley"},
	"team3":{"name": "James Cole"}};
	
var canvas_width = 800;
var canvas_height = 600;
var vertical_offset = 150;
var x_spacing = 125;
var y_spacing = 125;
var radius_base = 15;
var radius_weight = 10;
var team_radius = 15;

var counter = new Array();
var node_positions = {};
//var edge_paths = [];
var node_x = 0;

function get_node_positions(node) {
	
	if(data[node].children.length !== 0) {
	
		$.each(data[node].children, function(key, value) {
			get_node_positions(value);
		});
	
		x_left = node_positions[data[node].children[0]].x;
		x_right = node_positions[data[node].children[data[node].children.length - 1]].x;
		x_node = x_left + (x_right - x_left)/2;
		node_positions[node] = {"x":x_node, "y":vertical_offset + data[node].level*y_spacing};
  	}
	else {
		node_x++;
		node_positions[node] = {"x":node_x*x_spacing, "y":vertical_offset + data[node].level*y_spacing};
 	}
}

Raphael.fn.connection = function (node1, node2) {
	
}

function roundNumber(num, dec) {
	var result = Math.round( Math.round( num * Math.pow( 10, dec + 1 ) ) / Math.pow( 10, 1 ) ) / Math.pow(10,dec);
	return result;
}

/*var children = 0;
function get_child_count(node) {
	for(i=0; i < data.length; i++) {
		if(data[i].parent == node) {
			children = children + get_child_count(data[i]._id);
		}
	}
	return children;
}

function get_descendants(node) {
	descendants = 0;
	for(i=0; i < data.length; i++) {
		
	}
}

function get_child_counts() {
	
	for(i=0; i < data.length; i++) {
		id = data[i]._id;
		counter[i] = {"id":id, "count":0};
		for(j=0; j < data.length; j++) {
			if(data[j].parent == id) {
				// This is a child
				//alert([data[j]._id, id].join(","));
				counter[i].count = counter[i].count + 1;  
				//alert(JSON.stringify(counter));
			}
		}
	}
}

function get_descendant_count(node) {
	local_count = 0;
	for(i=0; i < data.length; i++) {
		if(data[i].parent == node) {
			//alert(counter[i].count);
			local_count = local_count + counter[i].count;
		}
	}
	return local_count;
}*/

/*var t_counter = 0;
function traverse(parent) {
	for(i=0; i < data.length; i++) {
		id = data[i]._id;
		//alert(data[i].parent);
		if(data[i].parent == id) {
			alert(id);
		  traverse();
		  t_counter++;
		}
	}
}*/

$(document).ready( function () {

    var R = Raphael(0, 0, canvas_width, canvas_height);
	get_node_positions("contact0");
	//alert(JSON.stringify(node_positions));
	
	$.each(node_positions, function(key, value) {
		R.circle(value.x, value.y, radius_base + data[key]["BI"]*radius_weight).attr({fill: "hsb(0, 1, 1)", stroke: "none"});
	});
	
	$.each(data, function(contact, contact_data) {
		//alert(JSON.stringify(value.team));
		var team_count = contact_data.team.length;
		$.each(contact_data.team, function(index, team_contact) {	
			R.circle(node_positions[contact].x + Math.cos(((index+1)/team_count)*2*Math.PI)*(radius_base + data[contact]["BI"]*radius_weight), node_positions[contact].y + Math.sin(((index+1)/team_count)*2*Math.PI)*(radius_base + data[contact]["BI"]*radius_weight), team_radius).attr({fill: "blue", stroke: "none"});
			
		});
	});
	
	$.each(data, function(node_id, node_values) {
		if(node_values.children.length !== 0) {
			$.each(node_values.children, function(key, child_id) {
				//edge_paths.push({"start":node_id, "end":child_id});
				R.path(["M",node_positions[node_id].x, node_positions[node_id].y, "L", node_positions[child_id].x, node_positions[child_id].y].join(" ")).toBack();
				//alert('connect from '+ node_id + ' to ' + child_id);
			});
  		}
	});
	
	//draw_edge_paths();
	//R.path(["M",50, 50, "L", 500, 600].join(" "));
	//get_child_counts();
	//alert(get_descendant_count("contact0"));	
	//alert(JSON.stringify(edge_positions));
	
	//traverse();
	//alert(t_counter);

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