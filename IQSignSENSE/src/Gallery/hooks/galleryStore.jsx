import { create } from 'zustand';

export const useGalleryStore = create((set) => ({
    images: [
        'https://placehold.co/100x150/0000FF/808080?text=Sign+1',
        'https://placehold.co/100x150/FF0000/FFFFFF?text=Sign+2',
        'https://placehold.co/100x150/00FF00/000000?text=Sign+3',
    ],
    addImage: (newImage) =>
        set((state) => ({ images: [...state.images, newImage] })),
}));
