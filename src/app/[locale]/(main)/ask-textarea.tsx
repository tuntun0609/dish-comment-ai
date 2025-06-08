'use client'

import type React from 'react'
import { useState } from 'react'
import { ArrowUp, Loader2, Type } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { ContentDisplay } from '@/components/content-display'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'

import { generateComment } from './chat-action'

export default function AskTextarea() {
  const t = useTranslations('AskTextarea')
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [wordLimit, setWordLimit] = useState(100)
  const [style, setStyle] = useState('标准')
  const [comment, setComment] = useState('')

  const styles = [
    { value: '标准', label: t('styles.standard') },
    { value: '可爱', label: t('styles.cute') },
    { value: '冷酷', label: t('styles.cool') },
    { value: '幽默', label: t('styles.humor') },
  ]

  const handleSubmit = async () => {
    try {
      if (question.trim()) {
        console.log('提交问题:', question, '字数限制:', wordLimit, '风格:', style)
        setLoading(true)
        const answer = await generateComment(question, wordLimit, style)
        console.log(answer)
        setComment(answer || '')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div id="ask-textarea" className="flex flex-col items-center justify-center p-6">
      <div className="mx-auto w-full max-w-4xl">
        {/* 输入框区域 */}
        <div className="relative mx-auto max-w-3xl">
          <div className="rounded-2xl border border-gray-200/80 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-gray-300/80 hover:shadow-xl">
            <div className="flex flex-col gap-4 p-3">
              {/* 输入框 */}
              <div>
                <Textarea
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('placeholder')}
                  className="max-h-[180px] min-h-[56px] resize-none border-none border-gray-200 bg-transparent p-2 text-lg leading-relaxed shadow-none transition-all duration-300 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                  style={{
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  }}
                />
              </div>

              {/* 控件区域 */}
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-0">
                {/* 左侧控件 */}
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2">
                    <Type className="h-4 w-4 text-gray-500" />
                    <div className="w-32">
                      <Slider
                        value={[wordLimit]}
                        onValueChange={(value: number[]) => setWordLimit(value[0])}
                        min={30}
                        max={200}
                        step={10}
                        className="w-full"
                      />
                    </div>
                    <span className="text-sm text-gray-500">
                      {wordLimit}&nbsp;
                      {t('wordLimit')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {styles.map(s => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 右侧发送按钮 */}
                <div className="flex w-full items-center justify-end gap-1.5 sm:w-auto">
                  <Button
                    onClick={handleSubmit}
                    disabled={!question.trim() || loading}
                    size="sm"
                    className="h-9 w-full rounded-xl shadow-sm transition-all duration-200 hover:shadow-md disabled:from-gray-300 disabled:to-gray-300 sm:w-9"
                  >
                    {loading ? (
                      <Loader2 className="h-4.5 w-4.5 animate-spin text-white" />
                    ) : (
                      <ArrowUp className="h-4.5 w-4.5 text-white" />
                    )}
                    <span className="block sm:hidden">{t('generateComment')}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部提示文字 */}
        <div className="mt-8 hidden text-center sm:block">
          <p className="text-sm text-gray-500/80">
            {t.rich('keyboardHint', {
              Kdb: (chunks: any) => (
                <kbd className="rounded border bg-gray-100 px-1.5 py-0.5 text-xs">{chunks}</kbd>
              ),
            })}
          </p>
        </div>

        {comment && <ContentDisplay content={comment} className="mt-4" />}
      </div>
    </div>
  )
}
