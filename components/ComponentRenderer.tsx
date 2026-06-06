import { AIComponent } from "@/types";
import WeatherCard      from "./WeatherCard";
import StockCard        from "./StockCard";
import CalculatorWidget from "./CalculatorWidget";
import DashboardWidget  from "./DashboardWidget";
import TableWidget      from "./TableWidget";
import CardWidget       from "./CardWidget";

interface Props {
  comp: AIComponent;
}

export function getAiReply(comp: AIComponent): string {
  switch (comp.component) {
    case "weather":    return `🔴 Live weather for ${comp.data?.location || "your location"} loaded!`;
    case "stock":      return `📈 ${comp.data?.symbol || "stock"} price shown!`;
    case "calculator": return "🧮 Calculator is ready!";
    case "dashboard":  return "📊 Dashboard rendered!";
    case "table":      return "⊞ Table generated!";
    case "card":       return "💳 Product card ready!";
    default:           return comp.data?.message || "Done!";
  }
}

export default function ComponentRenderer({ comp }: Props) {
  switch (comp.component) {
    case "weather":
      // @ts-ignore — skip type check for now
      return <WeatherCard {...(comp.data || {})} />;
    case "stock":
      // @ts-ignore
      return <StockCard {...(comp.data || {})} />;
    case "calculator":
      return <CalculatorWidget />;
    case "dashboard":
      return <DashboardWidget {...(comp.data || {})} />;
    case "table":
      return <TableWidget {...(comp.data || {})} />;
    case "card":
      return <CardWidget {...(comp.data || {})} />;
    case "chat":
      return (
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 16, padding: 18 }}>
          <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.7 }}>{comp.data?.message || "No message"}</p>
        </div>
      );
    default:
      return null;
  }
}