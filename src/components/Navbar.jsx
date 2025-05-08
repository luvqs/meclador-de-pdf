
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import "remixicon/fonts/remixicon.css";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = ({ pdfName, currentPage, numPages, onFileChange, onSave, onSaveAs, onMerge, showUploadButton, onTitleChange, isSidebarVisible, onToggleSidebar }) => {
  const showSidebarToggle = pdfName && numPages > 0;
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(pdfName);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setEditedTitle(pdfName);
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    if (editedTitle.trim() !== '') {
      setIsEditingTitle(false);
      onTitleChange(editedTitle.trim());
    } else {
      setEditedTitle(pdfName);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
  };

  return (
    <nav className="bg-navy shadow-lg p-4">
      <div className="flex justify-between items-center text-white">
        <div className="flex items-center space-x-4">
          {showSidebarToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="mr-2 text-white hover:bg-white/20"
            >
              {isSidebarVisible ? 
                <i className="ri-side-bar-fill h-4 w-4"></i> : 
                <i className="ri-side-bar-line h-4 w-4"></i>}
            </Button>
          )}
          <div className="flex flex-col">
            {pdfName && (
              isEditingTitle ? (
                <Input
                  value={editedTitle}
                  onChange={handleTitleChange}
                  onBlur={handleTitleBlur}
                  onKeyDown={handleTitleKeyDown}
                  className="text-sm font-medium text-gray-700 w-48 h-6 px-1 py-0"
                  autoFocus
                />
              ) : (
                <div className="flex items-center group">
                  <span
                    className="text-sm font-medium text-orange cursor-pointer"
                    onClick={handleTitleClick}
                  >
                    {pdfName}
                  </span>
                  <i className="ri-pencil-line w-4 h-4 ml-2 text-orange opacity-0 group-hover:opacity-100 transition-opacity"></i>
                </div>
              )
            )}
            {pdfName && numPages > 0 && (
              <div className="text-xs text-orange">
                Página {currentPage} de {numPages}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            onChange={onFileChange}
            accept="application/pdf"
            className="hidden"
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload">
            <Button variant="secondary" className="bg-orange/20 text-white hover:bg-orange/30" asChild>
              <span><i className="ri-file-upload-line mr-2 h-4 w-4"></i>{pdfName ? 'Alterar PDF' : 'Adicionar PDF'}</span>
            </Button>
          </label>
          {pdfName && numPages > 0 && (
            <>
              <input
                type="file"
                onChange={onMerge}
                accept="application/pdf"
                className="hidden"
                id="pdf-merge"
              />
              <label htmlFor="pdf-merge">
                <Button variant="secondary" className="bg-orange/20 text-white hover:bg-orange/30" asChild>
                  <span><i className="ri-file-upload-line mr-2 h-4 w-4"></i>Adicionar PDF</span>
                </Button>
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="bg-orange/20 text-white hover:bg-orange/30">
                    <i className="ri-download-line mr-2 h-4 w-4"></i>
                    Salvar PDF
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={onSave}>Salvar</DropdownMenuItem>
                  <DropdownMenuItem onClick={onSaveAs}>Salvar Como</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
