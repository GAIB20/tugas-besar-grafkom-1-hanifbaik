import Model from '@/primitives/Model'
import Vertex from '@/primitives/Vertex'

export default class Line extends Model {
  // TODO: create constraint
  private static count: number = 1
  private readonly vertexRef: Vertex

  constructor (vertexRef?: Vertex) {
    super(`line-${Line.count}`)
    Line.count++
    this.vertexRef = vertexRef ?? new Vertex([0, 0])
  }

  addVertex (vertex: Vertex): void {
    super.addVertex(vertex)
  }

  getDrawMethod (gl: WebGLRenderingContext): number {
    return gl.LINES
  }

  updateVerticesWhenDrawing (x: number, y: number): void {
    this.vertexList = [this.vertexRef, new Vertex([x, y])]
  }

  updateXScale (sx: number, canvas: HTMLCanvasElement): void {
    // const clipSpaceRightmost = (this.rightmostX * 2.0) / canvasWidth - 1.0
    // const clipSpaceLeftmost = (this.leftmostX * 2.0) / canvasWidth - 1.0

    // const pivotX = (clipSpaceRightmost + clipSpaceLeftmost) / 2.0

    // let transformMat = matrix([
    //   [1, 0, 0],
    //   [0, 1, 0],
    //   [0, 0, 1]
    // ])
    // const translateMat = [
    //   [1, 0, 0],
    //   [0, 1, 0],
    //   [-pivotX, 0, 1]
    // ]
    // const scaleMat = [
    //   [sx, 0, 0],
    //   [0, sx, 0],
    //   [0, 0, 1]
    // ]
    // const reverseMat = [
    //   [1, 0, 0],
    //   [0, 1, 0],
    //   [pivotX, 0, 1]
    // ]
    // transformMat = multiply(transformMat, translateMat)
    // transformMat = multiply(transformMat, scaleMat)
    // transformMat = multiply(transformMat, reverseMat)

    // this.transformMat = transformMat
  }

  resetXScale (canvas: HTMLCanvasElement): void {
    // this.vertexList = this.vertexList.map((vertex) => {
    //   const clipSpaceX = (vertex.coord[0] * 2.0) / canvasWidth - 1.0
    //   const newClipSpaceX =
    //     clipSpaceX * this.transformMat.get([0, 0]) +
    //     this.transformMat.get([2, 0])
    //   const newX = ((newClipSpaceX + 1.0) * canvasWidth) / 2.0

    //   return new Vertex([newX, vertex.coord[1]], vertex.color)
    // })

    // this.rightmostX = 0
    // this.leftmostX = canvasWidth

    // for (const vertex of this.vertexList) {
    //   if (vertex.coord[0] > this.rightmostX) {
    //     this.rightmostX = vertex.coord[0]
    //   }
    //   if (vertex.coord[0] < this.leftmostX) {
    //     this.leftmostX = vertex.coord[0]
    //   }
    // }

    // this.transformMat = matrix([
    //   [1, 0, 0],
    //   [0, 1, 0],
    //   [0, 0, 1]
    // ])
  }
}
