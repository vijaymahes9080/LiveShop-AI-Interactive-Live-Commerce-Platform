export const visualPresets = [
  {
    id: "preset-1",
    name: "Urban Streetwear Outfit",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
    objects: [
      {
        id: "obj-1",
        label: "Hooded Sweatshirt",
        box: { x: 25, y: 15, w: 50, h: 45 }, // Percentages for canvas positioning
        productId: "fashion-1",
        confidence: 0.98
      },
      {
        id: "obj-2",
        label: "Denim Apparel",
        box: { x: 30, y: 55, w: 40, h: 30 },
        productId: "fashion-2",
        confidence: 0.91
      }
    ]
  },
  {
    id: "preset-2",
    name: "Modern Coding Desk Setup",
    imageUrl: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80",
    objects: [
      {
        id: "obj-3",
        label: "Developer Laptop",
        box: { x: 15, y: 35, w: 55, h: 50 },
        productId: "tech-1",
        confidence: 0.99
      },
      {
        id: "obj-4",
        label: "Ambient Lightbar",
        box: { x: 75, y: 10, w: 20, h: 65 },
        productId: "tech-4",
        confidence: 0.94
      }
    ]
  },
  {
    id: "preset-3",
    name: "Beauty & Wellness Counter",
    imageUrl: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&auto=format&fit=crop&q=80",
    objects: [
      {
        id: "obj-5",
        label: "Vitamin C Serum",
        box: { x: 35, y: 15, w: 30, h: 50 },
        productId: "beauty-1",
        confidence: 0.97
      },
      {
        id: "obj-6",
        label: "Glass Tea Infuser",
        box: { x: 10, y: 20, w: 25, h: 65 },
        productId: "home-3",
        confidence: 0.88
      }
    ]
  }
];

// Helper to simulate drag & drop detection
export function processImageUpload(fileName) {
  // Return random items based on words in filename or random category
  const randomPreset = visualPresets[Math.floor(Math.random() * visualPresets.length)];
  return {
    ...randomPreset,
    name: `Detected: ${fileName}`,
    confidence: 0.92
  };
}
