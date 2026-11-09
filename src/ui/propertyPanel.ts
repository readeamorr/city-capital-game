import type { Property } from '../game/properties';

export function showProperty(property: Property): void {
  const panel = document.querySelector<HTMLElement>('#property-panel');
  if (!panel) return;
  const values: Record<string, string> = {
    name: property.name,
    id: property.id,
    price: `$${property.price}`,
    rent: `$${property.baseRent}`,
    owner: property.owner ?? 'Unowned',
    level: String(property.buildingLevel),
  };
  for (const [key, value] of Object.entries(values)) {
    const element = panel.querySelector<HTMLElement>(`[data-property="${key}"]`);
    if (element) element.textContent = value;
  }
  panel.hidden = false;
}
