import { Midi } from '@tonejs/midi'
import { modes } from './musicData.js'
export const chordToMidiNotes = chordName => {
  const root = chordName.replace(/[m°#b]/g, '')
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
    notes.push(rootMidi + 3)
    notes.push(rootMidi + 7) 
  } else if (chordName.includes('°')) {
    notes.push(rootMidi + 3) 
    notes.push(rootMidi + 6) 
  } else {
    notes.push(rootMidi + 4) 
    notes.push(rootMidi + 7) 
  }
  return notes
}
export const downloadMidiSequence = (sequence, selectedKey, keyType) => {
  const midi = new Midi()
  const track = midi.addTrack()
  midi.header.setTempo(120) 
  let time = 0
  const barsPerChord = 1 
  const beatsPerBar = 4 
  const secondsPerBeat = 60 / 120 
  const chordDuration = barsPerChord * beatsPerBar * secondsPerBeat 
  sequence.forEach((chord, index) => {
    if (chord && chord.chord) {
      const midiNotes = chordToMidiNotes(chord.chord)
      midiNotes.forEach(noteNumber => {
        track.addNote({
          midi: noteNumber,
          time: time,
          duration: chordDuration, 
        })
      })
    }
    time += chordDuration
  })
  const array = midi.toArray()
  const blob = new Blob([array], { type: 'audio/midi' })
  const url = URL.createObjectURL(blob)
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
