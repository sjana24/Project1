// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   images: string[];
//   category: string;
//   specification: string;
//   createdAt: string;
// }

// export interface Service {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   type: string;
//   status: 'Active' | 'Inactive';
//   createdAt: string;
// }

// export interface Request {
//   id: string;
//   customerName: string;
//   customerEmail: string;
//   customerPhone: string;
//   service: string;
//   description: string;
//   status: 'New' | 'In Progress' | 'Completed';
//   createdAt: string;
// }

// export interface Order {
//   id: string;
//   customerName: string;
//   items: string[];
//   total: number;
//   status: 'Pending' | 'Completed';
//   createdAt: string;
// }

// export interface Job {
//   id: string;
//   title: string;
//   description: string;
//   salary: number;
//   expiryDate: string;
//   createdAt: string;
// }

// export interface Message {
//   id: string;
//   sender: string;
//   content: string;
//   timestamp: string;
//   read: boolean;
// }

// export interface Review {
//   id: string;
//   customerName: string;
//   rating: number;
//   comment: string;
//   product?: string;
//   service?: string;
//   createdAt: string;
// }

// export interface Profile {
//   name: string;
//   logo: string;
//   email: string;
//   phone: string;
//   address: string;
//   description: string;
// }

// interface DashboardState {
//   products: Product[];
//   services: Service[];
//   requests: Request[];
//   orders: Order[];
//   jobs: Job[];
//   messages: Message[];
//   reviews: Review[];
//   profile: Profile;
//   notifications: number;
//   darkMode: boolean;
  
//   // Actions
//   addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
//   updateProduct: (id: string, product: Partial<Product>) => void;
//   deleteProduct: (id: string) => void;
  
//   addService: (service: Omit<Service, 'id' | 'createdAt'>) => void;
//   updateService: (id: string, service: Partial<Service>) => void;
//   deleteService: (id: string) => void;
  
//   addRequest: (request: Omit<Request, 'id' | 'createdAt'>) => void;
//   updateRequestStatus: (id: string, status: Request['status']) => void;
  
//   addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
//   updateOrderStatus: (id: string, status: Order['status']) => void;
  
//   addJob: (job: Omit<Job, 'id' | 'createdAt'>) => void;
//   updateJob: (id: string, job: Partial<Job>) => void;
//   deleteJob: (id: string) => void;
  
//   addMessage: (message: Omit<Message, 'id'>) => void;
//   markMessageRead: (id: string) => void;
  
//   updateProfile: (profile: Partial<Profile>) => void;
//   toggleDarkMode: () => void;
//   clearNotifications: () => void;
// }

// export const useDashboardStore = create<DashboardState>()(
//   persist(
//     (set, get) => ({
//       products: [
//         {
//           id: '1',
//           name: 'Monocrystalline Solar Panel 400W',
//           description: 'High-efficiency monocrystalline solar panel with 21% efficiency rating. Perfect for residential installations.',
//           price: 45000,
//           images: [],
//           category: 'Solar Panels',
//           specification: '400W Peak Power, 21% Efficiency, 25 Year Warranty, Weather Resistant',
//           createdAt: new Date().toISOString(),
//         },
//         {
//           id: '2',
//           name: 'Solar Battery System 10kWh',
//           description: 'Lithium-ion battery storage system for storing excess solar energy. Includes smart inverter.',
//           price: 180000,
//           images: [],
//           category: 'Battery Storage',
//           specification: '10kWh Capacity, 10 Year Warranty, Smart Grid Integration, Mobile App Control',
//           createdAt: new Date().toISOString(),
//         },
//         {
//           id: '3',
//           name: 'Hybrid Solar Inverter 5kW',
//           description: 'Advanced hybrid inverter with grid-tie and battery backup capabilities.',
//           price: 85000,
//           images: [],
//           category: 'Inverters',
//           specification: '5kW Output, 95% Efficiency, MPPT Technology, WiFi Monitoring',
//           createdAt: new Date().toISOString(),
//         },
//         {
//           id: '4',
//           name: 'Solar Charge Controller MPPT 60A',
//           description: 'Maximum Power Point Tracking charge controller for optimal battery charging.',
//           price: 15000,
//           images: [],
//           category: 'Controllers',
//           specification: '60A Rating, MPPT Technology, LCD Display, Temperature Compensation',
//           createdAt: new Date().toISOString(),
//         },
//       ],
//       services: [
//         {
//           id: '1',
//           name: 'Residential Solar Installation',
//           description: 'Complete solar panel installation service for homes including design, permits, and installation.',
//           price: 25000,
//           type: 'Installation',
//           status: 'Active',
//           createdAt: new Date().toISOString(),
//         },
//         {
//           id: '2',
//           name: 'Solar System Maintenance',
//           description: 'Annual maintenance service including cleaning, inspection, and performance optimization.',
//           price: 8000,
//           type: 'Maintenance',
//           status: 'Active',
//           createdAt: new Date().toISOString(),
//         },
//         {
//           id: '3',
//           name: 'Solar Panel Repair',
//           description: 'Professional repair service for damaged or underperforming solar panels.',
//           price: 12000,
//           type: 'Repair',
//           status: 'Active',
//           createdAt: new Date().toISOString(),
//         },
//         {
//           id: '4',
//           name: 'Energy Audit & Consultation',
//           description: 'Comprehensive energy assessment and solar system design consultation.',
//           price: 5000,
//           type: 'Consultation',
//           status: 'Active',
//           createdAt: new Date().toISOString(),
//         },
//       ],
//       requests: [
//         {
//           id: '1',
//           customerName: 'Nimal Perera',
//           customerEmail: 'nimal@email.com',
//           customerPhone: '+94 77 123 4567',
//           service: 'Residential Solar Installation',
//           description: 'I need a 5kW solar system for my house in Colombo. Looking for a complete solution with battery backup.',
//           status: 'New',
//           createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
//         },
//         {
//           id: '2',
//           customerName: 'Kamala Silva',
//           customerEmail: 'kamala@email.com',
//           customerPhone: '+94 71 987 6543',
//           service: 'Solar System Maintenance',
//           description: 'My solar panels need cleaning and maintenance. System is 2 years old.',
//           status: 'In Progress',
//           createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
//         },
//         {
//           id: '3',
//           customerName: 'Sunil Fernando',
//           customerEmail: 'sunil@email.com',
//           customerPhone: '+94 76 555 1234',
//           service: 'Energy Audit & Consultation',
//           description: 'I want to understand my energy usage and get recommendations for solar installation.',
//           status: 'Completed',
//           createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
//         },
//       ],
//       orders: [
//         {
//           id: '1',
//           customerName: 'Rajesh Kumar',
//           items: ['Monocrystalline Solar Panel 400W x6', 'Hybrid Solar Inverter 5kW'],
//           total: 355000,
//           status: 'Completed',
//           createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
//         },
//         {
//           id: '2',
//           customerName: 'Priya Jayasinghe',
//           items: ['Solar Battery System 10kWh', 'Solar Charge Controller MPPT 60A'],
//           total: 195000,
//           status: 'Pending',
//           createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
//         },
//         {
//           id: '3',
//           customerName: 'Ananda Wickramasinghe',
//           items: ['Monocrystalline Solar Panel 400W x4', 'Residential Solar Installation'],
//           total: 205000,
//           status: 'Completed',
//           createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
//         },
//       ],
//       jobs: [
//         {
//           id: '1',
//           title: 'Solar Installation Technician',
//           description: 'Experienced solar panel installation technician needed for residential projects. Must have electrical background.',
//           salary: 55000,
//           expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
//           createdAt: new Date().toISOString(),
//         },
//         {
//           id: '2',
//           title: 'Solar Sales Representative',
//           description: 'Sales professional needed to promote solar solutions to residential and commercial customers.',
//           salary: 45000,
//           expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
//           createdAt: new Date().toISOString(),
//         },
//         {
//           id: '3',
//           title: 'Project Manager - Solar Projects',
//           description: 'Manage solar installation projects from planning to completion. Engineering background preferred.',
//           salary: 75000,
//           expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
//           createdAt: new Date().toISOString(),
//         },
//       ],
//       messages: [
//         {
//           id: '1',
//           sender: 'Chamara Rathnayake',
//           content: 'Hello, I received my solar panels yesterday. The installation team was very professional. Thank you!',
//           timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
//           read: false,
//         },
//         {
//           id: '2',
//           sender: 'You',
//           content: 'Thank you for the feedback! We are glad you had a positive experience. Please let us know if you need any assistance.',
//           timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
//           read: true,
//         },
//         {
//           id: '3',
//           sender: 'Malini Jayawardena',
//           content: 'Can you provide a quote for a 3kW solar system for my small business?',
//           timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
//           read: false,
//         },
//         {
//           id: '4',
//           sender: 'SolaX Assistant',
//           content: 'We have received your inquiry. Our team will contact you within 24 hours with a detailed quote.',
//           timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
//           read: false,
//         },
//       ],
//       reviews: [
//         {
//           id: '1',
//           customerName: 'John Silva',
//           rating: 5,
//           comment: 'Excellent solar installation service! Professional team and high-quality equipment.',
//           service: 'Residential Solar Installation',
//           createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
//         },
//         {
//           id: '2',
//           customerName: 'Mary Fernando',
//           rating: 4,
//           comment: 'Great products and professional service. Battery system works perfectly.',
//           product: 'Solar Battery System 10kWh',
//           createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
//         },
//         {
//           id: '3',
//           customerName: 'David Perera',
//           rating: 5,
//           comment: 'Very satisfied with the maintenance service. Panels are working at peak efficiency now.',
//           service: 'Solar System Maintenance',
//           createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
//         },
//         {
//           id: '4',
//           customerName: 'Shalini Wickrama',
//           rating: 4,
//           comment: 'Good quality inverter and excellent customer support during installation.',
//           product: 'Hybrid Solar Inverter 5kW',
//           createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
//         },
//         {
//           id: '5',
//           customerName: 'Rohan Gunasekara',
//           rating: 5,
//           comment: 'Outstanding consultation service. Helped me understand my energy needs perfectly.',
//           service: 'Energy Audit & Consultation',
//           createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
//         },
//       ],
//       profile: {
//         name: 'SolarTech Solutions',
//         logo: '',
//         email: 'info@solartech.lk',
//         phone: '+94 77 123 4567',
//         address: 'Colombo 03, Sri Lanka',
//         description: 'Leading solar energy solutions provider in Sri Lanka with over 5 years of experience',
//       },
//       notifications: 5,
//       darkMode: false,

//       addProduct: (product) => set((state) => ({
//         products: [...state.products, {
//           ...product,
//           id: Date.now().toString(),
//           createdAt: new Date().toISOString(),
//         }],
//         notifications: state.notifications + 1,
//       })),

//       updateProduct: (id, product) => set((state) => ({
//         products: state.products.map((p) => p.id === id ? { ...p, ...product } : p),
//       })),

//       deleteProduct: (id) => set((state) => ({
//         products: state.products.filter((p) => p.id !== id),
//       })),

//       addService: (service) => set((state) => ({
//         services: [...state.services, {
//           ...service,
//           id: Date.now().toString(),
//           createdAt: new Date().toISOString(),
//         }],
//         notifications: state.notifications + 1,
//       })),

//       updateService: (id, service) => set((state) => ({
//         services: state.services.map((s) => s.id === id ? { ...s, ...service } : s),
//       })),

//       deleteService: (id) => set((state) => ({
//         services: state.services.filter((s) => s.id !== id),
//       })),

//       addRequest: (request) => set((state) => ({
//         requests: [...state.requests, {
//           ...request,
//           id: Date.now().toString(),
//           createdAt: new Date().toISOString(),
//         }],
//         notifications: state.notifications + 1,
//       })),

//       updateRequestStatus: (id, status) => set((state) => ({
//         requests: state.requests.map((r) => r.id === id ? { ...r, status } : r),
//       })),

//       addOrder: (order) => set((state) => ({
//         orders: [...state.orders, {
//           ...order,
//           id: Date.now().toString(),
//           createdAt: new Date().toISOString(),
//         }],
//         notifications: state.notifications + 1,
//       })),

//       updateOrderStatus: (id, status) => set((state) => ({
//         orders: state.orders.map((o) => o.id === id ? { ...o, status } : o),
//       })),

//       addJob: (job) => set((state) => ({
//         jobs: [...state.jobs, {
//           ...job,
//           id: Date.now().toString(),
//           createdAt: new Date().toISOString(),
//         }],
//       })),

//       updateJob: (id, job) => set((state) => ({
//         jobs: state.jobs.map((j) => j.id === id ? { ...j, ...job } : j),
//       })),

//       deleteJob: (id) => set((state) => ({
//         jobs: state.jobs.filter((j) => j.id !== id),
//       })),

//       addMessage: (message) => set((state) => ({
//         messages: [...state.messages, {
//           ...message,
//           id: Date.now().toString(),
//         }],
//         notifications: state.notifications + 1,
//       })),

//       markMessageRead: (id) => set((state) => ({
//         messages: state.messages.map((m) => m.id === id ? { ...m, read: true } : m),
//       })),

//       updateProfile: (profile) => set((state) => ({
//         profile: { ...state.profile, ...profile },
//       })),

//       toggleDarkMode: () => set((state) => ({
//         darkMode: !state.darkMode,
//       })),

//       clearNotifications: () => set(() => ({
//         notifications: 0,
//       })),
//     }),
//     {
//       name: 'dashboard-storage',
//     }
//   )
// );
