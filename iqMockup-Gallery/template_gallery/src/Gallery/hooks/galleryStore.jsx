import {create} from 'zustand'



export const useGalleryStore = create((set) => ({
    images: [
        'https://via.placeholder.com/150/0000FF/808080?text=Sign+1',
        'https://via.placeholder.com/150/FF0000/FFFFFF?text=Sign+2',
        'https://via.placeholder.com/150/00FF00/000000?text=Sign+3',
    ],
    addImage: (newImage) =>
        set((state) => ({ images: [...state.images, newImage] })),
}));