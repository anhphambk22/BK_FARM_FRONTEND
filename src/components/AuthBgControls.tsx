import React, { useState, useEffect } from 'react';

// Small panel to tweak background variables live (dev use)
export const AuthBgControls: React.FC = () => {
  const [zoom, setZoom] = useState(1.15); // matches auth-img-zoom-md
  const [darken, setDarken] = useState(0.72); // brightness value
  const [blur, setBlur] = useState(1.5); // px
  const [overlay, setOverlay] = useState(1); // opacity

  useEffect(() => {
    const root = document.querySelector('.auth-bg') as HTMLElement | null;
    if (!root) return;
    root.style.setProperty('--auth-img-transform', `scale(${zoom.toFixed(2)})`);
    root.style.setProperty('--auth-img-filter', `brightness(${darken.toFixed(2)}) saturate(1.05)`);
    root.style.setProperty('--auth-blur', `blur(${blur.toFixed(1)}px)`);
    root.style.setProperty('--auth-overlay-opacity', overlay.toString());
  }, [zoom, darken, blur, overlay]);

  // Hide in production builds
  if (import.meta.env.PROD) return null;

  const labelCls = 'text-xs font-medium text-white/80';
  const inputCls = 'w-full accent-emerald-400';

  return (
    <div className="fixed top-4 right-4 z-50 bg-emerald-900/70 backdrop-blur-md border border-white/15 rounded-lg p-3 w-56 text-white shadow-lg space-y-3">
      <h4 className="text-sm font-semibold">BG Adjust</h4>
      <div>
        <label className={labelCls}>Zoom {zoom.toFixed(2)}</label>
        <input className={inputCls} type="range" min={1} max={1.4} step={0.01} value={zoom} onChange={e => setZoom(parseFloat(e.target.value))} />
      </div>
      <div>
        <label className={labelCls}>Brightness {darken.toFixed(2)}</label>
        <input className={inputCls} type="range" min={0.5} max={1} step={0.01} value={darken} onChange={e => setDarken(parseFloat(e.target.value))} />
      </div>
      <div>
        <label className={labelCls}>Blur {blur.toFixed(1)}px</label>
        <input className={inputCls} type="range" min={0} max={8} step={0.1} value={blur} onChange={e => setBlur(parseFloat(e.target.value))} />
      </div>
      <div>
        <label className={labelCls}>Overlay {overlay.toFixed(2)}</label>
        <input className={inputCls} type="range" min={0.4} max={1} step={0.01} value={overlay} onChange={e => setOverlay(parseFloat(e.target.value))} />
      </div>
    </div>
  );
};

export default AuthBgControls;
