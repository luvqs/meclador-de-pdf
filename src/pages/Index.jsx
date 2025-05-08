import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import PDFSidebar from '../components/PDFSidebar';
import Navbar from '../components/Navbar';
import { PDFDocument } from 'pdf-lib';
import "remixicon/fonts/remixicon.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import HelpButton from '../components/HelpButton';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DragDropArea = ({ onFileChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileChange({ target: { files: [files[0]] } });
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center h-full border-4 border-dashed rounded-lg p-8 transition-colors ${
        isDragging ? 'border-orange bg-orange/10' : 'border-orange/50'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <i className="ri-file-line text-orange text-6xl mb-4"></i>
      <p className="text-xl font-semibold text-navy mb-2">Arraste e solte seu PDF aqui</p>
      <p className="text-sm text-navy mb-4">ou</p>
      <label htmlFor="pdf-upload" className="cursor-pointer bg-navy text-orange px-4 py-2 rounded hover:bg-navy/90 transition-colors">
        Escolher PDF
      </label>
      <input
        id="pdf-upload"
        type="file"
        onChange={onFileChange}
        accept="application/pdf"
        className="hidden"
      />
    </div>
  );
};

const Index = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pdfName, setPdfName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageOrder, setPageOrder] = useState([]);
  const [isSaveAsModalOpen, setIsSaveAsModalOpen] = useState(false);
  const [saveAsFileName, setSaveAsFileName] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const mainContentRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(URL.createObjectURL(file));
      setPdfName(file.name);
      setCurrentPage(1);
    } else {
      alert("Por favor, selecione um arquivo PDF válido.");
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageOrder(Array.from({ length: numPages }, (_, i) => i + 1));
  };

  const scrollToPage = (pageNumber) => {
    const pageElement = document.getElementById(`page_${pageNumber}`);
    if (pageElement && mainContentRef.current) {
      mainContentRef.current.scrollTo({
        top: pageElement.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newPageOrder = Array.from(pageOrder);
    const [reorderedItem] = newPageOrder.splice(result.source.index, 1);
    newPageOrder.splice(result.destination.index, 0, reorderedItem);

    setPageOrder(newPageOrder);
  };

  const onDeletePage = async (index) => {
    try {
      const existingPdfBytes = await fetch(pdfFile).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      pdfDoc.removePage(index);

      const newPageOrder = pageOrder.filter((_, i) => i !== index);
      setPageOrder(newPageOrder);
      const newPageCount = pdfDoc.getPageCount();
      setNumPages(newPageCount);

      if (newPageCount === 0) {
        // Reset state if all pages are deleted
        setPdfFile(null);
        setPdfName('');
        setCurrentPage(1);
        setPageOrder([]);
      } else {
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const newPdfUrl = URL.createObjectURL(blob);
        setPdfFile(newPdfUrl);
      }
    } catch (error) {
      console.error('Erro ao excluir página:', error);
      alert('Ocorreu um erro ao excluir a página. Por favor, tente novamente.');
    }
  };

  const onSave = async (saveAs = false) => {
    if (pdfFile) {
      try {
        const existingPdfBytes = await fetch(pdfFile).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const newPdfDoc = await PDFDocument.create();

        for (const pageNumber of pageOrder) {
          const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
          newPdfDoc.addPage(copiedPage);
        }

        const pdfBytes = await newPdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        
        if (saveAs) {
          setIsSaveAsModalOpen(true);
          setSaveAsFileName(pdfName || 'modificado.pdf');
        } else {
          link.download = pdfName || 'modificado.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (error) {
        console.error('Erro ao salvar PDF:', error);
        alert('Ocorreu um erro ao salvar o PDF. Por favor, tente novamente.');
      }
    }
  };

  const handleSaveAs = () => {
    if (saveAsFileName.trim()) {
      const link = document.createElement('a');
      link.href = pdfFile;
      link.download = saveAsFileName.trim();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsSaveAsModalOpen(false);
    }
  };

  const onMerge = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      try {
        const mergeFileBytes = await file.arrayBuffer();
        const existingPdfBytes = await fetch(pdfFile).then(res => res.arrayBuffer());
        
        const existingPdfDoc = await PDFDocument.load(existingPdfBytes);
        const mergePdfDoc = await PDFDocument.load(mergeFileBytes);
        
        const copiedPages = await existingPdfDoc.copyPages(mergePdfDoc, mergePdfDoc.getPageIndices());
        copiedPages.forEach((page) => existingPdfDoc.addPage(page));
        
        const mergedPdfBytes = await existingPdfDoc.save();
        const mergedPdfBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const mergedPdfUrl = URL.createObjectURL(mergedPdfBlob);
        
        setPdfFile(mergedPdfUrl);
        setNumPages(existingPdfDoc.getPageCount());
        setPageOrder(Array.from({ length: existingPdfDoc.getPageCount() }, (_, i) => i + 1));
      } catch (error) {
        console.error('Erro ao adicionar PDF:', error);
        alert('Ocorreu um erro ao adicionar o PDF. Por favor, tente novamente.');
      }
    } else {
      alert("Por favor, selecione um arquivo PDF válido para adicionar.");
    }
  };

  const handleTitleChange = (newTitle) => {
    setPdfName(newTitle);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (mainContentRef.current) {
        const { scrollTop, clientHeight } = mainContentRef.current;
        const pageElements = document.querySelectorAll('[id^="page_"]');
        for (let i = 0; i < pageElements.length; i++) {
          const element = pageElements[i];
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.clientHeight;
          if (scrollTop >= elementTop - clientHeight / 2 && scrollTop < elementBottom - clientHeight / 2) {
            setCurrentPage(i + 1); // Set to the index + 1 to represent the current visible page number
            break;
          }
        }
      }
    };

    const contentElement = mainContentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [pageOrder]);

  // Update currentPage when pageOrder changes or component mounts
  useEffect(() => {
    const updateCurrentPage = () => {
      if (mainContentRef.current) {
        const { scrollTop, clientHeight } = mainContentRef.current;
        const pageElements = document.querySelectorAll('[id^="page_"]');
        for (let i = 0; i < pageElements.length; i++) {
          const element = pageElements[i];
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.clientHeight;
          if (scrollTop >= elementTop - clientHeight / 2 && scrollTop < elementBottom - clientHeight / 2) {
            setCurrentPage(i + 1); // Set to the index + 1 to represent the current visible page number
            break;
          }
        }
      }
    };

    updateCurrentPage();
  }, [pageOrder]);

  return (
    <>
      <div className="flex flex-col h-screen bg-orange/10">
        <Navbar 
          pdfName={pdfName} 
          currentPage={currentPage} 
          numPages={numPages} 
          onFileChange={onFileChange}
          onSave={() => onSave(false)}
          onSaveAs={() => onSave(true)}
          onMerge={onMerge}
          showUploadButton={!!pdfFile}
          onTitleChange={handleTitleChange}
          isSidebarVisible={isSidebarVisible}
          onToggleSidebar={toggleSidebar}
        />
        <div className="flex flex-1 overflow-hidden">
          {pdfFile && isSidebarVisible && (
            <PDFSidebar
              file={pdfFile}
              pages={pageOrder}
              onPageClick={scrollToPage}
              onDragEnd={onDragEnd}
              onDeletePage={onDeletePage}
            />
          )}
          <div className="flex-1 p-4 overflow-hidden relative">
            {pdfFile ? (
              <div className="border border-orange/20 rounded-lg overflow-hidden bg-white shadow-lg h-full">
                <div ref={mainContentRef} className="overflow-y-auto h-full">
                  <Document
                    file={pdfFile}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="flex flex-col items-center"
                  >
                    {pageOrder.map((pageNumber, index) => (
                      <div id={`page_${pageNumber}`} key={`page_${pageNumber}`} className="mb-8">
                        <Page
                          pageNumber={pageNumber}
                          width={Math.min(800, window.innerWidth * 0.6)}
                          renderTextLayer={true}
                          renderAnnotationLayer={true}
                        />
                      </div>
                    ))}
                  </Document>
                </div>
              </div>
            ) : (
              <DragDropArea onFileChange={onFileChange} />
            )}
          </div>
        </div>
      </div>
      <Dialog open={isSaveAsModalOpen} onOpenChange={setIsSaveAsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salvar Como</DialogTitle>
          </DialogHeader>
          <Input
            value={saveAsFileName}
            onChange={(e) => setSaveAsFileName(e.target.value)}
            placeholder="Digite o nome do arquivo"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && saveAsFileName.trim()) {
                handleSaveAs();
              }
            }}
          />
          <DialogFooter>
            <Button onClick={() => setIsSaveAsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveAs}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <HelpButton />
    </>
  );
};

export default Index;
