// Central configuration for authentication page background styling
// Adjust these values to tune appearance without editing component code.
export const authBackgroundConfig = {
  imageUrl: '/src/assets/images/coffee.jpg',
  zoom: 1, // scale factor
  brightness: 0.8, // 0(dark) -> 1(normal)
  blurPx: 0, // background blur in px
  overlayOpacity: 0.2, // 0 -> 1
};

export function authBgStyle(): React.CSSProperties {
  const { imageUrl, zoom, brightness, blurPx, overlayOpacity } = authBackgroundConfig;
  return {
    ['--auth-img-url' as any]: `url(${imageUrl})`,
    ['--auth-img-transform' as any]: `scale(${zoom})`,
    ['--auth-img-filter' as any]: `brightness(${brightness}) saturate(1.05)`,
    ['--auth-blur' as any]: `blur(${blurPx}px)`,
    ['--auth-overlay-opacity' as any]: `${overlayOpacity}`,
  } as React.CSSProperties;
}
