import createShader from '@/utils/shader'
import createProgram from '@/utils/program'

/* Create Program */
const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement
const gl = canvas.getContext('webgl')

const vertexShaderElement = document.getElementById('vertex-shader')
const fragmentShaderElement = document.getElementById('fragment-shader')

const vertexShaderSource = vertexShaderElement?.textContent
const fragmentShaderSource = fragmentShaderElement?.textContent

if (gl !== null) {
  const vertexShader = createShader(gl, gl?.VERTEX_SHADER, vertexShaderSource ?? '')
  const fragmentShader = createShader(
    gl,
    gl?.FRAGMENT_SHADER,
    fragmentShaderSource ?? ''
  )

  const program = createProgram(gl, fragmentShader, vertexShader)

  /* Setup Program */
  gl.useProgram(program)

  /* Setup Viewport */
  const width = canvas.clientWidth
  const height = canvas.clientHeight

  canvas.width = width
  canvas.height = height
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  /* Clear Color */
  gl.clear(gl.COLOR_BUFFER_BIT)
}

const renderCanvas = (): void => {
  gl?.clear(gl.COLOR_BUFFER_BIT)

  window.requestAnimationFrame(renderCanvas)
}

/* DOM Listener */
document.addEventListener('DOMContentLoaded', renderCanvas)
