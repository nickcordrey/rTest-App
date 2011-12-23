var data =
	[{"id": 0, "name": "Barack Obama", "level":0, "BI": 5, "child_ids":[1]},
	{"id": 1, "name": "Hilary Clinton", "level":1, "BI": 1, "child_ids":[2]},
	{"id": 2, "name": "John McCaine", "level":2, "BI": 3}];
	
//var canvas_width = 800;
//var canvas_height = 600;
var vertical_offset = 200;

$(document).ready( function () {
                var R = Raphael(0, 0, "100%", "100%");
				var contact_nodes = new Array();
				
				/*for (i=0; i < data.length; i++) {
				//alert(i);  
				  contact_nodes[i] = R.circle(canvas_width/2, vertical_offset + data[i]['level']*100, data[i]['BI']*10);
				  //contact_nodes[i].node.id = 'node' + data[i]['id'];
				  contact_nodes[i].attr({fill: "hsb(.3, 1, 1)", stroke: "none", opacity: .5});
				//contact_nodes[i].drag(move, start, up);
				  //alert(contact_nodes[i].attr('x'));
				}*/
				/*contact_nodes[0] = R.circle(100, 100, 50).attr({fill: "hsb(0, 1, 1)", stroke: "none", opacity: .5});
				contact_nodes[1] = R.circle(210, 100, 50).attr({fill: "hsb(.3, 1, 1)", stroke: "none", opacity: .5}),
                  contact_nodes[2] = R.circle(320, 100, 50).attr({fill: "hsb(.6, 1, 1)", stroke: "none", opacity: .5}),
                   contact_nodes[3] = R.circle(430, 100, 50).attr({fill: "hsb(.8, 1, 1)", stroke: "none", opacity: .5});*/
				for (i=0; i < 4; i++)
				{
					contact_nodes[i] = R.circle(100*i, 100*i, 50).attr({fill: "hsb(0, 1, 1)", stroke: "none", opacity: .5});
				}
                var start = function () {
                    this.ox = this.attr("cx");
                    this.oy = this.attr("cy");
                    //this.animate({r: 70, opacity: .25}, 500, ">");
                },
                move = function (dx, dy) {
                    this.attr({cx: this.ox + dx, cy: this.oy + dy});
                },
                up = function () {
                    //this.animate({r: 50, opacity: .5}, 500, ">");
                };
                R.set(contact_nodes[0], contact_nodes[1], contact_nodes[2], contact_nodes[3]).drag(move, start, up);            
});