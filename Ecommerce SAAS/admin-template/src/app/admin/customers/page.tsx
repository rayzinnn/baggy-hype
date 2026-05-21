import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { parseLocalDateRange } from "@/lib/date-range";
import { deleteCustomer } from "@/lib/actions/customers";
import { prisma } from "@/lib/prisma";
import { Trash2, Users } from "lucide-react";

export const dynamic = "force-dynamic";

async function deleteCustomerAction(formData: FormData) {
  "use server";

  await deleteCustomer(String(formData.get("customerId") || ""));
}

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string; from?: string; to?: string }> }) {
  const params = await searchParams;
  const range = parseLocalDateRange(params.from, params.to, 90);
  const customers = await prisma.customer.findMany({
    where: {
      OR: [
        { createdAt: { gte: range.from, lte: range.to } },
        { orders: { some: { createdAt: { gte: range.from, lte: range.to } } } },
      ],
      ...(params.q
        ? {
            AND: [
              {
                OR: [
                  { name: { contains: params.q } },
                  { email: { contains: params.q } },
                  { phone: { contains: params.q } },
                  { document: { contains: params.q } },
                ],
              },
            ],
          }
        : {}),
    },
    include: { orders: { where: { createdAt: { gte: range.from, lte: range.to } } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-8 py-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Clientes <span className="text-primary italic">CRM</span></h2>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Consumo pago e ultima compra</p>
      </header>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-4">
        <form action="/admin/customers" className="bg-surface border border-white/5 rounded-[1.75rem] p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
          <input type="hidden" name="from" value={range.fromValue} />
          <input type="hidden" name="to" value={range.toValue} />
          <input name="q" defaultValue={params.q || ""} placeholder="Buscar por nome, contato ou documento..." className="flex-1 bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
          <button className="px-6 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all">
            Buscar
          </button>
        </form>
        <DateRangeFilter action="/admin/customers" from={range.fromValue} to={range.toValue} extra={params.q ? { q: params.q } : {}} />
      </div>
      <div className="grid grid-cols-1 gap-4">
        {customers.map((customer) => {
          const paidOrders = customer.orders.filter((order) => order.status === "PAID" || order.status === "DELIVERED");
          const total = paidOrders.reduce((sum, order) => sum + Number(order.total), 0);
          const lastPaid = paidOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
          return (
            <div key={customer.id} className="bg-surface border border-white/5 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_0.7fr_0.8fr_auto] gap-4 items-center">
              <div className="flex items-center gap-4">
                <Users className="text-primary" size={20} />
                <div className="flex flex-col">
                  <span className="text-sm font-black uppercase text-white">{customer.name}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">{customer.phone || customer.email || "-"}</span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{customer.document || "Sem documento"}</span>
              <span className="text-sm font-black italic text-primary">R$ {total.toFixed(2)}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{lastPaid ? lastPaid.createdAt.toLocaleDateString("pt-BR") : "Sem compra paga"}</span>
              <form action={deleteCustomerAction} className="flex md:justify-end">
                <input type="hidden" name="customerId" value={customer.id} />
                <button className="h-10 w-10 rounded-xl bg-white/5 text-white/45 grid place-items-center hover:bg-red-500 hover:text-white transition-all" aria-label={`Excluir cliente ${customer.name}`}>
                  <Trash2 size={15} />
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
