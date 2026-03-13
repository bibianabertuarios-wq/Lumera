import struct, zlib

def clamp(v): return max(0, min(255, int(v)))

def make_png(size):
    bg = (253, 248, 243)
    purple = (155, 142, 196)
    gold = (201, 147, 90)
    rows = []
    for y in range(size):
        row = []
        for x in range(size):
            cx = x - size/2
            cy = y - size/2
            r = size/2 * 0.85
            dist = (cx**2 + cy**2)**0.5
            # fondo crema opaco
            px = [clamp(bg[0]), clamp(bg[1]), clamp(bg[2]), 255]
            # luna lila
            inner = ((cx - r*0.2)**2 + cy**2)**0.5
            if dist < r and inner > r*0.72:
                px = [clamp(purple[0]), clamp(purple[1]), clamp(purple[2]), 220]
            # llama dorada
            fx, fy = cx/r, cy/r
            if abs(fx) < 0.13 and abs(fx) + abs(fy + 0.05) < 0.44:
                px = [clamp(gold[0]), clamp(gold[1]), clamp(gold[2]), 240]
            row.append(px)
        rows.append(row)

    raw = b''
    for row in rows:
        raw += b'\x00'
        for px in row:
            raw += bytes(px)

    def chunk(name, data):
        c = name + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)

    return (b'\x89PNG\r\n\x1a\n'
        + chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0))
        + chunk(b'IDAT', zlib.compress(raw))
        + chunk(b'IEND', b''))

open('public/icon-192.png','wb').write(make_png(192))
open('public/icon-512.png','wb').write(make_png(512))
print("✅ Iconos OK")
