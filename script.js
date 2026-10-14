// Highlight.js ni ishga tushirish (agar sahifada statik kodlar bo'lsa)
if (typeof hljs !== 'undefined') {
    hljs.highlightAll();
}

// Kod qatorlarining raqamini aniqlash va joylash funksiyasi
function updateLineNumbers() {
    document.querySelectorAll('.code-card').forEach(card => {
        const codeBlock = card.querySelector('pre code');
        const lineNumbers = card.querySelector('.line-numbers');
        
        if (codeBlock && lineNumbers) {
            const codeText = codeBlock.textContent;
            
            // Agar kod hali joylanmagan bo'lsa, davom etmaymiz
            if (!codeText || codeText.trim() === "") return;

            const lines = codeText.split('\n').length;
            let lineNumbersHTML = '';
            
            for (let i = 1; i <= lines; i++) {
                lineNumbersHTML += `<span>${i}</span>`;
            }
            
            lineNumbers.innerHTML = lineNumbersHTML;
        }
    });
}

// Kodni nusxalash funksiyasi
function copyCode(button) {
    const card = button.closest('.code-card');
    const codeText = card.querySelector('pre code').textContent;

    navigator.clipboard.writeText(codeText).then(() => {
        showToast("Kod xotiraga nusxalandi!");
        const originalText = button.innerHTML;
        button.innerHTML = "✅ Nusxalandi";
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    });
}

// Ulashish funksiyasi
function shareCode(title, button) {
    const card = button.closest('.code-card');
    const codeText = card.querySelector('pre code').textContent;

    if (navigator.share) {
        navigator.share({
            title: title,
            text: codeText
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(codeText).then(() => {
            showToast("Ulashish uchun kod nusxalandi!");
        });
    }
}

// Xabar chiqaruvchi Toast funksiyasi
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 2500);
    } else {
        // Toast elementi bo'lmasa, brauzerning oddiy xabarnomasini chiqaradi
        console.log(message);
    }
} 
// Kodni alohida (pop-up) oynada ochish funksiyasi
function openCodeInNewWindow(title, button) {
    const card = button.closest('.code-card');
    const codeBlock = card.querySelector('pre code');
    const codeText = codeBlock.innerText || codeBlock.textContent;

    // Yangi kichik brauzer oynasini ochamiz
    const newWindow = window.open('', '_blank', 'width=700,height=500,scrollbars=yes,resizable=yes');

    if (newWindow) {
        newWindow.document.write(`
            <!DOCTYPE html>
            <html lang="uz">
            <head>
                <meta charset="UTF-8">
                <title>Sourcecode | ${title}</title>
                <!-- Highlight.js va shrift uslublari -->
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css">
                <style>
                    body {
                        margin: 0;
                        padding: 15px;
                        background-color: #1e1e1e;
                        color: #d4d4d4;
                        font-family: 'Consolas', 'Courier New', monospace;
                        font-size: 14px;
                    }
                    pre {
                        margin: 0;
                        white-space: pre-wrap;
                        word-break: break-all;
                    }
                </style>
            </head>
            <body>
                <pre><code class="${codeBlock.className}">${escapeHtml(codeText)}</code></pre>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
                <script>hljs.highlightAll();</script>
            </body>
            </html>
        `);
        newWindow.document.close();
    } else {
        showToast("Brauzeringiz pop-up oynalarni bloklagan!");
    }
}

// HTML belgilarni xavfsiz o'girish funksiyasi
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Oddiy matn (Plain text) va Rangli kod rejimini almashtirish funksiyasi
function togglePlainText(button) {
    const card = button.closest('.code-card');
    const codeElement = card.querySelector('pre code');
    const lineNumbers = card.querySelector('.line-numbers');

    if (!codeElement) return;

    // Kod matnini olamiz
    const originalCode = codeElement.innerText || codeElement.textContent;

    if (card.classList.contains('plain-text-mode')) {
        // 1. Rangli (Syntax Highlight) rejimiga qaytarish
        card.classList.remove('plain-text-mode');
        button.innerHTML = "📄 Oddiy matn";

        // Highlight.js ni qayta ishga tushirish
        if (typeof hljs !== 'undefined') {
            hljs.highlightElement(codeElement);
        }

        // Qator raqamlarini qayta tiklash va ko'rsatish
        if (typeof updateLineNumbers === 'function') {
            updateLineNumbers();
        }
        if (lineNumbers) {
            lineNumbers.style.display = 'block';
        }
    } else {
        // 2. Plain text (Oddiy matn) rejimiga o'tkazish
        card.classList.add('plain-text-mode');
        button.innerHTML = "🎨 Rangli matn";

        // Highlight.js HTML teglarini olib tashlab toza matnni joylash
        codeElement.textContent = originalCode;

        // Oddiy matn rejimida ham qator raqamlarini hisoblab yangilash
        if (lineNumbers) {
            const lines = originalCode.split('\n').length;
            let lineNumbersHTML = '';
            for (let i = 1; i <= lines; i++) {
                lineNumbersHTML += `<span>${i}</span>`;
            }
            lineNumbers.innerHTML = lineNumbersHTML;
            lineNumbers.style.display = 'block';
        }
    }
}
// Sahifa havolasini ijtimoiy tarmoqlarga ulashish funksiyasi
function shareToSocial(platform) {
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    let shareUrl = '';

    switch (platform) {
        case 'telegram':
            shareUrl = `https://t.me/androidstudio2026/share/url?url=${pageUrl}&text=${pageTitle}`;
            break;
        case 'youtube':
            shareUrl = `https://www.youtube.com/@AndroidDasturlashUZ2026/send?text=${pageTitle}%20${pageUrl}`;
            break;
        case 'github':
            shareUrl = `https://github.com/Androiddasturlash`;
            break;
            // Instagram to'g'ridan-to'g'ri URL ulashish API ga ega emas, havola xotiraga nusxalanadi
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast("Sahifa havolasi nusxalandi! Instagram'da ulashishingiz mumkin.");
            });
            return;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=500');
    }
}