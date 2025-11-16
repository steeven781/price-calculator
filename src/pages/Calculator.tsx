import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  DollarSign,
  Percent,
  FileText,
  Banknote,
  CreditCard,
  Calculator as CalculatorIcon,
  Download,
  Eraser,
  Info,
  Copy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  INSTALLMENT_PLANS,
  EXTRA_FEE_PERCENT,
  EXCHANGE_RATE,
  IVA_PERCENT,
  type CalculationResult,
  type InstallmentResult,
} from "@/shared/schema";

export default function Calculator() {
  const [basePrice, setBasePrice] = useState<string>("");
  const [profitPercent, setProfitPercent] = useState<string>("");
  const [profitOption, setProfitOption] = useState<string>("custom");
  const [description, setDescription] = useState<string>("");
  const [paymentType, setPaymentType] = useState<"efectivo" | "tarjeta">("efectivo");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const { toast } = useToast();

  const formatCurrency = (value: number): string => {
    return `Q ${value.toFixed(2)}`;
  };

  const handleProfitOptionChange = (value: string) => {
    setProfitOption(value);
    if (value !== "custom") {
      setProfitPercent(value);
    }
  };

  const handleCopyToClipboard = () => {
    if (!result) {
      toast({
        variant: "destructive",
        title: "No hay datos",
        description: "Primero debes calcular los precios.",
      });
      return;
    }

    const efectivoPrice = result.precioVenta.toFixed(2);
    const tarjetaPrice = result.precioIVA.toFixed(2);
    
    const cuotasText = result.installments
      .map(inst => `${inst.cuotas} cuotas — Q${inst.montoPorCuota.toFixed(2)}`)
      .join('\n');

    const message = `✨ *Precio Especial en Efectivo: Q${efectivoPrice}*
Ahorra y aprovecha este beneficio exclusivo, ¡es el mejor precio! 💵

💳 *Pago con Tarjeta: Q${tarjetaPrice}*
Ideal si prefieres comodidad y rapidez.

📆 *Págalo en Cuotas:*
${cuotasText}

✨ Tú decides cómo pagarlo, lo importante es que puedas tenerlo y disfrutarlo ahora mismo ✨`;

    navigator.clipboard.writeText(message).then(() => {
      toast({
        title: "¡Copiado!",
        description: "El mensaje se copió al portapapeles.",
      });
    }).catch(() => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo copiar al portapapeles.",
      });
    });
  };

  const handleCalculate = () => {
    const baseUsd = parseFloat(basePrice);
    const profit = parseFloat(profitPercent);

    if (!baseUsd || isNaN(baseUsd) || baseUsd <= 0) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Por favor ingresa un Precio Base en USD válido.",
      });
      return;
    }

    if (isNaN(profit) || profit < 0 || profit >= 100) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "El % de ganancia debe estar entre 0 y 99.",
      });
      return;
    }

    const baseQ = baseUsd * EXCHANGE_RATE;
    const profitDecimal = profit / 100;
    const precioVenta = baseQ / (1 - profitDecimal);
    const precioIVA = precioVenta * (1 + IVA_PERCENT / 100);

    const installments: InstallmentResult[] = INSTALLMENT_PLANS.map((plan) => {
      const totalPorc = plan.porcBanco + EXTRA_FEE_PERCENT;
      const totalPorcDecimal = totalPorc / 100;
      const cuota = precioIVA / (1 - totalPorcDecimal) / plan.cuotas;
      return {
        cuotas: plan.cuotas,
        montoPorCuota: cuota,
      };
    });

    setResult({
      baseQ,
      precioVenta,
      precioIVA,
      installments,
    });
  };

  const handleClear = () => {
    setBasePrice("");
    setProfitPercent("");
    setDescription("");
    setResult(null);
    toast({
      title: "Limpiado",
      description: "Se han borrado los datos del formulario.",
    });
  };

  const handleExportPDF = () => {
    if (!result || result.installments.length === 0) {
      toast({
        variant: "destructive",
        title: "No hay datos",
        description: "No hay cuotas calculadas para exportar.",
      });
      return;
    }

    // Check if html2pdf is available
    // @ts-ignore - html2pdf is loaded via CDN
    if (typeof html2pdf === 'undefined') {
      toast({
        variant: "destructive",
        title: "Error de exportación",
        description: "La librería de PDF no está disponible. Por favor recarga la página.",
      });
      return;
    }

    const element = document.getElementById("cuotasExport");
    if (!element) return;

    const filename = description
      ? `cuotas_${description.replace(/\s+/g, "_").toLowerCase()}.pdf`
      : "cuotas_calculadora.pdf";

    const opt = {
      margin: [5, 5, 5, 5],
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 800,
        windowHeight: 1200
      },
      jsPDF: { 
        unit: "mm", 
        format: "a4", 
        orientation: "portrait",
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // @ts-ignore - html2pdf is loaded via CDN
    html2pdf().set(opt).from(element).save();

    toast({
      title: "PDF generado",
      description: `El archivo ${filename} se está descargando.`,
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-x-hidden">
      <Card className="w-full max-w-[700px] p-6 md:p-8 border-slate-200/20 shadow-2xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              Calculadora de Precio y Cuotas
            </h1>
            <p className="text-base text-muted-foreground">
              Ingresa el <strong>Precio Base en USD</strong> y el{" "}
              <strong>% de ganancia</strong>. Internamente se convierte a
              Quetzales (Q) usando <strong>TC = {EXCHANGE_RATE}</strong>.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="basePrice" className="flex items-center justify-between text-base font-medium">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Precio Base (USD)
                </span>
                <Badge variant="secondary">
                  Moneda de entrada
                </Badge>
              </Label>
              <Input
                id="basePrice"
                type="number"
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                placeholder="Ej. 100"
                step="0.01"
                min="0"
                value={basePrice}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow numbers and decimal point
                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    setBasePrice(value);
                  }
                }}
                onKeyPress={(e) => {
                  // Prevent non-numeric characters except decimal point
                  const char = e.key;
                  if (!/[\d.]/.test(char)) {
                    e.preventDefault();
                  }
                  // Prevent multiple decimal points
                  if (char === '.' && basePrice.includes('.')) {
                    e.preventDefault();
                  }
                }}
                data-testid="input-base-price"
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base font-medium">
                <Percent className="h-5 w-5" />
                % de Ganancia
              </Label>
              <RadioGroup
                value={profitOption}
                onValueChange={handleProfitOptionChange}
                className="grid grid-cols-2 gap-3"
              >
                <div className="flex items-center space-x-3 py-1">
                  <RadioGroupItem value="20" id="profit-20" />
                  <Label htmlFor="profit-20" className="cursor-pointer font-normal text-base">
                    20%
                  </Label>
                </div>
                <div className="flex items-center space-x-3 py-1">
                  <RadioGroupItem value="25" id="profit-25" />
                  <Label htmlFor="profit-25" className="cursor-pointer font-normal text-base">
                    25%
                  </Label>
                </div>
                <div className="flex items-center space-x-3 py-1">
                  <RadioGroupItem value="30" id="profit-30" />
                  <Label htmlFor="profit-30" className="cursor-pointer font-normal text-base">
                    30%
                  </Label>
                </div>
                <div className="flex items-center space-x-3 py-1 col-span-2">
                  <RadioGroupItem value="35" id="profit-35" />
                  <Label htmlFor="profit-35" className="cursor-pointer font-normal text-base">
                    35%
                  </Label>
                </div>
                <div className="flex items-center space-x-3 py-1 col-span-2">
                  <RadioGroupItem value="custom" id="profit-custom" />
                  <Label htmlFor="profit-custom" className="cursor-pointer font-normal text-base">
                    % Personalizado
                  </Label>
                </div>
              </RadioGroup>
              {profitOption === "custom" && (
                <Input
                  id="profitPercent"
                  type="number"
                  inputMode="decimal"
                  pattern="[0-9]*\.?[0-9]*"
                  placeholder="Ej. 30"
                  step="0.01"
                  min="0"
                  max="99"
                  value={profitPercent}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers and decimal point
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      setProfitPercent(value);
                    }
                  }}
                  onKeyPress={(e) => {
                    // Prevent non-numeric characters except decimal point
                    const char = e.key;
                    if (!/[\d.]/.test(char)) {
                      e.preventDefault();
                    }
                    // Prevent multiple decimal points
                    if (char === '.' && profitPercent.includes('.')) {
                      e.preventDefault();
                    }
                  }}
                  data-testid="input-profit-percent"
                  className="mt-2 h-12 text-lg"
                />
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="flex items-center justify-between text-base font-medium">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Descripción
              </span>
              <Badge variant="secondary">
                Ej. TV Samsung 55" 4K
              </Badge>
            </Label>
            <Input
              id="description"
              type="text"
              placeholder='Ej. iPhone 15, Laptop Dell, etc.'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="input-description"
              className="h-12 text-lg"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Tipo de pago</Label>
            <RadioGroup
              value={paymentType}
              onValueChange={(value) => setPaymentType(value as "efectivo" | "tarjeta")}
              className="flex gap-6 flex-wrap"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="efectivo" id="efectivo" data-testid="radio-efectivo" />
                <Label htmlFor="efectivo" className="flex items-center gap-2 cursor-pointer font-normal text-base">
                  <Banknote className="h-5 w-5" />
                  Efectivo
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="tarjeta" id="tarjeta" data-testid="radio-tarjeta" />
                <Label htmlFor="tarjeta" className="flex items-center gap-2 cursor-pointer font-normal text-base">
                  <CreditCard className="h-5 w-5" />
                  Tarjeta (IVA + cuotas)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-br from-primary to-chart-2 h-12 text-lg"
            data-testid="button-calculate"
          >
            <CalculatorIcon className="mr-2 h-5 w-5" />
            Calcular
          </Button>

          <Button
            onClick={handleClear}
            variant="destructive"
            className="w-full h-12 text-lg"
            data-testid="button-clear"
          >
            <Eraser className="mr-2 h-5 w-5" />
            Limpiar
          </Button>

          {result && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Precio Base en Q (TC = {EXCHANGE_RATE}):</span>
                  <span className="font-medium" data-testid="text-base-q">
                    {formatCurrency(result.baseQ)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Precio Venta (sin IVA):</span>
                  <span className="font-medium" data-testid="text-precio-venta">
                    {formatCurrency(result.precioVenta)}
                  </span>
                </div>
                {paymentType === "tarjeta" && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Precio con IVA ({IVA_PERCENT}%):</span>
                    <span className="font-medium" data-testid="text-precio-iva">
                      {formatCurrency(result.precioIVA)}
                    </span>
                  </div>
                )}
              </div>

              {paymentType === "efectivo" ? (
                <div className="relative overflow-hidden rounded-lg p-4 text-center bg-gradient-to-b from-blue-600/20 to-background border border-blue-600">
                  <div className="text-xs uppercase tracking-wider text-blue-300 mb-1">
                    Precio en efectivo
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-efectivo-amount">
                    {formatCurrency(result.precioVenta)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1" data-testid="text-efectivo-desc">
                    {description || "Sin descripción"}
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative overflow-hidden rounded-lg p-4 text-center bg-gradient-to-b from-blue-600/20 to-background border border-blue-600">
                    <div className="text-xs uppercase tracking-wider text-blue-300 mb-1">
                      Precio con tarjeta (contado)
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-tarjeta-amount">
                      {formatCurrency(result.precioIVA)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1" data-testid="text-tarjeta-desc">
                      {description || "Sin descripción"}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      Tabla de cuotas
                      <Info className="h-5 w-5 text-muted-foreground" />
                    </h2>

                    <div id="cuotasExport" style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px' }}>
                      {/* PDF Header - Product Description */}
                      <div style={{ marginBottom: '8px', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 3px 0' }}>
                          {description || "Producto"}
                        </h1>
                        <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                          Plan de Cuotas - Calculadora de Precios
                        </p>
                      </div>

                      {/* PDF Price Card */}
                      <div style={{ background: 'linear-gradient(to bottom, #3b82f6 0%, #1d4ed8 100%)', padding: '8px', borderRadius: '6px', textAlign: 'center', marginBottom: '10px', border: '1px solid #2563eb' }}>
                        <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.03em', color: '#dbeafe', marginBottom: '3px', fontWeight: '600' }}>
                          Precio con tarjeta (contado)
                        </div>
                        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', marginBottom: '2px' }}>
                          {formatCurrency(result.precioIVA)}
                        </div>
                        <div style={{ fontSize: '10px', color: '#bfdbfe' }}>
                          Incluye IVA ({IVA_PERCENT}%)
                        </div>
                      </div>

                      {/* PDF Table */}
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', pageBreakInside: 'avoid' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', pageBreakInside: 'avoid' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#1e293b' }}>
                              <th style={{ 
                                textAlign: 'left', 
                                padding: '6px 8px',
                                fontSize: '11px', 
                                fontWeight: '600',
                                color: '#ffffff',
                                borderBottom: '1px solid #334155'
                              }}>
                                Cuotas
                              </th>
                              <th style={{ 
                                textAlign: 'right', 
                                padding: '6px 8px',
                                fontSize: '11px', 
                                fontWeight: '600',
                                color: '#ffffff',
                                borderBottom: '1px solid #334155'
                              }}>
                                Monto por cuota (Q)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.installments.map((installment) => (
                              <tr key={installment.cuotas} style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9' }} data-testid={`row-installment-${installment.cuotas}`}>
                                <td style={{ padding: '5px 8px', fontSize: '12px', color: '#1e293b', fontWeight: '500' }} data-testid={`text-cuotas-${installment.cuotas}`}>
                                  {installment.cuotas} cuotas
                                </td>
                                <td style={{ padding: '5px 8px', fontSize: '12px', textAlign: 'right', color: '#0f172a', fontWeight: '600' }} data-testid={`text-monto-${installment.cuotas}`}>
                                  {formatCurrency(installment.montoPorCuota)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* PDF Footer */}
                      <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <p style={{ fontSize: '9px', color: '#64748b', margin: '1px 0' }}>
                          Los precios incluyen IVA ({IVA_PERCENT}%)
                        </p>
                        <p style={{ fontSize: '9px', color: '#64748b', margin: '1px 0' }}>
                          Los montos incluyen todos los impuestos de ley
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        onClick={handleExportPDF}
                        variant="outline"
                        className="w-full h-12 text-base"
                        data-testid="button-export-pdf"
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Guardar en PDF
                      </Button>

                      <Button
                        onClick={handleCopyToClipboard}
                        variant="default"
                        className="w-full h-12 text-base bg-gradient-to-br from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
                        data-testid="button-copy-clipboard"
                      >
                        <Copy className="mr-2 h-5 w-5" />
                        Copiar mensaje
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Cálculo de cada plan de cuotas a partir del precio con IVA.
                    </p>
                  </div>
                </>
              )}

              <p className="text-xs text-muted-foreground mt-4">
                Nota: Todos los precios mostrados están en Quetzales (Q). La
                conversión se realiza desde USD usando tipo de cambio fijo Q{EXCHANGE_RATE}.00.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
