import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function fetchWeather(location: string) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`
    );
    const d = await res.json();
    if (d.cod !== 200) return null;
    return {
      location: `${d.name}, ${d.sys.country}`,
      temperature: Math.round(d.main.temp),
      feels_like: Math.round(d.main.feels_like),
      conditions: d.weather[0].description.charAt(0).toUpperCase() + d.weather[0].description.slice(1),
      humidity: d.main.humidity,
      wind: Math.round(d.wind.speed * 3.6),
      icon: d.weather[0].main,
      high: Math.round(d.main.temp_max),
      low: Math.round(d.main.temp_min),
      pressure: d.main.pressure,
      visibility: Math.round((d.visibility || 10000) / 1000),
    };
  } catch { return null; }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;
    const lastMessage = messages[messages.length - 1]?.content || "";

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `Return ONLY valid JSON.
          - weather → {"component":"weather","data":{"location":"CITY_NAME"}}
          - stock → {"component":"stock","data":{"symbol":"AAPL","price":175.50,"change":2.5,"high":178,"low":172,"volume":"45M"}}
          - calculator → {"component":"calculator","data":{}}
          - dashboard → {"component":"dashboard","data":{"title":"Sales","items":[{"label":"Jan","value":65},{"label":"Feb","value":45},{"label":"Mar","value":80}]}}
          - card → {"component":"card","data":{"title":"Product","price":"$99","description":"Description","badge":"New"}}
          - table → {"component":"table","data":{"title":"Table","columns":["Name","Value"],"rows":[["Item 1","$100"],["Item 2","$200"]]}}
          - else → {"component":"chat","data":{"message":"response here"}}`
        },
        { role: "user", content: lastMessage }
      ],
      temperature: 0.2,
    });

    const aiResponse = completion.choices[0]?.message?.content || "";
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ component: "chat", data: { message: aiResponse } });

    const result = JSON.parse(jsonMatch[0]);

    if (result.component === "weather") {
      const location = result.data?.location || "Mumbai";
      const liveData = await fetchWeather(location);
      if (liveData) return NextResponse.json({ component: "weather", data: liveData });
      return NextResponse.json({ component: "chat", data: { message: "City nahi mili. Sahi city name likho." } });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ component: "chat", data: { message: "Something went wrong." } });
  }
}
