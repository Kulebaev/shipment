import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, User, Truck, MapPin, DollarSign, Users, Clock, FileText, Camera } from "lucide-react";
import { Input } from "~/components/ui/input/input";
import { Textarea } from "~/components/ui/textarea/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select/select";
import { Button } from "~/components/ui/button/button";
import { drivers, vehicles } from "~/data/shipments";
import { useToast } from "~/hooks/use-toast";
import styles from "./new-shipment.module.css";

export default function NewShipment() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    driver: "",
    vehicle: "",
    fromAddress: "",
    toAddress: "",
    price: "",
    loaderCount: "",
    loadingTime: "",
    unloadingTime: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.driver ||
      !formData.vehicle ||
      !formData.fromAddress ||
      !formData.toAddress ||
      !formData.price ||
      !formData.loaderCount
    ) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Отгрузка создана!",
      description: "Новая отгрузка успешно добавлена в систему",
    });

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={handleCancel} className={styles.backButton} aria-label="Назад">
            <ArrowLeft className={styles.backIcon} />
          </button>
          <h1 className={styles.headerTitle}>Новая отгрузка</h1>
        </div>
      </header>

      <main className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <User className={styles.sectionIcon} />
              Водитель и транспорт
            </h2>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Водитель<span className={styles.required}>*</span>
              </label>
              <Select value={formData.driver} onValueChange={(value) => setFormData({ ...formData, driver: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите водителя" />
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
              <label className={styles.label}>
                Машина<span className={styles.required}>*</span>
              </label>
              <Select value={formData.vehicle} onValueChange={(value) => setFormData({ ...formData, vehicle: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите машину" />
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
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <MapPin className={styles.sectionIcon} />
              Маршрут
            </h2>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Откуда<span className={styles.required}>*</span>
              </label>
              <div className={styles.addressInput}>
                <MapPin className={styles.addressIcon} />
                <Input
                  type="text"
                  placeholder="Адрес загрузки"
                  value={formData.fromAddress}
                  onChange={(e) => setFormData({ ...formData, fromAddress: e.target.value })}
                  className={styles.addressField}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Куда<span className={styles.required}>*</span>
              </label>
              <div className={styles.addressInput}>
                <MapPin className={styles.addressIcon} />
                <Input
                  type="text"
                  placeholder="Адрес разгрузки"
                  value={formData.toAddress}
                  onChange={(e) => setFormData({ ...formData, toAddress: e.target.value })}
                  className={styles.addressField}
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <DollarSign className={styles.sectionIcon} />
              Стоимость и ресурсы
            </h2>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Цена (₽)<span className={styles.required}>*</span>
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Грузчики<span className={styles.required}>*</span>
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.loaderCount}
                  onChange={(e) => setFormData({ ...formData, loaderCount: e.target.value })}
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Clock className={styles.sectionIcon} />
              Время
            </h2>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Время загрузки</label>
                <Input
                  type="datetime-local"
                  value={formData.loadingTime}
                  onChange={(e) => setFormData({ ...formData, loadingTime: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Время разгрузки</label>
                <Input
                  type="datetime-local"
                  value={formData.unloadingTime}
                  onChange={(e) => setFormData({ ...formData, unloadingTime: e.target.value })}
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <FileText className={styles.sectionIcon} />
              Дополнительная информация
            </h2>

            <div className={styles.formGroup}>
              <label className={styles.label}>Примечания</label>
              <Textarea
                placeholder="Добавьте любые важные детали..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className={styles.textarea}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Фото документов</label>
              <label className={styles.photoUpload}>
                <Camera className={styles.uploadIcon} />
                <p className={styles.uploadText}>Нажмите для загрузки фото</p>
                <p className={styles.uploadHint}>ТТН, накладная или другие документы</p>
                <input type="file" accept="image/*" multiple className={styles.hiddenInput} />
              </label>
            </div>
          </div>

          <div className={styles.actions}>
            <Button type="button" variant="outline" onClick={handleCancel} className={styles.cancelButton}>
              Отмена
            </Button>
            <Button type="submit" className={styles.submitButton}>
              Создать отгрузку
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
