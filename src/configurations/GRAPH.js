import { SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

export const GRAPH_CONFIG = (width, height) => ({
  nodeHighlightBehavior: false,
  linkHighlightBehavior: false,
  automaticRearrangeAfterDropNode: false,
  staticGraph: false,
  staticGraphWithDragAndDrop: true,
  directed: true,
  node: {
    labelProperty: node => node.nodeLabelName === '' || node.nodeLabelName === '-' ? node.id : node.nodeLabelName,
    size: 400,
    fontSize: 16,
    color: SSB_COLORS.BLUE
  },
  link: {
    labelProperty: link => link.linkLabelName,
    renderLabel: true,
    fontSize: 12,
    markerWidth: 12,
    markerHeight: 12,
    color: SSB_COLORS.GREY
  },
  d3: {
    linkStrength: 1,
    gravity: -100,
    linkLength: 400
  },
  width: ((width * 0.6145)),
  height: ((height * 0.55)).toFixed(0)
})
