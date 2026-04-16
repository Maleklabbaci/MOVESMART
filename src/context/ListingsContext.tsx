import React, { createContext, useContext, useState } from 'react';
import { listings as initialListings } from '../data/listings';

export interface Listing {
  id: number;
  title: string;
  type: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  area: number;
  images: string[];
  description?: string;
  featured?: boolean;
}

interface ListingsContextType {
  listings: Listing[];
  addListing: (listing: Omit<Listing, 'id'>) => void;
  updateListing: (id: number, listing: Partial<Listing>) => void;
  deleteListing: (id: number) => void;
}

const ListingsContext = createContext<ListingsContextType | null>(null);

export function ListingsProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(initialListings);

  const addListing = (listing: Omit<Listing, 'id'>) => {
    const newId = Math.max(...listings.map(l => l.id), 0) + 1;
    setListings(prev => [...prev, { ...listing, id: newId }]);
  };

  const updateListing = (id: number, data: Partial<Listing>) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const deleteListing = (id: number) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  return (
    <ListingsContext.Provider value={{ listings, addListing, updateListing, deleteListing }}>
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error('useListings must be used within ListingsProvider');
  return ctx;
}
