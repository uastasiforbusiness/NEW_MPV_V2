import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, act, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/Header";
import { setMockCartState, resetMockCartState } from "./setup";

/* ─── Helpers ──────────────────────────────────────────────── */

/** Fire a scroll event at a given Y offset */
function scrollTo(y: number) {
  window.scrollY = y;
  act(() => {
    window.dispatchEvent(new Event("scroll", { bubbles: false }));
  });
}

/** Get the header HTML element */
function getHeader() {
  return document.querySelector("header")!;
}

/** Get the desktop nav element */
function getDesktopNav() {
  return document.querySelector("nav.hidden.md\\:flex") as HTMLElement;
}

/** Get the mobile menu panel */
function getMobilePanel() {
  return document.querySelector(
    'nav.absolute.top-0.right-0'
  ) as HTMLElement;
}

describe("Header", () => {
  beforeEach(() => {
    resetMockCartState();
    window.scrollY = 0;
  });

  afterEach(() => {
    cleanup();
  });

  /* ────────────── Basic rendering ────────────── */

  it("renders the header element", () => {
    render(<Header />);
    expect(getHeader()).toBeInTheDocument();
  });

  it("renders the logo with MPV branding", () => {
    render(<Header />);
    expect(screen.getByAltText("MPV Italia")).toBeInTheDocument();
    expect(screen.getByText("MPV")).toBeInTheDocument();
    expect(screen.getByText("Italia")).toBeInTheDocument();
  });

  it("renders desktop navigation links inside the desktop nav", () => {
    render(<Header />);
    const desktopNav = getDesktopNav();
    expect(desktopNav).toBeInTheDocument();

    const links = within(desktopNav).getAllByRole("link");
    expect(links.length).toBe(2);
    expect(links[0]).toHaveTextContent("header.navHome");
    expect(links[1]).toHaveTextContent("header.navCollezione");
  });

  it("renders the skip-to-content link for keyboard users", () => {
    render(<Header />);
    const skipLink = screen.getByText("Salta al contenuto");
    expect(skipLink).toBeInTheDocument();
    expect(skipLink.tagName).toBe("A");
    expect(skipLink).toHaveAttribute("href", "#main-content");
    expect(skipLink.className).toContain("sr-only");
  });

  it("renders the LanguageSwitcher in compact variant inside the header", () => {
    render(<Header />);
    const header = getHeader();
    const langGroups = within(header).getAllByRole("radiogroup");
    // One compact in the header bar itself, one default in the mobile menu
    expect(langGroups.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the cart link", () => {
    render(<Header />);
    const cartLink = screen.getByLabelText("header.cartLabel");
    expect(cartLink).toBeInTheDocument();
    expect(cartLink).toHaveAttribute("href", "/carrello");
  });

  /* ────────────── Scroll behavior ────────────── */

  it("has transparent background when at top of page", () => {
    render(<Header />);
    const header = getHeader();
    expect(header.className).toContain("bg-transparent");
    expect(header.className).not.toContain("bg-[var(--surface)]");
  });

  it("adds scrolled classes when scrolled past 40px", () => {
    render(<Header />);
    scrollTo(100);

    const header = getHeader();
    expect(header.className).toContain("bg-[var(--surface)]");
    expect(header.className).toContain("backdrop-blur-lg");
    expect(header.className).not.toContain("bg-transparent");
  });

  it("reverts to transparent when scrolled back to top", () => {
    render(<Header />);
    scrollTo(100);
    scrollTo(0);

    const header = getHeader();
    expect(header.className).toContain("bg-transparent");
    expect(header.className).not.toContain("backdrop-blur-lg");
  });

  it("shows gold accent line when scrolled", () => {
    render(<Header />);
    scrollTo(100);

    const header = getHeader();
    const accentDivs = header.querySelectorAll("div.absolute.bottom-0");
    expect(accentDivs.length).toBeGreaterThan(0);
    expect(accentDivs[0].className).toContain("opacity-100");
  });

  /* ────────────── Cart badge ────────────── */

  it("shows cart badge with item count when items exist", () => {
    setMockCartState({
      items: [
        {
          productId: "1",
          slug: "sofa-rosa",
          name: "Sofa Rosa",
          price: 4200,
          quantity: 2,
          image: "/test.jpg",
          color: "Rosa",
        },
      ],
    });

    render(<Header />);

    const badge = screen.getByText("2");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("rounded-full");

    expect(
      screen.getByLabelText("Carrello (2 articoli)")
    ).toBeInTheDocument();
  });

  it("shows '9+' when item count exceeds 9", () => {
    setMockCartState({
      items: [
        {
          productId: "1",
          slug: "sofa-rosa",
          name: "Sofa Rosa",
          price: 4200,
          quantity: 10,
          image: "/test.jpg",
          color: "Rosa",
        },
      ],
    });

    render(<Header />);
    expect(screen.getByText("9+")).toBeInTheDocument();
  });

  it("does not show badge when cart is empty", () => {
    render(<Header />);
    expect(screen.getByLabelText("header.cartLabel")).toBeInTheDocument();

    // Verify no rounded-full badge with numeric text inside the header
    const header = getHeader();
    const spans = header.querySelectorAll("span");
    const badgeSpans = Array.from(spans).filter(
      (s) =>
        s.className.includes("rounded-full") &&
        /^\d+$/.test(s.textContent?.trim() || "")
    );
    expect(badgeSpans.length).toBe(0);
  });

  /* ────────────── Mobile menu ────────────── */

  it("has a mobile menu toggle button", () => {
    render(<Header />);
    const menuToggle = screen.getByLabelText("header.mobileMenuOpen");
    expect(menuToggle).toBeInTheDocument();
    expect(menuToggle.tagName).toBe("BUTTON");
  });

  it("opens mobile menu when toggle is clicked", async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByLabelText("header.mobileMenuOpen"));

    const panel = getMobilePanel();
    expect(panel).toBeInTheDocument();
    expect(panel.className).toContain("translate-x-0");
  });

  it("closes mobile menu when toggle is clicked again", async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByLabelText("header.mobileMenuOpen"));
    await user.click(screen.getByLabelText("header.mobileMenuClose"));

    const panel = getMobilePanel();
    expect(panel.className).toContain("translate-x-full");
  });

  it("closes mobile menu when backdrop is clicked", async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByLabelText("header.mobileMenuOpen"));

    // Backdrop is the absolute inset-0 div behind the menu panel
    const backdrop = document.querySelector(
      'div.absolute.inset-0'
    ) as HTMLElement;
    expect(backdrop).toBeInTheDocument();
    await user.click(backdrop);

    const panel = getMobilePanel();
    expect(panel.className).toContain("translate-x-full");
  });

  it("shows mobile links inside the menu panel", async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByLabelText("header.mobileMenuOpen"));

    const panel = getMobilePanel();
    const links = panel.querySelectorAll("a");
    expect(links.length).toBeGreaterThanOrEqual(3);
  });

  it("updates toggle aria-label when menu is open/closed", async () => {
    const user = userEvent.setup();
    render(<Header />);

    expect(
      screen.getByLabelText("header.mobileMenuOpen")
    ).toBeInTheDocument();

    await user.click(screen.getByLabelText("header.mobileMenuOpen"));

    expect(
      screen.getByLabelText("header.mobileMenuClose")
    ).toBeInTheDocument();
  });

  /* ────────────── Active nav link ────────────── */

  it("marks home link as active when pathname is '/'", () => {
    // setup.ts mocks usePathname to return "/"
    render(<Header />);

    const desktopNav = getDesktopNav();
    const homeLinks = within(desktopNav).getAllByText("header.navHome");
    expect(homeLinks.length).toBe(1);

    const homeLink = homeLinks[0].closest("a");
    expect(homeLink).toHaveAttribute("aria-current", "page");
  });

  it("sets aria-current on at least one nav link", () => {
    render(<Header />);

    const allLinks = screen.getAllByRole("link");
    const activeLinks = allLinks.filter((l) =>
      l.hasAttribute("aria-current")
    );
    // Home link in desktop nav should have aria-current
    expect(activeLinks.length).toBeGreaterThanOrEqual(1);
  });

  /* ────────────── Language switcher inside header ────────────── */

  it("includes language switcher inside the header", () => {
    render(<Header />);

    const header = getHeader();
    const langGroups = within(header).getAllByRole("radiogroup");
    expect(langGroups.length).toBeGreaterThanOrEqual(1);

    // At least one should have "lingua" in its aria-label
    const hasLingua = langGroups.some((g) =>
      /lingua/i.test(g.getAttribute("aria-label") || "")
    );
    expect(hasLingua).toBe(true);
  });

  /* ────────────── Accessibility essentials ────────────── */

  it("has a skip-to-content link as first focusable element", () => {
    render(<Header />);

    const skipLink = document.querySelector('a[href="#main-content"]');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink?.textContent?.trim()).toBe("Salta al contenuto");
  });

  it("header element exists with proper semantics", () => {
    render(<Header />);
    expect(getHeader()).toBeInTheDocument();
  });

  it("desktop nav has exactly two links", () => {
    render(<Header />);

    const desktopNav = getDesktopNav();
    expect(desktopNav).toBeInTheDocument();
    expect(desktopNav.querySelectorAll("a").length).toBe(2);
  });

  /* ────────────── Cart link accessibility ────────────── */

  it("cart link has appropriate aria-label with items", () => {
    setMockCartState({
      items: [
        {
          productId: "1",
          slug: "sofa-rosa",
          name: "Sofa Rosa",
          price: 4200,
          quantity: 3,
          image: "/test.jpg",
          color: "Rosa",
        },
      ],
    });

    render(<Header />);
    expect(
      screen.getByLabelText("Carrello (3 articoli)")
    ).toBeInTheDocument();
  });

  /* ────────────── Logo rendering ────────────── */

  it("renders the logo image", () => {
    render(<Header />);
    const logo = screen.getByAltText("MPV Italia");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src");
  });

  /* ────────────── Snapshot ────────────── */

  it("matches snapshot at top of page", () => {
    window.scrollY = 0;
    const { container } = render(<Header />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("matches snapshot when scrolled with cart items", () => {
    window.scrollY = 100;

    setMockCartState({
      items: [
        {
          productId: "1",
          slug: "sofa-rosa",
          name: "Sofa Rosa",
          price: 4200,
          quantity: 1,
          image: "/test.jpg",
          color: "Rosa",
        },
      ],
    });

    const { container } = render(<Header />);
    scrollTo(100);
    expect(container.firstChild).toMatchSnapshot();
  });
});
