import Model from "@/primitives/Model";
import Vertex from "@/primitives/Vertex";

export default class Rectangle extends Model {
  // TODO: create constraint
  private static count: number = 1;
  private vertexRef: Vertex;
  private width: number = 0;
  private height: number = 0;

  constructor(vertexRef?: Vertex) {
    super(`rectangle-${Rectangle.count}`);
    Rectangle.count++;
    this.vertexRef = vertexRef ?? new Vertex([0, 0]);
  }

  addVertex(vertex: Vertex): void {
    super.addVertex(vertex);
  }

  getDrawMethod(gl: WebGLRenderingContext): number {
    return gl.TRIANGLE_FAN;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getVertexRef(): Vertex {
    return this.vertexRef;
  }

  setVertexRef(vertex: Vertex): void {
    this.vertexRef = vertex;
  }

  private getRelativeWidth(): number {
    return this.vertexList[3].coord[0] - this.vertexRef.coord[0];
  }

  private getRelativeHeight(): number {
    return this.vertexList[1].coord[1] - this.vertexRef.coord[1];
  }

  // Restore vertexRef to top-left vertex
  restoreVertexRef(): void {
    if (this.getRelativeWidth() < 0 && this.getRelativeHeight() < 0) {
      this.vertexRef = this.vertexList[3];
    } else if (this.getRelativeWidth() < 0 && this.getRelativeHeight() >= 0) {
      this.vertexRef = this.vertexList[2];
    } else if (this.getRelativeWidth() >= 0 && this.getRelativeHeight() < 0) {
      this.vertexRef = this.vertexList[0];
    } else {
      this.vertexRef = this.vertexList[1];
    }

    this.vertexList = [
      this.vertexRef,
      new Vertex([
        this.vertexRef.coord[0],
        this.vertexRef.coord[1] - this.height,
      ]),
      new Vertex([
        this.vertexRef.coord[0] + this.width,
        this.vertexRef.coord[1] - this.height,
      ]),
      new Vertex([
        this.vertexRef.coord[0] + this.width,
        this.vertexRef.coord[1],
      ]),
      this.vertexRef,
    ];
  }

  updateVerticesWhenDrawing(x: number, y: number): void {
    this.vertexList = [
      this.vertexRef,
      new Vertex([this.vertexRef.coord[0], y]),
      new Vertex([x, y]),
      new Vertex([x, this.vertexRef.coord[1]]),
      this.vertexRef,
    ];
    this.width = Math.abs(this.vertexRef.coord[0] - x);
    this.height = Math.abs(this.vertexRef.coord[1] - y);
  }

  updateVerticesWhenDragging(x: number, y: number): void {
    return;
  }
}
