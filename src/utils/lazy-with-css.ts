import { lazy, type ComponentType } from "react";

const CSS_LOAD_TIMEOUT_MS = 5000;

type ModuleWithDefault = { default: ComponentType<unknown> };

export function lazyWithCss(factory: () => Promise<ModuleWithDefault>) {
  return lazy(async () => {
    const linksBefore = new Set(
      document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
    );

    const module = await factory();

    const linksAfter = document.querySelectorAll<HTMLLinkElement>(
      'link[rel="stylesheet"]'
    );
    const newLinks = Array.from(linksAfter).filter(
      (link) => !linksBefore.has(link)
    );

    if (newLinks.length > 0) {
      const pending = newLinks
        .filter((link) => !link.sheet)
        .map(
          (link) =>
            new Promise<void>((resolve) => {
              link.addEventListener("load", () => resolve(), { once: true });
              link.addEventListener("error", () => resolve(), { once: true });
            })
        );

      if (pending.length > 0) {
        await Promise.race([
          Promise.all(pending),
          new Promise<void>((r) => setTimeout(r, CSS_LOAD_TIMEOUT_MS)),
        ]);
      }
    }

    return module;
  });
}
