import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { iconNameFromExport } from './naming';

export interface RenderedIcon {
  readonly name: string;
  readonly svg: string;
}

function isComponent(value: unknown): value is ComponentType {
  return typeof value === 'function';
}

export async function renderModule(specifier: string): Promise<RenderedIcon[]> {
  const moduleExports = (await import(specifier)) as Record<string, unknown>;
  const icons: RenderedIcon[] = [];
  const seen = new Set<string>();

  for (const [exportName, value] of Object.entries(moduleExports)) {
    const name = iconNameFromExport(exportName);
    if (name === undefined || !isComponent(value)) {
      continue;
    }
    if (seen.has(name)) {
      throw new Error(`Duplicate icon "${name}" (export "${exportName}") in ${specifier}`);
    }
    seen.add(name);
    icons.push({ name, svg: renderToStaticMarkup(createElement(value)) });
  }

  if (icons.length === 0) {
    throw new Error(`No icon components found in ${specifier}`);
  }

  return icons;
}
