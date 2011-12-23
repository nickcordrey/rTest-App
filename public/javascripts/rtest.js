// Some existing data

var data =
	[{"id": 0, "name": "Barack Obama", "level":0, "BI": 5, "child_ids":[1]},
	{"id": 1, "name": "Hilary Clinton", "level":1, "BI": 1, "child_ids":[2]},
	{"id": 2, "name": "John McCaine", "level":2, "BI": 3}];
	
var canvas_width = 800;
var canvas_height = 600;
var vertical_offset = 200;

// Draggable function
var dragger = function () {
                    alert('dragger');
                };
                var move = function (dx, dy) {
                    alert('move');
                };
                var up = function () {
                    alert('up');
                };

$(document).ready( function () {
	
	// Creates the canvas
	var r = Raphael(0, 0, canvas_width, canvas_height);
	var c = r.circle(500, 200, 100);
	c.attr({ 'fill': 'red'});

	// Declare some data structures
	var contact_nodes = [];
	
	// Create some nodes
	for (i=0; i < data.length; i++) {
	//alert(i);  
	  contact_nodes[i] = r.circle(canvas_width/2, vertical_offset + data[i]['level']*100, data[i]['BI']*10);
	  contact_nodes[i].node.id = 'node' + data[i]['id'];
	  contact_nodes[i].attr({ 'fill': 'blue'});
	//contact_nodes[i].drag(move, start, up);
	  //alert(contact_nodes[i].attr('x'));
	}
	
	// Draw some edges between nodes
	$.each(contact_nodes, function() {
	  
	  from_x = this.attr('cx');
	  from_y = this.attr('cy');
	  $.each(data[this.id].child_ids, function() {
		child = r.getById(this); // Very sensitive to error
		to_x = child.attr('cx');
		to_y = child.attr('cy');
		//alert([from_x, from_y, to_x, to_y].join(","));
		//alert(to_x);
		r.path(["M",from_x, from_y, "L", to_x, to_y].join(" "));
	  });
	});
		
	c.drag(move,start,up);
	//c.drag(start,move,up);
	//alert(r.getById(0).node.id);
	// Sets the fill attribute of the circle to red (#f00)
	//contact_nodes[0].attr("fill", "#f00");
	//r.getById('node2').attr("fill", "#f00");
	// Sets the stroke attribute of the circle to white
	//c.attr("stroke", "#000");

});