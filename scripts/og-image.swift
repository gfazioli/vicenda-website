import AppKit
import CoreText

// The social card, generated rather than drawn by hand.
//
// It uses the SITE's own face and the APP's own colours: EB Garamond from
// `assets/fonts` (registered at runtime — no Garamond ships with macOS), the
// night ground and its cobalt light from `Palette.Logo`, and the eight account
// hues from `Palette.swift`. The words are the hero's (`Hero.tsx`).
// Generating it means the card cannot drift from the page it represents, which
// a hand-made JPEG always eventually does.
//
//   swift scripts/og-image.swift <out.png>
//
// It writes `app/opengraph-image.png`; `app/twitter-image.png` is the same file,
// copied (`cp app/opengraph-image.png app/twitter-image.png`).

let out = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "app/opengraph-image.png"
let W = 1200.0, H = 630.0

// ---- the face -------------------------------------------------------------
let fontURL = URL(fileURLWithPath: "assets/fonts/EBGaramond.ttf")
var cfError: Unmanaged<CFError>?
CTFontManagerRegisterFontsForURL(fontURL as CFURL, .process, &cfError)

func serif(_ size: CGFloat, weight: CGFloat = 0) -> NSFont {
    for name in ["EBGaramond-Regular", "EB Garamond", "EBGaramond"] {
        if let f = NSFont(name: name, size: size) { return f }
    }
    FileHandle.standardError.write(Data("EB Garamond did not register; falling back\n".utf8))
    return NSFont(name: "Hoefler Text", size: size) ?? .systemFont(ofSize: size)
}

func hex(_ v: UInt32, _ a: CGFloat = 1) -> NSColor {
    NSColor(srgbRed: CGFloat((v >> 16) & 0xFF)/255, green: CGFloat((v >> 8) & 0xFF)/255,
            blue: CGFloat(v & 0xFF)/255, alpha: a)
}
// `Palette.Logo.ground(dark: true)`, its cobalt glow, and the logo's ice.
let ground = [hex(0x09112F), hex(0x061340), hex(0x04164E)]
let cobalt = hex(0x0047B0)
let t1 = hex(0xE6ECF6)
let ice = hex(0xCCD9EC)
let ring = ["EB827B", "D8953D", "A2AE44", "4CBD88", "00BBCB", "60AAF3", "AB93ED", "DA83BE"]
    .map { hex -> NSColor in
        let v = UInt32(hex, radix: 16)!
        return NSColor(srgbRed: CGFloat((v >> 16) & 0xFF)/255,
                       green: CGFloat((v >> 8) & 0xFF)/255,
                       blue: CGFloat(v & 0xFF)/255, alpha: 1)
    }

guard let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: Int(W), pixelsHigh: Int(H),
                                 bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true,
                                 isPlanar: false, colorSpaceName: .deviceRGB,
                                 bytesPerRow: 0, bitsPerPixel: 0),
      let ctx = NSGraphicsContext(bitmapImageRep: rep) else { exit(1) }
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = ctx

// ---- the ground: the app's night, with its two lights -------------------
// The three stops along the diagonal, then each light fading linearly to its
// radius, as `Palette.Logo.night` draws the window (y runs up here).
NSGradient(colors: ground)!.draw(in: NSRect(x: 0, y: 0, width: W, height: H), angle: -28)
for (x, y, r, share) in [(0.85, 0.85, 520.0, 1.0), (0.2, 0.05, 480.0, 0.7)] {
    let centre = NSPoint(x: x * W, y: y * H)
    NSGradient(starting: cobalt.withAlphaComponent(0.42 * share), ending: cobalt.withAlphaComponent(0))!
        .draw(fromCenter: centre, radius: 0, toCenter: centre, radius: r, options: [])
}

// ---- the account ring, along the bottom edge ------------------------------
// The product's one graphic device. Full width, so it reads as a rail rather
// than as decoration.
let bandH = 8.0, seg = W / CGFloat(ring.count)
for (i, colour) in ring.enumerated() {
    colour.setFill()
    NSRect(x: CGFloat(i) * seg, y: 0, width: seg, height: bandH).fill()
}

// ---- the icon -------------------------------------------------------------
let iconSide = 84.0
if let icon = NSImage(contentsOfFile: "public/icon-512x512.png") {
    icon.draw(in: NSRect(x: 84, y: H - 84 - iconSide, width: iconSide, height: iconSide))
}
// The name beside it. A social card that shows only an icon is anonymous in a
// timeline: the mark has to say what it is called.
NSAttributedString(string: "Vicenda", attributes: [
    .font: serif(46),
    .foregroundColor: t1,
]).draw(at: NSPoint(x: 84 + iconSide + 20, y: H - 84 - iconSide + 20))

// ---- the headline ---------------------------------------------------------
// scaleX(0.92) is the same squeeze `.display-hero` applies on the page: Apple
// Garamond's condensed proportion, on the one line that carries the reference.
let headline = NSAttributedString(string: "Stop noticing\nyour email.", attributes: [
    .font: serif(104),
    .foregroundColor: t1,
    .paragraphStyle: { let p = NSMutableParagraphStyle(); p.lineHeightMultiple = 0.92; return p }(),
])
ctx.saveGraphicsState()
let tx = NSAffineTransform()
tx.translateX(by: 84, yBy: 0)
tx.scaleX(by: 0.92, yBy: 1)
tx.concat()
headline.draw(in: NSRect(x: 0, y: 186, width: 1000, height: 250))
ctx.restoreGraphicsState()

// ---- the subline ----------------------------------------------------------
let sub = NSAttributedString(string: "A morning of mail, turned into a few decisions. On your Mac.", attributes: [
    .font: NSFont.systemFont(ofSize: 30, weight: .regular),
    .foregroundColor: ice,
])
sub.draw(at: NSPoint(x: 84, y: 118))

NSGraphicsContext.restoreGraphicsState()
guard let png = rep.representation(using: .png, properties: [:]) else { exit(1) }
try! png.write(to: URL(fileURLWithPath: out))
print("wrote \(out)  \(Int(W))x\(Int(H))  \(png.count / 1024) KB")
