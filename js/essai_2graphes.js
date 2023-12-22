// Function to load data from a CSV file
const loadData = (filename, callback) => {
    d3.csv(filename, (error, data) => {
      if (error) {
        console.error(`Error loading ${filename}:`, error);
        return;
      }
      callback(data);
    });
  };
  
  // Array to store data from multiple CSV files
  const allData = [];
  
  // List of CSV file names
  const csvFiles = [
    '/data/web_data/matching_result_prop_25.csv',
    '/data/web_data/matching_result_prop_50.csv',
    '/data/web_data/matching_result_prop_75.csv',
    '/data/web_data/matching_result_prop_90.csv'
  ];
  
  const loadAllData = () => {
    const promises = csvFiles.map((filename) => {
      return new Promise((resolve, reject) => {
        loadData(filename, (data) => resolve(data));
      });
    });
  
    Promise.all(promises)
      .then((dataArray) => {
        allData.push(...dataArray);
        setupPlot();
      })
      .catch((error) => {
        console.error("Error loading data:", error);
      });
  };
  
  const drawConfidenceIntervals = (svg, data, xOffset) => {
    const line = d3.line()
      .x((d, i) => i === 0 ? 0 : +d[0] * 30 + xOffset) // Assuming first column is x value (control group)
      .y((d, i) => i === 0 ? 200 - +d[1] : 200 - +d[0]); // Assuming second column is y value (middle point)
  
    svg.append("path")
      .data([data.slice(1)]) // Exclude the first row (middle point)
      .attr("class", "ci-line")
      .attr("d", line)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", "none");
  
    svg.selectAll(".ci-dot")
      .data(data.slice(1)) // Exclude the first row (middle point)
      .enter().append("circle")
      .attr("class", "ci-dot")
      .attr("cx", (d, i) => i === 0 ? 0 : +d[0] * 30 + xOffset) // Assuming first column is x value (control group)
      .attr("cy", (d, i) => i === 0 ? 200 - +d[1] : 200 - +d[0]) // Assuming second column is y value (middle point)
      .attr("r", 3)
      .attr("fill", "black");
  };
  
  const setupPlot = () => {
    const svg = d3.select("#plot-container")
      .append("svg")
      .attr("width", 800)
      .attr("height", 800);
  
    // Add circles for the initial data
    updatePlot(0, svg);
  
    // Add event listener to update plot on slider change
    const slider = document.getElementById("data-slider");
    slider.addEventListener("input", () => {
      updatePlot(+slider.value, svg);
    });
  };
  
  const updatePlot = (datasetIndex, svg) => {
    // Clear previous plot
    svg.selectAll("*").remove();
  
    // Extract control and treated data for the current dataset
    const controlData = allData[datasetIndex];
    const treatedData = allData[datasetIndex];
  
    // Add circles for each data point in the control group
    svg.selectAll("circle.control")
      .data([controlData[0]]) // Use only the first row (middle point)
      .enter()
      .append("circle")
      .attr("class", "control")
      .attr("cx", d => 0) // X value for the control group
      .attr("cy", d => 200 - +d[1]) // Y value for the middle point
      .attr("r", 5)
      .attr("fill", "blue");
  
    // Draw confidence intervals for the control group
    drawConfidenceIntervals(svg, controlData, 0);
  
    // Add circles for each data point in the treated group
    svg.selectAll("circle.treated")
      .data([treatedData[0]]) // Use only the first row (middle point)
      .enter()
      .append("circle")
      .attr("class", "treated")
      .attr("cx", d => 0) // X value for the treated group
      .attr("cy", d => 200 - +d[2]) // Y value for the middle point
      .attr("r", 5)
      .attr("fill", "red");
  
    // Draw confidence intervals for the treated group
    drawConfidenceIntervals(svg, treatedData, 10);
  
    // Update slider value display
    const sliderValue = document.getElementById("slider-value");
    sliderValue.textContent = datasetIndex;
  };
  
  // Load data from CSV files
  loadAllData();
  