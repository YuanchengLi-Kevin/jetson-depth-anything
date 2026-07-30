const rightSidebarWideQuery = window.matchMedia("(min-width: 1201px)")
const rightSidebarWideKey = "depth-anything-jetson:right-sidebar:wide"
const rightSidebarCompactKey = "depth-anything-jetson:right-sidebar:compact"

function getInitialRightSidebarState(): "expanded" | "collapsed" {
  const isWide = rightSidebarWideQuery.matches
  const storageKey = isWide ? rightSidebarWideKey : rightSidebarCompactKey
  const fallback = isWide ? "expanded" : "collapsed"

  try {
    const stored = localStorage.getItem(storageKey)
    return stored === "expanded" || stored === "collapsed" ? stored : fallback
  } catch {
    return fallback
  }
}

document.documentElement.dataset.rightSidebar = getInitialRightSidebarState()
