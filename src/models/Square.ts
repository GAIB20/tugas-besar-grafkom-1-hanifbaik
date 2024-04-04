import Model from '@/primitives/Model'
import Vertex from '@/primitives/Vertex'
import { matrix } from 'mathjs'

export default class Square extends Model {
  private static count: number = 1
  public readonly vertexRef: Vertex
  public size: number = 0

  constructor (vertexRef?: Vertex) {
    super(`square-${Square.count}`)
    Square.count++
    this.vertexRef = vertexRef ?? new Vertex([0, 0])
  }

  static fromObject (object: any): Square {
    const vertexRef = new Vertex(
      object.vertexRef.coord as number[],
      object.vertexRef.color as number[]
    )

    const square = new Square(vertexRef)
    square.transformMat = matrix(object.transformMat.data as number[][])
    square.vertexList = object.vertexList.map((el: any) => {
      return new Vertex(
        el.coord as number[],
        el.color as number[]
      )
    })
    square.size = object.size

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
    return gl.TRIANGLE_FAN
  }

  getVertexRef (): Vertex {
    return this.vertexRef
  }

  setVertexRef (vertex: Vertex): void {
    this.vertexRef.coord = vertex.coord
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
    this.size = length
  }
}
