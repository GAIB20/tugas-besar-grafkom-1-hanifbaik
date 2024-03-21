export default class Vertex {
  public coord: number[]
  public color: number[]

  constructor (coord: number[], color?: number[]) {
    this.coord = coord
    this.color = color ?? [
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random() * 0.8 + 0.2
    ]
  }

  getSqDistTo (vertex: Vertex): number {
    const [x1, y1] = this.coord
    const [x2, y2] = vertex.coord
    return (x2 - x1) ** 2 + (y2 - y1) ** 2
  }

  isEq (vertex: Vertex): boolean {
    return this.coord[0] === vertex.coord[0] && this.coord[1] === vertex.coord[1]
  }
}
