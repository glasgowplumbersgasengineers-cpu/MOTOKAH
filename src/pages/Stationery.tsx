import React, { useRef, useState, useCallback, createRef } from 'react';
import { Download, FileImage, FileCode, Eye, EyeOff, Loader2, Images, Info } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { exportToPng, exportToSvg } from '@/lib/stationeryExport';
import { toast } from 'sonner';

import BusinessCardFront from '@/components/stationery/BusinessCardFront';
import BusinessCardBack from '@/components/stationery/BusinessCardBack';
import Letterhead from '@/components/stationery/Letterhead';
import Envelope from '@/components/stationery/Envelope';
import Folder from '@/components/stationery/Folder';
import ComplimentSlip from '@/components/stationery/ComplimentSlip';
import { IDCardFront, IDCardBack } from '@/components/stationery/IDCard';
import EmailSignature from '@/components/stationery/EmailSignature';
import Diary from '@/components/stationery/Diary';
import FileCover from '@/components/stationery/FileCover';
import { GiftBagSmall, GiftBagMedium } from '@/components/stationery/GiftBag';
import Cap from '@/components/stationery/Cap';
import { StampOfficial, StampVerified, StampReceived } from '@/components/stationery/Stamp';

// Mockup images
import mockupSet from '@/assets/stationery-mockup-set.jpg';
import mockupCards from '@/assets/stationery-business-cards-mockup.jpg';
import mockupLetterhead from '@/assets/stationery-letterhead-mockup.jpg';
import mockupFolder from '@/assets/stationery-folder-mockup.jpg';

interface StationeryItem {
  id: string;
  name: string;
  component: React.ForwardRefExoticComponent<React.RefAttributes<HTMLDivElement>>;
  scale: number;
  description: string;
  dimensions: string;
  backgroundColor: string;
}

const stationeryItems: StationeryItem[] = [
  {
    id: 'business-card-front',
    name: 'Business Card (Front)',
    component: BusinessCardFront,
    scale: 0.3,
    description: 'Icon + wordmark on brand blue',
    dimensions: '3.5" × 2" (1050×600px)',
    backgroundColor: '#0066CC',
  },
  {
    id: 'business-card-back',
    name: 'Business Card (Back)',
    component: BusinessCardBack,
    scale: 0.3,
    description: 'Contact details and info',
    dimensions: '3.5" × 2" (1050×600px)',
    backgroundColor: '#0066CC',
  },
  {
    id: 'letterhead',
    name: 'Letterhead',
    component: Letterhead,
    scale: 0.12,
    description: 'A4 letterhead with header and footer',
    dimensions: 'A4 (2480×3508px)',
    backgroundColor: '#ffffff',
  },
  {
    id: 'envelope',
    name: 'Envelope (DL)',
    component: Envelope,
    scale: 0.15,
    description: 'Standard DL envelope design',
    dimensions: 'DL (2598×1299px)',
    backgroundColor: '#0066CC',
  },
  {
    id: 'folder',
    name: 'Presentation Folder',
    component: Folder,
    scale: 0.1,
    description: 'A4 folder/portfolio cover',
    dimensions: 'A4 (2480×3508px)',
    backgroundColor: '#0066CC',
  },
  {
    id: 'compliment-slip',
    name: 'Compliment Slip',
    component: ComplimentSlip,
    scale: 0.15,
    description: 'DL compliment slip',
    dimensions: 'DL (2480×1169px)',
    backgroundColor: '#ffffff',
  },
  {
    id: 'id-card-front',
    name: 'ID Card (Front)',
    component: IDCardFront,
    scale: 0.35,
    description: 'Employee ID card front',
    dimensions: 'CR80 (1013×638px)',
    backgroundColor: '#0066CC',
  },
  {
    id: 'id-card-back',
    name: 'ID Card (Back)',
    component: IDCardBack,
    scale: 0.35,
    description: 'Employee ID card back',
    dimensions: 'CR80 (1013×638px)',
    backgroundColor: '#0066CC',
  },
  {
    id: 'email-signature',
    name: 'Email Signature',
    component: EmailSignature,
    scale: 0.6,
    description: 'Professional email signature',
    dimensions: '600×200px',
    backgroundColor: '#ffffff',
  },
  {
    id: 'diary',
    name: 'Diary Cover',
    component: Diary,
    scale: 0.1,
    description: 'A5 diary/notebook cover',
    dimensions: 'A5 (1748×2480px)',
    backgroundColor: '#0066CC',
  },
  {
    id: 'file-cover',
    name: 'File Cover',
    component: FileCover,
    scale: 0.1,
    description: 'A4 document file cover',
    dimensions: 'A4 (2480×3508px)',
    backgroundColor: '#0066CC',
  },
  {
    id: 'gift-bag-small',
    name: 'Gift Bag (Small)',
    component: GiftBagSmall,
    scale: 0.08,
    description: '8×10 inch gift bag',
    dimensions: '8"×10" (2400×3000px)',
    backgroundColor: '#0066CC',
  },
  {
    id: 'gift-bag-medium',
    name: 'Gift Bag (Medium)',
    component: GiftBagMedium,
    scale: 0.06,
    description: '12×15 inch gift bag',
    dimensions: '12"×15" (3600×4500px)',
    backgroundColor: '#0066CC',
  },
  {
    id: 'cap',
    name: 'Cap Design',
    component: Cap,
    scale: 0.3,
    description: 'Cap front panel embroidery',
    dimensions: '1200×800px',
    backgroundColor: '#0066CC',
  },
  {
    id: 'stamp-official',
    name: 'Official Stamp',
    component: StampOfficial,
    scale: 0.4,
    description: 'Official company rubber stamp',
    dimensions: '1.5" diameter (450×450px)',
    backgroundColor: '#ffffff',
  },
  {
    id: 'stamp-verified',
    name: 'Verified Stamp',
    component: StampVerified,
    scale: 0.4,
    description: 'Vehicle verification stamp',
    dimensions: '1.5" diameter (450×450px)',
    backgroundColor: '#ffffff',
  },
  {
    id: 'stamp-received',
    name: 'Received Stamp',
    component: StampReceived,
    scale: 0.5,
    description: 'Document received stamp',
    dimensions: '2"×0.9" (400×180px)',
    backgroundColor: '#ffffff',
  },
];

const StationeryCard = ({ item, exportRef }: { item: StationeryItem; exportRef: React.RefObject<HTMLDivElement> }) => {
  const [showPreview, setShowPreview] = useState(true);
  const [exporting, setExporting] = useState<'png' | 'svg' | null>(null);

  const handleExportPng = async () => {
    if (!exportRef.current) return;
    setExporting('png');
    try {
      await exportToPng(exportRef.current, {
        filename: `motokah-${item.id}`,
        backgroundColor: item.backgroundColor,
      });
      toast.success(`${item.name} exported as PNG`);
    } catch (error) {
      console.error('PNG export error:', error);
      toast.error('Export failed. Please try again.');
    }
    setExporting(null);
  };

  const handleExportSvg = async () => {
    if (!exportRef.current) return;
    setExporting('svg');
    try {
      await exportToSvg(exportRef.current, {
        filename: `motokah-${item.id}`,
        backgroundColor: item.backgroundColor,
      });
      toast.success(`${item.name} exported as SVG`);
    } catch (error) {
      console.error('SVG export error:', error);
      toast.error('Export failed. Please try again.');
    }
    setExporting(null);
  };

  const Component = item.component;

  return (
    <Card className="overflow-hidden bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-foreground">{item.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
            <p className="text-xs text-muted-foreground mt-1 font-mono">{item.dimensions}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowPreview(!showPreview)}
            className="text-muted-foreground hover:text-foreground"
          >
            {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showPreview && (
          <div className="mb-4 overflow-hidden rounded-lg border border-border bg-muted/50 flex items-center justify-center p-4 min-h-[200px]">
            <div
              style={{
                transform: `scale(${item.scale})`,
                transformOrigin: 'center center',
              }}
            >
              <Component />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleExportPng}
            disabled={exporting !== null}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {exporting === 'png' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileImage className="mr-2 h-4 w-4" />
            )}
            PNG
          </Button>
          <Button
            onClick={handleExportSvg}
            disabled={exporting !== null}
            variant="outline"
            className="flex-1"
          >
            {exporting === 'svg' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileCode className="mr-2 h-4 w-4" />
            )}
            SVG
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Stationery = () => {
  usePageTitle('Brand Stationery');
  const [downloadingAll, setDownloadingAll] = useState<'png' | 'svg' | null>(null);

  const exportRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>(
    stationeryItems.reduce((acc, item) => {
      acc[item.id] = createRef<HTMLDivElement>();
      return acc;
    }, {} as { [key: string]: React.RefObject<HTMLDivElement> })
  );

  const handleDownloadAllPng = useCallback(async () => {
    setDownloadingAll('png');
    toast.info('Downloading all PNG files... This may take a moment.');

    let successCount = 0;
    for (const item of stationeryItems) {
      const ref = exportRefs.current[item.id];
      if (ref?.current) {
        try {
          await exportToPng(ref.current, {
            filename: `motokah-${item.id}`,
            backgroundColor: item.backgroundColor,
          });
          successCount++;
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Failed to export ${item.name}:`, error);
        }
      }
    }

    setDownloadingAll(null);
    toast.success(`Downloaded ${successCount} of ${stationeryItems.length} PNG files`);
  }, []);

  const handleDownloadAllSvg = useCallback(async () => {
    setDownloadingAll('svg');
    toast.info('Downloading all SVG files... This may take a moment.');

    let successCount = 0;
    for (const item of stationeryItems) {
      const ref = exportRefs.current[item.id];
      if (ref?.current) {
        try {
          await exportToSvg(ref.current, {
            filename: `motokah-${item.id}`,
            backgroundColor: item.backgroundColor,
          });
          successCount++;
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Failed to export ${item.name}:`, error);
        }
      }
    }

    setDownloadingAll(null);
    toast.success(`Downloaded ${successCount} of ${stationeryItems.length} SVG files`);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Motokah <span className="text-primary">Brand Stationery</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Download professional print-ready stationery in PNG (300 DPI) or SVG (vector) formats.
            Built from the cropped Motokah icon mark — no redrawn logo.
          </p>
        </div>

        <div className="mb-12 p-8 rounded-xl bg-primary text-primary-foreground text-center">
          <h2 className="text-2xl font-bold mb-4">Download Complete Brand Package</h2>
          <p className="mb-6 opacity-90">
            Get all {stationeryItems.length} stationery items in your preferred format.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleDownloadAllPng}
              disabled={downloadingAll !== null}
            >
              {downloadingAll === 'png' ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Download className="mr-2 h-5 w-5" />
              )}
              Download All PNG
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleDownloadAllSvg}
              disabled={downloadingAll !== null}
              className="border-white/30 text-white hover:bg-white/10"
            >
              {downloadingAll === 'svg' ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Download className="mr-2 h-5 w-5" />
              )}
              Download All SVG
            </Button>
          </div>
        </div>

        {/* Mockup Gallery */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Images className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Presentation Mockups</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl overflow-hidden shadow-lg border border-border">
              <img src={mockupSet} alt="Complete stationery set mockup" className="w-full h-auto" />
              <div className="p-4 bg-card">
                <h3 className="font-semibold text-foreground">Complete Brand Set</h3>
                <p className="text-sm text-muted-foreground">Full stationery suite on dark slate surface</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg border border-border">
              <img src={mockupCards} alt="Business cards mockup" className="w-full h-auto" />
              <div className="p-4 bg-card">
                <h3 className="font-semibold text-foreground">Business Cards</h3>
                <p className="text-sm text-muted-foreground">Premium stacked card presentation</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg border border-border">
              <img src={mockupLetterhead} alt="Letterhead mockup" className="w-full h-auto" />
              <div className="p-4 bg-card">
                <h3 className="font-semibold text-foreground">Letterhead & Cards</h3>
                <p className="text-sm text-muted-foreground">Professional document presentation</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg border border-border">
              <img src={mockupFolder} alt="Folder mockup" className="w-full h-auto" />
              <div className="p-4 bg-card">
                <h3 className="font-semibold text-foreground">Presentation Folder</h3>
                <p className="text-sm text-muted-foreground">Open folder with documents</p>
              </div>
            </div>
          </div>
        </div>

        <Alert className="mb-12 border-primary/30 bg-primary/5">
          <Info className="h-5 w-5 text-primary" />
          <AlertTitle className="text-foreground font-semibold">Before you print: placeholders to fill in</AlertTitle>
          <AlertDescription className="text-muted-foreground mt-2">
            <p className="mb-3">
              Several items carry bracketed placeholders — <code>[YOUR NAME]</code>, <code>[PHONE NUMBER]</code>,{' '}
              <code>[OFFICE ADDRESS]</code> — because real contact details weren't available when these were generated.
              Edit them directly in <code>src/components/stationery/*.tsx</code> before exporting final files.
            </p>
            <p className="text-sm">
              Presentation mockup photos are generated in Motokah brand blue (#0066CC) and white on dark slate,
              matching the live kit.
            </p>
          </AlertDescription>
        </Alert>

        <div className="mb-12 p-6 rounded-xl bg-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Brand Colors</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg shadow-sm" style={{ backgroundColor: '#0066CC' }} />
              <div>
                <p className="font-medium text-foreground">Brand Blue (bg)</p>
                <p className="text-sm text-muted-foreground font-mono">#0066CC</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg shadow-sm border border-border" style={{ backgroundColor: '#ffffff' }} />
              <div>
                <p className="font-medium text-foreground">White (icon/text)</p>
                <p className="text-sm text-muted-foreground font-mono">#ffffff</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg shadow-sm" style={{ backgroundColor: '#28AF60' }} />
              <div>
                <p className="font-medium text-foreground">Verified Green</p>
                <p className="text-sm text-muted-foreground font-mono">#28AF60</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden components for export - CRITICAL: use opacity instead of visibility */}
        <div
          style={{
            position: 'fixed',
            left: '-99999px',
            top: 0,
            opacity: 0,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          {stationeryItems.map((item) => {
            const Component = item.component;
            return <Component key={item.id} ref={exportRefs.current[item.id]} />;
          })}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8 flex-wrap h-auto">
            <TabsTrigger value="all">All Items ({stationeryItems.length})</TabsTrigger>
            <TabsTrigger value="cards">Business Cards</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="identity">Identity</TabsTrigger>
            <TabsTrigger value="promotional">Promotional</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stationeryItems.map((item) => (
                <StationeryCard
                  key={item.id}
                  item={item}
                  exportRef={exportRefs.current[item.id]}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cards">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stationeryItems
                .filter((item) => item.id.includes('business-card'))
                .map((item) => (
                  <StationeryCard
                    key={item.id}
                    item={item}
                    exportRef={exportRefs.current[item.id]}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stationeryItems
                .filter((item) =>
                  ['letterhead', 'envelope', 'folder', 'compliment-slip', 'file-cover'].some(type =>
                    item.id.includes(type)
                  )
                )
                .map((item) => (
                  <StationeryCard
                    key={item.id}
                    item={item}
                    exportRef={exportRefs.current[item.id]}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="identity">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stationeryItems
                .filter((item) =>
                  item.id.includes('id-card') || item.id.includes('email')
                )
                .map((item) => (
                  <StationeryCard
                    key={item.id}
                    item={item}
                    exportRef={exportRefs.current[item.id]}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="promotional">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stationeryItems
                .filter((item) =>
                  ['diary', 'gift-bag', 'cap', 'stamp'].some(type => item.id.includes(type))
                )
                .map((item) => (
                  <StationeryCard
                    key={item.id}
                    item={item}
                    exportRef={exportRefs.current[item.id]}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Stationery;
