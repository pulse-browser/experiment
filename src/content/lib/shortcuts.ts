export function initializeShortcuts() {
  document.addEventListener('AppCommand', (event: any) => {
    switch (event.command) {
      case 'Back':
        break
      case 'Forward':
        break
      default:
        console.log(event)
    }
  })
}
