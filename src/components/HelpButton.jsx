
import React from 'react';
import "remixicon/fonts/remixicon.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const HelpButton = () => {
  const features = [
    "Adicionar e visualizar arquivos PDF",
    "Navegar pelas páginas",
    "Reorganizar páginas com arrastar e soltar",
    "Excluir páginas",
    "Adicionar PDFs",
    "Salvar e baixar PDFs modificados",
    "Renomear PDFs",
    "Alterar PDF existente",
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full z-50 bg-navy text-orange border-none hover:bg-navy/90"
        >
          <i className="ri-question-line h-4 w-4"></i>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recursos do Editor de PDF</DialogTitle>
        </DialogHeader>
        <ul className="list-disc pl-5 space-y-2">
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default HelpButton;
