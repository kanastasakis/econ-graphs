//console.log("Okay Go!")

//let demandCurve = demandCurveFunction(-1, 10)
let table_labels = ["Price", "Quantity Demanded"]
let data = createDataArray([0,1,2,3,4,5,6,7,8,9,10], -1, 10)

let currentIncomeWeight = 0
let currentSubstituteWeight = 0
let currentComplimentWeight = 0

$(document).ready(() => {
    createTable(data, table_labels)
    createGraph(data)

    $("#range-income").on("input", (e) => {
        let currentValue = e.currentTarget.value
        currentIncomeWeight = (currentValue / 100)
        update(transformData(currentIncomeWeight, currentSubstituteWeight, currentComplimentWeight))
    })

    $("#range-substitute").on("input", (e) => {
        let currentValue = e.currentTarget.value
        currentSubstituteWeight = (currentValue / 100)
        update(transformData(currentIncomeWeight, currentSubstituteWeight, currentComplimentWeight))
    })

    $("#range-compliment").on("input", (e) => {
        let currentValue = e.currentTarget.value
        currentComplimentWeight = (currentValue / 100)
        update(transformData(currentIncomeWeight, currentSubstituteWeight, currentComplimentWeight))
    })
})

function demandCurveFunction(slope, offset) {
    return function (x) {
        return slope * x + offset
    }
}

function createDataArray(priceRange, slope, offset) {
    let demandCurve = demandCurveFunction(slope, offset)
    let arr = priceRange.map((d) => {
        return [d, demandCurve(d)]
    })
    return arr
}

function getPriceDomain(slope, offset) {
    let b = (-offset) / slope
    let bMin = Math.floor(b)
    let arr = []
    for (let i = 0; i < bMin; i++) {
        arr.push(i)
    }
    if(b > bMin){
        arr.push(b)
    }
    return arr
}

function transformData(incomeWeight, substituteWeight, complimentWeight) {
    let a = incomeWeight * 3 + substituteWeight * 3 - complimentWeight * 3
    let offset = 10 + a
    return createDataArray(getPriceDomain(-1, offset), -1, offset)
}

function createGraph(data) {
    let width = 400
    let height = 400
    let svg = d3.select("#graph-ctx svg")
    svg.attr('width', width)
    svg.attr('height', height)

    let X = d3.scaleLinear()
              .domain([0, 20])
              .range([50, width - 50])
    
    let Y = d3.scaleLinear()
              .domain([0, 20])
              .range([height-50, 50])

    let line = d3.line()
                 .x((d) => {
                     return X(d[1])
                 })
                 .y((d) => {
                    return Y(d[0])
                 })
    
    // Draw Y-Axis Labels
    let prices = data.map(function (d) {
        return d[0]
    })
    let yaxis = d3.axisLeft(Y)
    svg.append("g")
       .attr("transform", "translate(50,0)")
       .call(yaxis)

    svg.append('text')
       .attr("transform", "rotate(-90)")
       .attr("y", 10)
       .attr("x", -height * 0.5)
       .attr("dy", "1em")
       .style("text-anchor", "middle")
       .text(table_labels[0])

    // Draw X-Axis Labels
    let quantities = data.map(function (d) {
        return d[1]
    })
    let xaxis = d3.axisBottom(X)
    svg.append('g')
       .attr("transform", "translate(0," + (height - 50) + ")")
       .call(xaxis) 

    svg.append('text')
        .attr("y", height - 30)
        .attr("x", width * 0.5)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(table_labels[1])

    // Draw curve
    svg.append('path')
       .attr('id', 'demand-curve')
       .attr("fill", "none")
       .attr("stroke", "steelblue")
       .attr("stroke-linejoin", "round")
       .attr("stroke-linecap", "round")
       .attr("stroke-width", 1.5)
       .attr("d", line(data))
}

function updateGraph(data) {
    let width = 400
    let height = 400
    let svg = d3.select("#graph-ctx svg")
    let X = d3.scaleLinear()
              .domain([0, 20])
              .range([50, width - 50])
    
    let Y = d3.scaleLinear()
              .domain([0, 20])
              .range([height-50, 50])

    let line = d3.line()
                 .x((d) => {
                     return X(d[1])
                 })
                 .y((d) => {
                    return Y(d[0])
                 })

    // Redraw curve
    svg.select('path#demand-curve')
       .attr("d", line(data))
}

function createTable(data, headers) {
    data_copy = data.slice()
    if (headers !== null) {
        data_copy = headers.slice().concat(data_copy)
    }

    let numFormat = d3.format(".2f")
    // Create header
    d3.select('#table-ctx table thead')
      .append('tr')
    d3.select('#table-ctx table thead tr')
      .selectAll("td")
      .data(headers)
      .enter()
      .append('td')
      .text(function (d) {
          return d
      })

    // Create body
    let body_rows = d3.select("#table-ctx table tbody")
                      .selectAll("tr")
                      .data(data)
                      .enter()
                      .append('tr')
    body_rows.selectAll("td")
             .data(function (d) {
                 return d
             })
             .enter()
             .append('td')
             .text(function (d) {
                 return numFormat(d)
             })
             
}

function updateTable(data) {
    let numFormat = d3.format(".2f")

    // Create body
    let body_rows = d3.select("#table-ctx table tbody")
                      .selectAll("tr")
                      .data(data)
    body_rows.selectAll("td")
             .data(function (d) {
                 return d
             })
             .text(function (d) {
                 return numFormat(d)
             })
}

function update(data){
    updateGraph(data)
    updateTable(data)
}