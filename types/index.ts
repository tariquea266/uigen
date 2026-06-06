export type ComponentType =
  | "weather"
  | "stock"
  | "calculator"
  | "dashboard"
  | "table"
  | "card"
  | "chat";

export interface AIComponent {
  component: ComponentType;
  data?: Record<string, any>;
}

export interface Message {
  role: "user" | "ai";
  text: string;
  component?: AIComponent;
}

export interface Suggestion {
  icon: string;
  label: string;
  cmd: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  feels_like: number;
  conditions: string;
  humidity: number;
  wind: number;
  icon?: string;
  high: number;
  low: number;
  pressure: number;
  visibility: number;
}

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  high: number;
  low: number;
  volume: string;
}

export interface DashboardItem {
  label: string;
  value: number;
}

export interface DashboardData {
  title?: string;
  items?: DashboardItem[];
}

export interface TableData {
  title?: string;
  columns?: string[];
  rows?: string[][];
}

export interface CardData {
  title?: string;
  price?: string;
  description?: string;
  badge?: string;
}
