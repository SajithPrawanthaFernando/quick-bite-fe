import { apiService } from './api.service';

export interface ImageGenerationRequest {
  prompt: string;
  n?: number;
  size?: string;
  type?: 'restaurant' | 'menu-item';
}

export interface ImageGenerationResponse {
  imageUrl: string;
}

export const imageService = {
  generateImage: (data: ImageGenerationRequest) =>
    apiService.post<{ url: string }>('/images/generate', data),

  getDefaultRestaurantImage: (cuisine: string) => {
    // Default images based on cuisine type
    const defaultImages: { [key: string]: string } = {
      'Italian': 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b',
      'Indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
      'Chinese': 'https://images.unsplash.com/photo-1525755662778-989d0524087e',
      'Japanese': 'https://images.unsplash.com/photo-1553621042-f6e147245754',
      'Mexican': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47',
      'default': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
    };

    return defaultImages[cuisine] || defaultImages.default;
  },

  getDefaultMenuItemImage: (category: string) => {
    // Default images based on menu item category
    const defaultImages: { [key: string]: string } = {
      'appetizer': 'https://images.unsplash.com/photo-1541529086526-db283c563270',
      'main': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      'dessert': 'https://images.unsplash.com/photo-1551024506-0bccd828d307',
      'beverage': 'https://images.unsplash.com/photo-1544145945-f90425340c7e',
      'default': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    };

    return defaultImages[category] || defaultImages.default;
  }
}; 