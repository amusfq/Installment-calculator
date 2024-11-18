import PWABadge from '@/PWABadge.tsx'
import { InstallmentCalculatorComponent } from '@/components/installment-calculator';

function App() {
  const currentMonth = new Date().getMonth() + 1;

  return (
    <>
      <div className="container mx-auto p-4">
        <InstallmentCalculatorComponent currentMonth={currentMonth} />
      </div>
      <PWABadge />
    </>
  );
}

export default App
