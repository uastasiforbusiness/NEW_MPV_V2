"use client";

import { forwardRef, type ElementType, type ComponentPropsWithoutRef } from "react";
import { Link } from "@/i18n/navigation";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "xl";

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  href?: string;
};

type ButtonAsCustom<C extends ElementType> = ButtonBaseProps & {
  as: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof ButtonBaseProps | "as">;

type ButtonAsButton = ButtonBaseProps & {
  as?: "button";
  disabled?: boolean;
  children?: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps | "as" | "disabled" | "children">;

type ButtonAsLink = ButtonBaseProps & {
  as: "a";
  href: string;
  children?: React.ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps | "as" | "href" | "children">;

export type ButtonProps<C extends ElementType = "button"> =
  C extends "button"
    ? ButtonAsButton
    : C extends "a"
      ? ButtonAsLink
      : ButtonAsCustom<C>;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:bg-[var(--accent-hover)] shadow-sm",
  secondary:
    "bg-[var(--brand-charcoal)] text-white hover:bg-[var(--brand-graphite)] active:bg-[var(--brand-graphite)]",
  outline:
    "border border-[var(--border-strong)] bg-transparent text-[var(--foreground)] hover:bg-[var(--brand-cream)] active:bg-[var(--neutral-100)]",
  ghost:
    "bg-transparent text-[var(--foreground)] hover:bg-[var(--neutral-100)] active:bg-[var(--neutral-200)]",
  danger:
    "bg-[var(--error)] text-white hover:bg-[#B91C1C] active:bg-[#991B1B]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5 min-h-[36px]",
  md: "px-5 py-2.5 text-sm gap-2 min-h-[44px]",
  lg: "px-6 py-3 text-base gap-2.5 min-h-[48px]",
  xl: "px-8 py-4 text-lg gap-3 min-h-[56px]",
};

function getClassName(base: ButtonBaseProps & { disabled?: boolean; className?: string }): string {
  const {
    variant = "primary",
    size = "md",
    isLoading = false,
    fullWidth = false,
    className = "",
  } = base;

  return [
    "inline-flex items-center justify-center font-medium",
    "rounded-[var(--radius-md)] transition-all duration-[var(--transition-base)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
    "disabled:opacity-50 disabled:cursor-not-allowed select-none",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

interface ButtonComponent {
  <C extends ElementType = "button">(
    props: ButtonProps<C> & { ref?: React.Ref<unknown> }
  ): React.ReactElement;
  displayName: string;
}

function ButtonInner<C extends ElementType = "button">(
  props: ButtonProps<C>,
  ref: React.ForwardedRef<unknown>
) {
  const variant = (props as Record<string, unknown>).variant as ButtonVariant | undefined;
  const size = (props as Record<string, unknown>).size as ButtonSize | undefined;
  const isLoading = !!(props as Record<string, unknown>).isLoading;
  const fullWidth = !!(props as Record<string, unknown>).fullWidth;
  const className = ((props as Record<string, unknown>).className as string) || "";
  const as = (props as Record<string, unknown>).as;
  const href = (props as Record<string, unknown>).href as string | undefined;

  const baseProps = { variant, size, isLoading, fullWidth };

  // Exclude Button-internal props from the DOM spread
  function stripButtonProps(obj: Record<string, unknown>) {
    delete obj.variant;
    delete obj.size;
    delete obj.isLoading;
    delete obj.fullWidth;
    delete obj.className;
  }

  // Render as Link when href is provided (native i18n navigation)
  if (href && !as) {
    const { href: _, children, ...rest_ } = props as Record<string, unknown>;
    stripButtonProps(rest_ as Record<string, unknown>);
    delete (rest_ as Record<string, unknown>).as;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={getClassName({ ...baseProps, className })}
        {...(rest_ as Record<string, unknown>)}
      >
        {isLoading && <LoadingSpinner />}
        {children as React.ReactNode}
      </Link>
    );
  }

  if (as === "a") {
    const { as: _, children, ...rest_ } = props as Record<string, unknown>;
    stripButtonProps(rest_ as Record<string, unknown>);
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={getClassName({ ...baseProps, className })}
        {...(rest_ as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {isLoading && <LoadingSpinner />}
        {children as React.ReactNode}
      </a>
    );
  }

  if (as === undefined || as === "button") {
    const { as: _, children, ...rest_ } = props as Record<string, unknown>;
    const disabled = !!(props as Record<string, unknown>).disabled;
    stripButtonProps(rest_ as Record<string, unknown>);
    delete (rest_ as Record<string, unknown>).disabled;
    delete (rest_ as Record<string, unknown>).href;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={disabled || isLoading}
        className={getClassName({ ...baseProps, disabled, className })}
        {...(rest_ as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {isLoading && <LoadingSpinner />}
        {children as React.ReactNode}
      </button>
    );
  }

  // Custom component (e.g. external advanced usage)
  const Component = as as React.ElementType;
  const { as: _, children, ...rest_ } = props as Record<string, unknown>;
  stripButtonProps(rest_ as Record<string, unknown>);

  return (
    <Component
      ref={ref}
      className={getClassName({ ...baseProps, className })}
      {...rest_}
    >
      {isLoading && <LoadingSpinner />}
      {children as React.ReactNode}
    </Component>
  );
}

export const Button = forwardRef(ButtonInner) as ButtonComponent;

Button.displayName = "Button";

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
