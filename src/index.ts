import createShader from '@/utils/shader'
import createProgram from '@/utils/program'
import Polygon from './models/Polygon'
import Vertex from './primitives/Vertex'
import Line from './models/Line'
import Square from './models/Square'
import Rectangle from './models/Rectangle'
import type Model from './primitives/Model'

enum CursorType {
  SELECT = 0,
  LINE = 1,
  SQUARE = 2,
  RECTANGLE = 3,
  POLYGON = 4,
}

//* GLOBAL VARIABLES
let cursorType: CursorType = CursorType.SELECT
let isDrawing: boolean = false
let isScaling: boolean = false
let isMoving: boolean = false
let isAnimating: boolean = false
let isScaleReset: boolean = true
let scaleAnimationNumber: number = 0.0
const moveReference = new Vertex([0, 0])
let selectedVertex: Vertex | undefined | null
let selectedModel:
| Model
| Line
| Square
| Rectangle
| Polygon
| undefined
| null

//* EVENT LISTENERS
// Change selected model using dropdown
function onModelDropdownChange (e: Event): void {
  selectedModel = models.find(
    (model) => model.id === (e.target as HTMLSelectElement).value
  )
  selectedVertex = selectedModel?.vertexList[0]
  updateVertexDropdown()
  adjustColorPicker()

  if (clickPolygon.vertexList.length > 0) {
    models.push(new Polygon(clickPolygon))

    modelDropdown?.appendChild(
      new Option(models[models.length - 1].id, models[models.length - 1].id)
    )

    for (const vertex of clickPolygon.vertexList) {
      clickPolygon.deleteVertex(vertex)
    }
  }
}

function onColorPickerInput (e: Event): void {
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
}

// Change selected vertex using dropdown
function onVertexDropdownChange (e: Event): void {
  selectedVertex = selectedModel?.vertexList.find(
    (vertex) => vertex.id === (e.target as HTMLSelectElement).value
  )
  adjustColorPicker()
}

function onCanvasMouseDown (e: MouseEvent): void {
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
      if (selectedModel instanceof Polygon) {
        selectedModel.addVertex(new Vertex([x, y]))
        updateVertexDropdown()
      } else {
        clickPolygon.addVertex(new Vertex([x, y]))
      }
      break
    case CursorType.SELECT: {
      const hoverThreshold = 7

      for (const model of models) {
        if (
          x >= model.getLeftmostX() - hoverThreshold &&
          x <= model.getRightmostX() + hoverThreshold &&
          y >= model.getBottommostY() - hoverThreshold &&
          y <= model.getTopmostY() + hoverThreshold
        ) {
          selectedModel = model

          for (const vertex of model.vertexList) {
            if (
              x >= vertex.coord[0] - hoverThreshold &&
              x <= vertex.coord[0] + hoverThreshold &&
              y >= vertex.coord[1] - hoverThreshold &&
              y <= vertex.coord[1] + hoverThreshold
            ) {
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

          if (!isScaling) {
            isMoving = true

            selectedVertex = selectedModel.vertexList[0]
            modelDropdown.value = selectedModel.id
            updateVertexDropdown()
            if (selectedVertex) {
              vertexDropdown.value = selectedVertex.id
            }
            adjustColorPicker()

            moveReference.coord = [x, y]
          }

          break
        }
      }
    }
  }
}

function onCanvasMouseMove (e: MouseEvent): void {
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - 100
  const y = rect.bottom - e.clientY
  if (isDrawing) {
    switch (cursorType) {
      case CursorType.LINE: {
        const line = models[models.length - 1] as Line
        line.updateVerticesWhenDrawing(x, y, canvas)
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
    document.body.style.cursor = 'move'
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
        selectedModel.size = sideLength * scale
        squareSizeInput.value = selectedModel.size.toString()
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

        if (selectedModel instanceof Rectangle) {
          selectedModel.width = lengthX * scaleX
          selectedModel.height = lengthY * scaleY

          rectangleWidthInput.value = selectedModel.width.toString()
          rectangleHeightInput.value = selectedModel.height.toString()
        }

        break
      }
    }
  } else if (isMoving && selectedModel) {
    const xClipSpace = (x * 2.0) / canvas.width - 1.0
    const yClipSpace = (y * 2.0) / canvas.height - 1.0

    const xReferenceClipSpace =
      (moveReference.coord[0] * 2.0) / canvas.width - 1.0
    const yReferenceClipSpace =
      (moveReference.coord[1] * 2.0) / canvas.height - 1.0

    selectedModel.translate(
      xClipSpace - xReferenceClipSpace,
      yClipSpace - yReferenceClipSpace
    )
  } else {
    if (cursorType === CursorType.SELECT) {
      const hoverThreshold = 7

      for (const model of models) {
        if (
          x >= model.getLeftmostX() - hoverThreshold &&
          x <= model.getRightmostX() + hoverThreshold &&
          y >= model.getBottommostY() - hoverThreshold &&
          y <= model.getTopmostY() + hoverThreshold
        ) {
          let isOnVertex = false

          for (const vertex of model.vertexList) {
            if (
              x >= vertex.coord[0] - hoverThreshold &&
              x <= vertex.coord[0] + hoverThreshold &&
              y >= vertex.coord[1] - hoverThreshold &&
              y <= vertex.coord[1] + hoverThreshold
            ) {
              document.body.style.cursor = 'pointer'
              isOnVertex = true
              break
            }
          }

          if (!isOnVertex) {
            document.body.style.cursor = 'grab'
          }

          break
        } else {
          document.body.style.cursor = 'default'
        }
      }
    }
  }
}

function onCanvasMouseClick (e: MouseEvent): void {
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - 100
  const y = rect.bottom - e.clientY

  if (isDrawing) return
  switch (cursorType) {
    case CursorType.SELECT: {
      const hoverThreshold = 7
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
}

function onCanvasMouseUp (e: MouseEvent): void {
  switch (cursorType) {
    case CursorType.LINE: {
      isDrawing = false

      // Update selected model and vertex
      selectedModel = models[models.length - 1]
      const line = selectedModel as Line
      selectedVertex = line.getVertexRef()

      // Update UI for dropdowns and color picker
      modelDropdown.value = selectedModel.id
      updateVertexDropdown()
      if (selectedVertex) {
        vertexDropdown.value = selectedVertex.id
      }
      adjustColorPicker()
      break
    }
    case CursorType.SQUARE: {
      isDrawing = false

      // Update selected model and vertex
      selectedModel = models[models.length - 1]
      const square = selectedModel as Square
      selectedVertex = square.getVertexRef()

      // Update UI for dropdowns and color picker
      modelDropdown.value = selectedModel.id
      updateVertexDropdown()
      if (selectedVertex) {
        vertexDropdown.value = selectedVertex.id
      }
      adjustColorPicker()
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
      if (isScaling) {
        selectedModel?.resetScale(canvas)
      }

      if (isMoving) {
        moveReference.coord = [0, 0]
        selectedModel?.resetTranslate(canvas)
      }

      isScaling = false
      isMoving = false
      document.body.style.cursor = 'default'
      break
  }
}

function onButtonClick (cursorTypeInput: CursorType): (e: MouseEvent) => void {
  return (e: MouseEvent) => {
    cursorType = cursorTypeInput
  }
}

function onButtonContainerClick (e: MouseEvent): void {
  if (clickPolygon.vertexList.length > 0) {
    models.push(new Polygon(clickPolygon))

    modelDropdown?.appendChild(
      new Option(models[models.length - 1].id, models[models.length - 1].id)
    )

    for (const vertex of clickPolygon.vertexList) {
      clickPolygon.deleteVertex(vertex)
    }

    // Update selected model and vertex
    selectedModel = models[models.length - 1]
    const polygon = selectedModel as Polygon
    selectedVertex = polygon.vertexList[0]

    // Update UI for dropdowns and color picker
    modelDropdown.value = selectedModel.id
    updateVertexDropdown()
    if (selectedVertex) {
      vertexDropdown.value = selectedVertex.id
    }
    adjustColorPicker()
  }

  Array.from(buttonConttainer.children).forEach((c) => {
    if (c === e.target) {
      c.classList.add('bg-blue-200')
      c.classList.remove('hover:bg-slate-200')
    } else {
      c.classList.remove('bg-blue-200')
      c.classList.add('hover:bg-slate-200')
    }
  })
}

function onSaveButtonClick (): void {
  const file = new File(
    [JSON.stringify(selectedModel)],
    `${selectedModel?.id ?? 'model'}.json`,
    {
      type: 'application/json'
    }
  )

  const url = URL.createObjectURL(file)

  const a = document.createElement('a')
  a.href = url
  a.download = file.name

  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  URL.revokeObjectURL(url)
}

function onLoadButtonClick (): void {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'

  input.addEventListener('change', () => {
    if (input.files) {
      const file = input.files[0]

      const reader = new FileReader()
      reader.onload = () => {
        const object = JSON.parse(reader.result as string)
        if ((object.id as string).startsWith('square')) {
          const square = Square.fromObject(object)
          models.push(square)
          modelDropdown?.appendChild(
            new Option(
              models[models.length - 1].id,
              models[models.length - 1].id
            )
          )
        } else if ((object.id as string).startsWith('rectangle')) {
          const rectangle = Rectangle.fromObject(object)
          models.push(rectangle)
          modelDropdown?.appendChild(
            new Option(
              models[models.length - 1].id,
              models[models.length - 1].id
            )
          )
        } else if ((object.id as string).startsWith('polygon')) {
          const polygon = Polygon.fromObject(object)
          models.push(polygon)
          modelDropdown?.appendChild(
            new Option(
              models[models.length - 1].id,
              models[models.length - 1].id
            )
          )
        } else if ((object.id as string).startsWith('line')) {
          const line = Line.fromObject(object)
          models.push(line)
          modelDropdown?.appendChild(
            new Option(
              models[models.length - 1].id,
              models[models.length - 1].id
            )
          )
        }

        // Update selected model and vertex
        selectedModel = models[models.length - 1]
        selectedVertex = selectedModel.vertexList[0]

        // Update UI for dropdowns and color picker
        modelDropdown.value = selectedModel.id
        updateVertexDropdown()
        if (selectedVertex) {
          vertexDropdown.value = selectedVertex.id
        }
        adjustColorPicker()
      }
      reader.readAsText(file)
    }
  })

  document.body.appendChild(input)
  input.click()
  document.body.removeChild(input)
}

function onSquareSizeInput (e: Event): void {
  if (
    selectedModel instanceof Square &&
    +(e.target as HTMLInputElement).value > 0
  ) {
    const prevSize = selectedModel.size
    const scale = parseFloat((e.target as HTMLInputElement).value) / prevSize

    selectedModel.size = parseFloat((e.target as HTMLInputElement).value)
    selectedModel.scale(Math.abs(scale), Math.abs(scale), canvas)
    selectedModel.resetScale(canvas)
  }
}

function onRectangleWidthInput (e: Event): void {
  if (
    selectedModel instanceof Rectangle &&
    +(e.target as HTMLInputElement).value > 0
  ) {
    const prevWidth = selectedModel.width
    const scale = parseFloat((e.target as HTMLInputElement).value) / prevWidth

    selectedModel.width = parseFloat((e.target as HTMLInputElement).value)
    selectedModel.scale(Math.abs(scale), 1, canvas)
    selectedModel.resetScale(canvas)
  }
}

function onRectangleHeightInput (e: Event): void {
  if (
    selectedModel instanceof Rectangle &&
    +(e.target as HTMLInputElement).value > 0
  ) {
    const prevHeight = selectedModel.height
    const scale = parseFloat((e.target as HTMLInputElement).value) / prevHeight

    selectedModel.height = parseFloat((e.target as HTMLInputElement).value)
    selectedModel.scale(1, Math.abs(scale), canvas)
    selectedModel.resetScale(canvas)
  }
}

function onPolyDeleteVertexClick (): void {
  if (
    selectedModel instanceof Polygon &&
    selectedVertex &&
    selectedModel.vertexList.length > 3
  ) {
    selectedModel.deleteVertex(selectedVertex)
    updateVertexDropdown()
  }
}

function onLineLengthInput (e: Event): void {
  if (
    selectedModel instanceof Line &&
    +(e.target as HTMLInputElement).value > 0
  ) {
    const prevLength = selectedModel.length
    const scale = parseFloat((e.target as HTMLInputElement).value) / prevLength

    selectedModel.length = parseFloat((e.target as HTMLInputElement).value)
    selectedModel.scale(Math.abs(scale), Math.abs(scale), canvas)
    selectedModel.resetScale(canvas)
  }
}

function onAnimationButtonClick (): void {
  isAnimating = !isAnimating
  if (isAnimating) {
    animationBtn.classList.add('bg-blue-200')
    animationBtn.classList.remove('hover:bg-slate-200')
    isScaleReset = false
  } else {
    animationBtn.classList.remove('bg-blue-200')
    animationBtn.classList.add('hover:bg-slate-200')
  }

} 

//* UTILITY FUNCTIONS
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

    saveBtn.classList.remove('hidden')
    if (selectedModel.id.startsWith('square')) {
      squareSizeInput.value = (selectedModel as Square).size.toString()
      squareProps.classList.remove('hidden')

      rectangleProps.classList.add('hidden')
      polygonProps.classList.add('hidden')
      lineProps.classList.add('hidden')
    } else if (selectedModel.id.startsWith('rectangle')) {
      rectangleWidthInput.value = (selectedModel as Rectangle).width.toString()
      rectangleHeightInput.value = (
        selectedModel as Rectangle
      ).height.toString()
      rectangleProps.classList.remove('hidden')

      squareProps.classList.add('hidden')
      polygonProps.classList.add('hidden')
      lineProps.classList.add('hidden')
    } else if (selectedModel.id.startsWith('polygon')) {
      polygonProps.classList.remove('hidden')

      squareProps.classList.add('hidden')
      rectangleProps.classList.add('hidden')
      lineProps.classList.add('hidden')
    } else if (selectedModel.id.startsWith('line')) {
      lineLengthInput.value = (selectedModel as Line).length.toString()
      lineProps.classList.remove('hidden')

      squareProps.classList.add('hidden')
      rectangleProps.classList.add('hidden')
      polygonProps.classList.add('hidden')
    }
  }
}

//* INITIALIZE WEBGL CANVAS
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
const clickPolygon = new Polygon()

// Initialize selected model
selectedModel = models[0]

//* DOM MANIPULATION
const modelDropdown = document.getElementById(
  'model-select'
) as HTMLSelectElement
const vertexDropdown = document.getElementById(
  'vertex-select'
) as HTMLSelectElement
const colorPicker = document.getElementById('color-picker') as HTMLInputElement

const buttonConttainer = document.getElementById(
  'button-container'
) as HTMLDivElement
const lineBtn = document.getElementById('line-btn') as HTMLButtonElement
const squareBtn = document.getElementById('square-btn') as HTMLButtonElement
const rectangleBtn = document.getElementById(
  'rectangle-btn'
) as HTMLButtonElement
const polygonBtn = document.getElementById('polygon-btn') as HTMLButtonElement
const selectBtn = document.getElementById('select-btn') as HTMLButtonElement

const saveBtn = document.getElementById('save-btn') as HTMLButtonElement
const loadBtn = document.getElementById('load-btn') as HTMLButtonElement
const animationBtn = document.getElementById('animation-btn') as HTMLButtonElement

const lineLengthInput = document.getElementById(
  'line-length-input'
) as HTMLInputElement
const lineProps = document.getElementById('line-props') as HTMLDivElement

const squareSizeInput = document.getElementById(
  'square-size-input'
) as HTMLInputElement
const squareProps = document.getElementById('square-props') as HTMLDivElement

const rectangleWidthInput = document.getElementById(
  'rectangle-width-input'
) as HTMLInputElement
const rectangleHeightInput = document.getElementById(
  'rectangle-height-input'
) as HTMLInputElement
const rectangleProps = document.getElementById(
  'rectangle-props'
) as HTMLDivElement

const polyDeleteVertexBtn = document.getElementById(
  'poly-delete-vertex-btn'
) as HTMLButtonElement
const polygonProps = document.getElementById('polygon-props') as HTMLDivElement

modelDropdown.addEventListener('change', onModelDropdownChange)
colorPicker.addEventListener('input', onColorPickerInput)
vertexDropdown.addEventListener('change', onVertexDropdownChange)

buttonConttainer.addEventListener('click', onButtonContainerClick)
lineBtn.addEventListener('click', onButtonClick(CursorType.LINE))
squareBtn.addEventListener('click', onButtonClick(CursorType.SQUARE))
rectangleBtn.addEventListener('click', onButtonClick(CursorType.RECTANGLE))
polygonBtn.addEventListener('click', onButtonClick(CursorType.POLYGON))
selectBtn.addEventListener('click', onButtonClick(CursorType.SELECT))

saveBtn.addEventListener('click', onSaveButtonClick)
loadBtn.addEventListener('click', onLoadButtonClick)

animationBtn.addEventListener('click', onAnimationButtonClick)

lineLengthInput.addEventListener('input', onLineLengthInput)
squareSizeInput.addEventListener('input', onSquareSizeInput)
rectangleWidthInput.addEventListener('input', onRectangleWidthInput)
rectangleHeightInput.addEventListener('input', onRectangleHeightInput)
polyDeleteVertexBtn.addEventListener('click', onPolyDeleteVertexClick)

canvas.addEventListener('mousedown', onCanvasMouseDown)
canvas.addEventListener('mousemove', onCanvasMouseMove)
canvas.addEventListener('click', onCanvasMouseClick)
canvas.addEventListener('mouseup', onCanvasMouseUp)


export const renderAll = (): void => {
  gl.clear(gl.COLOR_BUFFER_BIT)
  models.forEach((model) => {
    if (isAnimating) {
      model.scale(Math.sin(scaleAnimationNumber) * 1.1, Math.sin(scaleAnimationNumber) * 1.1, canvas)
    } else {
      if (!isScaleReset) {
        model.resetScale(canvas)
      }
    }
    model.render(
      gl,
      posBuffer,
      posAttrLoc,
      colorBuffer,
      colorAttrLoc,
      matUniLoc
    )
  })

  scaleAnimationNumber += 0.02
  if (scaleAnimationNumber > Math.PI * 1000) {
    scaleAnimationNumber = 0.0
  }

  if (!isScaleReset && !isAnimating) {
    isScaleReset = true
  }

  clickPolygon.render(
    gl,
    posBuffer,
    posAttrLoc,
    colorBuffer,
    colorAttrLoc,
    matUniLoc
  )

  window.requestAnimationFrame(renderAll)
}

document.addEventListener('DOMContentLoaded', renderAll)
