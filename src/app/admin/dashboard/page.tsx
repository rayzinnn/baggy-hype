import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { dayKey, parseLocalDateRange } from "@/lib/date-range";
import { prisma } from "@/lib/prisma";
import { CheckCircle2, Clock3, DollarSign, MousePointerClick, Package, ShoppingCart, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

type DashboardSearchParams = {
  from?: string;
  to?: string;
  metric?: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatShortValue(value: number, metric: string) {
  if (metric === "revenue") return formatCurrency(value);
  if (metric === "conversion") return `${value.toFixed(1)}%`;
  return new Intl.NumberFormat("pt-BR").format(value);
}

function buildDays(from: Date, to: Date) {
  const days: Date[] = [];
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(0, 0, 0, 0);
  while (cursor <= end) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function linePath(values: number[], max: number, width = 760, height = 240, pad = 26) {
  if (values.length === 0) return "";
  const innerWidth = width - pad * 2;
  const innerHeight = height - pad * 2;
  return values
    .map((value, index) => {
      const x = values.length === 1 ? width / 2 : pad + (index / (values.length - 1)) * innerWidth;
      const y = height - pad - (value / max) * innerHeight;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<DashboardSearchParams> }) {
  const params = await searchParams;
  const metric = params.metric || "revenue";
  const range = parseLocalDateRange(params.from, params.to, 30);
  const dateWhere = { createdAt: { gte: range.from, lte: range.to } };

  const [productCount, orders, cartEvents, whatsappEvents] = await Promise.all([
    prisma.product.count(),
    prisma.order.findMany({ where: dateWhere, orderBy: { createdAt: "asc" } }),
    prisma.analyticsEvent.findMany({ where: { eventType: "CART_ADD", ...dateWhere } }),
    prisma.analyticsEvent.findMany({ where: { eventType: "WHATSAPP_CHECKOUT", ...dateWhere } }),
  ]);

  const paidOrders = orders.filter((order) => order.status === "PAID" || order.status === "DELIVERED");
  const pendingOrders = orders.filter((order) => order.status === "PENDING");
  const revenue = paidOrders.reduce((sum, order) => sum + Number(order.total), 0);
  const averageTicket = paidOrders.length > 0 ? revenue / paidOrders.length : 0;
  const conversion = whatsappEvents.length > 0 ? (paidOrders.length / whatsappEvents.length) * 100 : 0;
  const abandonedCarts = Math.max(cartEvents.length - whatsappEvents.length, 0);

  const metricLabels: Record<string, string> = {
    carts: "Carrinhos",
    whatsapp: "Cliques WhatsApp",
    sales: "Vendas",
    revenue: "Faturamento",
    conversion: "Conversao",
  };
  const selectedMetric = metricLabels[metric] ? metric : "revenue";
  const days = buildDays(range.from, range.to);
  const chartMap = new Map(days.map((day) => [dayKey(day), 0]));
  const comparisonMap = new Map(days.map((day) => [dayKey(day), 0]));
  for (const event of cartEvents) {
    if (selectedMetric === "carts") chartMap.set(dayKey(event.createdAt), (chartMap.get(dayKey(event.createdAt)) || 0) + 1);
    if (selectedMetric === "conversion") comparisonMap.set(dayKey(event.createdAt), (comparisonMap.get(dayKey(event.createdAt)) || 0) + 1);
  }
  for (const event of whatsappEvents) {
    if (selectedMetric === "whatsapp") chartMap.set(dayKey(event.createdAt), (chartMap.get(dayKey(event.createdAt)) || 0) + 1);
    if (selectedMetric === "conversion") chartMap.set(dayKey(event.createdAt), (chartMap.get(dayKey(event.createdAt)) || 0) + 1);
  }
  for (const order of paidOrders) {
    if (selectedMetric === "sales") chartMap.set(dayKey(order.createdAt), (chartMap.get(dayKey(order.createdAt)) || 0) + 1);
    if (selectedMetric === "revenue") chartMap.set(dayKey(order.createdAt), (chartMap.get(dayKey(order.createdAt)) || 0) + Number(order.total));
  }
  const chartData = [...chartMap.entries()].sort(([a], [b]) => a.localeCompare(b));
  const comparisonData = [...comparisonMap.entries()].sort(([a], [b]) => a.localeCompare(b));
  const displayValues =
    selectedMetric === "conversion"
      ? chartData.map(([date, whatsapp]) => {
          const carts = comparisonMap.get(date) || 0;
          return carts > 0 ? (whatsapp / carts) * 100 : 0;
        })
      : chartData.map(([, value]) => value);
  const comparisonValues =
    selectedMetric === "conversion"
      ? comparisonData.map(() => 100)
      : chartData.map(([date]) => comparisonMap.get(date) || 0);
  const maxChartValue = Math.max(...displayValues, ...comparisonValues, selectedMetric === "conversion" ? 100 : 1);
  const primaryPath = linePath(displayValues, maxChartValue);
  const secondaryPath = linePath(comparisonValues, maxChartValue);
  const areaPath = primaryPath ? `${primaryPath} L 734 214 L 26 214 Z` : "";
  const activeIndex = displayValues.reduce((best, value, index, array) => (value >= array[best] ? index : best), 0);
  const activeDate = chartData[activeIndex]?.[0] || range.toValue;
  const activeValue = displayValues[activeIndex] || 0;

  const stats = [
    { name: "Carrinhos", value: cartEvents.length, hint: `${abandonedCarts} sem checkout`, icon: ShoppingCart, color: "text-blue-400" },
    { name: "Cliques WhatsApp", value: whatsappEvents.length, hint: "checkout iniciado", icon: MousePointerClick, color: "text-primary" },
    { name: "Vendas pagas", value: paidOrders.length, hint: `${pendingOrders.length} intencoes abertas`, icon: CheckCircle2, color: "text-green-500" },
    { name: "Faturamento", value: formatCurrency(revenue), hint: `ticket ${formatCurrency(averageTicket)}`, icon: DollarSign, color: "text-green-400" },
    { name: "Conversao WA", value: `${conversion.toFixed(1)}%`, hint: "vendas / cliques", icon: TrendingUp, color: "text-white" },
    { name: "Produtos", value: productCount, hint: "catalogo ativo", icon: Package, color: "text-primary" },
    { name: "Pendentes", value: pendingOrders.length, hint: "sem pagamento confirmado", icon: Clock3, color: "text-orange-300" },
  ];

  return (
    <div className="flex flex-col gap-8 py-4">
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Dashboard <span className="text-primary italic">geral</span></h2>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Resumo do funil (carrinho, WhatsApp e vendas)</p>
        </div>
        <DateRangeFilter action="/admin/dashboard" from={range.fromValue} to={range.toValue} extra={{ metric: selectedMetric }} />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-surface p-5 md:p-6 rounded-3xl border border-white/5 flex items-center gap-4 shadow-xl min-h-28">
            <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 grid place-items-center shrink-0">
              <stat.icon size={19} className={stat.color} />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-[10px] font-black uppercase text-white/45 tracking-widest">{stat.name}</span>
              <span className="text-2xl md:text-3xl font-black italic tracking-tighter text-white truncate">{stat.value}</span>
              <span className="text-[9px] font-bold uppercase text-white/25 tracking-widest">{stat.hint}</span>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-surface rounded-3xl border border-white/5 p-5 md:p-8 flex flex-col gap-7 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Performance</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">{metricLabels[selectedMetric]} no periodo selecionado</p>
          </div>
          <form action="/admin/dashboard" className="flex flex-wrap gap-2">
            <input type="hidden" name="from" value={range.fromValue} />
            <input type="hidden" name="to" value={range.toValue} />
            {Object.entries(metricLabels).map(([key, label]) => (
              <button key={key} name="metric" value={key} className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedMetric === key ? "bg-primary text-black" : "bg-black/50 text-white/40 hover:text-white"}`}>
                {label}
              </button>
            ))}
          </form>
        </div>
        <div className="overflow-x-auto">
          <div className="relative min-w-[760px] h-[300px] rounded-[1.75rem] bg-black/25 border border-white/5 px-4 py-3">
            <svg viewBox="0 0 760 260" className="h-full w-full" role="img" aria-label={`Grafico de ${metricLabels[selectedMetric]}`}>
              {[0, 1, 2, 3].map((tick) => {
                const y = 214 - tick * 62;
                return (
                  <g key={tick}>
                    <line x1="26" y1={y} x2="734" y2={y} stroke="rgba(255,255,255,0.07)" />
                    <text x="0" y={y + 4} fill="rgba(255,255,255,0.28)" fontSize="10" fontWeight="700">{formatShortValue((maxChartValue / 3) * tick, selectedMetric)}</text>
                  </g>
                );
              })}
              {areaPath && <path d={areaPath} fill="url(#chartArea)" opacity="0.32" />}
              <defs>
                <linearGradient id="chartArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
                </linearGradient>
              </defs>
              {secondaryPath && <path d={secondaryPath} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 7" />}
              {primaryPath && <path d={primaryPath} fill="none" stroke="#facc15" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />}
              {displayValues.map((value, index) => {
                const x = displayValues.length === 1 ? 380 : 26 + (index / (displayValues.length - 1)) * 708;
                const y = 214 - (value / maxChartValue) * 188;
                return (
                  <g key={chartData[index]?.[0] || index}>
                    <circle cx={x} cy={y} r={index === activeIndex ? 5 : 3} fill={index === activeIndex ? "#ffffff" : "#facc15"} stroke="#facc15" strokeWidth="2" />
                    <title>{`${chartData[index]?.[0]}: ${formatShortValue(value, selectedMetric)}`}</title>
                  </g>
                );
              })}
              {chartData.map(([date], index) => {
                if (chartData.length > 12 && index % Math.ceil(chartData.length / 8) !== 0 && index !== chartData.length - 1) return null;
                const x = chartData.length === 1 ? 380 : 26 + (index / (chartData.length - 1)) * 708;
                return <text key={date} x={x} y="248" textAnchor="middle" fill="rgba(255,255,255,0.34)" fontSize="10" fontWeight="800">{date.slice(5)}</text>;
              })}
            </svg>
            <div className="absolute left-1/2 top-11 -translate-x-1/2 rounded-2xl bg-white text-black px-5 py-4 shadow-2xl min-w-48">
              <p className="text-[10px] font-black uppercase tracking-widest">{new Date(`${activeDate}T00:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</p>
              <div className="mt-2 flex items-center justify-between gap-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/45">{metricLabels[selectedMetric]}</span>
                <strong className="text-sm font-black">{formatShortValue(activeValue, selectedMetric)}</strong>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-black/40">
                <span className="h-1.5 w-5 rounded-full bg-primary" />
                Linha principal
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
