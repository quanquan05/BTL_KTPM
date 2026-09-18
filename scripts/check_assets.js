// Script to test and fetch game assets
import fs from 'fs';
import path from 'path';


async function checkUrl(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
    return { url, status: res.status, ok: res.ok, type: res.headers.get('content-type') };
  } catch (e) {
    return { url, status: 0, ok: false, error: e.message };
  }
}

async function run() {
  const candidates = [
    // Valorant
    { id: 'val_banner', url: 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt72c57f2022792d24/63bc72443c9716298533c393/Episode_6_Revelation_PlayVALORANT.jpg' },
    { id: 'val_kuronami', url: 'https://media.valorant-api.com/bundles/69d9b2be-4439-0785-780b-ba8951053683/displayicon.png' },
    { id: 'val_champ', url: 'https://media.valorant-api.com/bundles/90ee89df-40cf-03d3-420f-3d9a1b81d85b/displayicon.png' },
    // Wild Rift / LoL
    { id: 'wr_banner', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/WildRift_0.jpg' },
    { id: 'wr_yasuo', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_9.jpg' },
    { id: 'wr_yone', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yone_1.jpg' },
    { id: 'wr_zed', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Zed_10.jpg' },
    { id: 'wr_akali', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Akali_15.jpg' },
    // Steam / PUBG / EA FC
    { id: 'pubg_banner', url: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/578080/library_hero.jpg' },
    { id: 'eafc_banner', url: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2195250/library_hero.jpg' },
    { id: 'eafc_cr7', url: 'https://cdn.futbin.com/content/fifa24/img/players/20801.png' },
    // Genshin
    { id: 'genshin_banner', url: 'https://images.wallpapersden.com/image/download/genshin-impact-game-art-banner_bGVnZ2mUmZqaraWkpJRmbmdlrWZlbWU.jpg' }
  ];

  for (const c of candidates) {
    const res = await checkUrl(c.url);
    console.log(c.id, res.ok ? 'OK' : 'FAIL', res.status, res.type);
  }
}

run();

