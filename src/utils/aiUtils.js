export const generateAIProgression = async (prompt, key, mode, length) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    console.warn('OpenAI API key not found, using placeholder progression')
    return generatePlaceholderProgression(key, mode, length)
  }

  const systemPrompt = `You are a music theory expert specializing in chord progressions. Generate chord progressions based on user descriptions.

Current musical context:
- Key: ${key}
- Mode: ${mode}
- Sequence length: ${length} chords
- Style/Mood: ${prompt}

Return your response as a JSON array of objects with exactly this example format:

[
  {"chord": "C", "roman": "I"},
  {"chord": "Fm", "roman": "IV"}, 
  ...
]

Rules:
- Provide exactly ${length} chord objects
- Use proper chord notation (e.g., "C", "Dm", "Em", "F", "G", "Am", "Bº")
- Use correct Roman numeral analysis for the key and mode
- Make chord progressions musically sensible and appropriate for the requested style/mood`

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
    const generatedText = data.choices[0].message.content.trim()
    console.log(generatedText)

    // Parse the JSON response
    const progression =
      JSON.parse(generatedText).chords ||
      JSON.parse(generatedText).progression ||
      JSON.parse(generatedText).chord_progression ||
      []

    // Validate the response format
    if (!Array.isArray(progression) || progression.length !== length) {
      throw new Error('Invalid response format from OpenAI')
    }

    return progression
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
  const progression = Array(sequenceLength).fill(null)
  const commonProgressions = {
    ionian: ['I', 'V', 'vi', 'IV', 'I', 'V', 'vi', 'IV'],
    aeolian: ['i', 'VII', 'VI', 'VII', 'i', 'VII', 'VI', 'VII'],
  }

  const pattern = commonProgressions[keyType] || commonProgressions.ionian
  for (let i = 0; i < sequenceLength; i++) {
    const roman = pattern[i % pattern.length]
    // This is simplified - in real implementation, you'd generate actual chord names
    progression[i] = { chord: `${selectedKey}maj`, roman: roman }
  }

  return progression
}
