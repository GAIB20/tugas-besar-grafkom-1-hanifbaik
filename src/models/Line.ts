import Model from '@/primitives/Model'
import type Vertex from '@/primitives/Vertex'

export default class Line extends Model {
  // TODO: create constraint
  private static count: number = 1

  constructor () {
    super(`line-${Line.count}`)
    Line.count++
  }

  addVertex (vertex: Vertex): void {
    super.addVertex(vertex)
  }

  getDrawMethod (gl: WebGLRenderingContext): number {
    return gl.LINES
  }
}
