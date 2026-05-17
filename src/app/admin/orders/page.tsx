import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { deleteOrder, updateOrderStatus } from "@/lib/actions/orders";
import { parseLocalDateRange } from "@/lib/date-range";
import { prisma } from "@/lib/prisma";
import { CheckCircle2, Clock, MessageCircle, PackageCheck, Trash2, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

type OrderItem = {
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
};

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pendente" },
  { value: "CONTACTED", label: "Contatado" },
  { value: "PAID", label: "Pago" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELED", label: "Cancelado" },
];

function parseItems(value: string): OrderItem[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatCurrency(value: { toString: () => string } | number) {
  return `R$ ${Number(value).toFixed(2)}`;
}

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ q?: string; from?: string; to?: string }> }) {
  const params = await searchParams;
  const range = parseLocalDateRange(params.from, params.to, 30);
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: range.from, lte: range.to },
      ...(params.q
        ? {
            OR: [
              { shortId: { contains: params.q } },
              { customerName: { contains: params.q } },
              { customerEmail: { contains: params.q } },
              { customerPhone: { contains: params.q } },
              { customerDocument: { contains: params.q } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  const pendingCount = orders.filter((order) => order.status === "PENDING").length;
  const paidCount = orders.filter((order) => order.status === "PAID" || order.status === "DELIVERED").length;
  const canceledCount = orders.filter((order) => order.status === "CANCELED").length;

  const stats = [
    { name: "Pendentes", value: pendingCount, icon: Clock, color: "text-primary" },
    { name: "Em conversa", value: orders.filter((order) => order.status === "CONTACTED").length, icon: MessageCircle, color: "text-blue-400" },
    { name: "Pagos/Entregues", value: paidCount, icon: PackageCheck, color: "text-green-500" },
    { name: "Cancelados", value: canceledCount, icon: XCircle, color: "text-red-500" },
  ];

  return (
    <div className="flex flex-col gap-8 py-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
          Pedidos <span className="text-primary italic">WhatsApp</span>
        </h2>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Intencoes de compra registradas no checkout</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-4">
        <form action="/admin/orders" className="bg-surface border border-white/5 rounded-[1.75rem] p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
          <input type="hidden" name="from" value={range.fromValue} />
          <input type="hidden" name="to" value={range.toValue} />
          <input name="q" defaultValue={params.q || ""} placeholder="Buscar por pedido, cliente, contato ou documento..." className="flex-1 bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
          <button className="px-6 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all">
            Buscar
          </button>
        </form>
        <DateRangeFilter action="/admin/orders" from={range.fromValue} to={range.toValue} extra={params.q ? { q: params.q } : {}} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-surface p-6 rounded-3xl border border-white/5 flex flex-col gap-4 shadow-xl">
            <stat.icon size={20} className={stat.color} />
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-black italic tracking-tighter">{stat.value}</span>
              <span className="text-[9px] font-bold uppercase text-white/40 tracking-widest mt-1">{stat.name}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {orders.length === 0 ? (
          <div className="bg-surface border border-white/5 rounded-3xl p-12 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Nenhuma intencao registrada ainda.</p>
          </div>
        ) : (
          orders.map((order) => {
            const items = parseItems(order.items);

            return (
              <article key={order.id} className="bg-surface border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-black italic tracking-tighter text-white">Pedido #{order.shortId}</h3>
                      {order.status === "DELIVERED" && <CheckCircle2 size={16} className="text-green-500" />}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                      {order.createdAt.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Total</p>
                    <p className="text-3xl font-black italic tracking-tighter text-primary">{formatCurrency(order.total)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-2 md:col-span-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">Cliente</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px] font-bold uppercase tracking-widest text-white/45">
                      <span>Nome: <b className="text-white">{order.customerName || "-"}</b></span>
                      <span>Contato: <b className="text-white">{order.customerPhone || order.customerEmail || "-"}</b></span>
                      <span>Doc: <b className="text-white">{order.customerDocument || "-"}</b></span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">Endereco: <span className="text-white/70">{order.customerAddress || "-"}</span></p>
                  </div>
                  {items.map((item) => (
                    <div key={`${order.id}-${item.productId}-${item.size}`} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-1">
                      <span className="text-xs font-black uppercase text-white">{item.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                        Tam: {item.size || "N/A"} | Qtd: {item.quantity} | {formatCurrency(item.price)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t border-white/5">
                  <form action={updateOrderStatus.bind(null, order.id)} className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <select
                      name="status"
                      defaultValue={order.status}
                      className="bg-black border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-primary"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    <button className="px-5 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all">
                      Salvar
                    </button>
                  </form>

                  <form action={deleteOrder.bind(null, order.id)}>
                    <button className="p-3 bg-white/5 text-white/40 rounded-xl hover:text-white hover:bg-red-500 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
