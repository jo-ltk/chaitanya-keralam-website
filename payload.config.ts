import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { s3Storage } from '@payloadcms/storage-s3';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';
import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Landing } from './globals/Landing';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const dbUrl = process.env.DATABASE_URI || '';
const usePostgres = dbUrl.startsWith('postgres');
const s3Ready = !!(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY);
const publicBase = process.env.NEXT_PUBLIC_SUPABASE_URL;

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
  // Postgres (Supabase) when DATABASE_URI is a postgres:// URL, otherwise local SQLite for dev.
  // Payload tables live in their own "payload" schema so they never clash with the site's tables (e.g. media).
  db: usePostgres
    ? postgresAdapter({ pool: { connectionString: dbUrl }, schemaName: 'payload' })
    : sqliteAdapter({ client: { url: dbUrl || 'file:./payload.db' } }),
  // Uploads go to Supabase Storage (S3 API), folder cms/ in the site-media bucket.
  plugins: s3Ready
    ? [
        s3Storage({
          collections: {
            media: {
              prefix: 'cms',
              disablePayloadAccessControl: true,
              generateFileURL: ({ filename, prefix }) =>
                `${publicBase}/storage/v1/object/public/${process.env.S3_BUCKET}/${prefix}/${filename}`,
            },
          },
          bucket: process.env.S3_BUCKET!,
          config: {
            endpoint: process.env.S3_ENDPOINT,
            region: process.env.S3_REGION,
            forcePathStyle: true,
            credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID!, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY! },
          },
        }),
      ]
    : [],
  sharp,
});
