import AppKit
import CoreText

// The social card, generated rather than drawn by hand.
//
// It uses the SITE's own face and the APP's own colours: EB Garamond from
// `assets/fonts` (registered at runtime — no Garamond ships with macOS), the
// chrome from `Tokens.swift`, and the eight account hues from `Palette.swift`.
// Generating it means the card cannot drift from the page it represents, which
// a hand-made JPEG always eventually does.
//
//   swift scripts/og-image.swift <out.png>

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

let chrome = NSColor(srgbRed: 0x1A/255, green: 0x18/255, blue: 0x1E/255, alpha: 1)
let t1 = NSColor(srgbRed: 0xEF/255, green: 0xEE/255, blue: 0xF2/255, alpha: 1)
let t3 = NSColor(srgbRed: 0x9A/255, green: 0x98/255, blue: 0x9E/255, alpha: 1)
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

chrome.setFill()
NSRect(x: 0, y: 0, width: W, height: H).fill()

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
let headline = NSAttributedString(string: "Your mail\nis not a list.", attributes: [
    .font: serif(104),
    .foregroundColor: t1,
    .paragraphStyle: { let p = NSMutableParagraphStyle(); p.lineHeightMultiple = 0.92; return p }(),
])
ctx.saveGraphicsState()
let tx = NSAffineTransform()
tx.translateX(by: 84, yBy: 0)
tx.scaleX(by: 0.92, yBy: 1)
tx.concat()
headline.draw(in: NSRect(x: 0, y: 214, width: 1000, height: 250))
ctx.restoreGraphicsState()

// ---- the subline ----------------------------------------------------------
let sub = NSAttributedString(string: "A Mac mail client shaped like a conversation.", attributes: [
    .font: NSFont.systemFont(ofSize: 30, weight: .regular),
    .foregroundColor: t3,
])
sub.draw(at: NSPoint(x: 84, y: 150))

NSGraphicsContext.restoreGraphicsState()
guard let png = rep.representation(using: .png, properties: [:]) else { exit(1) }
try! png.write(to: URL(fileURLWithPath: out))
print("wrote \(out)  \(Int(W))x\(Int(H))  \(png.count / 1024) KB")
