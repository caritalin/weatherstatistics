// Adding hamburger to navigation
function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// Format chart
let chartContainer;
let chartCanvas;
let chart;

// Function fetchData to fetch data according to users choises of mesurement and time span
function fetchData() {
  const measurementSelect = document.getElementById('measurementSelect');
  const timeSpanSelect = document.getElementById('timeSpanSelect');
  const table = document.getElementById('data-table');
  const measurement = measurementSelect.value;
  const timeSpan = timeSpanSelect.value;
  const url = `http://webapi19sa-1.course.tamk.cloud/v1/weather/${measurement}/${timeSpan}`;


  // Fetching data according to users selections of measurement and time span
  fetch(url)
    .then(response => response.json())
    .then(data => {
      table.innerHTML = '';

      const headerRow = table.insertRow();
      const dateHeader = headerRow.insertCell();
      const timeHeader = headerRow.insertCell();
      const measurementHeader = headerRow.insertCell();
      timeHeader.textContent = 'Date';
      dateHeader.textContent = 'Time';
      measurementHeader.textContent = measurement.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      data.forEach(rowData => {
        const row = table.insertRow();
        const dateCell = row.insertCell();
        const timeCell = row.insertCell();
        const measurementCell = row.insertCell();
        const date = new Date(rowData.date_time);
        dateCell.textContent = date.toLocaleDateString();
        timeCell.textContent = date.toLocaleTimeString('fi-FI', {hour12: false, hour: 'numeric', minute: 'numeric'});
        measurementCell.textContent = rowData[measurement];
      });

      // Get rid of old chart when changing timespan options
      if (chart) {
        chart.destroy();
      }
      
      // Making chart and choosing options
      const ctx = document.getElementById('chart').getContext('2d');
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(rowData => new Date(rowData.date_time).toLocaleTimeString('fi-FI',{month: 'numeric', day: 'numeric', hour12: false, hour: 'numeric', minute: 'numeric'})),
          datasets: [{
            label: measurement,
            data: data.map(rowData => rowData[measurement]),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        }
      });
    });
}



// Automatically fetch data when the page loads with the default measurement and timespan
fetchData();

// Update the table and chart when the measurement or timespan changes
const measurementSelect = document.getElementById('measurementSelect');
const timeSpanSelect = document.getElementById('timeSpanSelect');
measurementSelect.addEventListener('change', fetchData);
timeSpanSelect.addEventListener('change', fetchData);
