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
let isScaling: boolean = false
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

const models: Model[] = []
const vertexSelector = new Square()

// Initialize selected model
selectedModel = models[0]

const modelDropdown = document.getElementById(
  'model-select'
) as HTMLSelectElement
const vertexDropdown = document.getElementById(
  'vertex-select'
) as HTMLSelectElement
const colorPicker = document.getElementById('color-picker') as HTMLInputElement

const scaleXInput = new ScaleXInput(canvas)

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
  selectedVertex = selectedModel?.vertexList[0]
  updateVertexDropdown()
  adjustColorPicker()

  if (selectedModel) {
    scaleXInput.removeListener()

    new TranslateXInput().addListener(
      canvas,
      selectedModel,
      adjustColorPicker,
      updateVertexDropdown
    )
    new TranslateYInput().addListener(
      canvas,
      selectedModel,
      adjustColorPicker,
      updateVertexDropdown
    )

    scaleXInput.addListener(selectedModel)
  }
})

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

// Change selected vertex using dropdown
vertexDropdown?.addEventListener('change', (e) => {
  selectedVertex = selectedModel?.vertexList.find(
    (vertex) => vertex.id === (e.target as HTMLSelectElement).value
  )
  adjustColorPicker()
})

function adjustColorPicker (): void {
  if (selectedVertex && colorPicker) {
    const [r, g, b] = selectedVertex.color
      .slice(0, 3)
      .map((c) => Math.floor(c * 255))
    const [strR, strG, strB] = [r, g, b].map((c) =>
      c.toString(16).padStart(2, '0')
    )
    colorPicker.value = `#${strR}${strG}${strB}`
  }
}

function updateVertexDropdown (): void {
  if (vertexDropdown && selectedModel) {
    // Reset vertex dropdown
    vertexDropdown.innerHTML = ''

    // Initialize vertex dropdown based on selected model
    // let first: boolean = true
    selectedModel.vertexList.forEach((vertex, idx) => {
      if (
        (selectedModel instanceof Square ||
          selectedModel instanceof Rectangle ||
          selectedModel instanceof Polygon) &&
        idx === selectedModel.vertexList.length - 1
      ) {
        return
      }

      // Add vertex option
      const option = document.createElement('option')
      option.value = vertex.id
      option.text = vertex.id
      vertexDropdown.appendChild(option)
      // first = false
    })

    // Add all vertex option
    vertexDropdown.appendChild(new Option('All Vertex', undefined))
  }
}

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
    case CursorType.SELECT: {
      const hoverThreshold = 4

      for (const model of models) {
        if (
          x >= model.getLeftmostX() - hoverThreshold &&
          x <= model.getRightmostX() + hoverThreshold &&
          y >= model.getBottommostY() - hoverThreshold &&
          y <= model.getTopmostY() + hoverThreshold
        ) {
          for (const vertex of model.vertexList) {
            if (
              x >= vertex.coord[0] - hoverThreshold &&
              x <= vertex.coord[0] + hoverThreshold &&
              y >= vertex.coord[1] - hoverThreshold &&
              y <= vertex.coord[1] + hoverThreshold
            ) {
              selectedModel = model
              selectedVertex = vertex

              modelDropdown.value = selectedModel.id
              updateVertexDropdown()
              if (selectedVertex) {
                vertexDropdown.value = selectedVertex.id
              }
              adjustColorPicker()

              isScaling = true
              break
            }
          }

          break
        }
      }
    }
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
        rectangle.updateVerticesWhenDrawing(x, y, canvas)
        break
      }
      case CursorType.POLYGON:
        break
    }
  } else if (isScaling && selectedModel && selectedVertex) {
    switch (true) {
      case selectedModel instanceof Square: {
        const sideLength = Math.max(
          Math.abs(selectedVertex.coord[0] - selectedModel.getLeftmostX()),
          Math.abs(selectedVertex.coord[0] - selectedModel.getRightmostX())
        )

        const farthestX = Math.max(
          Math.abs(x - selectedModel.getLeftmostX()),
          Math.abs(x - selectedModel.getRightmostX())
        )
        const farthestY = Math.max(
          Math.abs(y - selectedModel.getTopmostY()),
          Math.abs(y - selectedModel.getBottommostY())
        )

        const deltaX = Math.abs(x - selectedVertex.coord[0])
        const deltaY = Math.abs(y - selectedVertex.coord[1])

        let scaleX = 1
        let scaleY = 1
        let scale = 1
        if (
          x >= selectedModel.getLeftmostX() &&
          x <= selectedModel.getRightmostX() &&
          y >= selectedModel.getBottommostY() &&
          y <= selectedModel.getTopmostY()
        ) {
          scaleX = Math.abs((farthestX - deltaX) / sideLength)
          scaleY = Math.abs((farthestY - deltaY) / sideLength)
        } else {
          scaleX = Math.abs((farthestX + deltaX) / sideLength)
          scaleY = Math.abs((farthestY + deltaY) / sideLength)
        }

        scale = Math.max(scaleX, scaleY)
        selectedModel.scale(Math.abs(scale), Math.abs(scale), canvas)
        break
      }
      case selectedModel instanceof Polygon:
      case selectedModel instanceof Rectangle: {
        const lengthX = Math.max(
          Math.abs(selectedVertex.coord[0] - selectedModel.getLeftmostX()),
          Math.abs(selectedVertex.coord[0] - selectedModel.getRightmostX())
        )
        const lengthY = Math.max(
          Math.abs(selectedVertex.coord[1] - selectedModel.getTopmostY()),
          Math.abs(selectedVertex.coord[1] - selectedModel.getBottommostY())
        )

        const farthestX = Math.max(
          Math.abs(x - selectedModel.getLeftmostX()),
          Math.abs(x - selectedModel.getRightmostX())
        )
        const farthestY = Math.max(
          Math.abs(y - selectedModel.getTopmostY()),
          Math.abs(y - selectedModel.getBottommostY())
        )

        const deltaX = Math.abs(x - selectedVertex.coord[0])
        const deltaY = Math.abs(y - selectedVertex.coord[1])

        let scaleX = 1
        let scaleY = 1
        if (
          x >= selectedModel.getLeftmostX() &&
          x <= selectedModel.getRightmostX() &&
          y >= selectedModel.getBottommostY() &&
          y <= selectedModel.getTopmostY()
        ) {
          scaleX = Math.abs((farthestX - deltaX) / lengthX)
          scaleY = Math.abs((farthestY - deltaY) / lengthY)
        } else {
          scaleX = Math.abs((farthestX + deltaX) / lengthX)
          scaleY = Math.abs((farthestY + deltaY) / lengthY)
        }

        selectedModel.scale(Math.abs(scaleX), Math.abs(scaleY), canvas)
        break
      }
    }
  } else {
    if (cursorType === CursorType.SELECT) {
      const hoverThreshold = 4

      for (const model of models) {
        if (
          x >= model.getLeftmostX() - hoverThreshold &&
          x <= model.getRightmostX() + hoverThreshold &&
          y >= model.getBottommostY() - hoverThreshold &&
          y <= model.getTopmostY() + hoverThreshold
        ) {
          for (const vertex of model.vertexList) {
            if (
              x >= vertex.coord[0] - hoverThreshold &&
              x <= vertex.coord[0] + hoverThreshold &&
              y >= vertex.coord[1] - hoverThreshold &&
              y <= vertex.coord[1] + hoverThreshold
            ) {
              document.body.style.cursor = 'pointer'
              break
            } else {
              document.body.style.cursor = 'default'
            }
          }

          break
        } else {
          vertexSelector.setVertexRef(new Vertex([0, 0]))
          vertexSelector.updateVerticesWhenDrawing(0, 0, canvas)
          document.body.style.cursor = 'default'
        }
      }
    }
  }
})

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - 100
  const y = rect.bottom - e.clientY

  if (isDrawing) return
  switch (cursorType) {
    case CursorType.SELECT: {
      const hoverThreshold = 4
      for (const model of models) {
        let isVertexSelected = false

        // Check if the cursor is clicking over the vertex
        let idx = 0
        for (const vertex of model.vertexList) {
          if (idx === model.vertexList.length - 1) break
          if (
            x >= vertex.coord[0] - hoverThreshold &&
            x <= vertex.coord[0] + hoverThreshold &&
            y >= vertex.coord[1] - hoverThreshold &&
            y <= vertex.coord[1] + hoverThreshold
          ) {
            selectedModel = model
            selectedVertex = vertex
            isVertexSelected = true

            modelDropdown.value = selectedModel.id
            updateVertexDropdown()
            if (selectedVertex) {
              vertexDropdown.value = selectedVertex.id
            }
            adjustColorPicker()
            break
          }
          idx++
        }

        if (isVertexSelected) continue

        // Check if the cursor is clicking over the model
        switch (true) {
          case model instanceof Line:
            break
          case model instanceof Square:
            break
          case model instanceof Rectangle:
            if (
              x <= model.getWidth() + model.getVertexRef().coord[0] &&
              x >= model.getVertexRef().coord[0] &&
              y <= model.getVertexRef().coord[1] &&
              y >= model.getVertexRef().coord[1] - model.getHeight()
            ) {
              // Update selected model and vertex
              selectedModel = model
              selectedVertex = model.getVertexRef()

              // Update UI for dropdowns and color picker
              modelDropdown.value = selectedModel.id
              updateVertexDropdown()
              if (selectedVertex) {
                vertexDropdown.value = selectedVertex.id
              }
              adjustColorPicker()
            }
            break
          case model instanceof Polygon:
            break
        }
      }
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
    case CursorType.SQUARE: {
      isDrawing = false
      // const square = selectedModel as Square
      break
    }
    case CursorType.RECTANGLE: {
      isDrawing = false

      // Update selected model and vertex
      selectedModel = models[models.length - 1]
      const rectangle = selectedModel as Rectangle
      selectedVertex = rectangle.getVertexRef()

      // Update UI for dropdowns and color picker
      modelDropdown.value = selectedModel.id
      updateVertexDropdown()
      if (selectedVertex) {
        vertexDropdown.value = selectedVertex.id
      }
      adjustColorPicker()

      // Reset vertex reference to top-left vertex
      rectangle.restoreVertexRef()

      break
    }
    case CursorType.POLYGON:
      break
    case CursorType.SELECT:
      isScaling = false
      selectedModel?.resetScale(canvas)
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

  vertexSelector.render(
    gl,
    posBuffer,
    posAttrLoc,
    colorBuffer,
    colorAttrLoc,
    matUniLoc
  )

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
    Array.from(buttonConttainer.children).forEach((c) => {
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

document.addEventListener('DOMContentLoaded', renderAll)
