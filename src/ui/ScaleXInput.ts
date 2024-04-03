import type Model from '@/primitives/Model'

export default class ScaleXInput {
  private readonly input: HTMLInputElement = document.getElementById(
    'scale-x-input'
  ) as HTMLInputElement

  private selectedModel: Model | null = null

  constructor (private readonly canvas: HTMLCanvasElement) {}

  private readonly onInput = (e: any): void => {
    if (this.selectedModel) {
      console.log('select', this.selectedModel.id)
      this.selectedModel.scale(
        parseFloat(e.target.value as string),
        parseFloat(e.target.value as string),
        this.canvas
      )
    }
  }

  private readonly onMouseUp = (): void => {
    if (this.selectedModel) {
      this.selectedModel.resetScale(this.canvas)

      this.input.min = '0'
      this.input.max = '5'
      this.input.value = this.selectedModel
        .getTransformMatArray()[0]
        .toString()
    }
  }

  addListener (selectedModel: Model): void {
    this.input.min = '0'
    this.input.max = '5'
    this.input.value = selectedModel.getTransformMatArray()[0].toString()

    this.selectedModel = selectedModel

    this.input.addEventListener('input', this.onInput)
    this.input.addEventListener('mouseup', this.onMouseUp)
  }

  removeListener (): void {
    this.input.removeEventListener('input', this.onInput)
    this.input.removeEventListener('mouseup', this.onMouseUp)
  }
}
