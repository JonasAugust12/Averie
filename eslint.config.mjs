import { defineConfig, globalIgnores } from 'eslint/config';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = defineConfig([
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    prettier,
    {
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            'react/no-unescaped-entities': 'off',
            '@next/next/no-img-element': 'warn',
        },
    },
    globalIgnores([
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
        'node_modules/**',
        '.vscode/**',
    ]),
]);

export default eslintConfig;
