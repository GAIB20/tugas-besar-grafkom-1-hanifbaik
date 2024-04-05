export default class Vertex {
  public id: string
  public coord: number[]
  public color: number[]
  public static count: number = 1

  constructor (coord: number[], color?: number[], vertexId?: string) {
    this.coord = coord
    this.color = color ?? [
      Math.random(),
      Math.random(),
      Math.random(),
      (Math.random() * 0.8 + 0.4 >= 1) ? 1 : Math.random() * 0.8 + 0.4
    ]

    if (vertexId) {
      this.id = vertexId
    } else {
      this.id = `vertex-${Vertex.count}`
      Vertex.count++
    }
  }

  getSqDistTo (vertex: Vertex): number {
    const [x1, y1] = this.coord
    const [x2, y2] = vertex.coord
    return (x2 - x1) ** 2 + (y2 - y1) ** 2
  }

  isEq (vertex: Vertex): boolean {
    return (
      this.coord[0] === vertex.coord[0] && this.coord[1] === vertex.coord[1]
    )
  }
}
