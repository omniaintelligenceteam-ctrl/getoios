process.chdir(__dirname);
process.argv = [process.argv[0], 'dev', '--port', '3000'];
require('./node_modules/next/dist/bin/next');
