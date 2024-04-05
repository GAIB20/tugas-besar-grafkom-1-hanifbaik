import Model from '@/primitives/Model'
import Vertex from '@/primitives/Vertex'
import { matrix } from 'mathjs'

enum Orientation {
  COLLINEAR,
  CLOCKWISE,
  COUNTER_CLOCKWISE,
}

export default class Polygon extends Model {
  private static count: number = 1
  private polarRef: Vertex = new Vertex([0, 0])

  constructor (polygon?: Polygon) {
    super(`polygon-${Polygon.count}`)
    Polygon.count++

    if (polygon) {
      this.vertexList = polygon.vertexList.map((v) => new Vertex(v.coord))
      this.polarRef = new Vertex(polygon.polarRef.coord)

      this.leftmostX = polygon.leftmostX
      this.rightmostX = polygon.rightmostX
      this.topmostY = polygon.topmostY
      this.bottommostY = polygon.bottommostY
    }
  }

  static fromObject (object: any): Polygon {
    const polygon = new Polygon()
    polygon.polarRef = new Vertex(
      object.polarRef.coord as number[],
      object.polarRef.color as number[]
    )
    polygon.transformMat = matrix(object.transformMat.data as number[][])
    polygon.vertexList = object.vertexList.map((el: any) => {
      return new Vertex(
        el.coord as number[],
        el.color as number[]
      )
    })

    polygon.rightmostX = object.rightmostX
    polygon.leftmostX = object.leftmostX
    polygon.topmostY = object.topmostY
    polygon.bottommostY = object.bottommostY

    return polygon
  }

  addVertex (vertex: Vertex): void {
    if (this.vertexList.some((v) => v.isEq(vertex))) return

    const len = this.vertexList.length
    if (len === 0) {
      this.vertexList.push(vertex)
      this.vertexList.push(vertex)

      this.leftmostX = vertex.coord[0]
      this.rightmostX = vertex.coord[0]
      this.topmostY = vertex.coord[1]
      this.bottommostY = vertex.coord[1]
    } else {
      this.vertexList = [
        ...this.vertexList.slice(0, len - 1),
        vertex,
        this.vertexList[len - 1]
      ]

      this.convexHull()

      for (const vertex of this.vertexList) {
        if (vertex.coord[0] > this.rightmostX) {
          this.rightmostX = vertex.coord[0]
        }
        if (vertex.coord[0] < this.leftmostX) {
          this.leftmostX = vertex.coord[0]
        }
        if (vertex.coord[1] > this.topmostY) {
          this.topmostY = vertex.coord[1]
        }
        if (vertex.coord[1] < this.bottommostY) {
          this.bottommostY = vertex.coord[1]
        }
      }
    }
  }

  deleteVertex (vertex: Vertex): void {
    this.vertexList = this.vertexList.filter((v) => !v.isEq(vertex))
    this.convexHull()
  }

  getDrawMethod (gl: WebGLRenderingContext): number {
    if (this.vertexList.length === 2) return gl.POINTS
    if (this.vertexList.length === 3) return gl.LINES
    return gl.TRIANGLE_FAN
  }

  private getOrientation (v0: Vertex, v1: Vertex, v2: Vertex): Orientation {
    // get orientation from cross product
    const val =
      (v1.coord[1] - v0.coord[1]) * (v2.coord[0] - v1.coord[0]) -
      (v1.coord[0] - v0.coord[0]) * (v2.coord[1] - v1.coord[1])

    if (val === 0) return Orientation.COLLINEAR
    if (val > 0) return Orientation.CLOCKWISE
    return Orientation.COUNTER_CLOCKWISE
  }

  private cmpPolar (v1: Vertex, v2: Vertex): number {
    const ori = this.getOrientation(this.polarRef, v1, v2)

    if (ori === Orientation.CLOCKWISE) return 1
    if (ori === Orientation.COUNTER_CLOCKWISE) return -1
    return v1.getSqDistTo(this.polarRef) > v2.getSqDistTo(this.polarRef)
      ? 1
      : -1
  }

  private convexHull (): void {
    if (this.vertexList.length < 4) return

    this.vertexList.pop() // remove end point

    // select bottom-most point
    let minIdx = 0
    for (let i = 1; i < this.vertexList.length; i++) {
      const curr = this.vertexList[i]
      const currMin = this.vertexList[minIdx]
      if (
        curr.coord[1] < currMin.coord[1] ||
        (curr.coord[1] === currMin.coord[1] && curr.coord[0] < currMin.coord[0])
      ) {
        minIdx = i
      }
    }

    this.polarRef = this.vertexList[minIdx]
    const temp = this.vertexList[0]
    this.vertexList[0] = this.vertexList[minIdx]
    this.vertexList[minIdx] = temp

    // sort by polar angle
    this.vertexList.sort((v1, v2) => this.cmpPolar(v1, v2))

    // remove collinear points
    let newArrLen = 1
    for (let i = 1; i < this.vertexList.length; i++) {
      while (
        i < this.vertexList.length - 1 &&
        this.getOrientation(
          this.polarRef,
          this.vertexList[i],
          this.vertexList[i + 1]
        ) === Orientation.COLLINEAR
      ) {
        i++
      }
      this.vertexList[newArrLen] = this.vertexList[i]
      newArrLen++
    }

    if (newArrLen < 3) return

    const hull: Vertex[] = []
    hull.push(this.vertexList[0])
    hull.push(this.vertexList[1])
    hull.push(this.vertexList[2])

    for (let i = 3; i < newArrLen; i++) {
      while (
        this.getOrientation(
          hull[hull.length - 2],
          hull[hull.length - 1],
          this.vertexList[i]
        ) !== Orientation.COUNTER_CLOCKWISE
      ) {
        hull.pop()
      }
      hull.push(this.vertexList[i])
    }

    // close polygon
    hull.push(this.vertexList[0])
    this.vertexList = hull
  }
}
