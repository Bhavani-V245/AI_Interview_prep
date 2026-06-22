// Utility to handle topic-specific cache, solved tracking, and dynamic batch sizing
export const CacheManager = {
  getCacheKey: (module, topic) => `mockmate_cache_${module}_${topic}`,
  getSolvedKey: (module, topic) => `mockmate_solved_${module}_${topic}`,
  getBatchSizeKey: (module) => `mockmate_batch_size_${module}`,

  getCache: (module, topic) => {
    try {
      const data = localStorage.getItem(CacheManager.getCacheKey(module, topic));
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  },

  setCache: (module, topic, items) => {
    try {
      localStorage.setItem(CacheManager.getCacheKey(module, topic), JSON.stringify(items));
    } catch (e) { console.error('Cache set error', e); }
  },

  getSolved: (module, topic) => {
    try {
      const data = localStorage.getItem(CacheManager.getSolvedKey(module, topic));
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  },

  addSolved: (module, topic, itemIdentifier) => {
    if (!itemIdentifier) return;
    try {
      const solved = CacheManager.getSolved(module, topic);
      if (!solved.includes(itemIdentifier)) {
        solved.push(itemIdentifier);
        localStorage.setItem(CacheManager.getSolvedKey(module, topic), JSON.stringify(solved));
      }
    } catch (e) { console.error('Solved add error', e); }
  },

  getBatchSize: (module, defaultSize) => {
    try {
      const data = localStorage.getItem(CacheManager.getBatchSizeKey(module));
      return data ? parseInt(data, 10) : defaultSize;
    } catch { return defaultSize; }
  },

  adjustBatchSize: (module, defaultSize, generationTimeMs) => {
    if (generationTimeMs > 25000) {
      // If it took more than 25 seconds, reduce batch size by 5 (min 5)
      let currentSize = CacheManager.getBatchSize(module, defaultSize);
      let newSize = Math.max(5, currentSize - 5);
      if (newSize < currentSize) {
        localStorage.setItem(CacheManager.getBatchSizeKey(module), newSize.toString());
        console.warn(`[MockMate] Dynamic Batch: Generation took ${Math.round(generationTimeMs/1000)}s. Reduced batch size for ${module} to ${newSize}.`);
        return newSize;
      }
    }
    return CacheManager.getBatchSize(module, defaultSize);
  },

  clearCache: (module, topic) => {
    localStorage.removeItem(CacheManager.getCacheKey(module, topic));
  }
};
