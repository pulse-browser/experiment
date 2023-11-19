import type { BlockComponent, ExportComponent, SpacerComponent } from '.'

function getBlockStyle(block: BlockComponent): string {
  let style = `display: flex; flex-direction: ${
    block.direction === 'horizontal' ? 'row' : 'column'
  };`

  if (block.size.type === 'fixed') {
    style += `${block.direction === 'horizontal' ? 'height' : 'width'}: ${
      block.size.value
    }rem;`
  }

  if (block.size.type === 'grow') {
    style += `flex-grow: ${block.size.value};`
  }

  return style
}

function getBrowserStyle(): string {
  return `
    flex-grow: 1;

    display: flex;
    justify-content: center;
    align-items: center;
  `
}

function getSpacer(spacer: SpacerComponent): string {
  return `flex-grow: ${spacer.grow}; display: flex;`
}

export function getComponentStyle(component: ExportComponent): string {
  switch (component.type) {
    case 'block':
      return getBlockStyle(component)
    case 'browser':
      return getBrowserStyle()
    case 'spacer':
      return getSpacer(component)
    default:
      return ''
  }
}
