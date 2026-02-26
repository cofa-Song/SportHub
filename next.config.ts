import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // 這行會讓 Next.js 輸出靜態 HTML/CSS/JS
  basePath: '/SportHub', // GitHub 倉庫名稱
  assetPrefix: '/SportHub/', // 確保 CSS/JS 檔案路徑正確
  images: { unoptimized: true }, // GitHub Pages 不支援 Next 的圖片優化
};

export default nextConfig;
