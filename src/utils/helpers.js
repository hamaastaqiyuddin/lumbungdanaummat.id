export const formatCurrency = (val, lang = 'id') => {
    return new Intl.NumberFormat(lang === 'id' ? 'id-ID' : 'en-US', {
        style: 'currency',
        currency: lang === 'id' ? 'IDR' : 'USD',
        maximumFractionDigits: 0
    }).format(val);
};

export const getTrans = (obj, langKey) => {
    if (!obj) return '';
    return obj[langKey] || obj['en'] || (typeof obj === 'string' ? obj : '');
};

export const heroImages = [
    "/assets/images/hero-community.png",
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1600&auto=format&fit=crop"
];

export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby325AtQy15GGvZ4IZjD01EFEVkWdNX59SupP4_OjVgRGP0S_NCDiHlgroNewHmxU5t/exec";
