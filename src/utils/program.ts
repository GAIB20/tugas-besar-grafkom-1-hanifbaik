function createProgram (
  gl: WebGLRenderingContext,
  fragmentShader: WebGLShader | null,
  vertexShader: WebGLShader | null
): WebGLProgram | null {
  const program = gl.createProgram()
  if (program === null || vertexShader === null || fragmentShader === null) {
    return null
  }

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  const success = gl.getProgramParameter(program, gl.LINK_STATUS) as boolean
  if (!success) {
    gl.deleteProgram(program)

    throw Error('Failed to create program')
  }

  return program
}

export default createProgram
