const { default: nameClass } = require("tailwindcss/lib/util/nameClass")
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette")
const _ = require("lodash")
const plugin = require("tailwindcss/plugin")
const createColor = require("color")

const colorTriplet = (value) => {
  try {
    const [r, g, b] = createColor(value).rgb().array()
    return [r, g, b].join(", ")
  } catch (err) {
    return value
  }
}

module.exports = plugin(
  ({ addUtilities, theme }) => {
    const colors = flattenColorPalette(theme("colors"))
    const utilities = _.fromPairs(
      _.map(_.omit(colors, "DEFAULT", "accent"), (value, modifier) => {
        return [
          nameClass("accent", modifier),
          {
            "--tw-accent-color": colorTriplet(value),
          },
        ]
      }),
    )

    addUtilities(utilities)
  },
  {
    theme: {
      extend: {
        colors: {
          accent: ({ opacityVariable, opacityValue }) => {
            if (opacityValue !== undefined) {
              return `rgba(var(--tw-accent-color), ${opacityValue})`
            }
            if (opacityVariable !== undefined) {
              return `rgba(var(--tw-accent-color), var(${opacityVariable}, 1))`
            }
            return `rgb(var(--tw-accent-color))`
          },
        },
      },
    },
  },
)
