import os, struct, glob
folder = r'C:\Users\joelt\Downloads\New folder\home'
for path in sorted(glob.glob(os.path.join(folder, '*.png'))):
    with open(path, 'rb') as f:
        data = f.read(33)
    if data[:8] == b'\x89PNG\r\n\x1a\n' and data[12:16] == b'IHDR':
        w, h = struct.unpack('>II', data[16:24])
        print(os.path.basename(path), w, 'x', h)
    else:
        print(os.path.basename(path), 'NOT PNG')
