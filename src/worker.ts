import { pipeline, env } from '@xenova/transformers';

// Skip local model check since we are running in a browser
env.allowLocalModels = false;
env.useBrowserCache = true;

class PipelineSingleton {
  static task = 'text2text-generation';
  static model = 'Xenova/LaMini-Flan-T5-78M';
  static instance: any = null;

  static async getInstance(progress_callback: (info: any) => void) {
    if (this.instance === null) {
      // @ts-ignore
      this.instance = await pipeline(this.task, this.model, {
        progress_callback,
      });
    }
    return this.instance;
  }
}

class TranslationSingleton {
  static task = 'translation';
  static model = 'Xenova/m2m100_418M';
  static instance: any = null;

  static async getInstance(progress_callback: (info: any) => void) {
    if (this.instance === null) {
      // @ts-ignore
      this.instance = await pipeline(this.task, this.model, {
        progress_callback,
      });
    }
    return this.instance;
  }
}

self.addEventListener('message', async (event) => {
  const { type, payload } = event.data;

  if (type === 'qa_load') {
    try {
      await PipelineSingleton.getInstance((progress) => {
        self.postMessage({ status: 'progress', type: 'qa', progress });
      });
      self.postMessage({ status: 'ready', type: 'qa' });
    } catch (e: unknown) {
      self.postMessage({ status: 'error', type: 'qa', error: e instanceof Error ? e.message : String(e) });
    }
  }

  if (type === 'qa_query') {
    const { question, context } = payload;
    const qaPipeline = await PipelineSingleton.getInstance(() => {});
    
    try {
      const prompt = `Context: ${context}\n\nQuestion: ${question}\n\nAnswer:`;
      const result = await qaPipeline(prompt, { max_new_tokens: 100 });
      self.postMessage({ status: 'complete', type: 'qa', result: { answer: result[0].generated_text } });
    } catch (e: unknown) {
      self.postMessage({ status: 'error', type: 'qa', error: e instanceof Error ? e.message : String(e) });
    }
  }

  if (type === 'translate_load') {
    try {
      await TranslationSingleton.getInstance((progress) => {
        self.postMessage({ status: 'progress', type: 'translate', progress });
      });
      self.postMessage({ status: 'ready', type: 'translate' });
    } catch (e: unknown) {
      self.postMessage({ status: 'error', type: 'translate', error: e instanceof Error ? e.message : String(e) });
    }
  }

  if (type === 'translate_query') {
    const { text, src_lang, tgt_lang } = payload;
    const transPipeline = await TranslationSingleton.getInstance(() => {});
    
    try {
      const result = await transPipeline(text, {
        src_lang,
        tgt_lang,
      });
      self.postMessage({ status: 'complete', type: 'translate', result });
    } catch (e: any) {
      self.postMessage({ status: 'error', type: 'translate', error: e.message });
    }
  }
});
