import * as Tone from 'tone'
import { getChordFrequencies } from './musicUtils.js'

// Audio context management
export const initializeAudio = async () => {
  try {
    await Tone.start()
    console.log('Audio context started')

    const synthInstance = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'square',
        partialCount: 3,
      },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 0.4,
      },
      volume: -12, // Reduced volume
    }).toDestination()

    // Add a low-pass filter to make it smoother
    const filter = new Tone.Filter({
      frequency: 2000,
      type: 'lowpass',
    }).toDestination()

    synthInstance.connect(filter)

    console.log('Audio initialized successfully')
    return synthInstance
  } catch (error) {
    console.error('Failed to initialize audio:', error)
    throw error
  }
}

// Play chord preview function
export const playChord = (synth, chordName) => {
  if (!synth) {
    console.log('Audio not ready yet')
    return
  }

  const frequencies = getChordFrequencies(chordName)
  console.log('Playing chord:', chordName, 'Frequencies:', frequencies)

  if (frequencies.length > 0) {
    // Stop any currently playing notes first
    synth.releaseAll()

    // Short delay then play the new chord
    setTimeout(() => {
      // Use frequencies directly like the original working version
      synth.triggerAttackRelease(frequencies, '0.8')
    }, 50)
  }
}
