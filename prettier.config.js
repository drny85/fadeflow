module.exports = {
   printWidth: 80,
   tabWidth: 3,
   singleQuote: true,
   bracketSameLine: false,
   trailingComma: 'es5',
   plugins: [require.resolve('prettier-plugin-tailwindcss')],
   tailwindAttributes: ['className']
}
