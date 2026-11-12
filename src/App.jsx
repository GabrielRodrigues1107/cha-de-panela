import fotoCasal from "./assets/foto-casal.jpg";
import "./App.css";

function App() {
  return (
    <main className="pagina encerramento-sistema">
      <section
        style={{
          width: "min(620px, 100%)",
          margin: "auto",
          padding: "clamp(30px, 6vw, 55px)",
          boxSizing: "border-box",
          textAlign: "center",
          background: "#102943",
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: "20px",
          boxShadow: "0 25px 80px rgba(0,0,0,0.4)",
        }}
      >
        {/* FOTO DO CASAL */}
        <div
          style={{
            width: "150px",
            height: "150px",
            margin: "0 auto 25px",
            overflow: "hidden",
            border: "4px solid rgba(255,255,255,0.85)",
            borderRadius: "50%",
          }}
        >
          <img
            src={fotoCasal}
            alt="Gabriel e Karoline"
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: "cover",
            }}
          />
        </div>

        {/* IDENTIFICAÇÃO */}
        <p
          style={{
            margin: "0 0 15px",
            color: "rgba(255,255,255,0.55)",
            fontSize: "12px",
            fontWeight: "bold",
            letterSpacing: "3px",
          }}
        >
          GABRIEL & KAROLINE
        </p>

        <div
          style={{
            marginBottom: "18px",
            color: "#ffffff",
            fontSize: "34px",
          }}
        >
          ♡
        </div>

        {/* TÍTULO */}
        <h1
          style={{
            margin: 0,
            color: "#ffffff",
            fontSize: "clamp(30px, 6vw, 43px)",
            fontWeight: 400,
            lineHeight: 1.2,
          }}
        >
          Lista de presentes encerrada!
        </h1>

        {/* DIVISOR */}
        <div
          style={{
            width: "60px",
            height: "1px",
            margin: "25px auto",
            background: "rgba(255,255,255,0.35)",
          }}
        />

        {/* MENSAGEM */}
        <p
          style={{
            maxWidth: "480px",
            margin: "0 auto 18px",
            color: "rgba(255,255,255,0.76)",
            fontSize: "16px",
            lineHeight: 1.8,
          }}
        >
          Agradecemos de coração a todos que participaram
          desse momento tão especial.
        </p>

        <p
          style={{
            maxWidth: "480px",
            margin: "0 auto 25px",
            color: "rgba(255,255,255,0.76)",
            fontSize: "16px",
            lineHeight: 1.8,
          }}
        >
          As confirmações de presença e a escolha de
          presentes foram encerradas.
        </p>

        {/* AGRADECIMENTO */}
        <p
          style={{
            margin: "0 0 28px",
            color: "#ffffff",
            fontSize: "21px",
            fontStyle: "italic",
            lineHeight: 1.5,
          }}
        >
          Que Deus abençoe cada um de vocês!
        </p>

        {/* ASSINATURA */}
        <p
          style={{
            margin: 0,
            color: "rgba(255,255,255,0.58)",
            fontSize: "14px",
            lineHeight: 1.8,
          }}
        >
          Com carinho,
          <br />

          <strong
            style={{
              color: "#ffffff",
              fontSize: "16px",
            }}
          >
            Gabriel & Karoline
          </strong>
        </p>
      </section>
    </main>
  );
}

export default App;