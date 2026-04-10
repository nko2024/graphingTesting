const margin = { top: 20, right: 20, bottom: 40, left: 50 };
const width = 700 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select("#chart")
  .append("svg")
  .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Tooltip
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip");

  d3.json("data/data.json")
  .then(data => {

    const x = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([height, 0]);

    // Axes
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));

    // Bars (start at bottom)
    const bars = svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.category))
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", "#2f6ea5");

    // Animation
    bars.transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attr("y", d => y(d.value))
      .attr("height", d => height - y(d.value));

    // Tooltip
    bars
      .on("mouseover", function(event, d) {
        tooltip
          .style("opacity", 1)
          .html(`
            <strong>${d.category}</strong><br/>
            Requests: ${d.value}<br/>
            <div style="margin-top:6px;font-size:12px;">
              ${d.description || ""}
            </div>
          `);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        tooltip.style("opacity", 0);
      });

  })
  .catch(error => {
    console.error("DATA ERROR:", error);
  });

/*

console.log("LOADING ARCGIS DATA");

d3.json("https://services.arcgis.com/rYz782eMbySr2srL/arcgis/rest/services/Horticulture%20Open%20Data/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson")
  .then(geoData => {

    console.log("RAW DATA:", geoData);

    const features = geoData.features;

    // 🔑 GROUPING LOGIC (you will adjust this)
    const counts = {};

    features.forEach(f => {
      const type = f.properties.TYPE || "Unknown"; // <-- adjust field name

      if (!counts[type]) {
        counts[type] = 0;
      }

      counts[type]++;
    });

    // Convert to chart-friendly format
    const data = Object.keys(counts).map(key => ({
      category: key,
      value: counts[key]
    }));

    console.log("PROCESSED DATA:", data);

    renderChart(data);

  })
  .catch(error => {
    console.error("DATA LOAD FAILED:", error);
  });

  function renderChart(data) {

  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = 700 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
    .domain(data.map(d => d.category))
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .nice()
    .range([height, 0]);

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y));

  const bars = svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.category))
    .attr("width", x.bandwidth())
    .attr("y", height)
    .attr("height", 0)
    .attr("fill", "#2f6ea5");

  bars.transition()
    .duration(1000)
    .attr("y", d => y(d.value))
    .attr("height", d => height - y(d.value));
}
*/
