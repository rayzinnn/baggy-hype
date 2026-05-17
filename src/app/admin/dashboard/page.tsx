import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { dayKey, parseLocalDateRange } from "@/lib/date-range";
import { prisma } from "@/lib/prisma";
import { DollarSign, MousePointerClick, Package, ShoppingBag, ShoppingCart, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

type DashboardSearchParams = {
  from?: string;
  to?: string;
  metric?: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
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
  };
  const chartMap = new Map<string, number>();
  for (const event of cartEvents) if (metric === "carts") chartMap.set(dayKey(event.createdAt), (chartMap.get(dayKey(event.createdAt)) || 0) + 1);
  for (const event of whatsappEvents) if (metric === "whatsapp") chartMap.set(dayKey(event.createdAt), (chartMap.get(dayKey(event.createdAt)) || 0) + 1);
  for (const order of paidOrders) {
    if (metric === "sales") chartMap.set(dayKey(order.createdAt), (chartMap.get(dayKey(order.createdAt)) || 0) + 1);
    if (metric === "revenue") chartMap.set(dayKey(order.createdAt), (chartMap.get(dayKey(order.createdAt)) || 0) + Number(order.total));
  }
  const chartData = [...chartMap.entries()].sort(([a], [b]) => a.localeCompare(b));
  const maxChartValue = Math.max(...chartData.map(([, value]) => value), 1);

  const stats = [
    { name: "Carrinhos", value: cartEvents.length, hint: `${abandonedCarts} sem checkout`, icon: ShoppingCart, color: "text-blue-400" },
    { name: "Cliques WhatsApp", value: whatsappEvents.length, hint: "checkout iniciado", icon: MousePointerClick, color: "text-primary" },
    { name: "Vendas", value: paidOrders.length, hint: `${pendingOrders.length} pendentes`, icon: ShoppingBag, color: "text-green-500" },
    { name: "Faturamento", value: formatCurrency(revenue), hint: `ticket ${formatCurrency(averageTicket)}`, icon: DollarSign, color: "text-green-400" },
    { name: "Conversao WA", value: `${conversion.toFixed(1)}%`, hint: "vendas / cliques", icon: TrendingUp, color: "text-white" },
    { name: "Produtos", value: productCount, hint: "catalogo ativo", icon: Package, color: "text-primary" },
  ];

  return (
    <div className="flex flex-col gap-8 py-4">
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Dashboard <span className="text-primary italic">Overview</span></h2>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Dados reais do funil Baggy Hype</p>
        </div>
        <DateRangeFilter action="/admin/dashboard" from={range.fromValue} to={range.toValue} extra={{ metric }} />
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-surface p-4 md:p-6 rounded-3xl border border-white/5 flex flex-col gap-4 shadow-xl min-h-32 md:min-h-36">
            <stat.icon size={20} className={stat.color} />
            <div className="flex flex-col mt-auto">
              <span className="text-2xl md:text-3xl font-black italic tracking-tighter">{stat.value}</span>
              <span className="text-[9px] font-bold uppercase text-white/40 tracking-widest mt-1">{stat.name}</span>
              <span className="text-[9px] font-bold uppercase text-white/20 tracking-widest mt-2">{stat.hint}</span>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-surface rounded-3xl border border-white/5 p-5 md:p-8 flex flex-col gap-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Grafico de metricas</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">{metricLabels[metric]}</p>
          </div>
          <form action="/admin/dashboard" className="flex flex-wrap gap-2">
            <input type="hidden" name="from" value={range.fromValue} />
            <input type="hidden" name="to" value={range.toValue} />
            {Object.entries(metricLabels).map(([key, label]) => (
              <button key={key} name="metric" value={key} className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${metric === key ? "bg-primary text-black" : "bg-black/50 text-white/40 hover:text-white"}`}>
                {label}
              </button>
            ))}
          </form>
        </div>
        <div className="h-72 overflow-x-auto">
          <div className="min-w-[560px] h-full flex items-end gap-3 border-l border-b border-white/10 px-4 pt-4">
          {chartData.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-white/20">Sem dados no periodo.</div>
          ) : (
            chartData.map(([date, value]) => (
              <div key={date} className="flex-1 min-w-6 flex flex-col items-center gap-2">
                <div className="w-full rounded-t-xl bg-primary/80 hover:bg-primary transition-all" style={{ height: `${Math.max((value / maxChartValue) * 220, 8)}px` }} title={`${date}: ${value}`} />
                <span className="text-[8px] font-bold text-white/25 rotate-[-35deg] origin-top-left whitespace-nowrap">{date.slice(5)}</span>
              </div>
            ))
          )}
          </div>
        </div>
      </section>
    </div>
  );
}
