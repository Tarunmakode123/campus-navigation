import type { Location } from "@/lib/locations";

export const DEFAULT_ENTRY_ID = "main-gate";

export type RouteEdge = {
  from: string;
  to: string;
  metres: number;
};

export type RouteResult = {
  nodes: string[];
  edges: RouteEdge[];
  totalMetres: number;
};

export const HOME_ROUTE_EDGES: RouteEdge[] = [
  { from: "main-gate", to: "hall", metres: 7 },
  { from: "hall", to: "first-bedroom", metres: 0.5 },
  { from: "hall", to: "dining-room", metres: 0.5 },
  { from: "hall", to: "kitchen", metres: 4 },
  { from: "dining-room", to: "kitchen", metres: 1.5 },
  { from: "hall", to: "bathroom", metres: 2 },
  { from: "hall", to: "second-bedroom", metres: 3 },
  { from: "second-bedroom", to: "bhagwan-room", metres: 3 },
  { from: "kitchen", to: "porch", metres: 0.5 },
];

export function calculateHomeRoute(startId: string, destinationId: string): RouteResult {
  if (startId === destinationId) {
    return { nodes: [startId], edges: [], totalMetres: 0 };
  }

  const adjacency = new Map<string, RouteEdge[]>();
  for (const edge of HOME_ROUTE_EDGES) {
    const forward = edge;
    const reverse = { from: edge.to, to: edge.from, metres: edge.metres };
    adjacency.set(edge.from, [...(adjacency.get(edge.from) ?? []), forward]);
    adjacency.set(edge.to, [...(adjacency.get(edge.to) ?? []), reverse]);
  }

  const distances = new Map<string, number>();
  const previous = new Map<string, string>();
  const unvisited = new Set(adjacency.keys());
  distances.set(startId, 0);
  unvisited.add(startId);
  unvisited.add(destinationId);

  while (unvisited.size > 0) {
    const current = [...unvisited].sort(
      (a, b) => (distances.get(a) ?? Infinity) - (distances.get(b) ?? Infinity),
    )[0];
    if (!current || (distances.get(current) ?? Infinity) === Infinity) break;
    if (current === destinationId) break;
    unvisited.delete(current);

    for (const edge of adjacency.get(current) ?? []) {
      const nextDistance = (distances.get(current) ?? 0) + edge.metres;
      if (nextDistance < (distances.get(edge.to) ?? Infinity)) {
        distances.set(edge.to, nextDistance);
        previous.set(edge.to, current);
        unvisited.add(edge.to);
      }
    }
  }

  const nodes = [destinationId];
  while (nodes[0] !== startId && previous.has(nodes[0])) {
    nodes.unshift(previous.get(nodes[0])!);
  }

  if (nodes[0] !== startId) {
    return { nodes: [startId, destinationId], edges: [], totalMetres: 0 };
  }

  const edges = nodes.slice(0, -1).map((from, index) => {
    const to = nodes[index + 1];
    return (
      HOME_ROUTE_EDGES.find(
        (edge) =>
          (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from),
      ) ?? { from, to, metres: 0 }
    );
  });

  return {
    nodes,
    edges,
    totalMetres: Number(edges.reduce((sum, edge) => sum + edge.metres, 0).toFixed(1)),
  };
}

export function buildRouteSteps(route: RouteResult, locations: Location[]) {
  const byId = new Map(locations.map((loc) => [loc.id, loc.name]));

  if (route.nodes.length === 1) {
    return [`You are already at ${byId.get(route.nodes[0]) ?? "this point"}.`];
  }

  return route.edges.map((edge, index) => {
    const from = byId.get(route.nodes[index]) ?? route.nodes[index];
    const to = byId.get(route.nodes[index + 1]) ?? route.nodes[index + 1];
    const distance = formatMetres(edge.metres);
    return index === 0
      ? `Start from ${from}, then move ${distance} to ${to}.`
      : `Continue ${distance} from ${from} to ${to}.`;
  });
}

export function formatMetres(value: number) {
  return Number.isInteger(value) ? `${value} m` : `${value.toFixed(1)} m`;
}
