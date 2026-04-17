const DEFAULTS = {
    key: "+5531984956383",
    name: "Kennedy Rodrigues G",
    city: "Belo Horizonte"
};

const SELECTORS = {
    form: "#pix-form",
    key: "#pix-key",
    name: "#pix-name",
    city: "#pix-city",
    value: "#pix-value",
    generate: "#pix-generate",
    copy: "#pix-copy",
    download: "#pix-download",
    placeholder: "#qr-placeholder",
    result: "#qr-result",
    code: "#qr-code",
    amount: "#qr-amount",
    displayName: "#qr-name",
    payload: "#pix-payload",
    toast: "#toast",
    toastMessage: "#toast-message"
};

const el = Object.fromEntries(
    Object.entries(SELECTORS).map(([k, sel]) => [k, document.querySelector(sel)])
);

const state = {
    payload: "",
    qr: null
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

function formatCurrencyInput(raw) {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    const cents = parseInt(digits, 10) / 100;
    return currencyFormatter.format(cents);
}

function parseCurrency(value) {
    if (!value) return 0;
    const digits = value.replace(/\D/g, "");
    return digits ? parseInt(digits, 10) / 100 : 0;
}

function sanitizeText(value, max) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\x20-\x7E]/g, "")
        .trim()
        .slice(0, max);
}

function normalizePixKey(raw) {
    const value = raw.trim();
    if (!value) return "";

    if (value.includes("@")) return value.toLowerCase();

    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuid.test(value)) return value.toLowerCase();

    if (value.startsWith("+")) {
        const digits = value.slice(1).replace(/\D/g, "");
        return digits ? `+${digits}` : "";
    }

    const digits = value.replace(/\D/g, "");
    if (!digits) return value;

    if (digits.length === 14) return digits;
    if (digits.length === 13 && digits.startsWith("55")) return `+${digits}`;
    if (digits.length === 12 && digits.startsWith("55")) return `+${digits}`;
    if (digits.length === 11) {
        const ddd = parseInt(digits.slice(0, 2), 10);
        const isMobile = digits[2] === "9";
        if (ddd >= 11 && ddd <= 99 && isMobile) return `+55${digits}`;
        return digits;
    }
    if (digits.length === 10) {
        const ddd = parseInt(digits.slice(0, 2), 10);
        if (ddd >= 11 && ddd <= 99) return `+55${digits}`;
    }

    return value;
}

function tlv(id, value) {
    const length = value.length.toString().padStart(2, "0");
    return `${id}${length}${value}`;
}

function buildPayload({ key, name, city, amount }) {
    const merchantAccount = tlv("00", "BR.GOV.BCB.PIX") + tlv("01", key);
    const additional = tlv("05", "***");

    let payload = "";
    payload += tlv("00", "01");
    payload += tlv("26", merchantAccount);
    payload += tlv("52", "0000");
    payload += tlv("53", "986");
    if (amount > 0) {
        payload += tlv("54", amount.toFixed(2));
    }
    payload += tlv("58", "BR");
    payload += tlv("59", name);
    payload += tlv("60", city);
    payload += tlv("62", additional);
    payload += "6304";

    return payload + crc16(payload);
}

function crc16(payload) {
    const polynomial = 0x1021;
    let result = 0xffff;

    for (let i = 0; i < payload.length; i++) {
        result ^= payload.charCodeAt(i) << 8;
        for (let bit = 0; bit < 8; bit++) {
            result = (result & 0x8000) ? ((result << 1) ^ polynomial) : (result << 1);
            result &= 0xffff;
        }
    }

    return result.toString(16).toUpperCase().padStart(4, "0");
}

function renderQRCode(payload) {
    el.code.innerHTML = "";
    state.qr = new QRCode(el.code, {
        text: payload,
        width: 220,
        height: 220,
        colorDark: "#070b18",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
    });
}

function showResult({ name, amount }) {
    el.placeholder.hidden = true;
    el.result.hidden = false;
    el.amount.textContent = amount > 0 ? currencyFormatter.format(amount) : "Valor livre";
    el.displayName.textContent = name;
    el.payload.value = state.payload;
}

function showToast(message, variant = "success") {
    el.toastMessage.textContent = message;
    el.toast.classList.toggle("toast--error", variant === "error");
    el.toast.hidden = false;
    requestAnimationFrame(() => el.toast.setAttribute("data-open", "true"));

    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
        el.toast.removeAttribute("data-open");
        setTimeout(() => (el.toast.hidden = true), 250);
    }, 2200);
}

function validate(fields) {
    el.key.removeAttribute("aria-invalid");
    if (!fields.key) {
        el.key.setAttribute("aria-invalid", "true");
        el.key.focus();
        showToast("Informe a chave Pix.", "error");
        return false;
    }
    return true;
}

async function copyToClipboard(text) {
    if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            /* fallback below */
        }
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
}

function handleSubmit(event) {
    event.preventDefault();

    const normalizedKey = normalizePixKey(el.key.value);
    if (normalizedKey && normalizedKey !== el.key.value) {
        el.key.value = normalizedKey;
    }

    const fields = {
        key: normalizedKey,
        name: sanitizeText(el.name.value, 25) || DEFAULTS.name,
        city: sanitizeText(el.city.value, 15) || DEFAULTS.city,
        amount: parseCurrency(el.value.value)
    };

    if (!validate(fields)) return;

    state.payload = buildPayload(fields);
    renderQRCode(state.payload);
    showResult(fields);
    el.copy.disabled = false;
    el.download.disabled = false;
}

async function handleCopy() {
    if (!state.payload) return;
    const ok = await copyToClipboard(state.payload);
    showToast(ok ? "Pix copiado!" : "Não foi possível copiar.", ok ? "success" : "error");
}

function handleDownload() {
    const image = el.code.querySelector("img, canvas");
    if (!image) return;

    const source = image.tagName === "IMG" ? image.src : image.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = source;
    link.download = "qr-code-pix.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function bindEvents() {
    el.value.addEventListener("input", event => {
        event.target.value = formatCurrencyInput(event.target.value);
    });

    el.key.addEventListener("blur", event => {
        const normalized = normalizePixKey(event.target.value);
        if (normalized && normalized !== event.target.value) {
            event.target.value = normalized;
        }
    });

    el.form.addEventListener("submit", handleSubmit);
    el.copy.addEventListener("click", handleCopy);
    el.download.addEventListener("click", handleDownload);
}

bindEvents();
