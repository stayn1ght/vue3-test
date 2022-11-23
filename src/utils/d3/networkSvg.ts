// @ts-ignore
import * as d3 from 'd3'
import { Ref } from 'vue'
import { ReactiveVariable } from 'vue/macros'

export function doPlot(graph: ReactiveVariable<any>, element: any, selectorData: Ref<string[]>) {
  /**
   * ##############################################################
   *     global variables
   * ##############################################################
   */
  const nominal_base_node_size = 8
  const nominal_text_size = 10
  const max_text_size = 24
  const nominal_stroke = 1
  const max_stroke = 1
  const max_base_node_size = 36
  const min_zoom = 0.1
  const max_zoom = 7

  let focus_node: any = null,
    highlight_node: any = null

  const text_center = false
  const outline = false

  const highlight_color = 'blue'
  const highlight_trans = 0.1

  let tocolor = 'fill'
  let towhite = 'stroke'

  let width = 550,
    height = 450

  /**
   * ============================================================
   *    defined colors
   * ============================================================
   */
  const color_phage_with_specific_target = 'pink'
  const color_phage_with_multiple_targets = 'LIGHTCORAL'
  const color_bacteria = 'yellowgreen'
  /**
   * ##############################################################
   *       global D3 objects
   * ##############################################################
   */
  const zoom: any = d3.zoom().scaleExtent([min_zoom, max_zoom])

  // ============== size of objects ==============
  const size = d3
    .scalePow()
    .exponent(1)
    .domain([1, graph.max_n]) // range of input values
    .range([8, 20]) // pixel radius of output

  const strokeWidthFunc = d3.scaleLinear().domain([0, 1]).range([1, 6])

  /**
   * ##############################################################
   *       other  global objects
   * ##############################################################
   */
  const linkedByIndex = {}
  let transform_k = 1

  /**
   * ##############################################################
   * help functions
   * ##############################################################
   */
  function isConnected(a: any, b: any) {
    return (
      // @ts-ignore
      linkedByIndex[a.index + ',' + b.index] ||
      // @ts-ignore
      linkedByIndex[b.index + ',' + a.index] ||
      a.index == b.index
    )
  }

  function exit_highlight() {
    highlight_node = null
    if (focus_node === null) {
      svg.style('cursor', 'move')
      circle.style(towhite, 'white')
      text.style('font-weight', 'normal').attr('display', 'none')
      linktext.style('font-weight', 'normal').attr('display', 'none')

      link
        .style('stroke-width', function (d: any) {
          return strokeWidthFunc(Math.abs(d.coef_pearson)) + 'px'
        })
        .style('stroke', function (d: any) {
          return d.coef_pearson > 0 ? 'darkgreen' : 'darkred'
        })
    }
  }

  function set_focus(d: any) {
    if (highlight_trans < 1) {
      circle.style('opacity', function (o: any) {
        return isConnected(d, o) ? 1 : highlight_trans
      })

      link.style('opacity', function (o: any) {
        return o.source.index == d.index || o.target.index == d.index ? 1 : highlight_trans
      })
    }
  }

  function set_highlight(d: any) {
    svg.style('cursor', 'pointer')
    if (highlight_color !== 'white') {
      circle.style(towhite, function (o: any) {
        return isConnected(d, o) ? highlight_color : 'white'
      })
      text
        .style('font-weight', function (o: any) {
          return isConnected(d, o) ? 'bold' : 'normal'
        })
        .attr('display', function (o: any) {
          return isConnected(d, o) ? 'visible' : 'none'
        })

      linktext
        .style('font-weight', function (o: any) {
          return o == d ? 'bold' : 'normal'
        })
        .attr('display', function (o: any) {
          return o == d ? 'visible' : 'none'
        })

      // --- highlight color; also make sure line and arrowhead have the same color !!!
      link
        .style('stroke-width', function (d: any) {
          return strokeWidthFunc(Math.abs(d.coef_pearson)) + 'px'
        })
        .style('stroke', function (d: any) {
          return d.coef_pearson > 0 ? 'darkgreen' : 'darkred'
        })
    }
  }

  function set_highlight_two_nodes(d1: any, d2: any) {
    svg.style('cursor', 'pointer')

    circle.style(towhite, function (o: any) {
      return o == d1 || o == d2 ? highlight_color : 'white'
    })
    text
      .style('font-weight', function (o: any) {
        return o == d1 || o == d2 ? 'bold' : 'normal'
      })
      .attr('display', function (o: any) {
        return o == d1 || o == d2 ? 'visible' : 'none'
      })
  }

  function resize() {
    width = ele.offsetWidth
    height = ele.offsetHeight
    if (width == 0 || height == 0) {
      width = 1170
      height = 459
    }
    svg.attr('width', width).attr('height', height)
  }

  /**
   * #################################################################
   *      HTML ...
   * #################################################################
   */

  // remove all child first
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }

  /**
   * ================================================================
   *    two elements will be added here:
   *    1. selector
   *    2. the svg canvas
   *    3. some save buttons
   * ================================================================
   */

  /**
   * #################################################################
   *      SVG contents ...
   * #################################################################
   */
  const ele = element
  const svg: any = d3.select(ele).append('svg').attr('width', width).attr('height', height)

  svg.style('cursor', 'move')
  const g = svg.append('g')

  /**
   * =================================================================
   *     selector
   * =================================================================
   */
  selectorData.value = []
  for (let i = 0; i < graph.nodes.length; i++) {
    selectorData.value.push(graph.nodes[i].name2)
  }
  /**
   * ====================================================================
   * define/declare the layout --
   * ====================================================================
   */
  const force: any = d3
    .forceSimulation(graph.nodes)
    .force('charge', d3.forceManyBody().strength(-3000))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('x', d3.forceX(width / 2).strength(1))
    .force('y', d3.forceY(height / 2).strength(1))
    .force('link', d3.forceLink(graph.links).distance(50).strength(1))

  // ========  define links =======
  // last modified: June 24, 2021 --
  graph.links.forEach(function (d: any) {
    // @ts-ignore
    linkedByIndex[d.source.index + ',' + d.target.index] = true
  })

  // ===== build link and decide color ======
  const link: any = g
    .selectAll('.link')
    .data(graph.links)
    .enter()
    .append('line')
    .attr('class', 'link')
    .style('stroke-width', function (d: any) {
      return strokeWidthFunc(Math.abs(d.coef_pearson)) + 'px'
    })
    .style('stroke', function (d: any) {
      return d.coef_pearson > 0 ? 'darkgreen' : 'darkred'
    })
  // .attr("marker-end", "url(#arrowHead)")

  const linktext: any = g
    .selectAll('.linkedtext')
    .data(graph.links)
    .enter()
    .append('text')
    .attr('dy', '.35em')
    .style('font-size', nominal_text_size + 'px')
    .attr('display', 'none')
    .attr('dx', 2)
    .text(function (d: any) {
      return '\u2002' + ' cor = ' + Number(d.coef_pearson).toFixed(4)
    })

  // ===============  link text click events ====================
  linktext.on('click', function (e: any, d: any) {
    e.stopPropagation()
    const landingUrl = '/#/' + d.url
    window.open(landingUrl)
  })

  /**
   * ================================================================
   *        NODEs
   * ================================================================
   */
  // ====== build node and assign color ======
  const node: any = g
    .selectAll('.node')
    .data(graph.nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended))

  function dragstarted(e: any, d: any) {
    e.sourceEvent.stopPropagation()
    if (!e.active) force.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  function dragged(e: any, d: any) {
    d.fx = e.x
    d.fy = e.y
  }

  function dragended(e: any, d: any) {
    if (!e.active) force.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  // ===========   decide circle styles   ===========
  if (outline) {
    tocolor = 'stroke'
    towhite = 'fill'
  }

  const circle: any = node
    .append('path')
    .attr(
      'd',
      d3
        .symbol()
        .size(function (d: any) {
          return Math.PI * Math.pow(size(d.size) || nominal_base_node_size, 2)
        })
        .type(function () {
          return d3.symbolCircle
        })
    )
    .style(tocolor, function (d: any) {
      // color fill roles:
      // greenish if microbes,
      // pink if phage and has only one target
      // red if phage and has >= 2 target
      return d.url === 'microbes'
        ? color_bacteria
        : d.size == 1
        ? color_phage_with_specific_target
        : color_phage_with_multiple_targets
    })
    .style('stroke-width', nominal_stroke)
    .style(towhite, 'white')

  /**
   * ==========================================================
   *      TEXT elements FOR NODES ...
   * ==========================================================
   */
  const text: any = g
    .selectAll('.text')
    .data(graph.nodes)
    .enter()
    .append('text')
    .attr('dy', '.35em')
    .style('font-size', nominal_text_size + 'px')
    .attr('display', 'none')

  if (text_center)
    text
      .text(function (d: any) {
        return d.id
      })
      .style('text-anchor', 'middle')
  else
    text
      .attr('dx', function (d: any) {
        return size(d.size) || nominal_base_node_size
      })
      .text(function (d: any) {
        return '\u2002' + d.name2
      })

  // ===============  text click events ====================
  text.on('click', function (e: any, d: any) {
    e.stopPropagation()
    const landingUrl = '/#/' + d.url
    window.open(landingUrl)
  })

  /**
   * ==========================================================
   *      mouse events on nodes
   * ==========================================================
   */
  node
    .on('mouseover', function (e: any, d: any) {
      focus_node = d
      set_highlight(d)
    })
    .on('mousedown', function (e: any, d: any) {
      e.stopPropagation()
      focus_node = d
      set_focus(d)
      if (highlight_node === null) {
        set_highlight(d)
      }
    })
    .on('mouseout', function () {
      // focus_node = null;
      exit_highlight()
    })

  /**
   * ==========================================================
   *      mouse events on links;
   * ==========================================================
   */
  link
    .on('mouseover', function (e: any, d: any) {
      set_highlight_two_nodes(d.source, d.target)

      linktext
        .style('font-weight', function (o: any) {
          return o == d ? 'bold' : 'normal'
        })
        .attr('display', function (o: any) {
          return o == d ? 'visible' : 'none'
        })
    })
    .on('mouseout', function () {
      svg.style('cursor', 'move')
      // exit_highlight();
    })

  // click function .. 暂时取消 redirect ...
  // .on("click", function( d ) {
  //     d3.event.stopPropagation();
  //
  //     // 注意：这里暂时写成这样 ...
  //     var landingUrl = "http://" + $window.location.host + "/" + d.source.url;
  //     $window.open(landingUrl);
  // })

  /**
   * ==========================================================
   *      mouse events on canvas
   * ==========================================================
   */
  d3.select(ele).on('mouseup', function () {
    if (highlight_trans < 1) {
      circle.style('opacity', 1)
      link.style('opacity', 1)
    }
  })

  d3.select(ele).on('click', function () {
    exit_highlight()
  })

  /**
   * ==========================================================
   *      zoom in and out on canvas
   * ==========================================================
   */
  zoom.on('zoom', function (e: any) {
    let stroke = nominal_stroke
    if (nominal_stroke * e.transform.k > max_stroke) stroke = max_stroke / e.transform.k
    link
      .style('stroke-width', function (d: any) {
        return strokeWidthFunc(Math.abs(d.coef_pearson)) + 'px'
      })
      .style('stroke', function (d: any) {
        return d.coef_pearson > 0 ? 'darkgreen' : 'darkred'
      })

    circle.style('stroke-width', stroke)

    let base_radius = nominal_base_node_size
    if (nominal_base_node_size * e.transform.k > max_base_node_size)
      base_radius = max_base_node_size / e.transform.k
    circle.attr(
      'd',
      d3
        .symbol()
        .size(function (d: any) {
          return (
            Math.PI *
            Math.pow((size(d.size) * base_radius) / nominal_base_node_size || base_radius, 2)
          )
        })
        .type(function () {
          return d3.symbolCircle
        })
    )

    //circle.attr("r", function(d) { return (size(d.size)*base_radius/nominal_base_node_size||base_radius); })
    if (!text_center)
      text.attr('dx', function (d: any) {
        return (size(d.size) * base_radius) / nominal_base_node_size || base_radius
      })

    let text_size = nominal_text_size
    if (nominal_text_size * e.transform.k > max_text_size) text_size = max_text_size / e.transform.k
    text.style('font-size', text_size + 'px')

    g.attr('transform', 'translate(' + e.translate + ')scale(' + e.scale + ')')
  })

  svg.call(
    zoom.on('zoom', function (e: any) {
      g.attr('transform', e.transform)
      transform_k = e.transform.k
    })
  )

  resize()

  d3.select(ele).on('resize', resize)

  /**
   * ==========================================================
   *      events on force; no idea what they are doing ...
   * ==========================================================
   */
  force.on('tick', function () {
    node.attr('transform', function (d: any) {
      return 'translate(' + d.x + ',' + d.y + ')'
    })
    text.attr('transform', function (d: any) {
      return 'translate(' + d.x + ',' + d.y + ')'
    })

    linktext.attr('transform', function (d: any) {
      const x = (d.source.x + d.target.x) / 2
      const y = (d.source.y + d.target.y) / 2
      return 'translate(' + x + ',' + y + ')'
    })

    link
      .attr('x1', function (d: any) {
        return d.source.x
      })
      .attr('y1', function (d: any) {
        return d.source.y
      })
      .attr('x2', function (d: any) {
        return d.target.x
      })
      .attr('y2', function (d: any) {
        return d.target.y
      })

    node
      .attr('cx', function (d: any) {
        return d.x
      })
      .attr('cy', function (d: any) {
        return d.y
      })
  })
  return {
    svg,
    cb: (val: string) => {
      d3.selectAll('.node').each(function (d: any) {
        if (d.name2 === val) {
          // move selected node to focus
          const dcx = ele.offsetWidth / 2 - d.x * transform_k
          const dcy = ele.offsetWidth / 2 - d.y * transform_k
          g.attr('transform', 'translate(' + dcx + ',' + dcy + ')scale(' + transform_k + ')')

          // highlight current node and its neighbors --
          focus_node = d
          set_highlight(d)
        }
      })
    }
  }
}
