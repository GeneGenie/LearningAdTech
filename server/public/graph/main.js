const startDate = '2015-01-01'
const endDate = '2024-12-31'
const type = 3
const groupBy = 'bidderCode'

fetch(`http://localhost:8080/analytics?startDate=${startDate}&endDate=${endDate}&type=${type}&groupBy=${groupBy}`)
  .then(res => res.json())
  .then(data => {
    console.log(data)
    const ctx = document.getElementById('hourlyChart').getContext('2d');
    const hourlyData = {
      labels: data.map(item => item.hour),
      datasets: [{
        label: 'Events Count',
        data: data.map(item => item.eventCount),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        tension: 0.1
      }]
    };
    const config = {
      type: 'line',
      data: hourlyData,
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Hours'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Event Count'
            },
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false,
            position: 'bottom'
          }
        }
      }
    };
    const hourlyChart = new Chart(ctx, config);
})

