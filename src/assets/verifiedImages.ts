// Verified authentic photographs of Kerala and South Indian vegetables
import moringaPodsImg from './images/fresh_moringa_pods_1789547132750.jpg';
import moringaLeavesImg from './images/moringa_leaves_1789547143056.jpg';
import elephantFootYamImg from './images/elephant_foot_yam_1789547346349.jpg';
import vendakkaImg from './images/green_okra_vendakka_1790068688060.jpg';
import pavakkaImg from './images/bitter_gourd_pavakka_1790068700259.jpg';
import nendranKayaImg from './images/raw_green_plantain_1790068712401.jpg';
import kumbalangaImg from './images/ash_gourd_kumbalanga_1790068724808.jpg';
import kappaImg from './images/fresh_tapioca_roots_1790068736399.jpg';
import kovakkaImg from './images/ivy_gourd_kovakka_1790068748837.jpg';
import chembuImg from './images/taro_root_chembu_1790068763640.jpg';
import padavalangaImg from './images/snake_gourd_padavalanga_1790068777225.jpg';
import kaniVellarikkaImg from './images/kani_vellarikka_1790068827378.jpg';
import peechingaImg from './images/ridge_gourd_peechinga_1790068839532.jpg';

export interface VerifiedProduceImage {
  id: string;
  name: string;
  malayalamName: string;
  url: string;
  isCustomAsset: boolean;
}

export const VERIFIED_PRODUCE_IMAGES: VerifiedProduceImage[] = [
  {
    id: 'vendakka',
    name: "Lady's Finger / Okra (Vendakka)",
    malayalamName: 'വെണ്ടയ്ക്ക',
    url: vendakkaImg,
    isCustomAsset: true,
  },
  {
    id: 'pavakka',
    name: 'Bitter Gourd (Pavakka / Kaippakka)',
    malayalamName: 'പാവയ്ക്ക',
    url: pavakkaImg,
    isCustomAsset: true,
  },
  {
    id: 'nendran-kaya',
    name: 'Raw Cooking Plantain (Nendran Kaya)',
    malayalamName: 'നാടൻ നേന്ത്രക്കായ',
    url: nendranKayaImg,
    isCustomAsset: true,
  },
  {
    id: 'chena',
    name: 'Elephant Foot Yam (Chena)',
    malayalamName: 'നാടൻ ചേന',
    url: elephantFootYamImg,
    isCustomAsset: true,
  },
  {
    id: 'muringakka',
    name: 'Moringa Drumstick Pods (Muringakka)',
    malayalamName: 'മുരിങ്ങക്കായ',
    url: moringaPodsImg,
    isCustomAsset: true,
  },
  {
    id: 'muringayila',
    name: 'Moringa Leaves (Muringayila)',
    malayalamName: 'മുരിങ്ങയില',
    url: moringaLeavesImg,
    isCustomAsset: true,
  },
  {
    id: 'kumbalanga',
    name: 'Ash Gourd (Kumbalanga)',
    malayalamName: 'കുമ്പളങ്ങ',
    url: kumbalangaImg,
    isCustomAsset: true,
  },
  {
    id: 'kappa',
    name: 'Tapioca / Cassava (Kappa / Maracheeni)',
    malayalamName: 'കപ്പ / മരച്ചീനി',
    url: kappaImg,
    isCustomAsset: true,
  },
  {
    id: 'kovakka',
    name: 'Ivy Gourd (Kovakka / Tindora)',
    malayalamName: 'കോവയ്ക്ക',
    url: kovakkaImg,
    isCustomAsset: true,
  },
  {
    id: 'chembu',
    name: 'Colocasia / Taro (Chembu)',
    malayalamName: 'ചേമ്പ്',
    url: chembuImg,
    isCustomAsset: true,
  },
  {
    id: 'padavalanga',
    name: 'Snake Gourd (Padavalanga)',
    malayalamName: 'പടവലങ്ങ',
    url: padavalangaImg,
    isCustomAsset: true,
  },
  {
    id: 'kani-vellarikka',
    name: 'Golden Malabar Cucumber (Kani Vellarikka)',
    malayalamName: 'കണിവെള്ളരിക്ക',
    url: kaniVellarikkaImg,
    isCustomAsset: true,
  },
  {
    id: 'peechinga',
    name: 'Ridge Gourd (Peechinga)',
    malayalamName: 'പീച്ചിങ്ങ',
    url: peechingaImg,
    isCustomAsset: true,
  },
  {
    id: 'savala',
    name: 'Red Onions (Savala)',
    malayalamName: 'സവാള / വലിയ ഉള്ളി',
    url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
    isCustomAsset: false,
  },
  {
    id: 'cheriya-ulli',
    name: 'Small Sambar Shallots (Cheriya Ulli)',
    malayalamName: 'ചെറിയ ഉള്ളി',
    url: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80',
    isCustomAsset: false,
  },
  {
    id: 'thakkali',
    name: 'Country Tomatoes (Nadan Thakkali)',
    malayalamName: 'നാടൻ തക്കാളി',
    url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    isCustomAsset: false,
  },
  {
    id: 'urulakkizhangu',
    name: 'Yellow Potatoes (Urulakkizhangu)',
    malayalamName: 'ഉരുളക്കിഴങ്ങ്',
    url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    isCustomAsset: false,
  },
  {
    id: 'pachamulaku',
    name: 'Hot Green Chillies (Pachamulaku)',
    malayalamName: 'പച്ചമുളക്',
    url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
    isCustomAsset: false,
  },
  {
    id: 'inji',
    name: 'Fresh Ginger (Inji)',
    malayalamName: 'ഇഞ്ചി',
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    isCustomAsset: false,
  },
  {
    id: 'veluthulli',
    name: 'White Garlic (Veluthulli)',
    malayalamName: 'വെളുത്തുള്ളി',
    url: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80',
    isCustomAsset: false,
  },
  {
    id: 'chuvanna-cheera',
    name: 'Red Spinach / Amaranth (Chuvanna Cheera)',
    malayalamName: 'ചുവന്ന ചീര',
    url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
    isCustomAsset: false,
  },
  {
    id: 'pacha-cheera',
    name: 'Green Spinach (Pacha Cheera)',
    malayalamName: 'പച്ചച്ചീര',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    isCustomAsset: false,
  },
  {
    id: 'thenga',
    name: 'Matured Coconut (Thenga)',
    malayalamName: 'നാടൻ തേങ്ങ',
    url: 'https://images.unsplash.com/photo-1544378730-8b5104b18790?auto=format&fit=crop&w=800&q=80',
    isCustomAsset: false,
  },
  {
    id: 'kariveppila',
    name: 'Curry Leaves (Kariveppila)',
    malayalamName: 'കറിവേപ്പില',
    url: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=800&q=80',
    isCustomAsset: false,
  },
  {
    id: 'mathanga',
    name: 'Golden Pumpkin (Mathanga)',
    malayalamName: 'മത്തങ്ങ',
    url: 'https://images.unsplash.com/photo-1506917728037-b6fb01c4e97a?auto=format&fit=crop&w=800&q=80',
    isCustomAsset: false,
  },
  {
    id: 'vazhuthananga',
    name: 'Purple Brinjal / Eggplant (Vazhuthananga)',
    malayalamName: 'വഴുതനങ്ങ',
    url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80',
    isCustomAsset: false,
  },
  {
    id: 'churakka',
    name: 'Bottle Gourd (Churakka)',
    malayalamName: 'ചുരയ്ക്ക',
    url: 'https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?auto=format&fit=crop&w=800&q=80',
    isCustomAsset: false,
  },
  {
    id: 'carrot',
    name: 'Ooty Carrots (Carrot)',
    malayalamName: 'കാരറ്റ്',
    url: 'https://images.unsplash.com/photo-1582515073490-39981397c445?auto=format&fit=crop&w=800&q=80',
    isCustomAsset: false,
  },
  {
    id: 'cabbage',
    name: 'Cabbage (Mutta Cabbage)',
    malayalamName: 'കാബേജ്',
    url: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=800&q=80',
    isCustomAsset: false,
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower (Pookkose)',
    malayalamName: 'കോളിഫ്ലവർ',
    url: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=80',
    isCustomAsset: false,
  },
  {
    id: 'beetroot',
    name: 'Beetroot (Beetroot)',
    malayalamName: 'ബീറ്റ്റൂട്ട്',
    url: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=800&q=80',
    isCustomAsset: false,
  },
  {
    id: 'malliyila',
    name: 'Coriander Leaves (Malliyila)',
    malayalamName: 'മല്ലിയില',
    url: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80',
    isCustomAsset: false,
  },
  {
    id: 'pudina',
    name: 'Fresh Mint (Pudinayila)',
    malayalamName: 'പുതിനയില',
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    isCustomAsset: false,
  },
];

export {
  moringaPodsImg,
  moringaLeavesImg,
  elephantFootYamImg,
  vendakkaImg,
  pavakkaImg,
  nendranKayaImg,
  kumbalangaImg,
  kappaImg,
  kovakkaImg,
  chembuImg,
  padavalangaImg,
  kaniVellarikkaImg,
  peechingaImg,
};
