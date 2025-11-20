import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, MapPin, User, Truck, DollarSign, Users, Clock, FileText, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "~/components/ui/button/button";
import { Input } from "~/components/ui/input/input";
import { Textarea } from "~/components/ui/textarea/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog/alert-dialog";
import { getShipmentById, updateShipment, deleteShipment, drivers, vehicles, type ShipmentStatus, type Shipment } from "~/data/shipments";
import { useToast } from "~/hooks/use-toast";
import styles from "./shipment.$id.module.css";

export default function ShipmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [shipment, setShipment] = useState(() => getShipmentById(id!));
  const [editForm, setEditForm] = useState<Partial<Shipment>>(shipment || {});

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = getShipmentById(id!);
      if (updated) {
        setShipment(updated);
        if (!isEditing) {
          setEditForm(updated);
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [id, isEditing]);

  if (!shipment) {
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <h1>Отгрузка не найдена</h1>
          <Button onClick={() => navigate("/")}>Вернуться на главную</Button>
        </div>
      </div>
    );
  }

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

  const handleStatusChange = (newStatus: ShipmentStatus) => {
    if (id) {
      updateShipment(id, { status: newStatus });
      toast({
        title: "Статус обновлен",
        description: `Статус отгрузки изменен на "${getStatusLabel(newStatus)}"`,
      });
    }
  };

  const handleDelete = () => {
    if (id) {
      deleteShipment(id);
      toast({
        title: "Отгрузка удалена",
        description: "Отгрузка успешно удалена из системы",
      });
      setTimeout(() => {
        navigate("/");
      }, 500);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(shipment!);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(shipment!);
  };

  const handleSaveEdit = () => {
    if (id && editForm) {
      updateShipment(id, editForm);
      setIsEditing(false);
      toast({
        title: "Изменения сохранены",
        description: "Данные отгрузки успешно обновлены",
      });
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Не указано";
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <button onClick={() => navigate("/")} className={styles.backButton} aria-label="Назад">
              <ArrowLeft className={styles.backIcon} />
            </button>
            <h1 className={styles.headerTitle}>Отгрузка #{shipment.id}</h1>
          </div>
          <span className={`${styles.statusBadge} ${getStatusClass(shipment.status)}`}>
            {getStatusLabel(shipment.status)}
          </span>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <MapPin className={styles.cardIcon} />
              <h2 className={styles.cardTitle}>Маршрут</h2>
            </div>
            {isEditing ? (
              <div className={styles.routeSection}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Откуда</label>
                  <Input
                    value={editForm.fromAddress}
                    onChange={(e) => setEditForm({ ...editForm, fromAddress: e.target.value })}
                    placeholder="Адрес загрузки"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Куда</label>
                  <Input
                    value={editForm.toAddress}
                    onChange={(e) => setEditForm({ ...editForm, toAddress: e.target.value })}
                    placeholder="Адрес разгрузки"
                  />
                </div>
              </div>
            ) : (
              <div className={styles.routeSection}>
                <div className={styles.routeItem}>
                  <div className={`${styles.routeIconWrapper} ${styles.routeIconFrom}`}>
                    <MapPin className={styles.routeIcon} />
                  </div>
                  <div className={styles.routeDetails}>
                    <div className={styles.routeLabel}>Откуда</div>
                    <div className={styles.routeAddress}>{shipment.fromAddress}</div>
                  </div>
                </div>
                <div className={styles.routeItem}>
                  <div className={`${styles.routeIconWrapper} ${styles.routeIconTo}`}>
                    <MapPin className={styles.routeIcon} />
                  </div>
                  <div className={styles.routeDetails}>
                    <div className={styles.routeLabel}>Куда</div>
                    <div className={styles.routeAddress}>{shipment.toAddress}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <User className={styles.cardIcon} />
              <h2 className={styles.cardTitle}>Детали отгрузки</h2>
            </div>
            {isEditing ? (
              <div className={styles.editForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Водитель</label>
                  <Select
                    value={editForm.driver}
                    onValueChange={(value) => setEditForm({ ...editForm, driver: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.name}>
                          {driver.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Машина</label>
                  <Select
                    value={editForm.vehicle}
                    onValueChange={(value) => setEditForm({ ...editForm, vehicle: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={`${vehicle.plateNumber} - ${vehicle.model}`}>
                          {vehicle.plateNumber} - {vehicle.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Стоимость (₽)</label>
                  <Input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Количество грузчиков</label>
                  <Input
                    type="number"
                    value={editForm.loaderCount}
                    onChange={(e) => setEditForm({ ...editForm, loaderCount: Number(e.target.value) })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Время загрузки</label>
                  <Input
                    type="datetime-local"
                    value={editForm.loadingTime || ""}
                    onChange={(e) => setEditForm({ ...editForm, loadingTime: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Время разгрузки</label>
                  <Input
                    type="datetime-local"
                    value={editForm.unloadingTime || ""}
                    onChange={(e) => setEditForm({ ...editForm, unloadingTime: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <div className={styles.detailIconWrapper}>
                    <User className={styles.detailIcon} />
                  </div>
                  <div className={styles.detailContent}>
                    <div className={styles.detailLabel}>Водитель</div>
                    <div className={styles.detailValue}>{shipment.driver}</div>
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <div className={styles.detailIconWrapper}>
                    <Truck className={styles.detailIcon} />
                  </div>
                  <div className={styles.detailContent}>
                    <div className={styles.detailLabel}>Машина</div>
                    <div className={styles.detailValue}>{shipment.vehicle}</div>
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <div className={styles.detailIconWrapper}>
                    <DollarSign className={styles.detailIcon} />
                  </div>
                  <div className={styles.detailContent}>
                    <div className={styles.detailLabel}>Стоимость</div>
                    <div className={styles.detailValue}>{shipment.price.toLocaleString("ru-RU")} ₽</div>
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <div className={styles.detailIconWrapper}>
                    <Users className={styles.detailIcon} />
                  </div>
                  <div className={styles.detailContent}>
                    <div className={styles.detailLabel}>Грузчики</div>
                    <div className={styles.detailValue}>{shipment.loaderCount}</div>
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <div className={styles.detailIconWrapper}>
                    <Clock className={styles.detailIcon} />
                  </div>
                  <div className={styles.detailContent}>
                    <div className={styles.detailLabel}>Время загрузки</div>
                    <div className={styles.detailValue}>{formatDateTime(shipment.loadingTime)}</div>
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <div className={styles.detailIconWrapper}>
                    <Clock className={styles.detailIcon} />
                  </div>
                  <div className={styles.detailContent}>
                    <div className={styles.detailLabel}>Время разгрузки</div>
                    <div className={styles.detailValue}>{formatDateTime(shipment.unloadingTime)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FileText className={styles.cardIcon} />
              <h2 className={styles.cardTitle}>Примечания</h2>
            </div>
            {isEditing ? (
              <Textarea
                value={editForm.notes || ""}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="Добавьте примечания..."
                className={styles.notesTextarea}
                rows={4}
              />
            ) : (
              <p className={styles.notesText}>{shipment.notes || "Нет примечаний"}</p>
            )}
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Edit className={styles.cardIcon} />
              <h2 className={styles.cardTitle}>Управление статусом</h2>
            </div>
            <div className={styles.statusActions}>
              <Button
                variant={shipment.status === "planned" ? "default" : "outline"}
                onClick={() => handleStatusChange("planned")}
                className={styles.statusButton}
              >
                Запланирована
              </Button>
              <Button
                variant={shipment.status === "in-transit" ? "default" : "outline"}
                onClick={() => handleStatusChange("in-transit")}
                className={styles.statusButton}
              >
                В пути
              </Button>
              <Button
                variant={shipment.status === "completed" ? "default" : "outline"}
                onClick={() => handleStatusChange("completed")}
                className={styles.statusButton}
              >
                Завершена
              </Button>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.actions}>
              {isEditing ? (
                <>
                  <Button onClick={handleSaveEdit} className={styles.saveButton}>
                    <Save style={{ width: 18, height: 18, marginRight: 8 }} />
                    Сохранить
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit} className={styles.cancelButton}>
                    <X style={{ width: 18, height: 18, marginRight: 8 }} />
                    Отмена
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={handleEdit} className={styles.editButton}>
                    <Edit style={{ width: 18, height: 18, marginRight: 8 }} />
                    Редактировать
                  </Button>
                </>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className={styles.deleteButton}>
                    <Trash2 style={{ width: 18, height: 18, marginRight: 8 }} />
                    Удалить
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Это действие нельзя отменить. Отгрузка будет удалена из системы навсегда.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Удалить</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
