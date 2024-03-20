import { flatten, type Matrix, matrix, multiply, number, squeeze } from 'mathjs'
import type Vertex from './Vertex'

export default abstract class Model {
  public id: string
  public vertexList: Vertex[] = [] // list of all vertices that NEED to be drawn
  public transformMat: Matrix = matrix([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ])

  constructor (id: string) {
    this.id = id
  }

  getPosArray (): number[] {
    return this.vertexList.flatMap((el) => el.coord)
  }

  getColorArray (): number[] {
    return this.vertexList.flatMap((el) => el.color)
  }

  getTransformMatArray (): number[] {
    const flattened = flatten(this.transformMat)
    const arr: number[] = []
    flattened.forEach((el) => { arr.push(el as number) })

    return arr
  }

  abstract getDrawMethod (gl: WebGLRenderingContext): number

  addVertex (vertex: Vertex): void {
    this.vertexList.push(vertex)
  }

  translate (tx: number, ty: number): void {
    const translateMat = [
      [1, 0, 0],
      [0, 1, 0],
      [tx, ty, 1]
    ]
    this.transformMat = multiply(this.transformMat, translateMat)
  }

  render (
    gl: WebGLRenderingContext,
    posBuffer: WebGLBuffer,
    posAttrLoc: number,
    colorBuffer: WebGLBuffer,
    colorAttrLoc: number,
    matUniLoc: WebGLUniformLocation
  ): void {
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

    gl.uniformMatrix3fv(matUniLoc, false, this.getTransformMatArray())

    gl.drawArrays(this.getDrawMethod(gl), 0, this.vertexList.length)
  }
}
