"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Job } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  ImageIcon,
  RefreshCcw,
  Download,
  Save,
  CheckCircle,
} from "lucide-react";

// QR code generator library
import QRCode from "qrcode";

// Utility for saving the job image URL to the database
import { updateJobImageUrl } from "@/lib/services/job-actions";

interface SocialMediaImageGeneratorProps {
  job: Job;
  onClose: () => void;
}

// Template options for different job types
const TEMPLATES = [
  {
    id: "standard",
    name: "Standard",
    colors: {
      background: "#2563eb",
      text: "#ffffff",
      accent: "#fbbf24",
    },
  },
  {
    id: "tech",
    name: "Tech",
    colors: {
      background: "#18181b",
      text: "#ffffff",
      accent: "#06b6d4",
    },
  },
  {
    id: "creative",
    name: "Creative",
    colors: {
      background: "#f472b6",
      text: "#ffffff",
      accent: "#3b82f6",
    },
  },
  {
    id: "corporate",
    name: "Corporate",
    colors: {
      background: "#f8fafc",
      text: "#0f172a",
      accent: "#6366f1",
    },
  },
  {
    id: "startup",
    name: "Startup",
    colors: {
      background: "#10b981",
      text: "#ffffff",
      accent: "#fde047",
    },
  },
];

export function SocialMediaImageGenerator({
  job,
  onClose,
}: SocialMediaImageGeneratorProps) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [colors, setColors] = useState(TEMPLATES[0].colors);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fontScale, setFontScale] = useState(100);
  const [logoScale, setLogoScale] = useState(100);

  // Set up canvas size for Instagram (1080x1080 px)
  const canvasWidth = 1080;
  const canvasHeight = 1080;

  // Generate QR code for the job application link
  useEffect(() => {
    const generateQrCode = async () => {
      try {
        const applicationUrl = job.applicationLink;
        const dataUrl = await QRCode.toDataURL(applicationUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });
        setQrCodeData(dataUrl);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    generateQrCode();
  }, [job.applicationLink]);

  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    const template = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
    setSelectedTemplate(template);
    setColors(template.colors);
  };

  // Generate the social media image
  const generateImage = async () => {
    setIsGenerating(true);

    const canvas = canvasRef.current;
    if (!canvas || !qrCodeData) {
      setIsGenerating(false);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsGenerating(false);
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw background
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Set up fonts
    const titleFontSize = Math.floor(50 * (fontScale / 100));
    const subtitleFontSize = Math.floor(30 * (fontScale / 100));
    const detailsFontSize = Math.floor(24 * (fontScale / 100));

    // Draw company logo if available
    if (job.company.logo) {
      try {
        const logoImg = new window.Image();
        logoImg.crossOrigin = "anonymous";
        logoImg.src = job.company.logo;

        await new Promise<void>((resolve, reject) => {
          logoImg.onload = () => {
            const logoSize = 150 * (logoScale / 100);
            const logoX = 50;
            const logoY = 50;
            ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
            resolve();
          };
          logoImg.onerror = () => {
            reject(new Error("Failed to load company logo"));
          };
          // Set a timeout in case the image load hangs
          setTimeout(() => reject(new Error("Logo load timeout")), 5000);
        });
      } catch (error) {
        console.error("Error loading company logo:", error);
        // Continue without the logo
      }
    }

    // Draw ApplyMint AI Logo/Branding
    ctx.fillStyle = colors.accent;
    ctx.font = `bold ${Math.floor(30 * (fontScale / 100))}px Inter, sans-serif`;
    ctx.textAlign = "right";
    ctx.fillText("ApplyMint AI", canvasWidth - 50, 80);

    // Draw job title
    ctx.fillStyle = colors.text;
    ctx.font = `bold ${titleFontSize}px Inter, sans-serif`;
    ctx.textAlign = "center";

    // Handle long titles by wrapping text
    const wrapText = (
      text: string,
      maxWidth: number,
      fontSize: number,
    ): string[] => {
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = words[0];

      ctx.font = `bold ${fontSize}px Inter, sans-serif`;

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(`${currentLine} ${word}`).width;
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    };

    // Wrap and draw job title
    const titleLines = wrapText(job.title, canvasWidth - 200, titleFontSize);
    titleLines.forEach((line, index) => {
      ctx.fillText(line, canvasWidth / 2, 280 + index * (titleFontSize + 10));
    });

    // Draw company name
    ctx.font = `${subtitleFontSize}px Inter, sans-serif`;
    ctx.fillText(
      job.company.name,
      canvasWidth / 2,
      280 + titleLines.length * (titleFontSize + 10) + 50,
    );

    // Draw job details
    ctx.font = `${detailsFontSize}px Inter, sans-serif`;

    const detailsY = 280 + titleLines.length * (titleFontSize + 10) + 120;
    const detailsSpacing = detailsFontSize + 15;

    // Location
    if (job.location) {
      ctx.fillText(
        `📍 ${job.location} (${job.locationType})`,
        canvasWidth / 2,
        detailsY,
      );
    } else {
      ctx.fillText(`📍 ${job.locationType}`, canvasWidth / 2, detailsY);
    }

    // Job type & Experience level
    ctx.fillText(
      `💼 ${job.jobType} • ${job.experienceLevel} Level`,
      canvasWidth / 2,
      detailsY + detailsSpacing,
    );

    // Salary range if available
    if (job.salary || job.salaryMax) {
      let salaryText = "💰 ";
      if (job.salary && job.salaryMax) {
        salaryText += `${job.salary.toLocaleString()}-${job.salaryMax.toLocaleString()} ${job.salaryCurrency}`;
      } else if (job.salary) {
        salaryText += `${job.salary.toLocaleString()} ${job.salaryCurrency}+`;
      } else if (job.salaryMax) {
        salaryText += `Up to ${job.salaryMax.toLocaleString()} ${job.salaryCurrency}`;
      }
      ctx.fillText(salaryText, canvasWidth / 2, detailsY + detailsSpacing * 2);
    }

    // Draw QR code
    if (qrCodeData) {
      const qrImage = new window.Image();
      qrImage.src = qrCodeData;

      await new Promise<void>((resolve) => {
        qrImage.onload = () => {
          const qrSize = 200;
          const qrX = (canvasWidth - qrSize) / 2;
          const qrY = detailsY + detailsSpacing * 3 + 30;
          ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

          // Add scan me text
          ctx.font = `bold ${detailsFontSize}px Inter, sans-serif`;
          ctx.fillText("Scan to apply", canvasWidth / 2, qrY + qrSize + 40);
          resolve();
        };
      });
    }

    // Draw footer with domains/industries
    if (job.domains.length > 0) {
      const domains = job.domains.map((d) => d.name).join(" • ");
      ctx.font = `${Math.floor(20 * (fontScale / 100))}px Inter, sans-serif`;
      ctx.fillStyle = colors.accent;
      ctx.fillText(domains, canvasWidth / 2, canvasHeight - 50);
    }

    // Convert canvas to image URL
    const imageUrl = canvas.toDataURL("image/png");
    setPreviewUrl(imageUrl);
    setImageUrl(imageUrl);
    setIsGenerating(false);
  };

  // Save image URL to the job record
  const saveImageToJob = async () => {
    if (!imageUrl) return;

    setIsSaving(true);
    try {
      // Convert data URL to Blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create form data to upload the image
      const formData = new FormData();
      formData.append("image", blob, `job-${job.id}.png`);

      // Upload the image (this would use your image storage service)
      // For example, using Vercel Blob Storage or similar
      const uploadResponse = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const { url } = await uploadResponse.json();

      // Update the job record with the image URL
      await updateJobImageUrl(job.id, url);

      // Show success message and close dialog after a delay
      setSaved(true);
      setTimeout(() => {
        onClose();
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error("Error saving image:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Download the generated image
  const downloadImage = () => {
    if (!imageUrl) return;

    const link = document.createElement("a");
    link.download = `${job.company.name}-${job.title.replace(/\s+/g, "-")}.png`;
    link.href = imageUrl;
    link.click();
  };

  return (
    <div className="flex flex-col space-y-6">
      <Tabs defaultValue="design" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="design">Design Options</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Design Options Tab */}
        <TabsContent value="design" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base">Template</Label>
                <RadioGroup
                  defaultValue={selectedTemplate.id}
                  onValueChange={handleTemplateChange}
                  className="mt-2 grid grid-cols-2 gap-2"
                >
                  {TEMPLATES.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={template.id}
                        id={`template-${template.id}`}
                      />
                      <Label
                        htmlFor={`template-${template.id}`}
                        className="flex items-center gap-2"
                      >
                        <span
                          className="h-4 w-4 rounded-full"
                          style={{
                            backgroundColor: template.colors.background,
                          }}
                        />
                        {template.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base">Colors</Label>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Background</Label>
                    <input
                      type="color"
                      value={colors.background}
                      onChange={(e) =>
                        setColors({ ...colors, background: e.target.value })
                      }
                      className="h-8 w-full cursor-pointer rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Text</Label>
                    <input
                      type="color"
                      value={colors.text}
                      onChange={(e) =>
                        setColors({ ...colors, text: e.target.value })
                      }
                      className="h-8 w-full cursor-pointer rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Accent</Label>
                    <input
                      type="color"
                      value={colors.accent}
                      onChange={(e) =>
                        setColors({ ...colors, accent: e.target.value })
                      }
                      className="h-8 w-full cursor-pointer rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Font Size ({fontScale}%)</Label>
                <Slider
                  defaultValue={[100]}
                  min={50}
                  max={150}
                  step={5}
                  onValueChange={(value) => setFontScale(value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base">Logo Size ({logoScale}%)</Label>
                <Slider
                  defaultValue={[100]}
                  min={50}
                  max={150}
                  step={5}
                  onValueChange={(value) => setLogoScale(value[0])}
                />
              </div>
            </div>

            <div>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Job Preview</h3>
                    <div className="overflow-hidden rounded-lg border">
                      {previewUrl ? (
                        <Image
                          src={previewUrl}
                          alt={`${job.title} at ${job.company.name}`}
                          width={300}
                          height={300}
                          className="aspect-square w-full object-cover"
                        />
                      ) : (
                        <div className="bg-muted flex aspect-square w-full items-center justify-center">
                          <ImageIcon className="text-muted-foreground h-8 w-8" />
                          <span className="text-muted-foreground ml-2">
                            Preview will appear here
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  onClick={generateImage}
                  disabled={isGenerating}
                  variant="outline"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Generate Preview
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview">
          <div className="flex flex-col items-center space-y-6">
            {previewUrl ? (
              <div className="mx-auto max-w-md">
                <Image
                  src={previewUrl}
                  alt={`${job.title} at ${job.company.name}`}
                  width={600}
                  height={600}
                  className="w-full rounded-lg border shadow-lg"
                />
              </div>
            ) : (
              <div className="bg-muted flex aspect-square w-full max-w-md flex-col items-center justify-center rounded-lg">
                <ImageIcon className="text-muted-foreground mb-4 h-12 w-12" />
                <p className="text-muted-foreground max-w-xs text-center">
                  Generate a preview first by going to the Design tab and
                  clicking "Generate Preview"
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={downloadImage}
                disabled={!imageUrl || isSaving}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Image
              </Button>

              <Button
                onClick={saveImageToJob}
                disabled={!imageUrl || isSaving || saved}
              >
                {saved ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Saved!
                  </>
                ) : isSaving ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save to Job
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Hidden canvas for image generation */}
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ display: "none" }}
      />
    </div>
  );
}
