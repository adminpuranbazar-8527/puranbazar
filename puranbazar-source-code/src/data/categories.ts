import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'mobile',
    name: 'মোবাইল ও ট্যাব',
    englishName: 'Mobile & Tablets',
    icon: 'Smartphone',
    subcategories: ['Smartphone', 'Feature Phone', 'Tablet', 'Accessories']
  },
  {
    id: 'computer',
    name: 'কম্পিউটার',
    englishName: 'Computers',
    icon: 'Laptop',
    subcategories: ['Laptop', 'Desktop', 'Monitor', 'Printer', 'Components']
  },
  {
    id: 'electronics',
    name: 'ইলেকট্রনিক্স',
    englishName: 'Electronics',
    icon: 'Tv',
    subcategories: ['TV', 'Refrigerator', 'AC', 'Camera', 'Speaker', 'অন্যান্য']
  },
  {
    id: 'vehicles',
    name: 'যানবাহন',
    englishName: 'Vehicles',
    icon: 'Bike',
    subcategories: ['Motorcycle', 'Bicycle', 'Car', 'অন্যান্য']
  },
  {
    id: 'furniture',
    name: 'Home & Furniture',
    englishName: 'Home & Furniture',
    icon: 'Armchair',
    subcategories: ['Sofa', 'Bed', 'Table', 'Chair', 'আলমারি', 'অন্যান্য']
  },
  {
    id: 'fashion',
    name: 'Fashion',
    englishName: 'Fashion',
    icon: 'Shirt',
    subcategories: ['জামা-কাপড়', 'জুতা', 'ব্যাগ', 'ঘড়ি', 'অন্যান্য']
  },
  {
    id: 'others',
    name: 'অন্যান্য',
    englishName: 'Others',
    icon: 'Wrench',
    subcategories: ['বই', 'Sports items', 'Musical instruments', 'Tools', 'অন্যান্য']
  }
];

export const CONDITION_LABELS: Record<string, string> = {
  like_new: 'ব্যবহৃত - নতুনের মতো',
  good: 'ব্যবহৃত - ভালো',
  fair: 'ব্যবহৃত - মোটামুটি',
  refurbished: 'রিফার্বিশড'
};
