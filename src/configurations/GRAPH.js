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
    markerWidth: 16,
    markerHeight: 16,
    color: SSB_COLORS.GREY,
    strokeWidth: 1
  },
  d3: {
    linkLength: 400
  },
  width: ((width * 0.5559)),
  height: ((height * 0.54)).toFixed(0)
})
