export type ShipmentStatus = "planned" | "in-transit" | "completed";

export interface Shipment {
  id: string;
  driver: string;
  vehicle: string;
  fromAddress: string;
  toAddress: string;
  price: number;
  loaderCount: number;
  status: ShipmentStatus;
  loadingTime?: string;
  unloadingTime?: string;
  notes?: string;
  photos?: string[];
  createdAt: string;
}

export interface Driver {
  id: string;
  name: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
}

export const drivers: Driver[] = [
  { id: "1", name: "Иван Петров" },
  { id: "2", name: "Сергей Иванов" },
  { id: "3", name: "Дмитрий Смирнов" },
  { id: "4", name: "Александр Козлов" },
  { id: "5", name: "Михаил Новиков" },
];

export const vehicles: Vehicle[] = [
  { id: "1", plateNumber: "А123БВ777", model: "Mercedes Actros" },
  { id: "2", plateNumber: "В456ГД199", model: "Volvo FH16" },
  { id: "3", plateNumber: "С789ЕЖ777", model: "MAN TGX" },
  { id: "4", plateNumber: "Д012ЗИ199", model: "Scania R500" },
  { id: "5", plateNumber: "Е345КЛ777", model: "DAF XF" },
];

let shipmentsData: Shipment[] = [
  {
    id: "1",
    driver: "Иван Петров",
    vehicle: "А123БВ777 - Mercedes Actros",
    fromAddress: "Москва, ул. Ленина, 15",
    toAddress: "Санкт-Петербург, Невский пр., 28",
    price: 45000,
    loaderCount: 2,
    status: "in-transit",
    loadingTime: "2024-01-15T08:00",
    unloadingTime: "2024-01-15T16:00",
    notes: "Хрупкий груз, требуется аккуратная погрузка",
    createdAt: "2024-01-15T07:30:00",
  },
  {
    id: "2",
    driver: "Сергей Иванов",
    vehicle: "В456ГД199 - Volvo FH16",
    fromAddress: "Казань, ул. Баумана, 42",
    toAddress: "Нижний Новгород, пр. Гагарина, 100",
    price: 28000,
    loaderCount: 3,
    status: "completed",
    loadingTime: "2024-01-14T09:00",
    unloadingTime: "2024-01-14T14:00",
    notes: "Доставка выполнена в срок",
    createdAt: "2024-01-14T08:00:00",
  },
  {
    id: "3",
    driver: "Дмитрий Смирнов",
    vehicle: "С789ЕЖ777 - MAN TGX",
    fromAddress: "Екатеринбург, ул. Малышева, 51",
    toAddress: "Челябинск, ул. Кирова, 161",
    price: 22000,
    loaderCount: 2,
    status: "planned",
    loadingTime: "2024-01-16T10:00",
    unloadingTime: "2024-01-16T15:00",
    createdAt: "2024-01-15T10:00:00",
  },
  {
    id: "4",
    driver: "Александр Козлов",
    vehicle: "Д012ЗИ199 - Scania R500",
    fromAddress: "Новосибирск, Красный пр., 35",
    toAddress: "Омск, ул. Ленина, 12",
    price: 35000,
    loaderCount: 4,
    status: "in-transit",
    loadingTime: "2024-01-15T07:00",
    unloadingTime: "2024-01-15T18:00",
    notes: "Тяжелое оборудование",
    createdAt: "2024-01-15T06:30:00",
  },
  {
    id: "5",
    driver: "Михаил Новиков",
    vehicle: "Е345КЛ777 - DAF XF",
    fromAddress: "Ростов-на-Дону, пр. Буденновский, 80",
    toAddress: "Краснодар, ул. Красная, 122",
    price: 18000,
    loaderCount: 1,
    status: "completed",
    loadingTime: "2024-01-13T11:00",
    unloadingTime: "2024-01-13T16:00",
    createdAt: "2024-01-13T10:00:00",
  },
];

export const mockShipments = shipmentsData;

export const getShipments = () => shipmentsData;

export const getShipmentById = (id: string) => shipmentsData.find(s => s.id === id);

export const updateShipment = (id: string, updates: Partial<Shipment>) => {
  const index = shipmentsData.findIndex(s => s.id === id);
  if (index !== -1) {
    shipmentsData[index] = { ...shipmentsData[index], ...updates };
  }
};

export const deleteShipment = (id: string) => {
  shipmentsData = shipmentsData.filter(s => s.id !== id);
};

export const addShipment = (shipment: Shipment) => {
  shipmentsData.push(shipment);
};
