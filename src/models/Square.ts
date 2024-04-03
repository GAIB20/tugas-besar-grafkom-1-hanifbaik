import Model from '@/primitives/Model'
import Vertex from '@/primitives/Vertex'
import { matrix, multiply } from 'mathjs'

export default class Square extends Model {
  private static count: number = 1
  public readonly vertexRef: Vertex

  constructor (vertexRef?: Vertex) {
    super(`square-${Square.count}`)
    Square.count++
    this.vertexRef = vertexRef ?? new Vertex([0, 0])
  }

  addVertex (vertex: Vertex): void {
    super.addVertex(vertex)
  }

  getDrawMethod (gl: WebGLRenderingContext): number {
    return gl.TRIANGLE_FAN
  }

  getVertexRef (): Vertex {
    return this.vertexRef
  }

  setVertexRef (vertex: Vertex): void {
    this.vertexRef.coord = vertex.coord
  }

  updateVerticesWhenDrawing (
    x: number,
    y: number,
    canvas: HTMLCanvasElement
  ): void {
    const length = Math.max(
      Math.abs(x - this.vertexRef.coord[0]),
      Math.abs(y - this.vertexRef.coord[1])
    )

    const lengthX = x - this.vertexRef.coord[0] >= 0 ? length : -length
    const lengthY = y - this.vertexRef.coord[1] >= 0 ? length : -length

    super.setVertexList(
      [
        this.vertexRef,
        new Vertex([
          this.vertexRef.coord[0],
          this.vertexRef.coord[1] + lengthY
        ]),
        new Vertex([
          this.vertexRef.coord[0] + lengthX,
          this.vertexRef.coord[1] + lengthY
        ]),
        new Vertex([
          this.vertexRef.coord[0] + lengthX,
          this.vertexRef.coord[1]
        ]),
        this.vertexRef
      ],
      canvas.width,
      canvas.height
    )
  }

  updateXScale (sx: number, canvas: HTMLCanvasElement): void {
    const clipSpaceRightmost = (this.rightmostX * 2.0) / canvas.width - 1.0
    const clipSpaceLeftmost = (this.leftmostX * 2.0) / canvas.width - 1.0
    const clipSpaceTopmost = (this.topmostY * 2.0) / canvas.height - 1.0
    const clipSpaceBottommost = (this.bottommostY * 2.0) / canvas.height - 1.0

    const pivotX = (clipSpaceRightmost + clipSpaceLeftmost) / 2.0
    const pivotY = (clipSpaceTopmost + clipSpaceBottommost) / 2.0

    // console.log('topMost', this.topmostY)
    // console.log('bottomMost', this.bottommostY)

    // console.log('pivotX', pivotX)
    // console.log('pivotY', pivotY)

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
      [0, sx, 0],
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

  resetXScale (canvas: HTMLCanvasElement): void {
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

      return new Vertex([newX, newY], vertex.color)
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
}
