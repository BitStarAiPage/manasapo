import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * AVIF を切って WebP だけにしている。
     * 既定では AVIF も生成するが、この環境では 1 サイズの変換が 120 秒経っても
     * 返らず、FV の写真が読み込まれないままになる（WebP は数ミリ秒で返る）。
     * AVIF は WebP よりさらに 20% ほど小さくなるが、生成コストが見合わない。
     */
    formats: ["image/webp"],
  },
};

export default nextConfig;
