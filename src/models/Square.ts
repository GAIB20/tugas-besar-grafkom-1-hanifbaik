import Model from '@/primitives/Model'
import type Vertex from '@/primitives/Vertex'

export default class Square extends Model {
  // TODO: create constraint
  private static count: number = 1

  constructor () {
    super(`square-${Square.count}`)
    Square.count++
  }

  addVertex (vertex: Vertex): void {
    super.addVertex(vertex)
  }

  getDrawMethod (gl: WebGLRenderingContext): number {
    return gl.TRIANGLE_FAN
  }
}
