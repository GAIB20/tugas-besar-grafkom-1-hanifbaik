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
    this.vertexList = [
      this.vertexRef,
      new Vertex([x, y])
    ]
  }
}
