function createShader (
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type)
  if (shader === null) {
    return null
  }

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS) as boolean
  if (!success) {
    gl.deleteShader(shader)

    throw Error('Failed to create shader')
  }

  return shader
}

export default createShader
