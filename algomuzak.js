
const ctx = new (window.AudioContext || window.webkitAudioContext)()


let tone = new OscillatorNode(ctx, {
  type: 'triangle'
})

const lvl = new GainNode(ctx, { gain: 0.001 })
const fft = new AnalyserNode(ctx, {fftSize: 2048})
const gain = new GainNode(ctx, {gain: .5})

tone.connect(lvl)
tone.connect(gain)
lvl.connect(fft)
fft.connect(ctx.destination)


function adsr (param, peak, val, time, a, d, s, r) {

  const initVal = param.value
  param.setValueAtTime(initVal, time)
  param.linearRampToValueAtTime(peak, time+a)
  param.linearRampToValueAtTime(val, time+a+d)
  param.linearRampToValueAtTime(val, time+a+d+s)
  param.linearRampToValueAtTime(initVal, time+a+d+s+r)
}



const p = 0.8
const v = 0.7

const keys = [
  261.62, // C4, 0
  293.66,// D4, 1
  329.63, // E4, 2
  349.23, // F4, 3
  392.00, //G4, 4
  440.00, // A4, 5
  493.88, // B4, 6
  523.25, // C5, 7ß
  587.33, // D5, 8
  659.25 // E5, 9
]

tone.frequency.setValueAtTime(keys[0], ctx.currentTime)
adsr(lvl.gain, p,v, ctx.currentTime, 0.3,0.0,2, 5)

tone.frequency.setValueAtTime(keys[2], ctx.currentTime + .5)
adsr(lvl.gain, p,v, ctx.currentTime + .5, 0.3,0.0,2, 5)

tone.frequency.setValueAtTime(keys[6], ctx.currentTime + 1)
adsr(lvl.gain, p,v, ctx.currentTime + 1, 0.3,0.0,2, 5)

tone.frequency.setValueAtTime(keys[1], ctx.currentTime + 2)
adsr(lvl.gain, p,v, ctx.currentTime + 2, 0.3,0.0,2, 5)

tone.frequency.setValueAtTime(keys[3], ctx.currentTime + 2.5)
adsr(lvl.gain, p,v, ctx.currentTime + 2.5, 0.3,0.0,1.0, 5)

tone.frequency.setValueAtTime(keys[7], ctx.currentTime + 3)
adsr(lvl.gain, p,v, ctx.currentTime + 3, 0.3,0.0,1.0, 1.5)

tone.frequency.setValueAtTime(keys[2], ctx.currentTime + 4)
adsr(lvl.gain, p,v, ctx.currentTime + 4, 0.3,0.1,1.0, 1.5)

tone.frequency.setValueAtTime(keys[4], ctx.currentTime + 4.5)
adsr(lvl.gain, p,v, ctx.currentTime + 4.5, 0.3,0.1,1.0, 1.5)

tone.frequency.setValueAtTime(keys[8], ctx.currentTime + 5)
adsr(lvl.gain, p,v, ctx.currentTime + 5, 0.3,0.1,2.0, 1.5)

tone.frequency.setValueAtTime(keys[3], ctx.currentTime + 6)
adsr(lvl.gain, p,v, ctx.currentTime + 6, 0.3,0.1,2.0, 1.5)

tone.frequency.setValueAtTime(keys[5], ctx.currentTime + 6.5)
adsr(lvl.gain, p,v, ctx.currentTime + 6.5, 0.3,0.1,2.0, 1.5)

tone.frequency.setValueAtTime(keys[9], ctx.currentTime + 7)
adsr(lvl.gain, p,v, ctx.currentTime + 7, 0.3,2,2.0, 1.5)

const pinkBuffer = ctx.createBuffer(2, ctx.sampleRate*2.5, ctx.sampleRate)
for (let ch=0; ch<pinkBuffer.numberOfChannels; ch++) {
    let b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0
    let samples = pinkBuffer.getChannelData(ch)
    for (let s = 0; s<pinkBuffer.length; s++) {
        white = Math.random() * 2 - 1
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.96900 * b2 + white * 0.1538520
        b3 = 0.86650 * b3 + white * 0.3104856
        b4 = 0.55000 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.0168980
        samples[s] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
        samples[s] *= 0.08 // (roughly) compensate for gain
        b6 = white * 0.115926
    }
}

let pink = new AudioBufferSourceNode(ctx, {buffer:pinkBuffer})
pink.connect(ctx.destination)
pink.connect(fft)
pink.start(ctx.currentTime + 7.5)

const brownBuffer = ctx.createBuffer(2, ctx.sampleRate*7.5, ctx.sampleRate)
for (let ch=0; ch<brownBuffer.numberOfChannels; ch++) {
    let samples = brownBuffer.getChannelData(ch)
    let lastOut = 0.0
    for (s = 0; s<brownBuffer.length; s++) {
        white = Math.random() * 2 - 1
        samples[s] = (lastOut + (0.02 * white)) / 1.02
        lastOut = samples[s]
        samples[s] *= 1.25 // (roughly) compensate for gain
    }
}

let brown = new AudioBufferSourceNode(ctx, {buffer:brownBuffer})
brown.connect(ctx.destination)
brown.connect(fft)
brown.start(ctx.currentTime + 10)



tone.frequency.setValueAtTime(keys[7], ctx.currentTime + 10)
adsr(lvl.gain, p,v, ctx.currentTime + 10, 0.3,0.1,2.0, 1.5)

tone.frequency.setValueAtTime(keys[6], ctx.currentTime + 10.5)
adsr(lvl.gain, p,v, ctx.currentTime + 10.5, 0.2,0.1,0.0,1.5)

tone.frequency.setValueAtTime(keys[4], ctx.currentTime + 11)
adsr(lvl.gain, p,v, ctx.currentTime + 11, 0.2,0.1,0.0,1.5)

tone.frequency.setValueAtTime(keys[2], ctx.currentTime + 11.5)
adsr(lvl.gain, p,v, ctx.currentTime + 11.5, 0.2,0.1,0.0,1.5)

tone.frequency.setValueAtTime(keys[7], ctx.currentTime + 12)
adsr(lvl.gain, p,v, ctx.currentTime + 9, 0.2,0.1,0,1.5)

tone.frequency.setValueAtTime(keys[6], ctx.currentTime + 12.5)
adsr(lvl.gain, p,v, ctx.currentTime + 12.5, 0.2,0.1,0.0,1.5)

tone.frequency.setValueAtTime(keys[4], ctx.currentTime + 13)
adsr(lvl.gain, p,v, ctx.currentTime + 13, 0.2,0.1,0.4,1.5)
tone.frequency.setValueAtTime(keys[2], ctx.currentTime + 13.5)
adsr(lvl.gain, p,v, ctx.currentTime + 13.5, 0.2,0.1,0.7,1.5)

tone.frequency.setValueAtTime(keys[7], ctx.currentTime + 14)
adsr(lvl.gain, p,v, ctx.currentTime + 14, 0.2,0.1,2.0,1.5)



tone.frequency.setValueAtTime(keys[6], ctx.currentTime + 14.5)
adsr(lvl.gain, p,v, ctx.currentTime + 14.5, 0.2,0.1,0.4,1.5)

tone.frequency.setValueAtTime(keys[4], ctx.currentTime + 15)
adsr(lvl.gain, p,v, ctx.currentTime + 15, 0.2,0.1,0.4,1.5)

tone.frequency.setValueAtTime(keys[2], ctx.currentTime + 15.5)
adsr(lvl.gain, p,v, ctx.currentTime + 15.5, 0.2,0.1,0.7,1.5)
tone.frequency.setValueAtTime(keys[7], ctx.currentTime + 16)
adsr(lvl.gain, p,v, ctx.currentTime + 16, 0.2,0.1,2.0,1.5)



tone.frequency.setValueAtTime(keys[6], ctx.currentTime + 16.5)
adsr(lvl.gain, p,v, ctx.currentTime + 16.5, 0.2,0.1,0.4,1.5)

tone.frequency.setValueAtTime(keys[4], ctx.currentTime + 17)
adsr(lvl.gain, p,v, ctx.currentTime + 17, 0.2,0.1,0.4,1.5)

tone.frequency.setValueAtTime(keys[2], ctx.currentTime + 17.5)
adsr(lvl.gain, p,v, ctx.currentTime + 17.5, 0.2,0.1,0.7,1.5)


tone.frequency.setValueAtTime(keys[3], ctx.currentTime + 18)
adsr(lvl.gain, p,v, ctx.currentTime + 18, 0.5,0.1,2.0,1.5)

tone.frequency.setValueAtTime(keys[2], ctx.currentTime + 18.5)
adsr(lvl.gain, p,v, ctx.currentTime + 18.5, 0.5,0.1,2.0,1.7)

tone.frequency.setValueAtTime(keys[3], ctx.currentTime + 19)
adsr(lvl.gain, p,v, ctx.currentTime + 19, 0.5,0.1,2.0,1.7)

tone.frequency.setValueAtTime(keys[0], ctx.currentTime + 19.5)
adsr(lvl.gain, p,v, ctx.currentTime + 19.5, 0.5,0.1,2.0,1.2)

tone.frequency.setValueAtTime(keys[3], ctx.currentTime + 20)
adsr(lvl.gain, p,v, ctx.currentTime + 20, 0.2,0.1,2.0,1.2)

tone.frequency.setValueAtTime(keys[2], ctx.currentTime + 20.5)
adsr(lvl.gain, p,v, ctx.currentTime + 20.5, 0.2,0.1,2.0,1.2)

tone.frequency.setValueAtTime(keys[3], ctx.currentTime + 21)
adsr(lvl.gain, p,v, ctx.currentTime + 21, 0.2,0.1,2.0,1.2)

tone.frequency.setValueAtTime(keys[2], ctx.currentTime + 21.25)
adsr(lvl.gain, p,v, ctx.currentTime + 21.25, 0.2,0.1,2.0,0.2)

tone.frequency.setValueAtTime(keys[0], ctx.currentTime + 21.5)
adsr(lvl.gain, p,v, ctx.currentTime + 21.5, 0.2,0.1,2.0,0.2)

tone.frequency.setValueAtTime(keys[3], ctx.currentTime + 22)
adsr(lvl.gain, p,v, ctx.currentTime + 22, 0.2,0.1,2.0,0.2)


tone.frequency.setValueAtTime(keys[2], ctx.currentTime + 22.5)
adsr(lvl.gain, p,v, ctx.currentTime + 22.5, 0.2,0.1,2.0,0.2)

tone.frequency.setValueAtTime(keys[3], ctx.currentTime + 23)
adsr(lvl.gain, p,v, ctx.currentTime + 23, 0.2,0.1,2.0,0.2)

tone.frequency.setValueAtTime(keys[0], ctx.currentTime + 23.5)
adsr(lvl.gain, p,v, ctx.currentTime + 23.5, 0.2,0.1,2.0,0.2)

tone.frequency.setValueAtTime(keys[3], ctx.currentTime + 24)
adsr(lvl.gain, p,v, ctx.currentTime + 24, 0.2,0.1,2.0,0.2)

tone.frequency.setValueAtTime(keys[2], ctx.currentTime + 24.5)
adsr(lvl.gain, p,v, ctx.currentTime + 24.5, 0.2,0.1,2.0,0.2)

tone.frequency.setValueAtTime(keys[3], ctx.currentTime + 25)
adsr(lvl.gain, p,v, ctx.currentTime + 25, 0.2,0.1,2.0,0.2)

tone.frequency.setValueAtTime(keys[2], ctx.currentTime + 25.25)
adsr(lvl.gain, p,v, ctx.currentTime + 25.25, 0.2,0.1,2.0,0.2)

tone.frequency.setValueAtTime(keys[0], ctx.currentTime + 25.5)
adsr(lvl.gain, p,v, ctx.currentTime + 25.5, 0.2,0.1,2.0,0.2)

const brownBuffer2 = ctx.createBuffer(2, ctx.sampleRate*7.5, ctx.sampleRate)
for (let ch=0; ch<brownBuffer2.numberOfChannels; ch++) {
    let samples = brownBuffer2.getChannelData(ch)
    let lastOut = 0.0
    for (s = 0; s<brownBuffer2.length; s++) {
        white = Math.random() * 2 - 1
        samples[s] = (lastOut + (0.02 * white)) / 1.02
        lastOut = samples[s]
        samples[s] *= 1.25 // (roughly) compensate for gain
    }
}

let brown2 = new AudioBufferSourceNode(ctx, {buffer:brownBuffer2})
brown2.connect(ctx.destination)
brown2.connect(fft)
brown2.start(ctx.currentTime + 26)

tone.frequency.setValueAtTime(keys[7], ctx.currentTime + 26)
adsr(lvl.gain, p,v, ctx.currentTime + 26, 0.2,0.1,2.0,0.2)



tone.frequency.setValueAtTime(keys[6], ctx.currentTime + 26.5)
adsr(lvl.gain, p,v, ctx.currentTime + 26.5, 0.2,0.1,0.4,0.2)

tone.frequency.setValueAtTime(keys[4], ctx.currentTime + 27)
adsr(lvl.gain, p,v, ctx.currentTime + 27, 0.2,0.1,0.4,0.2)

tone.frequency.setValueAtTime(keys[2], ctx.currentTime + 27.5)
adsr(lvl.gain, p,v, ctx.currentTime + 27.5, 0.2,0.1,0.7,0.2)

tone.frequency.setValueAtTime(keys[7], ctx.currentTime + 28)
adsr(lvl.gain, p,v, ctx.currentTime + 28, 0.2,0.1,2.0,0.2)



tone.frequency.setValueAtTime(keys[6], ctx.currentTime + 28.5)
adsr(lvl.gain, p,v, ctx.currentTime + 28.5, 0.2,0.1,0.4,0.2)

tone.frequency.setValueAtTime(keys[4], ctx.currentTime + 29)
adsr(lvl.gain, p,v, ctx.currentTime + 29, 0.2,0.1,0.4,0.2)

tone.frequency.setValueAtTime(keys[2], ctx.currentTime + 29.5)
adsr(lvl.gain, p,v, ctx.currentTime + 29.5, 0.2,0.1,0.7,0.2)
tone.frequency.setValueAtTime(keys[7], ctx.currentTime + 30)
adsr(lvl.gain, p,v, ctx.currentTime + 30, 0.2,0.1,2.0,0.2)



tone.frequency.setValueAtTime(keys[6], ctx.currentTime + 30.5)
adsr(lvl.gain, p,v, ctx.currentTime + 30.5, 0.2,0.1,0.4,0.5)

tone.frequency.setValueAtTime(keys[4], ctx.currentTime + 31)
adsr(lvl.gain, p,v, ctx.currentTime + 31, 0.2,0.1,0.4,0.5)

tone.frequency.setValueAtTime(keys[2], ctx.currentTime + 31.5)
adsr(lvl.gain, p,v, ctx.currentTime + 31.5, 0.2,0.1,0.7,0.5)
tone.frequency.setValueAtTime(keys[7], ctx.currentTime + 32)
adsr(lvl.gain, p,v, ctx.currentTime + 32, 0.2,0.1,2.0,0.5)



tone.frequency.setValueAtTime(keys[6], ctx.currentTime + 32.5)
adsr(lvl.gain, p,v, ctx.currentTime + 32.5, 0.2,0.1,2,0.5)

tone.frequency.setValueAtTime(keys[4], ctx.currentTime + 33)
adsr(lvl.gain, p,v, ctx.currentTime + 33, 0.2,0.1,2,0.5)

tone.frequency.setValueAtTime(keys[2], ctx.currentTime + 33.5)
adsr(lvl.gain, p,v, ctx.currentTime + 33.5, 0.2,0.1,2 ,0.5)



tone.frequency.setValueAtTime(keys[5], ctx.currentTime + 34)
adsr(lvl.gain, p,v, ctx.currentTime + 34, 0.2,0.1,0.4,0.2)

tone.frequency.setValueAtTime(keys[4], ctx.currentTime + 34.5)
adsr(lvl.gain, p,v, ctx.currentTime + 34.5, 0.2,0.1,0.4,0.2)

tone.frequency.setValueAtTime(keys[5], ctx.currentTime + 35)
adsr(lvl.gain, p,v, ctx.currentTime + 35, 0.2,0.1,0.7,0.2)

tone.frequency.setValueAtTime(keys[6], ctx.currentTime + 35.5)
adsr(lvl.gain, p,v, ctx.currentTime + 35.5, 0.2,0.1,2.0,0.2)

tone.frequency.setValueAtTime(keys[7], ctx.currentTime + 36)
adsr(lvl.gain, p,v, ctx.currentTime + 36, 0.2,0.1,0.4,0.5)

tone.frequency.setValueAtTime(keys[6], ctx.currentTime + 36.5)
adsr(lvl.gain, p,v, ctx.currentTime + 36.5, 0.2,0.1,0.4,0.5)

tone.frequency.setValueAtTime(keys[7], ctx.currentTime + 37)
adsr(lvl.gain, p,v, ctx.currentTime + 37, 0.2,0.1,0.7,0.5)

tone.frequency.setValueAtTime(keys[8], ctx.currentTime + 37.5)
adsr(lvl.gain, p,v, ctx.currentTime + 37.5, 0.2,0.1,2.0,0.5)

tone.frequency.setValueAtTime(keys[9], ctx.currentTime + 38)
adsr(lvl.gain, p,v, ctx.currentTime + 38, 0.2,0.1,2,0.5)

tone.frequency.setValueAtTime(keys[7], ctx.currentTime + 39.5)
adsr(lvl.gain, p,v, ctx.currentTime + 39.5, 0.2,0.1,4,0.5)


tone.start(ctx.currentTime)
tone.stop(ctx.currentTime + 40)

const color = [
  "#ffb3ba",
  "#ffdfba",
  "#ffffba",
  "#baffc9",
  "#bae1ff"
]

const canvas = document.createElement('canvas')
canvas.width = document.querySelector('section').offsetWidth
document.querySelector('section').appendChild(canvas)
const canvasCtx = canvas.getContext('2d')
canvasCtx.fillStyle = '#23241f'
canvasCtx.strokeStyle = color[Math.floor(Math.random()*color.length)]

let bufferLength = fft.frequencyBinCount
let dataArray = new Uint8Array(bufferLength)

function animate(){
  setTimeout(animate, 1000 / 12) // 12fps
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height)
  // get data...
  fft.getByteTimeDomainData(dataArray)
  // draw data...
  canvasCtx.beginPath()
  let column = canvas.width / bufferLength
  let x = 0
  for (let i = 0; i < bufferLength; i++) {
    let y = (dataArray[i] / 128) * (canvas.height / 2)
    if (i === 0) canvasCtx.moveTo(x, y)
    else canvasCtx.lineTo(x, y)
    x += column
  }
  canvasCtx.lineTo(canvas.width, canvas.height / 2)
  canvasCtx.stroke()
}

animate()
