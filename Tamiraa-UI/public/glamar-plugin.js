/**
 * GlamAR Virtual Try-On Plugin
 * Fixed version - no buttons inside panel
 */

(function() {
  'use strict';

  const GLAMAR_API_URL = 'https://glamarvirtualtryon.onrender.com';

  let config = {
    siteToken: null,
    apiUrl: GLAMAR_API_URL,
    autoDetect: true,
  };

  let panelOpen = false;
  let detectedProducts = [];
  let selectedGarmentUrl = null;
  let selectedProductUrl = null;
  let selectedProductName = null;
  let selectedFile = null;
  let results = [];

  function init(options = {}) {
    const scriptTag = document.querySelector('script[data-glamar-token]');
    if (scriptTag) {
      config.siteToken = scriptTag.getAttribute('data-glamar-token');
      const customApiUrl = scriptTag.getAttribute('data-glamar-api');
      if (customApiUrl) config.apiUrl = customApiUrl;
    }

    Object.assign(config, options);

    if (!config.siteToken) {
      console.error('[GlamAR] No site token provided.');
      return;
    }

    console.log('[GlamAR] Initializing plugin with API:', config.apiUrl);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setup);
    } else {
      setup();
    }
  }

  function setup() {
    injectStyles();

    if (config.autoDetect) {
      if (document.readyState === 'complete') {
        detectAndAddButtons();
      } else {
        window.addEventListener('load', detectAndAddButtons);
      }
      observeDOM();
    }
    console.log('[GlamAR] Plugin initialized');
  }

  function observeDOM() {
    const observer = new MutationObserver((mutations) => {
      let shouldRedetect = false;
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && (node.tagName === 'IMG' || node.querySelector?.('img'))) {
              // Don't redetect if the node is inside the GlamAR panel
              if (!node.closest('.glamar-panel-container')) {
                shouldRedetect = true;
              }
            }
          });
        }
      });
      if (shouldRedetect) setTimeout(detectAndAddButtons, 500);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function detectAndAddButtons() {
    detectProductImages();
    addOverlayButtons();
    addFloatingButton();
    console.log('[GlamAR] Detected', detectedProducts.length, 'product images');
  }

  function detectProductImages() {
    detectedProducts = [];
    const processedImages = new Set();

    const selectors = [
      '.product-single__media img', '.product__media img', '[data-product-single-media-wrapper] img',
      '.product-featured-media img', '.product-gallery img', '.woocommerce-product-gallery img',
      '.woocommerce-product-gallery__image img', '.wp-post-image', '.product-image img',
      '.product-main-image img', '.product-detail img', '[class*="product-image"] img',
      '[class*="ProductImage"] img', '[data-product-image]', 'main .product img',
    ];

    selectors.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(img => {
          // Skip images inside the GlamAR panel
          if (img.closest('.glamar-panel-container')) return;
          
          if (img.src && !processedImages.has(img.src) && isValidProductImage(img)) {
            processedImages.add(img.src);
            detectedProducts.push({
              imageUrl: img.src,
              imageElement: img,
              productUrl: window.location.href,
              productName: getProductName(),
            });
          }
        });
      } catch (e) {}
    });

    if (detectedProducts.length === 0) {
      const mainContent = document.querySelector('main') || document.body;
      Array.from(mainContent.querySelectorAll('img'))
        .filter(img => isValidProductImage(img) && !img.closest('.glamar-panel-container'))
        .sort((a, b) => (b.naturalWidth * b.naturalHeight) - (a.naturalWidth * a.naturalHeight))
        .slice(0, 3)
        .forEach(img => {
          if (!processedImages.has(img.src)) {
            processedImages.add(img.src);
            detectedProducts.push({
              imageUrl: img.src,
              imageElement: img,
              productUrl: window.location.href,
              productName: getProductName(),
            });
          }
        });
    }
  }

  function isValidProductImage(img) {
    if (!img.complete || !img.naturalWidth) return false;
    if (img.naturalWidth < 200 || img.naturalHeight < 200) return false;
    const src = img.src.toLowerCase();
    if (src.includes('logo') || src.includes('icon') || src.includes('banner') ||
        src.includes('payment') || src.includes('social')) return false;
    const rect = img.getBoundingClientRect();
    if (rect.width < 150 || rect.height < 150) return false;
    return true;
  }

  function getProductName() {
    const selectors = ['h1.product-title', 'h1.product-name', '.product-single__title', '.product_title', 'h1'];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el?.textContent?.trim()) return el.textContent.trim();
    }
    return document.title;
  }

  function addOverlayButtons() {
    detectedProducts.forEach((product) => {
      const img = product.imageElement;
      if (!img || img.dataset.glamarButton) return;
      
      // Skip images inside the GlamAR panel
      if (img.closest('.glamar-panel-container')) return;
      
      img.dataset.glamarButton = 'true';

      let container = img.parentElement;
      const style = window.getComputedStyle(container);
      if (style.position === 'static') container.style.position = 'relative';

      const btn = document.createElement('button');
      btn.className = 'glamar-overlay-btn';
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg><span>Try On</span>`;
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openPanel(product.imageUrl, product.productUrl, product.productName);
      };
      container.appendChild(btn);
    });
  }

  function addFloatingButton() {
    const existing = document.querySelector('.glamar-floating-btn');
    if (existing) existing.remove();
    if (detectedProducts.length === 0) return;

    const btn = document.createElement('button');
    btn.className = 'glamar-floating-btn';
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg><span>Try On with GlamAR</span>`;
    btn.onclick = () => {
      const p = detectedProducts[0];
      openPanel(p?.imageUrl, p?.productUrl, p?.productName);
    };
    document.body.appendChild(btn);
  }

  function openPanel(garmentUrl, productUrl, productName) {
    if (panelOpen) return;
    panelOpen = true;
    selectedGarmentUrl = garmentUrl;
    selectedProductUrl = productUrl || window.location.href;
    selectedProductName = productName || 'Product';
    selectedFile = null;

    const panel = createPanel();
    document.body.appendChild(panel);
    document.body.style.overflow = 'hidden';
    setTimeout(() => panel.classList.add('glamar-panel-open'), 10);
  }

  function closePanel() {
    const panel = document.querySelector('.glamar-panel-container');
    if (panel) {
      panel.classList.remove('glamar-panel-open');
      setTimeout(() => panel.remove(), 300);
    }
    document.body.style.overflow = '';
    panelOpen = false;
    selectedFile = null;
  }

  function createPanel() {
    const container = document.createElement('div');
    container.className = 'glamar-panel-container';
    container.innerHTML = `
      <div class="glamar-panel-overlay" onclick="window.GlamAR.closePanel()"></div>
      <div class="glamar-panel">
        <div class="glamar-panel-header">
          <h2>Virtual Try-On</h2>
          <button class="glamar-close-btn" onclick="window.GlamAR.closePanel()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="glamar-panel-body">
          <!-- Selected Product -->
          <div class="glamar-selected-product">
            <img src="${selectedGarmentUrl}" alt="Product">
            <div class="glamar-product-info">
              <h3>${selectedProductName}</h3>
              <span>Selected Item</span>
            </div>
          </div>

          <!-- Your Photo Section -->
          <div class="glamar-section">
            <div class="glamar-section-header" onclick="window.GlamAR.toggleSection('upload')">
              <span>Your Photo</span>
              <svg class="glamar-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            <div class="glamar-section-content" id="glamar-upload-section">
              <div class="glamar-upload-area" id="glamar-upload-area">
                <input type="file" id="glamar-file-input" accept="image/*" onchange="window.GlamAR.handleFileSelect(event)" style="display:none">
                <label for="glamar-file-input" class="glamar-upload-label" id="glamar-upload-label">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <div class="glamar-upload-text">
                    <p>Click to upload or drag & drop</p>
                    <span>Full-body photo works best</span>
                  </div>
                </label>
                <div id="glamar-preview" class="glamar-preview"></div>
              </div>
            </div>
          </div>

          <!-- Tryon Button Section -->
          <div class="glamar-tryon-action">
            <button id="glamar-try-btn" class="glamar-try-btn" onclick="window.GlamAR.processTryOn()" disabled>
              <span id="glamar-try-btn-text">Try Another</span>
            </button>
          </div>

          <!-- Result Section -->
          <div class="glamar-section">
            <div class="glamar-section-header" onclick="window.GlamAR.toggleSection('result')">
              <span>Current Result</span>
              <svg class="glamar-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            <div class="glamar-section-content glamar-collapsed" id="glamar-result-section">
              <div id="glamar-result" class="glamar-result">
                <p>No result yet. Upload a photo and try on the item.</p>
              </div>
            </div>
          </div>

          <!-- History Section -->
          <div class="glamar-section">
            <div class="glamar-section-header" onclick="window.GlamAR.toggleSection('history')">
              <span>History (<span id="glamar-history-count">${results.length}</span>)</span>
              <svg class="glamar-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            <div class="glamar-section-content glamar-collapsed" id="glamar-history-section">
              <div id="glamar-history" class="glamar-history">
                ${results.length === 0 ? '<p class="glamar-no-history">No try-on history yet.</p>' : ''}
              </div>
            </div>
          </div>
        </div>

        <div class="glamar-panel-footer">
          <span>Powered by GlamAR</span>
          <a href="https://glamar.ai" target="_blank">GlamAR</a>
        </div>
      </div>
    `;

    setupDragDrop(container);
    return container;
  }

  function toggleSection(section) {
    const sectionEl = document.getElementById(`glamar-${section}-section`);
    if (sectionEl) {
      sectionEl.classList.toggle('glamar-collapsed');
    }
  }

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById('glamar-preview');
      const label = document.getElementById('glamar-upload-label');
      const uploadArea = document.getElementById('glamar-upload-area');
      const tryBtn = document.getElementById('glamar-try-btn');

      preview.innerHTML = `
        <img src="${e.target.result}" alt="Your photo">
        <button class="glamar-preview-cancel-btn" onclick="window.GlamAR.removePhoto()" title="Remove and upload different photo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      `;
      preview.style.display = 'block';
      if (label) label.style.display = 'none';
      if (uploadArea) uploadArea.classList.add('glamar-photo-uploaded');

      // Enable the Try Another button after upload
      if (tryBtn) {
        tryBtn.disabled = false;
        document.getElementById('glamar-try-btn-text').textContent = 'Try Another';
      }

      // Auto-process try-on
      processTryOn();
    };
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    selectedFile = null;
    const preview = document.getElementById('glamar-preview');
    const label = document.getElementById('glamar-upload-label');
    const fileInput = document.getElementById('glamar-file-input');
    const uploadArea = document.getElementById('glamar-upload-area');
    const tryBtn = document.getElementById('glamar-try-btn');

    if (preview) { preview.style.display = 'none'; preview.innerHTML = ''; }
    if (label) label.style.display = 'flex';
    if (fileInput) fileInput.value = '';
    if (uploadArea) uploadArea.classList.remove('glamar-photo-uploaded');
    if (tryBtn) tryBtn.disabled = true;
  }

  function updateTryButton() {
    const btn = document.getElementById('glamar-try-btn');
    if (btn) btn.disabled = !selectedFile;
  }

  async function processTryOn() {
    const btn = document.getElementById('glamar-try-btn');
    const btnText = document.getElementById('glamar-try-btn-text');
    const resultEl = document.getElementById('glamar-result');
    const resultSection = document.getElementById('glamar-result-section');

    if (!selectedFile || !selectedGarmentUrl) return;

    // Show loading
    if (btn) btn.disabled = true;
    if (btnText) btnText.textContent = 'Processing...';
    if (resultSection) resultSection.classList.remove('glamar-collapsed');
    if (resultEl) resultEl.innerHTML = '<div class="glamar-loading"><div class="glamar-spinner"></div><p>Creating your virtual try-on...</p></div>';

    try {
      const formData = new FormData();
      formData.append('personImage', selectedFile);
      formData.append('garmentUrl', selectedGarmentUrl);
      formData.append('productUrl', selectedProductUrl);
      formData.append('productName', selectedProductName);
      formData.append('siteToken', config.siteToken);

      const response = await fetch(`${config.apiUrl}/api/tryon`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.resultUrl) {
        results.unshift({
          resultUrl: data.resultUrl,
          garmentUrl: selectedGarmentUrl,
          productName: selectedProductName,
          timestamp: new Date().toISOString(),
        });

        resultEl.innerHTML = `
          <div class="glamar-result-image">
            <img src="${data.resultUrl}" alt="Try-on result">
            <div class="glamar-result-actions">
              <a href="${data.resultUrl}" download="glamar-tryon.png" class="glamar-download-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download
              </a>
            </div>
          </div>
        `;

        updateHistory();
      } else {
        resultEl.innerHTML = `<p class="glamar-error">${data.error || 'Failed to process try-on. Please try again.'}</p>`;
      }
    } catch (error) {
      console.error('[GlamAR] Try-on error:', error);
      resultEl.innerHTML = '<p class="glamar-error">Network error. Please check your connection and try again.</p>';
    }

    if (btn) btn.disabled = false;
    if (btnText) btnText.textContent = 'Try Another';
  }

  function updateHistory() {
    const historyEl = document.getElementById('glamar-history');
    const countEl = document.getElementById('glamar-history-count');

    if (countEl) countEl.textContent = results.length;

    if (historyEl && results.length > 0) {
      historyEl.innerHTML = results.map((r, i) => `
        <div class="glamar-history-item">
          <img src="${r.resultUrl}" alt="Result ${i + 1}">
          <span>${r.productName}</span>
        </div>
      `).join('');
    }
  }

  function setupDragDrop(container) {
    const uploadArea = container.querySelector('.glamar-upload-area');
    if (!uploadArea) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      uploadArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      uploadArea.addEventListener(eventName, () => uploadArea.classList.add('glamar-drag-over'));
    });

    ['dragleave', 'drop'].forEach(eventName => {
      uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('glamar-drag-over'));
    });

    uploadArea.addEventListener('drop', (e) => {
      const file = e.dataTransfer?.files[0];
      if (file && file.type.startsWith('image/')) {
        const input = document.getElementById('glamar-file-input');
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        handleFileSelect({ target: input });
      }
    });
  }

  function injectStyles() {
    if (document.getElementById('glamar-styles')) return;

    const style = document.createElement('style');
    style.id = 'glamar-styles';
    style.textContent = `
      .glamar-overlay-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        background: white;
        border: none;
        border-radius: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.15);
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        color: #333;
        z-index: 100;
        transition: all 0.2s;
      }
      .glamar-overlay-btn:hover {
        background: #f5f5f5;
        transform: scale(1.05);
      }

      .glamar-floating-btn {
        position: fixed;
        bottom: 24px;
        right: 24px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: linear-gradient(135deg, #C9A66B 0%, #9A7B4F 100%);
        border: none;
        border-radius: 30px;
        box-shadow: 0 4px 20px rgba(201,166,107,0.4);
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        color: white;
        z-index: 9999;
        transition: all 0.3s;
      }
      .glamar-floating-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 25px rgba(201,166,107,0.5);
      }

      .glamar-panel-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s;
      }
      .glamar-panel-container.glamar-panel-open {
        opacity: 1;
        visibility: visible;
      }

      .glamar-panel-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
      }

      .glamar-panel {
        position: absolute;
        top: 0;
        right: -400px;
        width: 380px;
        max-width: 100%;
        height: 100%;
        background: white;
        display: flex;
        flex-direction: column;
        transition: right 0.3s;
        box-shadow: -5px 0 30px rgba(0,0,0,0.2);
      }
      .glamar-panel-open .glamar-panel {
        right: 0;
      }

      .glamar-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #eee;
      }
      .glamar-panel-header h2 {
        font-size: 18px;
        font-weight: 600;
        margin: 0;
        color: #333;
      }

      .glamar-close-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        color: #666;
        border-radius: 50%;
        transition: background 0.2s;
      }
      .glamar-close-btn:hover {
        background: #f0f0f0;
      }

      .glamar-panel-body {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
      }

      .glamar-selected-product {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: #faf8f5;
        border-radius: 12px;
        margin-bottom: 16px;
        border: 1px solid #e8e4dc;
      }
      .glamar-selected-product img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 8px;
      }
      .glamar-product-info h3 {
        font-size: 14px;
        font-weight: 600;
        margin: 0 0 4px;
        color: #333;
      }
      .glamar-product-info span {
        font-size: 12px;
        color: #888;
      }

      .glamar-section {
        margin-bottom: 12px;
        border: 1px solid #eee;
        border-radius: 12px;
        overflow: hidden;
      }

      .glamar-section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 16px;
        background: #fafafa;
        cursor: pointer;
        font-weight: 500;
        color: #333;
      }
      .glamar-section-header:hover {
        background: #f5f5f5;
      }

      .glamar-chevron {
        transition: transform 0.2s;
      }
      .glamar-collapsed .glamar-chevron {
        transform: rotate(-90deg);
      }

      .glamar-section-content {
        padding: 16px;
        max-height: 500px;
        transition: all 0.3s;
      }
      .glamar-section-content.glamar-collapsed {
        max-height: 0;
        padding: 0 16px;
        overflow: hidden;
      }

      .glamar-upload-area {
        border: 2px dashed #ddd;
        border-radius: 12px;
        transition: all 0.2s;
        min-height: 150px;
        position: relative;
      }
      .glamar-upload-area.glamar-drag-over {
        border-color: #C9A66B;
        background: #faf8f5;
      }
      .glamar-upload-area.glamar-photo-uploaded {
        border-style: solid;
        border-color: #C9A66B;
      }

      .glamar-upload-label {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 30px;
        cursor: pointer;
        color: #888;
        min-height: 150px;
      }
      .glamar-upload-label:hover {
        color: #666;
      }
      .glamar-upload-text {
        text-align: center;
        margin-top: 12px;
      }
      .glamar-upload-text p {
        margin: 0;
        font-size: 14px;
        color: #555;
      }
      .glamar-upload-text span {
        font-size: 12px;
        color: #999;
      }

      .glamar-preview {
        display: none;
        position: relative;
      }
      .glamar-preview img {
        width: 100%;
        max-height: 300px;
        object-fit: contain;
        border-radius: 8px;
      }
      .glamar-preview-cancel-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 32px;
        height: 32px;
        background: rgba(255,255,255,0.95);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        color: #666;
        transition: all 0.2s;
      }
      .glamar-preview-cancel-btn:hover {
        background: white;
        color: #e74c3c;
        transform: scale(1.1);
      }

      .glamar-tryon-action {
        margin-bottom: 12px;
      }

      .glamar-try-btn {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #C9A66B 0%, #9A7B4F 100%);
        border: none;
        border-radius: 10px;
        color: white;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .glamar-try-btn:disabled {
        background: #ccc;
        cursor: not-allowed;
      }
      .glamar-try-btn:not(:disabled):hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(201,166,107,0.4);
      }

      .glamar-result {
        text-align: center;
        color: #888;
      }
      .glamar-result-image img {
        width: 100%;
        border-radius: 8px;
        margin-bottom: 12px;
      }
      .glamar-result-actions {
        display: flex;
        justify-content: center;
      }
      .glamar-download-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 10px 20px;
        background: #333;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        transition: background 0.2s;
      }
      .glamar-download-btn:hover {
        background: #444;
      }

      .glamar-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px 20px;
      }
      .glamar-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #eee;
        border-top-color: #C9A66B;
        border-radius: 50%;
        animation: glamar-spin 1s linear infinite;
      }
      @keyframes glamar-spin {
        to { transform: rotate(360deg); }
      }
      .glamar-loading p {
        margin-top: 16px;
        color: #666;
        font-size: 14px;
      }

      .glamar-error {
        color: #e74c3c;
        font-size: 14px;
      }

      .glamar-history {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }
      .glamar-history-item {
        text-align: center;
      }
      .glamar-history-item img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 8px;
        cursor: pointer;
      }
      .glamar-history-item span {
        font-size: 10px;
        color: #888;
        display: block;
        margin-top: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .glamar-no-history {
        color: #888;
        font-size: 13px;
        text-align: center;
      }

      .glamar-panel-footer {
        padding: 12px 20px;
        border-top: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #888;
      }
      .glamar-panel-footer a {
        color: #C9A66B;
        text-decoration: none;
        font-weight: 500;
      }

      @media (max-width: 480px) {
        .glamar-panel {
          width: 100%;
          right: -100%;
        }
        .glamar-floating-btn span {
          display: none;
        }
        .glamar-floating-btn {
          padding: 14px;
          border-radius: 50%;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Expose API
  window.GlamAR = {
    init,
    openPanel,
    closePanel,
    toggleSection,
    handleFileSelect,
    removePhoto,
    processTryOn,
  };

  // Auto-initialize
  init();
})();
