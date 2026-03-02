'use client'

import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@gaqno-development/frontcore/components/ui'
import { i18n, broadcastLanguageChange } from '@gaqno-development/frontcore/i18n'

const LANG_STORAGE_KEY = 'gaqno-lng'

const VALUE_TO_LNG: Record<string, string> = {
  english: 'en',
  portuguese: 'pt-BR',
  german: 'de',
  spanish: 'es',
  korean: 'ko',
}

const LNG_TO_VALUE: Record<string, string> = {
  en: 'english',
  'pt-BR': 'portuguese',
  de: 'german',
  es: 'spanish',
  ko: 'korean',
}

function getValueFromLng(lng: string): string {
  return LNG_TO_VALUE[lng] ?? LNG_TO_VALUE[lng.split('-')[0]] ?? 'english'
}

type Props = {
  trigger: ReactNode
  defaultOpen?: boolean
  align?: 'start' | 'center' | 'end'
}

const LanguageDropdown = ({ defaultOpen, align, trigger }: Props) => {
  const [language, setLanguage] = useState(() => getValueFromLng(i18n.language ?? 'en'))

  useEffect(() => {
    const handler = () => setLanguage(getValueFromLng(i18n.language ?? 'en'))
    i18n.on('languageChanged', handler)
    return () => i18n.off('languageChanged', handler)
  }, [])

  const handleChange = (value: string) => {
    const lng = VALUE_TO_LNG[value]
    if (lng) {
      i18n.changeLanguage(lng)
      broadcastLanguageChange(lng)
      localStorage.setItem(LANG_STORAGE_KEY, lng)
    }
    setLanguage(value)
  }

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className='w-50' align={align || 'end'}>
        <DropdownMenuRadioGroup value={language} onValueChange={handleChange}>
          <DropdownMenuRadioItem
            value='english'
            className='data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground pl-2 text-base [&>span]:hidden'
          >
            English
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value='portuguese'
            className='data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground pl-2 text-base [&>span]:hidden'
          >
            Português
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value='german'
            className='data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground pl-2 text-base [&>span]:hidden'
          >
            Deutsch
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value='spanish'
            className='data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground pl-2 text-base [&>span]:hidden'
          >
            Español
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value='korean'
            className='data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground pl-2 text-base [&>span]:hidden'
          >
            한국어
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageDropdown
