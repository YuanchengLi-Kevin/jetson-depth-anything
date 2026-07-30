import { PageFrame, PageFrameProps } from "./types"
import HeaderConstructor from "../Header"

const Header = HeaderConstructor()

/**
 * The default page frame — three-column layout with left sidebar, center
 * content (header + body + afterBody), and right sidebar, followed by a footer.
 *
 * This is the original Quartz layout, extracted from renderPage.tsx.
 */
export const DefaultFrame: PageFrame = {
  name: "default",
  render({
    componentData,
    header,
    beforeBody,
    pageBody: Content,
    afterBody,
    left,
    right,
    footer,
  }: PageFrameProps) {
    return (
      <>
        <div class="left sidebar">
          {left.map((BodyComponent) => (
            <BodyComponent {...componentData} />
          ))}
        </div>
        <div class="center">
          <div class="page-header">
            <Header {...componentData}>
              {header.map((HeaderComponent) => (
                <HeaderComponent {...componentData} />
              ))}
            </Header>
            <div class="popover-hint">
              {beforeBody.map((BodyComponent) => (
                <BodyComponent {...componentData} />
              ))}
            </div>
          </div>
          <Content {...componentData} />
          <hr />
          <div class="page-footer">
            {afterBody.map((BodyComponent) => (
              <BodyComponent {...componentData} />
            ))}
          </div>
        </div>
        {right.length > 0 && (
          <aside class="right sidebar right-sidebar-shell" aria-label="Page tools">
            <button
              class="right-sidebar-toggle"
              type="button"
              aria-expanded="true"
              aria-controls="right-sidebar-content"
              aria-label="Hide page tools"
            >
              <span class="right-sidebar-toggle-icon" aria-hidden="true" />
              <span class="right-sidebar-toggle-label">Page tools</span>
            </button>
            <div id="right-sidebar-content" class="right-sidebar-content">
              {right.map((BodyComponent) => (
                <BodyComponent {...componentData} />
              ))}
            </div>
          </aside>
        )}
        {footer.map((FooterComponent) => (
          <FooterComponent {...componentData} />
        ))}
      </>
    )
  },
}
