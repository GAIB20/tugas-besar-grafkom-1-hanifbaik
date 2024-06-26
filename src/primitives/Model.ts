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

  protected rightmostX: number = 0.0
  protected leftmostX: number = 0.0
  protected topmostY: number = 0.0
  protected bottommostY: number = 0.0

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

  public getRightmostX (): number {
    return this.rightmostX
  }

  public getLeftmostX (): number {
    return this.leftmostX
  }

  public getTopmostY (): number {
    return this.topmostY
  }

  public getBottommostY (): number {
    return this.bottommostY
  }

  setVertexList (
    vertexList: Vertex[],
    canvasWidth: number,
    canvasHeight: number
  ): void {
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
    const translateMat = matrix([
      [1, 0, 0],
      [0, 1, 0],
      [tx, ty, 1]
    ])

    this.transformMat = translateMat
  }

  resetTranslate (canvas: HTMLCanvasElement): void {
    this.vertexList = this.vertexList.map((vertex) => {
      const clipSpaceX = (vertex.coord[0] * 2.0) / canvas.width - 1.0
      const newClipSpaceX = clipSpaceX + this.transformMat.get([2, 0])
      const newX = ((newClipSpaceX + 1.0) * canvas.width) / 2.0

      const clipSpaceY = (vertex.coord[1] * 2.0) / canvas.height - 1.0
      const newClipSpaceY = clipSpaceY + this.transformMat.get([2, 1])
      const newY = ((newClipSpaceY + 1.0) * canvas.height) / 2.0

      return new Vertex([newX, newY], vertex.color, vertex.id)
    })

    this.rightmostX = 0
    this.topmostY = 0
    this.leftmostX = canvas.width
    this.bottommostY = canvas.height

    for (const vertex of this.vertexList) {
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

    this.transformMat = matrix([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ])
  }

  scale (sx: number, sy: number, canvas: HTMLCanvasElement): void {
    const clipSpaceRightmost = (this.rightmostX * 2.0) / canvas.width - 1.0
    const clipSpaceLeftmost = (this.leftmostX * 2.0) / canvas.width - 1.0
    const clipSpaceTopmost = (this.topmostY * 2.0) / canvas.height - 1.0
    const clipSpaceBottommost = (this.bottommostY * 2.0) / canvas.height - 1.0

    const pivotX = (clipSpaceRightmost + clipSpaceLeftmost) / 2.0
    const pivotY = (clipSpaceTopmost + clipSpaceBottommost) / 2.0

    let transformMat = matrix([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ])
    const translateMat = [
      [1, 0, 0],
      [0, 1, 0],
      [-pivotX, -pivotY, 1]
    ]
    const scaleMat = [
      [sx, 0, 0],
      [0, sy, 0],
      [0, 0, 1]
    ]
    const reverseMat = [
      [1, 0, 0],
      [0, 1, 0],
      [pivotX, pivotY, 1]
    ]
    transformMat = multiply(transformMat, translateMat)
    transformMat = multiply(transformMat, scaleMat)
    transformMat = multiply(transformMat, reverseMat)

    this.transformMat = transformMat
  }

  resetScale (canvas: HTMLCanvasElement): void {
    this.vertexList = this.vertexList.map((vertex) => {
      const clipSpaceX = (vertex.coord[0] * 2.0) / canvas.width - 1.0
      const newClipSpaceX =
        clipSpaceX * this.transformMat.get([0, 0]) +
        this.transformMat.get([2, 0])
      const newX = ((newClipSpaceX + 1.0) * canvas.width) / 2.0

      const clipSpaceY = (vertex.coord[1] * 2.0) / canvas.height - 1.0
      const newClipSpaceY =
        clipSpaceY * this.transformMat.get([1, 1]) +
        this.transformMat.get([2, 1])
      const newY = ((newClipSpaceY + 1.0) * canvas.height) / 2.0

      return new Vertex([newX, newY], vertex.color, vertex.id)
    })

    this.rightmostX = 0
    this.topmostY = 0
    this.leftmostX = canvas.width
    this.bottommostY = canvas.height

    for (const vertex of this.vertexList) {
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

    this.transformMat = matrix([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ])
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
