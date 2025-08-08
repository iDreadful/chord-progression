import { getCurrentChords } from './musicUtils.js'

export const generateAIProgression = async (prompt, key, mode, length) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    console.warn('OpenAI API key not found, using placeholder progression')
    return generatePlaceholderProgression(key, mode, length)
  }

  const systemPrompt = `You are a music theory expert. Generate chord progressions based on the user's description.

Context:
- Key: ${key}
- Mode: ${mode}
- Sequence length: ${length} chords
- Style/Mood: ${prompt}

Output format (STRICT):
{
  "progression": [
    { "degree": 1, "roman": "I" },
    { "degree": 5, "roman": "V" }
    // ... exactly ${length} items total
  ]
}

Hard rules:
- Provide exactly ${length} items.
- Do NOT include chord names, qualities, or extensions in the output. Absolutely no fields like "chord", "name", "notes", "maj", "min", "dim", "7", "sus", "add", or slash chords.
- Use only diatonic triads of the specified key/mode. Represent them by scale degree (1-7) and correct Roman numerals (use case for quality and the ° sign for diminished where appropriate).
- For C Ionian, for example, the diatonic triads are exactly: C, Dm, Em, F, G, Am, B°.
- For other keys/modes, use the corresponding diatonic set. Keep responses musical and match the requested style.`

  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1-0528:free',
          messages: [{ role: 'system', content: systemPrompt }],
          max_tokens: 500,
          response_format: { type: 'json_object' },
          temperature: 0.1,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedText = data.choices?.[0]?.message?.content?.trim?.() || ''
    console.log(generatedText)

    // Parse the JSON response, tolerating a few schema variants
    let parsed
    try {
      parsed = JSON.parse(generatedText)
    } catch (e) {
      throw new Error('AI response was not valid JSON')
    }

    let raw = []
    if (Array.isArray(parsed)) raw = parsed
    else if (Array.isArray(parsed.progression)) raw = parsed.progression
    else if (Array.isArray(parsed.chords)) raw = parsed.chords
    else if (Array.isArray(parsed.chord_progression))
      raw = parsed.chord_progression

    if (!Array.isArray(raw) || raw.length !== length) {
      throw new Error('Invalid response format from AI')
    }

    // Map to playable chords using local diatonic data
    const mapped = mapToPlayableProgression(raw, key, mode)
    if (!Array.isArray(mapped) || mapped.length !== length) {
      throw new Error('Failed to map AI progression to playable chords')
    }

    return mapped
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw error
  }
}

export const generatePlaceholderProgression = (
  selectedKey,
  keyType,
  sequenceLength
) => {
  const current = getCurrentChords(keyType, selectedKey)
  const byDegreePatterns = {
    ionian: [1, 5, 6, 4],
    aeolian: [1, 7, 6, 7],
  }

  const degPattern = byDegreePatterns[keyType] || byDegreePatterns.ionian

  const result = Array.from({ length: sequenceLength }, (_, i) => {
    const degree = degPattern[i % degPattern.length]
    const idx = Math.max(0, Math.min(6, (degree || 1) - 1))
    const chord = current.notes?.[idx] || current.notes?.[0] || selectedKey
    const roman = current.roman?.[idx] || 'I'
    return { chord, roman }
  })

  return result
}

// Helper: map AI output entries (with degree and/or roman) to playable chord objects
const mapToPlayableProgression = (rawItems, key, mode) => {
  const current = getCurrentChords(mode, key)
  const normRoman = s =>
    (s || '').toString().replace(/\s+/g, '').replace(/º/g, '°')

  return rawItems.map(item => {
    const degree = Number(item.degree)
    let idx = Number.isFinite(degree)
      ? Math.max(0, Math.min(6, degree - 1))
      : -1

    if (idx < 0 && item.roman) {
      const target = normRoman(item.roman)
      idx = (current.roman || []).findIndex(r => normRoman(r) === target)
    }

    if (idx < 0) idx = 0 // fallback to tonic

    return {
      chord: current.notes?.[idx] || current.notes?.[0] || key,
      roman: current.roman?.[idx] || current.roman?.[0] || 'I',
    }
  })
}
