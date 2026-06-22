export default async function Vanntemperatur() {
  const res = await fetch(
    "https://api.met.no/weatherapi/oceanforecast/2.0/complete?lat=59.9&lon=10.7",
    { headers: { "User-Agent": "Aimee Hong aimee@hong.as" } }
  );
  const data = await res.json();
  
  const temp = data.properties.timeseries[0].data.instant.details.sea_water_temperature;

  return (
    <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400 mt-6">
      Vanntemperatur i Oslofjorden: {temp}°C
    </p>
  );
}