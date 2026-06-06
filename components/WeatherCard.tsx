import { WeatherData } from "@/types";

function getWeatherIcon(icon?: string): string {
  if (!icon) return "☀️";
  const i = icon.toLowerCase();
  if (i.includes("rain") || i.includes("drizzle")) return "🌧️";
  if (i.includes("thunder")) return "⛈️";
  if (i.includes("snow")) return "❄️";
  if (i.includes("cloud")) return "☁️";
  if (i.includes("mist") || i.includes("fog") || i.includes("haze")) return "🌫️";
  return "☀️";
}

function getWeatherBg(icon?: string): string {
  if (!icon) return "#1a6fba";
  const i = icon.toLowerCase();
  if (i.includes("rain") || i.includes("thunder")) return "#2c3e50";
  if (i.includes("cloud")) return "#4a5568";
  return "#1a6fba";
}

export default function WeatherCard({
  location, temperature, feels_like, conditions,
  humidity, wind, icon, high, low, pressure, visibility,
}: WeatherData) {
  const stats = [
    ["💧", "Humidity", `${humidity}%`],
    ["💨", "Wind", `${wind}km/h`],
    ["🌡️", "Pressure", `${pressure}`],
    ["👁️", "Visibility", `${visibility}km`],
  ];

  return (
    <div style={{ background: getWeatherBg(icon), borderRadius: 20, padding: "20px", color: "white", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 150, height: 150, background: "rgba(255,255,255,0.08)", borderRadius: "50%" }} />
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <p style={{ fontSize: 10, opacity: 0.7, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>🔴 LIVE · Weather</p>
            <h3 style={{ fontSize: 17, fontWeight: 700 }}>📍 {location}</h3>
          </div>
          <div style={{ fontSize: 44, lineHeight: 1 }}>{getWeatherIcon(icon)}</div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, margin: "12px 0" }}>
          <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1 }}>{temperature}°</div>
          <div style={{ paddingBottom: 8 }}>
            <p style={{ fontSize: 12, opacity: 0.8 }}>Feels {feels_like}°C</p>
            <p style={{ fontSize: 14, fontWeight: 600 }}>{conditions}</p>
            <p style={{ fontSize: 12, opacity: 0.8 }}>↑ {high}° ↓ {low}°</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 12 }}>
          {stats.map(([emoji, label, val]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, marginBottom: 2 }}>{emoji}</div>
              <p style={{ fontSize: 9, opacity: 0.6, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</p>
              <p style={{ fontSize: 12, fontWeight: 700 }}>{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
