// Configuration lives in Script Properties (Project Settings > Script Properties),
// never in source. See config.example.json for the keys this project needs.

let CONFIG_CACHE_ = null;

/**
 * Read a Script Property. Throws a descriptive error if it is missing or empty.
 * @param {string} key
 * @param {{json?: boolean}} [options] json: parse the value as JSON
 */
function getConfig(key, options) {
  if (CONFIG_CACHE_ === null) {
    CONFIG_CACHE_ = PropertiesService.getScriptProperties().getProperties();
  }
  const raw = CONFIG_CACHE_[key];
  if (raw === undefined || raw === null || String(raw).trim() === "") {
    throw new Error(
      `Missing Script Property "${key}". Add it under Project Settings > Script Properties (see config.example.json).`,
    );
  }
  if (options && options.json) {
    try {
      return JSON.parse(raw);
    } catch (err) {
      throw new Error(
        `Script Property "${key}" is not valid JSON: ${err.message}`,
      );
    }
  }
  return raw;
}

// Web app links are built as `${url}&rowId=...`, so keep the ?authuser=0 suffix.
function getWebAppLink_(key) {
  return `${getConfig(key)}?authuser=0`;
}
