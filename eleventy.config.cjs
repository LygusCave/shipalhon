module.exports = function(eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);
  
  // Копируем статику (пути теперь считаются от корня проекта)
  eleventyConfig.addPassthroughCopy({ "front/styles": "styles" });
  eleventyConfig.addPassthroughCopy({ "front/scripts": "scripts" });
  eleventyConfig.addPassthroughCopy({ "front/favicon.svg": "favicon.svg" });

  return {
    templateFormats: ["md", "html", "njk"],
    dir: {
      input: "front",          // Входная папка — front
      includes: "layout",      // Папка с шаблонами внутри front (без ../)
      output: "dist"          // Результат в корень проекта
    }
  };
};