import Model from '@/primitives/Model'
import Vertex from '@/primitives/Vertex'
import { matrix } from 'mathjs'

export default class Line extends Model {
  // TODO: create constraint
  private static count: number = 1
  private readonly vertexRef: Vertex
  public length: number = 0

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

    const line = new Line(vertexRef)
    line.transformMat = matrix(object.transformMat.data as number[][])
    line.vertexList = object.vertexList.map((el: any) => {
      return new Vertex(el.coord as number[], el.color as number[])
    })
    line.length = object.length

    line.rightmostX = object.rightmostX
    line.leftmostX = object.leftmostX
    line.topmostY = object.topmostY
    line.bottommostY = object.bottommostY

    return line
  }

  addVertex (vertex: Vertex): void {
    super.addVertex(vertex)
  }

  getDrawMethod (gl: WebGLRenderingContext): number {
    return gl.LINES
  }

  getVertexRef (): Vertex {
    return this.vertexRef
  }

  updateVerticesWhenDrawing (
    x: number,
    y: number,
    canvas: HTMLCanvasElement
  ): void {
    super.setVertexList(
      [this.vertexRef, new Vertex([x, y])],
      canvas.width,
      canvas.height
    )
    this.length = Math.sqrt(
      (x - this.vertexRef.coord[0]) ** 2 + (y - this.vertexRef.coord[1]) ** 2
    )
  }
}
