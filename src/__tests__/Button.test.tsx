import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  /* ────────────── Rendering variants ────────────── */

  it("renders as a <button> by default", () => {
    render(<Button>Clicca</Button>);

    const btn = screen.getByRole("button", { name: /clicca/i });
    expect(btn).toBeInTheDocument();
    expect(btn.tagName).toBe("BUTTON");
  });

  it("renders all variants without crashing", () => {
    const variants = ["primary", "secondary", "outline", "ghost", "danger"] as const;

    for (const variant of variants) {
      const { unmount } = render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByRole("button", { name: variant })).toBeInTheDocument();
      unmount();
    }
  });

  it("renders all sizes without crashing", () => {
    const sizes = ["sm", "md", "lg", "xl"] as const;

    for (const size of sizes) {
      const { unmount } = render(<Button size={size}>{size}</Button>);
      expect(screen.getByRole("button", { name: size })).toBeInTheDocument();
      unmount();
    }
  });

  /* ────────────── as="a" anchor ────────────── */

  it("renders as an anchor when as='a'", () => {
    render(
      <Button as="a" href="https://example.com">
        Vai
      </Button>
    );

    const link = screen.getByText("Vai");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  /* ────────────── href → Link (i18n) ────────────── */

  it("renders a Link element when href is provided without as", () => {
    render(<Button href="/prodotti">Collezione</Button>);

    const link = screen.getByText("Collezione");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/prodotti");
  });

  /* ────────────── Disabled state ────────────── */

  it("disables the button when disabled is true", () => {
    render(<Button disabled>Disabilitato</Button>);

    const btn = screen.getByRole("button", { name: /disabilitato/i });
    expect(btn).toBeDisabled();
  });

  it("does not render a disabled attribute on anchor elements", () => {
    render(
      <Button as="a" href="/test">
        Link
      </Button>
    );

    const link = screen.getByText("Link");
    expect(link.tagName).toBe("A");
    // anchor elements don't have a disabled attribute in HTML spec
    expect(link).not.toHaveAttribute("disabled");
  });

  /* ────────────── Loading state ────────────── */

  it("shows a loading spinner when isLoading is true", () => {
    const { container } = render(<Button isLoading>Caricamento</Button>);

    const btn = screen.getByRole("button", { name: /caricamento/i });
    expect(btn).toBeDisabled();

    // Loading spinner is an SVG with the animate-spin class
    const spinner = container.querySelector("svg.animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("still shows children text when loading", () => {
    render(<Button isLoading>Invia</Button>);

    expect(screen.getByText("Invia")).toBeInTheDocument();
  });

  /* ────────────── fullWidth ────────────── */

  it("applies w-full class when fullWidth is true", () => {
    render(<Button fullWidth>Largo</Button>);

    const btn = screen.getByRole("button", { name: /largo/i });
    expect(btn.className).toContain("w-full");
  });

  it("does not apply w-full when fullWidth is false", () => {
    render(<Button>Normale</Button>);

    const btn = screen.getByRole("button", { name: /normale/i });
    expect(btn.className).not.toContain("w-full");
  });

  /* ────────────── Custom className ────────────── */

  it("merges custom className with default classes", () => {
    render(<Button className="my-custom-class">Custom</Button>);

    const btn = screen.getByRole("button", { name: /custom/i });
    expect(btn.className).toContain("my-custom-class");
    expect(btn.className).toContain("rounded-[");
  });

  /* ────────────── Click handler ────────────── */

  it("fires onClick when clicked", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole("button", { name: /click/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button onClick={handleClick} disabled>
        Click
      </Button>
    );
    await user.click(screen.getByRole("button", { name: /click/i }));

    expect(handleClick).not.toHaveBeenCalled();
  });

  /* ────────────── Accessibility ────────────── */

  it("supports aria attributes", () => {
    render(
      <Button aria-label="Esegui azione" aria-describedby="desc">
        Azione
      </Button>
    );

    const btn = screen.getByRole("button", { name: /esegui azione/i });
    expect(btn).toHaveAttribute("aria-describedby", "desc");
  });

  it("has focus-visible outline classes for keyboard navigation", () => {
    render(<Button>Focus</Button>);

    const btn = screen.getByRole("button", { name: /focus/i });
    expect(btn.className).toContain("focus-visible:outline-2");
  });

  /* ────────────── Forwarded ref ────────────── */

  it("forwards ref to the DOM element", () => {
    const ref = { current: null as HTMLButtonElement | null };

    render(<Button ref={ref}>Ref</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toContain("Ref");
  });

  /* ────────────── Snapshot ────────────── */

  it("matches snapshot for primary button", () => {
    const { container } = render(
      <Button variant="primary" size="md">
        Salva
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("matches snapshot for outline button with href", () => {
    const { container } = render(
      <Button variant="outline" href="/annulla" size="lg">
        Annulla
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
