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
let chart;

// Collect API data options to fetch
function fetchAndDisplayData(timespan) {
  switch (timespan) {
    case '20':
      url = `http://webapi19sa-1.course.tamk.cloud/v1/weather/wind_speed/20`;
      break;
    case '24':
      url = `http://webapi19sa-1.course.tamk.cloud/v1/weather/wind_speed/24`;
      break;
    case '48':
      url = `http://webapi19sa-1.course.tamk.cloud/v1/weather/wind_speed/48`;
      break;
    case '72':
      url = `http://webapi19sa-1.course.tamk.cloud/v1/weather/wind_speed/72`;
      break;
    case '1week':
      url = `http://webapi19sa-1.course.tamk.cloud/v1/weather/wind_speed/1week`;
      break;
    case '1month':
      url = `http://webapi19sa-1.course.tamk.cloud/v1/weather/wind_speed/1month`;
      break;
    default:
      url = `http://webapi19sa-1.course.tamk.cloud/v1/weather/wind_speed/24`;
  }


  // Fetching API url according to users choice on time span of the data
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const table = document.getElementById('windspeed-table');
      table.innerHTML = ''; // Clear the previous table content

    // Create table header
    const headerRow = table.insertRow();
    const dateHeader = headerRow.insertCell();
    const timeHeader = headerRow.insertCell();
    const tempHeader = headerRow.insertCell();
    dateHeader.textContent = 'Date';
    timeHeader.textContent = 'Time';
    tempHeader.textContent = 'Windspeed';

    // Create table rows
    data.forEach(rowData => {
      const row = table.insertRow();
      const dateCell = row.insertCell();
      const timeCell = row.insertCell();
      const tempCell = row.insertCell();
      const date = new Date(rowData.date_time);
      dateCell.textContent = date.toLocaleDateString();
      timeCell.textContent = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
      tempCell.textContent = Math.round(rowData.wind_speed);
    });

    // Insert table row data
    const tempValues = data.map(rowData => rowData.wind_speed);
    const tempLabels = data.map(rowData => {
      const date = new Date(rowData.date_time);
      return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
    });

      // Update the chart
      const chartData = {
        labels: data.map(item => new Date(item.date_time).toLocaleTimeString('fi-FI',{month: 'numeric', day: 'numeric', hour12: false, hour: 'numeric', minute: 'numeric'})),
        datasets: [{
          label: 'Wind Speed (m/s)',
          data: data.map(item => Math.round(item.wind_speed)),
          backgroundColor: 'rgba(60, 38, 149, 0.2)',
          borderColor: 'rgba(0, 38, 224, 0.8)',
          borderWidth: 1
        }]
      };

      // Get rid of old chart when changing timespan options
      if (chart) {
        chart.destroy();
      }
      chart = new Chart('windspeed-chart', {
        type: 'line',
        data: chartData,
      });
  // Update the statistics
  const allWindspeeds = data.map(item => Math.round(parseFloat(item.wind_speed)));
  const validWindspeeds = allWindspeeds.filter(value => !isNaN(value));
  const statsTable = document.createElement('table');
  const container = document.getElementById('statistics-container');
  container.innerHTML = ''; // Clear the previous statistics content
  container.appendChild(statsTable);
  const headerRowStats = statsTable.insertRow();
  headerRowStats.insertCell().textContent = 'Mean';
  headerRowStats.insertCell().textContent = 'Median';
  headerRowStats.insertCell().textContent = 'Mode';
  headerRowStats.insertCell().textContent = 'Range';
  headerRowStats.insertCell().textContent = 'Standard Deviation';
  const statsRow = statsTable.insertRow();
  statsRow.insertCell().textContent = mean(validWindspeeds).toFixed(2);
  statsRow.insertCell().textContent = median(validWindspeeds).toFixed(2);
  statsRow.insertCell().textContent = mode(validWindspeeds).join(', ');
  statsRow.insertCell().textContent = range(validWindspeeds).toFixed(2);
  statsRow.insertCell().textContent = standardDeviation(validWindspeeds).toFixed(2);
})


  .catch(error => console.error(error));
}
// Call the function initially with a 24-hour timespan
fetchAndDisplayData(24);
document.getElementById('timespan-select').addEventListener('change', (event) => {
  fetchAndDisplayData(event.target.value);
});
