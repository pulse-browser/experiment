import type {
  BlockComponent,
  BlockDirection,
  ExportComponent,
  SpacerComponent,
} from '.'

function getBlockStyle(block: BlockComponent): string {
  let style = `
    display: flex; 
    flex-direction: ${block.direction === 'horizontal' ? 'row' : 'column'};
    background-color: var(--${block.color});
    border-color: var(--${block.color});
  `

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

function getSpacer(
  spacer: SpacerComponent,
  parentOrientation: BlockDirection,
): string {
  return `
    flex-grow: ${spacer.grow}; 
    display: flex; 
    flex-direction: ${parentOrientation === 'horizontal' ? 'row' : 'column'};
  `
}

function getOmniboxStyle(parentOrientation: BlockDirection): string {
  return `
    flex-grow: ${parentOrientation === 'horizontal' ? 1 : 0};

    display: flex;
    justify-content: center;
    align-items: center;
  `
}

function getTabsStyle(): string {
  return `
    display:flex;
    gap: 0.25rem;
  `
}

export function getComponentStyle(
  component: ExportComponent,
  parentOrientation: BlockDirection,
): string {
  switch (component.type) {
    case 'block':
      return getBlockStyle(component)
    case 'browser':
      return getBrowserStyle()
    case 'spacer':
      return getSpacer(component, parentOrientation)
    case 'omnibox':
      return getOmniboxStyle(parentOrientation)
    case 'tabs':
      return getTabsStyle()
    default:
      return ''
  }
}
