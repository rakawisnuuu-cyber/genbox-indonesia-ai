export interface CharacterConfig {
  skin_tone: string;
  face_shape: string;
  eye_color: string;
  hair_style: string;
  hair_color: string;
  expression: string;
  outfit: string;
  skin_condition: string;
}

export interface PresetCharacter {
  id: string;
  name: string;
  gender: string;
  age_range: string;
  style: string;
  tags: string[];
  description: string;
  gradient: string;
  config: CharacterConfig;
}

export const PRESET_CHARACTERS: PresetCharacter[] = [
  {
    id: "preset-1",
    name: "Hijab Casual",
    gender: "female",
    age_range: "20-25",
    style: "Hijab Modern",
    tags: ["Wanita", "20-25", "Modern"],
    description: "Wanita muda dengan hijab modern pastel, ekspresi hangat dan ramah. Cocok untuk skincare, fashion modest, dan lifestyle.",
    gradient: "from-emerald-900/40 to-teal-900/40",
    config: { skin_tone: "sawo_matang", face_shape: "oval", eye_color: "coklat_tua", hair_style: "hijab_modern", hair_color: "hitam", expression: "hangat_ramah", outfit: "Casual modern dengan hijab pastel", skin_condition: "bersih_natural" },
  },
  {
    id: "preset-2",
    name: "Urban Trendy",
    gender: "male",
    age_range: "22-28",
    style: "Streetwear",
    tags: ["Pria", "22-28", "Streetwear"],
    description: "Pria muda urban dengan gaya streetwear, percaya diri dan modern. Cocok untuk fashion, tech, dan lifestyle pria.",
    gradient: "from-blue-900/40 to-indigo-900/40",
    config: { skin_tone: "sawo_matang", face_shape: "kotak", eye_color: "coklat_tua", hair_style: "undercut", hair_color: "hitam", expression: "percaya_diri", outfit: "Oversized hoodie, sneakers, streetwear", skin_condition: "bersih_natural" },
  },
  {
    id: "preset-3",
    name: "Ibu Muda",
    gender: "female",
    age_range: "25-35",
    style: "Casual",
    tags: ["Wanita", "25-35", "Friendly"],
    description: "Ibu muda yang relatable dan ramah. Cocok untuk produk rumah tangga, parenting, dan kesehatan.",
    gradient: "from-rose-900/40 to-pink-900/40",
    config: { skin_tone: "sawo_terang", face_shape: "oval", eye_color: "coklat_madu", hair_style: "lurus_panjang", hair_color: "coklat_tua", expression: "hangat_ramah", outfit: "Casual dress, cardigan", skin_condition: "bersih_natural" },
  },
  {
    id: "preset-4",
    name: "Mahasiswa",
    gender: "neutral",
    age_range: "18-22",
    style: "Casual",
    tags: ["Pria/Wanita", "18-22", "Energik"],
    description: "Mahasiswa energik dan ceria. Cocok untuk produk edukasi, gadget, snack, dan lifestyle anak muda.",
    gradient: "from-amber-900/40 to-orange-900/40",
    config: { skin_tone: "sawo_matang", face_shape: "bulat", eye_color: "coklat_tua", hair_style: "messy_textured", hair_color: "hitam", expression: "energik_ceria", outfit: "T-shirt, jeans, casual campus look", skin_condition: "bersih_natural" },
  },
  {
    id: "preset-5",
    name: "Beauty Enthusiast",
    gender: "female",
    age_range: "20-30",
    style: "Beauty/Glam",
    tags: ["Wanita", "20-30", "Glowing"],
    description: "Pecinta kecantikan dengan kulit glowing dan makeup natural. Cocok untuk skincare, makeup, dan beauty tools.",
    gradient: "from-fuchsia-900/40 to-purple-900/40",
    config: { skin_tone: "kuning_langsat", face_shape: "hati", eye_color: "coklat_madu", hair_style: "wavy_natural", hair_color: "coklat_tua", expression: "lembut_natural", outfit: "Minimal elegant, focus on skin", skin_condition: "glowing_sehat" },
  },
  {
    id: "preset-6",
    name: "Bapak UMKM",
    gender: "male",
    age_range: "35-50",
    style: "Professional",
    tags: ["Pria", "35-50", "Profesional"],
    description: "Bapak pengusaha yang terpercaya dan profesional. Cocok untuk produk bisnis, alat kerja, dan B2B.",
    gradient: "from-slate-800/40 to-zinc-800/40",
    config: { skin_tone: "sawo_gelap", face_shape: "kotak", eye_color: "hitam", hair_style: "pendek_rapi", hair_color: "hitam", expression: "kalem_pro", outfit: "Polo shirt or batik, professional casual", skin_condition: "matte_clean" },
  },
  {
    id: "preset-7",
    name: "Gen-Z Creator",
    gender: "neutral",
    age_range: "17-22",
    style: "Streetwear",
    tags: ["Pria/Wanita", "17-22", "Trendy"],
    description: "Content creator Gen-Z yang trendy dan ekspresif. Cocok untuk brand anak muda, F&B, dan digital products.",
    gradient: "from-cyan-900/40 to-sky-900/40",
    config: { skin_tone: "sawo_matang", face_shape: "oval", eye_color: "coklat_tua", hair_style: "messy_textured", hair_color: "highlighted", expression: "energik_ceria", outfit: "Oversized trendy clothes, accessories", skin_condition: "bersih_natural" },
  },
  {
    id: "preset-8",
    name: "Office Worker",
    gender: "neutral",
    age_range: "25-35",
    style: "Smart Casual",
    tags: ["Pria/Wanita", "25-35", "Smart Casual"],
    description: "Pekerja kantor yang rapi dan profesional. Cocok untuk produk office, tech, dan corporate lifestyle.",
    gradient: "from-gray-800/40 to-neutral-800/40",
    config: { skin_tone: "sawo_terang", face_shape: "lonjong", eye_color: "coklat_tua", hair_style: "side_part", hair_color: "hitam", expression: "kalem_pro", outfit: "Smart casual, blazer optional", skin_condition: "matte_clean" },
  },
  {
    id: "preset-9",
    name: "Ibu PKK",
    gender: "female",
    age_range: "35-50",
    style: "Traditional",
    tags: ["Wanita", "35-50", "Ramah"],
    description: "Ibu komunitas yang hangat dan terpercaya. Cocok untuk produk dapur, kesehatan, dan keluarga.",
    gradient: "from-green-900/40 to-lime-900/40",
    config: { skin_tone: "sawo_matang", face_shape: "bulat", eye_color: "hitam", hair_style: "hijab_syari", hair_color: "hitam", expression: "hangat_ramah", outfit: "Modest traditional, hijab with batik accent", skin_condition: "bersih_natural" },
  },
  {
    id: "preset-10",
    name: "Cowok Gym",
    gender: "male",
    age_range: "22-30",
    style: "Athletic",
    tags: ["Pria", "22-30", "Athletic"],
    description: "Pria atletis dan percaya diri. Cocok untuk suplemen, gym equipment, sportswear, dan healthy lifestyle.",
    gradient: "from-red-900/40 to-orange-900/40",
    config: { skin_tone: "sawo_gelap", face_shape: "kotak", eye_color: "coklat_tua", hair_style: "buzz_cut", hair_color: "hitam", expression: "percaya_diri", outfit: "Gym tank top, athletic wear", skin_condition: "bersih_natural" },
  },
];
