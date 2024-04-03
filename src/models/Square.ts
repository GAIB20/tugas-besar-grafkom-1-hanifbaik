import Model from '@/primitives/Model'
import Vertex from '@/primitives/Vertex'

export default class Square extends Model {
  private static count: number = 1
  private readonly vertexRef: Vertex

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
}
