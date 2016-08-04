// We specify the dimensions for the map container. We use the same
// width and height as specified in the CSS above.
var width = 900,
    height = 600;

// We create a SVG element in the map container and give it some
// dimensions.
var svg = d3.select('#map').append('svg')
  .attr('width', width)
  .attr('height', height);

// We define a geographical projection
//     https://github.com/mbostock/d3/wiki/Geo-Projections
// and set some dummy initial scale. The correct scale, center and
// translate parameters will be set once the features are loaded.
var projection = d3.geo.mercator()
  .scale(1);

// We prepare a path object and apply the projection to it.
var path = d3.geo.path()
  .projection(projection);

// Load the features from the GeoJSON.
d3.json('data/map.geojson', function(error, features) {

  // Get the scale and center parameters from the features.
  var scaleCenter = calculateScaleCenter(features);

  // Apply scale, center and translate parameters.
  projection.scale(scaleCenter.scale)
    .center(scaleCenter.center)
    .translate([width/2, height/2]);

  // We add a <g> element to the SVG element and give it a class to
  // style it later.
  svg.append('g')
      .attr('class', 'features')
    // D3 wants us to select the (non-existing) path objects first ...
    .selectAll('path')
      // ... and then enter the data. For each feature, a <path> element
      // is added.
      .data(features.features)
    .enter().append('path')
      // As "d" attribute, we set the path of the feature.
      .attr('d', path);
  //Load in cities data
					d3.csv("data/villages.csv", function(data) {
						
						svg.selectAll("circle")
						   .data(data)
						   .enter()
						   .append("circle")
						   .attr("cx", function(d) {
							   return projection([d.lon, d.lat])[0];
						   })
						   .attr("cy", function(d) {
							   return projection([d.lon, d.lat])[1];
						   })
						   .attr("r", function(d) {
								return Math.sqrt(parseInt(d.feddans) * 0.0004);
						   })
						   //Set circle fill color to "feddans" value
						   .style("fill", function(d) {
							   	    if (d.feddans <= 500) {
							   			return "#7B3294";
						   			} 
						   			else if (d.feddans > 500 && d.feddans <= 1500) {
						   				return "#C2A5CF";
						   			}
						   			else if (d.feddans > 1500 && d.feddans <= 2500) {
						   				return "#FFFFFF";
						   			}
						   			else if (d.feddans > 2500 && d.feddans <= 3500) {
						   				return "#A6DBA0"
						   			}
						   			else {
							   		return "#008837";
						   			}
						   })
						   .style("stroke-width", "1")
						   //Set circle stroke color to "type" value
						   .style("stroke", "#222") 
						   .style("opacity", 0.8)
						   .on("mouseover", function(d) {   //Add tooltip on mouseover for each circle
								//Get this circle's x/y values, then augment for the tooltip
								var xPosition = d3.select(this).attr("cx");
								var yPosition = d3.select(this).attr("cy");
								//Update the tooltip position and value
								d3.select("#tooltip")
									//Show the tooltip above where the mouse triggers the event
									.style("left", (d3.event.pageX) + "px")     
                					.style("top", (d3.event.pageY - 90) + "px")
									.select("#city-label")	
									.html("<strong>" + d.place + "</strong>" + "<br/>" + "feddans: " + d.feddans)			
						   
								//Show the tooltip
								d3.select("#tooltip").classed("hidden", false);
						   })
						   .on("mouseout", function() {
						   
								//Hide the tooltip
								d3.select("#tooltip").classed("hidden", true);
								
						   })	
			
});

});

/**
 * Calculate the scale factor and the center coordinates of a GeoJSON
 * FeatureCollection. For the calculation, the height and width of the
 * map container is needed.
 *
 * Thanks to: http://stackoverflow.com/a/17067379/841644
 *
 * @param {object} features - A GeoJSON FeatureCollection object
 *   containing a list of features.
 *
 * @return {object} An object containing the following attributes:
 *   - scale: The calculated scale factor.
 *   - center: A list of two coordinates marking the center.
 */
function calculateScaleCenter(features) {
  // Get the bounding box of the paths (in pixels!) and calculate a
  // scale factor based on the size of the bounding box and the map
  // size.
  var bbox_path = path.bounds(features),
      scale = 0.95 / Math.max(
        (bbox_path[1][0] - bbox_path[0][0]) / width,
        (bbox_path[1][1] - bbox_path[0][1]) / height
      );

  // Get the bounding box of the features (in map units!) and use it
  // to calculate the center of the features.
  var bbox_feature = d3.geo.bounds(features),
      center = [
        (bbox_feature[1][0] + bbox_feature[0][0]) / 2,
        (bbox_feature[1][1] + bbox_feature[0][1]) / 2];

  return {
    'scale': scale,
    'center': center
  };
  
}
