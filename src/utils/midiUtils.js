import { Midi } from '@tonejs/midi'
import { modes } from './musicData.js'

// Convert chord name to MIDI notes
export const chordToMidiNotes = chordName => {
  const root = chordName.replace(/[m°#b]/g, '')

  // Note to MIDI mapping (C4 = 60)
  const noteToMidi = {
    C: 60,
    'C#': 61,
    Db: 61,
    D: 62,
    'D#': 63,
    Eb: 63,
    E: 64,
    F: 65,
    'F#': 66,
    Gb: 66,
    G: 67,
    'G#': 68,
    Ab: 68,
    A: 69,
    'A#': 70,
    Bb: 70,
    B: 71,
  }

  const rootMidi = noteToMidi[root]
  if (!rootMidi) return []

  let notes = [rootMidi]

  if (chordName.includes('m') && !chordName.includes('°')) {
    // Minor chord: root, minor third, fifth
    notes.push(rootMidi + 3)
    notes.push(rootMidi + 7) // fifth
  } else if (chordName.includes('°')) {
    // Diminished chord: root, minor third, diminished fifth
    notes.push(rootMidi + 3) // minor third
    notes.push(rootMidi + 6) // diminished fifth
  } else {
    // Major chord: root, major third, fifth
    notes.push(rootMidi + 4) // major third
    notes.push(rootMidi + 7) // fifth
  }

  return notes
}

export const downloadMidiSequence = (sequence, selectedKey, keyType) => {
  // Create a new MIDI object
  const midi = new Midi()

  // Add a track
  const track = midi.addTrack()

  // Set tempo for proper timing
  midi.header.setTempo(120) // 120 BPM

  // Add chords to the track
  let time = 0
  const barsPerChord = 1 // Each chord spans exactly 1 bar
  const beatsPerBar = 4 // 4/4 time signature
  const secondsPerBeat = 60 / 120 // 0.5 seconds per beat at 120 BPM
  const chordDuration = barsPerChord * beatsPerBar * secondsPerBeat // 2 seconds per bar

  sequence.forEach((chord, index) => {
    if (chord && chord.chord) {
      const midiNotes = chordToMidiNotes(chord.chord)

      // Add each note of the chord
      midiNotes.forEach(noteNumber => {
        track.addNote({
          midi: noteNumber,
          time: time,
          duration: chordDuration, // Full bar duration
        })
      })
    }
    time += chordDuration
  })

  // Create and download the file
  const array = midi.toArray()
  const blob = new Blob([array], { type: 'audio/midi' })
  const url = URL.createObjectURL(blob)

  // Extract chord names from sequence for filename
  const chordNames = sequence
    .filter(chord => chord && chord.chord)
    .map(chord => chord.chord)
    .join(',')

  const a = document.createElement('a')
  a.href = url
  a.download = `${chordNames}-${selectedKey}-${modes[
    keyType
  ].name.toLowerCase()}.mid`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
