"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Check,
  ChevronRight,
  Clock3,
  Lightbulb,
  LoaderCircle,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type ProfileKey = "gestao" | "comunicacao" | "criatividade" | "tecnologia" | "analise";
type Stage = "intro" | "lead" | "quiz" | "loading" | "result";

type Answer = { text: string; profile: ProfileKey };
type Question = { title: string; answers: Answer[] };

const SHEETS_ENDPOINT = process.env.NEXT_PUBLIC_SHEETS_ENDPOINT
  ?? "https://script.google.com/macros/s/AKfycbxkXTJiFgV0TNTeMgkg72bNyt-PPu5pbe9hnwX9QefxJzMaHTFvd9n3IB96kH4euPgvVg/exec";
const WHATSAPP_NUMBER = "559140424250";

const questions: Question[] = [
  {
    title: "Quando você imagina um dia de trabalho ideal, o que mais te anima?",
    answers: [
      { text: "Organizar projetos e fazer tudo acontecer no prazo.", profile: "gestao" },
      { text: "Conversar, orientar e ajudar pessoas.", profile: "comunicacao" },
      { text: "Criar algo original que chame atenção.", profile: "criatividade" },
      { text: "Resolver desafios usando computadores e tecnologia.", profile: "tecnologia" },
      { text: "Analisar informações e encontrar a melhor decisão.", profile: "analise" },
    ],
  },
  {
    title: "Em um projeto em grupo, qual papel surge naturalmente para você?",
    answers: [
      { text: "Transformo ideias em algo visual e interessante.", profile: "criatividade" },
      { text: "Assumo a parte técnica e testo as soluções.", profile: "tecnologia" },
      { text: "Organizo as etapas e distribuo as tarefas.", profile: "gestao" },
      { text: "Apresento o trabalho e conecto o grupo.", profile: "comunicacao" },
      { text: "Confiro dados, detalhes e possíveis erros.", profile: "analise" },
    ],
  },
  {
    title: "Qual conquista faria você sentir mais orgulho?",
    answers: [
      { text: "Ver um cliente satisfeito graças ao meu atendimento.", profile: "comunicacao" },
      { text: "Criar uma campanha, marca ou conteúdo marcante.", profile: "criatividade" },
      { text: "Fazer uma equipe ou empresa funcionar melhor.", profile: "gestao" },
      { text: "Construir ou consertar uma solução tecnológica.", profile: "tecnologia" },
      { text: "Descobrir uma oportunidade que ninguém percebeu.", profile: "analise" },
    ],
  },
  {
    title: "Quando aparece um problema inesperado, qual é sua primeira reação?",
    answers: [
      { text: "Comparo os fatos antes de tomar uma decisão.", profile: "analise" },
      { text: "Testo possibilidades até encontrar o que funciona.", profile: "tecnologia" },
      { text: "Converso com os envolvidos para entender a situação.", profile: "comunicacao" },
      { text: "Crio uma alternativa diferente do caminho óbvio.", profile: "criatividade" },
      { text: "Defino prioridades e monto um plano de ação.", profile: "gestao" },
    ],
  },
  {
    title: "Qual ambiente combina mais com o seu jeito?",
    answers: [
      { text: "Uma empresa dinâmica, com metas e organização.", profile: "gestao" },
      { text: "Um laboratório ou espaço cheio de tecnologia.", profile: "tecnologia" },
      { text: "Um local com pessoas, clientes e movimento.", profile: "comunicacao" },
      { text: "Um estúdio ou equipe que transforma ideias em projetos.", profile: "criatividade" },
      { text: "Um espaço tranquilo para pesquisar e planejar.", profile: "analise" },
    ],
  },
  {
    title: "Se você tivesse uma tarde livre para aprender, escolheria...",
    answers: [
      { text: "Design, edição, redes sociais ou produção de conteúdo.", profile: "criatividade" },
      { text: "Vendas, atendimento ou comportamento das pessoas.", profile: "comunicacao" },
      { text: "Planilhas, indicadores e interpretação de resultados.", profile: "analise" },
      { text: "Programação, manutenção ou inteligência artificial.", profile: "tecnologia" },
      { text: "Liderança, negócios e organização de empresas.", profile: "gestao" },
    ],
  },
  {
    title: "Qual dessas frases mais parece com você?",
    answers: [
      { text: "Gosto de entender como as coisas funcionam.", profile: "tecnologia" },
      { text: "Uma boa conversa pode abrir muitas portas.", profile: "comunicacao" },
      { text: "Com planejamento, qualquer meta fica possível.", profile: "gestao" },
      { text: "Os detalhes e os números contam uma história.", profile: "analise" },
      { text: "Sempre existe um jeito mais criativo de fazer.", profile: "criatividade" },
    ],
  },
  {
    title: "Que tipo de tarefa faz o tempo passar mais rápido para você?",
    answers: [
      { text: "Montar controles, rotinas e listas bem organizadas.", profile: "gestao" },
      { text: "Pesquisar, comparar e tirar conclusões.", profile: "analise" },
      { text: "Atender, explicar ou negociar com alguém.", profile: "comunicacao" },
      { text: "Editar imagens, escrever ou criar apresentações.", profile: "criatividade" },
      { text: "Configurar programas, dispositivos ou sistemas.", profile: "tecnologia" },
    ],
  },
  {
    title: "Se você abrisse um pequeno negócio, qual parte cuidaria primeiro?",
    answers: [
      { text: "Do controle financeiro e dos indicadores.", profile: "analise" },
      { text: "Da divulgação e da identidade da marca.", profile: "criatividade" },
      { text: "Da operação, dos processos e da equipe.", profile: "gestao" },
      { text: "Dos clientes, das vendas e das parcerias.", profile: "comunicacao" },
      { text: "Das ferramentas e soluções digitais.", profile: "tecnologia" },
    ],
  },
  {
    title: "O que as pessoas costumam reconhecer em você?",
    answers: [
      { text: "Minha facilidade para aprender ferramentas novas.", profile: "tecnologia" },
      { text: "Minha responsabilidade e senso de organização.", profile: "gestao" },
      { text: "Minha capacidade de perceber padrões e detalhes.", profile: "analise" },
      { text: "Minha imaginação e minhas ideias diferentes.", profile: "criatividade" },
      { text: "Minha simpatia e facilidade para me comunicar.", profile: "comunicacao" },
    ],
  },
  {
    title: "Qual resultado te daria mais satisfação ao fim do dia?",
    answers: [
      { text: "Bater uma meta e conquistar a confiança de um cliente.", profile: "comunicacao" },
      { text: "Entregar um projeto bonito e com personalidade.", profile: "criatividade" },
      { text: "Deixar todas as demandas resolvidas e bem encaminhadas.", profile: "gestao" },
      { text: "Fazer uma solução funcionar perfeitamente.", profile: "tecnologia" },
      { text: "Apresentar dados claros que ajudem alguém a decidir.", profile: "analise" },
    ],
  },
  {
    title: "Pensando no seu futuro, qual oportunidade parece mais interessante?",
    answers: [
      { text: "Crescer em uma empresa e assumir responsabilidades.", profile: "gestao" },
      { text: "Trabalhar com inovação e profissões digitais.", profile: "tecnologia" },
      { text: "Usar informação para melhorar negócios.", profile: "analise" },
      { text: "Transformar ideias em comunicação e conteúdo.", profile: "criatividade" },
      { text: "Construir relações e gerar oportunidades por meio de pessoas.", profile: "comunicacao" },
    ],
  },
];

const profileData: Record<ProfileKey, {
  name: string;
  short: string;
  description: string;
  color: string;
  icon: typeof Target;
  courses: { name: string; description: string }[];
}> = {
  gestao: {
    name: "Gestão & Organização",
    short: "Perfil que transforma planos em resultados",
    description: "Você tem visão prática, responsabilidade e facilidade para organizar pessoas, tarefas e objetivos. Ambientes estruturados, com espaço para crescimento e liderança, tendem a despertar o seu melhor.",
    color: "#0755bd",
    icon: Target,
    courses: [
      { name: "AUXILIAR ADMINISTRATIVO", description: "Rotinas empresariais, atendimento, documentos e organização profissional." },
      { name: "GESTAO EMPRESARIAL + IA", description: "Gestão de negócios aliada a ferramentas de inteligência artificial." },
      { name: "GESTAO DE PROJETOS", description: "Planejamento, execução e acompanhamento de projetos e resultados." },
      { name: "GESTAO DE PESSOAS", description: "Desenvolvimento de equipes, liderança e rotinas de gestão humana." },
      { name: "ROTINAS ADMINISTRATIVAS.", description: "Processos, controles e atividades essenciais do ambiente administrativo." },
      { name: "DOCUMENTOS PROFISSIONAIS", description: "Criação e organização de documentos para o ambiente de trabalho." },
      { name: "PRODUTIVIDADE OFFICE E GOOGLE", description: "Ferramentas digitais para organização, colaboração e produtividade." },
    ],
  },
  comunicacao: {
    name: "Comunicação & Negócios",
    short: "Perfil que conecta pessoas e oportunidades",
    description: "Você se destaca quando pode conversar, orientar, negociar e construir relações. Sua energia cresce em ambientes com pessoas, movimento e metas claras, onde sua comunicação gera resultados reais.",
    color: "#ec101c",
    icon: Users,
    courses: [
      { name: "VENDAS E ATENDIMENTO", description: "Atendimento ao cliente, negociação e desenvolvimento comercial." },
      { name: "COMUNICACAO CORPORATIVA", description: "Comunicação profissional clara para equipes, clientes e empresas." },
      { name: "ATENDIMENTO EM FARMACIA", description: "Atendimento ao público e conhecimentos aplicados à rotina de farmácia." },
      { name: "OPERADOR DE CAIXA", description: "Atendimento, agilidade e segurança nas operações comerciais." },
    ],
  },
  criatividade: {
    name: "Criatividade & Digital",
    short: "Perfil que transforma ideias em impacto",
    description: "Você enxerga possibilidades, valoriza a expressão e gosta de criar algo que tenha personalidade. Comunicação visual, conteúdo e projetos digitais são caminhos naturais para colocar seu talento em movimento.",
    color: "#e99500",
    icon: Lightbulb,
    courses: [
      { name: "MARKETING DIGITAL com IA", description: "Estratégias digitais, conteúdo e uso da IA aplicado ao marketing." },
      { name: "DESIGNE DIGITAL PRO", description: "Criação visual e desenvolvimento de peças para meios digitais." },
      { name: "ANIMACAO 3D", description: "Modelagem, cenários e produção visual tridimensional." },
      { name: "YOUTUBER", description: "Planejamento, produção e comunicação para conteúdo em vídeo." },
    ],
  },
  tecnologia: {
    name: "Tecnologia & Inovação",
    short: "Perfil que encontra soluções para o futuro",
    description: "Você é curioso, lógico e gosta de descobrir como as coisas funcionam. Desafios técnicos despertam sua concentração e a tecnologia oferece um campo amplo para aprender, construir e resolver problemas.",
    color: "#095cc8",
    icon: BrainCircuit,
    courses: [
      { name: "DESENVOLVIMENTO DE SISTEMA", description: "Lógica, planejamento e construção de sistemas digitais." },
      { name: "DESENVOLVIMENTO DE APPS", description: "Criação de aplicativos e soluções para dispositivos móveis." },
      { name: "DESENVOLVIMENTO WEB", description: "Construção de sites e experiências para a internet." },
      { name: "PROGRAMACAO E AUTOMOCAO", description: "Programação aplicada à criação de soluções e automação de tarefas." },
      { name: "Desenvolvedor de Games", description: "Criação de jogos, lógica e desenvolvimento de experiências interativas." },
      { name: "Manutenção de Computadores e Redes e   Infra Estrutura", description: "Diagnóstico de computadores, conectividade e infraestrutura de redes." },
      { name: "MANUTENCAO DE CELULAR", description: "Diagnóstico e manutenção de dispositivos móveis." },
      { name: "AUTOCAD MECÂNICO", description: "Desenho técnico e projetos mecânicos com AutoCAD." },
      { name: "INFORMATICA ESSENCIAL", description: "Fundamentos de informática e uso seguro das ferramentas digitais." },
      { name: "INFORMATICA KIDS - Tecnologia Aplicada", description: "Tecnologia aplicada para alunos de 8 a 12 anos." },
      { name: "INFORMATICA KIDS - Essencial primeiros   Passos", description: "Primeiros passos na informática para alunos de 8 a 12 anos." },
    ],
  },
  analise: {
    name: "Análise & Estratégia",
    short: "Perfil que transforma informação em decisão",
    description: "Você observa detalhes, compara cenários e prefere decidir com base em informações. Seu potencial aparece quando dados, organização e raciocínio se unem para revelar melhorias e novas oportunidades.",
    color: "#0a9b6c",
    icon: BarChart3,
    courses: [
      { name: "POWER B.I & DATA ANALYTICS", description: "Análise de dados, indicadores e visualização de informações." },
      { name: "EXCEL PROFISSIONAL", description: "Planilhas e recursos profissionais para análise e produtividade." },
      { name: "EXCEL AVANCADO", description: "Fórmulas, automações e análises avançadas em planilhas." },
      { name: "IA NA PRATICA PROFISSIONAL", description: "Aplicação profissional da inteligência artificial em tarefas e processos." },
      { name: "I.A NA PRÁTICA", description: "Uso prático da inteligência artificial no dia a dia." },
    ],
  },
};

const encouragement = [
  "Ótimo começo!",
  "Seu perfil já está ganhando forma.",
  "Continue — você está indo muito bem!",
  "Metade do caminho concluída!",
  "Falta pouco para descobrir seu resultado.",
];

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function getScores(answers: ProfileKey[]) {
  const scores: Record<ProfileKey, number> = { gestao: 0, comunicacao: 0, criatividade: 0, tecnologia: 0, analise: 0 };
  answers.forEach((answer) => { scores[answer] += 1; });
  return scores;
}

function TopLogo() {
  return (
    <header className="brand-bar app-brand-bar">
      <Image src="/evolutec-logo.png" alt="Evolutec Educação" width={400} height={100} className="brand-logo" priority />
      <span className="brand-badge"><Sparkles size={14} /> Teste gratuito</span>
    </header>
  );
}

function JourneyCounter() {
  const [target, setTarget] = useState(8709);
  const [displayed, setDisplayed] = useState(0);
  const previousTarget = useRef(0);

  useEffect(() => {
    let active = true;

    async function refreshCounter() {
      try {
        const response = await fetch("/api/counter", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json() as { count?: number };
        if (active && typeof data.count === "number" && data.count >= 8709) {
          setTarget(Math.floor(data.count));
        }
      } catch {
        // O valor-base continua visível caso a consulta fique indisponível.
      }
    }

    void refreshCounter();
    const interval = window.setInterval(refreshCounter, 60_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setDisplayed(target);
      previousTarget.current = target;
      return;
    }

    const startValue = previousTarget.current;
    const distance = target - startValue;
    const duration = startValue === 0 ? 1750 : 850;
    const startedAt = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayed(Math.round(startValue + distance * eased));

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      } else {
        previousTarget.current = target;
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [target]);

  return (
    <div className="journey-counter" aria-label={`${target.toLocaleString("pt-BR")} pessoas já descobriram sua carreira ideal`}>
      <span className="counter-kicker"><Users size={16} /> Você não está sozinho nessa jornada!</span>
      <strong className="counter-value" aria-live="polite">{displayed.toLocaleString("pt-BR")}</strong>
      <span className="counter-caption">pessoas já descobriram sua carreira ideal</span>
    </div>
  );
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("intro");
  const [lead, setLead] = useState({ isStudent: "", name: "", phone: "" });
  const [leadError, setLeadError] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<ProfileKey[]>([]);
  const [resultKey, setResultKey] = useState<ProfileKey>("gestao");

  const scores = useMemo(() => getScores(answers), [answers]);
  const result = profileData[resultKey];

  function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const phoneDigits = lead.phone.replace(/\D/g, "");
    if (!lead.isStudent) {
      setLeadError("Informe se você já é aluno da Evolutec.");
      return;
    }
    if (lead.name.trim().length < 2) {
      setLeadError("Digite seu nome para continuar.");
      return;
    }
    if (phoneDigits.length < 10) {
      setLeadError("Digite um telefone com DDD válido.");
      return;
    }
    setLeadError("");
    setStage("quiz");
  }

  async function sendLead(finalAnswers: ProfileKey[], finalResult: ProfileKey) {
    if (!SHEETS_ENDPOINT) return;
    const data = profileData[finalResult];
    try {
      await fetch(SHEETS_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          nome: lead.name.trim(),
          telefone: lead.phone,
          jaAluno: lead.isStudent,
          curso: data.courses.slice(0, 3).map((course) => course.name).join(" | "),
          cidade: "Teste Vocacional",
          perfil: data.name,
          respostas: finalAnswers.join(","),
          origem: "landing-page-teste-vocacional",
        }),
      });
    } catch {
      // O resultado não é bloqueado se a rede oscilar; o lead pode falar no WhatsApp.
    }
  }

  function selectAnswer(profile: ProfileKey) {
    const nextAnswers = [...answers];
    nextAnswers[questionIndex] = profile;
    setAnswers(nextAnswers);

    if (questionIndex < questions.length - 1) {
      window.setTimeout(() => setQuestionIndex((current) => current + 1), 180);
      return;
    }

    const finalScores = getScores(nextAnswers);
    const ranked = (Object.entries(finalScores) as [ProfileKey, number][]).sort((a, b) => b[1] - a[1]);
    const finalResult = ranked[0][0];
    setResultKey(finalResult);
    setStage("loading");
    void sendLead(nextAnswers, finalResult);
    window.setTimeout(() => setStage("result"), 1500);
  }

  function goBack() {
    if (questionIndex === 0) {
      setStage("lead");
      return;
    }
    setQuestionIndex((current) => current - 1);
  }

  function restart() {
    setStage("intro");
    setQuestionIndex(0);
    setAnswers([]);
    setResultKey("gestao");
  }

  const whatsappText = encodeURIComponent(
    `Olá! Meu nome é ${lead.name}. Fiz o teste vocacional da Evolutec e meu perfil foi ${result.name}. Quero saber mais sobre os cursos recomendados.`
  );

  if (stage === "intro") {
    return (
      <main className="site-shell">
        <div className="ambient ambient-one" /><div className="ambient ambient-two" />
        <TopLogo />
        <section className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Seu futuro começa com uma escolha</p>
            <h1>Descubra o caminho profissional que <span>combina com você.</span></h1>
            <p className="hero-subtitle">Um teste rápido, direto e feito para revelar seus pontos fortes e os cursos que mais têm a ver com o seu perfil.</p>
            <div className="benefit-row" aria-label="Características do teste">
              <div><Clock3 size={20} /><span><strong>3 minutos</strong> para responder</span></div>
              <div><BrainCircuit size={20} /><span><strong>12 perguntas</strong> personalizadas</span></div>
            </div>
            <JourneyCounter />
            <button className="primary-cta" type="button" onClick={() => setStage("lead")}>Começar meu teste <ArrowRight size={20} /></button>
            <p className="privacy-note">Resultado imediato • Seus dados ficam protegidos</p>
          </div>
          <div className="journey-card" aria-hidden="true">
            <div className="journey-topline"><span>Mapa de possibilidades</span><strong>12 passos</strong></div>
            <div className="radar-stage">
              <div className="radar-ring ring-one" /><div className="radar-ring ring-two" /><div className="radar-ring ring-three" />
              <div className="radar-core"><Sparkles size={25} /><span>Seu perfil</span></div>
              <span className="profile-chip chip-a">Criatividade</span><span className="profile-chip chip-b">Tecnologia</span>
              <span className="profile-chip chip-c">Comunicação</span><span className="profile-chip chip-d">Estratégia</span>
            </div>
            <div className="journey-footer"><span>Você responde</span><i /><span>O perfil é analisado</span><i /><span>O caminho aparece</span></div>
          </div>
        </section>
      </main>
    );
  }

  if (stage === "lead") {
    return (
      <main className="flow-shell">
        <div className="ambient ambient-one" /><div className="ambient ambient-two" />
        <TopLogo />
        <section className="lead-stage enter-animation">
          <button className="back-link" onClick={() => setStage("intro")}><ArrowLeft size={17} /> Voltar</button>
          <div className="lead-card">
            <div className="lead-visual">
              <span className="step-pill">Antes de começar</span>
              <h1>Seu resultado será feito para <span>você.</span></h1>
              <p>Preencha apenas seus dados de contato. Ao concluir as 12 respostas, seu perfil aparece na hora.</p>
              <div className="mini-proof"><ShieldCheck size={19} /><span>Seus dados serão usados para apresentar cursos compatíveis com seu resultado.</span></div>
            </div>
            <form className="lead-form" onSubmit={handleLeadSubmit} noValidate>
              <label htmlFor="isStudent">Você já é aluno da Evolutec?</label>
              <select id="isStudent" name="isStudent" value={lead.isStudent} onChange={(e) => setLead({ ...lead, isStudent: e.target.value })} autoFocus required>
                <option value="" disabled>Selecione uma opção</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
              <label htmlFor="name">Como podemos te chamar?</label>
              <input id="name" name="name" autoComplete="name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} placeholder="Digite seu nome" />
              <label htmlFor="phone">Qual é o seu WhatsApp?</label>
              <input id="phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: formatPhone(e.target.value) })} placeholder="(91) 99999-9999" />
              {leadError && <p className="form-error" role="alert">{leadError}</p>}
              <button className="primary-cta form-cta" type="submit">Ir para as perguntas <ArrowRight size={20} /></button>
              <p className="consent-copy">Ao continuar, você concorda com o uso dos dados para contato educacional da Evolutec.</p>
            </form>
          </div>
        </section>
      </main>
    );
  }

  if (stage === "quiz") {
    const question = questions[questionIndex];
    const progress = ((questionIndex + 1) / questions.length) * 100;
    const encouragementIndex = Math.min(Math.floor(questionIndex / 3), encouragement.length - 1);
    return (
      <main className="flow-shell quiz-shell">
        <div className="ambient ambient-one" /><div className="ambient ambient-two" />
        <TopLogo />
        <section className="quiz-stage enter-animation" key={questionIndex}>
          <div className="quiz-progress-copy">
            <span>Pergunta <strong>{questionIndex + 1}</strong> de {questions.length}</span>
            <span>{encouragement[encouragementIndex]}</span>
          </div>
          <div className="quiz-progress" role="progressbar" aria-label={`${Math.round(progress)}% concluído`} aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="question-card">
            <div className="question-kicker"><Sparkles size={15} /> Escolha a opção mais parecida com você</div>
            <h1>{question.title}</h1>
            <div className="answer-list" role="radiogroup" aria-label={question.title}>
              {question.answers.map((answer, index) => {
                const selected = answers[questionIndex] === answer.profile;
                return (
                  <button key={`${questionIndex}-${answer.profile}`} type="button" role="radio" aria-checked={selected} className={`answer-button ${selected ? "selected" : ""}`} onClick={() => selectAnswer(answer.profile)}>
                    <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                    <span>{answer.text}</span>
                    <ChevronRight className="answer-arrow" size={20} />
                  </button>
                );
              })}
            </div>
            <button className="back-link question-back" onClick={goBack}><ArrowLeft size={17} /> Pergunta anterior</button>
          </div>
        </section>
      </main>
    );
  }

  if (stage === "loading") {
    return (
      <main className="flow-shell loading-shell">
        <TopLogo />
        <section className="loading-card" aria-live="polite">
          <div className="loader-orbit"><LoaderCircle size={46} /></div>
          <p>Analisando suas respostas</p>
          <h1>Estamos encontrando o caminho que mais combina com você...</h1>
          <div className="loading-points"><span className="active" /><span /><span /></div>
        </section>
      </main>
    );
  }

  const ResultIcon = result.icon;
  const maxScore = Math.max(...Object.values(scores), 1);
  const rankedProfiles = (Object.entries(scores) as [ProfileKey, number][]).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <main className="result-shell">
      <div className="confetti confetti-a" /><div className="confetti confetti-b" /><div className="confetti confetti-c" />
      <TopLogo />
      <section className="result-stage enter-animation">
        <div className="celebration-mark"><Check size={28} /></div>
        <p className="eyebrow result-eyebrow">Teste concluído</p>
        <h1>Parabéns, {lead.name.split(" ")[0]}! Seu futuro ganhou uma nova direção.</h1>
        <p className="result-intro">Suas respostas revelaram um perfil com forte conexão em:</p>

        <div className="result-main-card" style={{ "--profile-color": result.color } as React.CSSProperties}>
          <div className="result-profile-head">
            <div className="result-icon"><ResultIcon size={31} /></div>
            <div><span>Seu perfil principal</span><h2>{result.name}</h2><p>{result.short}</p></div>
          </div>
          <p className="result-description">{result.description}</p>
          <div className="profile-bars" aria-label="Principais afinidades">
            {rankedProfiles.map(([key, score]) => (
              <div className="profile-bar" key={key}>
                <div><span>{profileData[key].name}</span><strong>{Math.round((score / questions.length) * 100)}%</strong></div>
                <span className="profile-track"><i style={{ width: `${Math.max(18, (score / maxScore) * 100)}%`, background: profileData[key].color }} /></span>
              </div>
            ))}
          </div>
        </div>

        <div className="courses-section">
          <div className="section-heading"><span><Target size={17} /> Cursos que combinam com você</span><h2>Formações da Evolutec que combinam com o seu perfil</h2></div>
          <div className="course-grid">
            {result.courses.map((course, index) => (
              <article className="course-card" key={course.name}>
                <span className="course-number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{course.name}</h3><p>{course.description}</p>
                <span className="course-fit"><Check size={14} /> Recomendado para seu perfil</span>
              </article>
            ))}
          </div>
        </div>

        <div className="result-cta-card">
          <div><span className="step-pill">Próximo passo</span><h2>Converse com a Evolutec e escolha o melhor curso para você.</h2><p>Nossa equipe pode explicar cada formação, horários e oportunidades disponíveis.</p></div>
          <a className="whatsapp-button" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`} target="_blank" rel="noreferrer"><MessageCircle size={22} /> Falar no WhatsApp</a>
        </div>
        <button className="restart-button" onClick={restart}><RefreshCw size={16} /> Fazer o teste novamente</button>
      </section>
    </main>
  );
}
