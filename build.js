const exe = require('@angablue/exe');

const build = exe({
  entry: './main.js',
  out: './build/Bershadskii JS.exe',
  target: 'latest-win-x64',
});

build.then(() => console.log('Сборка завершена.'));
