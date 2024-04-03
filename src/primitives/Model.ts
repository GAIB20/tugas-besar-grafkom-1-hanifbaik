import { flatten, type Matrix, matrix, multiply } from 'mathjs'
import Vertex from './Vertex'

export default abstract class Model {
  public id: string
  public vertexList: Vertex[] = [] // list of all vertices that NEED to be drawn
  public transformMat: Matrix = matrix([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ])

  private rightmostX: number = 0.0
  private leftmostX: number = 0.0
  private topmostY: number = 0.0
  private bottommostY: number = 0.0

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
    return flattened.valueOf() as number[]
  }

  abstract getDrawMethod (gl: WebGLRenderingContext): number

  addVertex (vertex: Vertex): void {
    this.vertexList.push(vertex)
  }

  setVertexList (vertexList: Vertex[], canvasWidth: number, canvasHeight: number): void {
    this.rightmostX = 0
    this.topmostY = 0
    this.leftmostX = canvasWidth
    this.bottommostY = canvasHeight

    for (const vertex of vertexList) {
      if (vertex.coord[0] > this.rightmostX) {
        this.rightmostX = vertex.coord[0]
      }
      if (vertex.coord[0] < this.leftmostX) {
        this.leftmostX = vertex.coord[0]
      }
      if (vertex.coord[1] > this.topmostY) {
        this.topmostY = vertex.coord[1]
      }
      if (vertex.coord[1] < this.bottommostY) {
        this.bottommostY = vertex.coord[1]
      }
    }
    this.vertexList = vertexList
  }

  translate (tx: number, ty: number): void {
    const translateMat = [
      [1, 0, 0],
      [0, 1, 0],
      [tx, ty, 1]
    ]
    this.transformMat = multiply(this.transformMat, translateMat)
  }

  //! Potentially broke if rotation is added
  updateXTranslate (tx: number): void {
    this.transformMat.set([2, 0], tx)
  }

  updateYTranslate (ty: number): void {
    this.transformMat.set([2, 1], ty)
  }

  updateXScale (sx: number, canvasWidth: number): void {
    const clipSpaceRightmost = this.rightmostX * 2.0 / canvasWidth - 1.0
    const clipSpaceLeftmost = this.leftmostX * 2.0 / canvasWidth - 1.0

    const pivotX = (clipSpaceRightmost + clipSpaceLeftmost) / 2.0

    let transformMat = matrix([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ])
    const translateMat = [
      [1, 0, 0],
      [0, 1, 0],
      [-pivotX, 0, 1]
    ]
    const scaleMat = [
      [sx, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ]
    const reverseMat = [
      [1, 0, 0],
      [0, 1, 0],
      [pivotX, 0, 1]
    ]
    transformMat = multiply(transformMat, translateMat)
    transformMat = multiply(transformMat, scaleMat)
    transformMat = multiply(transformMat, reverseMat)

    this.transformMat = transformMat
  }

  resetXScale (canvasWidth: number): void {
    this.vertexList = this.vertexList.map((vertex) => {
      const clipSpaceX = vertex.coord[0] * 2.0 / canvasWidth - 1.0
      const newClipSpaceX = clipSpaceX * this.transformMat.get([0, 0]) + this.transformMat.get([2, 0])
      const newX = (newClipSpaceX + 1.0) * canvasWidth / 2.0

      return new Vertex([newX, vertex.coord[1]], vertex.color)
    })

    this.rightmostX = 0
    this.leftmostX = canvasWidth

    for (const vertex of this.vertexList) {
      if (vertex.coord[0] > this.rightmostX) {
        this.rightmostX = vertex.coord[0]
      }
      if (vertex.coord[0] < this.leftmostX) {
        this.leftmostX = vertex.coord[0]
      }
    }

    this.transformMat = matrix([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ])
  }

  resetXTranslate (canvasWidth: number): void {
    this.vertexList = this.vertexList.map((vertex) => {
      const clipSpaceX = vertex.coord[0] * 2.0 / canvasWidth - 1.0
      const newClipSpaceX = clipSpaceX + this.transformMat.get([2, 0])
      const newX = (newClipSpaceX + 1.0) * canvasWidth / 2.0

      return new Vertex([newX, vertex.coord[1]], vertex.color)
    })

    this.rightmostX = 0
    this.leftmostX = canvasWidth

    for (const vertex of this.vertexList) {
      if (vertex.coord[0] > this.rightmostX) {
        this.rightmostX = vertex.coord[0]
      }
      if (vertex.coord[0] < this.leftmostX) {
        this.leftmostX = vertex.coord[0]
      }
    }

    this.transformMat.set([2, 0], 0)
  }

  resetYTranslate (canvasHeight: number): void {
    this.vertexList = this.vertexList.map((vertex) => {
      const clipSpaceY = vertex.coord[1] * 2.0 / canvasHeight - 1.0
      const newClipSpaceY = clipSpaceY + this.transformMat.get([2, 1])
      const newY = (newClipSpaceY + 1.0) * canvasHeight / 2.0

      return new Vertex([vertex.coord[0], newY], vertex.color)
    })
    this.transformMat.set([2, 1], 0)
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
