
import React from 'react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-navy text-white p-4 mt-auto">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-orange">MesclaPDF foi desenvolvido por <a href="#" className="underline hover:text-orange/80">Lovable.dev</a></p>
          </div>
          <div className="flex space-x-4">
            <Button variant="ghost" size="sm" className="text-orange hover:text-orange/80 hover:bg-white/10">
              Termos
            </Button>
            <Button variant="ghost" size="sm" className="text-orange hover:text-orange/80 hover:bg-white/10">
              Privacidade
            </Button>
            <Button variant="ghost" size="sm" className="text-orange hover:text-orange/80 hover:bg-white/10">
              Contato
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
