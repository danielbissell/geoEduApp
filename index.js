

let margin = {
    top: 10,
    right: 20,
    bottom: 10,
    left: 20
  };
  
  const w = 1000 - margin.right - margin.left;
  const h = 700 - margin.top - margin.bottom;
  
  var projection = d3.geoMercator()
                  .translate([w/2, h/2])
                  .scale(200);
  
  var path = d3.geoPath()
      //      .projection(projection); //problem here
  
  //alternate scheme
  let color = ["#f21e1e", "#1e37f2" ];
  
  
  
  
  
  ////****** putting x before https to allow edits
  d3.json("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json", function(x) {
  
   // console.log(x.objects.counties.geometries[0]) ///waoh! 
    
    
  let jsonY = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json"
  
  d3.json(jsonY, function(y) {
   
  let varFips = []; 
  let varState = []; 
  let varArea_name = [];
  var varBachelorsOrHigher = [];
   
   y.map(m => { 
          varFips.push(m.fips);
          varState.push(m.state);
          varArea_name.push(m.area_name)
          varBachelorsOrHigher.push(m.bachelorsOrHigher);
      });
    
    var counties = topojson.feature(x, x.objects.counties).features
  
     const svg = d3.select(".chart")
         .append("svg")
         .attr("width", w + margin.right + margin.left)
         .attr("height", h + margin.top + margin.bottom)
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
         .append("g");
    
  svg.selectAll("counties")
     .data(counties)
     .enter()
     .append("path")
     .attr("class", "counties")
     .attr("d", path)
      .attr('fill', function(d) {
                    let county2 = {
                      "data-fips": 0
                    };
                    let color = d3.scaleThreshold()
      .domain(d3.range(2.6, 75.1, (75.1-2.6)/8))
      .range(d3.schemeBlues[9]);
                    for(let m = 0; m < varArea_name.length; m++){
                      county2["data-fips"] = y[m].fips;
                      let result = "";
                      if(d.id == county2["data-fips"]){
                        result = color(y[m].bachelorsOrHigher);
                        return result;
                        };
                        };
                   })    
    
     .on("mouseover",  (d, i) => {
           tooltip
             .style("left", (d3.event.pageX + 5) + "px")
             .style("top", (d3.event.pageY + 3) + "px")
             .style("display", "inline-block")
             .html( function(v){
                   let county = {
                         "state": '', 
                         "count": '',
                         "data-education": 0,
                         "data-fips": 0
                         };
  
                         for(let m = 0; m < varArea_name.length; m++){
                           county["data-fips"] = y[m].fips;
                        if(d.id == county["data-fips"]){
                           county["state"] = y[m].state;
                           county["data-education"] = y[m].bachelorsOrHigher;
                           county["count"] = y[m].area_name;                       
                          return county.state + ", " + county.count + " "+ county["data-education"] + "%";
                          //break;
                         }
                      };//end M
           });//end html
           })//end mouseOver
     .on("mouseout", function(d){tooltip.style("display", "none");});
    ;//end svg.selectAll
    
    
       let tooltip = d3
      .select("body")
      .style("position", "absolute")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 1);   
  
          let colorLeg = d3.scaleLinear()
     .domain(d3.range(.026, .751, (.751-.026)/8))
      .range(d3.schemeBlues[9]);
    
      var legendLinear = d3.legendColor()
        .shapeWidth(40)
        .orient('vertical')
        .cells(4)
  
        .labelFormat(d3.format(".1%"))
        .scale(colorLeg);
    
      svg.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(" + (w-200) + "," + ( +5) + ")");
      svg.select(".legendLinear")
        .call(legendLinear);
  
  
          });//end y   
   });//end x
        
  