// @ts-ignore
import * as d3 from 'd3'

export const doPlot = (plotData: any, element: any) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }

  // elements ...
  const ele = element

  // last modified: Nov 24, 2020; Feb 10, 2021 --
  const { datatype, data, markertype } = plotData

  /**
         * the final plot will look like:
         *           phenotype1 vs phenotype2
         *   project1  ------ |
         *   project2         | -------
         *   project 3 ------ |
         *            -------------------
         *                LDA score
         *
         *           phenotype1 vs phenotype3
         *   project1  ------ |
         *   project2         | -------
         *   project 3 ------ |
         *            -------------------
         *                LDA score

         *                .... (more subplots if there is any ... )
         */
  /**
   * some global variables
   */
  const format = d3.format('.3f')
  const margin = { top: 10, right: 30, bottom: 30, left: 300 },
    itemHeight = 20,
    axis_height = 40, // space for axis --
    space_between_items = 2,
    space_between_plots = 40,
    font_size = 10

  const width = 960 - margin.left - margin.right,
    nameLabelX = margin.left - 10

  // find out range of x
  let xmax = 5
  let xmin = -5

  /**
   * calculate total height of the plot
   * how many elements to be plotted here?
   *  + phenotype combinations?
   *  + items in each combinaiton?
   */
  let height =
    (Object.keys(data).length - 1) * space_between_plots + Object.keys(data).length * axis_height

  // loop through the data to get some basic information ...
  Object.entries(data).forEach(([, values]) => {
    // Feb 10, 2021; filter members by markertype
    // @ts-ignore
    let members = values.members
    if (markertype != '') {
      members = members.filter(function (d: any) {
        return d.taxon_rank_level === markertype
      })
    }

    height += members.length * itemHeight + (members.length - 1) * space_between_items
    // loop through the members ...
    Object.entries(members).forEach(([, rowValue]) => {
      // @ts-ignore
      if (rowValue.lda > xmax) {
        // @ts-ignore
        xmax = rowValue.lda
      }
      // @ts-ignore
      if (rowValue.lda < xmin) {
        // @ts-ignore
        xmin = rowValue.lda
      }
    })
  })

  const baselayer = d3
    .select(ele)
    .append('svg') //add an svg tag to body
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr('font-family', 'sans-serif')

  /**
   * #################################################################
   *      SVG contents ...
   * #################################################################
   */

  /**
   * ==========================================================
   * GO through phenotype combinations --
   */
  // x-axis
  const xscale = d3
    .scaleLinear()
    .domain([xmin, xmax]) // range of data
    .range([0.001, width]) // This is where the axis is placed: from 100px to 800px

  // @ts-ignore
  const xAxis = d3.axisTop().scale(xscale)

  let current_plot_start_y = margin.top
  // PLOT phenotype combinations one by one ...
  Object.entries(data).forEach(([phenotype_combination, values]: any) => {
    // first, create a subplot
    const subplot = baselayer.append('g').attr('id', phenotype_combination)

    // place it to the correct position
    subplot.attr('transform', 'translate(' + 0 + ',' + current_plot_start_y + ')')

    // add text annotation
    const title = subplot.append('g')
    title
      .append('text')
      .attr('x', 10)
      .attr('y', 15)
      .text(values.term1 + ' vs. ' + values.term2)
      .attr('data-placement', 'right')
      .attr('data-container', 'body')
      .attr(
        'data-title',
        'click to view all marker species and other details on this phenotype combination in our database in a new window/tab'
      )
      .attr('data-trigger', 'hover')
      .attr('bs-tooltip', 'tooltip')
    title.style('cursor', 'pointer')
    title.on('click', function () {
      window.open('/#/phenotypes/comparisons/' + values.acc1 + '/' + values.acc2)
    })

    // add project name ...
    const projectNames = subplot
      .append('g')
      .attr('transform', 'translate(' + 0 + ',' + axis_height + ')')

    // Feb 10, 2021; filter members by taxon_rank_level
    let members = values.members
    if (markertype) {
      members = members.filter(function (d: any) {
        return d.taxon_rank_level === markertype
      })
    }

    const text = projectNames
      .selectAll('projectNames' + '_' + phenotype_combination)
      .data(members)
      .enter()
      .append('g')
    text
      .append('text')
      .attr('detail-id', function (d: any) {
        if (datatype === 'project-centric-view') {
          return d.ncbi_taxon_id
        } else {
          return d.id
        }
      })
      .attr('x', nameLabelX)
      .attr('y', function (d: any, i: number) {
        return itemHeight * (i + 1.5) + 12 / 3 + i * space_between_items
      }) //
      .attr('text-anchor', 'end')
      .attr('data-placement', 'right')
      .attr('data-container', 'body')
      .attr('font-style', function () {
        return datatype === 'project-centric-view' ? 'italic' : null // conditional font style --
      })
      .text(function (d: any) {
        // Sep 27, 2021;
        if (d.marker_type === 'by_project') {
          // for http://gmrepo2018.local/taxon/1578
          return d.id + ' (' + d.datatype + ') '
        } else {
          // for http://gmrepo2018.local/data/project/PRJEB7774
          return d.id
        }
      })
      .on('click', function () {
        // @ts-ignore
        const id = d3.select(this).attr('detail-id')
        if (datatype === 'project-centric-view') {
          window.open('/#/taxon/' + id)
        } else {
          window.open('/#/data/project/' + id)
        }
      })
    text.style('cursor', 'pointer')

    // add LDA score ...
    const chart = subplot
      .append('g') // add a new layer
      .attr('transform', 'translate(' + margin.left + ',' + axis_height + ')')

    // add axis on the top
    chart
      .append('g')
      .attr('class', 'x axis')
      .call(xAxis)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('x', xscale(0))
      .attr('y', -axis_height + 15)
      .text('LDA score')
      .attr('fill', 'black')
      .attr('font-size', 12)

    const lda_barplot = chart.append('g').attr('id', 'ldabarplot' + phenotype_combination)
    const g = lda_barplot
      .selectAll('lda_barplot_' + phenotype_combination)
      .data(members)
      .enter()
      .append('g')
    g.append('rect')
      .attr('height', itemHeight)
      .attr('width', function (d: any) {
        return xscale(Math.abs(d.lda)) - xscale(0)
        // return xscale( Math.abs(d.lda) );
      }) //
      .attr('x', function (d: any) {
        if (d.lda > 0) {
          return xscale(0)
        } else {
          return xscale(d.lda)
        }
      }) //
      .attr('y', function (d: any, i: number) {
        return itemHeight * (i + 1) + i * space_between_items
      })
      .attr('fill', function (d: any) {
        let color = '#FCE7EC' // suggested by sicheng ...
        if (d.lda < 0) {
          color = '#CBF0E3'
        }
        return color
      })
    g.append('text')
      .attr('text-anchor', function (d: any) {
        return d.lda < 0 ? 'start' : 'end'
      })
      .attr('x', function (d: any) {
        return d.lda < 0 ? xscale(d.lda + 0.1) : xscale(d.lda - 0.1)
      })
      .attr('y', function (d: any, i: number) {
        return itemHeight * (i + 2) + (i + 1) * space_between_items - (font_size * 4) / 5
      })
      .text(function (d: any) {
        return format(d.lda)
      })
      .attr('fill', 'black')
      .attr('font-size', 12)

    current_plot_start_y +=
      axis_height +
      members.length * itemHeight +
      (members.length - 1) * space_between_items +
      space_between_plots
  })
  return baselayer
}
