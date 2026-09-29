import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import fotoCasal from "./assets/foto-casal.jpg";
import "./App.css";

function App() {
  const [nome, setNome] = useState("");
  const [presenca, setPresenca] = useState("");

  const [presentes, setPresentes] = useState([]);
  const [presentesSelecionados, setPresentesSelecionados] =
    useState([]);

  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState(null);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [confirmado, setConfirmado] = useState(false);

  useEffect(() => {
    carregarPresentes();
  }, []);

  // =========================================================
  // CARREGAR PRESENTES
  // =========================================================

  async function carregarPresentes() {
    setCarregando(true);

    const { data, error } = await supabase
      .from("gifts")
      .select("*")
      .eq("ativo", true)
      .order("id", { ascending: true });

    if (error) {
      console.error(
        "Erro ao carregar presentes:",
        error
      );

      alert(
        "Não foi possível carregar a lista de presentes."
      );

      setCarregando(false);
      return;
    }

    setPresentes(data || []);
    setCarregando(false);
  }

  // =========================================================
  // SELECIONAR OU DESSELECIONAR PRESENTE
  // =========================================================

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
        "Confirme que você estará presente antes de escolher um presente."
      );

      return;
    }

    if (Number(presente.stock ?? 0) <= 0) {
      return;
    }

    const jaSelecionado =
      presentesSelecionados.includes(
        presente.id
      );

    // Se já estiver selecionado,
    // remove da seleção.
    if (jaSelecionado) {
      setPresentesSelecionados(
        presentesSelecionados.filter(
          (id) => id !== presente.id
        )
      );

      return;
    }

    // Adiciona o presente à seleção.
    setPresentesSelecionados([
      ...presentesSelecionados,
      presente.id,
    ]);
  }

  // =========================================================
  // ESCOLHER CATEGORIA
  // =========================================================

  function escolherCategoria(categoria) {
    setCategoriaSelecionada(categoria);
  }

  // =========================================================
  // VOLTAR PARA CATEGORIAS
  // =========================================================

  function voltarCategorias() {
    setCategoriaSelecionada(null);
  }

  // =========================================================
  // CONFIRMAR PRESENÇA E PRESENTES
  // =========================================================

  async function confirmarTudo() {
    if (!nome.trim()) {
      alert("Digite seu nome.");
      return;
    }

    if (presenca !== "sim") {
      alert("Confirme sua presença.");
      return;
    }

    if (presentesSelecionados.length === 0) {
      alert("Escolha pelo menos um presente.");
      return;
    }

    // Verifica se algum presente ficou esgotado
    // enquanto a pessoa estava escolhendo.
    const presentesEscolhidos =
      presentes.filter((presente) =>
        presentesSelecionados.includes(
          presente.id
        )
      );

    const algumEsgotado =
      presentesEscolhidos.some(
        (presente) =>
          Number(presente.stock ?? 0) <= 0
      );

    if (algumEsgotado) {
      alert(
        "Um dos presentes escolhidos acabou de ser reservado por outra pessoa. Atualize a página e tente novamente."
      );

      await carregarPresentes();

      setPresentesSelecionados([]);

      return;
    }

    setSalvando(true);

    // Chama a função do Supabase
    // que reserva todos os presentes escolhidos.
    const { error } = await supabase.rpc(
      "reservar_presentes",
      {
        p_gift_ids:
          presentesSelecionados,

        p_guest_name:
          nome.trim(),
      }
    );

    if (error) {
      console.error(
        "Erro ao confirmar:",
        error
      );

      alert(
        error.message ||
          "Não foi possível confirmar. Tente novamente."
      );

      setSalvando(false);

      await carregarPresentes();

      return;
    }

    // Confirmação realizada com sucesso.
    setSalvando(false);
    setConfirmado(true);

    setNome("");
    setPresenca("");
    setPresentesSelecionados([]);
    setCategoriaSelecionada(null);

    await carregarPresentes();
  }

  // =========================================================
  // TEXTO DE QUANTIDADE
  // =========================================================

  function quantidadeTexto(presente) {
    const estoque = Number(
      presente.stock ?? 0
    );

    if (estoque <= 0) {
      return "Esgotado";
    }

    if (estoque === 1) {
      return "1 disponível";
    }

    return `${estoque} disponíveis`;
  }

  // =========================================================
  // CATEGORIAS
  // =========================================================

  const categorias = [
    {
      nome: "Quarto",
      icone: "🛏️",
    },
    {
      nome: "Cozinha",
      icone: "🍳",
    },
    {
      nome: "Banheiro",
      icone: "🛁",
    },
    {
      nome: "Sala",
      icone: "🛋️",
    },
    {
      nome: "Área de limpeza",
      icone: "🧹",
    },
  ];

  // =========================================================
  // PRESENTES DA CATEGORIA SELECIONADA
  // =========================================================

  const presentesDaCategoria =
    presentes.filter(
      (presente) =>
        presente.category ===
        categoriaSelecionada
    );

  // =========================================================
  // TELA DE CONFIRMAÇÃO
  // =========================================================

  if (confirmado) {
    return (
      <div className="pagina confirmacao-sucesso">
        <div className="quadro-sucesso">

          <div className="quadro-coracao">
            ♡
          </div>

          <div className="foto-sucesso">
            <img
              src={fotoCasal}
              alt="Gabriel e Karoline"
            />
          </div>

          <p className="sucesso-pequeno">
            COM MUITO CARINHO
          </p>

          <h1>
            Presença confirmada!
          </h1>

          <div className="linha-sucesso"></div>

          <p className="mensagem-sucesso">
            Agradecemos de coração pela sua presença
            e pelo carinho com o nosso novo lar.
          </p>

          <p className="mensagem-sucesso">
            Muito obrigado pelos presentes e por fazer
            parte desse momento tão especial da nossa
            história.
          </p>

          <p className="deus-abencoe">
            Deus te abençoe!
          </p>

          <p className="assinatura-sucesso">
            Com carinho,
            <br />
            <strong>
              Gabriel & Karoline
            </strong>
          </p>

          <button
            className="botao-voltar"
            onClick={() =>
              setConfirmado(false)
            }
          >
            Voltar para o início
          </button>

        </div>
      </div>
    );
  }

  // =========================================================
  // PÁGINA PRINCIPAL
  // =========================================================

  return (
    <div className="pagina">

      {/* =====================================================
          HERO
      ====================================================== */}

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
          Estamos preparando nosso novo lar
          com muito carinho e queremos dividir
          esse momento especial com você.
        </p>

        <p className="descricao-secundaria">
          Sua presença será muito importante
          para nós.
        </p>

      </section>

      {/* =====================================================
          INFORMAÇÕES DO EVENTO
      ====================================================== */}

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
              Rua Alcindo José Ferreira, nº 250,
              em frente à ADG Parada Modelo
            </span>
          </div>

        </div>

      </section>

      {/* =====================================================
          CONFIRMAÇÃO DE PRESENÇA
      ====================================================== */}

      <section className="confirmacao">

        <div className="ornamento">
          ─── ♡ ───
        </div>

        <p className="titulo-pequeno">
          CONFIRME SUA PRESENÇA
        </p>

        <h2>
          Você vem celebrar
          <br />
          com a gente?
        </h2>

        {/* NOME */}

        <div className="campo">

          <label>
            Seu nome
          </label>

          <input
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
            Você estará presente?
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

              Sim, estarei presente!

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

                setPresentesSelecionados(
                  []
                );

                setCategoriaSelecionada(
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

              Infelizmente não poderei ir.

            </button>

          </div>

        </div>

      </section>

      {/* =====================================================
          LISTA DE PRESENTES
      ====================================================== */}

      {presenca === "sim" && (

        <section className="lista-section">

          <div className="lista-cabecalho">

            <p className="titulo-pequeno">
              COM CARINHO
            </p>

            <h2>
              Lista de presentes
            </h2>

            {/* =================================================
                TELA DE CATEGORIAS
            ================================================== */}

            {!categoriaSelecionada ? (

              <>

                <p>
                  Escolha uma categoria para
                  encontrar um presente para o
                  nosso novo lar.
                </p>

                {/* AVISO DE MÚLTIPLOS PRESENTES */}

                <div className="aviso-multiplos">

                  <div className="aviso-multiplos-titulo">
                    ♡ Você pode escolher mais de um presente!
                  </div>

                  <p>
                    Fique à vontade para escolher
                    quantos presentes desejar.
                  </p>

                  <span>
                    Basta clicar nos presentes que deseja
                    e quando terminar confirme sua seleção.
                  </span>

                </div>

                {/* AVISO DE CORES */}

                <div className="aviso-cores">

                  <div className="aviso-cores-titulo">
                    ♡ Cores de preferência
                  </div>

                  <p>
                    Para os produtos da nossa lista,
                    nossas cores preferidas são:
                    <strong>
                      {" "}inox, preto, branco e
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

              /* =================================================
                 TELA DE UMA CATEGORIA
              ================================================== */

              <>

                <button
                  className="botao-voltar-categorias"
                  onClick={
                    voltarCategorias
                  }
                  disabled={salvando}
                >
                  ← Voltar para categorias
                </button>

                <p>
                  Escolha quantos presentes desejar
                  da categoria{" "}
                  <strong>
                    {categoriaSelecionada}
                  </strong>.
                </p>

              </>

            )}

          </div>

          {/* ===================================================
              CARREGAMENTO
          ==================================================== */}

          {carregando ? (

            <p className="texto-secao">
              Carregando presentes...
            </p>

          ) : !categoriaSelecionada ? (

            /* =================================================
               CATEGORIAS
            ================================================== */

            <div className="grid-categorias">

              {categorias.map(
                (categoria) => (

                  <button
                    key={categoria.nome}
                    className="card-categoria"
                    onClick={() =>
                      escolherCategoria(
                        categoria.nome
                      )
                    }
                    disabled={salvando}
                  >

                    <div className="icone-categoria">
                      {categoria.icone}
                    </div>

                    <h3>
                      {categoria.nome}
                    </h3>

                    <span>
                      Ver presentes
                    </span>

                  </button>

                )
              )}

            </div>

          ) : (

            /* =================================================
               PRESENTES
            ================================================== */

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

                    const selecionado =
                      presentesSelecionados.includes(
                        presente.id
                      );

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

                          {esgotado
                            ? "Esgotado"
                            : selecionado
                            ? "Selecionado"
                            : quantidadeTexto(
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

          {/* ===================================================
              RESUMO DOS PRESENTES SELECIONADOS
          ==================================================== */}

          {presentesSelecionados.length > 0 && (

            <div className="resumo-selecao">

              <div className="contador-selecionados">

                <span>
                  🎁
                </span>

                <strong>

                  {presentesSelecionados.length}{" "}

                  {presentesSelecionados.length === 1
                    ? "presente selecionado"
                    : "presentes selecionados"}

                </strong>

              </div>

              <div className="lista-selecionados">

                {presentesSelecionados.map(
                  (id) => {

                    const presente =
                      presentes.find(
                        (item) =>
                          item.id === id
                      );

                    if (!presente) {
                      return null;
                    }

                    return (

                      <span
                        key={id}
                        className="item-selecionado"
                      >

                        ✓ {presente.name}

                      </span>

                    );
                  }
                )}

              </div>

            </div>

          )}

          {/* ===================================================
              CONFIRMAÇÃO FINAL
          ==================================================== */}

          {presentesSelecionados.length > 0 && (

            <div className="confirmacao-final">

              <p className="presente-escolhido-texto">

                ✓ Você selecionou{" "}

                <strong>
                  {presentesSelecionados.length}
                </strong>{" "}

                {presentesSelecionados.length === 1
                  ? "presente"
                  : "presentes"}.

              </p>

              <p className="aviso-presente">

                Você pode continuar escolhendo
                presentes ou confirmar agora.

              </p>

              <button
                className="botao-presentes"
                onClick={confirmarTudo}
                disabled={salvando}
              >

                {salvando
                  ? "Confirmando..."
                  : "Confirmar presença e presentes"}

              </button>

            </div>

          )}

        </section>

      )}

      {/* =====================================================
          FINAL DA PÁGINA
      ====================================================== */}

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