"use client";

import { useState, useRef, useEffect } from "react";
import { ScanLine, Camera, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormModal } from "@/components/erp/ui/form-modal";
import { useProducts, useCreateMovement } from "@/lib/api-hooks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function BarcodeScanner({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: products } = useProducts();
  const createMovement = useCreateMovement();
  const [scannedCode, setScannedCode] = useState("");
  const [foundProduct, setFoundProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState("1");
  const [type, setType] = useState("StockOut");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleClose = () => {
    stopCamera();
    setScannedCode("");
    setFoundProduct(null);
    setQuantity("1");
    onClose();
  };

  const startCamera = async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      setCameraError("Camera access denied. Please enter barcode manually below.");
      console.error("Camera error:", err);
    }
  };

  const lookupProduct = (code: string) => {
    setScannedCode(code);
    const product = products?.find((p: any) => p.sku === code || p.barcode === code);
    if (product) {
      setFoundProduct(product);
      toast.success(`Found: ${product.name}`);
    } else {
      setFoundProduct(null);
      if (code) toast.error(`No product found for code: ${code}`);
    }
  };

  const handleSubmit = () => {
    if (!foundProduct || !quantity) return;
    createMovement.mutate(
      {
        productId: foundProduct.id,
        type,
        quantity,
        reference: "Barcode scan",
        notes: `Scanned via barcode: ${scannedCode}`,
      },
      {
        onSuccess: () => {
          onClose();
          setScannedCode("");
          setFoundProduct(null);
          setQuantity("1");
        },
      }
    );
  };

  // Simulate barcode scan (in production, would use a library like quagga2)
  const simulateScan = () => {
    if (products && products.length > 0) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      lookupProduct(randomProduct.sku);
    }
  };

  return (
    <FormModal
      open={open}
      onClose={handleClose}
      title="Barcode Scanner"
      description="Scan product barcode or enter manually"
      onSubmit={foundProduct ? handleSubmit : undefined}
      submitLabel="Record Movement"
      isSubmitting={createMovement.isPending}
      size="md"
    >
      <div className="space-y-4">
        {/* Camera Section */}
        <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
          {cameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60">
              <Camera className="h-12 w-12 mb-2" />
              <p className="text-sm">Camera offline</p>
            </div>
          )}
          {/* Scan overlay */}
          {cameraActive && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-primary animate-pulse" />
              <div className="absolute top-1/2 -translate-y-8 left-4 w-8 h-8 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-1/2 -translate-y-8 right-4 w-8 h-8 border-t-2 border-r-2 border-primary" />
              <div className="absolute top-1/2 translate-y-6 left-4 w-8 h-8 border-b-2 border-l-2 border-primary" />
              <div className="absolute top-1/2 translate-y-6 right-4 w-8 h-8 border-b-2 border-r-2 border-primary" />
            </div>
          )}
        </div>

        {cameraError && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}

        <div className="flex gap-2">
          {!cameraActive ? (
            <Button variant="outline" className="flex-1" onClick={startCamera}>
              <Camera className="h-4 w-4 mr-2" />
              Start Camera
            </Button>
          ) : (
            <Button variant="outline" className="flex-1" onClick={stopCamera}>
              <X className="h-4 w-4 mr-2" />
              Stop Camera
            </Button>
          )}
          <Button variant="outline" className="flex-1" onClick={simulateScan}>
            <ScanLine className="h-4 w-4 mr-2" />
            Simulate Scan
          </Button>
        </div>

        {/* Manual Entry */}
        <div className="space-y-2">
          <Label>Barcode / SKU</Label>
          <div className="flex gap-2">
            <Input
              value={scannedCode}
              onChange={(e) => lookupProduct(e.target.value)}
              placeholder="Enter barcode or SKU..."
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => lookupProduct(scannedCode)}
            >
              Lookup
            </Button>
          </div>
        </div>

        {/* Found Product */}
        {foundProduct && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold text-primary">Product Found</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium">{foundProduct.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">SKU</p>
                <p className="font-mono">{foundProduct.sku}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Current Stock</p>
                <p className="font-semibold">{foundProduct.quantity} units</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Warehouse</p>
                <p className="text-xs">{foundProduct.warehouse?.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-primary/20">
              <div className="space-y-1.5">
                <Label className="text-xs">Movement Type</Label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                >
                  <option value="StockIn">Stock In (Receive)</option>
                  <option value="StockOut">Stock Out (Issue)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Quantity</Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          💡 In production, this uses device camera with barcode detection library. Click "Simulate Scan" to test.
        </p>
      </div>
    </FormModal>
  );
}
