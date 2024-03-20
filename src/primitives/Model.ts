import type Vertex from './Vertex'

export default abstract class Model {
  public id: string
  public vertexList: Vertex[] = [] // list of all vertices that NEED to be drawn

  constructor (id: string) {
    this.id = id
  }

  getPosArray (): number[] {
    return this.vertexList.flatMap((el) => el.coord)
  }

  getColorArray (): number[] {
    return this.vertexList.flatMap((el) => el.color)
  }

  abstract getDrawMethod (gl: WebGLRenderingContext): number

  addVertex (vertex: Vertex): void {
    this.vertexList.push(vertex)
  }

  render (gl: WebGLRenderingContext, posBuffer: WebGLBuffer, posAttrLoc: number, colorBuffer: WebGLBuffer, colorAttrLoc: number): void {
    // position
    gl.enableVertexAttribArray(posAttrLoc)
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)

    gl.vertexAttribPointer(posAttrLoc, 2, gl.FLOAT, false, 0, 0) // 2 -> x, y
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.getPosArray()),
      gl.STATIC_DRAW
    )

    // color
    gl.enableVertexAttribArray(colorAttrLoc)
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    gl.vertexAttribPointer(colorAttrLoc, 4, gl.FLOAT, false, 0, 0) // 4 -> r, g, b, a
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.getColorArray()),
      gl.STATIC_DRAW
    )

    gl.drawArrays(this.getDrawMethod(gl), 0, this.vertexList.length)
  }
}
