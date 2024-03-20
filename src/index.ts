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

const vertexShaderSource = document.getElementById('vertex-shader')?.textContent
const fragmentShaderSource = document.getElementById('fragment-shader')?.textContent
if (!vertexShaderSource || !fragmentShaderSource) {
  throw Error('Shader source not found')
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

const program = createProgram(gl, vertexShader, fragmentShader)

const posAttrLoc = gl.getAttribLocation(program, 'a_position')
const colorAttrLoc = gl.getAttribLocation(program, 'a_color')
const resUniLoc = gl.getUniformLocation(program, 'u_resolution')

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
line.addVertex(new Vertex([150, 800], [1, 0, 0.7, 1]))
line.addVertex(new Vertex([200, 1000], [0, 1, 0, 1]))

const square = new Square()
square.addVertex(new Vertex([300, 800], [0, 1, 0, 0.5]))
square.addVertex(new Vertex([300, 1000], [0, 0, 1, 0.5]))
square.addVertex(new Vertex([500, 1000], [1, 0, 0, 0.5]))
square.addVertex(new Vertex([500, 800], [0, 0, 0.5, 0.5]))
square.addVertex(new Vertex([300, 800], [0, 1, 0, 0.5]))

const rectangle = new Rectangle()
rectangle.addVertex(new Vertex([600, 800], [0, 1, 0, 0.5]))
rectangle.addVertex(new Vertex([600, 1000], [0, 0, 0.5, 0.5]))
rectangle.addVertex(new Vertex([900, 1000], [1, 0, 0, 0.5]))
rectangle.addVertex(new Vertex([900, 800], [0, 0, 0.5, 0.5]))
rectangle.addVertex(new Vertex([600, 800], [0, 1, 0, 0.5]))

const polygon = new Polygon()
polygon.addVertex(new Vertex([1000, 800], [1, 0, 0, 0.5]))
polygon.addVertex(new Vertex([1010, 900], [0, 0, 1, 0.5]))
polygon.addVertex(new Vertex([1120, 1000], [0, 0, 1, 0.5]))
polygon.addVertex(new Vertex([1450, 900], [0, 1, 0, 0.5]))
polygon.addVertex(new Vertex([1500, 820], [0, 1, 0.5, 0.5]))
polygon.addVertex(new Vertex([1000, 800], [1, 0, 0, 0.5]))

const models = [line, square, rectangle, polygon]
models.forEach((el) => {
  el.render(gl, posBuffer, posAttrLoc, colorBuffer, colorAttrLoc)
})
