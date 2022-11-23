import fs from 'fs'
export const getFolder = (path: any) => {
  const components: Array<string> = []
  const files = fs.readdirSync(path)
  files.forEach(function (item: string) {
    const stat = fs.lstatSync(path + '/' + item)
    if (stat.isDirectory() === true && item != 'components') {
      components.push(path + '/' + item)
      // eslint-disable-next-line prefer-spread
      components.push.apply(components, getFolder(path + '/' + item))
    }
  })
  return components
}

export const download = (data: Blob, fileName: string) => {
  if ('download' in document.createElement('a')) {
    const a = document.createElement('a')
    a.download = fileName
    a.style.display = 'none'
    a.href = URL.createObjectURL(data)
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(a.href)
    document.body.removeChild(a)
  } else {
    // @ts-ignore
    navigator.msSaveBlob(data, fileName)
  }
}

export const getSVGString = (svgNode: any) => {
  svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink')
  const cssStyleText = getCSSStyles(svgNode)
  appendCSS(cssStyleText, svgNode)

  const serializer = new XMLSerializer()
  let svgString = serializer.serializeToString(svgNode)
  svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink=') // Fix root xlink without namespace
  svgString = svgString.replace(/NS\d+:href/g, 'xlink:href') // Safari NS namespace fix

  return svgString

  function getCSSStyles(parentElement: any) {
    const selectorTextArr = []

    // Add Parent element Id and Classes to the list
    selectorTextArr.push('#' + parentElement.id)
    for (let c = 0; c < parentElement.classList.length; c++)
      if (!contains('.' + parentElement.classList[c], selectorTextArr))
        selectorTextArr.push('.' + parentElement.classList[c])

    // Add Children element Ids and Classes to the list
    const nodes = parentElement.getElementsByTagName('*')
    for (let i = 0; i < nodes.length; i++) {
      const id = nodes[i].id
      if (!contains('#' + id, selectorTextArr)) selectorTextArr.push('#' + id)

      const classes = nodes[i].classList
      for (let c = 0; c < classes.length; c++)
        if (!contains('.' + classes[c], selectorTextArr)) selectorTextArr.push('.' + classes[c])
    }

    // Extract CSS Rules
    let extractedCSSText = ''
    for (let i = 0; i < document.styleSheets.length; i++) {
      const s = document.styleSheets[i]

      try {
        if (!s.cssRules) continue
      } catch (e: any) {
        if (e.name !== 'SecurityError') throw e // for Firefox
        continue
      }

      const cssRules = s.cssRules as any
      for (let r = 0; r < cssRules.length; r++) {
        if (contains(cssRules[r].selectorText, selectorTextArr))
          extractedCSSText += cssRules[r].cssText
      }
    }

    return extractedCSSText

    function contains(str: string, arr: string[]) {
      return arr.indexOf(str) !== -1
    }
  }

  function appendCSS(cssText: string, element: any) {
    const styleElement = document.createElement('style')
    styleElement.setAttribute('type', 'text/css')
    styleElement.innerHTML = cssText
    const refNode = element.hasChildNodes() ? element.children[0] : null
    element.insertBefore(styleElement, refNode)
  }
}

export const svgString2Image = (
  svgString: string,
  width: number,
  height: number,
  format: string,
  callback: (a: any) => void
) => {
  format = format ? format : 'png'

  const imgsrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString))) // Convert SVG string to data URL

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  canvas.width = width
  canvas.height = height

  const image = new Image()
  image.onload = function () {
    // @ts-ignore
    context.clearRect(0, 0, width, height)
    // @ts-ignore
    context.drawImage(image, 0, 0, width, height)

    // @ts-ignore
    canvas.toBlob((blob: Blob) => {
      if (callback) callback(blob)
    })
  }

  image.src = imgsrc
}
