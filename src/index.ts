import createShader from '@/utils/shader'
import createProgram from '@/utils/program'
import Polygon from './models/Polygon'
import Vertex from './primitives/Vertex'
import Line from './models/Line'
import Square from './models/Square'
import Rectangle from './models/Rectangle'

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

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX
  const y = rect.bottom - e.clientY
  models[4].addVertex(new Vertex([x, y]))
})

export const renderAll = (): void => {
  gl.clear(gl.COLOR_BUFFER_BIT)

  models.forEach((model) => {
    model.render(gl,
      posBuffer,
      posAttrLoc,
      colorBuffer,
      colorAttrLoc,
      matUniLoc)
  })

  window.requestAnimationFrame(renderAll)
}

// TODO: hapus (simulate transform)
const transformBtn1 = document.getElementById('transform-btn-1')
if (transformBtn1) {
  transformBtn1.addEventListener('click', () => {
    models[4].translate(0.1, 0.1)
  })
}

const transformBtn2 = document.getElementById('transform-btn-2')
if (transformBtn2) {
  transformBtn2.addEventListener('click', () => {
    models[4].translate(-0.1, -0.1)
  })
}

document.addEventListener('DOMContentLoaded', renderAll)
