
import React from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Support: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 text-center p-6">
      <HelpCircle className="w-16 h-16 text-hostdime-orange" />
      <h1 className="text-2xl font-bold">Ajuda e Suporte</h1>
      <p className="text-muted-foreground max-w-md">
        Acesse documentação, FAQs e recursos de suporte ao cliente.
        Para abrir um chamado, entre em contato com nosso suporte.
      </p>
      <Button className="mt-4 bg-hostdime-orange hover:bg-hostdime-orange/90" onClick={() => window.open("https://core.hostdime.com.br", "_blank")}>
        Abrir Chamado de Suporte
      </Button>
    </div>
  );
};

export default Support;
