import createShader from '@/utils/shader'
import createProgram from '@/utils/program'
import Polygon from './models/Polygon'
import Vertex from './primitives/Vertex'
import Line from './models/Line'
import Square from './models/Square'
import Rectangle from './models/Rectangle'
import type Model from './primitives/Model'
import ScaleXInput from './ui/ScaleXInput'
import TranslateXInput from './ui/TranslateXInput'
import TranslateYInput from './ui/TranslateYInput'

enum CursorType {
  SELECT = 0,
  LINE = 1,
  SQUARE = 2,
  RECTANGLE = 3,
  POLYGON = 4,
}

let cursorType: CursorType = CursorType.LINE
let isDrawing: boolean = false
let selectedModel:
| Model
| Line
| Square
| Rectangle
| Polygon
| undefined
| null
let selectedVertex: Vertex | undefined | null

const canvasElmt = document.getElementById('webgl-canvas')
if (!canvasElmt) {
  throw Error('Canvas not found')
}

const canvas = canvasElmt as HTMLCanvasElement
const gl = canvas.getContext('webgl')
if (gl === null) {
  throw Error('WebGL not supported')
}

const vertexShaderSource =
  document.getElementById('vertex-shader')?.textContent
const fragmentShaderSource =
  document.getElementById('fragment-shader')?.textContent
if (!vertexShaderSource || !fragmentShaderSource) {
  throw Error('Shader source not found')
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource
)

const program = createProgram(gl, vertexShader, fragmentShader)

const posAttrLoc = gl.getAttribLocation(program, 'a_position')
const colorAttrLoc = gl.getAttribLocation(program, 'a_color')
const matUniLoc = gl.getUniformLocation(program, 'u_matrix')
const resUniLoc = gl.getUniformLocation(program, 'u_resolution')

if (!matUniLoc || !resUniLoc) {
  throw Error('Location not found')
}

const posBuffer = gl.createBuffer()
const colorBuffer = gl.createBuffer()

if (!posBuffer || !colorBuffer) {
  throw Error('Buffer not created')
}

const width = canvas.clientWidth
const height = canvas.clientHeight

canvas.width = width
canvas.height = height

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

gl.clearColor(0, 0, 0, 0)
gl.clear(gl.COLOR_BUFFER_BIT)

gl.useProgram(program)
gl.uniform2f(resUniLoc, gl.canvas.width, gl.canvas.height)

// TODO: render models based on user interaction & create constraint
const line = new Line()
line.addVertex(new Vertex([50, 100], [1, 0, 0.7, 1]))
line.addVertex(new Vertex([100, 300], [0, 1, 0, 1]))

const square = new Square()
square.addVertex(new Vertex([200, 100], [0, 1, 0, 0.5]))
square.addVertex(new Vertex([200, 300], [0, 0, 1, 0.5]))
square.addVertex(new Vertex([400, 300], [1, 0, 0, 0.5]))
square.addVertex(new Vertex([400, 100], [0, 0, 0.5, 0.5]))
square.addVertex(new Vertex([200, 100], [0, 1, 0, 0.5]))

const rectangle = new Rectangle()
rectangle.addVertex(new Vertex([500, 100], [0, 1, 0, 0.5]))
rectangle.addVertex(new Vertex([500, 300], [0, 0, 0.5, 0.5]))
rectangle.addVertex(new Vertex([800, 300], [1, 0, 0, 0.5]))
rectangle.addVertex(new Vertex([800, 100], [0, 0, 0.5, 0.5]))
rectangle.addVertex(new Vertex([500, 100], [0, 1, 0, 0.5]))

const polygon = new Polygon()
polygon.addVertex(new Vertex([1350, 200], [0, 1, 0, 0.5]))
polygon.addVertex(new Vertex([900, 100], [1, 0, 0, 0.5]))
polygon.addVertex(new Vertex([1400, 120], [0, 1, 0.5, 0.5]))
polygon.addVertex(new Vertex([1020, 300], [0, 0, 1, 0.5]))
polygon.addVertex(new Vertex([910, 200], [0, 0, 1, 0.5]))
polygon.addVertex(new Vertex([905, 150], [0, 0, 1, 0.5]))

// on click draw example
const clickPolygon = new Polygon()
const models = [line, square, rectangle, polygon, clickPolygon]

// Initialize selected model
selectedModel = models[0]

const modelDropdown = document.getElementById('model-select')
const vertexDropdown = document.getElementById('vertex-select')

// Initialize model dropdown
if (modelDropdown) {
  models.forEach((model) => {
    const option = document.createElement('option')
    option.value = model.id
    option.text = model.id
    modelDropdown.appendChild(option)
  })
}

// Change selected model using dropdown
modelDropdown?.addEventListener('change', (e) => {
  selectedModel = models.find(
    (model) => model.id === (e.target as HTMLSelectElement).value
  )
  selectedVertex = null
  if (vertexDropdown && selectedModel) {
    // Reset vertex dropdown
    vertexDropdown.innerHTML = ''

    // Initialize vertex dropdown based on selected model
    let first: boolean = true
    selectedModel.vertexList.forEach((vertex) => {
      if (vertex.id !== selectedModel?.vertexList[0].id || first) {
        const option = document.createElement('option')
        option.value = vertex.id
        option.text = vertex.id
        vertexDropdown.appendChild(option)
      }
      first = false
    })

    // Add all vertex option
    vertexDropdown.appendChild(new Option('All Vertex', undefined))
  }

  if (selectedModel) {
    new TranslateXInput().addListener(canvas, selectedModel)
    new TranslateYInput().addListener(canvas, selectedModel)
    new ScaleXInput().addListener(canvas, selectedModel)
  }
})

// Change selected vertex using dropdown
vertexDropdown?.addEventListener('change', (e) => {
  selectedVertex = selectedModel?.vertexList.find(
    (vertex) => vertex.id === (e.target as HTMLSelectElement).value
  )
})

// TODO: implement for other shapes (remove if not used)
canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - 100
  const y = rect.bottom - e.clientY
  switch (cursorType) {
    case CursorType.LINE:
      if (!isDrawing) {
        isDrawing = true
        models.push(new Line(new Vertex([x, y])))
        modelDropdown?.appendChild(
          new Option(models[models.length - 1].id, models[models.length - 1].id)
        )
      }
      break
    case CursorType.SQUARE:
      if (!isDrawing) {
        isDrawing = true
        models.push(new Square(new Vertex([x, y])))
        modelDropdown?.appendChild(
          new Option(models[models.length - 1].id, models[models.length - 1].id)
        )
      }
      break
    case CursorType.RECTANGLE:
      if (!isDrawing) {
        isDrawing = true
        models.push(new Rectangle(new Vertex([x, y])))
        modelDropdown?.appendChild(
          new Option(models[models.length - 1].id, models[models.length - 1].id)
        )
      }
      break
    case CursorType.POLYGON:
      models[4].addVertex(new Vertex([x, y]))
      break
  }
})

// TODO: implement for other shapes (remove if not used)
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - 100
  const y = rect.bottom - e.clientY
  if (isDrawing) {
    switch (cursorType) {
      case CursorType.LINE: {
        const line = models[models.length - 1] as Line
        line.updateVerticesWhenDrawing(x, y)
        break
      }
      case CursorType.SQUARE: {
        const square = models[models.length - 1] as Square
        square.updateVerticesWhenDrawing(x, y, canvas)
        break
      }
      case CursorType.RECTANGLE: {
        const rectangle = models[models.length - 1] as Rectangle
        rectangle.updateVerticesWhenDrawing(x, y)
        break
      }
      case CursorType.POLYGON:
        break
    }
  }
})

// TODO: implement for other shapes (remove if not used)
canvas.addEventListener('mouseup', (e) => {
  switch (cursorType) {
    case CursorType.LINE:
      isDrawing = false
      break
    case CursorType.SQUARE:
      isDrawing = false
      break
    case CursorType.RECTANGLE:
      isDrawing = false
      break
    case CursorType.POLYGON:
      break
  }
})

export const renderAll = (): void => {
  gl.clear(gl.COLOR_BUFFER_BIT)

  models.forEach((model) => {
    model.render(
      gl,
      posBuffer,
      posAttrLoc,
      colorBuffer,
      colorAttrLoc,
      matUniLoc
    )
  })

  window.requestAnimationFrame(renderAll)
}

// Buttons
const lineBtn = document.getElementById('line-btn')
if (lineBtn) {
  lineBtn.addEventListener('click', () => {
    cursorType = CursorType.LINE
  })
}

const buttonConttainer = document.getElementById('button-container')
if (buttonConttainer) {
  buttonConttainer.addEventListener('click', (e) => {
    Array.from(buttonConttainer.children).forEach(c => {
      if (c === e.target) {
        c.classList.add('bg-blue-200')
        c.classList.remove('hover:bg-slate-200')
      } else {
        c.classList.remove('bg-blue-200')
        c.classList.add('hover:bg-slate-200')
      }
    })
  })
}

const squareBtn = document.getElementById('square-btn')
if (squareBtn) {
  squareBtn.addEventListener('click', () => {
    cursorType = CursorType.SQUARE
  })
}

const rectangleBtn = document.getElementById('rectangle-btn')
if (rectangleBtn) {
  rectangleBtn.addEventListener('click', () => {
    cursorType = CursorType.RECTANGLE
  })
}

const polygonBtn = document.getElementById('polygon-btn')
if (polygonBtn) {
  polygonBtn.addEventListener('click', () => {
    cursorType = CursorType.POLYGON
  })
}

const selectBtn = document.getElementById('select-btn')
if (selectBtn) {
  selectBtn.addEventListener('click', () => {
    cursorType = CursorType.SELECT
  })
}

const colorPicker = document.getElementById('color-picker')
if (colorPicker) {
  colorPicker.addEventListener('input', (e) => {
    // Parse hex color string to normalized RGB
    const hexColor = (e.target as HTMLInputElement).value.replace('#', '')
    const normR = parseInt(hexColor.substring(0, 2), 16) / 255
    const normG = parseInt(hexColor.substring(2, 4), 16) / 255
    const normB = parseInt(hexColor.substring(4, 6), 16) / 255

    if (selectedVertex) {
      // Set color of a vertex if a vertex is selected
      selectedVertex.color = [normR, normG, normB, 1]
    } else {
      // Set all vertices of a model if no vertex is selected
      selectedModel?.vertexList.forEach((vertex) => {
        vertex.color = [normR, normG, normB, 1]
      })
    }
  })
}

document.addEventListener('DOMContentLoaded', renderAll)
