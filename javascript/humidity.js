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
      url = `http://webapi19sa-1.course.tamk.cloud/v1/weather/humidity_out/20`;
      break;
    case '24':
      url = `http://webapi19sa-1.course.tamk.cloud/v1/weather/humidity_out/24`;
      break;
    case '48':
      url = `http://webapi19sa-1.course.tamk.cloud/v1/weather/humidity_out/48`;
      break;
    case '72':
      url = `http://webapi19sa-1.course.tamk.cloud/v1/weather/humidity_out/72`;
      break;
    case '1week':
      url = `http://webapi19sa-1.course.tamk.cloud/v1/weather/humidity_out/1week`;
      break;
    case '1month':
      url = `http://webapi19sa-1.course.tamk.cloud/v1/weather/humidity_out/1month`;
      break;
    default:
      url = `http://webapi19sa-1.course.tamk.cloud/v1/weather/humidity_out/24`;
  }


  // Fetching API url according to users choice on time span of the data
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const table = document.getElementById('humidity-table');
      table.innerHTML = ''; // Clear the previous table content

    // Create table header
    const headerRow = table.insertRow();
    const dateHeader = headerRow.insertCell();
    const timeHeader = headerRow.insertCell();
    const tempHeader = headerRow.insertCell();
    dateHeader.textContent = 'Date';
    timeHeader.textContent = 'Time';
    tempHeader.textContent = 'Humidity';

    // Create table rows
    data.forEach(rowData => {
      const row = table.insertRow();
      const dateCell = row.insertCell();
      const timeCell = row.insertCell();
      const tempCell = row.insertCell();
      const date = new Date(rowData.date_time);
      dateCell.textContent = date.toLocaleDateString();
      timeCell.textContent = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
      tempCell.textContent = Math.round(rowData.humidity_out);
    });

    // Insert table row data
    const humidityValues = data.map(rowData => rowData.humidity_out);
    const humidityLabels = data.map(rowData => {
      const date = new Date(rowData.date_time);
      return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
    });

      // Update the chart
      const chartData = {
        labels: data.map(item => new Date(item.date_time).toLocaleTimeString('fi-FI',{month: 'numeric', day: 'numeric', hour12: false, hour: 'numeric', minute: 'numeric'})),
        datasets: [{
          label: 'Humidity (%)',
          data: data.map(item => Math.round(item.humidity_out)),
          backgroundColor: 'rgb(12, 255, 99)',
          borderColor: 'rgb (70, 209, 142)',
          borderWidth: 1
        }]
      };

      // Get rid of old chart when changing timespan options
      if (chart) {
        chart.destroy();
      }
      chart = new Chart('humidity-chart', {
        type: 'line',
        data: chartData,
      });

  // Update the statistics
  const allHumidities = data.map(item => Math.round(parseFloat(item.humidity_out)));
  const validHumidities = allHumidities.filter(value => !isNaN(value));
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
  statsRow.insertCell().textContent = mean(validHumidities).toFixed(2);
  statsRow.insertCell().textContent = median(validHumidities).toFixed(2);
  statsRow.insertCell().textContent = mode(validHumidities).join(', ');
  statsRow.insertCell().textContent = range(validHumidities).toFixed(2);
  statsRow.insertCell().textContent = standardDeviation(validHumidities).toFixed(2);
})

  .catch(error => console.error(error));
}

// Call the function initially with a 24-hour time span
fetchAndDisplayData(24);
document.getElementById('timespan-select').addEventListener('change', (event) => {
  fetchAndDisplayData(event.target.value);
});
