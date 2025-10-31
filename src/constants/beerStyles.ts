export const BEER_STYLE_OPTIONS = {
  lager_clasica_pilsner: "Lager Clásica / Pilsner",
  lager_oscura_fuerte: "Lager Oscura / Fuerte",
  lager_ligera: "Lager Ligera",
  ipa: "India Pale Ale (IPA)",
  trigo_wheat: "Cerveza de Trigo (Wheat)",
  ale_belga_clasica: "Ale Belga Clásica",
  stout_porter: "Stout / Porter",
  fruta_saborizada: "Cerveza de Fruta / Saborizada",
} as const;

export type BeerStyleValue = keyof typeof BEER_STYLE_OPTIONS;

export const BEER_STYLE_VALUES = Object.keys(
  BEER_STYLE_OPTIONS,
) as BeerStyleValue[];

export const getBeerStyleLabel = (value: string): string =>
  BEER_STYLE_OPTIONS[value as BeerStyleValue] ?? value;

