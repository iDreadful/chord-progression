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
      // Convert frequencies to note names for Tone.js
      const noteNames = frequencies.map(freq => {
        // Convert frequency to note name (approximate)
        const noteMap = {
          261.63: 'C4',
          277.18: 'C#4',
          293.66: 'D4',
          311.13: 'D#4',
          329.63: 'E4',
          349.23: 'F4',
          369.99: 'F#4',
          392.0: 'G4',
          415.3: 'G#4',
          440.0: 'A4',
          466.16: 'A#4',
          493.88: 'B4',
          // Higher octaves
          523.25: 'C5',
          554.37: 'C#5',
          587.33: 'D5',
          622.25: 'D#5',
          659.25: 'E5',
          698.46: 'F5',
          739.99: 'F#5',
          783.99: 'G5',
          830.61: 'G#5',
          880.0: 'A5',
          932.33: 'A#5',
          987.77: 'B5',
        }

        // Find closest frequency match
        let closestNote = 'C4'
        let minDiff = Math.abs(freq - 261.63)

        Object.entries(noteMap).forEach(([mapFreq, note]) => {
          const diff = Math.abs(freq - parseFloat(mapFreq))
          if (diff < minDiff) {
            minDiff = diff
            closestNote = note
          }
        })

        return closestNote
      })

      synth.triggerAttackRelease(noteNames, '8n')
    }, 50)
  }
}
