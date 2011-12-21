$( document ).ready( function () {

	// Creates canvas 800 × 600 at 0, 0
	var paper = Raphael(0, 0, 800, 600);

	// Creates circle at x = 50, y = 40, with radius 100
	var circle = paper.circle(200, 200, 100);
	
	// Sets the fill attribute of the circle to red (#f00)
	circle.attr("fill", "#f00");

	// Sets the stroke attribute of the circle to white
	circle.attr("stroke", "#000");
	
});