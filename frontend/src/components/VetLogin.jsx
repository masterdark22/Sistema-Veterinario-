import { useState, useCallback, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

const DEMO_CREDENTIALS = {
  email: "admin@vetcare.mx",
  password: "VetCare2024!",
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const PawIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="5" cy="7" rx="2" ry="2.8" fill="currentColor" opacity="0.85"/>
    <ellipse cx="10" cy="4.5" rx="1.8" ry="2.5" fill="currentColor" opacity="0.85"/>
    <ellipse cx="15" cy="4.5" rx="1.8" ry="2.5" fill="currentColor" opacity="0.85"/>
    <ellipse cx="19.5" cy="7" rx="2" ry="2.8" fill="currentColor" opacity="0.85"/>
    <path d="M12 10.5C8.5 10.5 5.5 13 5.5 16.5C5.5 19.5 8 21.5 12 21.5C16 21.5 18.5 19.5 18.5 16.5C18.5 13 15.5 10.5 12 10.5Z" fill="currentColor"/>
  </svg>
);

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

const MailIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const LockIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

// ─── Validation ───────────────────────────────────────────────────────────────

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "El correo electrónico es obligatorio";
  if (!re.test(email)) return "Ingresa un correo electrónico válido";
  return null;
}

function validatePassword(password) {
  if (!password) return "La contraseña es obligatoria";
  if (password.length < 8) return "Mínimo 8 caracteres";
  if (!/[A-Z]/.test(password)) return "Debe incluir al menos una mayúscula";
  if (!/[0-9]/.test(password)) return "Debe incluir al menos un número";
  return null;
}

function getPasswordStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

// ─── Password Strength Bar ────────────────────────────────────────────────────

const PasswordStrengthBar = ({ password }) => {
  const strength = getPasswordStrength(password);
  const labels = ["", "Muy débil", "Débil", "Regular", "Fuerte", "Muy fuerte"];
  const colors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"];

  if (!password) return null;

  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "5px" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "3px",
              borderRadius: "99px",
              background: i <= strength ? colors[strength] : "#e5e7eb",
              transition: "background 0.35s ease",
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: "11px", color: colors[strength], fontWeight: 500, letterSpacing: "0.02em" }}>
        {labels[strength]}
      </span>
    </div>
  );
};

// ─── Field Component ──────────────────────────────────────────────────────────

const Field = ({ id, label, type, value, onChange, onBlur, error, touched, icon, rightElement, autoComplete, hint }) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const isValid = touched && !error && hasValue;
  const isError = touched && !!error;

  const borderColor = isError
    ? "#ef4444"
    : isValid
    ? "#10b981"
    : focused
    ? "#2e7d5e"
    : "#d1d5db";

  const shadowColor = isError
    ? "rgba(239,68,68,0.15)"
    : isValid
    ? "rgba(16,185,129,0.15)"
    : focused
    ? "rgba(46,125,94,0.18)"
    : "transparent";

  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: "12.5px",
          fontWeight: 600,
          color: isError ? "#ef4444" : "#374151",
          marginBottom: "7px",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          fontFamily: "'DM Mono', monospace",
          transition: "color 0.2s",
        }}
      >
        {label}
      </label>

      <div style={{ position: "relative" }}>
        {/* Left icon */}
        <div
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            color: isError ? "#ef4444" : focused ? "#2e7d5e" : "#9ca3af",
            transition: "color 0.2s",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
          }}
          aria-hidden="true"
        >
          {icon}
        </div>

        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={(e) => { setFocused(false); onBlur(e); }}
          onFocus={() => setFocused(true)}
          autoComplete={autoComplete}
          aria-invalid={isError}
          aria-describedby={isError ? `${id}-error` : hint ? `${id}-hint` : undefined}
          style={{
            width: "100%",
            padding: "12px 44px 12px 44px",
            fontSize: "14.5px",
            fontFamily: "'Lato', sans-serif",
            color: "#111827",
            background: focused ? "#fff" : "#fafafa",
            border: `1.5px solid ${borderColor}`,
            borderRadius: "10px",
            outline: "none",
            boxShadow: `0 0 0 3px ${shadowColor}`,
            transition: "all 0.22s ease",
            boxSizing: "border-box",
            letterSpacing: "0.01em",
          }}
          placeholder={hint || ""}
        />

        {/* Right element (toggle / check) */}
        <div
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {isValid && !rightElement && (
            <span style={{ color: "#10b981", display: "flex" }} aria-hidden="true">
              <CheckIcon />
            </span>
          )}
          {rightElement}
        </div>
      </div>

      {/* Error message */}
      {isError && (
        <div
          id={`${id}-error`}
          role="alert"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginTop: "6px",
            fontSize: "12px",
            color: "#ef4444",
            fontFamily: "'Lato', sans-serif",
            animation: "slideDown 0.18s ease",
          }}
        >
          <AlertIcon />
          {error}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VetLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [remember, setRemember] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => { emailRef.current?.focus(); }, []);

  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const isFormValid = !emailError && !passwordError;

  const handleBlur = useCallback((field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isFormValid) return;

    setLoading(true);
    setServerError("");

    await new Promise((r) => setTimeout(r, 1800));

    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      setSuccess(true);
    } else {
      setServerError("Credenciales incorrectas. Intenta con admin@vetcare.mx / VetCare2024!");
    }

    setLoading(false);
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div style={wrapStyle}>
        <style>{cssReset}</style>
        <div style={cardStyle}>
          <div style={{ textAlign: "center", padding: "48px 32px" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "linear-gradient(135deg,#2e7d5e,#4db88c)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", boxShadow: "0 8px 24px rgba(46,125,94,0.35)",
              animation: "popIn 0.4s cubic-bezier(.34,1.56,.64,1)",
            }}>
              <span style={{ color: "#fff", fontSize: "30px" }}>✓</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#111827", marginBottom: "8px" }}>
              ¡Bienvenido de vuelta!
            </h2>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "14px", color: "#6b7280" }}>
              Acceso concedido. Redirigiendo al panel…
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Login form ────────────────────────────────────────────────────────────
  return (
    <div style={wrapStyle}>
      <style>{cssReset}</style>

      {/* Decorative blobs */}
      <div style={blob1} aria-hidden="true" />
      <div style={blob2} aria-hidden="true" />

      <div style={cardStyle}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={logoWrap} aria-hidden="true">
            <PawIcon />
          </div>
          <h1 style={titleStyle}>VetCare Pro</h1>
          <p style={subtitleStyle}>Sistema de gestión veterinaria</p>
          <div style={dividerStyle} />
        </div>

        {/* Demo hint */}
        <div style={hintBadge}>
          <span style={{ fontSize: "10px", fontFamily: "'DM Mono', monospace", color: "#6b7280", letterSpacing: "0.04em" }}>
            DEMO · admin@vetcare.mx · VetCare2024!
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate aria-label="Formulario de inicio de sesión">
          <Field
            id="email"
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleBlur("email")}
            error={emailError}
            touched={touched.email}
            icon={<MailIcon />}
            autoComplete="email"
            hint="correo@clinica.mx"
          />

          <Field
            id="password"
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={handleBlur("password")}
            error={passwordError}
            touched={touched.password}
            icon={<LockIcon />}
            autoComplete="current-password"
            hint="Mín. 8 chars, 1 mayúscula, 1 número"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#9ca3af", padding: "2px", display: "flex", alignItems: "center",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#2e7d5e")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
              >
                <EyeIcon open={showPassword} />
              </button>
            }
          />

          <PasswordStrengthBar password={password} />

          {/* Remember & Forgot */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "18px 0 22px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ accentColor: "#2e7d5e", width: "14px", height: "14px", cursor: "pointer" }}
              />
              <span style={{ fontSize: "13px", fontFamily: "'Lato', sans-serif", color: "#6b7280" }}>
                Recordarme
              </span>
            </label>
            <button
              type="button"
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "13px", fontFamily: "'Lato', sans-serif",
                color: "#2e7d5e", fontWeight: 600, padding: 0,
                textDecoration: "underline", textDecorationStyle: "dotted",
                textUnderlineOffset: "3px",
              }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Server error */}
          {serverError && (
            <div
              role="alert"
              style={{
                background: "#fff5f5", border: "1.5px solid #fecaca",
                borderRadius: "10px", padding: "12px 14px",
                display: "flex", alignItems: "flex-start", gap: "8px",
                marginBottom: "18px", animation: "slideDown 0.2s ease",
              }}
            >
              <span style={{ color: "#ef4444", flexShrink: 0, marginTop: "1px" }}><AlertIcon /></span>
              <span style={{ fontSize: "13px", fontFamily: "'Lato', sans-serif", color: "#dc2626", lineHeight: 1.5 }}>
                {serverError}
              </span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            style={{
              width: "100%",
              padding: "13.5px",
              background: loading
                ? "#9ca3af"
                : "linear-gradient(135deg, #2e7d5e 0%, #3d9970 50%, #2e7d5e 100%)",
              backgroundSize: "200% 200%",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "14.5px",
              fontWeight: 700,
              fontFamily: "'Lato', sans-serif",
              letterSpacing: "0.06em",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              boxShadow: loading ? "none" : "0 4px 16px rgba(46,125,94,0.35)",
              transition: "all 0.25s ease",
              transform: "translateY(0)",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-1.5px)";
                e.currentTarget.style.boxShadow = "0 6px 22px rgba(46,125,94,0.45)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(46,125,94,0.35)";
            }}
          >
            {loading ? (
              <>
                <span style={spinnerStyle} aria-hidden="true" />
                Verificando acceso…
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        {/* Footer */}
        <p style={{ textAlign: "center", marginTop: "28px", fontSize: "11.5px", color: "#9ca3af", fontFamily: "'Lato', sans-serif" }}>
          ¿Problemas para acceder?{" "}
          <button
            type="button"
            style={{ background: "none", border: "none", color: "#2e7d5e", fontWeight: 600, cursor: "pointer", fontSize: "11.5px", fontFamily: "inherit", padding: 0 }}
          >
            Contactar soporte
          </button>
        </p>

        {/* Paw watermark */}
        <div style={pawWatermark} aria-hidden="true">
          <PawIcon />
        </div>
      </div>

      {/* Bottom label */}
      <p style={{ textAlign: "center", marginTop: "24px", fontSize: "11px", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}>
        © 2024 VetCare Pro · Todos los derechos reservados
      </p>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const wrapStyle = {
  minHeight: "100vh",
  background: "linear-gradient(145deg, #0d3d2b 0%, #1a5c40 40%, #2e7d5e 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px 16px",
  position: "relative",
  overflow: "hidden",
};

const blob1 = {
  position: "absolute",
  width: "500px",
  height: "500px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(77,184,140,0.18) 0%, transparent 70%)",
  top: "-120px",
  right: "-100px",
  pointerEvents: "none",
};

const blob2 = {
  position: "absolute",
  width: "400px",
  height: "400px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
  bottom: "-80px",
  left: "-80px",
  pointerEvents: "none",
};

const cardStyle = {
  width: "100%",
  maxWidth: "420px",
  background: "#fff",
  borderRadius: "20px",
  padding: "40px 36px 32px",
  boxShadow: "0 24px 64px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.1)",
  position: "relative",
  overflow: "hidden",
  animation: "fadeUp 0.5s cubic-bezier(.22,1,.36,1)",
};

const logoWrap = {
  width: "56px",
  height: "56px",
  borderRadius: "14px",
  background: "linear-gradient(135deg, #2e7d5e, #4db88c)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 14px",
  color: "#fff",
  boxShadow: "0 6px 18px rgba(46,125,94,0.4)",
};

const titleStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "26px",
  fontWeight: 700,
  color: "#111827",
  margin: "0 0 4px",
  letterSpacing: "-0.01em",
};

const subtitleStyle = {
  fontFamily: "'Lato', sans-serif",
  fontSize: "13px",
  color: "#9ca3af",
  margin: 0,
  letterSpacing: "0.02em",
};

const dividerStyle = {
  width: "40px",
  height: "2.5px",
  background: "linear-gradient(90deg, #2e7d5e, #4db88c)",
  borderRadius: "99px",
  margin: "14px auto 0",
};

const hintBadge = {
  background: "#f0fdf4",
  border: "1px dashed #86efac",
  borderRadius: "7px",
  padding: "8px 12px",
  marginBottom: "24px",
  textAlign: "center",
};

const spinnerStyle = {
  width: "16px",
  height: "16px",
  border: "2.5px solid rgba(255,255,255,0.3)",
  borderTopColor: "#fff",
  borderRadius: "50%",
  animation: "spin 0.7s linear infinite",
  display: "inline-block",
  flexShrink: 0,
};

const pawWatermark = {
  position: "absolute",
  bottom: "16px",
  right: "18px",
  opacity: 0.05,
  transform: "rotate(15deg) scale(2.5)",
  color: "#2e7d5e",
  pointerEvents: "none",
};

const cssReset = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lato:wght@400;600;700&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.5); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  input::placeholder { color: #c4c9d4; font-size: 13.5px; }
  input:-webkit-autofill { -webkit-box-shadow: 0 0 0 40px #fff inset !important; }
`;
