"use client";

import { useTranslations } from "next-intl";
import { Input, Select, Button } from "@/components/ui";
import type { Address } from "@/types/order";

interface ShippingStepProps {
  data: Address;
  onUpdate: (data: Address) => void;
  onNext: () => void;
}

const provinceOptions = [
  { value: "AG", label: "Agrigento" }, { value: "AL", label: "Alessandria" },
  { value: "AN", label: "Ancona" }, { value: "AR", label: "Arezzo" },
  { value: "AP", label: "Ascoli Piceno" }, { value: "AT", label: "Asti" },
  { value: "AV", label: "Avellino" }, { value: "BA", label: "Bari" },
  { value: "BT", label: "Barletta-Andria-Trani" }, { value: "BL", label: "Belluno" },
  { value: "BN", label: "Benevento" }, { value: "BG", label: "Bergamo" },
  { value: "BI", label: "Biella" }, { value: "BO", label: "Bologna" },
  { value: "BZ", label: "Bolzano" }, { value: "BS", label: "Brescia" },
  { value: "BR", label: "Brindisi" }, { value: "CA", label: "Cagliari" },
  { value: "CL", label: "Caltanissetta" }, { value: "CB", label: "Campobasso" },
  { value: "CE", label: "Caserta" }, { value: "CT", label: "Catania" },
  { value: "CZ", label: "Catanzaro" }, { value: "CH", label: "Chieti" },
  { value: "CO", label: "Como" }, { value: "CS", label: "Cosenza" },
  { value: "CR", label: "Cremona" }, { value: "KR", label: "Crotone" },
  { value: "CN", label: "Cuneo" }, { value: "EN", label: "Enna" },
  { value: "FM", label: "Fermo" }, { value: "FE", label: "Ferrara" },
  { value: "FI", label: "Firenze" }, { value: "FG", label: "Foggia" },
  { value: "FC", label: "Forlì-Cesena" }, { value: "FR", label: "Frosinone" },
  { value: "GE", label: "Genova" }, { value: "GO", label: "Gorizia" },
  { value: "GR", label: "Grosseto" }, { value: "IM", label: "Imperia" },
  { value: "IS", label: "Isernia" }, { value: "SP", label: "La Spezia" },
  { value: "AQ", label: "L'Aquila" }, { value: "LT", label: "Latina" },
  { value: "LE", label: "Lecce" }, { value: "LC", label: "Lecco" },
  { value: "LI", label: "Livorno" }, { value: "LO", label: "Lodi" },
  { value: "LU", label: "Lucca" }, { value: "MC", label: "Macerata" },
  { value: "MN", label: "Mantova" }, { value: "MS", label: "Massa-Carrara" },
  { value: "MT", label: "Matera" }, { value: "ME", label: "Messina" },
  { value: "MI", label: "Milano" }, { value: "MO", label: "Modena" },
  { value: "MB", label: "Monza-Brianza" }, { value: "NA", label: "Napoli" },
  { value: "NO", label: "Novara" }, { value: "NU", label: "Nuoro" },
  { value: "OR", label: "Oristano" }, { value: "PD", label: "Padova" },
  { value: "PA", label: "Palermo" }, { value: "PR", label: "Parma" },
  { value: "PV", label: "Pavia" }, { value: "PG", label: "Perugia" },
  { value: "PU", label: "Pesaro-Urbino" }, { value: "PE", label: "Pescara" },
  { value: "PC", label: "Piacenza" }, { value: "PI", label: "Pisa" },
  { value: "PT", label: "Pistoia" }, { value: "PN", label: "Pordenone" },
  { value: "PZ", label: "Potenza" }, { value: "PO", label: "Prato" },
  { value: "RG", label: "Ragusa" }, { value: "RA", label: "Ravenna" },
  { value: "RC", label: "Reggio Calabria" }, { value: "RE", label: "Reggio Emilia" },
  { value: "RI", label: "Rieti" }, { value: "RN", label: "Rimini" },
  { value: "RM", label: "Roma" }, { value: "RO", label: "Rovigo" },
  { value: "SA", label: "Salerno" }, { value: "SS", label: "Sassari" },
  { value: "SV", label: "Savona" }, { value: "SI", label: "Siena" },
  { value: "SR", label: "Siracusa" }, { value: "SO", label: "Sondrio" },
  { value: "SU", label: "Sud Sardegna" }, { value: "TA", label: "Taranto" },
  { value: "TE", label: "Teramo" }, { value: "TR", label: "Terni" },
  { value: "TO", label: "Torino" }, { value: "TP", label: "Trapani" },
  { value: "TN", label: "Trento" }, { value: "TV", label: "Treviso" },
  { value: "TS", label: "Trieste" }, { value: "UD", label: "Udine" },
  { value: "VA", label: "Varese" }, { value: "VE", label: "Venezia" },
  { value: "VB", label: "Verbano-Cusio-Ossola" }, { value: "VC", label: "Vercelli" },
  { value: "VR", label: "Verona" }, { value: "VV", label: "Vibo Valentia" },
  { value: "VI", label: "Vicenza" }, { value: "VT", label: "Viterbo" },
];

export function ShippingStep({ data, onUpdate, onNext }: ShippingStepProps) {
  const t = useTranslations("checkout.shipping");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const updateField = (field: keyof Address, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-serif text-xl font-semibold mb-6">
        {t("title")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t("firstName")}
          value={data.firstName}
          onChange={(e) => updateField("firstName", e.target.value)}
          required
        />
        <Input
          label={t("lastName")}
          value={data.lastName}
          onChange={(e) => updateField("lastName", e.target.value)}
          required
        />
      </div>

      <Input
        label={t("address")}
        value={data.street}
        onChange={(e) => updateField("street", e.target.value)}
        placeholder={t("addressPlaceholder")}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label={t("cap")}
          value={data.cap}
          onChange={(e) => updateField("cap", e.target.value)}
          placeholder={t("capPlaceholder")}
          maxLength={5}
          required
        />
        <Input
          label={t("city")}
          value={data.city}
          onChange={(e) => updateField("city", e.target.value)}
          required
          className="sm:col-span-1"
        />
        <Select
          label={t("province")}
          options={provinceOptions}
          placeholder={t("provincePlaceholder")}
          value={data.province}
          onChange={(e) => updateField("province", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t("phone")}
          type="tel"
          value={data.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          placeholder={t("phonePlaceholder")}
          required
        />
        <Input
          label={t("country")}
          value={data.country || "Italia"}
          onChange={(e) => updateField("country", e.target.value)}
          disabled
        />
      </div>

      <div className="pt-4">
        <Button type="submit" size="lg" fullWidth>
          {t("continua")}
        </Button>
      </div>
    </form>
  );
}
