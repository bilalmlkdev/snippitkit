// export.js – fixed and improved
const node = document.getElementById("panel-to-export");
const copyBtn = document.getElementById("copy");
const copyLinkBtn = document.getElementById("copy-link");
const downloadAsPNG = document.getElementById("download-as-png");
const downloadAsSVG = document.getElementById("download-as-svg");

const toast = document.getElementById("toast");
const toastMsg = document.getElementById("toastMsg");
const toastIcon = document.getElementById("toastIcon");

// Utility: show toast message
let toastTimer = null;
function showToast({ text = "Copied", success = true, ms = 2200 } = {}) {
  if (!toast) return;
  toastMsg.textContent = text;
  toastIcon.textContent = success ? "✓" : "✗";
  toastIcon.style.color = success ? "#22c55e" : "#ef4444";
  toast.classList.add("show");
  toast.style.borderColor = success
    ? "rgba(34,197,94,0.18)"
    : "rgba(239,68,68,0.18)";
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, ms);
}

// Check if dom-to-image-more is loaded
function ensureDomToImage() {
  if (typeof domtoimage === "undefined") {
    showToast({
      text: "Export library not loaded yet",
      success: false,
      ms: 2500,
    });
    return false;
  }
  return true;
}

// download helper
function downloadUrl(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Get template name for filename
function getTemplateName(defaultName = "panel") {
  const input = document.querySelector(".template-name");
  const val = input?.value?.trim() || defaultName;
  // Remove invalid filename characters
  return val.replace(/[^a-zA-Z0-9\-_ ]/g, "");
}

//  SAVE AS PNG
downloadAsPNG?.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!ensureDomToImage()) return;
  try {
    const dataUrl = await domtoimage.toPng(node, { cacheBust: true });
    const name = getTemplateName("snippet") + ".png";
    downloadUrl(dataUrl, name);
    showToast({ text: "Exported Successfully!", ms: 2200, success: true });
  } catch (err) {
    console.error("PNG export failed:", err);
    showToast({ text: "PNG export failed", success: false, ms: 2500 });
  }
});

//  SAVE AS SVG
downloadAsSVG?.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!ensureDomToImage()) return;
  try {
    let svgStr = await domtoimage.toSvg(node, { cacheBust: true });

    // Ensure SVG declaration only if missing
    if (!svgStr.startsWith("<?xml") && !svgStr.startsWith("<svg")) {
      svgStr = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgStr;
    }

    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const name = getTemplateName("snippet") + ".svg";
    downloadUrl(url, name);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    showToast({ text: "SVG Exported!", ms: 2200, success: true });
  } catch (err) {
    console.error("SVG export failed:", err);
    showToast({ text: "SVG export failed", success: false, ms: 2500 });
  }
});

//  COPY IMAGE TO CLIPBOARD (PNG)
copyBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!ensureDomToImage()) return;

  // Check if clipboard API is available
  if (!navigator.clipboard || !navigator.clipboard.write) {
    showToast({
      text: "Clipboard write not supported (HTTPS required)",
      success: false,
      ms: 3000,
    });
    return;
  }

  try {
    const blob = await domtoimage.toBlob(node, { cacheBust: true });
    if (!blob) throw new Error("No blob generated");

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);
    showToast({ text: "Image Copied!", ms: 2200, success: true });
  } catch (err) {
    console.error("Copy image failed:", err);
    // Fallback: try copying as data URL
    try {
      const dataUrl = await domtoimage.toPng(node, { cacheBust: true });
      await navigator.clipboard.writeText(dataUrl);
      showToast({ text: "Copied as data URL", ms: 2500, success: true });
    } catch (fallbackErr) {
      showToast({
        text: "Copy failed – try downloading instead",
        success: false,
        ms: 3000,
      });
    }
  }
});

//  COPY DATA URL AS TEXT
copyLinkBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!ensureDomToImage()) return;

  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    showToast({
      text: "Clipboard write not supported (HTTPS required)",
      success: false,
      ms: 3000,
    });
    return;
  }

  try {
    const dataUrl = await domtoimage.toPng(node, { cacheBust: true });
    await navigator.clipboard.writeText(dataUrl);
    showToast({ text: "Data URL copied!", ms: 2200, success: true });
  } catch (err) {
    console.error("Copy link failed:", err);
    showToast({ text: "Failed to copy data URL", success: false, ms: 2500 });
  }
});

//  EXPORT BUTTON TOGGLE 
const exportBtn = document.querySelector(".export-btn");
const exportOptions = document.querySelector(".export-options");

exportBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  exportOptions?.classList.toggle("export-options-active");
});

document.addEventListener("click", (e) => {
  if (
    exportOptions &&
    !exportOptions.contains(e.target) &&
    e.target !== exportBtn
  ) {
    exportOptions.classList.remove("export-options-active");
  }
});
