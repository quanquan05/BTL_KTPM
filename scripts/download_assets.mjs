import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function downloadImage(url, destRelative) {
  const destPath = path.join(rootDir, 'public', destRelative);
  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) {
      console.warn(`Failed (${res.status}): ${url}`);
      return false;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
    console.log(`Saved: ${destRelative} (${buffer.length} bytes)`);
    return true;
  } catch (e) {
    console.error(`Error downloading ${url}:`, e.message);
    return false;
  }
}

async function getFandomImageUrl(wiki, title) {
  try {
    const api = `https://${wiki}.fandom.com/api.php?action=query&titles=File:${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
    const res = await fetch(api);
    const data = await res.json();
    const pages = data.query?.pages || {};
    const first = Object.values(pages)[0];
    return first?.imageinfo?.[0]?.url || null;
  } catch (e) {
    return null;
  }
}

async function main() {
  console.log('=== STARTING ASSET DOWNLOADS ===');

  // 1. Valorant Skins & Bundles
  console.log('\n--- Valorant Assets ---');
  await downloadImage('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/578080/library_hero.jpg', 'images/games/pubg.jpg');
  await downloadImage('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2195250/library_hero.jpg', 'images/games/fo4.jpg');
  
  // Riot Valorant official bundles
  await downloadImage('https://media.valorant-api.com/bundles/69d9b2be-4439-0785-780b-ba8951053683/displayicon.png', 'images/accounts/acc-val-01.png');
  await downloadImage('https://media.valorant-api.com/bundles/90ee89df-40cf-03d3-420f-3d9a1b81d85b/displayicon.png', 'images/accounts/acc-val-02.png');
  await downloadImage('https://media.valorant-api.com/weaponskins/d8d5d7a1-4d81-8560-54bc-0692ab40f69b/displayicon.png', 'images/skins/kuronami-vandal.png');
  await downloadImage('https://media.valorant-api.com/weaponskinchromas/cf42ad75-43db-5426-0645-a7a3fac452c5/displayicon.png', 'images/skins/reaver-karambit.png');
  await downloadImage('https://media.valorant-api.com/weaponskins/44b7b110-46bf-ccbb-2613-29a5df296461/displayicon.png', 'images/skins/prime-phantom.png');
  await downloadImage('https://media.valorant-api.com/weaponskins/a9890917-41ea-eb55-47e7-ee990a87fa4e/displayicon.png', 'images/skins/sovereign-ghost.png');
  await downloadImage('https://media.valorant-api.com/weaponskins/b0f65660-4c51-13b7-9d01-e29a1e2879b0/displayicon.png', 'images/skins/champions-vandal.png');
  await downloadImage('https://media.valorant-api.com/weaponskins/759bca71-4764-19f8-8890-239eedb78fa3/displayicon.png', 'images/skins/oni-katana.png');
  await downloadImage('https://media.valorant-api.com/weaponskins/97af88e4-4176-9fa3-4a26-57919443dab7/displayicon.png', 'images/skins/glitchpop-dagger.png');

  // 2. Wild Rift / LoL (DDragon)
  console.log('\n--- Wild Rift / LoL Assets ---');
  await downloadImage('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_9.jpg', 'images/accounts/acc-tc-01.jpg');
  await downloadImage('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_9.jpg', 'images/skins/yasuo-ma-kiem.jpg');
  await downloadImage('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yone_1.jpg', 'images/skins/yone-hoa-linh.jpg');
  await downloadImage('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Zed_10.jpg', 'images/skins/zed-tu-than.jpg');
  await downloadImage('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Akali_15.jpg', 'images/skins/akali-kda.jpg');
  await downloadImage('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg', 'images/games/toc-chien.jpg');

  // 3. Genshin Impact (dromzeh)
  console.log('\n--- Genshin Impact Assets ---');
  await downloadImage('https://raw.githubusercontent.com/dromzeh/genshin-splash-art/main/raiden-shogun.png', 'images/accounts/acc-gen-01.png');
  await downloadImage('https://raw.githubusercontent.com/dromzeh/genshin-splash-art/main/raiden-shogun.png', 'images/skins/raiden-shogun.png');
  await downloadImage('https://raw.githubusercontent.com/dromzeh/genshin-splash-art/main/kazuha.png', 'images/skins/kazuha.png');
  await downloadImage('https://raw.githubusercontent.com/dromzeh/genshin-splash-art/main/hu-tao.png', 'images/skins/hu-tao.png');
  await downloadImage('https://raw.githubusercontent.com/dromzeh/genshin-splash-art/main/kamisato-ayaka.png', 'images/skins/ayaka.png');
  await downloadImage('https://raw.githubusercontent.com/dromzeh/genshin-splash-art/main/zhongli.png', 'images/skins/zhongli.png');
  await downloadImage('https://raw.githubusercontent.com/dromzeh/genshin-splash-art/main/xiao.png', 'images/skins/xiao.png');

  // 4. FC Online (Futbin players)
  console.log('\n--- FC Online Assets ---');
  await downloadImage('https://cdn.futbin.com/content/fifa24/img/players/20801.png', 'images/accounts/acc-fo4-01.png');
  await downloadImage('https://cdn.futbin.com/content/fifa24/img/players/20801.png', 'images/skins/ronaldo-btb.png');
  await downloadImage('https://cdn.futbin.com/content/fifa24/img/players/214100.png', 'images/skins/gullit-icon.png');
  await downloadImage('https://cdn.futbin.com/content/fifa24/img/players/192119.png', 'images/skins/courtois-ts.png');

  // 5. Arena of Valor (Fandom)
  console.log('\n--- Arena of Valor Assets ---');
  const aovFiles = [
    { file: 'Lavender1.jpg', dest: 'images/accounts/acc-lq-01.jpg' },
    { file: 'Lavender1.jpg', dest: 'images/skins/florentino-tinh-he.jpg' },
    { file: 'Nakrothcybercore.jpg', dest: 'images/skins/nakroth-thu-nguyen.jpg' },
    { file: 'Raz_Splash_Art.jpg', dest: 'images/skins/raz-muay-thai.jpg' },
    { file: 'Tulenthienha.jpg', dest: 'images/skins/tulen-thien-ha.jpg' },
    { file: 'Wukong_Splash_Art.jpg', dest: 'images/accounts/acc-lq-02.jpg' },
    { file: 'Wukong_Splash_Art.jpg', dest: 'images/skins/ngo-khong-nhoc-ti.jpg' },
    { file: 'Murad_skin2.jpg', dest: 'images/skins/murad-sieu-viet.jpg' },
    { file: 'Airi_Sakura_Fubuki.png', dest: 'images/skins/airi-sakura.png' }
  ];

  for (const item of aovFiles) {
    const url = await getFandomImageUrl('arenaofvalor', item.file);
    if (url) {
      await downloadImage(url, item.dest);
    } else {
      console.warn('Could not find Fandom URL for', item.file);
    }
  }

  // 6. PUBG weapon & game skins
  console.log('\n--- PUBG Assets ---');
  await downloadImage('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/578080/header.jpg', 'images/accounts/acc-pubg-01.jpg');

  console.log('\n=== DOWNLOAD FINISHED ===');
}

main();
