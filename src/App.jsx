import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import fotoCasal from "./assets/foto-casal.jpg";
import "./App.css";

function App() {
  const [nome, setNome] = useState("");
  const [presenca, setPresenca] = useState("");
  const [presentes, setPresentes] = useState([]);

  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState(null);

  const [presenteSelecionado, setPresenteSelecionado] =
    useState(null);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [confirmado, setConfirmado] = useState(false);

  useEffect(() => {
    carregarPresentes();
  }, []);

  async function carregarPresentes() {
    setCarregando(true);

    const { data, error } = await supabase
      .from("gifts")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Erro ao carregar presentes:", error);
      setCarregando(false);
      return;
    }

    setPresentes(data || []);
    setCarregando(false);
  }

  function escolherCategoria(categoria) {
    setCategoriaSelecionada(categoria);
    setPresenteSelecionado(null);
  }

  function voltarCategorias() {
    setCategoriaSelecionada(null);
    setPresenteSelecionado(null);
  }

  function escolherPresente(presente) {
    if (Number(presente.stock ?? 0) <= 0) {
      return;
    }

    if (!nome.trim()) {
      alert("Digite seu nome antes de escolher um presente.");
      return;
    }

    if (presenca !== "sim") {
      alert(
        "Confirme que você estará presente antes de escolher um presente."
      );
      return;
    }

    setPresenteSelecionado(presente.id);
  }

  async function confirmarTudo() {
    if (!nome.trim()) {
      alert("Digite seu nome.");
      return;
    }

    if (presenca !== "sim") {
      alert("Confirme sua presença.");
      return;
    }

    if (!presenteSelecionado) {
      alert("Escolha um presente.");
      return;
    }

    const presente = presentes.find(
      (item) => item.id === presenteSelecionado
    );

    if (!presente) {
      alert("Presente não encontrado.");
      return;
    }

    if (Number(presente.stock ?? 0) <= 0) {
      alert(
        "Este presente acabou de ser reservado por outra pessoa."
      );

      await carregarPresentes();
      setPresenteSelecionado(null);
      return;
    }

    setSalvando(true);

    const { error } = await supabase.rpc(
      "reservar_presente",
      {
        p_gift_id: presenteSelecionado,
        p_guest_name: nome.trim(),
      }
    );

    if (error) {
      console.error("Erro ao confirmar:", error);

      alert(
        error.message ||
          "Não foi possível confirmar. Tente novamente."
      );

      setSalvando(false);
      await carregarPresentes();
      return;
    }

    setSalvando(false);

    setConfirmado(true);

    setNome("");
    setPresenca("");
    setPresenteSelecionado(null);
    setCategoriaSelecionada(null);

    await carregarPresentes();
  }

  function quantidadeTexto(presente) {
    const estoque = Number(presente.stock ?? 0);

    if (estoque <= 0) {
      return "Esgotado";
    }

    if (estoque === 1) {
      return "1 disponível";
    }

    return `${estoque} disponíveis`;
  }

  const categorias = [
    { nome: "Quarto", icone: "🛏️" },
    { nome: "Cozinha", icone: "🍳" },
    { nome: "Banheiro", icone: "🛁" },
    { nome: "Sala", icone: "🛋️" },
    { nome: "Área de limpeza", icone: "🧹" },
  ];

  const presentesDaCategoria = presentes.filter(
    (presente) =>
      presente.category === categoriaSelecionada
  );

  if (confirmado) {
    return (
      <div className="pagina confirmacao-sucesso">
        <div className="quadro-sucesso">
          <div className="quadro-coracao">♡</div>

          <div className="foto-sucesso">
            <img
              src={fotoCasal}
              alt="Gabriel e Karoline"
            />
          </div>

          <p className="sucesso-pequeno">
            COM MUITO CARINHO
          </p>

          <h1>Presença confirmada!</h1>

          <div className="linha-sucesso"></div>

          <p className="mensagem-sucesso">
            Agradecemos de coração pela sua presença
            e pelo carinho com o nosso novo lar.
          </p>

          <p className="mensagem-sucesso">
            Muito obrigado pelo presente e por fazer
            parte desse momento tão especial da nossa
            história.
          </p>

          <p className="deus-abencoe">
            Deus te abençoe!
          </p>

          <p className="assinatura-sucesso">
            Com carinho,
            <br />
            <strong>Gabriel & Karoline</strong>
          </p>

          <button
            className="botao-voltar"
            onClick={() => setConfirmado(false)}
          >
            Voltar para o início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina">
      <section className="hero">
        <div className="foto-wrapper">
          <img
            src={fotoCasal}
            alt="Gabriel e Karoline"
            className="foto-casal"
          />
        </div>

        <div className="coracao-topo">♡</div>

        <h1>Gabriel & Karoline</h1>

        <p className="subtitulo">Chá de Panela</p>

        <p className="descricao">
          Estamos preparando nosso novo lar
          com muito carinho e queremos dividir
          esse momento especial com você.
        </p>

        <p className="descricao-secundaria">
          Sua presença será muito importante
          para nós.
        </p>
      </section>

      <section className="informacoes-evento">
        <div className="info">
          <div className="info-icone">♡</div>

          <div>
            <strong>Data</strong>
            <span>21 de novembro de 2026</span>
          </div>
        </div>

        <div className="separador"></div>

        <div className="info">
          <div className="info-icone">◷</div>

          <div>
            <strong>Horário</strong>
            <span>16h</span>
          </div>
        </div>

        <div className="separador"></div>

        <div className="info">
          <div className="info-icone">⌖</div>

          <div>
            <strong>Local</strong>
            <span>
              Rua Antônio Alves da Silva,
              em frente à ADG Parada Modelo
            </span>
          </div>
        </div>
      </section>

      <section className="confirmacao">
        <div className="ornamento">─── ♡ ───</div>

        <p className="titulo-pequeno">
          CONFIRME SUA PRESENÇA
        </p>

        <h2>
          Você vem celebrar
          <br />
          com a gente?
        </h2>

        <div className="campo">
          <label>Seu nome</label>

          <input
            type="text"
            placeholder="Digite seu nome"
            value={nome}
            onChange={(event) =>
              setNome(event.target.value)
            }
            disabled={salvando}
          />
        </div>

        <div className="campo">
          <label>Você estará presente?</label>

          <div className="opcoes">
            <button
              type="button"
              className={`opcao ${
                presenca === "sim" ? "ativa" : ""
              }`}
              onClick={() => setPresenca("sim")}
              disabled={salvando}
            >
              <span className="radio">
                {presenca === "sim" ? "✓" : ""}
              </span>

              Sim, estarei presente!
            </button>

            <button
              type="button"
              className={`opcao ${
                presenca === "nao" ? "ativa" : ""
              }`}
              onClick={() => {
                setPresenca("nao");
                setPresenteSelecionado(null);
              }}
              disabled={salvando}
            >
              <span className="radio">
                {presenca === "nao" ? "✓" : ""}
              </span>

              Infelizmente não poderei ir.
            </button>
          </div>
        </div>
      </section>

      {presenca === "sim" && (
        <section className="lista-section">
          <div className="lista-cabecalho">
            <p className="titulo-pequeno">
              COM CARINHO
            </p>

            <h2>Lista de presentes</h2>

            {!categoriaSelecionada ? (
              <>
                <p>
                  Escolha uma categoria para
                  encontrar um presente para o
                  nosso novo lar.
                </p>

                <div className="aviso-cores">
                  <div className="aviso-cores-titulo">
                    ♡ Cores de preferência
                  </div>

                  <p>
                    Para os produtos da nossa lista,
                    nossas cores preferidas são:
                    <strong>
                      {" "}
                      inox, preto, branco e
                      azul-marinho.
                    </strong>
                  </p>

                  <span>
                    Caso o item tenha outras opções
                    de cores, pedimos, se possível,
                    que escolha uma dessas.
                  </span>
                </div>
              </>
            ) : (
              <>
                <button
                  className="botao-voltar-categorias"
                  onClick={voltarCategorias}
                >
                  ← Voltar para categorias
                </button>

                <p>
                  Escolha um presente da categoria{" "}
                  <strong>
                    {categoriaSelecionada}
                  </strong>.
                </p>
              </>
            )}
          </div>

          {carregando ? (
            <p className="texto-secao">
              Carregando presentes...
            </p>
          ) : !categoriaSelecionada ? (
            <div className="grid-categorias">
              {categorias.map((categoria) => (
                <button
                  key={categoria.nome}
                  className="card-categoria"
                  onClick={() =>
                    escolherCategoria(
                      categoria.nome
                    )
                  }
                >
                  <div className="icone-categoria">
                    {categoria.icone}
                  </div>

                  <h3>{categoria.nome}</h3>

                  <span>
                    Ver presentes
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid-presentes">
              {presentesDaCategoria.length === 0 ? (
                <p className="texto-secao">
                  Nenhum presente encontrado
                  nesta categoria.
                </p>
              ) : (
                presentesDaCategoria.map(
                  (presente) => {
                    const esgotado =
                      Number(
                        presente.stock ?? 0
                      ) <= 0;

                    return (
                      <button
                        key={presente.id}
                        className={`card-presente ${
                          presenteSelecionado ===
                          presente.id
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
                          esgotado || salvando
                        }
                      >
                        <div className="icone-presente">
                          ♡
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
                )
              )}
            </div>
          )}

          {categoriaSelecionada &&
            presenteSelecionado && (
              <div className="confirmacao-final">
                <p className="presente-escolhido-texto">
                  Você escolheu:{" "}
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

                <p className="aviso-presente">
                  Ao confirmar, esse presente
                  será reservado para você.
                </p>

                <button
                  className="botao-presentes"
                  onClick={confirmarTudo}
                  disabled={salvando}
                >
                  {salvando
                    ? "Confirmando..."
                    : "Confirmar presença e presente"}
                </button>
              </div>
            )}
        </section>
      )}

      <section className="final">
        <div className="foto-final">
          <img
            src={fotoCasal}
            alt="Gabriel e Karoline"
          />
        </div>

        <div className="coracao-final">♡</div>

        <h2>Esperamos você!</h2>

        <p>
          Será uma alegria ter você conosco
          nesse momento tão especial.
        </p>

        <span>
          Com carinho, Gabriel & Karoline
        </span>
      </section>
    </div>
  );
}

export default App;