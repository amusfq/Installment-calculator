import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  currentMonth: number;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formatIDR = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const parseCurrency = (value: string) => {
  return Number(value.replace(/[^0-9-]+/g, ""));
};

export function InstallmentCalculatorComponent({ currentMonth }: Props) {
  const [principalInput, setPrincipalInput] = useState<string>("");
  const [principal, setPrincipal] = useState<number>(0);
  const [downPaymentInput, setDownPaymentInput] = useState<string>("");
  const [downPayment, setDownPayment] = useState<number>(0);
  const [startMonth, setStartMonth] = useState<number>(currentMonth);

  useEffect(() => {
    setPrincipal(parseCurrency(principalInput));
  }, [principalInput]);

  useEffect(() => {
    setDownPayment(parseCurrency(downPaymentInput));
  }, [downPaymentInput]);

  const calculateInstallment = (principal: number, downPayment: number) => {
    const margin = 0.35; // 35% margin
    const totalAmount = principal * (1 + margin) - downPayment;
    const monthlyInstallment = totalAmount / 10; // 10 months
    return monthlyInstallment;
  };

  const marginAmount = principal * 0.35;
  const monthlyInstallment = calculateInstallment(principal, downPayment);

  const installments = Array.from({ length: 10 }, (_, index) => {
    const monthIndex = (startMonth + index) % 12;
    return {
      month: months[monthIndex],
      amount: monthlyInstallment,
      balance:
        principal +
        marginAmount -
        downPayment -
        monthlyInstallment * (index + 1),
    };
  });

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = parseCurrency(value);
    setPrincipalInput(formatIDR(numericValue));
  };

  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = parseCurrency(value);
    setDownPaymentInput(formatIDR(numericValue));
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Kalkulator Cicilan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-end space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="principal"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Harga Barang
              </label>
              <Input
                type="text"
                id="principal"
                value={principalInput}
                onChange={handlePrincipalChange}
                placeholder="Masukkan harga barang"
                aria-describedby="principal-description"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="downPayment"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Uang Muka (Opsional)
              </label>
              <Input
                type="text"
                id="downPayment"
                value={downPaymentInput}
                onChange={handleDownPaymentChange}
                placeholder="Masukkan uang muka"
                aria-describedby="down-payment-description"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-end space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-1/3">
              <label
                htmlFor="startMonth"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mulai Bayar
              </label>
              <Select
                value={startMonth.toString()}
                onValueChange={(value) => setStartMonth(Number(value))}
              >
                <SelectTrigger id="startMonth">
                  <SelectValue placeholder="Pilih bulan" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={month} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => {
                setPrincipalInput("");
                setPrincipal(0);
                setDownPaymentInput("");
                setDownPayment(0);
                setStartMonth(currentMonth);
              }}
              aria-label="Reset calculator"
            >
              Ulangi
            </Button>
          </div>

          {principal > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Rincian cicilan</h3>
              <div className="mb-4 space-y-2">
                <p>
                  <strong>Harga Barang:</strong> {formatIDR(principal)}
                </p>
                <p>
                  <strong>Uang Muka:</strong> {formatIDR(downPayment)}
                </p>
                <p>
                  <strong>Laba (35%):</strong> {formatIDR(marginAmount)}
                </p>
                <p>
                  <strong>Cicilan Per Bulan:</strong>{" "}
                  {formatIDR(monthlyInstallment)}
                </p>
                <p>
                  <strong>Total Pembayaran:</strong>{" "}
                  {formatIDR(principal + marginAmount - downPayment)}
                </p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bulan</TableHead>
                      <TableHead>Cicilan</TableHead>
                      <TableHead>Sisa Cicilan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {installments.map((installment, index) => (
                      <TableRow key={index}>
                        <TableCell>{installment.month}</TableCell>
                        <TableCell>{formatIDR(installment.amount)}</TableCell>
                        <TableCell>
                          {formatIDR(Math.max(0, installment.balance))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
