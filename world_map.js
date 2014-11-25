var width  = 500, 
    height = 500, 
    scale   = 30,
    zoom_degree = 1.5,
    max_deg = 180;

var projection = d3.geo.orthographic()
                    .scale( Math.pow( scale, zoom_degree ) )
                    .translate([width / 2, height / 2])
                    .clipAngle(90);

var svg = d3.select( '#globe_container' ).append( 'svg' )
              .attr( 'width', $('#globe_container').css('width') )
              .attr( 'height', $('#globe_container').css('height') );
              
var longitude = d3.scale.linear()
                    .domain( [0, width] )
                    .range( [0, max_deg] ); 

var latitude = d3.scale.linear()
                    .domain( [0, height] )
                    .range( [0, max_deg] );

var path = d3.geo.path().projection( projection );

var graticule = d3.geo.graticule();

svg.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);

svg.append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#sphere");

svg.append("use")
    .attr("class", "fill")
    .attr("xlink:href", "#sphere");

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

var dragging = false,
    startX = 0,
    startY = 0,
    Lon = 95,
    Lat = -30;

projection.rotate( [Lon, Lat] );

$('#globe_container').on('mousewheel', function(event) {

    if( event.deltaY > 0 )
    {
        scale += 4;
        if( scale > 30 ) max_deg -= 10;
        max_deg  = max_deg < 20 ? 20 : max_deg;  
    }
    else
    {
        scale -= 4;
        if( scale < 166 ) max_deg += 10;
        max_deg  = max_deg > 180 ? 180 : max_deg; 
    }

    longitude.range( [0, max_deg] );
    latitude.range( [0, max_deg] );

    scale = scale < 10 ? 10 : scale; 

    projection.scale( Math.pow( scale, zoom_degree ) );
    path.projection( projection );
    svg.selectAll("path").attr("d", path);
});

svg.on( 'mouseup', function(){
    dragging = false;
} );

svg.on( 'mousedown', function() {
    dragging = true;
    var p = d3.mouse(this);
    startX = p[0];
    startY = p[1];
});

svg.on( 'mousemove', function(){
    if( dragging )
    {
        var p = d3.mouse(this);
        var dX = longitude( startX - p[0] );
        var dY = latitude( startY - p[1] );
        
        Lon = Lon - dX < 0   ? 360 : (Lon - dX) % 360;
        Lat = Lat + dY < -90 ? -90 : (Lat + dY);
        Lat = Lat + dY > 90  ? 90  : (Lat + dY );

        startX = p[0];
        startY = p[1];

        projection.rotate([Lon, Lat]);
        path.projection( projection );
        svg.selectAll("path").attr("d", path);
    }
} );

$( '.land' ).on( 'mouseover', function(){} );
$( '.land' ).on( 'mouseout', function(){} );

d3.json("topo_world.json", function(error, world) {

    var countries = topojson.feature( world, world.objects.world_geo );

    console.log( countries );
    svg.selectAll( '.countries' )
        .data( countries.features )
      .enter().append( 'path' )
        .attr("class", function( d ){ return "land " + d.id; })
        .attr("d", path);
});
