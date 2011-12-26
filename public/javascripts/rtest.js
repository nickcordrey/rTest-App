var data =
	{"contact0":{"name": "Barack Obama", "level":0, "BI": 5, "children":["contact1","contact2"]},
	"contact1":{"name": "Hilary Clinton", "level":1, "BI": 1, "children":["contact3","contact4", "contact5"]},
	"contact2":{"name": "John McCaine", "level":1, "BI": 3, "children":["contact6"]},
	"contact3":{"name": "Nick Cordrey", "level":2, "BI": 3, "children":[]},
	"contact4":{"name": "Natalie Brooking", "level":2, "BI": 3, "children":[]},
	"contact5":{"name": "Paul Brooking", "level":2, "BI": 3, "children":[]},
	"contact6":{"name": "Mary Brooking", "level":2, "BI": 3, "children":[]}};
	
var canvas_width = 800;
var canvas_height = 600;
var vertical_offset = 200;

var counter = new Array();
var node_positions = {};
var node_x = 0;

function get_node_positions(node) {
	
	if(data[node].children.length !== 0) {
	
		$.each(data[node].children, function(key, value) {
			get_node_positions(value);
		});
	
		x_left = node_positions[data[node].children[0]].x;
		x_right = node_positions[data[node].children[data[node].children.length - 1]].x;
		x_node = x_left + (x_right - x_left)/2;
		node_positions[node] = {"x":x_node, "y":data[node].level};
  	}
	else {
		node_x++;
		node_positions[node] = {"x":node_x, "y":data[node].level};
 	}
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
	alert(JSON.stringify(node_positions));
	
	$.each(node_positions, function(key, value) {
		R.circle(value.x*100, vertical_offset + value.y*100, 25).attr({fill: "hsb(0, 1, 1)", stroke: "none", opacity: .5});
	});
	//get_child_counts();
	//alert(get_descendant_count("contact0"));	
	//alert(JSON.stringify(counter));
	
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