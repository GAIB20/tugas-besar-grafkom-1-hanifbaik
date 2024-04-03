import Model from '@/primitives/Model'
import Vertex from '@/primitives/Vertex'
import { matrix, multiply } from 'mathjs'

export default class Rectangle extends Model {
  // TODO: create constraint
  private static count: number = 1
  private vertexRef: Vertex
  private width: number = 0
  private height: number = 0

  constructor (vertexRef?: Vertex) {
    super(`rectangle-${Rectangle.count}`)
    Rectangle.count++
    this.vertexRef = vertexRef ?? new Vertex([0, 0])
  }

  addVertex (vertex: Vertex): void {
    super.addVertex(vertex)
  }

  getDrawMethod (gl: WebGLRenderingContext): number {
    return gl.TRIANGLE_FAN
  }

  getWidth (): number {
    return this.width
  }

  getHeight (): number {
    return this.height
  }

  getVertexRef (): Vertex {
    return this.vertexRef
  }

  setVertexRef (vertex: Vertex): void {
    this.vertexRef = vertex
  }

  private getRelativeWidth (): number {
    return this.vertexList[3].coord[0] - this.vertexRef.coord[0]
  }

  private getRelativeHeight (): number {
    return this.vertexList[1].coord[1] - this.vertexRef.coord[1]
  }

  // Restore vertexRef to top-left vertex
  restoreVertexRef (): void {
    if (this.getRelativeWidth() < 0 && this.getRelativeHeight() < 0) {
      this.vertexRef = this.vertexList[3]
    } else if (this.getRelativeWidth() < 0 && this.getRelativeHeight() >= 0) {
      this.vertexRef = this.vertexList[2]
    } else if (this.getRelativeWidth() >= 0 && this.getRelativeHeight() < 0) {
      this.vertexRef = this.vertexList[0]
    } else {
      this.vertexRef = this.vertexList[1]
    }

    this.vertexList = [
      this.vertexRef,
      new Vertex([
        this.vertexRef.coord[0],
        this.vertexRef.coord[1] - this.height
      ]),
      new Vertex([
        this.vertexRef.coord[0] + this.width,
        this.vertexRef.coord[1] - this.height
      ]),
      new Vertex([
        this.vertexRef.coord[0] + this.width,
        this.vertexRef.coord[1]
      ]),
      this.vertexRef
    ]
  }

  updateVerticesWhenDrawing (
    x: number,
    y: number,
    canvas: HTMLCanvasElement
  ): void {
    super.setVertexList(
      [
        this.vertexRef,
        new Vertex([this.vertexRef.coord[0], y]),
        new Vertex([x, y]),
        new Vertex([x, this.vertexRef.coord[1]]),
        this.vertexRef
      ],
      canvas.width,
      canvas.height
    )
    this.width = Math.abs(this.vertexRef.coord[0] - x)
    this.height = Math.abs(this.vertexRef.coord[1] - y)
  }

  updateVerticesWhenDragging (x: number, y: number): void {}

  updateXScale (sx: number, canvas: HTMLCanvasElement): void {
    const clipSpaceRightmost = (this.rightmostX * 2.0) / canvas.width - 1.0
    const clipSpaceLeftmost = (this.leftmostX * 2.0) / canvas.width - 1.0

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

  resetXScale (canvas: HTMLCanvasElement): void {
    this.vertexList = this.vertexList.map((vertex) => {
      const clipSpaceX = (vertex.coord[0] * 2.0) / canvas.width - 1.0
      const newClipSpaceX =
        clipSpaceX * this.transformMat.get([0, 0]) +
        this.transformMat.get([2, 0])
      const newX = ((newClipSpaceX + 1.0) * canvas.width) / 2.0

      return new Vertex([newX, vertex.coord[1]], vertex.color)
    })

    this.rightmostX = 0
    this.leftmostX = canvas.width

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
}
