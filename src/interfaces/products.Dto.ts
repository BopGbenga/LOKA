export interface CreateProductDto {
  name: string;
  description: string;
  price: string;
  stockQuantity: number;
  categoryId: number;
  images: string;
  availability: boolean;
}
