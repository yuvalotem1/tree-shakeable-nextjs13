export default function clientComponentPlugin() {
  return {
    name: 'client component',
    renderChunk(code, { fileName }) {
      console.log(fileName);
      if (fileName.includes('client') || fileName.includes('Client')) {
        return `'use client'; \n ${code}`;
      } else {
        return code;
      }
    },
  };
}
