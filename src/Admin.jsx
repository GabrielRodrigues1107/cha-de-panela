import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./Admin.css";

function Admin() {
  const [convidados, setConvidados] = useState([]);
  const [presentes, setPresentes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [busca, setBusca] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [novoNome, setNovoNome] = useState("");

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    verificarUsuario();
  }, []);

  async function verificarUsuario() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/admin";
      return;
    }

    setUsuario(user);

    carregarDados();
  }

  async function carregarDados() {
    setCarregando(true);

    try {
      // ==============================
      // CARREGAR CONVIDADOS
      // ==============================

      const {
        data: convidadosData,
        error: convidadosError,
      } = await supabase
        .from("guests")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (convidadosError) {
        console.error(
          "Erro ao carregar convidados:",
          convidadosError
        );

        alert(
          "Não foi possível carregar os convidados."
        );

        setConvidados([]);
        return;
      }

      // ==============================
      // CARREGAR PRESENTES
      // ==============================

      const {
        data: presentesData,
        error: presentesError,
      } = await supabase
        .from("gifts")
        .select("*")
        .order("id", {
          ascending: true,
        });

      if (presentesError) {
        console.error(
          "Erro ao carregar presentes:",
          presentesError
        );

        alert(
          "Não foi possível carregar os presentes."
        );

        setPresentes([]);
        return;
      }

      // ==============================
      // RELACIONAR CONVIDADO + PRESENTE
      // ==============================

      const convidadosComPresentes =
        (convidadosData || []).map(
          (convidado) => {
            const presente = (
              presentesData || []
            ).find(
              (item) =>
                item.id === convidado.gift_id
            );

            return {
              ...convidado,
              presente: presente || null,
            };
          }
        );

      setConvidados(
        convidadosComPresentes
      );

      setPresentes(
        presentesData || []
      );
    } catch (error) {
      console.error(
        "Erro inesperado:",
        error
      );

      alert(
        "Ocorreu um erro ao carregar o painel."
      );
    } finally {
      setCarregando(false);
    }
  }

  // ==============================
  // REMOVER CONVIDADO
  // ==============================

  async function removerConvidado(id) {
    const convidado =
      convidados.find(
        (item) => item.id === id
      );

    const confirmar = window.confirm(
      `Tem certeza que deseja remover ${
        convidado?.name || "este convidado"
      }?\n\nSe ele tiver escolhido um presente, uma unidade voltará para o estoque.`
    );

    if (!confirmar) {
      return;
    }

    try {
      setCarregando(true);

      const { error } =
        await supabase.rpc(
          "remover_convidado",
          {
            p_guest_id: id,
          }
        );

      if (error) {
        console.error(
          "Erro ao remover convidado:",
          error
        );

        alert(
          error.message ||
            "Não foi possível remover o convidado."
        );

        return;
      }

      alert(
        "Convidado removido e estoque atualizado! 💙"
      );

      await carregarDados();
    } catch (error) {
      console.error(
        "Erro inesperado ao remover:",
        error
      );

      alert(
        "Ocorreu um erro ao remover o convidado."
      );
    } finally {
      setCarregando(false);
    }
  }

  // ==============================
  // EDITAR NOME
  // ==============================

  function iniciarEdicao(convidado) {
    setEditandoId(convidado.id);
    setNovoNome(convidado.name);
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setNovoNome("");
  }

  async function salvarNome(id) {
    if (!novoNome.trim()) {
      alert("Digite um nome.");
      return;
    }

    try {
      const { error } = await supabase
        .from("guests")
        .update({
          name: novoNome.trim(),
        })
        .eq("id", id);

      if (error) {
        console.error(
          "Erro ao editar nome:",
          error
        );

        alert(
          error.message ||
            "Não foi possível editar o nome."
        );

        return;
      }

      alert(
        "Nome atualizado com sucesso! 💙"
      );

      cancelarEdicao();

      await carregarDados();
    } catch (error) {
      console.error(
        "Erro inesperado ao editar:",
        error
      );

      alert(
        "Ocorreu um erro ao editar o nome."
      );
    }
  }

  // ==============================
  // SAIR
  // ==============================

  async function sair() {
    const confirmar = window.confirm(
      "Deseja sair do painel?"
    );

    if (!confirmar) {
      return;
    }

    await supabase.auth.signOut();

    window.location.href = "/admin";
  }

  // ==============================
  // FILTRO
  // ==============================

  const convidadosFiltrados =
    convidados.filter((convidado) => {
      const texto =
        busca.toLowerCase().trim();

      if (!texto) {
        return true;
      }

      const nome =
        convidado.name
          ?.toLowerCase() || "";

      const presente =
        convidado.presente?.name
          ?.toLowerCase() || "";

      return (
        nome.includes(texto) ||
        presente.includes(texto)
      );
    });

  // ==============================
  // RESUMO
  // ==============================

  const total = convidados.length;

  const confirmados =
    convidados.filter(
      (convidado) =>
        convidado.attendance === true
    ).length;

  const naoConfirmados =
    convidados.filter(
      (convidado) =>
        convidado.attendance === false
    ).length;

  // ==============================
  // FORMATAR DATA
  // ==============================

  function formatarData(data) {
    if (!data) {
      return "-";
    }

    return new Date(data).toLocaleString(
      "pt-BR",
      {
        dateStyle: "short",
        timeStyle: "short",
      }
    );
  }

  // ==============================
  // ESTOQUE ATUAL
  // ==============================

  function quantidadeDisponivel(presente) {
    return Math.max(
      0,
      Number(presente.stock ?? 0)
    );
  }

  // ==============================
  // QUANTIDADE RESERVADA
  //
  // AGORA O CÁLCULO É:
  //
  // ESTOQUE INICIAL - ESTOQUE ATUAL
  //
  // Exemplo:
  // 5 - 3 = 2 reservados
  // ==============================

  function quantidadeReservada(presente) {
    const estoqueInicial =
      Number(
        presente.initial_stock ??
          presente.stock ??
          0
      );

    const estoqueAtual =
      Number(
        presente.stock ?? 0
      );

    return Math.max(
      0,
      estoqueInicial - estoqueAtual
    );
  }

  // ==============================
  // VERIFICAR USUÁRIO
  // ==============================

  if (!usuario) {
    return (
      <div className="pagina-admin">
        <div className="admin-carregando">
          Verificando acesso...
        </div>
      </div>
    );
  }

  return (
    <div className="pagina-admin">

      {/* ==============================
          CABEÇALHO
      ============================== */}

      <header className="admin-header">
        <div>
          <p className="admin-pequeno">
            Área exclusiva
          </p>

          <h1>
            Gabriel & Karoline
          </h1>
        </div>

        <button
          className="botao-sair"
          onClick={sair}
        >
          Sair
        </button>
      </header>

      <main className="admin-conteudo">

        {/* ==============================
            TÍTULO
        ============================== */}

        <div className="admin-titulo">
          <div>
            <h2>
              Lista de convidados
            </h2>

            <p>
              Gerencie as confirmações e
              presentes escolhidos.
            </p>
          </div>

          <button
            className="botao-atualizar"
            onClick={carregarDados}
            disabled={carregando}
          >
            {carregando
              ? "Atualizando..."
              : "↻ Atualizar"}
          </button>
        </div>

        {/* ==============================
            RESUMO
        ============================== */}

        <div className="admin-resumo">

          <div className="resumo-card">
            <span>
              Total
            </span>

            <strong>
              {total}
            </strong>
          </div>

          <div className="resumo-card">
            <span>
              Confirmados
            </span>

            <strong>
              {confirmados}
            </strong>
          </div>

          <div className="resumo-card">
            <span>
              Não confirmados
            </span>

            <strong>
              {naoConfirmados}
            </strong>
          </div>

        </div>

        {/* ==============================
            PESQUISA
        ============================== */}

        <div className="admin-filtros">
          <input
            type="text"
            placeholder="Pesquisar convidado ou presente..."
            value={busca}
            onChange={(event) =>
              setBusca(
                event.target.value
              )
            }
          />
        </div>

        {/* ==============================
            TABELA DE CONVIDADOS
        ============================== */}

        <div className="tabela-container">

          {carregando ? (
            <div className="admin-carregando">
              Carregando convidados...
            </div>
          ) : convidadosFiltrados.length === 0 ? (
            <div className="admin-vazio">
              {busca
                ? "Nenhum convidado encontrado."
                : "Nenhum convidado cadastrado ainda."}
            </div>
          ) : (
            <table>

              <thead>
                <tr>

                  <th>
                    Convidado
                  </th>

                  <th>
                    Presença
                  </th>

                  <th>
                    Presente
                  </th>

                  <th>
                    Data
                  </th>

                  <th>
                    Ações
                  </th>

                </tr>
              </thead>

              <tbody>

                {convidadosFiltrados.map(
                  (convidado) => (

                    <tr
                      key={
                        convidado.id
                      }
                    >

                      {/* NOME */}

                      <td>

                        {editandoId ===
                        convidado.id ? (

                          <div className="editar-nome">

                            <input
                              type="text"
                              value={
                                novoNome
                              }
                              onChange={(
                                event
                              ) =>
                                setNovoNome(
                                  event
                                    .target
                                    .value
                                )
                              }
                              autoFocus
                            />

                            <button
                              onClick={() =>
                                salvarNome(
                                  convidado.id
                                )
                              }
                              className="botao-editar"
                            >
                              Salvar
                            </button>

                            <button
                              onClick={
                                cancelarEdicao
                              }
                              className="botao-remover"
                            >
                              Cancelar
                            </button>

                          </div>

                        ) : (

                          <strong>
                            {
                              convidado.name
                            }
                          </strong>

                        )}

                      </td>

                      {/* PRESENÇA */}

                      <td>

                        {convidado.attendance ? (

                          <span className="status-confirmado">
                            ✓ Confirmado
                          </span>

                        ) : (

                          <span className="status-nao">
                            ✕ Não comparecerá
                          </span>

                        )}

                      </td>

                      {/* PRESENTE */}

                      <td>

                        {convidado.presente ? (

                          <div className="presente-admin">

                            <span>
                              ♡
                            </span>

                            {
                              convidado
                                .presente
                                .name
                            }

                          </div>

                        ) : (

                          <span className="sem-presente">
                            Nenhum presente
                          </span>

                        )}

                      </td>

                      {/* DATA */}

                      <td>
                        {formatarData(
                          convidado.created_at
                        )}
                      </td>

                      {/* AÇÕES */}

                      <td>

                        <div className="acoes">

                          {editandoId !==
                            convidado.id && (

                            <button
                              className="botao-editar"
                              onClick={() =>
                                iniciarEdicao(
                                  convidado
                                )
                              }
                            >
                              Editar
                            </button>

                          )}

                          <button
                            className="botao-remover"
                            onClick={() =>
                              removerConvidado(
                                convidado.id
                              )
                            }
                            disabled={
                              carregando
                            }
                          >
                            Remover
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>
          )}

        </div>

        {/* ==============================
            ESTOQUE DE PRESENTES
        ============================== */}

        <section className="estoque-admin">

          <div className="admin-titulo">

            <div>

              <h2>
                Estoque de presentes
              </h2>

              <p>
                Acompanhe as unidades disponíveis
                de cada presente.
              </p>

            </div>

          </div>

          <div className="tabela-container">

            {presentes.length === 0 ? (

              <div className="admin-vazio">
                Nenhum presente cadastrado.
              </div>

            ) : (

              <table>

                <thead>

                  <tr>

                    <th>
                      Presente
                    </th>

                    <th>
                      Estoque total
                    </th>

                    <th>
                      Reservados
                    </th>

                    <th>
                      Disponíveis
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {presentes.map(
                    (presente) => {

                      const estoqueInicial =
                        Number(
                          presente.initial_stock ??
                            presente.stock ??
                            0
                        );

                      const reservados =
                        quantidadeReservada(
                          presente
                        );

                      const disponiveis =
                        quantidadeDisponivel(
                          presente
                        );

                      return (

                        <tr
                          key={
                            presente.id
                          }
                        >

                          {/* PRESENTE */}

                          <td>

                            <div className="presente-admin">

                              <span>
                                ♡
                              </span>

                              {
                                presente.name
                              }

                            </div>

                          </td>

                          {/* ESTOQUE TOTAL */}

                          <td>
                            {
                              estoqueInicial
                            }
                          </td>

                          {/* RESERVADOS */}

                          <td>
                            {
                              reservados
                            }
                          </td>

                          {/* DISPONÍVEIS */}

                          <td>

                            {disponiveis ===
                            0 ? (

                              <span className="status-nao">
                                ✕ ESGOTADO
                              </span>

                            ) : (

                              <span className="status-confirmado">

                                {
                                  disponiveis
                                }{" "}

                                {
                                  disponiveis ===
                                  1
                                    ? "disponível"
                                    : "disponíveis"
                                }

                              </span>

                            )}

                          </td>

                        </tr>

                      );
                    }
                  )}

                </tbody>

              </table>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Admin;