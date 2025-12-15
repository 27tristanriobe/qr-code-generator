import './style.css'
import QRCode from 'qrcode'

// ambil element utama
const app = document.querySelector('#app')

app.innerHTML = `
  <main class="page">
    <header class="hero">
      <h1>QR Code Generator</h1>
      <p>Buat QR code dari teks/URL, lalu download PNG.</p>
    </header>

    <section class="card">
      <label class="label" for="input">Masukkan teks atau URL</label>
      <textarea id="input" class="textarea" rows="3" placeholder="Contoh: https://github.com atau teks bebas..."></textarea>
      <div class="row">
        <div class="hint" id="hint">Ctrl/⌘ + Enter untuk generate</div>
        <div class="count" id="count">0</div>
      </div>

      <div class="actions">
        <button class="btn primary" id="btn-generate" type="button">Generate</button>
        <button class="btn" id="btn-download" type="button" disabled>Download PNG</button>
        <button class="btn ghost" id="btn-clear" type="button">Reset</button>
    </div>

      <div class="error" id="error" hidden></div>
    </section>

    <section class="result" id="result" hidden>
      <div class="qr-wrap">
        <canvas id="qr"></canvas>
  </div>
    </section>

    <footer class="footer">
      <span>Dibuat pakai vanilla JS + Vite</span>
    </footer>
  </main>
`

// ambil semua element yang dibutuhkan
const elInput = /** @type {HTMLTextAreaElement} */ (document.querySelector('#input'))
const elCount = document.querySelector('#count')
const elHint = document.querySelector('#hint')
const elError = document.querySelector('#error')
const elResult = document.querySelector('#result')
const elCanvas = /** @type {HTMLCanvasElement} */ (document.querySelector('#qr'))
const btnGenerate = document.querySelector('#btn-generate')
const btnDownload = document.querySelector('#btn-download')
const btnClear = document.querySelector('#btn-clear')

// fungsi untuk nampilin error message
function setError(message) {
  if (!message) {
    elError.hidden = true
    elError.textContent = ''
    return
  }
  elError.hidden = false
  elError.textContent = message
}

// toggle loading state di button
function setLoading(isLoading) {
  btnGenerate.disabled = isLoading
  btnGenerate.textContent = isLoading ? 'Generating...' : 'Generate'
}

// bersihin nama file biar aman untuk download
function sanitizeFilename(text) {
  const base = (text || 'qrcode')
    .trim()
    .slice(0, 24)
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
  return `${base || 'qrcode'}-${Date.now()}.png`
}

// fungsi utama untuk generate QR code
async function renderQR() {
  const value = elInput.value.trim()
  if (!value) {
    setError('Isi dulu teks/URL-nya.')
    return
  }
  if (value.length > 1200) {
    setError('Kepanjangan. Coba ringkas (maks 1200 karakter).')
    return
  }

  setError('')
  setLoading(true)
  btnDownload.disabled = true

  try {
    // generate QR code ke canvas
    await QRCode.toCanvas(elCanvas, value, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#0f172a', light: '#ffffff' },
    })
    elResult.hidden = false
    btnDownload.disabled = false
  } catch (e) {
    setError('Gagal generate QR. Coba lagi.')
    console.error(e)
  } finally {
    setLoading(false)
  }
}

// download QR code sebagai PNG
function downloadPNG() {
  try {
    const value = elInput.value.trim()
    const name = sanitizeFilename(value)
    // convert canvas jadi data URL
    const url = elCanvas.toDataURL('image/png')
    // buat link temporary untuk trigger download
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } catch (e) {
    setError('Gagal download. Coba generate ulang.')
    console.error(e)
  }
}

// reset semua ke kondisi awal
function resetAll() {
  elInput.value = ''
  elCount.textContent = '0'
  setError('')
  elResult.hidden = true
  btnDownload.disabled = true
  elInput.focus()
}

// update counter saat user ketik
elInput.addEventListener('input', () => {
  elCount.textContent = String(elInput.value.length)
  if (!elError.hidden) setError('')
})

// shortcut keyboard: Ctrl/Cmd + Enter untuk generate
elInput.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    renderQR()
  }
})

// event listeners untuk button
btnGenerate.addEventListener('click', renderQR)
btnDownload.addEventListener('click', downloadPNG)
btnClear.addEventListener('click', resetAll)

// kalau device mobile, ubah hint text biar lebih jelas
if (matchMedia('(pointer: coarse)').matches) {
  elHint.textContent = 'Tekan Generate untuk membuat QR'
}
