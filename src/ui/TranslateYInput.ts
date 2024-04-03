import type Model from '@/primitives/Model'

export default class TranslateYInput {
  private readonly input: HTMLInputElement = document.getElementById(
    'translate-y-input'
  ) as HTMLInputElement

  addListener (
    canvas: HTMLCanvasElement,
    selectedModel: Model,
    adjustColorPicker: () => void,
    updateVertexDropdown: () => void
  ): void {
    const selectedVertices = selectedModel.vertexList
    const selectedYClipSpace =
      (selectedVertices[0].coord[1] * 2.0) / canvas.height - 1.0

    this.input.min = (-1.0 - selectedYClipSpace).toString()
    this.input.max = (1.0 - selectedYClipSpace).toString()
    this.input.value = selectedYClipSpace.toString()

    this.input.addEventListener('input', (e: any) => {
      selectedModel.updateYTranslate(parseFloat(e.target.value as string))
    })

    this.input.addEventListener('mouseup', (e: any) => {
      selectedModel.resetYTranslate(canvas.height)

      const selectedVertices = selectedModel.vertexList
      const selectedYClipSpace =
        (selectedVertices[0].coord[1] * 2.0) / canvas.height - 1.0

      this.input.min = (-1.0 - selectedYClipSpace).toString()
      this.input.max = (1.0 - selectedYClipSpace).toString()
      this.input.value = selectedYClipSpace.toString()

      updateVertexDropdown()
      adjustColorPicker()
    })
  }
}
