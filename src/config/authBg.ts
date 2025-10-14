// Central configuration for authentication page background styling
// Adjust these values to tune appearance without editing component code.
export const authBackgroundConfig = {
  imageUrl: '/src/assets/images/coffee.jpg',
  zoom: 1, // scale factor
  brightness: 0.8, // 0(dark) -> 1(normal)
  blurPx: 0, // background blur in px
  overlayOpacity: 0.2, // 0 -> 1
};

interface AuthBgVars extends React.CSSProperties {
  '--auth-img-url'?: string;
  '--auth-img-transform'?: string;
  '--auth-img-filter'?: string;
  '--auth-blur'?: string;
  '--auth-overlay-opacity'?: string;
}

export function authBgStyle(): AuthBgVars {
  const { imageUrl, zoom, brightness, blurPx, overlayOpacity } = authBackgroundConfig;
  return {
    '--auth-img-url': `url(${imageUrl})`,
    '--auth-img-transform': `scale(${zoom})`,
    '--auth-img-filter': `brightness(${brightness}) saturate(1.05)`,
    '--auth-blur': `blur(${blurPx}px)`,
    '--auth-overlay-opacity': `${overlayOpacity}`,
  };
}
