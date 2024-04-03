import type Model from '@/primitives/Model'

export default class ScaleXInput {
  private readonly input: HTMLInputElement = document.getElementById(
    'scale-x-input'
  ) as HTMLInputElement

  addListener (canvas: HTMLCanvasElement, selectedModel: Model): void {
    this.input.min = '0'
    this.input.max = '5'
    this.input.value = selectedModel.getTransformMatArray()[0].toString()

    this.input.addEventListener('input', (e: any) => {
      selectedModel.updateXScale(
        parseFloat(e.target.value as string),
        canvas.width
      )
    })

    this.input.addEventListener('mouseup', () => {
      selectedModel.resetXScale(canvas.width)

      this.input.min = '0'
      this.input.max = '5'
      this.input.value = selectedModel.getTransformMatArray()[0].toString()
    })
  }
}
