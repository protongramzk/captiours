/**
 * Captiours - Client-side bulk Instagram carousel generator
 * Modular JS File (js/app.js)
 */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Element References
    const formsContainer = document.getElementById("formsContainer");
    const previewContainer = document.getElementById("previewContainer");
    const sidebarPreviewContainer = document.getElementById("sidebarPreviewContainer");
    const addPageBtn = document.getElementById("addPageBtn");
    const downloadAllBtn = document.getElementById("downloadAllBtn");

    // Modal References
    const settingsModal = document.getElementById("settingsModal");
    const previewModal = document.getElementById("previewModal");
    const openSettingsBtn = document.getElementById("openSettingsModal");
    const closeSettingsBtn = document.getElementById("closeSettingsModal");
    const openPreviewBtn = document.getElementById("openPreviewModal");
    const closePreviewBtn = document.getElementById("closePreviewModal");

    // Form inputs and controls
    const creatorNameInput = document.getElementById("creatorNameInput");
    const themeSelect = document.getElementById("themeSelect");
    const canvasFontSelect = document.getElementById("canvasFontSelect");
    const coverHeight = document.getElementById("coverHeight");
    const heightValue = document.getElementById("heightValue");
    const fontScale = document.getElementById("fontScale");
    const fontScaleValue = document.getElementById("fontScaleValue");
    const appThemeToggle = document.getElementById("appThemeToggle");

    // Application state
    let pageCount = 0;
    const defaultImg = "data:image/svg+xml;charset=UTF-8,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='200' fill='%23eaddff'/%3E%3Ctext x='50%25' y='50%25' font-family='Inter' font-size='14' fill='%236750a4' dominant-baseline='middle' text-anchor='middle'%3EMuat Gambar%3C/text%3E%3C/svg%3E";

    // Themes for Canvas preview
    const canvasThemes = {
        light: { bg: '#FFFFFF', text: '#1D1B20', primary: '#6750A4' },
        dark: { bg: '#1D1B20', text: '#E6E1E5', primary: '#D0BCFF' },
        ocean: { bg: '#F2F8FF', text: '#001D35', primary: '#0061A4' },
        forest: { bg: '#F2FFF5', text: '#003D16', primary: '#1B5E20' },
        sunset: { bg: '#FFF5F2', text: '#4A1100', primary: '#E64A19' },
        coffee: { bg: '#FDF8F5', text: '#3E2723', primary: '#5D4037' },
        cyberpunk: { bg: '#0D0221', text: '#00FF41', primary: '#FF003C' }
    };

    /**
     * INITIALIZATION & CONFIGURATION
     */

    // Load App UI Theme (Dark Mode) from localStorage
    const savedAppTheme = localStorage.getItem("appTheme") || "light";
    document.documentElement.setAttribute("data-theme", savedAppTheme);
    if (appThemeToggle) {
        appThemeToggle.checked = savedAppTheme === "dark";
    }

    // Load creator name from localStorage or set default
    const savedName = localStorage.getItem("creatorName") || "@captiours";
    if (creatorNameInput) {
        creatorNameInput.value = savedName;
        document.documentElement.style.setProperty('--creator-name', `"${savedName}"`);
    }

    // Load Canvas Font from localStorage or set default
    const savedCanvasFont = localStorage.getItem("canvasFont") || "Inter";
    if (canvasFontSelect) {
        canvasFontSelect.value = savedCanvasFont;
        document.documentElement.style.setProperty('--canvas-font', `'${savedCanvasFont}', sans-serif`);
    }

    // Handle App Dark/Light Theme Switching
    if (appThemeToggle) {
        appThemeToggle.addEventListener("change", (e) => {
            const theme = e.target.checked ? "dark" : "light";
            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem("appTheme", theme);
        });
    }

    // Handle Canvas Font selection change
    if (canvasFontSelect) {
        canvasFontSelect.addEventListener("change", (e) => {
            const selectedFont = e.target.value;
            localStorage.setItem("canvasFont", selectedFont);
            document.documentElement.style.setProperty('--canvas-font', `'${selectedFont}', sans-serif`);
        });
    }

    // Handle Creator Name Input
    if (creatorNameInput) {
        creatorNameInput.addEventListener("input", (e) => {
            const val = e.target.value.trim() || "@captiours";
            localStorage.setItem("creatorName", val);
            document.documentElement.style.setProperty('--creator-name', `"${val}"`);
            document.querySelectorAll('.username').forEach(el => el.textContent = val);
        });
    }

    // Handle Canvas Theme Selection
    if (themeSelect) {
        themeSelect.addEventListener("change", (e) => {
            const selected = canvasThemes[e.target.value] || canvasThemes.light;
            document.documentElement.style.setProperty('--canvas-bg', selected.bg);
            document.documentElement.style.setProperty('--canvas-text', selected.text);
            document.documentElement.style.setProperty('--canvas-primary', selected.primary);
        });
    }

    // Handle Cover Image Height Slider
    if (coverHeight) {
        coverHeight.addEventListener("input", (e) => {
            const val = e.target.value;
            if (heightValue) heightValue.textContent = val;
            document.documentElement.style.setProperty('--cover-height', `${val}%`);
        });
    }

    // Handle Font Scaling Slider
    if (fontScale) {
        fontScale.addEventListener("input", (e) => {
            const val = e.target.value;
            if (fontScaleValue) fontScaleValue.textContent = `${parseFloat(val).toFixed(2)}`;
            document.documentElement.style.setProperty('--font-scale', val);
        });
    }

    /**
     * MODAL MANAGEMENT
     */

    // Settings Modal
    if (openSettingsBtn && settingsModal) {
        openSettingsBtn.addEventListener("click", () => {
            settingsModal.classList.add("active");
            openSettingsBtn.setAttribute("aria-expanded", "true");
            closeSettingsBtn?.focus();
        });
    }

    if (closeSettingsBtn && settingsModal) {
        closeSettingsBtn.addEventListener("click", () => {
            settingsModal.classList.remove("active");
            openSettingsBtn?.setAttribute("aria-expanded", "false");
            openSettingsBtn?.focus();
        });
    }

    // Preview Modal (Only active / visible on mobile due to CSS media query hiding FAB on desktop)
    if (openPreviewBtn && previewModal) {
        openPreviewBtn.addEventListener("click", () => {
            syncPreviews();
            previewModal.classList.add("active");
            openPreviewBtn.setAttribute("aria-expanded", "true");
            closePreviewBtn?.focus();
        });
    }

    if (closePreviewBtn && previewModal) {
        closePreviewBtn.addEventListener("click", () => {
            previewModal.classList.remove("active");
            openPreviewBtn?.setAttribute("aria-expanded", "false");
            openPreviewBtn?.focus();
        });
    }

    // Close Modals on overlay click or Esc press
    window.addEventListener("click", (e) => {
        if (e.target === settingsModal) closeSettingsBtn?.click();
        if (e.target === previewModal) closePreviewBtn?.click();
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (settingsModal?.classList.contains("active")) closeSettingsBtn?.click();
            if (previewModal?.classList.contains("active")) closePreviewBtn?.click();
        }
    });

    /**
     * CAROUSEL PAGES MANAGEMENT
     */

    // Helper to generate accessible IDs
    function generateUUID() {
        return Date.now().toString() + Math.floor(Math.random() * 100);
    }

    // Update form labels sequentially (Page 1, Page 2, ...)
    function updateFormLabels() {
        const forms = document.querySelectorAll('.page-form');
        forms.forEach((form, index) => {
            const titleEl = form.querySelector('.card-header span');
            if (titleEl) {
                titleEl.textContent = `Halaman ${index + 1}`;
            }
        });

        // Update Empty State visibility
        const emptyState = document.getElementById("emptyState");
        if (emptyState) {
            emptyState.style.display = forms.length === 0 ? "flex" : "none";
        }
    }

    // Update pagination indicators in canvas renders
    function updatePagination() {
        // Fix double pagination count by calculating total pages from forms, not total canvas elements
        // Total forms is equal to the number of slider pages.
        const total = document.querySelectorAll('.page-form').length;

        // Since canvas element has suffixes 'mobile' and 'desktop' (or only one at a time),
        // we can correctly identify page index using its positional placement under each container.
        const mobileCanvases = previewContainer.querySelectorAll('.canvas');
        mobileCanvases.forEach((canvas, index) => {
            const paginationEl = canvas.querySelector('.pagination');
            if (paginationEl) {
                paginationEl.innerHTML = '';
                for (let i = 0; i < total; i++) {
                    const dot = document.createElement('div');
                    dot.className = `page-dot ${i === index ? 'active' : ''}`;
                    paginationEl.appendChild(dot);
                }
            }
        });

        if (sidebarPreviewContainer) {
            const desktopCanvases = sidebarPreviewContainer.querySelectorAll('.canvas');
            desktopCanvases.forEach((canvas, index) => {
                const paginationEl = canvas.querySelector('.pagination');
                if (paginationEl) {
                    paginationEl.innerHTML = '';
                    for (let i = 0; i < total; i++) {
                        const dot = document.createElement('div');
                        dot.className = `page-dot ${i === index ? 'active' : ''}`;
                        paginationEl.appendChild(dot);
                    }
                }
            });
        }
    }

    // Sync state before preview
    function syncPreviews() {
        updatePagination();
    }

    // Dynamic markdown parsing helper
    function renderMarkdown(text) {
        if (!text) return "Isi konten akan tampil di sini.";
        if (window.marked && typeof window.marked.parse === "function") {
            try {
                return window.marked.parse(text);
            } catch (e) {
                console.error("Markdown parsing failed, falling back to simple text.", e);
            }
        }
        // Fallback simple rendering if marked.js is not loaded yet
        return text.replace(/\n/g, '<br>');
    }

    // Add and template a new page
    window.createNewPage = function(inheritedImage = defaultImg) {
        pageCount++;
        const pageId = generateUUID();

        // 1. Template Form Editor Card
        const formHTML = `
            <div class="card page-form" data-id="${pageId}" id="form-${pageId}">
                <div class="card-header">
                    <span>Halaman ${pageCount}</span>
                    <button class="btn-text-danger" type="button" onclick="deletePage('${pageId}')" aria-label="Hapus Halaman ${pageCount}">
                        <span class="material-icons" aria-hidden="true">delete</span>
                        Hapus
                    </button>
                </div>
                <div class="input-group">
                    <label for="img-input-${pageId}">Gambar Sampul</label>
                    <input type="file" id="img-input-${pageId}" class="page-image" accept="image/*" aria-describedby="img-desc-${pageId}">
                    <span class="helper-text" id="img-desc-${pageId}">Gunakan rasio gambar landscape atau portrait yang sesuai.</span>
                </div>
                <div class="input-group">
                    <label for="title-input-${pageId}">Judul Halaman (Opsional)</label>
                    <input type="text" id="title-input-${pageId}" class="page-title" placeholder="Masukkan judul halaman..." max="100">
                </div>
                <div class="input-group">
                    <label for="content-input-${pageId}">Konten Halaman (Mendukung Markdown)</label>
                    <textarea id="content-input-${pageId}" class="page-content" placeholder="Tulis isi konten halaman (gunakan *tebal* atau _miring_)..." max="500"></textarea>
                </div>
            </div>
        `;
        formsContainer.insertAdjacentHTML('beforeend', formHTML);

        // 2. Create Canvas Preview Elements (Both for Mobile Modal and Desktop Sidebar)
        const currentCreator = localStorage.getItem("creatorName") || "@captiours";

        const canvasTemplate = (containerIdSuffix) => `
            <div class="canvas" id="canvas-${containerIdSuffix}-${pageId}">
                <div class="cover">
                    <img id="img-${containerIdSuffix}-${pageId}" src="${inheritedImage}" alt="Sampul Halaman">
                </div>
                <div class="content">
                    <div class="text-content">
                        <h1 id="title-${containerIdSuffix}-${pageId}" style="display: none;"></h1>
                        <div id="content-${containerIdSuffix}-${pageId}" class="canvas-page-content">Isi konten akan tampil di sini.</div>
                    </div>
                    <div class="footer">
                        <div class="username">${currentCreator}</div>
                        <div class="pagination" id="pagination-${containerIdSuffix}-${pageId}"></div>
                    </div>
                </div>
            </div>
        `;

        // Load to Mobile preview container
        previewContainer.insertAdjacentHTML('beforeend', canvasTemplate('mobile'));

        // Load to Desktop sticky sidebar preview container
        if (sidebarPreviewContainer) {
            sidebarPreviewContainer.insertAdjacentHTML('beforeend', canvasTemplate('desktop'));
        }

        updatePagination();
        updateFormLabels();
    };

    // Delete existing page
    window.deletePage = function(id) {
        const formEl = document.getElementById(`form-${id}`);
        const mobileCanvasEl = document.getElementById(`canvas-mobile-${id}`);
        const desktopCanvasEl = document.getElementById(`canvas-desktop-${id}`);

        if (formEl) formEl.remove();
        if (mobileCanvasEl) mobileCanvasEl.remove();
        if (desktopCanvasEl) desktopCanvasEl.remove();

        updatePagination();
        updateFormLabels();
    };

    // Live binding for Dynamic Preview Inputs using Event Delegation
    formsContainer.addEventListener('input', (e) => {
        const formCard = e.target.closest('.page-form');
        if (!formCard) return;
        const id = formCard.dataset.id;

        if (e.target.matches('.page-title')) {
            const val = e.target.value.trim();
            const suffixList = ['mobile', 'desktop'];

            suffixList.forEach(suffix => {
                const titleEl = document.getElementById(`title-${suffix}-${id}`);
                if (titleEl) {
                    if (val === "") {
                        titleEl.style.display = "none";
                        titleEl.textContent = "";
                    } else {
                        titleEl.style.display = "block";
                        titleEl.textContent = val;
                    }
                }
            });
        }

        if (e.target.matches('.page-content')) {
            const val = e.target.value;
            const parsedHTML = renderMarkdown(val);
            const suffixList = ['mobile', 'desktop'];

            suffixList.forEach(suffix => {
                const contentEl = document.getElementById(`content-${suffix}-${id}`);
                if (contentEl) {
                    contentEl.innerHTML = parsedHTML;
                }
            });
        }
    });

    // Handle Image Loading with File Reader API
    formsContainer.addEventListener('change', (e) => {
        if (e.target.matches('.page-image')) {
            const formCard = e.target.closest('.page-form');
            if (!formCard) return;
            const id = formCard.dataset.id;
            const file = e.target.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    const suffixList = ['mobile', 'desktop'];
                    suffixList.forEach(suffix => {
                        const imgEl = document.getElementById(`img-${suffix}-${id}`);
                        if (imgEl) imgEl.src = reader.result;
                    });
                };
                reader.readAsDataURL(file);
            }
        }
    });

    // Add Page Button Click Interaction with image inheritance
    if (addPageBtn) {
        addPageBtn.addEventListener("click", () => {
            let lastImageSrc = defaultImg;
            const allForms = document.querySelectorAll('.page-form');
            if (allForms.length > 0) {
                const lastId = allForms[allForms.length - 1].dataset.id;
                // Grab image from mobile or desktop canvas
                const lastImgEl = document.getElementById(`img-mobile-${lastId}`);
                if (lastImgEl) {
                    lastImageSrc = lastImgEl.src;
                }
            }
            window.createNewPage(lastImageSrc);
        });
    }

    /**
     * BULK CAROUSEL DOWNLOAD / EXPORT SYSTEM
     */
    if (downloadAllBtn) {
        downloadAllBtn.addEventListener("click", async () => {
            const canvases = previewContainer.querySelectorAll('.canvas');
            if (canvases.length === 0) {
                alert("Tidak ada halaman yang tersedia untuk diunduh. Silakan buat halaman terlebih dahulu.");
                return;
            }

            // Disable buttons and show processing states
            downloadAllBtn.innerHTML = '<span class="material-icons spinning">sync</span> Memproses...';
            downloadAllBtn.style.pointerEvents = "none";
            downloadAllBtn.setAttribute("disabled", "true");

            try {
                for (let i = 0; i < canvases.length; i++) {
                    const canvasElement = canvases[i];

                    // Add "exporting" class temporarily to strip border radius/shadows
                    canvasElement.classList.add("exporting");

                    const canvasOutput = await html2canvas(canvasElement, {
                        scale: 2, // High resolution (720x720) for Instagram export
                        useCORS: true,
                        backgroundColor: null
                    });

                    // Remove "exporting" class immediately after render to restore original layout aesthetics
                    canvasElement.classList.remove("exporting");

                    const link = document.createElement('a');
                    link.download = `captiours-page-${i + 1}.png`;
                    link.href = canvasOutput.toDataURL('image/png');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    // Rate limiter timeout to let browsers schedule concurrent file downloads cleanly
                    await new Promise(resolve => setTimeout(resolve, 600));
                }
            } catch (error) {
                console.error("Error generating carousel downloads:", error);
                alert("Ada kendala saat mengunduh gambar. Silakan coba kembali.");
            } finally {
                // Re-enable interactive states
                downloadAllBtn.innerHTML = '<span class="material-icons">download</span> Unduh';
                downloadAllBtn.style.pointerEvents = "auto";
                downloadAllBtn.removeAttribute("disabled");
            }
        });
    }

    // Initialize the Editor with the First Page automatically
    window.createNewPage();
});
