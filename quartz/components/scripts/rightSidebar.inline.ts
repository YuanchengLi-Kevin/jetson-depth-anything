const wideQuery = window.matchMedia("(min-width: 1201px)")
const wideKey = "depth-anything-jetson:right-sidebar:wide"
const compactKey = "depth-anything-jetson:right-sidebar:compact"

type RightSidebarState = "expanded" | "collapsed"

function storageKey(): string {
  return wideQuery.matches ? wideKey : compactKey
}

function defaultState(): RightSidebarState {
  return wideQuery.matches ? "expanded" : "collapsed"
}

function readState(): RightSidebarState {
  try {
    const stored = localStorage.getItem(storageKey())
    return stored === "expanded" || stored === "collapsed" ? stored : defaultState()
  } catch {
    return defaultState()
  }
}

function writeState(state: RightSidebarState) {
  try {
    localStorage.setItem(storageKey(), state)
  } catch {
    // Storage can be unavailable in privacy modes; the control still works.
  }
}

function syncRightSidebar(state: RightSidebarState = readState()) {
  document.documentElement.dataset.rightSidebar = state

  const toggle = document.querySelector<HTMLButtonElement>(".right-sidebar-toggle")
  const content = document.querySelector<HTMLElement>("#right-sidebar-content")
  if (!toggle || !content) return

  const expanded = state === "expanded"
  toggle.setAttribute("aria-expanded", String(expanded))
  toggle.setAttribute("aria-label", expanded ? "Hide page tools" : "Show page tools")
  content.hidden = !expanded
}

document.addEventListener("click", (event) => {
  const target = event.target
  if (!(target instanceof Element) || !target.closest(".right-sidebar-toggle")) return

  const nextState: RightSidebarState =
    document.documentElement.dataset.rightSidebar === "expanded" ? "collapsed" : "expanded"
  writeState(nextState)
  syncRightSidebar(nextState)
})

document.addEventListener("nav", () => syncRightSidebar())
wideQuery.addEventListener("change", () => syncRightSidebar())
syncRightSidebar()
