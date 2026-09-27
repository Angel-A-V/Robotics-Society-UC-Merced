// ── ASCII Logo ─────────────────────────────────────────────────────────
// The homepage hero logo, redrawn as a spinning 3D ASCII sculpture.
// Drag to orbit it, click to spin the gear; the cursor scrambles nearby
// characters.
//
// The drawing itself is the <rs-ascii-logo> web component in
// rs-ascii-logo.js, which builds the 3D shape from the blue (gear) and gold
// (letters) pixels of the logo image. This wrapper just registers it and
// points it at the bundled logo.
//
// Usage:  <AsciiLogo />
// Styles: .ascii-logo in styles/pages/home.css

import './rs-ascii-logo.js'
import rblogo from '../../../assets/rblogo.jpg'

export default function AsciiLogo({ className = '' }) {
  return (
    <rs-ascii-logo
      class={`ascii-logo ${className}`}
      src={rblogo}
      palette="Logo"
      ramp="Classic"
      effect="Scramble"
      transparent=""       // Let the hero grid show through
      role="img"
      aria-label="UCM Robotics Society logo"
    />
  )
}
