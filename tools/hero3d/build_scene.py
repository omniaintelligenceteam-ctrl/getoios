# The hero's model: a small business cut open, on a phone-shaped base, at dusk.
# Blender 5.2, headless:
#   blender -b --factory-startup -P tools/hero3d/build_scene.py -- --out <dir> [--stills] [--bake 4096] [--samples 256]
# It writes <dir>/shop.blend, stills (still-*.png), the two light bakes (atlas-off.png, atlas-on.png)
# and the mesh file (shop.bin: a JSON header, then positions, uvs, room ids and indices).
# Room ids: 0 outside, 1 the shop, 2 the home (assistant), 3 the office (chief of staff), 4 the back office (management team).
import bpy, bmesh, sys, os, json, math, random, struct
from mathutils import Vector, Matrix

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
def arg(name, default=None, flag=False):
    if name in argv:
        return True if flag else argv[argv.index(name) + 1]
    return default
OUT = os.path.abspath(arg('--out', '.'))
os.makedirs(OUT, exist_ok=True)
random.seed(7)

# ------------------------------------------------------------------ scene
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
col = scene.collection

def lin(c):  # sRGB hex to linear
    c = c.lstrip('#')
    v = [int(c[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in v]

MATS = {}
EMIT = []   # (material, strength when the lamps are on, strength when they are off)
def mat(hexc, emit=0.0, emit_off=0.0, emit_hex=None):
    key = (hexc, emit, emit_off, emit_hex)
    if key in MATS:
        return MATS[key]
    m = bpy.data.materials.new('m_' + hexc.lstrip('#') + ('_e' if emit else ''))
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value = (*lin(hexc), 1)
    b.inputs['Roughness'].default_value = 1.0
    if 'Specular IOR Level' in b.inputs:
        b.inputs['Specular IOR Level'].default_value = 0.0
    if emit or emit_off:
        b.inputs['Emission Color'].default_value = (*lin(emit_hex or hexc), 1)
        b.inputs['Emission Strength'].default_value = emit
        EMIT.append((b, emit, emit_off))
    MATS[key] = m
    return m

OBJS = []   # every mesh object, with its room and part
def add(name, bm, material, room=0, part=0):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    col.objects.link(ob)
    me.materials.append(material)
    try:
        me.set_sharp_from_angle(angle=0.6)
    except Exception:
        pass
    ob['room'] = room
    ob['part'] = part
    OBJS.append(ob)
    return ob

def box(name, size, loc, material, room=0, part=0, bevel=0.025, rz=0.0, rx=0.0):
    """size (x, y, z); loc = (centre x, centre y, bottom z)"""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=size, verts=bm.verts)
    b = min(bevel, min(size) * 0.45)
    if b > 0.002:
        bmesh.ops.bevel(bm, geom=bm.edges[:], offset=b, segments=2, profile=0.5, affect='EDGES')
    if rx:
        bmesh.ops.rotate(bm, cent=(0, 0, 0), matrix=Matrix.Rotation(rx, 3, 'X'), verts=bm.verts)
    if rz:
        bmesh.ops.rotate(bm, cent=(0, 0, 0), matrix=Matrix.Rotation(rz, 3, 'Z'), verts=bm.verts)
    bmesh.ops.translate(bm, vec=(loc[0], loc[1], loc[2] + size[2] / 2), verts=bm.verts)
    return add(name, bm, material, room, part)

def cyl(name, r, h, loc, material, room=0, part=0, r2=None, segs=20, axis='z', bevel=0.015):
    """loc = (centre x, centre y, bottom z) for axis z; the centre for axis x or y"""
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segs, radius1=r, radius2=r if r2 is None else r2, depth=h)
    b = min(bevel, r * 0.4, h * 0.4)
    if b > 0.002:
        rim = [e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) < 1e-5 and len(e.link_faces) == 2 and any(len(f.verts) > 4 for f in e.link_faces)]
        if rim:
            bmesh.ops.bevel(bm, geom=rim, offset=b, segments=2, profile=0.5, affect='EDGES')
    if axis == 'y':
        bmesh.ops.rotate(bm, cent=(0, 0, 0), matrix=Matrix.Rotation(math.pi / 2, 3, 'X'), verts=bm.verts)
        bmesh.ops.translate(bm, vec=loc, verts=bm.verts)
    elif axis == 'x':
        bmesh.ops.rotate(bm, cent=(0, 0, 0), matrix=Matrix.Rotation(math.pi / 2, 3, 'Y'), verts=bm.verts)
        bmesh.ops.translate(bm, vec=loc, verts=bm.verts)
    else:
        bmesh.ops.translate(bm, vec=(loc[0], loc[1], loc[2] + h / 2), verts=bm.verts)
    return add(name, bm, material, room, part)

def ball(name, r, loc, material, room=0, part=0, sub=2, squash=1.0):
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=sub, radius=r)
    if squash != 1.0:
        bmesh.ops.scale(bm, vec=(1, 1, squash), verts=bm.verts)
    bmesh.ops.translate(bm, vec=loc, verts=bm.verts)
    return add(name, bm, material, room, part)

ANCHORS = {}
def anchor(name, centre, w=0.0, h=0.0, **more):
    # Blender (x, y, z) to three.js (x, z, -y)
    ANCHORS[name] = {'p': [round(centre[0], 4), round(centre[2], 4), round(-centre[1], 4)], 'w': w, 'h': h, **more}

LIGHTS_ON = []
def lamp(name, loc, color, power, radius=0.12, on_only=True, kind='POINT', size=0.5, rot=None):
    ld = bpy.data.lights.new(name, kind)
    ld.color = lin(color)
    ld.energy = power
    if kind == 'POINT':
        ld.shadow_soft_size = radius
    elif kind == 'AREA':
        ld.size = size
    ob = bpy.data.objects.new(name, ld)
    ob.location = loc
    if rot:
        ob.rotation_euler = rot
    col.objects.link(ob)
    if on_only:
        LIGHTS_ON.append(ob)
    return ob

# ------------------------------------------------------------------ palette
C = dict(
    shell='#e7dfd2', shell_dk='#cfc6b8', roof='#3b3944', base='#141318', screen='#1b1a21', rim='#762bee',
    walk='#8f8c96', road='#26252c', stripe='#d8d4c8', curb='#a9a6ae',
    wood='#b07a4c', wood_dk='#6e4a30', wood_lt='#d3a878', white='#f3efe7', dark='#2a2832', mid='#6f7480', metal='#a3a8b1',
    purple='#762bee', purple_lt='#a887f5', green='#5c8f58', green_dk='#3f6e45', red='#d2553f', yellow='#e9b949', blue='#4f7fb8', teal='#3f9b93', pink='#e59a9a',
    w_shop='#efe5d3', f_shop='#b98a5e', w_team='#c9d6dc', f_team='#4f8f9b', w_home='#f1dbc4', f_home='#c9a27a', w_chief='#d5d2e6', f_chief='#4b4862',
    warm='#ffd9a0', glow='#fff1d6',
)
M = {k: mat(v) for k, v in C.items()}

# ------------------------------------------------------------------ measures
X0, X1, XD, T = -3.6, 3.6, 0.3, 0.16
Y0, Y1 = -0.2, 2.7
ZF0, ZC0, ZF1, ZC1, ZR = 0.14, 2.6, 2.78, 5.3, 5.48
YB = Y1 - T            # the inner face of the back wall
DEPTH = Y1 - Y0
YC = (Y0 + Y1) / 2

# ------------------------------------------------------------------ the base: a phone on its back
def rounded_slab(name, sx, sy, sz, r, loc, material, room=0, segs=10, small=0.03):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=(sx, sy, sz), verts=bm.verts)
    vert = [e for e in bm.edges if abs(e.verts[0].co.x - e.verts[1].co.x) < 1e-6 and abs(e.verts[0].co.y - e.verts[1].co.y) < 1e-6]
    bmesh.ops.bevel(bm, geom=vert, offset=r, segments=segs, profile=0.5, affect='EDGES')
    if small:
        flat = [e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) < 1e-6 and len(e.link_faces) == 2 and abs(e.link_faces[0].normal.z - e.link_faces[1].normal.z) > 0.5]
        bmesh.ops.bevel(bm, geom=flat, offset=small, segments=2, profile=0.5, affect='EDGES')
    bmesh.ops.translate(bm, vec=(loc[0], loc[1], loc[2] + sz / 2), verts=bm.verts)
    return add(name, bm, material, room)

BX, BY, BCY = 10.6, 7.0, -0.47
rounded_slab('base', BX, BY, 0.46, 1.15, (0, BCY, -0.5), M['base'], small=0.06)
rounded_slab('base_rim', BX + 0.05, BY + 0.05, 0.05, 1.17, (0, BCY, -0.2), mat(C['rim'], emit=3.0, emit_off=1.2), small=0.0)
rounded_slab('base_screen', BX - 0.5, BY - 0.5, 0.04, 0.95, (0, BCY, -0.04), M['screen'], small=0.012)

# ------------------------------------------------------------------ the street
box('walk', (9.7, 1.5, 0.09), (0, -0.95, 0), M['walk'], bevel=0.03)
box('curb', (9.7, 0.12, 0.11), (0, -1.74, 0), M['curb'], bevel=0.02)
box('yard_l', (1.25, 2.9, 0.09), (-4.225, 1.25, 0), M['walk'], bevel=0.03)
box('yard_r', (1.25, 2.9, 0.09), (4.225, 1.25, 0), M['walk'], bevel=0.03)
box('road', (9.9, 1.9, 0.03), (0, -2.78, 0), M['road'], bevel=0.01)
for i in range(7):
    box(f'dash{i}', (0.62, 0.09, 0.012), (-4.2 + i * 1.4, -2.78, 0.03), M['stripe'], bevel=0.0)
for i in range(5):
    box(f'cross{i}', (0.2, 1.5, 0.012), (-2.9 + i * 0.36, -2.78, 0.035), M['stripe'], bevel=0.0)

def tree(x, y, s=1.0):
    cyl('trunk', 0.085 * s, 1.25 * s, (x, y, 0.09), M['wood_dk'], segs=10)
    box('treebed', (0.6 * s, 0.6 * s, 0.05), (x, y, 0.08), M['dark'], bevel=0.015)
    ball('leaf1', 0.62 * s, (x, y, 1.75 * s), M['green'], sub=2)
    ball('leaf2', 0.46 * s, (x + 0.36 * s, y + 0.1, 1.45 * s), M['green_dk'], sub=2)
    ball('leaf3', 0.42 * s, (x - 0.3 * s, y - 0.12, 2.1 * s), M['green_dk'], sub=2)
tree(-4.3, 0.75, 1.0)
tree(4.3, 1.9, 0.85)

def street_lamp(x, y):
    cyl('lamp_base', 0.11, 0.16, (x, y, 0.09), M['dark'], segs=12)
    cyl('lamp_pole', 0.04, 2.55, (x, y, 0.09), M['dark'], segs=10, bevel=0)
    box('lamp_arm', (0.06, 0.55, 0.05), (x, y - 0.24, 2.6), M['dark'], bevel=0.015)
    box('lamp_head', (0.2, 0.34, 0.08), (x, y - 0.45, 2.55), M['dark'], bevel=0.03)
    box('lamp_glass', (0.14, 0.26, 0.03), (x, y - 0.45, 2.525), mat(C['glow'], emit=14.0, emit_off=14.0), bevel=0.01)
    lamp('L_street', (x, y - 0.45, 2.42), C['warm'], 220, radius=0.1, on_only=False)
street_lamp(-3.62, -1.25)

# bench
box('bench_seat', (0.95, 0.36, 0.06), (-4.25, -0.75, 0.47), M['wood'], bevel=0.02)
box('bench_back', (0.95, 0.06, 0.34), (-4.25, -0.59, 0.6), M['wood'], bevel=0.02)
for dx in (-0.4, 0.4):
    box('bench_leg', (0.07, 0.34, 0.4), (-4.25 + dx, -0.75, 0.09), M['dark'], bevel=0.015)
# mailbox, hydrant, sandwich board, planters, crates, bike rack
cyl('mail_post', 0.04, 0.75, (0.3, -1.35, 0.09), M['dark'], segs=8, bevel=0)
box('mailbox', (0.34, 0.26, 0.4), (0.3, -1.35, 0.8), M['purple'], bevel=0.06)
box('mail_slot', (0.22, 0.02, 0.04), (0.3, -1.485, 1.05), M['dark'], bevel=0.0)
cyl('hydrant', 0.085, 0.36, (1.2, -1.5, 0.09), M['red'], segs=12)
ball('hydrant_top', 0.095, (1.2, -1.5, 0.48), M['red'], sub=2)
cyl('hydrant_arm', 0.04, 0.26, (1.2, -1.5, 0.33), M['red'], segs=8, axis='x', bevel=0)
box('board_a', (0.46, 0.05, 0.72), (-2.6, -1.12, 0.09), M['dark'], bevel=0.02, rx=0.26)
box('board_b', (0.46, 0.05, 0.72), (-2.6, -0.92, 0.09), M['dark'], bevel=0.02, rx=-0.26)
box('board_face', (0.38, 0.02, 0.56), (-2.6, -1.155, 0.17), M['white'], bevel=0.0, rx=0.26)
for (px, py) in ((-3.3, -0.55), (3.3, -0.55)):
    box('planter', (0.5, 0.36, 0.34), (px, py, 0.09), M['shell_dk'], bevel=0.04)
    ball('bush', 0.25, (px - 0.07, py, 0.56), M['green'], sub=2, squash=0.85)
    ball('bush2', 0.2, (px + 0.12, py + 0.02, 0.6), M['green_dk'], sub=2)
for i, (cx, cy, cz, cc) in enumerate(((-4.45, 2.2, 0.09, 'wood_lt'), (-4.0, 2.25, 0.09, 'wood'), (-4.22, 2.22, 0.45, 'wood_lt'), (-3.95, 1.7, 0.09, 'wood'))):
    box(f'crate{i}', (0.42, 0.42, 0.36), (cx, cy, cz), M[cc], bevel=0.02, rz=0.1 * i)
for i in range(3):
    cyl(f'rack{i}', 0.022, 0.5, (4.0 + i * 0.24, 1.0, 0.09), M['metal'], segs=8, bevel=0)
box('rack_top', (0.58, 0.045, 0.045), (4.24, 1.0, 0.57), M['metal'], bevel=0.015)
cyl('bin', 0.2, 0.52, (4.55, 0.2, 0.09), M['mid'], segs=14, r2=0.23)
cyl('bin_lid', 0.24, 0.05, (4.55, 0.2, 0.61), M['dark'], segs=14)

# the van: one part, so the page can move it
def van(x, y):
    P = 1
    box('van_body', (1.55, 1.02, 0.98), (x - 0.38, y, 0.3), M['white'], part=P, bevel=0.1)
    box('van_cab', (0.82, 1.0, 0.72), (x + 0.76, y, 0.3), M['white'], part=P, bevel=0.12)
    box('van_hood', (0.3, 0.98, 0.42), (x + 1.2, y, 0.3), M['white'], part=P, bevel=0.1)
    box('van_stripe', (1.57, 1.04, 0.2), (x - 0.38, y, 0.62), M['purple'], part=P, bevel=0.02)
    box('van_wind', (0.5, 1.02, 0.34), (x + 0.86, y, 0.64), M['dark'], part=P, bevel=0.04)
    box('van_front', (0.04, 0.84, 0.3), (x + 1.165, y, 0.66), M['dark'], part=P, bevel=0.01, rz=0.0)
    box('van_bump', (0.08, 1.0, 0.12), (x + 1.34, y, 0.3), M['dark'], part=P, bevel=0.03)
    box('van_bump2', (0.08, 1.0, 0.12), (x - 1.17, y, 0.3), M['dark'], part=P, bevel=0.03)
    for (lx, ly) in ((1.345, 0.34), (1.345, -0.34)):
        box('van_light', (0.03, 0.18, 0.1), (x + lx, y + ly, 0.5), mat(C['glow'], emit=6.0, emit_off=6.0), part=P, bevel=0.01)
    for wx in (-0.7, 0.85):
        for wy in (-0.5, 0.5):
            cyl('van_wheel', 0.24, 0.16, (x + wx, y + wy, 0.24 + 0.09 - 0.06), M['dark'], part=P, segs=16, axis='y', bevel=0.04)
            cyl('van_hub', 0.1, 0.17, (x + wx, y + wy, 0.24 + 0.09 - 0.06), M['metal'], part=P, segs=10, axis='y', bevel=0.01)
    box('van_rack', (1.2, 0.8, 0.04), (x - 0.38, y, 1.3), M['metal'], part=P, bevel=0.015)
VAN = (3.45, -2.75)
van(*VAN)
anchor('van', (VAN[0], VAN[1], 0.8))

# ------------------------------------------------------------------ the building's shell (room 0)
S = M['shell']
box('slab0', (X1 - X0, DEPTH, ZF0 - 0.02), (0, YC, 0.02), M['shell_dk'], bevel=0.02)
box('slab1', (X1 - X0, DEPTH, ZF1 - ZC0), (0, YC, ZC0), S, bevel=0.02)
box('slab2', (X1 - X0 + 0.16, DEPTH + 0.16, ZR - ZC1), (0, YC, ZC1), S, bevel=0.03)
box('back', (X1 - X0, T, ZC1 - 0.02), (0, Y1 - T / 2, 0.02), S, bevel=0.02)
box('divider0', (T, DEPTH - T, ZC0 - ZF0), (XD, YC - T / 2, ZF0), S, bevel=0.02)
box('divider1', (T, DEPTH - T, ZC1 - ZF1), (XD, YC - T / 2, ZF1), S, bevel=0.02)

def side_wall(x, z0, z1, win=None):
    """a side wall from z0 to z1, with one window (y0, y1, z0, z1) cut out as four boxes"""
    d = DEPTH - T
    yc = YC - T / 2
    if not win:
        box('side', (T, d, z1 - z0), (x, yc, z0), S, bevel=0.02)
        return
    wy0, wy1, wz0, wz1 = win
    box('side_lo', (T, d, wz0 - z0), (x, yc, z0), S, bevel=0.02)
    box('side_hi', (T, d, z1 - wz1), (x, yc, wz1), S, bevel=0.02)
    box('side_f', (T, wy0 - Y0, wz1 - wz0), (x, (Y0 + wy0) / 2, wz0), S, bevel=0.02)
    box('side_b', (T, (Y1 - T) - wy1, wz1 - wz0), (x, (wy1 + Y1 - T) / 2, wz0), S, bevel=0.02)
    box('sill', (T + 0.1, wy1 - wy0 + 0.1, 0.05), (x, (wy0 + wy1) / 2, wz0 - 0.03), M['shell_dk'], bevel=0.015)
    box('mullion', (0.04, 0.04, wz1 - wz0), (x, (wy0 + wy1) / 2, wz0), M['shell_dk'], bevel=0.0)
side_wall(X0 + T / 2, ZF0, ZC0, (0.7, 2.1, 0.95, 1.85))
side_wall(X0 + T / 2, ZF1, ZC1, (0.9, 2.1, 3.7, 4.6))
side_wall(X1 - T / 2, ZF0, ZC0, (0.8, 2.0, 1.05, 1.85))
side_wall(X1 - T / 2, ZF1, ZC1, (0.9, 2.1, 3.7, 4.6))

# the roof
for (sx, sy, cx, cy) in ((X1 - X0 + 0.16, 0.14, 0, Y0 - 0.01), (X1 - X0 + 0.16, 0.14, 0, Y1 + 0.01), (0.14, DEPTH + 0.16, X0 - 0.01, YC), (0.14, DEPTH + 0.16, X1 + 0.01, YC)):
    box('parapet', (sx, sy, 0.26), (cx, cy, ZR), S, bevel=0.03)
box('roof_top', (X1 - X0 - 0.2, DEPTH - 0.2, 0.03), (0, YC, ZR), M['roof'], bevel=0.0)
box('ac', (1.0, 0.72, 0.5), (2.35, 1.9, ZR + 0.03), M['metal'], bevel=0.05)
cyl('ac_fan', 0.26, 0.05, (2.35, 1.9, ZR + 0.53), M['dark'], segs=18)
box('ac_grill', (0.6, 0.02, 0.26), (2.35, 1.535, ZR + 0.15), M['dark'], bevel=0.0)
cyl('tank', 0.42, 0.75, (-2.6, 1.95, ZR + 0.25), M['wood'], segs=18)
cyl('tank_roof', 0.47, 0.3, (-2.6, 1.95, ZR + 1.0), M['dark'], segs=18, r2=0.03, bevel=0)
for (lx, ly) in ((-2.9, 1.7), (-2.3, 1.7), (-2.9, 2.25), (-2.3, 2.25)):
    cyl('tank_leg', 0.03, 0.27, (lx, ly, ZR + 0.03), M['dark'], segs=6, bevel=0)
cyl('vent', 0.08, 0.5, (0.9, 2.2, ZR + 0.03), M['metal'], segs=10)
cyl('vent_cap', 0.13, 0.07, (0.9, 2.2, ZR + 0.53), M['dark'], segs=10)
box('roof_planter', (1.2, 0.34, 0.26), (-0.6, 2.3, ZR + 0.03), M['wood_dk'], bevel=0.03)
for i in range(4):
    ball('roof_bush', 0.17 + 0.03 * (i % 2), (-1.05 + i * 0.3, 2.3, ZR + 0.38), M['green' if i % 2 else 'green_dk'], sub=2)
for i in range(15):
    bx = X0 + 0.35 + i * (X1 - X0 - 0.7) / 14
    sag = 0.1 * math.sin(math.pi * ((i % 7) / 7 + 0.07))
    ball('bulb_r', 0.05, (bx, Y0 - 0.12, ZC1 - 0.02 - sag), mat(C['glow'], emit=9.0, emit_off=9.0, emit_hex=C['warm']), sub=1)
box('wire', (X1 - X0 - 0.5, 0.012, 0.012), (0, Y0 - 0.12, ZC1 + 0.04), M['dark'], bevel=0.0)
for i in range(9):
    box('awning', (0.44, 0.42, 0.035), (X0 + 0.24 + i * 0.44, Y0 - 0.18, ZC0 + 0.06), M['purple' if i % 2 == 0 else 'white'], bevel=0.0, rx=-0.32)
# the sign's frame: the page draws the sign itself
SIGN_W, SIGN_H, SIGN_Z = 3.3, 1.0, ZR + 0.62
for dx in (-1.35, 1.35):
    cyl('sign_post', 0.035, SIGN_Z - ZR + 0.2, (dx, 0.12, ZR + 0.03), M['dark'], segs=8, bevel=0)
    box('sign_brace', (0.04, 0.5, 0.04), (dx, 0.34, ZR + 0.28), M['dark'], bevel=0.0, rx=0.75)
box('sign_frame', (SIGN_W + 0.14, 0.07, SIGN_H + 0.14), (0, 0.06, SIGN_Z - 0.07), M['dark'], bevel=0.03)
anchor('sign', (0, 0.02, SIGN_Z + SIGN_H / 2), SIGN_W, SIGN_H)
box('sign_glow', (SIGN_W, 0.01, SIGN_H), (0, 0.02, SIGN_Z), mat('#201a33', emit=0.5, emit_off=0.5, emit_hex=C['purple_lt']), part=9, bevel=0.0)
lamp('L_sign', (0, -0.5, SIGN_Z + 0.4), C['purple_lt'], 60, radius=0.6, on_only=False)

# ------------------------------------------------------------------ helpers for the rooms
def liner(room, x0, x1, zf, zc, wall, floor):
    w = x1 - x0
    box('floor', (w, DEPTH - T, 0.03), ((x0 + x1) / 2, YC - T / 2, zf - 0.005), M[floor], room=room, bevel=0.0)
    box('lin_back', (w, 0.03, zc - zf), ((x0 + x1) / 2, YB - 0.015, zf), M[wall], room=room, bevel=0.0)
    box('lin_l', (0.03, DEPTH - T, zc - zf), (x0 + 0.015, YC - T / 2, zf), M[wall], room=room, bevel=0.0)
    box('lin_r', (0.03, DEPTH - T, zc - zf), (x1 - 0.015, YC - T / 2, zf), M[wall], room=room, bevel=0.0)
    box('lin_top', (w, DEPTH - T, 0.03), ((x0 + x1) / 2, YC - T / 2, zc - 0.03), M['white'], room=room, bevel=0.0)
    box('skirt', (w, 0.03, 0.1), ((x0 + x1) / 2, YB - 0.04, zf), M['white'], room=room, bevel=0.0)

def window_hole(room, x, y0, y1, z0, z1):
    """the liner covers the side window: a bright pane stands in for the dusk sky"""
    box('pane', (0.05, y1 - y0, z1 - z0), (x, (y0 + y1) / 2, z0), mat('#27304d', emit=0.6, emit_off=0.6, emit_hex='#5a6fb0'), room=room, bevel=0.0)

def chair(x, y, z, room, rz=0.0, c='wood', seat='purple'):
    m = Matrix.Rotation(rz, 3, 'Z')
    def at(dx, dy):
        v = m @ Vector((dx, dy, 0))
        return x + v.x, y + v.y
    px, py = at(0, 0)
    box('ch_seat', (0.36, 0.36, 0.05), (px, py, z + 0.4), M[seat], room=room, bevel=0.02, rz=rz)
    bx, by = at(0, 0.17)
    box('ch_back', (0.36, 0.045, 0.42), (bx, by, z + 0.42), M[c], room=room, bevel=0.02, rz=rz)
    for (dx, dy) in ((-0.15, -0.15), (0.15, -0.15), (-0.15, 0.15), (0.15, 0.15)):
        lx, ly = at(dx, dy)
        cyl('ch_leg', 0.022, 0.4, (lx, ly, z), M[c], room=room, segs=6, bevel=0)

def office_chair(x, y, z, room, rz=0.0):
    m = Matrix.Rotation(rz, 3, 'Z')
    v = m @ Vector((0, 0.19, 0))
    cyl('oc_base', 0.22, 0.04, (x, y, z), M['dark'], room=room, segs=5)
    cyl('oc_post', 0.03, 0.36, (x, y, z + 0.03), M['metal'], room=room, segs=8, bevel=0)
    box('oc_seat', (0.44, 0.42, 0.09), (x, y, z + 0.38), M['dark'], room=room, bevel=0.04, rz=rz)
    box('oc_back', (0.42, 0.07, 0.5), (x + v.x, y + v.y, z + 0.5), M['dark'], room=room, bevel=0.035, rz=rz)

def pendant(x, y, zc, drop, room, color=C['warm'], power=70, shade='dark'):
    cyl('cord', 0.008, drop, (x, y, zc - drop), M['dark'], room=room, segs=6, bevel=0)
    cyl('shade', 0.2, 0.17, (x, y, zc - drop - 0.17), M[shade], room=room, segs=18, r2=0.06, bevel=0)
    ball('bulb', 0.055, (x, y, zc - drop - 0.16), mat(C['glow'], emit=30.0, emit_off=0.0), room=room, sub=1)
    lamp('L_pend', (x, y, zc - drop - 0.3), color, power, radius=0.09)

def plant(x, y, z, room, s=1.0):
    cyl('pot', 0.14 * s, 0.24 * s, (x, y, z), M['white'], room=room, segs=12, r2=0.17 * s)
    ball('pl1', 0.22 * s, (x, y, z + 0.46 * s), M['green'], room=room, sub=2, squash=1.2)
    ball('pl2', 0.15 * s, (x + 0.1 * s, y - 0.06 * s, z + 0.66 * s), M['green_dk'], room=room, sub=2)

def screen(name, room, cx, y, cz, w, h, color, strength, frame=0.05, depth=0.05, standin=True):
    """a dark frame on a wall that faces the front; the page draws the picture, a glowing plane stands in for the bake"""
    box(name + '_frame', (w + frame * 2, depth, h + frame * 2), (cx, y - depth / 2, cz - h / 2 - frame), M['dark'], room=room, bevel=0.015)
    yf = y - depth - 0.006
    anchor(name, (cx, yf, cz), w, h, room=room)
    if standin:
        box(name + '_glow', (w, 0.004, h), (cx, yf, cz - h / 2), mat('#15131c', emit=strength, emit_off=strength * 0.25, emit_hex=color), room=room, part=9, bevel=0.0)

# ------------------------------------------------------------------ room 1: the shop (ground floor, left)
R = 1
sx0, sx1 = X0 + T, XD - T / 2
liner(R, sx0, sx1, ZF0, ZC0, 'w_shop', 'f_shop')
window_hole(R, sx0 + 0.035, 0.7, 2.1, 0.95, 1.85)
z = ZF0 + 0.02
# back shelves with goods
for i, sz in enumerate((1.05, 1.47, 1.89)):
    box('shelf', (2.5, 0.28, 0.045), (-1.95, YB - 0.17, z + sz - 0.14), M['wood'], room=R, bevel=0.012)
    xx = -3.1
    while xx < -0.85:
        kind = random.random()
        cc = random.choice(['white', 'yellow', 'teal', 'pink', 'purple_lt', 'wood_lt', 'red', 'blue'])
        if kind < 0.45:
            r_ = random.uniform(0.055, 0.075)
            cyl('jar', r_, random.uniform(0.14, 0.22), (xx, YB - 0.17, z + sz - 0.095), M[cc], room=R, segs=10)
            xx += r_ * 2 + 0.05
        else:
            w_ = random.uniform(0.12, 0.2)
            box('pack', (w_, 0.16, random.uniform(0.14, 0.26)), (xx, YB - 0.17, z + sz - 0.095), M[cc], room=R, bevel=0.012)
            xx += w_ + 0.06
for sxp in (-3.2, -0.72):
    box('shelf_side', (0.05, 0.3, 1.25), (sxp, YB - 0.17, z + 0.82), M['wood'], room=R, bevel=0.012)
# the counter
box('counter', (2.5, 0.62, 0.92), (-1.95, 1.85, z), M['wood_dk'], room=R, bevel=0.03)
box('counter_top', (2.62, 0.74, 0.06), (-1.95, 1.85, z + 0.92), M['wood_lt'], room=R, bevel=0.02)
box('counter_trim', (2.52, 0.02, 0.12), (-1.95, 1.535, z + 0.62), M['purple'], room=R, bevel=0.0)
box('till', (0.34, 0.3, 0.16), (-1.1, 1.85, z + 0.98), M['dark'], room=R, bevel=0.03)
box('till_scr', (0.26, 0.03, 0.2), (-1.1, 1.93, z + 1.12), M['dark'], room=R, bevel=0.01, rx=-0.3)
box('case', (0.95, 0.46, 0.34), (-2.55, 1.85, z + 0.98), mat('#f6ecd6', emit=0.5, emit_off=0.0, emit_hex=C['warm']), room=R, bevel=0.05)
for i in range(5):
    ball('good', 0.065, (-2.9 + i * 0.17, 1.72, z + 1.36), M[['yellow', 'pink', 'wood_lt', 'red', 'white'][i]], room=R, sub=1, squash=0.7)
box('tray', (0.9, 0.3, 0.02), (-2.55, 1.75, z + 1.32), M['metal'], room=R, bevel=0.0)
for sxp in (-2.4, -1.5):
    cyl('stool_leg', 0.025, 0.58, (sxp, 1.25, z), M['metal'], room=R, segs=8, bevel=0)
    cyl('stool_foot', 0.14, 0.02, (sxp, 1.25, z), M['metal'], room=R, segs=12, bevel=0)
    cyl('stool', 0.16, 0.06, (sxp, 1.25, z + 0.58), M['purple'], room=R, segs=14)
# a table by the front
cyl('tbl_foot', 0.2, 0.03, (-0.72, 0.55, z), M['dark'], room=R, segs=14, bevel=0)
cyl('tbl_leg', 0.035, 0.68, (-0.72, 0.55, z), M['dark'], room=R, segs=8, bevel=0)
cyl('tbl_top', 0.4, 0.045, (-0.72, 0.55, z + 0.68), M['wood_lt'], room=R, segs=22)
cyl('cup', 0.045, 0.07, (-0.6, 0.5, z + 0.725), M['white'], room=R, segs=10)
chair(-1.3, 0.55, z, R, rz=math.pi / 2)
chair(-0.2, 0.75, z, R, rz=-math.pi / 2 - 0.3)
plant(-3.12, 0.32, z, R, 1.15)
box('mat', (0.9, 0.5, 0.015), (-1.95, 0.25, z), M['purple'], room=R, bevel=0.0)
box('menu', (0.035, 1.0, 0.62), (sx1 - 0.05, 1.5, z + 1.2), M['dark'], room=R, bevel=0.012)
for i in range(4):
    box('menu_ln', (0.012, 0.5 + 0.1 * (i % 2), 0.035), (sx1 - 0.07, 1.5, z + 1.68 - i * 0.12), M['white'], room=R, bevel=0.0)
pendant(-2.55, 1.6, ZC0 - 0.03, 0.7, R, power=95)
pendant(-1.35, 1.6, ZC0 - 0.03, 0.7, R, power=95)
pendant(-0.72, 0.55, ZC0 - 0.03, 0.85, R, power=55)
anchor('room1', ((sx0 + sx1) / 2, 1.4, ZF0 + 1.1))

# ------------------------------------------------------------------ room 4: the back office (ground floor, right): the management team
R = 4
tx0, tx1 = XD + T / 2, X1 - T
liner(R, tx0, tx1, ZF0, ZC0, 'w_team', 'f_team')
window_hole(R, tx1 - 0.035, 0.8, 2.0, 1.05, 1.85)
z = ZF0 + 0.02
# the long desk on the back wall
box('desk_top', (2.15, 0.66, 0.05), (1.6, YB - 0.38, z + 0.72), M['wood_lt'], room=R, bevel=0.015)
for dx in (-1.0, 1.0):
    box('desk_side', (0.05, 0.6, 0.72), (1.6 + dx, YB - 0.38, z), M['white'], room=R, bevel=0.012)
box('desk_draw', (0.5, 0.56, 0.5), (0.9, YB - 0.38, z + 0.2), M['white'], room=R, bevel=0.02)
# customers: a monitor
box('mon_foot', (0.24, 0.16, 0.02), (1.1, YB - 0.2, z + 0.77), M['dark'], room=R, bevel=0.0)
box('mon_neck', (0.05, 0.04, 0.16), (1.1, YB - 0.16, z + 0.79), M['dark'], room=R, bevel=0.0)
screen('chat', R, 1.1, YB - 0.14, z + 1.17, 0.66, 0.42, '#bfd0ff', 5.0, frame=0.025, depth=0.035)
box('keys', (0.4, 0.14, 0.02), (1.1, YB - 0.52, z + 0.77), M['dark'], room=R, bevel=0.0)
# money: a card reader with its small display
box('reader', (0.2, 0.26, 0.09), (1.72, YB - 0.5, z + 0.77), M['dark'], room=R, bevel=0.025)
box('reader_up', (0.24, 0.03, 0.2), (1.72, YB - 0.36, z + 0.8), M['dark'], room=R, bevel=0.012)
anchor('paid', (1.72, YB - 0.38, z + 0.9), 0.2, 0.14, room=R)
# sales: the printer; the page moves the sheet
box('printer', (0.56, 0.46, 0.26), (2.3, YB - 0.33, z + 0.77), M['white'], room=R, bevel=0.04)
box('printer_top', (0.4, 0.3, 0.03), (2.3, YB - 0.3, z + 1.03), M['mid'], room=R, bevel=0.01)
box('printer_slot', (0.4, 0.03, 0.05), (2.3, YB - 0.565, z + 0.87), M['dark'], room=R, bevel=0.0)
box('printer_tray', (0.42, 0.2, 0.02), (2.3, YB - 0.66, z + 0.8), M['mid'], room=R, bevel=0.0)
anchor('paper', (2.3, YB - 0.58, z + 0.895), 0.3, 0.4, room=R)
# paperwork: the cabinet; its top drawer is one part
box('cab', (0.6, 0.56, 1.3), (3.08, YB - 0.3, z), M['mid'], room=R, bevel=0.03)
for i in range(2):
    box('cab_front', (0.52, 0.03, 0.36), (3.08, YB - 0.59, z + 0.06 + i * 0.41), M['metal'], room=R, bevel=0.012)
    box('cab_pull', (0.16, 0.03, 0.03), (3.08, YB - 0.61, z + 0.3 + i * 0.41), M['dark'], room=R, bevel=0.01)
box('drw_front', (0.52, 0.03, 0.36), (3.08, YB - 0.59, z + 0.88), M['metal'], room=R, part=2, bevel=0.012)
box('drw_pull', (0.16, 0.03, 0.03), (3.08, YB - 0.61, z + 1.12), M['dark'], room=R, part=2, bevel=0.01)
box('drw_box', (0.48, 0.44, 0.3), (3.08, YB - 0.36, z + 0.9), M['dark'], room=R, part=2, bevel=0.0)
for i, cc in enumerate(('yellow', 'wood_lt', 'purple_lt', 'yellow')):
    box('drw_file', (0.4, 0.035, 0.3), (3.08, YB - 0.5 + i * 0.07, z + 0.95), M[cc], room=R, part=2, bevel=0.0)
anchor('drawer', (3.08, YB - 0.59, z + 1.06), room=R)
plant(3.1, YB - 0.3, z + 1.3, R, 0.7)
# the shelf of binders, a clock
box('bshelf', (1.5, 0.24, 0.04), (2.1, YB - 0.14, z + 1.62), M['wood'], room=R, bevel=0.012)
xx = 1.45
for i in range(9):
    w_ = random.uniform(0.07, 0.11)
    box('binder', (w_, 0.2, random.uniform(0.26, 0.33)), (xx + w_ / 2, YB - 0.14, z + 1.66), M[random.choice(['purple', 'white', 'dark', 'purple_lt', 'teal', 'yellow'])], room=R, bevel=0.01)
    xx += w_ + 0.012
cyl('clock', 0.17, 0.035, (0.82, YB - 0.05, z + 1.75), M['white'], room=R, segs=20, axis='y', bevel=0.01)
cyl('clock_rim', 0.19, 0.025, (0.82, YB - 0.04, z + 1.75), M['dark'], room=R, segs=20, axis='y', bevel=0)
box('clock_h', (0.012, 0.01, 0.1), (0.82, YB - 0.075, z + 1.75), M['dark'], room=R, bevel=0.0)
box('clock_m', (0.12, 0.01, 0.012), (0.87, YB - 0.075, z + 1.75), M['dark'], room=R, bevel=0.0)
office_chair(1.15, 1.42, z, R, rz=math.pi + 0.25)
office_chair(2.2, 1.5, z, R, rz=math.pi - 0.2)
box('rug4', (2.3, 1.0, 0.012), (1.75, 1.1, z), M['white'], room=R, bevel=0.0)
# a low table with the day's boxes
box('ptable', (0.9, 0.5, 0.4), (0.95, 0.55, z), M['wood'], room=R, bevel=0.03)
box('parcel1', (0.36, 0.3, 0.24), (0.85, 0.45, z + 0.4), M['wood_lt'], room=R, bevel=0.012)
box('parcel2', (0.26, 0.24, 0.18), (1.22, 0.47, z + 0.4), M['wood_lt'], room=R, bevel=0.012, rz=0.3)
box('parcel_tape', (0.37, 0.05, 0.245), (0.85, 0.45, z + 0.4), M['purple'], room=R, bevel=0.0)
pendant(1.3, 1.3, ZC0 - 0.03, 0.66, R, color='#fff0dd', power=52, shade='white')
pendant(2.6, 1.3, ZC0 - 0.03, 0.66, R, color='#fff0dd', power=52, shade='white')
anchor('room4', ((tx0 + tx1) / 2, 1.4, ZF0 + 1.1))

# ------------------------------------------------------------------ room 2: the home (upper floor, left): the assistant
R = 2
liner(R, sx0, sx1, ZF1, ZC1, 'w_home', 'f_home')
window_hole(R, sx0 + 0.035, 0.9, 2.1, 3.7, 4.6)
z = ZF1 + 0.02
box('k_base', (1.3, 0.56, 0.84), (-2.75, YB - 0.3, z), M['white'], room=R, bevel=0.025)
box('k_top', (1.36, 0.6, 0.05), (-2.75, YB - 0.31, z + 0.84), M['wood_dk'], room=R, bevel=0.015)
box('k_sink', (0.4, 0.34, 0.02), (-3.08, YB - 0.32, z + 0.885), M['metal'], room=R, bevel=0.0)
cyl('k_tap', 0.015, 0.2, (-3.08, YB - 0.12, z + 0.89), M['metal'], room=R, segs=6, bevel=0)
box('k_hob', (0.5, 0.4, 0.02), (-2.45, YB - 0.32, z + 0.885), M['dark'], room=R, bevel=0.0)
cyl('k_pot', 0.1, 0.12, (-2.52, YB - 0.38, z + 0.905), M['red'], room=R, segs=12)
for i in range(3):
    box('k_door', (0.4, 0.02, 0.68), (-3.18 + i * 0.43, YB - 0.59, z + 0.08), M['w_home'], room=R, bevel=0.012)
box('k_upper', (1.3, 0.32, 0.52), (-2.75, YB - 0.18, z + 1.5), M['white'], room=R, bevel=0.025)
for i in range(3):
    box('k_udoor', (0.4, 0.02, 0.44), (-3.18 + i * 0.43, YB - 0.35, z + 1.54), M['w_home'], room=R, bevel=0.012)
box('fridge', (0.62, 0.6, 1.62), (-0.25, YB - 0.32, z), M['white'], room=R, bevel=0.05)
box('fridge_line', (0.6, 0.012, 0.015), (-0.25, YB - 0.625, z + 1.05), M['mid'], room=R, bevel=0.0)
box('fridge_h', (0.03, 0.03, 0.3), (-0.48, YB - 0.635, z + 1.15), M['metal'], room=R, bevel=0.01)
box('note1', (0.12, 0.008, 0.12), (-0.15, YB - 0.625, z + 1.3), M['yellow'], room=R, bevel=0.0)
box('note2', (0.1, 0.008, 0.13), (-0.09, YB - 0.625, z + 0.75), M['pink'], room=R, bevel=0.0)
# the family calendar on the wall: the page draws it
screen('calendar', R, -1.32, YB - 0.03, z + 1.4, 1.0, 0.72, '#ffe9c9', 2.2, frame=0.04, depth=0.035)
# the sofa under it
box('sofa', (1.25, 0.6, 0.3), (-1.32, YB - 0.36, z + 0.1), M['teal'], room=R, bevel=0.07)
box('sofa_back', (1.25, 0.18, 0.5), (-1.32, YB - 0.13, z + 0.3), M['teal'], room=R, bevel=0.07)
for dx in (-0.66, 0.66):
    box('sofa_arm', (0.16, 0.6, 0.46), (-1.32 + dx, YB - 0.36, z + 0.1), M['teal'], room=R, bevel=0.06)
box('cush1', (0.34, 0.12, 0.3), (-1.62, YB - 0.3, z + 0.4), M['yellow'], room=R, bevel=0.05, rx=-0.25)
box('cush2', (0.34, 0.12, 0.3), (-1.05, YB - 0.3, z + 0.4), M['purple_lt'], room=R, bevel=0.05, rx=-0.25)
box('rug2', (1.5, 0.9, 0.012), (-1.1, 1.6, z), M['white'], room=R, bevel=0.0)
box('rug2b', (1.3, 0.7, 0.014), (-1.1, 1.6, z), M['pink'], room=R, bevel=0.0)
# the table: breakfast is out, the chairs are empty
box('dt_top', (1.2, 0.72, 0.05), (-2.45, 0.95, z + 0.7), M['wood_lt'], room=R, bevel=0.02)
for (dx, dy) in ((-0.52, -0.28), (0.52, -0.28), (-0.52, 0.28), (0.52, 0.28)):
    cyl('dt_leg', 0.03, 0.7, (-2.45 + dx, 0.95 + dy, z), M['wood'], room=R, segs=8, bevel=0)
chair(-2.75, 0.42, z, R, rz=math.pi, seat='yellow')
chair(-2.15, 0.42, z, R, rz=math.pi + 0.15, seat='yellow')
chair(-2.45, 1.45, z, R, rz=0.0, seat='yellow')
for i, (dx, dy) in enumerate(((-0.3, -0.12), (0.3, -0.1), (0.0, 0.18))):
    cyl('plate', 0.1, 0.015, (-2.45 + dx, 0.95 + dy, z + 0.75), M['white'], room=R, segs=14, bevel=0)
cyl('bowl', 0.09, 0.07, (-2.45, 0.93, z + 0.75), M['blue'], room=R, segs=12, r2=0.12)
ball('fruit1', 0.045, (-2.47, 0.93, z + 0.84), M['red'], room=R, sub=1)
ball('fruit2', 0.045, (-2.41, 0.95, z + 0.85), M['yellow'], room=R, sub=1)
# a school bag and blocks by the sofa, a floor lamp
box('bag', (0.3, 0.2, 0.36), (-0.55, 1.75, z), M['purple'], room=R, bevel=0.07)
box('bag_pocket', (0.22, 0.05, 0.16), (-0.55, 1.64, z + 0.04), M['purple_lt'], room=R, bevel=0.03)
for i, (dx, dy, cc) in enumerate(((0.0, 0.0, 'red'), (0.13, 0.03, 'blue'), (0.06, 0.02, 'yellow'))):
    box('block', (0.11, 0.11, 0.11), (-1.2 + dx, 1.45 + dy, z + (0.11 if i == 2 else 0.0)), M[cc], room=R, bevel=0.015, rz=0.3 * i)
cyl('fl_base', 0.13, 0.03, (-2.05, 2.2, z), M['dark'], room=R, segs=12, bevel=0)
cyl('fl_pole', 0.015, 1.25, (-2.05, 2.2, z), M['dark'], room=R, segs=6, bevel=0)
cyl('fl_shade', 0.17, 0.24, (-2.05, 2.2, z + 1.2), mat('#f4e3c4', emit=2.4, emit_off=0.0, emit_hex=C['warm']), room=R, segs=16, r2=0.11, bevel=0)
lamp('L_floor2', (-2.0, 2.05, z + 1.1), C['warm'], 60, radius=0.1)
pendant(-2.45, 0.95, ZC1 - 0.03, 0.8, R, power=110, shade='yellow')
lamp('L_kitchen', (-2.6, 1.9, z + 1.42), C['warm'], 30, radius=0.2)
box('pic', (0.035, 0.5, 0.4), (sx1 - 0.05, 1.2, z + 1.2), M['white'], room=R, bevel=0.012)
box('pic_in', (0.012, 0.4, 0.3), (sx1 - 0.07, 1.2, z + 1.25), M['teal'], room=R, bevel=0.0)
anchor('room2', ((sx0 + sx1) / 2, 1.4, ZF1 + 1.1))

# ------------------------------------------------------------------ room 3: the office (upper floor, right): the chief of staff
R = 3
liner(R, tx0, tx1, ZF1, ZC1, 'w_chief', 'f_chief')
window_hole(R, tx1 - 0.035, 0.9, 2.1, 3.7, 4.6)
z = ZF1 + 0.02
# the whole picture: one wide wall screen
screen('board', R, 1.9, YB - 0.03, z + 1.3, 2.3, 1.0, '#b9a3ff', 4.0, frame=0.05, depth=0.05)
box('side_board', (1.7, 0.4, 0.46), (2.1, YB - 0.23, z), M['white'], room=R, bevel=0.03)
for i in range(4):
    box('sb_door', (0.38, 0.02, 0.36), (1.48 + i * 0.41, YB - 0.44, z + 0.05), M['w_chief'], room=R, bevel=0.012)
for i, (bx, cc, hh) in enumerate(((1.35, 'purple', 0.22), (1.42, 'white', 0.26), (1.49, 'teal', 0.2), (1.57, 'dark', 0.24))):
    box('book', (0.06, 0.18, hh), (bx, YB - 0.22, z + 0.46), M[cc], room=R, bevel=0.008)
cyl('globe_foot', 0.08, 0.03, (2.7, YB - 0.24, z + 0.46), M['dark'], room=R, segs=10, bevel=0)
cyl('globe_neck', 0.012, 0.1, (2.7, YB - 0.24, z + 0.48), M['dark'], room=R, segs=6, bevel=0)
ball('globe', 0.14, (2.7, YB - 0.24, z + 0.7), M['blue'], room=R, sub=2)
plant(3.2, YB - 0.28, z, R, 1.3)
# the desk faces the wall; the chair is empty
box('cd_top', (1.5, 0.7, 0.05), (1.75, 1.3, z + 0.7), M['wood_dk'], room=R, bevel=0.02)
for dx in (-0.68, 0.68):
    box('cd_side', (0.05, 0.62, 0.7), (1.75 + dx, 1.3, z), M['dark'], room=R, bevel=0.012)
box('laptop', (0.4, 0.28, 0.015), (1.6, 1.25, z + 0.75), M['metal'], room=R, bevel=0.0)
box('laptop_lid', (0.4, 0.015, 0.27), (1.6, 1.41, z + 0.75), M['metal'], room=R, bevel=0.0, rx=-0.25)
box('laptop_scr', (0.36, 0.006, 0.22), (1.6, 1.397, z + 0.775), mat('#1b1830', emit=3.0, emit_off=0.6, emit_hex='#b9a3ff'), room=R, part=0, bevel=0.0, rx=-0.25)
for i in range(3):
    box('paper_stack', (0.22, 0.3, 0.012), (2.2, 1.27, z + 0.75 + i * 0.012), M['white'], room=R, bevel=0.0, rz=0.06 * i)
cyl('mug', 0.04, 0.085, (1.2, 1.15, z + 0.75), M['purple'], room=R, segs=10)
cyl('dl_foot', 0.07, 0.02, (2.3, 1.53, z + 0.75), M['dark'], room=R, segs=10, bevel=0)
cyl('dl_pole', 0.012, 0.28, (2.3, 1.53, z + 0.76), M['dark'], room=R, segs=6, bevel=0)
cyl('dl_shade', 0.09, 0.1, (2.3, 1.53, z + 1.0), mat('#f4e3c4', emit=2.4, emit_off=0.0, emit_hex=C['warm']), room=R, segs=12, r2=0.05, bevel=0)
lamp('L_desk3', (2.28, 1.45, z + 0.98), C['warm'], 22, radius=0.05)
office_chair(1.75, 0.7, z, R, rz=math.pi + 0.35)
box('rug3', (2.4, 1.5, 0.012), (1.8, 1.05, z), M['purple'], room=R, bevel=0.0)
box('arm', (0.56, 0.56, 0.3), (0.86, 1.95, z + 0.08), M['w_home'], room=R, bevel=0.08, rz=0.5)
box('arm_back', (0.56, 0.14, 0.5), (0.76, 2.17, z + 0.3), M['w_home'], room=R, bevel=0.06, rz=0.5)
cyl('fl3_base', 0.13, 0.03, (3.15, 0.5, z), M['dark'], room=R, segs=12, bevel=0)
cyl('fl3_pole', 0.015, 1.3, (3.15, 0.5, z), M['dark'], room=R, segs=6, bevel=0)
cyl('fl3_shade', 0.16, 0.22, (3.15, 0.5, z + 1.25), mat('#f4e3c4', emit=2.4, emit_off=0.0, emit_hex=C['warm']), room=R, segs=16, r2=0.1, bevel=0)
lamp('L_floor3', (3.05, 0.6, z + 1.15), C['warm'], 55, radius=0.1)
lamp('L_ceil3', (1.4, 1.3, ZC1 - 0.25), '#e9e2ff', 60, radius=0.25)
anchor('room3', ((tx0 + tx1) / 2, 1.4, ZF1 + 1.1))

# the light that is Jarvis rests over the roof sign and visits each room near its ceiling
anchor('orb_home', (-2.25, -0.3, ZR + 1.5))
anchor('orb1', (-1.6, 0.9, ZC0 - 0.5))
anchor('orb2', (-1.2, 1.3, ZC1 - 0.55))
anchor('orb3', (1.9, 1.5, ZC1 - 0.55))
anchor('orb4', (2.0, 1.3, ZC0 - 0.5))

# ------------------------------------------------------------------ world and camera
world = bpy.data.worlds.new('dusk')
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes.get('Background')
bg.inputs['Color'].default_value = (*lin('#232a55'), 1)
bg.inputs['Strength'].default_value = 0.42
moon = lamp('L_moon', (6, -9, 12), '#8fa6ff', 1.1, on_only=False, kind='SUN')
moon.data.angle = 0.25
moon.rotation_euler = (math.radians(52), 0, math.radians(32))
fill = lamp('L_fill', (-7, -8, 5), '#6f5bd0', 0.35, on_only=False, kind='SUN')
fill.data.angle = 0.6
fill.rotation_euler = (math.radians(68), 0, math.radians(-40))

def camera(name, loc, target, lens=85):
    cd = bpy.data.cameras.new(name)
    cd.lens = lens
    cd.sensor_width = 36
    ob = bpy.data.objects.new(name, cd)
    ob.location = loc
    d = Vector(target) - Vector(loc)
    ob.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    col.objects.link(ob)
    return ob
CAMS = {
    'hero': camera('cam_hero', (11.0, -29.0, 9.0), (0.0, -0.3, 3.0), 76),
    'front': camera('cam_front', (0.0, -26.0, 5.5), (0.0, 0.5, 2.5), 70),
    'left': camera('cam_left', (-12.0, -22.0, 10.0), (0.0, 0.5, 2.3), 80),
    'home': camera('cam_home', (-0.5, -9.5, 5.0), (-1.6, 1.6, 3.5), 60),
    'team': camera('cam_team', (4.5, -8.5, 2.6), (1.9, 1.8, 1.1), 60),
}

# ------------------------------------------------------------------ render settings
scene.render.engine = 'CYCLES'
prefs = bpy.context.preferences.addons['cycles'].preferences
gpu = False
for kind in ('OPTIX', 'CUDA'):
    try:
        prefs.compute_device_type = kind
        prefs.get_devices()
        devs = [d for d in prefs.devices if d.type == kind]
        if devs:
            for d in prefs.devices:
                d.use = d.type == kind
            gpu = True
            break
    except Exception as e:
        print('no', kind, e)
if arg('--cpu', flag=True):
    gpu = False
scene.cycles.device = 'GPU' if gpu else 'CPU'
print('HERO3D device', scene.cycles.device)
scene.cycles.samples = int(arg('--samples', 192))
scene.cycles.use_adaptive_sampling = True
scene.cycles.adaptive_threshold = 0.02
scene.cycles.max_bounces = 5
scene.cycles.diffuse_bounces = 3
scene.cycles.use_denoising = True
try:
    scene.view_settings.view_transform = 'Khronos PBR Neutral'
except Exception:
    scene.view_settings.view_transform = 'Standard'
scene.view_settings.exposure = float(arg('--exposure', 0.0))
scene.render.film_transparent = False
scene.render.image_settings.file_format = 'PNG'

def lamps(on):
    for ob in LIGHTS_ON:
        ob.hide_render = not on
    for (node, e_on, e_off) in EMIT:
        node.inputs['Emission Strength'].default_value = e_on if on else e_off

print('HERO3D objects', len(OBJS), 'tris', sum(len(o.data.polygons) for o in OBJS))

if arg('--stills', flag=True):
    world_col = bg.inputs['Color'].default_value[:]
    for name in (arg('--cams', 'hero,front,home,team')).split(','):
        for on in (True, False) if name == 'hero' else (True,):
            lamps(on)
            scene.camera = CAMS[name]
            scene.render.resolution_x, scene.render.resolution_y = (1600, 1000)
            scene.render.filepath = os.path.join(OUT, f'still-{name}-{"on" if on else "off"}.png')
            bpy.ops.render.render(write_still=True)
    lamps(True)

# ------------------------------------------------------------------ one mesh, one UV atlas, two bakes
BAKE = int(arg('--bake', 0))
if BAKE or arg('--export', flag=True):
    for ob in OBJS:
        me = ob.data
        a = me.attributes.new('room', 'FLOAT', 'POINT')
        a.data.foreach_set('value', [float(ob['room'])] * len(me.vertices))
        b = me.attributes.new('part', 'FLOAT', 'POINT')
        b.data.foreach_set('value', [float(ob['part'])] * len(me.vertices))
    stand = [o for o in OBJS if o['part'] == 9]      # the glowing stand-ins: they light the bake and are not exported
    keep = [o for o in OBJS if o['part'] != 9]
    # one material slot list is fine: join keeps each face's material
    with bpy.context.temp_override(active_object=keep[0], selected_editable_objects=keep, selected_objects=keep, object=keep[0]):
        bpy.ops.object.join()
    shop = keep[0]
    shop.name = 'shop'
    me = shop.data
    bpy.context.view_layer.objects.active = shop
    for o in bpy.context.view_layer.objects:
        o.select_set(o == shop)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.0, area_weight=0.0, correct_aspect=True, scale_to_bounds=False)
    try:
        bpy.ops.uv.pack_islands(margin=0.0012, rotate=True)
    except Exception as e:
        print('pack', e)
    bm_e = bmesh.from_edit_mesh(me)
    pl = bm_e.verts.layers.float.get('part')
    for f in bm_e.faces:
        f.select = all(int(round(v[pl])) == 1 for v in f.verts)
    for e in bm_e.edges:
        e.select = all(f.select for f in e.link_faces)
    for v in bm_e.verts:
        v.select = all(f.select for f in v.link_faces)
    bmesh.update_edit_mesh(me)
    bpy.ops.mesh.separate(type='SELECTED')
    bpy.ops.object.mode_set(mode='OBJECT')
    van_ob = [o for o in bpy.context.selected_objects if o != shop][0]
    van_ob.name = 'van'
    van_ob.visible_shadow = False
    print('HERO3D joined tris', sum(len(p.vertices) - 2 for p in me.polygons))

if BAKE:
    img = bpy.data.images.new('atlas', BAKE, BAKE, alpha=False, float_buffer=True)
    for m in set(list(me.materials) + list(van_ob.data.materials)):
        nt = m.node_tree
        n = nt.nodes.new('ShaderNodeTexImage')
        n.image = img
        nt.nodes.active = n
    scene.cycles.use_denoising = False
    scene.cycles.samples = int(arg('--samples', 192))
    scene.render.bake.margin = max(4, BAKE // 512)
    scene.render.bake.use_clear = False
    for o in bpy.context.view_layer.objects:
        o.select_set(o in (shop, van_ob))
    bpy.context.view_layer.objects.active = shop
    for on in (True, False):
        lamps(on)
        bpy.ops.object.bake(type='COMBINED')
        path = os.path.join(OUT, f'atlas-{"on" if on else "off"}.png')
        img.save_render(path, scene=scene)
        print('HERO3D baked', path)
    lamps(True)

if arg('--export', flag=True):
  parts = {}
  for src in (me, van_ob.data):
    bm = bmesh.new()
    bm.from_mesh(src)
    bmesh.ops.triangulate(bm, faces=bm.faces[:])
    uvl = bm.loops.layers.uv.active
    room_l = bm.verts.layers.float.get('room')
    part_l = bm.verts.layers.float.get('part')
    for f in bm.faces:
        p = int(round(f.verts[0][part_l]))
        d = parts.setdefault(p, {'key': {}, 'pos': [], 'uv': [], 'room': [], 'idx': []})
        if True:
            pass
        for l in f.loops:
            uv = l[uvl].uv
            k = (l.vert.index, round(uv.x, 5), round(uv.y, 5))
            i = d['key'].get(k)
            if i is None:
                i = len(d['room'])
                d['key'][k] = i
                co = l.vert.co
                d['pos'] += [co.x, co.z, -co.y]
                d['uv'] += [uv.x, uv.y]
                d['room'].append(int(round(l.vert[room_l])))
            d['idx'].append(i)
    bm.free()
  if True:
    names = {0: 'shop', 1: 'van', 2: 'drawer'}
    header = {'anchors': ANCHORS, 'parts': []}
    blobs = []
    off = 0
    for p, d in sorted(parts.items()):
        n = len(d['room'])
        pos = d['pos']
        lo = [min(pos[i::3]) for i in range(3)]
        hi = [max(pos[i::3]) for i in range(3)]
        q = []
        for i, v in enumerate(pos):
            a = i % 3
            q.append(int(round((v - lo[a]) / max(hi[a] - lo[a], 1e-9) * 65535)))
        b_pos = struct.pack(f'<{len(q)}H', *q)
        b_uv = struct.pack(f'<{len(d["uv"])}H', *[int(round(min(max(v, 0.0), 1.0) * 65535)) for v in d['uv']])
        b_room = struct.pack(f'<{n}B', *d['room'])
        b_room += b'\0' * ((4 - len(b_room) % 4) % 4)
        wide = n > 65535
        b_idx = struct.pack(f'<{len(d["idx"])}{"I" if wide else "H"}', *d['idx'])
        b_idx += b'\0' * ((4 - len(b_idx) % 4) % 4)
        b_pos += b'\0' * ((4 - len(b_pos) % 4) % 4)
        part = {'name': names.get(p, f'part{p}'), 'verts': n, 'tris': len(d['idx']) // 3, 'wide': wide, 'lo': lo, 'hi': hi}
        for key, blob in (('pos', b_pos), ('uv', b_uv), ('room', b_room), ('idx', b_idx)):
            part[key] = [off, len(blob)]
            off += len(blob)
            blobs.append(blob)
        header['parts'].append(part)
    hj = json.dumps(header, separators=(',', ':')).encode()
    hj += b' ' * ((4 - len(hj) % 4) % 4)
    with open(os.path.join(OUT, 'shop.bin'), 'wb') as f:
        f.write(struct.pack('<I', len(hj)))
        f.write(hj)
        for blob in blobs:
            f.write(blob)
    with open(os.path.join(OUT, 'anchors.json'), 'w') as f:
        json.dump(ANCHORS, f, indent=1)
    print('HERO3D exported', [(p['name'], p['verts'], p['tris']) for p in header['parts']], 'bytes', off + len(hj) + 4)

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'shop.blend'))
print('HERO3D done')
