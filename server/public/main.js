{
  const table = document.querySelector('#event_table')
  const table_content = document.querySelector('#event_table .table-content')

  const startDate = '2015-01-01'
  const endDate = '2024-12-31'
  const type = 3
  const groupBy = 'bidderCode'

  const table_row_template = (data) => (`
    <tr>
      <td>${data.hour}</td>
      <td>${data.eventCount}</td>
      <td>${data.averageCpm || "no cpm"}</td>
      <td>${data[groupBy]}</td>
    </tr>
  `) 
  table.tHead.querySelector('tr').innerHTML += `<th>Grouped By: ${groupBy}</th>`
  fetch(`http://localhost:8080/analytics?startDate=${startDate}&endDate=${endDate}&type=${type}&groupBy=${groupBy}`)
  .then(res => res.json())
  .then(data => {
    data.forEach(item => {
      table_content.innerHTML += table_row_template(item)
    })
  })
}