import Model from '@/primitives/Model'
import type Vertex from '@/primitives/Vertex'

export default class Rectangle extends Model {
  // TODO: create constraint
  private static count: number = 1

  constructor () {
    super(`rectangle-${Rectangle.count}`)
    Rectangle.count++
  }

  addVertex (vertex: Vertex): void {
    super.addVertex(vertex)
  }

  getDrawMethod (gl: WebGLRenderingContext): number {
    return gl.TRIANGLE_FAN
  }
}
