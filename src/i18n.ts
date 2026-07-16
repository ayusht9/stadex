import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Dashboard": "Dashboard",
      "Stadiums": "Stadiums",
      "Chatbot": "Chatbot",
      "Translator": "Translator",
      "Fan": "Fan",
      "Staff": "Staff",
      "FIFA '26 Assist": "FIFA '26 Assist"
    }
  },
  es: {
    translation: {
      "Dashboard": "Tablero",
      "Stadiums": "Estadios",
      "Chatbot": "Chatbot",
      "Translator": "Traductor",
      "Fan": "Aficionado",
      "Staff": "Personal",
      "FIFA '26 Assist": "Asistente FIFA '26"
    }
  },
  fr: {
    translation: {
      "Dashboard": "Tableau de bord",
      "Stadiums": "Stades",
      "Chatbot": "Chatbot",
      "Translator": "Traducteur",
      "Fan": "Supporter",
      "Staff": "Personnel",
      "FIFA '26 Assist": "Assistant FIFA '26"
    }
  },
  de: {
    translation: {
      "Dashboard": "Übersicht",
      "Stadiums": "Stadien",
      "Chatbot": "Chatbot",
      "Translator": "Übersetzer",
      "Fan": "Fan",
      "Staff": "Personal",
      "FIFA '26 Assist": "FIFA '26 Assistent"
    }
  },
  pt: {
    translation: {
      "Dashboard": "Painel",
      "Stadiums": "Estádios",
      "Chatbot": "Chatbot",
      "Translator": "Tradutor",
      "Fan": "Fã",
      "Staff": "Equipe",
      "FIFA '26 Assist": "Assistente FIFA '26"
    }
  },
  ar: {
    translation: {
      "Dashboard": "لوحة القيادة",
      "Stadiums": "الملاعب",
      "Chatbot": "دردشة آلية",
      "Translator": "مترجم",
      "Fan": "مشجع",
      "Staff": "موظف",
      "FIFA '26 Assist": "مساعد فيفا '26"
    }
  },
  ru: {
    translation: {
      "Dashboard": "Панель",
      "Stadiums": "Стадионы",
      "Chatbot": "Чат-бот",
      "Translator": "Переводчик",
      "Fan": "Фанат",
      "Staff": "Персонал",
      "FIFA '26 Assist": "Помощник FIFA '26"
    }
  },
  zh: {
    translation: {
      "Dashboard": "仪表板",
      "Stadiums": "体育场",
      "Chatbot": "聊天机器人",
      "Translator": "翻译",
      "Fan": "球迷",
      "Staff": "员工",
      "FIFA '26 Assist": "FIFA '26 助手"
    }
  },
  ja: {
    translation: {
      "Dashboard": "ダッシュボード",
      "Stadiums": "スタジアム",
      "Chatbot": "チャットボット",
      "Translator": "翻訳者",
      "Fan": "ファン",
      "Staff": "スタッフ",
      "FIFA '26 Assist": "FIFA '26 アシスタント"
    }
  },
  it: {
    translation: {
      "Dashboard": "Dashboard",
      "Stadiums": "Stadi",
      "Chatbot": "Chatbot",
      "Translator": "Traduttore",
      "Fan": "Tifoso",
      "Staff": "Personale",
      "FIFA '26 Assist": "Assistente FIFA '26"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
