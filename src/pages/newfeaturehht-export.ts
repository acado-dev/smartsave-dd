import { slides } from "./newfeaturehht-content";

async function imgToDataURL(url: string): Promise<{ data: string; w: number; h: number }> {
  const res = await fetch(url);
  const blob = await res.blob();
  const data: string = await new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.readAsDataURL(blob);
  });
  const dims: { w: number; h: number } = await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = data;
  });
  return { data, w: dims.w, h: dims.h };
}

export async function downloadPPTX() {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
  pptx.title = "ITHINA Command Handheld — What's New";
  pptx.company = "ITHINA";

  const NAVY = "0F172A";
  const TEAL = "22B8C4";
  const RED = "E53E3E";
  const WHITE = "FFFFFF";
  const SLATE = "CBD5E1";
  const MUTED = "94A3B8";

  // Intro slide
  const s0 = pptx.addSlide();
  s0.background = { color: NAVY };
  s0.addText("ITHINA COMMAND · HANDHELD", {
    x: 0.5, y: 0.5, w: 12.3, h: 0.4,
    fontSize: 14, color: TEAL, bold: true, fontFace: "Calibri", charSpacing: 4,
  });
  s0.addText("What's New", {
    x: 0.5, y: 1.2, w: 12.3, h: 1.2,
    fontSize: 64, color: WHITE, bold: true, fontFace: "Calibri",
  });
  s0.addText("Built directly from your customer feedback", {
    x: 0.5, y: 2.5, w: 12.3, h: 0.8,
    fontSize: 32, color: SLATE, fontFace: "Calibri",
  });
  s0.addText(
    "Five focused improvements to the ITHINA Command handheld app — theming, a clickable dashboard, inline actions, and true bulk operations.",
    { x: 0.5, y: 3.6, w: 12.3, h: 1.0, fontSize: 20, color: MUTED, fontFace: "Calibri" },
  );
  slides.forEach((s, i) => {
    const x = 0.5 + i * 2.55;
    s0.addShape(pptx.ShapeType.roundRect, {
      x, y: 5.2, w: 2.4, h: 1.7, fill: { color: "1E293B" }, line: { color: "334155", width: 1 }, rectRadius: 0.1,
    });
    s0.addText(s.kicker.split("·")[0].trim(), {
      x: x + 0.15, y: 5.3, w: 2.1, h: 0.3, fontSize: 10, color: TEAL, bold: true, fontFace: "Calibri",
    });
    s0.addText(s.title, {
      x: x + 0.15, y: 5.6, w: 2.1, h: 1.2, fontSize: 13, color: WHITE, fontFace: "Calibri", valign: "top",
    });
  });

  // Feature slides
  for (const slide of slides) {
    const sl = pptx.addSlide();
    sl.background = { color: NAVY };

    // Accent bar
    sl.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.15, h: 7.5, fill: { color: RED } });

    sl.addText(slide.kicker, {
      x: 0.5, y: 0.4, w: 6, h: 0.4, fontSize: 14, color: TEAL, bold: true, fontFace: "Calibri", charSpacing: 3,
    });
    sl.addText(slide.title, {
      x: 0.5, y: 0.85, w: 6, h: 1.6, fontSize: 32, color: WHITE, bold: true, fontFace: "Calibri",
    });
    sl.addText(slide.summary, {
      x: 0.5, y: 2.55, w: 6, h: 1.6, fontSize: 14, color: SLATE, fontFace: "Calibri",
    });

    slide.bullets.forEach((b, i) => {
      const y = 4.3 + i * 0.7;
      sl.addShape(pptx.ShapeType.ellipse, {
        x: 0.5, y, w: 0.35, h: 0.35, fill: { color: TEAL }, line: { color: TEAL },
      });
      sl.addText("✓", { x: 0.5, y, w: 0.35, h: 0.35, fontSize: 14, color: NAVY, bold: true, align: "center", valign: "middle" });
      sl.addText(b.text, {
        x: 1.0, y: y - 0.05, w: 5.5, h: 0.6, fontSize: 14, color: WHITE, fontFace: "Calibri", valign: "middle",
      });
    });

    // Screenshots: dark + light
    const dark = await imgToDataURL(slide.dark);
    const light = await imgToDataURL(slide.light);

    const placeImage = async (img: { data: string; w: number; h: number }, boxX: number, boxY: number, boxW: number, boxH: number, label: string, tone: "dark" | "light") => {
      sl.addShape(pptx.ShapeType.roundRect, {
        x: boxX, y: boxY, w: boxW, h: boxH,
        fill: { color: tone === "dark" ? "020617" : "F1F5F9" },
        line: { color: "334155", width: 1 }, rectRadius: 0.08,
      });
      sl.addText(label, {
        x: boxX + 0.15, y: boxY + 0.1, w: boxW - 0.3, h: 0.3,
        fontSize: 10, color: tone === "dark" ? SLATE : "475569", bold: true, fontFace: "Calibri",
      });
      const pad = 0.25;
      const innerX = boxX + pad;
      const innerY = boxY + 0.5;
      const innerW = boxW - pad * 2;
      const innerH = boxH - 0.5 - pad;
      const ratio = img.w / img.h;
      let w = innerW;
      let h = w / ratio;
      if (h > innerH) { h = innerH; w = h * ratio; }
      sl.addImage({
        data: img.data,
        x: innerX + (innerW - w) / 2,
        y: innerY + (innerH - h) / 2,
        w, h,
      });
    };

    await placeImage(dark, 7.0, 0.5, 3.0, 6.5, "● Dark Mode", "dark");
    await placeImage(light, 10.2, 0.5, 3.0, 6.5, "○ Light Mode", "light");

    // Footer
    sl.addText("ITHINA Command · Handheld Release Notes", {
      x: 0.5, y: 7.1, w: 8, h: 0.3, fontSize: 10, color: MUTED, fontFace: "Calibri",
    });
  }

  await pptx.writeFile({ fileName: "ITHINA-Command-Handheld-Whats-New.pptx" });
}

export async function downloadPDF() {
  const { jsPDF } = await import("jspdf");
  // Landscape A4-ish: 13.33 x 7.5 inches => use letter landscape close enough
  const doc = new jsPDF({ orientation: "landscape", unit: "in", format: [13.33, 7.5] });
  const NAVY = "#0F172A";
  const TEAL = "#22B8C4";
  const RED = "#E53E3E";
  const WHITE = "#FFFFFF";
  const SLATE = "#CBD5E1";
  const MUTED = "#94A3B8";

  const drawBG = () => {
    doc.setFillColor(NAVY);
    doc.rect(0, 0, 13.33, 7.5, "F");
  };

  // Intro
  drawBG();
  doc.setFillColor(RED);
  doc.rect(0, 0, 0.15, 7.5, "F");
  doc.setTextColor(TEAL);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("ITHINA COMMAND · HANDHELD", 0.5, 0.7);
  doc.setTextColor(WHITE);
  doc.setFontSize(48);
  doc.text("What's New", 0.5, 1.9);
  doc.setFontSize(24);
  doc.setTextColor(SLATE);
  doc.setFont("helvetica", "normal");
  doc.text("Built directly from your customer feedback", 0.5, 2.7);
  doc.setFontSize(14);
  doc.setTextColor(MUTED);
  const wrapped = doc.splitTextToSize(
    "Five focused improvements to the ITHINA Command handheld app — theming, a clickable dashboard, inline actions, and true bulk operations.",
    12.3,
  );
  doc.text(wrapped, 0.5, 3.5);

  slides.forEach((s, i) => {
    const x = 0.5 + i * 2.55;
    doc.setFillColor("#1E293B");
    doc.roundedRect(x, 5.2, 2.4, 1.7, 0.1, 0.1, "F");
    doc.setTextColor(TEAL);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(s.kicker.split("·")[0].trim().toUpperCase(), x + 0.15, 5.45);
    doc.setTextColor(WHITE);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const tw = doc.splitTextToSize(s.title, 2.1);
    doc.text(tw, x + 0.15, 5.75);
  });

  for (const slide of slides) {
    doc.addPage([13.33, 7.5], "landscape");
    drawBG();
    doc.setFillColor(RED);
    doc.rect(0, 0, 0.15, 7.5, "F");

    doc.setTextColor(TEAL);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(slide.kicker.toUpperCase(), 0.5, 0.6);

    doc.setTextColor(WHITE);
    doc.setFontSize(26);
    const tw = doc.splitTextToSize(slide.title, 6);
    doc.text(tw, 0.5, 1.2);

    doc.setTextColor(SLATE);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const sw = doc.splitTextToSize(slide.summary, 6);
    doc.text(sw, 0.5, 2.6);

    slide.bullets.forEach((b, i) => {
      const y = 4.3 + i * 0.7;
      doc.setFillColor(TEAL);
      doc.circle(0.7, y + 0.05, 0.17, "F");
      doc.setTextColor(NAVY);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("✓", 0.62, y + 0.1);
      doc.setTextColor(WHITE);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      const bw = doc.splitTextToSize(b.text, 5.5);
      doc.text(bw, 1.05, y + 0.1);
    });

    // Screenshots
    const dark = await imgToDataURL(slide.dark);
    const light = await imgToDataURL(slide.light);
    const placeImg = (img: { data: string; w: number; h: number }, boxX: number, boxY: number, boxW: number, boxH: number, label: string, tone: "dark" | "light") => {
      doc.setFillColor(tone === "dark" ? "#020617" : "#F1F5F9");
      doc.roundedRect(boxX, boxY, boxW, boxH, 0.08, 0.08, "F");
      doc.setTextColor(tone === "dark" ? SLATE : "#475569");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(label, boxX + 0.15, boxY + 0.3);
      const pad = 0.25;
      const innerX = boxX + pad;
      const innerY = boxY + 0.5;
      const innerW = boxW - pad * 2;
      const innerH = boxH - 0.5 - pad;
      const ratio = img.w / img.h;
      let w = innerW, h = w / ratio;
      if (h > innerH) { h = innerH; w = h * ratio; }
      doc.addImage(img.data, "JPEG", innerX + (innerW - w) / 2, innerY + (innerH - h) / 2, w, h);
    };
    placeImg(dark, 7.0, 0.5, 3.0, 6.5, "● Dark Mode", "dark");
    placeImg(light, 10.2, 0.5, 3.0, 6.5, "○ Light Mode", "light");

    doc.setTextColor(MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("ITHINA Command · Handheld Release Notes", 0.5, 7.25);
  }

  doc.save("ITHINA-Command-Handheld-Whats-New.pdf");
}
