/**
 * Универсальная система кодирования/декодирования для URL параметров
 * Поддерживает русские символы и обеспечивает целостность URL
 */

/**
 * Кодирует объект в base64 строку, безопасную для URL
 * @param data - объект для кодирования
 * @returns base64 строка, безопасная для URL
 */
export const encodeObjectToUrlSafeBase64 = (jsonString: string): string => {
  try {
    // Используем встроенную функцию btoa для кодирования
    let base64String: string;

    if (typeof window !== "undefined" && window.btoa) {
      // Браузерная среда
      base64String = window.btoa(unescape(encodeURIComponent(jsonString)));
    } else {
      // Node.js среда
      base64String = Buffer.from(jsonString, "utf8").toString("base64");
    }

    // Делаем URL-безопасным (заменяем + на -, / на _ и убираем =)
    return base64String
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  } catch (error) {
    console.error("Error encoding object to base64:", error);
    throw new Error("Failed to encode object to base64");
  }
};

/**
 * Декодирует base64 строку обратно в объект
 * @param base64String - base64 строка для декодирования
 * @returns декодированный объект
 */
export const decodeObjectFromUrlSafeBase64 = (base64String: string): any => {
  try {
    // Восстанавливаем стандартный base64 формат
    let standardBase64 = base64String.replace(/-/g, "+").replace(/_/g, "/");

    // Добавляем padding если нужно
    while (standardBase64.length % 4) {
      standardBase64 += "=";
    }

    // Декодируем base64 в строку
    let jsonString: string;

    if (typeof window !== "undefined" && window.atob) {
      // Браузерная среда
      jsonString = decodeURIComponent(escape(window.atob(standardBase64)));
    } else {
      // Node.js среда
      jsonString = Buffer.from(standardBase64, "base64").toString("utf8");
    }

    // Парсим JSON
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error decoding base64 string:", error);
    throw new Error("Failed to decode base64 string");
  }
};
