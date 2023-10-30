let sidebarItemCounter = 0

export class SidebarItemData {
  counter = sidebarItemCounter++

  container: HTMLDivElement
  title: string
  id: string

  hasObserver = false

  constructor(container: HTMLDivElement, title: string) {
    this.container = container
    this.title = title

    this.id = this.title.replace(/\s/g, '_')
    this.container.setAttribute('id', this.id)
  }

  addObserver(observer: IntersectionObserver | undefined) {
    if (this.hasObserver || !observer) return
    observer.observe(this.container)
    this.hasObserver = true
  }
}
