import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';

import axios from 'axios';

// 类型定义
type LangFile = Record<string, string>;
type TranslationResponse = {
  code: number;
  msg: string;
  data: { translation?: string };
};

const apiKey = '4c72e95e97c0419f80a8bd70824dc34f';
const langDefault = 'en';
const langs = ['ru', 'ja', 'ko', 'kk', 'zh', 'fr'] as const;
type LangCode = (typeof langs)[number] | typeof langDefault;

const cwd = process.cwd();
const i18nDir = path.join(cwd, '/');

/**
 * 获取语言文件对象
 */
async function getLangFileObj(lang: LangCode): Promise<LangFile> {
  try {
    const module = await import(`./${lang}.tsx`);
    return module.default;
  } catch (error) {
    console.warn(`🈚️  File not found for ${lang}, using empty object`);
    return {};
  }
}

/**
 * 生成语言文件字符串
 */
function generateLangFileContent(lang: string, obj: LangFile): string {
  return `const ${lang} = ${JSON.stringify(obj, null, 2)} as const;\n\nexport default ${lang};\n`;
}

/**
 * 计算API签名
 */
function calculateSignature(timestamp: number, language: string, text: string): string {
  const signatureArray = [timestamp, apiKey, language, text].sort();
  return createHash('md5').update(signatureArray.join(',')).digest('hex');
}

/**
 * 翻译文本
 */
async function translateText(language: LangCode, text: string): Promise<string> {
  if (!text.trim()) return '';

  const timestamp = Date.now();
  const signature = calculateSignature(timestamp, language, text);

  try {
    const { data } = await axios.post<TranslationResponse>(
      'https://api-test.aikavision.com/content/public/api/translate',
      { text, timestamp, language },
      { headers: { signature } },
    );

    return data.data.translation || text;
  } catch (error) {
    console.error(`❌  Translation failed for [${language}]: "${text}"`, error);
    return text;
  }
}

/**
 * 处理单个语言文件
 */
async function processLanguageFile(lang: LangCode): Promise<void> {
  const defaultLangObj = await getLangFileObj(langDefault);
  const currentLangObj = await getLangFileObj(lang);
  const filePath = path.join(i18nDir, `${lang}.tsx`);

  console.log(`Processing language: ${lang}`);

  // 创建新对象，按照默认语言文件的键顺序
  const newLangObj: LangFile = {};
  let translationsCount = 0;

  // 按照默认语言文件的键顺序遍历
  for (const [key, defaultValue] of Object.entries(defaultLangObj)) {
    // 优先使用现有翻译（如果有）
    if (currentLangObj[key]) {
      newLangObj[key] = currentLangObj[key];
    }
    // 没有现有翻译，需要翻译
    else {
      newLangObj[key] = await translateText(lang, defaultValue);
      translationsCount++;
      // 添加延迟避免请求过速
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  // 不需要保留默认语言中不存在的数据
  // 添加默认语言文件中不存在但当前语言文件中存在的键（保留这些翻译）
  // for (const [key, value] of Object.entries(currentLangObj)) {
  //   if (!(key in defaultLangObj)) {
  //     newLangObj[key] = value;
  //     console.warn(`⚠️  保留额外键: ${key} (在 ${lang} 中存在但默认语言中不存在)`);
  //   }
  // }

  fs.writeFileSync(filePath, generateLangFileContent(lang, newLangObj), 'utf-8');
  console.log(`Updated ${filePath} with ${translationsCount} new translations`);
}

/**
 * 主执行函数
 */
async function run() {
  // 确保目录存在
  if (!fs.existsSync(i18nDir)) {
    fs.mkdirSync(i18nDir, { recursive: true });
  }

  // 使用Promise.all并行处理所有语言
  await Promise.all((langs as readonly string[]).map((lang) => processLanguageFile(lang as LangCode)));

  console.log('✅  All language files processed successfully');
}

/**
 * 执行主函数
 */
run().catch(console.error);
