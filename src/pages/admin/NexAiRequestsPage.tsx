import React, { useCallback, useEffect, useState } from "react";
import type { ColumnDef } from "@gaqno-development/frontcore/components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@gaqno-development/frontcore/components/ui";
import { useTenants } from "@gaqno-development/frontcore/hooks/admin/useTenants";
import { Button } from "@gaqno-development/frontcore/components/ui";
import { Activity, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 25;

const getSaasBase = (): string => {
  try {
    const env = (import.meta as { env?: Record<string, string> }).env;
    return env?.VITE_SERVICE_SAAS_URL ?? "http://localhost:4009";
  } catch {
    return "http://localhost:4009";
  }
};

async function fetchJson<T>(path: string): Promise<T> {
  const base = getSaasBase();
  const url = base ? `${base.replace(/\/$/, "")}${path}` : path;
  const res = await fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

interface UsageRequestRow {
  id: string;
  tenantId: string | null;
  userId: string | null;
  taskId: string | null;
  category: string | null;
  nexaiModel: string | null;
  priceInCredits: number | null;
  createdAt: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function NexAiRequestsPage() {
  const { tenants, isLoading: tenantsLoading } = useTenants();
  const [tenantId, setTenantId] = useState<string>("");
  const [from, setFrom] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [category, setCategory] = useState<string>("");
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState<{
    items: UsageRequestRow[];
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("from", from);
      params.set("to", to);
      params.set("limit", String(PAGE_SIZE));
      params.set("offset", String(offset));
      if (tenantId) params.set("tenant_id", tenantId);
      if (category) params.set("category", category);
      const result = await fetchJson<{
        items: UsageRequestRow[];
        total: number;
      }>(`/costs/ai-requests?${params.toString()}`);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load requests");
      setData({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  }, [tenantId, from, to, category, offset]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const columns: ColumnDef<UsageRequestRow, unknown>[] = [
    {
      id: "createdAt",
      header: "Data",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "tenantId",
      header: "Tenant",
      cell: ({ row }) => (
        <span className="font-mono text-muted-foreground text-xs">
          {row.original.tenantId ?? "—"}
        </span>
      ),
    },
    {
      id: "category",
      header: "Categoria",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.category ?? "—"}</span>
      ),
    },
    {
      id: "nexaiModel",
      header: "Modelo",
      cell: ({ row }) => (
        <span className="font-mono text-muted-foreground text-xs truncate max-w-[200px] block">
          {row.original.nexaiModel ?? "—"}
        </span>
      ),
    },
    {
      id: "taskId",
      header: "Task ID",
      cell: ({ row }) => (
        <span className="font-mono text-muted-foreground text-xs truncate max-w-[140px] block">
          {row.original.taskId ?? "—"}
        </span>
      ),
    },
    {
      id: "priceInCredits",
      header: "Créditos",
      meta: { align: "right" as const },
      cell: ({ row }) => (
        <span className="text-right">{row.original.priceInCredits ?? 0}</span>
      ),
    },
    {
      id: "userId",
      header: "Usuário",
      cell: ({ row }) => (
        <span className="font-mono text-muted-foreground text-xs">
          {row.original.userId ?? "—"}
        </span>
      ),
    },
  ];

  const total = data?.total ?? 0;
  const start = offset + 1;
  const end = Math.min(offset + PAGE_SIZE, total);
  const hasNext = offset + PAGE_SIZE < total;
  const hasPrev = offset > 0;

  return (
    <div className="container mx-auto py-6 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Activity className="h-8 w-8" />
          Requisições NEX AI
        </h1>
        <p className="text-muted-foreground mt-1">
          Todas as requisições ao gateway NEX AI por tenant e período
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Tenant, período e categoria. Deixe tenant em branco para ver todos.
          </CardDescription>
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="space-y-1">
              <label className="text-muted-foreground text-xs">Tenant</label>
              <Select
                value={tenantId || "all"}
                onValueChange={(v) => {
                  setTenantId(v === "all" ? "" : v);
                  setOffset(0);
                }}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tenants</SelectItem>
                  {(tenants ?? []).map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground text-xs">De</label>
              <input
                type="date"
                className="border rounded-md px-3 py-2 h-9 text-sm bg-background"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setOffset(0);
                }}
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground text-xs">Até</label>
              <input
                type="date"
                className="border rounded-md px-3 py-2 h-9 text-sm bg-background"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setOffset(0);
                }}
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground text-xs">Categoria</label>
              <Select
                value={category || "all"}
                onValueChange={(v) => {
                  setCategory(v === "all" ? "" : v);
                  setOffset(0);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="image">Imagem</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="audio">Áudio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" size="sm" onClick={fetchRequests}>
                Atualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tenantsLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : error ? (
            <p className="text-destructive text-sm">{error}</p>
          ) : loading && !data ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <>
              <DataTable<UsageRequestRow, unknown>
                columns={columns}
                data={data?.items ?? []}
                getRowId={(row) => row.id}
                enableSorting={false}
                enableFiltering={false}
                enableVisibility={false}
                showPagination={false}
                emptyMessage="Nenhuma requisição no período."
              />
              {total > 0 && (
                <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                  <span>
                    {start}–{end} de {total}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!hasPrev}
                      onClick={() =>
                        setOffset((o) => Math.max(0, o - PAGE_SIZE))
                      }
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!hasNext}
                      onClick={() => setOffset((o) => o + PAGE_SIZE)}
                    >
                      Próxima
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
