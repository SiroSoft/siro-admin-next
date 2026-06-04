export function mapProductFromApi(product: any) {
  return { ...product, image: product.cover_image };
}
export function mapProductToApi(product: any) {
  const { image, ...rest } = product;
  return { ...rest, cover_image: image || null };
}
