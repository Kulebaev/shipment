import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("new-shipment", "routes/new-shipment.tsx"),
  route("shipment/:id", "routes/shipment.$id.tsx"),
] satisfies RouteConfig;
