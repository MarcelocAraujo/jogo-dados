import { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import Dado from './Dado';

const TOTAL_RODADAS = 5;

function rolarDado() {
  return Math.floor(Math.random() * 6) + 1;
}

function DadoOuVazio({ valor }) {
  if (valor === null) {
    return (
      <Image
        source={require('../assets/dados/vazio.png')}
        style={styles.dadoVazio}
        accessibilityLabel="Dado não jogado"
      />
    );
  }
  return <Dado valor={valor} />;
}

function Botao({ titulo, onPress, disabled, destaque }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.botao,
        destaque && styles.botaoDestaque,
        disabled && styles.botaoDesabilitado,
        pressed && !disabled && styles.botaoPressionado,
      ]}
    >
      <Text style={[styles.textoBotao, destaque && styles.textoBotaoDestaque]}>
        {titulo}
      </Text>
    </Pressable>
  );
}

export default function JogoDados() {
  const [rodada, setRodada] = useState(1);
  const [dados1, setDados1] = useState([null, null]);
  const [dados2, setDados2] = useState([null, null]);
  const [turno, setTurno] = useState('jogador1');
  const [mensagem, setMensagem] = useState('Jogador 1, jogue os dados!');
  const [placar, setPlacar] = useState({ jogador1: 0, jogador2: 0, empates: 0 });
  const [jogoFinalizado, setJogoFinalizado] = useState(false);

  const reiniciar = () => {
    setRodada(1);
    setDados1([null, null]);
    setDados2([null, null]);
    setTurno('jogador1');
    setMensagem('Jogador 1, jogue os dados!');
    setPlacar({ jogador1: 0, jogador2: 0, empates: 0 });
    setJogoFinalizado(false);
  };

  const jogarJogador1 = () => {
    setDados1([rolarDado(), rolarDado()]);
    setDados2([null, null]);
    setTurno('jogador2');
    setMensagem('Jogador 2, jogue os dados!');
  };

  const jogarJogador2 = () => {
    const a = rolarDado();
    const b = rolarDado();
    setDados2([a, b]);

    const soma1 = dados1[0] + dados1[1];
    const soma2 = a + b;
    const novoPlacar = { ...placar };
    let msg;

    if (soma1 > soma2) {
      msg = 'Jogador 1 venceu';
      novoPlacar.jogador1 += 1;
    } else if (soma2 > soma1) {
      msg = 'Jogador 2 venceu';
      novoPlacar.jogador2 += 1;
    } else {
      msg = 'Empate';
      novoPlacar.empates += 1;
    }
    setPlacar(novoPlacar);

    if (rodada === TOTAL_RODADAS) {
      let msgFinal;
      if (novoPlacar.jogador1 > novoPlacar.jogador2) msgFinal = 'Jogador 1 venceu a partida!';
      else if (novoPlacar.jogador2 > novoPlacar.jogador1) msgFinal = 'Jogador 2 venceu a partida!';
      else msgFinal = 'Empate geral!';
      setMensagem(`${msg} na rodada. ${msgFinal}`);
      setJogoFinalizado(true);
      setTurno(null);
    } else {
      setMensagem(`${msg} a rodada ${rodada}`.replace('Empate a', 'Empate na'));
      setRodada(rodada + 1);
      setTurno('jogador1');
    }
  };

  const soma = (d) => (d[0] === null ? '–' : d[0] + d[1]);

  const Jogador = ({ nome, dados, ativo, onJogar }) => (
    <View style={[styles.jogador, ativo && styles.jogadorAtivo]}>
      <Text style={styles.nomeJogador}>{nome}</Text>
      <View style={styles.dados}>
        <DadoOuVazio valor={dados[0]} />
        <DadoOuVazio valor={dados[1]} />
      </View>
      <Text style={styles.soma}>Soma: {soma(dados)}</Text>
      <Botao titulo="Jogar" onPress={onJogar} disabled={!ativo} />
    </View>
  );

  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>Jogo de Dados</Text>

      <Text style={styles.rodada}>
        Rodada <Text style={styles.negrito}>{rodada}</Text>/{TOTAL_RODADAS}
      </Text>

      <View style={styles.placar}>
        <Text style={styles.placarItem}>J1: <Text style={styles.negrito}>{placar.jogador1}</Text></Text>
        <Text style={styles.placarItem}>Empates: <Text style={styles.negrito}>{placar.empates}</Text></Text>
        <Text style={styles.placarItem}>J2: <Text style={styles.negrito}>{placar.jogador2}</Text></Text>
      </View>

      <View style={styles.jogadores}>
        <Jogador
          nome="Jogador 1"
          dados={dados1}
          ativo={turno === 'jogador1' && !jogoFinalizado}
          onJogar={jogarJogador1}
        />
        <View style={styles.divisor} />
        <Jogador
          nome="Jogador 2"
          dados={dados2}
          ativo={turno === 'jogador2' && !jogoFinalizado}
          onJogar={jogarJogador2}
        />
      </View>

      <View style={[styles.mensagem, jogoFinalizado && styles.mensagemFinal]}>
        <Text style={styles.textoMensagem}>{mensagem}</Text>
      </View>

      {jogoFinalizado && (
        <Botao titulo="Jogar Novamente" onPress={reiniciar} destaque />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#161b26',
    borderWidth: 1,
    borderColor: '#2a3142',
    borderRadius: 20,
    padding: 22,
    gap: 18,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  titulo: { fontSize: 24, fontWeight: '700', textAlign: 'center', color: '#f3f4f6' },
  rodada: { textAlign: 'center', color: '#9ca3af', fontSize: 16 },
  negrito: { fontWeight: '700', color: '#f3f4f6' },
  placar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0f131b',
    borderRadius: 12,
    paddingVertical: 8,
  },
  placarItem: { color: '#9ca3af', fontSize: 14 },
  jogadores: { flexDirection: 'row', alignItems: 'stretch' },
  jogador: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  jogadorAtivo: { backgroundColor: '#1e2535', borderColor: '#3b82f6' },
  nomeJogador: { fontSize: 16, fontWeight: '600', color: '#e5e7eb' },
  dados: { flexDirection: 'row', gap: 6 },
  dadoVazio: { width: 64, height: 64 },
  soma: { color: '#9ca3af', fontSize: 13 },
  divisor: { width: 1, backgroundColor: '#2a3142', marginHorizontal: 8 },
  botao: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignSelf: 'center',
    backgroundColor: '#3b82f6',
  },
  botaoPressionado: { backgroundColor: '#2563eb' },
  botaoDesabilitado: { backgroundColor: '#2a3142', opacity: 0.6 },
  botaoDestaque: { backgroundColor: '#22c55e', paddingVertical: 10 },
  textoBotao: { fontSize: 15, fontWeight: '600', color: '#ffffff' },
  textoBotaoDestaque: { color: '#0f131b', fontWeight: '700' },
  mensagem: {
    borderWidth: 1,
    borderColor: '#2a3142',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#0f131b',
  },
  mensagemFinal: { borderColor: '#22c55e' },
  textoMensagem: { textAlign: 'center', fontWeight: '600', fontSize: 15, color: '#f3f4f6' },
});
