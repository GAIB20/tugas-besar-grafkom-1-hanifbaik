import Model from '@/primitives/Model'
import Vertex from '@/primitives/Vertex'

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

  setWidth (width: number): void {
    this.width = width
  }

  setHeight (height: number): void {
    this.height = height
  }

  setVertexRef (vertex: Vertex): void {
    this.vertexRef = vertex
  }

  updateVerticesWhenDrawing(x: number, y: number): void {
    this.vertexList = [
      this.vertexRef,
      new Vertex([this.vertexRef.coord[0], y]),
      new Vertex([x, y]),
      new Vertex([x, this.vertexRef.coord[1]]),
      this.vertexRef
    ]
    this.setHeight(y - this.vertexRef.coord[1])
    this.setWidth(x - this.vertexRef.coord[0])
  }
}
