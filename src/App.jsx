import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import fotoCasal from "./assets/foto-casal.jpg";
import "./App.css";

function App() {
  const [nome, setNome] = useState("");
  const [presenca, setPresenca] = useState("");
  const [presenteSelecionado, setPresenteSelecionado] =
    useState(null);

  const [presentes, setPresentes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarPresentes();
  }, []);

  // ==============================
  // CARREGAR PRESENTES
  // ==============================

  async function carregarPresentes() {
    setCarregando(true);

    const { data, error } = await supabase
      .from("gifts")
      .select("*")
      .order("id", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Erro ao carregar presentes:",
        error
      );

      alert(
        "Não foi possível carregar a lista de presentes."
      );
    } else {
      setPresentes(data || []);
    }

    setCarregando(false);
  }

  // ==============================
  // ESCOLHER PRESENTE
  // ==============================

  function escolherPresente(presente) {
    if (salvando) {
      return;
    }

    if (!nome.trim()) {
      alert(
        "Digite seu nome antes de escolher um presente."
      );
      return;
    }

    if (presenca !== "sim") {
      alert(
        "Primeiro confirme que você irá comparecer."
      );
      return;
    }

    if (presente.stock <= 0) {
      alert(
        "Este presente está esgotado."
      );
      return;
    }

    setPresenteSelecionado(
      presente.id
    );
  }

  // ==============================
  // CONFIRMAR PRESENÇA + PRESENTE
  // ==============================

  async function confirmarTudo() {
    if (salvando) {
      return;
    }

    if (!nome.trim()) {
      alert("Digite seu nome.");
      return;
    }

    if (presenca !== "sim") {
      alert(
        "Confirme que você irá comparecer."
      );
      return;
    }

    if (!presenteSelecionado) {
      alert(
        "Escolha um presente."
      );
      return;
    }

    const presente = presentes.find(
      (item) =>
        item.id === presenteSelecionado
    );

    if (!presente) {
      alert(
        "Presente não encontrado."
      );
      return;
    }

    if (presente.stock <= 0) {
      alert(
        "Esse presente acabou. Escolha outro."
      );

      setPresenteSelecionado(null);

      await carregarPresentes();

      return;
    }

    setSalvando(true);

    try {
      const { error } =
        await supabase.rpc(
          "reservar_presente",
          {
            p_gift_id:
              presenteSelecionado,

            p_guest_name:
              nome.trim(),
          }
        );

      if (error) {
        console.error(
          "Erro ao confirmar presença:",
          error
        );

        if (
          error.message
            ?.toLowerCase()
            .includes("esgotado")
        ) {
          alert(
            "Esse presente acabou enquanto você estava escolhendo. Por favor, escolha outro."
          );
        } else {
          alert(
            "Não foi possível confirmar sua presença. Tente novamente."
          );
        }

        await carregarPresentes();

        return;
      }

      alert(
        `Presença confirmada com sucesso!\n\nObrigado, ${nome.trim()}! ❤️`
      );

      setNome("");
      setPresenca("");
      setPresenteSelecionado(null);

      await carregarPresentes();
    } catch (error) {
      console.error(
        "Erro inesperado:",
        error
      );

      alert(
        "Ocorreu um erro ao confirmar sua presença. Tente novamente."
      );

      await carregarPresentes();
    } finally {
      setSalvando(false);
    }
  }

  // ==============================
  // TEXTO DO ESTOQUE
  // ==============================

  function quantidadeTexto(presente) {
    if (presente.stock <= 0) {
      return "ESGOTADO";
    }

    if (presente.stock === 1) {
      return "1 unidade disponível";
    }

    return `${presente.stock} unidades disponíveis`;
  }

  return (
    <main className="pagina">

      {/* ==============================
          HERO
      ============================== */}

      <section className="hero">

        <div className="foto-wrapper">
          <img
            src={fotoCasal}
            alt="Gabriel e Karoline"
            className="foto-casal"
          />
        </div>

        <div className="coracao-topo">
          ♡
        </div>

        <h1>
          Gabriel & Karoline
        </h1>

        <p className="subtitulo">
          Chá de Panela
        </p>

        <p className="descricao">
          Estamos preparando nosso cantinho com muito carinho
          e queremos comemorar esse momento especial com você.
        </p>

        <p className="descricao-secundaria">
          Escolha um presente da nossa lista e confirme sua presença.
        </p>

      </section>

      {/* ==============================
          INFORMAÇÕES DO EVENTO
      ============================== */}

      <section className="informacoes-evento">

        <div className="info">

          <div className="info-icone">
            ♡
          </div>

          <div>
            <strong>
              Data
            </strong>

            <span>
              21 de novembro de 2026
            </span>
          </div>

        </div>

        <div className="separador"></div>

        <div className="info">

          <div className="info-icone">
            ◷
          </div>

          <div>
            <strong>
              Horário
            </strong>

            <span>
              16h
            </span>
          </div>

        </div>

        <div className="separador"></div>

        <div className="info">

          <div className="info-icone">
            ⌖
          </div>

          <div>
            <strong>
              Local
            </strong>

            <span>
              Rua Antônio Alves da Silva,
              em frente à ADG, Parada Modelo
            </span>
          </div>

        </div>

      </section>

      {/* ==============================
          CONFIRMAÇÃO
      ============================== */}

      <section className="confirmacao">

        <div className="ornamento">
          ─── ♡ ───
        </div>

        <p className="titulo-pequeno">
          SUA PRESENÇA
        </p>

        <h2>
          Vamos comemorar juntos?
        </h2>

        {/* NOME */}

        <div className="campo">

          <label htmlFor="nome">
            Seu nome
          </label>

          <input
            id="nome"
            type="text"
            placeholder="Digite seu nome"
            value={nome}
            onChange={(event) =>
              setNome(
                event.target.value
              )
            }
            disabled={salvando}
          />

        </div>

        {/* PRESENÇA */}

        <div className="campo">

          <label>
            Você irá comparecer?
          </label>

          <div className="opcoes">

            <button
              type="button"
              className={`opcao ${
                presenca === "sim"
                  ? "ativa"
                  : ""
              }`}
              onClick={() =>
                setPresenca("sim")
              }
              disabled={salvando}
            >

              <span className="radio">
                {presenca === "sim"
                  ? "✓"
                  : ""}
              </span>

              Sim, vou comparecer

            </button>

            <button
              type="button"
              className={`opcao ${
                presenca === "nao"
                  ? "ativa"
                  : ""
              }`}
              onClick={() => {
                setPresenca("nao");
                setPresenteSelecionado(
                  null
                );
              }}
              disabled={salvando}
            >

              <span className="radio">
                {presenca === "nao"
                  ? "✓"
                  : ""}
              </span>

              Não poderei comparecer

            </button>

          </div>

        </div>

      </section>

      {/* ==============================
          LISTA DE PRESENTES
      ============================== */}

      <section className="lista-section">

        <div className="lista-cabecalho">

          <p className="titulo-pequeno">
            LISTA DE PRESENTES
          </p>

          <h2>
            Um carinho para nosso novo lar
          </h2>

          <p>
            Escolha um presente que você gostaria
            de nos presentear. Os itens com mais
            de uma unidade podem ser escolhidos
            por mais de uma pessoa.
          </p>

        </div>

        {/* CARREGANDO */}

        {carregando ? (

          <p className="texto-secao">
            Carregando presentes...
          </p>

        ) : presentes.length === 0 ? (

          <p className="texto-secao">
            Nenhum presente disponível no momento.
          </p>

        ) : (

          <div className="grid-presentes">

            {presentes.map(
              (presente) => {

                const esgotado =
                  presente.stock <= 0;

                const selecionado =
                  presenteSelecionado ===
                  presente.id;

                return (

                  <button
                    key={presente.id}
                    type="button"
                    className={`card-presente ${
                      selecionado
                        ? "selecionado"
                        : ""
                    } ${
                      esgotado
                        ? "reservado"
                        : ""
                    }`}
                    onClick={() =>
                      escolherPresente(
                        presente
                      )
                    }
                    disabled={
                      esgotado ||
                      salvando
                    }
                  >

                    <div className="icone-presente">

                      {selecionado
                        ? "✓"
                        : esgotado
                        ? "×"
                        : "♡"}

                    </div>

                    <h3>
                      {presente.name}
                    </h3>

                    <div className="status">

                      <span
                        className={`bolinha ${
                          esgotado
                            ? "esgotado"
                            : ""
                        }`}
                      ></span>

                      {quantidadeTexto(
                        presente
                      )}

                    </div>

                  </button>

                );
              }
            )}

          </div>

        )}

        {/* ==============================
            CONFIRMAÇÃO FINAL
        ============================== */}

        <div className="confirmacao-final">

          {presenteSelecionado && (

            <p className="presente-escolhido-texto">

              Presente escolhido:{" "}

              <strong>

                {
                  presentes.find(
                    (presente) =>
                      presente.id ===
                      presenteSelecionado
                  )?.name
                }

              </strong>

            </p>

          )}

          <p className="aviso-presente">
            O presente só será reservado após
            você clicar em "Confirmar presença".
          </p>

          <button
            type="button"
            className="botao-presentes"
            onClick={confirmarTudo}
            disabled={
              salvando ||
              !nome.trim() ||
              presenca !== "sim" ||
              !presenteSelecionado
            }
          >

            {salvando
              ? "Confirmando..."
              : "Confirmar presença"}

          </button>

        </div>

      </section>

      {/* ==============================
          FINAL
      ============================== */}

      <section className="final">

        <div className="foto-final">

          <img
            src={fotoCasal}
            alt="Gabriel e Karoline"
          />

        </div>

        <div className="coracao-final">
          ♡
        </div>

        <h2>
          Esperamos você!
        </h2>

        <p>
          Será muito especial ter você conosco
          nesse momento.
        </p>

        <span>
          Com carinho, Gabriel & Karoline
        </span>

      </section>

    </main>
  );
}

export default App;