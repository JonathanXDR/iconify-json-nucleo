const COMPONENT_PREFIX = 'Icon';

export function kebabCase(value: string): string {
  return value
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function iconNameFromExport(exportName: string): string | undefined {
  if (exportName === COMPONENT_PREFIX || !exportName.startsWith(COMPONENT_PREFIX)) {
    return undefined;
  }

  const base = exportName.slice(COMPONENT_PREFIX.length);
  if (base.length === 0) {
    return undefined;
  }

  return kebabCase(base);
}
