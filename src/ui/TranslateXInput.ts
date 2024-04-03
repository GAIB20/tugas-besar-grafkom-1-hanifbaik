import type Model from '@/primitives/Model'

export default class TranslateXInput {
  private readonly input: HTMLInputElement = document.getElementById('translate-x-input') as HTMLInputElement

  addListener (canvas: HTMLCanvasElement, selectedModel: Model): void {
    const selectedVertices = selectedModel.vertexList
    const selectedXClipSpace =
    (selectedVertices[0].coord[0] * 2.0) / canvas.width - 1.0

    this.input.min = (-1.0 - selectedXClipSpace).toString()
    this.input.max = (1.0 - selectedXClipSpace).toString()
    this.input.value = selectedXClipSpace.toString()

    this.input.addEventListener('input', (e: any) => {
      selectedModel.updateXTranslate(parseFloat(e.target.value as string))
    })

    this.input.addEventListener('mouseup', (e: any) => {
      selectedModel.resetXTranslate(canvas.width)

      const selectedVertices = selectedModel.vertexList
      const selectedXClipSpace =
        (selectedVertices[0].coord[0] * 2.0) / canvas.width - 1.0

      this.input.min = (-1.0 - selectedXClipSpace).toString()
      this.input.max = (1.0 - selectedXClipSpace).toString()
      this.input.value = selectedXClipSpace.toString()
    })
  }
}
