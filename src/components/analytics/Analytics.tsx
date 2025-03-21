
import React from "react";
import { BarChart3 } from "lucide-react";

const Analytics: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 text-center p-6">
      <BarChart3 className="w-16 h-16 text-hostdime-orange" />
      <h1 className="text-2xl font-bold">Análises</h1>
      <p className="text-muted-foreground max-w-md">
        Obtenha insights sobre o uso de armazenamento, padrões de acesso a objetos e muito mais.
        O recurso de análises estará disponível em breve.
      </p>
    </div>
  );
};

export default Analytics;
