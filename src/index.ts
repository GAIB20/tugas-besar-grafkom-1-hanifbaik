import createShader from '@/utils/shader'
import createProgram from '@/utils/program'

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

// TODO: render models
