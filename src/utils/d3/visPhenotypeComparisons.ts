// @ts-ignore
import * as d3 from 'd3'
import { Ref } from 'vue'

const bandClassifier = (val: number) => {
  const newval = val < 0 ? Math.floor(val) + 2 + 3 : Math.floor(val) + 3
  const newval2 = newval < 0 ? 0 : newval > 7 ? 7 : newval
  return newval2
}

export const doPlot = (
  plotData: any,
  element: any,
  selectorData: Ref<string[]>,
  axis: Ref<any>
) => {
  const tooltips = document.querySelectorAll('.tooltip.tooltip-info')
  tooltips.forEach((e) => document.body.removeChild(e))
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }

  // elements ...
  const ele = element

  const { plotoptions, markertype } = plotData
  let data = plotData.data
  if (markertype != '') {
    data = data.filter(function (d: any) {
      return d.taxon_rank_level === markertype
    })
  }

  const lPatchWidth = 200
  const itemSize = plotoptions.itemsize,
    cellMargin = parseFloat(plotoptions.margin),
    cellSize = itemSize - cellMargin * 2,
    margin = { top: 20, right: 20, bottom: 320, left: 160 },
    axisTickLabelFontSize = 13,
    lda_cutoff = parseFloat(plotoptions.ldacutoff),
    nproj_cutoff = parseInt(plotoptions.nrproj)

  // console.log( "lda cutoff is: " + lda_cutoff  + " nproj_cutoff: " + nproj_cutoff);

  // console.log(markertaxa);
  /**
   * DETERMINE XY axes ...
   * x, y
   * Nov 21, 2020: add filter according to nrproj --
   */
  const markertaxa = Array.from(
      new Set(
        data
          .filter(function (d: any) {
            return (
              d.nrproj >= nproj_cutoff &&
              Math.abs(d.LDA) >= lda_cutoff &&
              ((plotoptions.exclude && d.conflict === 1) || !plotoptions.exclude)
            )
          })
          .map(function (item: any) {
            return item.scientific_name
          })
      )
    ),
    projects = Array.from(
      new Set(
        data.map(function (item: any) {
          return item.project_id
        })
      )
    )

  selectorData.value = markertaxa as string[]

  // sep 27, 2017;
  const datamap = new Map()
  data.forEach((item: any) => {
    datamap.set(item.project_id, item)
  })

  /**
   * continue on global variable
   */
  const width = itemSize * markertaxa.length,
    height = itemSize * projects.length

  const colorHold = [
    '#2E6E12',
    '#57C84D',
    '#83D475',
    '#C5E8B7',
    '#F6BDC0',
    '#F1959B',
    '#EA4C46',
    '#781426'
  ]
  const colorLText = ['< -4', '-3', '-2', '-1', '1', '2', '3', '> 4']

  /**
   * #################################################################
   *      SVG contents ...
   * #################################################################
   */
  const baselayer = d3
    .select(ele)
    .append('svg') //add an svg tag to body
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr('font-family', 'sans-serif')

  const svg = baselayer
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // Define the div for the tooltip
  const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip tooltip-info')
    .style('margin', '10px')
    .style('padding', '10px')
    .style('background-color', '#d9edf7')
    .style('border-color', '#bce8f1')
    .style('opacity', 0)

  /**
   * --------------------------
   * y axis, manual plot
   * --------------------------
   */
  const yaxisG = svg.append('g').attr('id', 'yaxis')
  const yaxisLabel = yaxisG.selectAll('yaxislabels').data(projects).enter().append('g')

  yaxisLabel
    .append('text')
    .attr('x', -5)
    .attr('y', function (d, i) {
      return itemSize * (i + 0.5) + (axisTickLabelFontSize * 1) / 3
    })
    .attr('text-anchor', 'end')
    .attr('data-placement', 'right')
    .attr('data-container', 'body')
    .attr('data-title', 'click to view details on this project in our database in a new window/tab')
    .attr('data-trigger', 'hover')
    .attr('bs-tooltip', 'tooltip')
    .text(function (d) {
      return d + ' (' + datamap.get(d)['experiment_type'] + ')' // Sep 27, 2021 ...
    })
  yaxisLabel.style('cursor', 'pointer')
  yaxisLabel.on('click', function (event, d) {
    event.stopPropagation()
    window.open('#/data/project/' + d)
  })

  yaxisLabel
    .append('line')
    .attr('x1', -3)
    .attr('y1', function (d, i) {
      return itemSize * (i + 0.5)
    })
    .attr('x2', 0)
    .attr('y2', function (d, i) {
      return itemSize * (i + 0.5)
    })
    .style('stroke', 'black')

  /**
   * --------------------------
   * x axis, manual plot
   * --------------------------
   */

  const xaxisG = svg.append('g').attr('id', 'xaxis')
  axis.value = xaxisG
  const xaxisLabel = xaxisG.selectAll('xaxislabels').data(markertaxa).enter().append('g')

  xaxisLabel
    .append('text')
    .style('text-anchor', 'end')
    .attr('font-size', axisTickLabelFontSize)
    .attr('transform', function (d, i) {
      const x = itemSize * (i + 0.5) + (axisTickLabelFontSize * 1) / 3
      const y = projects.length * itemSize + 8
      return 'translate(' + x + ',' + y + ') rotate(-65)'
    })
    .text(function (d: any) {
      return d
    })

  xaxisLabel
    .append('line')
    .attr('x1', function (d, i) {
      return itemSize * (i + 0.5)
    })
    .attr('y1', projects.length * itemSize + 3)
    .attr('x2', function (d, i) {
      return itemSize * (i + 0.5)
    })
    .attr('y2', projects.length * itemSize)
    .style('stroke', 'black')

  /**
   * --------------------------
   * plot TILEs
   *  Nov 21, 2020: add filter according nr of projects in which the taxa are marker
   * --------------------------
   */
  svg
    .selectAll('rect')
    .data(
      data.filter(function (d: any) {
        return (
          d.nrproj >= nproj_cutoff &&
          Math.abs(d.LDA) >= lda_cutoff &&
          ((plotoptions.exclude && d.conflict === 1) || !plotoptions.exclude)
        )
      })
    )
    .enter()
    .append('g')
    .append('rect')
    .attr('class', 'cell')
    .attr('width', cellSize)
    .attr('height', cellSize)
    .attr('y', function (d: any) {
      return projects.indexOf(d.project_id) * itemSize + cellMargin
    })
    .attr('x', function (d: any) {
      return markertaxa.indexOf(d.scientific_name) * itemSize + cellMargin
    })
    .attr('fill', function (d: any) {
      return colorHold[bandClassifier(d.LDA)]
    })
    .attr('rx', 3)
    .attr('ry', 3)
    .attr('title', function (d: any) {
      return d.LDA
    })
    .on('mouseover', function (event, d: any) {
      d3.select(this).style('stroke', 'orange').style('stroke-width', '2px')

      tooltip.transition().duration(500).style('opacity', 1).style('visibility', 'visible')

      tooltip
        .html(
          '<b>Project</b>: ' +
            d.project_id +
            '<br/>' +
            '<b>Marker taxon</b>: <i>' +
            d.scientific_name +
            '</i> <br/>' +
            '<b>LDA</b>: ' +
            d.LDA
        )
        .style('left', event.pageX + 10 + 'px')
        .style('top', event.pageY - 100 + 'px')
    })
    .on('mouseout', function () {
      d3.select(this).style('stroke', 'none')

      tooltip.transition().duration(500).style('visibility', 'hidden').style('opacity', 0)
    })

  /**
   * --------------------------
   * legend
   * --------------------------
   */
  const legends = svg
    .append('g')
    .attr('class', 'legends')
    .attr('transform', 'translate(' + 0 + ',' + (height + margin.bottom - 35 - 20) + ')')

  const legend_tile_width = lPatchWidth / colorLText.length

  // title ...
  legends
    .append('text')
    .attr('x', lPatchWidth / 2)
    .attr('font-weight', 'bold')
    .attr('font-size', axisTickLabelFontSize)
    .style('text-anchor', 'middle')
    .text('LDA score')

  //Legend Rectangels
  legends
    .append('g')
    .attr('class', 'LegRect')
    .attr('transform', 'translate(0,' + 10 + ')')
    .selectAll('rect')
    .data(colorHold)
    .enter()
    .append('rect')
    .attr('width', lPatchWidth / colorHold.length + 'px')
    .attr('height', '10px')
    .attr('fill', function (d) {
      return d
    })
    .attr('x', function (d, i) {
      return i * (lPatchWidth / colorHold.length)
    })

  // legend text
  legends
    .append('g')
    .attr('class', 'LegText')
    .attr('transform', 'translate(0,' + 10 + ')')
    .selectAll('text')
    .data(colorLText)
    .enter()
    .append('text')
    .attr('x', function (d, i) {
      return (i + 0.5) * legend_tile_width
    })
    .attr('y', axisTickLabelFontSize + 10)
    .attr('font-weight', 'normal')
    .style('text-anchor', 'middle')
    .text(function (d) {
      return d
    })
  return baselayer
}
