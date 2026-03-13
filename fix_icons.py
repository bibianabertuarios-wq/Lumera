import struct, zlib, base64

def make_png(size, bg=(253,248,243), fg=(201,147,90), purple=(155,142,196)):
    img = []
    for y in range(size):
        row = []
        for x in range(size):
            cx, cy = x - size/2, y - size/2
            r = size/2
            # Fondo crema
            px = list(bg) + [255]
            # Luna (media luna lila)
            dist = (cx**2 + cy**2)**0.5
            inner = ((cx-r*0.18)**2 + cy**2)**0.5
            if dist < r*0.82 and inner > r*0.62:
                alpha = min(255, int(220 * (1 - abs(dist - r*0.72)/(r*0.15))))
                px = [purple[0], purple[1], purple[2], alpha]
            # Llama dorada (rombo central)
            fx, fy = cx/r, cy/r
            if abs(fx) < 0.12 and abs(fy) < 0.38 and abs(fx) + abs(fy+0.05) < 0.42:
                px = list(fg) + [230]
            row.append(px)
        img.append(row)

    def write_png(pixels, w, h):
        def chunk(name, data):
            c = name + data
            return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)
        raw = b''
        for row in pixels:
            raw += b'\x00'
            for px in row:
                raw += bytes(px)
        return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(raw)) + chunk(b'IEND', b'')

    return write_png(img, size, size)

open('public/icon-192.png','wb').write(make_png(192))
open('public/icon-512.png','wb').write(make_png(512))
print("✅ Iconos generados")
