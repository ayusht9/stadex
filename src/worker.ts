import { pipeline, env } from '@xenova/transformers';

// Skip local model check since we are running in a browser
env.allowLocalModels = false;
env.useBrowserCache = true;

class PipelineSingleton {
  static task = 'question-answering';
  static model = 'Xenova/distilbert-base-uncased-distilled-squad';
  static instance: any = null;

  static async getInstance(progress_callback: (info: any) => void) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model, {
        progress_callback,
      });
    }
    return this.instance;
  }
}

class TranslationSingleton {
  static task = 'translation';
  static model = 'Xenova/nllb-200-distilled-600M';
  static instance: any = null;

  static async getInstance(progress_callback: (info: any) => void) {
    if (this.instance === null) {
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
      const qaPipeline = await PipelineSingleton.getInstance((progress) => {
        self.postMessage({ status: 'progress', type: 'qa', progress });
      });
      self.postMessage({ status: 'ready', type: 'qa' });
    } catch (e) {
      self.postMessage({ status: 'error', type: 'qa', error: e.message });
    }
  }

  if (type === 'qa_query') {
    const { question, context } = payload;
    const qaPipeline = await PipelineSingleton.getInstance(() => {});
    
    try {
      const result = await qaPipeline(question, context);
      self.postMessage({ status: 'complete', type: 'qa', result });
    } catch (e) {
      self.postMessage({ status: 'error', type: 'qa', error: e.message });
    }
  }

  if (type === 'translate_load') {
    try {
      const transPipeline = await TranslationSingleton.getInstance((progress) => {
        self.postMessage({ status: 'progress', type: 'translate', progress });
      });
      self.postMessage({ status: 'ready', type: 'translate' });
    } catch (e) {
      self.postMessage({ status: 'error', type: 'translate', error: e.message });
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
    } catch (e) {
      self.postMessage({ status: 'error', type: 'translate', error: e.message });
    }
  }
});
