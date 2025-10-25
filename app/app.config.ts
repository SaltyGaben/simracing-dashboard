export default defineAppConfig({
  ui: {
    card: {
      variants: {
        variant: {
          solid: {
            root: 'bg-default divide-y divide-default'
          },
          outline: {
            root: 'bg-default ring ring-default divide-y divide-default'
          },
          soft: {
            root: 'bg-elevated/50 divide-y divide-default'
          },
          subtle: {
            root: 'bg-[#11182a] ring-0 divide-y divide-default'
          },
          transparent: {
            root: 'bg-[#1a2238] divide-y divide-default'
          }
        }
      },
      defaultVariants: {
        variant: 'transparent'
      }
    }
  }
})
