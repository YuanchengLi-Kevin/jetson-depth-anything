import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { componentRegistry } from "./quartz/components/registry"
import type { ExplorerOptions } from "@quartz-community/explorer"

componentRegistry.setOptionOverrides("@quartz-community/explorer", {
  sortFn: ((a, b) => {
    const workflowOrder = ["proposal", "design", "implementation", "evaluation"]
    const aWorkflowIndex = workflowOrder.indexOf((a.slugSegment ?? "").toLowerCase())
    const bWorkflowIndex = workflowOrder.indexOf((b.slugSegment ?? "").toLowerCase())

    if (aWorkflowIndex !== -1 || bWorkflowIndex !== -1) {
      if (aWorkflowIndex === -1) return 1
      if (bWorkflowIndex === -1) return -1
      return aWorkflowIndex - bWorkflowIndex
    }

    if (a.isFolder !== b.isFolder) {
      return a.isFolder ? -1 : 1
    }

    return (a.displayName ?? "").localeCompare(b.displayName ?? "", undefined, {
      numeric: true,
      sensitivity: "base",
    })
  }) satisfies NonNullable<ExplorerOptions["sortFn"]>,
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
