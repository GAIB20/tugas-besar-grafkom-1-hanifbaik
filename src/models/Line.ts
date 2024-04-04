import Model from '@/primitives/Model'
import Vertex from '@/primitives/Vertex'
import { matrix } from 'mathjs'

export default class Line extends Model {
  // TODO: create constraint
  private static count: number = 1
  private readonly vertexRef: Vertex

  constructor (vertexRef?: Vertex) {
    super(`line-${Line.count}`)
    Line.count++
    this.vertexRef = vertexRef ?? new Vertex([0, 0])
  }

  static fromObject (object: any): Line {
    const vertexRef = new Vertex(
      object.vertexRef.coord as number[],
      object.vertexRef.color as number[]
    )

    const square = new Line(vertexRef)
    square.transformMat = matrix(object.transformMat.data as number[][])
    square.vertexList = object.vertexList.map((el: any) => {
      return new Vertex(
        el.coord as number[],
        el.color as number[]
      )
    })
    square.rightmostX = object.rightmostX
    square.leftmostX = object.leftmostX
    square.topmostY = object.topmostY
    square.bottommostY = object.bottommostY

    return square
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
}
