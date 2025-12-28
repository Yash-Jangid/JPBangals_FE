export const Fonts = {
  // Using system fonts that are elegant and widely available
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',

  // Font sizes
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Font weights (for dynamic styling)
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },

  // Letter spacing for elegance
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};