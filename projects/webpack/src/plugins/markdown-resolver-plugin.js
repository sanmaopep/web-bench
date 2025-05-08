const path = require('path');

class MarkdownResolverPlugin {
  constructor(options = {}) {
    this.defaultLang = options.defaultLang || 'zh';
  }

  apply(resolver) {
    const target = resolver.ensureHook('file');

    resolver.getHook('resolve').tapAsync(
      'MarkdownResolverPlugin',
      (request, resolveContext, callback) => {
        if (!request.request || typeof request.request !== 'string' || !request.request.endsWith('.md')) {
          return callback();
        }

        const context = request.context?.issuer 
          ? path.dirname(request.context.issuer)
          : request.path;

        if (!context) {
          return callback();
        }

        try {
          const mdPath = request.request;
          const dirName = path.dirname(mdPath);
          const baseName = path.basename(mdPath, '.md');

          const localizedPath = path.join(dirName, `${baseName}.${this.defaultLang}.md`);

          const resolvedLocalizedPath = resolver.join(context, localizedPath)
          resolver.fileSystem.stat(
            resolvedLocalizedPath,
            (err, stat) => {
              if (!err && stat && stat.isFile()) {
                const obj = Object.assign({}, request, {
                  path: resolvedLocalizedPath
                });
                resolver.doResolve(
                  target,
                  obj,
                  `localized file: ${localizedPath}`,
                  resolveContext,
                  (...args) => {
                    callback(...args)
                  }
                );
              } else {
                callback();
              }
            }
          );
        } catch (error) {
          console.error('[MarkdownResolverPlugin] Error:', error);
          callback();
        }
      }
    );
  }
}

module.exports = MarkdownResolverPlugin; 