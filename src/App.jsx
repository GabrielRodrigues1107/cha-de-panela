import { useState } from "react";
import "./App.css";

import fotoCasal from "./assets/foto-casal.jpg";

function App() {

  // Nome digitado pelo convidado
  const [nome, setNome] = useState("");

  // Resposta da presença
  const [presenca, setPresenca] = useState("");

  // Presente selecionado
  const [presenteSelecionado, setPresenteSelecionado] = useState("");


  // Lista de presentes
  const presentes = [
    {
      nome: "Jogo de copos",
      icone: "🥂"
    },

    {
      nome: "Liquidificador",
      icone: "♨"
    },

    {
      nome: "Frigideira",
      icone: "🍳"
    },

    {
      nome: "Jogo de panelas",
      icone: "🍲"
    },

    {
      nome: "Panela de pressão",
      icone: "♨"
    },

    {
      nome: "Jogo de pratos",
      icone: "◯"
    },

    {
      nome: "Talheres",
      icone: "🍴"
    },

    {
      nome: "Escorredor de louça",
      icone: "▦"
    },

    {
      nome: "Potes de plástico",
      icone: "▣"
    }
  ];


  // Função chamada quando clicar em continuar
  function continuar() {

    if (nome.trim() === "") {
      alert("Digite seu nome.");
      return;
    }

    if (presenca === "") {
      alert("Informe se você estará presente.");
      return;
    }

    if (presenca === "nao") {

      alert(
        `Obrigado pela resposta, ${nome}! ❤️`
      );

      return;
    }

    if (presenteSelecionado === "") {

      alert(
        "Escolha um presente da nossa lista."
      );

      return;
    }

    alert(
      `Obrigado, ${nome}! Sua presença foi registrada. ❤️`
    );
  }


  return (

    <div className="pagina">


      {/* =====================================
          HERO
      ====================================== */}

      <section className="hero">


        {/* FOTO */}

        <div className="foto-wrapper">

          <img
            src={fotoCasal}
            alt="Gabriel e Karoline"
            className="foto-casal"
          />

        </div>


        {/* PEQUENO CORAÇÃO */}

        <div className="coracao-topo">
          ♡
        </div>


        {/* NOMES */}

        <h1>
          Gabriel & Karoline
        </h1>


        {/* SUBTÍTULO */}

        <div className="subtitulo">
          CHÁ DE PANELA
        </div>


        {/* DESCRIÇÃO */}

        <p className="descricao">

          Estamos muito felizes em compartilhar
          esse momento especial com você.

        </p>


        <p className="descricao-secundaria">

          Confirme sua presença e escolha um presente
          da nossa lista. ♡

        </p>


        {/* INFORMAÇÕES DO EVENTO */}

        <div className="informacoes-evento">


          <div className="info">

            <span className="info-icone">
              ♡
            </span>

            <strong>
              14 de Novembro
            </strong>

            <span>
              de 2026
            </span>

          </div>


          <div className="separador"></div>


          <div className="info">

            <span className="info-icone">
              ◷
            </span>

            <strong>
              16h00
            </strong>

            <span>
              horas
            </span>

          </div>


          <div className="separador"></div>


          <div className="info">

            <span className="info-icone">
              ♧
            </span>

            <strong>
              Rua Lahud Tannuri
            </strong>

            <span>
              339
            </span>

          </div>


        </div>

      </section>



      {/* =====================================
          CONFIRMAÇÃO
      ====================================== */}

      <section className="confirmacao">


        <div className="ornamento">
          ♡
        </div>


        <span className="titulo-pequeno">
          RSVP
        </span>


        <h2>
          Confirme sua presença
        </h2>


        <p className="texto-secao">

          Digite seu nome e informe se você
          estará conosco nesse dia.

        </p>


        {/* NOME */}

        <div className="campo">

          <label>
            Seu nome completo
          </label>

          <input
            type="text"
            placeholder="Digite seu nome"
            value={nome}
            onChange={(evento) =>
              setNome(evento.target.value)
            }
          />

        </div>


        {/* PRESENÇA */}

        <div className="campo">

          <label>
            Você estará presente?
          </label>


          <div className="opcoes">


            <button
              className={
                presenca === "sim"
                  ? "opcao ativa"
                  : "opcao"
              }

              onClick={() =>
                setPresenca("sim")
              }
            >

              <span className="radio">
                {presenca === "sim" ? "●" : "○"}
              </span>

              Sim, vou!

            </button>


            <button
              className={
                presenca === "nao"
                  ? "opcao ativa"
                  : "opcao"
              }

              onClick={() =>
                setPresenca("nao")
              }
            >

              <span className="radio">
                {presenca === "nao" ? "●" : "○"}
              </span>

              Não poderei ir

            </button>


          </div>

        </div>


        {/* CONTINUAR */}

        <button
          className="botao"
          onClick={continuar}
        >

          Continuar

          <span>
            →
          </span>

        </button>


      </section>



      {/* =====================================
          LISTA DE PRESENTES
      ====================================== */}

      <section className="lista-section">


        <div className="lista-cabecalho">

          <span className="titulo-pequeno">
            COM CARINHO
          </span>


          <h2>
            Escolha um presente
          </h2>


          <p>
            Se quiser nos presentear, escolha
            um item da nossa lista. ♡
          </p>

        </div>


        {/* PROGRESSO */}

        <div className="progresso">

          <div className="progresso-texto">

            <span>
              0 de {presentes.length} presentes escolhidos
            </span>

          </div>


          <div className="barra">

            <div className="barra-preenchida"></div>

          </div>

        </div>


        {/* CARDS */}

        <div className="grid-presentes">


          {presentes.map((presente, index) => (

            <div
              className={
                presenteSelecionado === presente.nome
                  ? "card-presente selecionado"
                  : "card-presente"
              }

              key={index}

              onClick={() =>
                setPresenteSelecionado(presente.nome)
              }
            >


              <div className="icone-presente">

                {presente.icone}

              </div>


              <h3>
                {presente.nome}
              </h3>


              <div className="status">

                <span className="bolinha">
                  {presenteSelecionado === presente.nome
                    ? "✓"
                    : "○"}
                </span>

                Disponível

              </div>


            </div>

          ))}


        </div>


        {/* BOTÃO */}

        <button
          className="botao-presentes"
          onClick={continuar}
        >

          Confirmar presença e presente

          <span>
            →
          </span>

        </button>


      </section>



      {/* =====================================
          FINAL
      ====================================== */}

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
          Juntos na cozinha
        </h2>


        <p>
          e em todos os momentos!
        </p>


        <span>
          Gabriel & Karoline
        </span>


      </section>


    </div>

  );
}

export default App;