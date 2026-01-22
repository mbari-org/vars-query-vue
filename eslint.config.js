import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import header from 'eslint-plugin-header'

header.rules.header.meta.schema = false

const apacheLicenseHeader = [
  'block',
  [
    '*',
    ' * Copyright 2017 Monterey Bay Aquarium Research Institute',
    ' *',
    ' * Licensed under the Apache License, Version 2.0 (the "License");',
    ' * you may not use this file except in compliance with the License.',
    ' * You may obtain a copy of the License at',
    ' *',
    ' *     http://www.apache.org/licenses/LICENSE-2.0',
    ' *',
    ' * Unless required by applicable law or agreed to in writing, software',
    ' * distributed under the License is distributed on an "AS IS" BASIS,',
    ' * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
    ' * See the License for the specific language governing permissions and',
    ' * limitations under the License.',
    ' ',
  ],
]

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  skipFormatting,

  {
    name: 'app/license-header',
    files: ['src/**/*.{ts,mts,tsx}'],
    plugins: {
      header,
    },
    rules: {
      'header/header': ['error', ...apacheLicenseHeader],
    },
  },
]
