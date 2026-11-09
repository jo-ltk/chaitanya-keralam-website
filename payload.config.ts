import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';
import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Landing } from './globals/Landing';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  // Payload admin lives at /cms because /admin is the existing Supabase admin.
  routes: { admin: '/cms' },
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' — Chaitanya Keralam CMS',
      description: 'Chaitanya Keralam website content manager',
      defaultOGImageType: 'off',
      openGraph: { siteName: 'Chaitanya Keralam CMS', description: 'Chaitanya Keralam website content manager' },
      icons: [{ rel: 'icon', type: 'image/png', url: '/images/chaitanya-keralam-logo.png' }],
    },
    components: {
      graphics: { Logo: '/components/payload/Logo', Icon: '/components/payload/Icon' },
    },
  },
  collections: [Users, Media],
  globals: [Landing],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  // SQLite for local dev. For production switch to @payloadcms/db-postgres with a DATABASE_URI.
  db: sqliteAdapter({ client: { url: process.env.DATABASE_URI || 'file:./payload.db' } }),
  sharp,
});
