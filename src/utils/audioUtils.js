import * as Tone from 'tone'
import { getChordFrequencies } from './musicUtils.js'

// Audio context management
export const initializeAudio = async () => {
  try {
    await Tone.start()
    console.log('Audio context started')

    // Create a more analog-sounding 80s synth setup
    const synthInstance = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sawtooth',
        detune: 0,
      },
      envelope: {
        attack: 0.005,
        decay: 0.3,
        sustain: 0.4,
        release: 1.2,
      },
      volume: -8,
    })

    // Create analog-style effects chain
    const chorus = new Tone.Chorus({
      frequency: 0.5,
      delayTime: 3.5,
      depth: 0.3,
      spread: 180,
    }).start()

    const filter = new Tone.Filter({
      frequency: 1200,
      type: 'lowpass',
      rolloff: -12,
      Q: 2,
    })

    const reverb = new Tone.Reverb({
      roomSize: 0.4,
      dampening: 4000,
      wet: 0.15,
    })

    const compressor = new Tone.Compressor({
      threshold: -18,
      ratio: 3,
      attack: 0.003,
      release: 0.1,
    })

    // Connect the effects chain: Synth -> Chorus -> Filter -> Reverb -> Compressor -> Destination
    synthInstance.connect(chorus)
    chorus.connect(filter)
    filter.connect(reverb)
    reverb.connect(compressor)
    compressor.toDestination()

    console.log('80s analog synth initialized successfully')
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
