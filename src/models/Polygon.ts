import Model from '@/primitives/Model'
import type Vertex from '@/primitives/Vertex'

export default class Polygon extends Model {
  // TODO: create constraint
  private static count: number = 1

  constructor () {
    super(`polygon-${Polygon.count}`)
    Polygon.count++
  }

  addVertex (vertex: Vertex): void {
    super.addVertex(vertex)
  }

  getDrawMethod (gl: WebGLRenderingContext): number {
    if (this.vertexList.length === 2) return gl.POINTS
    if (this.vertexList.length === 3) return gl.LINES
    return gl.TRIANGLE_FAN
  }
}
