import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Truck, Search, MapPin, User, DollarSign, Users, Package, Plus, Calendar, X } from "lucide-react";
import { Input } from "~/components/ui/input/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select/select";
import { getShipments, drivers, vehicles, type ShipmentStatus } from "~/data/shipments";
import styles from "./home.module.css";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | "all">("all");
  const [driverFilter, setDriverFilter] = useState<string>("all");
  const [vehicleFilter, setVehicleFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [shipments, setShipments] = useState(getShipments());

  useEffect(() => {
    const interval = setInterval(() => {
      setShipments([...getShipments()]);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      searchQuery === "" ||
      shipment.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.fromAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.toAddress.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter;

    const matchesDriver = driverFilter === "all" || shipment.driver === driverFilter;

    const matchesVehicle = vehicleFilter === "all" || shipment.vehicle.includes(vehicleFilter);

    const matchesDate = !dateFilter || new Date(shipment.createdAt).toISOString().split("T")[0] === dateFilter;

    return matchesSearch && matchesStatus && matchesDriver && matchesVehicle && matchesDate;
  });

  const getStatusLabel = (status: ShipmentStatus) => {
    switch (status) {
      case "planned":
        return "Запланирована";
      case "in-transit":
        return "В пути";
      case "completed":
        return "Завершена";
    }
  };

  const getStatusClass = (status: ShipmentStatus) => {
    switch (status) {
      case "planned":
        return styles.statusPlanned;
      case "in-transit":
        return styles.statusInTransit;
      case "completed":
        return styles.statusCompleted;
    }
  };

  const hasActiveFilters = statusFilter !== "all" || driverFilter !== "all" || vehicleFilter !== "all" || dateFilter !== "" || searchQuery !== "";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDriverFilter("all");
    setVehicleFilter("all");
    setDateFilter("");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Truck className={styles.logoIcon} />
            <h1 className={styles.logoText}>ShipLogix</h1>
          </div>
          <p className={styles.tagline}>Your logistics, simplified.</p>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <Input
              type="text"
              placeholder="Поиск по водителю, машине или адресу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filtersRow}>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ShipmentStatus | "all")}>
              <SelectTrigger className={styles.filterSelect}>
                <SelectValue placeholder="Все статусы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="planned">Запланирована</SelectItem>
                <SelectItem value="in-transit">В пути</SelectItem>
                <SelectItem value="completed">Завершена</SelectItem>
              </SelectContent>
            </Select>

            <Select value={driverFilter} onValueChange={setDriverFilter}>
              <SelectTrigger className={styles.filterSelect}>
                <SelectValue placeholder="Все водители" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все водители</SelectItem>
                {drivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.name}>
                    {driver.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
              <SelectTrigger className={styles.filterSelect}>
                <SelectValue placeholder="Все машины" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все машины</SelectItem>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.plateNumber}>
                    {vehicle.plateNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className={styles.dateFilterWrapper}>
              <Calendar className={styles.dateIcon} />
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className={styles.dateInput}
              />
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className={styles.clearFiltersButton} title="Сбросить фильтры">
                <X style={{ width: 18, height: 18 }} />
              </button>
            )}
          </div>
        </div>

        {filteredShipments.length > 0 ? (
          <div className={styles.shipmentsList}>
            {filteredShipments.map((shipment) => (
              <Link key={shipment.id} to={`/shipment/${shipment.id}`} className={styles.shipmentCard}>
                <div className={styles.shipmentHeader}>
                  <span className={styles.shipmentId}>#{shipment.id}</span>
                  <span className={`${styles.statusBadge} ${getStatusClass(shipment.status)}`}>
                    {getStatusLabel(shipment.status)}
                  </span>
                </div>

                <div className={styles.route}>
                  <div className={styles.routeItem}>
                    <MapPin className={`${styles.routeIcon} ${styles.routeIconFrom}`} />
                    <span className={styles.routeAddress}>{shipment.fromAddress}</span>
                  </div>
                  <div className={styles.routeItem}>
                    <MapPin className={`${styles.routeIcon} ${styles.routeIconTo}`} />
                    <span className={styles.routeAddress}>{shipment.toAddress}</span>
                  </div>
                </div>

                <div className={styles.shipmentDetails}>
                  <div className={styles.detailItem}>
                    <User className={styles.detailIcon} />
                    <span className={styles.detailText}>
                      <span className={styles.detailValue}>{shipment.driver}</span>
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <Truck className={styles.detailIcon} />
                    <span className={styles.detailText}>
                      <span className={styles.detailValue}>{shipment.vehicle}</span>
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <DollarSign className={styles.detailIcon} />
                    <span className={styles.detailText}>
                      <span className={styles.detailValue}>{shipment.price.toLocaleString("ru-RU")} ₽</span>
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <Users className={styles.detailIcon} />
                    <span className={styles.detailText}>
                      Грузчики: <span className={styles.detailValue}>{shipment.loaderCount}</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Package className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>Отгрузки не найдены</h2>
            <p className={styles.emptyText}>Попробуйте изменить параметры поиска или создайте новую отгрузку</p>
          </div>
        )}
      </main>

      <Link to="/new-shipment">
        <button className={styles.fab} aria-label="Добавить новую отгрузку">
          <Plus className={styles.fabIcon} />
        </button>
      </Link>
    </div>
  );
}
